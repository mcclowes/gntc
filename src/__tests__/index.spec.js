import { createGntc } from "../index";

describe("gntc", () => {
  describe("With candidates", () => {
    describe("With default functions", () => {
      it("Pick highest values from ordered list", () => {
        const config = {
          candidates: [1, 2, 3, 4, 5],
          select: 2,
          config: {
            populationSize: 10,
            iterations: 100,
          },
        };

        const gntcGenerator = createGntc(config);
        const generatorInstance = gntcGenerator();

        let state = generatorInstance.next();
        while (!state.done) {
          state = generatorInstance.next();
        }

        const finalResult = state.value;
        expect(finalResult.best.score).toBe(9);
        expect(finalResult.best.choice).toEqual([5, 4]);
      });

      it("Pick highest values from unordered list", () => {
        const config = {
          candidates: [17, 2, -3, 254, 99],
          select: 2,
          config: {
            populationSize: 10,
            iterations: 100,
          },
        };

        const gntcGenerator = createGntc(config);
        const generatorInstance = gntcGenerator();

        let state = generatorInstance.next();
        while (!state.done) {
          state = generatorInstance.next();
        }

        const finalResult = state.value;
        expect(finalResult.best.score).toBe(353);
        expect(finalResult.best.choice).toEqual([254, 99]);
      });
    });

    describe("With custom functions", () => {
      it("Uses provided functions", () => {
        const utilities = {
          fitness: (choice) => {
            return choice.reduce(
              (acc1, x) => acc1 + x.reduce((acc2, y) => acc2 + y, 0),
              0
            );
          },
        };

        const config = {
          candidates: [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
            [9, 10],
          ],
          utilities,
          select: 2,
          config: {
            populationSize: 10,
            iterations: 100,
          },
        };

        const gntcGenerator = createGntc(config);
        const generatorInstance = gntcGenerator();

        let state = generatorInstance.next();
        while (!state.done) {
          state = generatorInstance.next();
        }

        const finalResult = state.value;
        expect(finalResult.best.score).toBe(34);
        expect(finalResult.best.choice).toContainEqual([9, 10]);
        expect(finalResult.best.choice).toContainEqual([7, 8]);
      });
    });
  });

  describe("Non-candidate based", () => {
    describe("With default functions (aside from generateChoice)", () => {
      it("Maximise towards 1", () => {
        const config = {
          select: 6,
          utilities: {
            generateChoice: (select) => {
              const result = [];
              for (let i = 0; i < select; i++) {
                result.push(Math.random());
              }
              return result;
            },
          },
          config: {
            populationSize: 100,
            iterations: 1000,
          },
        };

        const gntcGenerator = createGntc(config);
        const generatorInstance = gntcGenerator();

        let state = generatorInstance.next();
        while (!state.done) {
          state = generatorInstance.next();
        }

        const finalResult = state.value;
        expect(finalResult.best.score).toBeGreaterThan(5);
      });
    });
  });
});

describe("debugPrint", () => {
  it("logs discrete arguments", () => {
    const originalDebug = process.env.DEBUG;
    process.env.DEBUG = "true";
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    jest.resetModules();

    jest.isolateModules(() => {
      const { createGntc } = require("../index");
      const generatorFactory = createGntc({
        candidates: [1, 2, 3],
        select: 1,
        config: {
          populationSize: 1,
          iterations: 1,
        },
        loader: jest.fn(),
      });

      const iterator = generatorFactory();
      iterator.next();
    });

    expect(logSpy).toHaveBeenCalledWith(
      "NEW BEST -> ",
      expect.any(Number),
      expect.anything()
    );

    logSpy.mockRestore();

    if (typeof originalDebug === "undefined") {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = originalDebug;
    }
  });
});
