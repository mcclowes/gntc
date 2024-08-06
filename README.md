# gntc

## Using 

```sh
npm install gntc
```


```js
import { createGntc } from "../index";

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
````

## Config

```js
const {
	options,
	utilities: {
		fitness,
		crossover,
		mutate,
		generateChoice,
		restrictions,
	},
	select,
	config: {
		populationSize,
		iterations,
	},
	loader,
	seed,
} = props;
```

### options

An array of items from which to create a 'choice'

### populationSize

How big a population

## About genetic algorithms

A Genetic Algorithm (GA) is an search heuristic that simulates the naturally occurring processes by which biological evolution occurs ([Goldberg & Holland 1988](https://link.springer.com/article/10.1023/A:1022602019183)). 

They can be used to efficiently find strong solutions to search problems and optimisation problems.

It works by taking an initial pool of (usually random) solutions to that problem, evaluating the performance of those solutions, and combining the best of them to create new solutions. Small mutations are also added, giving GAs the ability to find globally optimal solutions beyond any locally optimal solutions they might find (local minima).

### Genetic algorithm elements

#### Initial population

Two main approaches:
- randomly generating a pool of solutions
- seeding with an existing solution you are looking to improve upon.

We provide an inbuilt utility function for randomising an initial population.

#### Fitness function

This is the a key step. Having generated a new population, they must be ranked. This fitness function provides the ranking, and is what the GA is ultimately optimising for.

We provide a generic utility function which takes objects and the property to optimise against as parameters.

#### Selection

The idea of selection phase is to select the fittest individuals and let them pass their genes to the next generation.

Two pairs of individuals (parents) are selected based on their fitness scores. Individuals with high fitness have more chance to be selected for reproduction.

These parents then have the crossover function applied to them.

#### Crossover

- Crossover point method
- Full random method

#### Mutation

Finally, we add a chance of mutating any children.
