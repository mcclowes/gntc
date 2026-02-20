const envDebug = typeof process !== 'undefined' && process.env ? process.env.DEBUG : undefined;

const DEBUG = typeof envDebug === 'string' ? envDebug.toLowerCase() === 'true' : Boolean(envDebug);

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
  let i = arr.length,
    temp,
    index;

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

// Default genetic algorithm configuration constants
const DEFAULT_ELITE_RATIO = 0.25; // Top 25% of population preserved unchanged
const DEFAULT_MUTATION_RATE = 0.1; // 10% chance of mutation
const DEFAULT_CROSSOVER_RATE = 0.6; // 60% chance of crossover (20% with random + 40% with population)
const DEBUG_LOG_INTERVAL = 100; // Log every 100 iterations when DEBUG is enabled

/**
 * Validates the configuration object and throws descriptive errors for invalid inputs
 * @param {Object} props - Configuration object to validate
 * @throws {Error} If required fields are missing or invalid
 */
const validateConfig = (props) => {
  if (!props || typeof props !== 'object') {
    throw new Error('gntc: config object is required');
  }

  const { select, config, candidates, utilities } = props;

  // Validate select
  if (select === undefined || select === null) {
    throw new Error('gntc: "select" is required - specify how many items to include in each solution');
  }
  if (typeof select !== 'number' || !Number.isFinite(select)) {
    throw new Error(`gntc: "select" must be a finite number, received ${typeof select}`);
  }
  if (select < 1) {
    throw new Error(`gntc: "select" must be at least 1, received ${select}`);
  }

  // Validate config object
  if (!config || typeof config !== 'object') {
    throw new Error('gntc: "config" object is required with populationSize and iterations');
  }

  const { populationSize, iterations } = config;

  // Validate populationSize
  if (populationSize === undefined || populationSize === null) {
    throw new Error('gntc: "config.populationSize" is required');
  }
  if (typeof populationSize !== 'number' || !Number.isFinite(populationSize)) {
    throw new Error(`gntc: "config.populationSize" must be a finite number, received ${typeof populationSize}`);
  }
  if (populationSize < 1) {
    throw new Error(`gntc: "config.populationSize" must be at least 1, received ${populationSize}`);
  }

  // Validate iterations
  if (iterations === undefined || iterations === null) {
    throw new Error('gntc: "config.iterations" is required');
  }
  if (typeof iterations !== 'number' || !Number.isFinite(iterations)) {
    throw new Error(`gntc: "config.iterations" must be a finite number, received ${typeof iterations}`);
  }
  if (iterations < 1) {
    throw new Error(`gntc: "config.iterations" must be at least 1, received ${iterations}`);
  }

  // Validate candidates/generateChoice relationship
  const hasCustomGenerateChoice = utilities?.generateChoice && typeof utilities.generateChoice === 'function';
  if (!hasCustomGenerateChoice && (!candidates || !Array.isArray(candidates) || candidates.length === 0)) {
    throw new Error(
      'gntc: "candidates" array is required when not providing a custom generateChoice utility. ' +
        'Either provide candidates or implement utilities.generateChoice.'
    );
  }

  // Validate select doesn't exceed candidates (when using default generateChoice)
  if (!hasCustomGenerateChoice && candidates && select > candidates.length) {
    throw new Error(
      `gntc: "select" (${select}) cannot exceed candidates length (${candidates.length})`
    );
  }

  // Validate optional rate parameters
  const { eliteRatio, mutationRate, crossoverRate } = config;

  if (eliteRatio !== undefined) {
    if (typeof eliteRatio !== 'number' || !Number.isFinite(eliteRatio)) {
      throw new Error(`gntc: "config.eliteRatio" must be a finite number, received ${typeof eliteRatio}`);
    }
    if (eliteRatio < 0 || eliteRatio > 1) {
      throw new Error(`gntc: "config.eliteRatio" must be between 0 and 1, received ${eliteRatio}`);
    }
  }

  if (mutationRate !== undefined) {
    if (typeof mutationRate !== 'number' || !Number.isFinite(mutationRate)) {
      throw new Error(`gntc: "config.mutationRate" must be a finite number, received ${typeof mutationRate}`);
    }
    if (mutationRate < 0 || mutationRate > 1) {
      throw new Error(`gntc: "config.mutationRate" must be between 0 and 1, received ${mutationRate}`);
    }
  }

  if (crossoverRate !== undefined) {
    if (typeof crossoverRate !== 'number' || !Number.isFinite(crossoverRate)) {
      throw new Error(`gntc: "config.crossoverRate" must be a finite number, received ${typeof crossoverRate}`);
    }
    if (crossoverRate < 0 || crossoverRate > 1) {
      throw new Error(`gntc: "config.crossoverRate" must be between 0 and 1, received ${crossoverRate}`);
    }
  }
};

/**
 * Creates a genetic algorithm generator function
 * @param {Object} props - Configuration object
 * @param {Array} [props.candidates] - Pool of candidates to select from
 * @param {number} props.select - Number of items to select for each solution
 * @param {Object} props.config - Algorithm configuration
 * @param {number} props.config.populationSize - Size of the population for each generation
 * @param {number} props.config.iterations - Number of generations to evolve
 * @param {number} [props.config.eliteRatio=0.25] - Fraction of top solutions preserved each generation (0-1)
 * @param {number} [props.config.mutationRate=0.1] - Probability of mutation for non-elite solutions (0-1)
 * @param {number} [props.config.crossoverRate=0.6] - Probability of crossover for non-elite solutions (0-1)
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
  validateConfig(props);

  const {
    utilities: {
      fitness = defaultFitness,
      crossover,
      mutate,
      generateChoice = defaultGenerateChoice,
      restrictions,
    } = {},
    candidates,
    select,
    config: {
      populationSize,
      iterations,
      eliteRatio = DEFAULT_ELITE_RATIO,
      mutationRate = DEFAULT_MUTATION_RATE,
      crossoverRate = DEFAULT_CROSSOVER_RATE,
    },
    loader,
    seed,
  } = props;

  let population = [];
  let best = { score: -1, choice: seed };

  const initialise = () => {
    population = Array(populationSize)
      .fill(0)
      .map(() => (seed ? createStartingSolution() : createSeed()));
  };

  const mutateSolution = (solution) => {
    return mutate ? mutate(solution) : createSeed();
  };

  const crossoverSolutions = (solution1, solution2) => {
    return crossover ? crossover(solution1, solution2) : solution1;
  };

  const evolvePopulation = (population) => {
    const eliteSize = Math.floor(population.length * eliteRatio);
    // Split crossover rate: 1/3 with random, 2/3 with population member
    const crossoverWithRandomThreshold = mutationRate + crossoverRate * 0.33;
    const crossoverWithPopulationThreshold = mutationRate + crossoverRate;

    return population.map((solution, i) => {
      // Preserve elite solutions (top performers), evolve the rest
      if (i >= eliteSize) {
        const chance = Math.random();
        if (chance < mutationRate) {
          return mutateSolution(solution);
        }
        if (chance < crossoverWithRandomThreshold) {
          return crossoverSolutions(solution, createSeed());
        }
        if (chance < crossoverWithPopulationThreshold) {
          // Select partner biased towards higher-ranked solutions
          const solution2 =
            population[Math.floor(Math.abs(Math.random() - Math.random()) * population.length)];
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

    population.forEach((solution) => {
      solution.score = fitness(solution.choice, seed);

      if (
        restrictions &&
        restrictions.map((restriction) => restriction(solution.choice)).some((res) => res === false)
      ) {
        solution.score = 0;
      }
    });

    population.sort((a, b) => b.score - a.score);

    if (best.score < population[0].score) {
      best = {
        score: population[0].score,
        choice: population[0].choice,
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
