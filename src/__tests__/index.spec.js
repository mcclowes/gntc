import "regenerator-runtime/runtime";

const finishGenerator = (iterator, initialState) => {
  let state = initialState ?? iterator.next();

  while (!state.done) {
    state = iterator.next();
  }

  return state.value;
};

const runToCompletion = (generatorFactory) => {
  const iterator = generatorFactory();
  return finishGenerator(iterator);
};

const loadCreateGntc = ({ reset = false } = {}) => {
  if (reset) {
    jest.resetModules();
  }

  // Using require keeps the tests synchronous and works with the current Babel config
  return require("../index").createGntc;
};

describe("createGntc", () => {
  beforeEach(() => {
    global.debugPrint = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the seeded solution as the best result and reports progress", () => {
    const createGntc = loadCreateGntc({ reset: true });

    const config = {
      candidates: [1, 2, 3, 4, 5],
      select: 2,
      seed: [5, 4],
      config: {
        populationSize: 4,
        iterations: 3,
      },
    };

    const generatorFactory = createGntc(config);
    const iterator = generatorFactory();

    const firstState = iterator.next();
    expect(firstState.done).toBe(false);
    expect(firstState.value.progress).toBe(0);
    expect(firstState.value.best.choice).toEqual([5, 4]);

    const finalState = finishGenerator(iterator, firstState);

    expect(finalState.progress).toBe(1);
    expect(finalState.best.score).toBe(9);
    expect(finalState.best.choice).toEqual([5, 4]);
    expect(finalState.population).toHaveLength(config.config.populationSize);
  });

  it("applies restrictions when evaluating the population", () => {
    const createGntc = loadCreateGntc({ reset: true });

    jest.spyOn(Math, "random").mockReturnValue(0);

    const choicesQueue = [
      [1, 0],
      [1, 1],
    ];
    const initialChoiceCount = choicesQueue.length;

    const generateChoice = jest.fn(() => choicesQueue.shift());
    const fitness = (choice) => choice.reduce((total, value) => total + value, 0);
    const restrictions = [
      (choice) => !choice.includes(0),
    ];

    const config = {
      select: 2,
      utilities: {
        generateChoice,
        fitness,
        restrictions,
      },
      config: {
        populationSize: 2,
        iterations: 1,
      },
    };

    const finalState = runToCompletion(createGntc(config));

    expect(generateChoice).toHaveBeenCalledTimes(initialChoiceCount);
    expect(finalState.best.score).toBe(2);
    expect(finalState.best.choice).toEqual([1, 1]);
  });

  it("uses provided mutate and crossover utilities during evolution", () => {
    const createGntc = loadCreateGntc({ reset: true });

    const randomValues = [0, 0, 0.95, 0.8, 0, 0, 0, 0];
    jest
      .spyOn(Math, "random")
      .mockImplementation(() => (randomValues.length ? randomValues.shift() : 0));

    const choicesQueue = [[1], [2], [3], [4], [5]];
    const generateChoice = jest.fn(() => choicesQueue.shift());
    const fitness = (choice) => choice.reduce((total, value) => total + value, 0);
    const mutate = jest.fn(() => ({ choice: [50], score: 50 }));
    const crossover = jest.fn((solution1, solution2) => ({
      choice: [solution1.choice[0], solution2.choice[0]],
      score: solution1.choice[0] + solution2.choice[0],
    }));

    const config = {
      select: 1,
      utilities: {
        generateChoice,
        fitness,
        mutate,
        crossover,
      },
      config: {
        populationSize: 4,
        iterations: 2,
      },
    };

    const finalState = runToCompletion(createGntc(config));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(crossover).toHaveBeenCalledTimes(1);
    expect(finalState.best.score).toBe(50);
    expect(finalState.best.choice).toEqual([50]);
  });

  it("invokes the loader callback when debug logging is enabled", () => {
    const originalDebug = process.env.DEBUG;
    process.env.DEBUG = "true";

    const createGntc = loadCreateGntc({ reset: true });

    try {
      jest.spyOn(Math, "random").mockReturnValue(0);

      const generateChoice = jest.fn(() => [1, 1]);
      const fitness = (choice) => choice.reduce((total, value) => total + value, 0);
      const loader = jest.fn();

      const config = {
        select: 2,
        utilities: {
          generateChoice,
          fitness,
        },
        loader,
        config: {
          populationSize: 2,
          iterations: 250,
        },
      };

      runToCompletion(createGntc(config));

      const iterationsReported = loader.mock.calls.map(([iteration]) => iteration);
      expect(iterationsReported).toEqual([0, 100, 200]);
    } finally {
      process.env.DEBUG = originalDebug;
      jest.resetModules();
    }
  });
});
