const envDebug =
  typeof process !== 'undefined' && process.env ? process.env.DEBUG : undefined;

const DEBUG =
  typeof envDebug === 'string'
    ? envDebug.toLowerCase() === 'true'
    : Boolean(envDebug);

/**
 * Prints debug messages to console when DEBUG mode is enabled
 * @param {...any} args - Arguments to log to console
 */
const debugPrint = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

/**
 * Randomly selects a specified number of elements from an array using Fisher-Yates shuffle
 * @param {Array} arr - Source array to select from
 * @param {number} numElements - Number of elements to select
 * @returns {Array} Array of randomly selected elements
 */
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
  pick.sort((a, b) => b - a);

  return pick;
};

/**
 * Default fitness function that sums numeric values in a choice
 * @param {Array} choice - Array of values to evaluate
 * @returns {number} Sum of all values in the choice
 */
const defaultFitness = (choice) => {
  return choice?.reduce((acc, x) => acc + x, 0) || choice;
};

/**
 * Default choice generation function that randomly selects candidates
 * @param {number} select - Number of candidates to select
 * @param {Array} candidates - Pool of available candidates
 * @returns {Array} Randomly selected and sorted candidates
 */
const defaultGenerateChoice = (select, candidates) => {
  const pick = getRandomElements(candidates, select);
  return pick;
};

// Genetic algorithm configuration constants
const ELITE_POPULATION_RATIO = 0.25; // Top 25% of population preserved
const MUTATION_PROBABILITY = 0.9; // 10% chance of mutation
const CROSSOVER_WITH_RANDOM_PROBABILITY = 0.7; // 20% chance of crossover with random
const CROSSOVER_WITH_POPULATION_PROBABILITY = 0.3; // 40% chance of crossover with population member
const DEBUG_LOG_INTERVAL = 100; // Log every 100 iterations when DEBUG is enabled

/**
 * Creates a genetic algorithm generator function
 * @param {Object} props - Configuration object
 * @param {Array} [props.candidates] - Pool of candidates to select from
 * @param {number} props.select - Number of items to select for each solution
 * @param {Object} props.config - Algorithm configuration
 * @param {number} props.config.populationSize - Size of the population for each generation
 * @param {number} props.config.iterations - Number of generations to evolve
 * @param {any} [props.seed] - Optional initial solution to seed the population
 * @param {Function} [props.loader] - Optional function called periodically during execution (when DEBUG=true)
 * @param {Object} [props.utilities] - Custom utility functions
 * @param {Function} [props.utilities.fitness] - Custom fitness evaluation function
 * @param {Function} [props.utilities.crossover] - Custom crossover function for combining solutions
 * @param {Function} [props.utilities.mutate] - Custom mutation function for evolving solutions
 * @param {Function} [props.utilities.generateChoice] - Custom choice generation function
 * @param {Array<Function>} [props.utilities.restrictions] - Array of validation functions for solutions
 * @returns {Function} Generator function that yields algorithm state at each iteration
 *
 * @example
 * const run = createGntc({
 *   candidates: [1, 2, 3, 4, 5],
 *   select: 2,
 *   config: { populationSize: 10, iterations: 100 }
 * });
 *
 * const iterator = run();
 * for (let state of iterator) {
 *   console.log(`Progress: ${state.progress * 100}%`);
 *   console.log(`Best score: ${state.best.score}`);
 * }
 */
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
    const eliteSize = Math.floor(population.length * ELITE_POPULATION_RATIO);
    return population.map((solution, i) => {
      const chance = Math.random();
      // Preserve elite solutions, evolve the rest
      if (i > eliteSize) {
        if (chance > MUTATION_PROBABILITY) {
          return mutateSolution(solution);
        }
        if (chance > CROSSOVER_WITH_RANDOM_PROBABILITY) {
          return crossoverSolutions(solution, createSeed());
        }
        if (chance > CROSSOVER_WITH_POPULATION_PROBABILITY) {
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
    if (DEBUG && typeof loader === 'function' && i % DEBUG_LOG_INTERVAL === 0) {
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

      debugPrint('NEW BEST -> ', best.score, best.choice);
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
};

export { createGntc };
