import regeneratorRuntime from "regenerator-runtime";

const DEBUG = process.env.DEBUG === true;

const debugPrint = (...toPrint) => {
  return DEBUG ? console.log(toPrint) : null;
};

const createGntc = (props) => {
  const {
    list,
    options,
    populationSize,
    iterations,
    utilities,
    select,
    loader,
    startingSolution
  } = props;

  let population = [];
  let best = { score: -1, choice: startingSolution };

  const initialise = () => {
    population = Array(populationSize)
      .fill(0)
      .map(() => startingSolution ? createStartingSolution() : createSeed());
  };

  const createSeed = () => {
    const choice = utilities.generateChoice(select, options || list);
    return { score: utilities.fitness(choice, startingSolution), choice };
  };

  const createStartingSolution = () => {
    const choice = startingSolution;
    return { score: utilities.fitness(choice, startingSolution), choice };
  };

  const iteration = (i) => {
    if (DEBUG && i % 100 === 0) loader(i);

    population.forEach(solution => {
      solution.score = utilities.fitness(solution.choice, startingSolution);
      if (utilities.restrictions && utilities.restrictions.map(restriction => restriction(solution.choice)).some(res => res === false)) {
        solution.score = 0;
      }
    });

    population.sort((a, b) => b.score - a.score);
    if (best.score < population[0].score) {
      best = { score: population[0].score, choice: population[0].choice };
      debugPrint("NEW BEST -> ", best.score, best.choice);
    }
    population = evolve(population);
  };

  const evolve = (population) => {
    return population.map((solution, i) => {
      const chance = Math.random();
      if (i > population.length / 4) {
        if (chance > 0.9) {
          return mutate(solution);
        }
        if (chance > 0.7) {
          return crossover(solution, createSeed());
        }
        if (chance > 0.3) {
          const solution2 = population[Math.floor(Math.abs(Math.random() - Math.random()) * population.length)];
          return crossover(solution, solution2);
        }
      }
      return solution;
    });
  };

  const mutate = (solution) => {
    return utilities.mutate ? utilities.mutate(solution) : createSeed();
  };

  const crossover = (solution1, solution2) => {
    return utilities.crossover ? utilities.crossover(solution1, solution2) : solution1;
  };

  const runIterations = function* () {
    initialise();
    for (let i = 0; i < iterations; i++) {
      iteration(i);
      yield { progress: i / iterations };
    }
    return best;
  };

  return runIterations;
}

export { createGntc };
