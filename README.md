# gntc

A small, opinionated toolkit for building genetic algorithms in JavaScript.

`gntc` wraps the boilerplate required to evolve a population of solutions, while letting you plug in the parts that are unique to your optimisation problem. The package exports a single factory, `createGntc`, which returns a generator you can iterate to observe the algorithm as it runs.

## Installation

```sh
npm install gntc
```

## Quick start

```js
import { createGntc } from 'gntc';

const config = {
  candidates: [1, 2, 3, 4, 5],
  select: 2,
  config: {
    populationSize: 10,
    iterations: 100,
  },
};

const run = createGntc(config);
const iterator = run();

let step = iterator.next();
while (!step.done) {
  const { progress, best } = step.value;
  console.log(`${(progress * 100).toFixed(0)}% – best score ${best.score}`);
  step = iterator.next();
}

console.log('Best choice:', step.value.best.choice);
```

Running the code above evaluates combinations of the candidate numbers, selecting the pair with the highest sum. The generator yields the state of the population at each iteration so you can report progress, stream updates to a UI, or halt early if you have found a satisfactory solution.

## Interactive playground

Experiment with different configurations of `createGntc` without writing any code by running the Storybook playground:

```sh
npm run storybook
```

After the development server starts, open the **Playground/GntcPlayground** story in Storybook to tweak the candidates, config, and utilities and watch how the population evolves.

## Instrumentation and debugging

`gntc` emits optional diagnostics so you can monitor long-running jobs:

- Set `DEBUG=true` in your environment to enable internal logging whenever a new best solution is discovered.
- Provide a `loader` function in your config to receive a callback every 100 iterations (including the initial iteration at `0`) while `DEBUG` is enabled. This is useful for forwarding progress to logs, metrics, or other observers.

```sh
DEBUG=true node examples/run-algorithm.js
```

```js
const run = createGntc({
  select: 5,
  config: { populationSize: 250, iterations: 10_000 },
  utilities,
  loader: (iteration) => {
    console.info(`Checked ${iteration} generations…`);
  },
});

for (const state of run()) {
  // React to progress updates, stream to a dashboard, etc.
}
```

## API overview

### `createGntc(config)`

Creates and configures a genetic algorithm run. Calling the returned function produces a generator. Each time you `next()` the generator you receive an object containing:

- `progress` – a decimal between `0` and `1` representing the proportion of completed iterations.
- `best` – the highest scoring solution seen so far (`{ score, choice }`).
- `population` – the full population for the current iteration.

When the generator finishes it returns the same shape, with `progress: 1` and the final `best` solution.

### Configuration reference

| Field                   | Type       | Required | Description                                                                                                                     |
| ----------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `candidates`            | `Array`    | No       | Items from which `generateChoice` can create a solution. If omitted you must provide a custom `generateChoice` utility.         |
| `select`                | `number`   | Yes      | The number of items to include in each generated choice.                                                                        |
| `config.populationSize` | `number`   | Yes      | Number of solutions in each generation. Larger populations can yield better results but take longer to evaluate.                |
| `config.iterations`     | `number`   | Yes      | Number of generations to evolve.                                                                                                |
| `seed`                  | `any`      | No       | Starting solution used as the initial `best` candidate. When supplied, the first population is seeded from this value.          |
| `loader`                | `function` | No       | Called periodically (every 100 iterations) when `process.env.DEBUG === true`. Useful for logging progress in long-running jobs. |
| `utilities`             | `object`   | No       | Allows you to override the building blocks of the algorithm (see below).                                                        |

### Utility hooks

Pass a `utilities` object to customise how the algorithm behaves. All utilities receive the current `seed` as the second argument when appropriate.

| Utility          | Signature                            | Default behaviour                                                                                                                                                    |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fitness`        | `(choice, seed) => number`           | Sums the numbers in `choice`. The higher the sum, the higher the fitness score.                                                                                      |
| `crossover`      | `(solutionA, solutionB) => solution` | Returns `solutionA` unchanged. Override to merge two parents into a new child.                                                                                       |
| `mutate`         | `(solution) => solution`             | Generates an entirely new solution via `generateChoice`. Override to tweak a single solution.                                                                        |
| `generateChoice` | `(select, candidates) => choice`     | Randomly samples `select` unique candidates and sorts them in descending order.                                                                                      |
| `restrictions`   | `Array<(choice) => boolean>`         | No restrictions by default. If provided, each function should return `true` for valid solutions. Any `false` result forces a fitness score of `0` for that solution. |

### Interpreting the generator output

A **solution** is represented as an object of shape `{ score, choice }`, where `score` is the most recent value returned by `fitness` and `choice` is whatever data structure your utilities produce. The `population` array contains one of these solution objects for every member of the current generation.

The generator allows you to integrate the algorithm into long-running processes. For example, you can break when the score crosses a threshold:

```js
const run = createGntc(config);
const iterator = run();

let step = iterator.next();
while (!step.done) {
  if (step.value.best.score >= 100) {
    iterator.return();
    break;
  }
  step = iterator.next();
}
```

## Customisation examples

### Provide a custom fitness function

```js
const utilities = {
  fitness: (choice) => choice.reduce((acc, team) => acc + team.elo, 0),
};

const run = createGntc({
  candidates: teams,
  select: 5,
  config: { populationSize: 50, iterations: 500 },
  utilities,
});
```

### Working without predefined candidates

If your problem does not start from a finite list of candidates, supply your own `generateChoice` implementation:

```js
const run = createGntc({
  select: 6,
  utilities: {
    generateChoice: (select) => Array.from({ length: select }, () => Math.random()),
  },
  config: { populationSize: 100, iterations: 1_000 },
});
```

### Enforcing restrictions

```js
const run = createGntc({
  candidates: players,
  select: 11,
  utilities: {
    restrictions: [
      // Prevent more than three defenders
      (choice) => choice.filter((player) => player.position === 'DEF').length <= 3,
    ],
  },
  config: { populationSize: 200, iterations: 750 },
});
```

Any restriction returning `false` will cause the candidate to be discarded by setting its score to `0`.

## TypeScript support

The published package ships with first-class TypeScript definitions via `index.d.ts`. The types describe the shape of the generator output and allow you to specify the data stored in each solution:

```ts
import { createGntc, type GntcConfig, type Solution } from 'gntc';

type Team = { name: string; elo: number };

const config: GntcConfig<Team[]> = {
  candidates: loadTeams(),
  select: 5,
  config: { populationSize: 40, iterations: 500 },
  utilities: {
    fitness: (choice) => choice.reduce((total, team) => total + team.elo, 0),
  },
};

const iterator = createGntc<Team[]>(config)();

let step = iterator.next();
while (!step.done) {
  const state: Solution<Team[]> = step.value.best;
  console.log(state.score);
  step = iterator.next();
}
```

With the generic parameter you retain full IntelliSense for custom `choice` structures, whether they are arrays, objects, or domain-specific classes.

## Background: how the algorithm works

Genetic algorithms simulate natural selection to progressively improve candidate solutions ([Goldberg & Holland, 1988](https://link.springer.com/article/10.1023/A:1022602019183)). A run of `gntc` follows these steps:

1. **Initial population** – either randomised via `generateChoice` or seeded from `seed`.
2. **Evaluation** – each solution receives a score from your `fitness` function. Restrictions can veto invalid solutions.
3. **Selection** – the highest scoring solutions are kept at the top of the population.
4. **Crossover & mutation** – the remainder of the population is evolved via `crossover` and `mutate` to explore new possibilities.
5. **Iteration** – steps 2–4 are repeated for the configured number of iterations.

By tuning the utilities and configuration you can apply the same framework to tasks such as squad selection, investment allocation, or any other search problem where you can evaluate how “good” a candidate solution is.
