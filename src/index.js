const envDebug =
  typeof process !== "undefined" && process.env ? process.env.DEBUG : undefined;

const DEBUG =
  typeof envDebug === "string"
    ? envDebug.toLowerCase() === "true"
    : Boolean(envDebug);

const getRandomElements = (arr, numElements) => {
  const shuffled = arr.slice(); // Copy the array
  let i = arr.length, temp, index;

  // Shuffle array using the Fisher-Yates shuffle algorithm
  while (i--) {
    index = Math.floor(Math.random() * (i + 1));
    temp = shuffled[i];
    shuffled[i] = shuffled[index];
    shuffled[index] = temp;
  }

  const pick = shuffled.slice(0, numElements);
  pick.sort((a,b) => b - a)

  return pick
}

const defaultFitness = (choice) => {
  return choice?.reduce((acc, x) => acc + x, 0) || choice
}

const defaultGenerateChoice = (select, candidates) => {
  const pick = getRandomElements(candidates, select)
  return pick
}

const createGntc = (props) => {
  const {
    utilities: {
      fitness = defaultFitness,
      crossover,
      mutate,
      generateChoice = defaultGenerateChoice,
      restrictions
    } = {},
    candidates,
    select,
    config: {
      populationSize,
      iterations,
    },
    loader,
    seed,
  } = props;

  let population = [];
  let best = { score: -1, choice: seed };

  const initialise = () => {
    population = Array(populationSize)
      .fill(0)
      .map(() => seed ? createStartingSolution() : createSeed());
  };

  const mutateSolution = (solution) => {
    return mutate ? mutate(solution) : createSeed();
  };

  const crossoverSolutions = (solution1, solution2) => {
    return crossover ? crossover(solution1, solution2) : solution1;
  };

  const evolvePopulation = (population) => {
    return population.map((solution, i) => {
      const chance = Math.random();
      if (i > population.length / 4) {
        if (chance > 0.9) {
          return mutateSolution(solution);
        }
        if (chance > 0.7) {
          return crossoverSolutions(solution, createSeed());
        }
        if (chance > 0.3) {
          const solution2 = population[Math.floor(Math.abs(Math.random() - Math.random()) * population.length)];
          return crossoverSolutions(solution, solution2);
        }
      }
      return solution;
    });
  };

  const createSeed = () => {
    const choice = generateChoice(select, candidates);
    const score = fitness(choice, seed);
    return { score, choice };
  };

  const createStartingSolution = () => {
    const choice = seed;
    const score = fitness(choice, seed);
    return { score, choice };
  };

  const iteration = (i) => {
    if (DEBUG && typeof loader === "function" && i % 100 === 0) {
      loader(i);
    }

    population.forEach(solution => {
      solution.score = fitness(solution.choice, seed);

      if (restrictions && restrictions.map(restriction => restriction(solution.choice)).some(res => res === false)) {
        solution.score = 0;
      }
    });

    population.sort((a, b) => b.score - a.score);

    if (best.score < population[0].score) {
      best = { 
        score: population[0].score, 
        choice: population[0].choice 
      };

      debugPrint("NEW BEST -> ", best.score, best.choice);
    }

    population = evolvePopulation(population);
  };

  const runIterations = function* () {
    initialise();

    for (let i = 0; i < iterations; i++) {
      iteration(i);
      yield { 
        progress: i / iterations,
        best,
        population,
      };
    }

    return {
      progress: 1,
      best,
      population,
    };
  };

  return runIterations;
}

export { createGntc };
