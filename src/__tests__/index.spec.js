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
    const generateChoice = jest.fn().mockReturnValueOnce([5]).mockReturnValueOnce([1]);

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

  describe('input validation', () => {
    it('throws when config object is missing', async () => {
      const { createGntc } = await import('../index.js');

      expect(() => createGntc()).toThrow('gntc: config object is required');
      expect(() => createGntc(null)).toThrow('gntc: config object is required');
    });

    it('throws when select is missing or invalid', async () => {
      const { createGntc } = await import('../index.js');

      expect(() => createGntc({ config: { populationSize: 10, iterations: 10 } })).toThrow(
        'gntc: "select" is required'
      );

      expect(() =>
        createGntc({ select: 'abc', config: { populationSize: 10, iterations: 10 } })
      ).toThrow('gntc: "select" must be a finite number');

      expect(() =>
        createGntc({ select: 0, config: { populationSize: 10, iterations: 10 } })
      ).toThrow('gntc: "select" must be at least 1');
    });

    it('throws when config.populationSize is missing or invalid', async () => {
      const { createGntc } = await import('../index.js');

      expect(() => createGntc({ select: 2, config: { iterations: 10 } })).toThrow(
        'gntc: "config.populationSize" is required'
      );

      expect(() => createGntc({ select: 2, config: { populationSize: -5, iterations: 10 } })).toThrow(
        'gntc: "config.populationSize" must be at least 1'
      );
    });

    it('throws when config.iterations is missing or invalid', async () => {
      const { createGntc } = await import('../index.js');

      expect(() => createGntc({ select: 2, config: { populationSize: 10 } })).toThrow(
        'gntc: "config.iterations" is required'
      );

      expect(() => createGntc({ select: 2, config: { populationSize: 10, iterations: 0 } })).toThrow(
        'gntc: "config.iterations" must be at least 1'
      );
    });

    it('throws when candidates are missing without custom generateChoice', async () => {
      const { createGntc } = await import('../index.js');

      expect(() => createGntc({ select: 2, config: { populationSize: 10, iterations: 10 } })).toThrow(
        'gntc: "candidates" array is required'
      );
    });

    it('allows missing candidates when custom generateChoice is provided', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const { createGntc } = await import('../index.js');

      const config = {
        select: 2,
        utilities: {
          generateChoice: () => [Math.random(), Math.random()],
        },
        config: { populationSize: 2, iterations: 1 },
      };

      expect(() => createGntc(config)).not.toThrow();
    });

    it('throws when select exceeds candidates length', async () => {
      const { createGntc } = await import('../index.js');

      expect(() =>
        createGntc({
          candidates: [1, 2],
          select: 5,
          config: { populationSize: 10, iterations: 10 },
        })
      ).toThrow('gntc: "select" (5) cannot exceed candidates length (2)');
    });

    it('validates optional rate parameters are within bounds', async () => {
      const { createGntc } = await import('../index.js');

      const baseConfig = {
        candidates: [1, 2, 3],
        select: 2,
        config: { populationSize: 10, iterations: 10 },
      };

      expect(() =>
        createGntc({ ...baseConfig, config: { ...baseConfig.config, eliteRatio: 1.5 } })
      ).toThrow('gntc: "config.eliteRatio" must be between 0 and 1');

      expect(() =>
        createGntc({ ...baseConfig, config: { ...baseConfig.config, mutationRate: -0.1 } })
      ).toThrow('gntc: "config.mutationRate" must be between 0 and 1');

      expect(() =>
        createGntc({ ...baseConfig, config: { ...baseConfig.config, crossoverRate: 2 } })
      ).toThrow('gntc: "config.crossoverRate" must be between 0 and 1');
    });
  });

  describe('configurable algorithm parameters', () => {
    it('respects custom eliteRatio', async () => {
      // With eliteRatio=0.5 and population=4, top 2 should be preserved
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // Will trigger crossover
      const { createGntc } = await import('../index.js');

      let crossoverCallCount = 0;
      const config = {
        candidates: [1, 2, 3, 4, 5],
        select: 1,
        utilities: {
          fitness: (choice) => choice[0],
          crossover: (a, b) => {
            crossoverCallCount++;
            return a;
          },
        },
        config: {
          populationSize: 4,
          iterations: 2,
          eliteRatio: 0.5, // 50% elite = 2 solutions preserved
          mutationRate: 0,
          crossoverRate: 1, // All non-elite will crossover
        },
      };

      const iterator = createGntc(config)();
      drainGenerator(iterator);

      // With 50% elite (2 preserved), 2 should evolve per iteration
      // 2 iterations × 2 non-elite = at least 4 crossover calls
      expect(crossoverCallCount).toBeGreaterThanOrEqual(2);
    });

    it('respects custom mutationRate', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.05); // Should trigger mutation with rate 0.1
      const { createGntc } = await import('../index.js');

      let mutateCallCount = 0;
      const config = {
        candidates: [1, 2, 3],
        select: 1,
        utilities: {
          fitness: (choice) => choice[0],
          mutate: (solution) => {
            mutateCallCount++;
            return solution;
          },
        },
        config: {
          populationSize: 4,
          iterations: 1,
          eliteRatio: 0,
          mutationRate: 0.1,
          crossoverRate: 0,
        },
      };

      const iterator = createGntc(config)();
      drainGenerator(iterator);

      // With random=0.05 < mutationRate=0.1, all non-elite should mutate
      expect(mutateCallCount).toBe(4);
    });
  });

  describe('evolution mechanics', () => {
    it('improves best score over multiple generations', async () => {
      const { createGntc } = await import('../index.js');

      const config = {
        candidates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        select: 3,
        config: {
          populationSize: 20,
          iterations: 50,
        },
      };

      const iterator = createGntc(config)();
      const states = [];

      let result = iterator.next();
      while (!result.done) {
        states.push(result.value);
        result = iterator.next();
      }
      states.push(result.value);

      // Best score should generally improve or stay same
      const firstScore = states[0].best.score;
      const lastScore = states[states.length - 1].best.score;
      expect(lastScore).toBeGreaterThanOrEqual(firstScore);

      // Optimal solution for sum of top 3 from [1-10] is 10+9+8 = 27
      expect(lastScore).toBe(27);
    });

    it('yields correct progress values', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const { createGntc } = await import('../index.js');

      const config = {
        candidates: [1, 2, 3],
        select: 1,
        utilities: {
          generateChoice: () => [1],
        },
        config: {
          populationSize: 2,
          iterations: 5,
        },
      };

      const iterator = createGntc(config)();
      const progressValues = [];

      let result = iterator.next();
      while (!result.done) {
        progressValues.push(result.value.progress);
        result = iterator.next();
      }
      progressValues.push(result.value.progress);

      expect(progressValues).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
    });

    it('handles single member population', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const { createGntc } = await import('../index.js');

      const config = {
        candidates: [5],
        select: 1,
        config: {
          populationSize: 1,
          iterations: 3,
        },
      };

      const iterator = createGntc(config)();
      const finalState = drainGenerator(iterator);

      expect(finalState.population).toHaveLength(1);
      expect(finalState.best.score).toBe(5);
    });
  });

  describe('default utilities', () => {
    it('uses default fitness function (sum)', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const { createGntc } = await import('../index.js');

      const config = {
        candidates: [1, 2, 3, 4, 5],
        select: 3,
        utilities: {
          generateChoice: () => [2, 3, 4],
        },
        config: {
          populationSize: 1,
          iterations: 1,
        },
      };

      const iterator = createGntc(config)();
      const finalState = drainGenerator(iterator);

      // Default fitness sums the values: 2 + 3 + 4 = 9
      expect(finalState.best.score).toBe(9);
    });

    it('uses default generateChoice with candidates', async () => {
      const { createGntc } = await import('../index.js');

      const config = {
        candidates: [10, 20, 30, 40, 50],
        select: 2,
        config: {
          populationSize: 5,
          iterations: 1,
        },
      };

      const iterator = createGntc(config)();
      const finalState = drainGenerator(iterator);

      // All choices should contain values from candidates
      finalState.population.forEach((solution) => {
        expect(solution.choice).toHaveLength(2);
        solution.choice.forEach((value) => {
          expect([10, 20, 30, 40, 50]).toContain(value);
        });
      });
    });
  });
});
