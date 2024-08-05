import { createGntc } from "../index";

const ITERATIONS = 1000;
const POPULATION_SIZE = 10;
const SELECT = 15;

describe("gntc", () => {
	describe("runs a genetic algorithm", () => {
		it("generates a team", () => {
			const utilities = {
			  fitness: (choice, baseSolution) => {
			    // Implementation of your fitness function
			    return Math.random(); // Placeholder
			  },
			  crossover: (solution1, solution2) => {
			    // Implementation of your crossover function
			    return solution1; // Placeholder
			  },
			  mutate: (solution) => {
			    // Implementation of your mutation function
			    return solution; // Placeholder
			  },
			  generateChoice: (select, options) => {
			    // Generate a choice based on selection criteria and options
			    return options[Math.floor(Math.random() * options.length)]; // Placeholder
			  },
			  restrictions: [
			    (choice) => {
			      // Example restriction
			      return choice % 2 === 0; // Placeholder
			    }
			  ]
			};

			const config = {
			  list: [1, 2, 3, 4, 5], // Example options list
			  options: [1, 2, 3, 4, 5],
			  populationSize: 10,
			  iterations: 100,
			  utilities: utilities,
			  select: 2,
			  loader: (iteration) => console.log(`Iteration ${iteration}`),
			  startingSolution: null // Starting solution if any
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
		});
	});
});