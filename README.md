# gntc

THIS IS WORK IN PROGRESS

## Genetic Algorithms

A Genetic Algorithm (GA) is an search heuristic that simulates the naturally occurring processes by which biological evolution occurs ([Goldberg & Holland 1988](https://link.springer.com/article/10.1023/A:1022602019183)). 

They can be used to efficiently find strong solutions to search problems and optimisation problems.

It works by taking an initial pool of (usually random) solutions to that problem, evaluating the performance of those solutions, and combining the best of them to create new solutions. Small mutations are also added, giving GAs the ability to find globally optimal solutions beyond any locally optimal solutions they might find (local minima).

### Genetic Algorithm Elements

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
