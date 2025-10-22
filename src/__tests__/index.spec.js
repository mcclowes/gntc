const drainGenerator = (generator) => {
  let result = generator.next();

  while (!result.done) {
    result = generator.next();
  }

  return result.value;
};

describe('createGntc', () => {
  let originalDebug;

  beforeEach(() => {
    originalDebug = process.env.DEBUG;
    jest.resetModules();
  });

  afterEach(() => {
    if (originalDebug === undefined) {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = originalDebug;
    }

    jest.restoreAllMocks();
  });

  it('selects the highest scoring choice using custom utilities', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const generateChoice = jest
      .fn()
      .mockReturnValueOnce([1, 1])
      .mockReturnValueOnce([2, 2])
      .mockReturnValueOnce([3, 3]);

    const { createGntc } = await import('../index.js');

    const config = {
      candidates: ['ignored'],
      select: 2,
      utilities: {
        generateChoice,
        fitness: (choice) => choice.reduce((total, value) => total + value, 0),
      },
      config: {
        populationSize: 3,
        iterations: 1,
      },
    };

    const iterator = createGntc(config)();
    const finalState = drainGenerator(iterator);

    expect(generateChoice).toHaveBeenCalledTimes(3);
    expect(finalState.best.score).toBe(6);
    expect(finalState.best.choice).toEqual([3, 3]);
  });

  it('applies restrictions by zeroing invalid solution scores', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const restriction = jest.fn((choice) => choice[0] < 5);
    const generateChoice = jest
      .fn()
      .mockReturnValueOnce([5])
      .mockReturnValueOnce([1]);

    const { createGntc } = await import('../index.js');

    const config = {
      select: 1,
      utilities: {
        generateChoice,
        fitness: (choice) => choice[0],
        restrictions: [restriction],
      },
      config: {
        populationSize: 2,
        iterations: 1,
      },
    };

    const iterator = createGntc(config)();
    const finalState = drainGenerator(iterator);

    expect(restriction).toHaveBeenCalled();
    expect(finalState.best.score).toBe(1);
    expect(finalState.best.choice).toEqual([1]);
  });

  it('initialises the population from a provided seed', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const seed = [1, 2];
    const generateChoice = jest.fn();

    const { createGntc } = await import('../index.js');

    const config = {
      select: 2,
      seed,
      utilities: {
        generateChoice,
        fitness: (choice) => choice.reduce((total, value) => total + value, 0),
      },
      config: {
        populationSize: 2,
        iterations: 1,
      },
    };

    const iterator = createGntc(config)();
    const finalState = drainGenerator(iterator);

    expect(generateChoice).not.toHaveBeenCalled();
    expect(finalState.best.score).toBe(3);
    expect(finalState.best.choice).toBe(seed);
    expect(finalState.population.every((solution) => solution.choice === seed)).toBe(true);
  });

  it('invokes the loader on debug iterations when DEBUG is enabled', async () => {
    process.env.DEBUG = 'true';
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const loader = jest.fn();

    const { createGntc } = await import('../index.js');

    const config = {
      select: 1,
      utilities: {
        generateChoice: () => [1],
        fitness: () => 1,
      },
      loader,
      config: {
        populationSize: 1,
        iterations: 205,
      },
    };

    const iterator = createGntc(config)();
    drainGenerator(iterator);

    expect(loader).toHaveBeenCalledTimes(3);
    expect(loader).toHaveBeenNthCalledWith(1, 0);
    expect(loader).toHaveBeenNthCalledWith(2, 100);
    expect(loader).toHaveBeenNthCalledWith(3, 200);
  });
});

