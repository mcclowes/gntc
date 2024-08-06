import { createGntc } from "../index";

const ITERATIONS = 1000;
const POPULATION_SIZE = 10;
const SELECT = 15;

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
				  //console.log(`Progress: ${(state.value.progress * 100).toFixed(2)}%`);
				  state = generatorInstance.next();
				}

				// The last value from the generator when 'done' is true is the best result
				const finalResult = state.value;
				console.log('Best result:', finalResult);
				expect(finalResult.score).toBe(9)
				expect(finalResult.choice).toEqual([5, 4])
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
				  //console.log(`Progress: ${(state.value.progress * 100).toFixed(2)}%`);
				  state = generatorInstance.next();
				}

				// The last value from the generator when 'done' is true is the best result
				const finalResult = state.value;
				console.log('Best result:', finalResult);
				expect(finalResult.score).toBe(353)
				expect(finalResult.choice).toEqual([254,99])
			});
		});

		describe("With custom functions", () => {
			it("Uses provided functions", () => {
				const utilities = {
				  fitness: (choice) => {
				    return choice.reduce((acc1, x) => 
				    	acc1 + x.reduce((acc2, y) => acc2 + y, 0), 0
				    )
				  },
				};

				const config = {
				  candidates: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]],
				  utilities: utilities,
				  select: 2,
				  config: {
				  	populationSize: 10,
				  	iterations: 100,
				  }
				};

				const gntcGenerator = createGntc(config);
				let finalResult;

				// Start the generator
				const generatorInstance = gntcGenerator();

				// Use a loop to process each iteration and catch the last returned value
				let state = generatorInstance.next();
				while (!state.done) {
				  //console.log(`Progress: ${(state.value.progress * 100).toFixed(2)}%`);
				  state = generatorInstance.next();
				}

				// The last value from the generator when 'done' is true is the best result
				finalResult = state.value;
				console.log('Best result:', finalResult);

				expect(finalResult.score).toBe(34)
				expect(finalResult.choice).toContainEqual([9, 10])
				expect(finalResult.choice).toContainEqual([7, 8])
			});
		})
	});

	describe("Non-candidate based", () => {
		describe("With default functions (aside from generateChoice)", () => {
			it("Maximise towards 1", () => {
				const config = {
				  select: 6,
				  utilities: {
					  generateChoice: (select) => {
					  	let result = [];
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
				  //console.log(`Progress: ${(state.value.progress * 100).toFixed(2)}%`);
				  state = generatorInstance.next();
				}

				// The last value from the generator when 'done' is true is the best result
				const finalResult = state.value;
				console.log('Best result:', finalResult);
				expect(finalResult.score).toBeGreaterThan(5.5)
			});
		});
	});
});