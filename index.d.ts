/**
 * TypeScript type definitions for gntc - Genetic Algorithm Library
 */

/**
 * Solution object containing a choice and its fitness score
 */
export interface Solution<T = any> {
  /** The fitness score of this solution */
  score: number;
  /** The choice/solution data */
  choice: T;
}

/**
 * State object yielded by the genetic algorithm generator at each iteration
 */
export interface AlgorithmState<T = any> {
  /** Progress as a decimal between 0 and 1 */
  progress: number;
  /** The best solution found so far */
  best: Solution<T>;
  /** The current population of solutions */
  population: Solution<T>[];
}

/**
 * Custom utility functions for the genetic algorithm
 */
export interface Utilities<T = any> {
  /**
   * Evaluates the fitness of a choice
   * @param choice - The solution to evaluate
   * @param seed - Optional seed value
   * @returns The fitness score (higher is better)
   */
  fitness?: (choice: T, seed?: T) => number;

  /**
   * Combines two solutions to create a new solution
   * @param solutionA - First parent solution
   * @param solutionB - Second parent solution
   * @returns A new child solution
   */
  crossover?: (solutionA: Solution<T>, solutionB: Solution<T>) => Solution<T>;

  /**
   * Mutates a solution to create variation
   * @param solution - The solution to mutate
   * @returns A mutated solution
   */
  mutate?: (solution: Solution<T>) => Solution<T>;

  /**
   * Generates a new random choice
   * @param select - Number of items to select
   * @param candidates - Pool of candidates to select from
   * @returns A new random choice
   */
  generateChoice?: (select: number, candidates: T[]) => T;

  /**
   * Array of restriction functions that validate solutions
   * Each function should return true if the solution is valid
   * Invalid solutions receive a fitness score of 0
   */
  restrictions?: Array<(choice: T) => boolean>;
}

/**
 * Algorithm configuration parameters
 */
export interface AlgorithmConfig {
  /** Number of solutions in each generation */
  populationSize: number;
  /** Number of generations to evolve */
  iterations: number;
}

/**
 * Main configuration object for creating a genetic algorithm
 */
export interface GntcConfig<T = any> {
  /** Pool of candidates to select from (optional if using custom generateChoice) */
  candidates?: T[];
  /** Number of items to select for each solution */
  select: number;
  /** Algorithm configuration */
  config: AlgorithmConfig;
  /** Optional seed solution to initialize the population */
  seed?: T;
  /** Optional loader function called periodically when DEBUG=true */
  loader?: (iteration: number) => void;
  /** Custom utility functions */
  utilities?: Utilities<T>;
}

/**
 * Generator function returned by createGntc
 */
export type GntcGenerator<T = any> = () => Generator<
  AlgorithmState<T>,
  AlgorithmState<T>,
  undefined
>;

/**
 * Creates a genetic algorithm generator function
 *
 * @param config - Configuration object
 * @returns Generator function that yields algorithm state at each iteration
 *
 * @example
 * ```typescript
 * import { createGntc } from 'gntc';
 *
 * const run = createGntc({
 *   candidates: [1, 2, 3, 4, 5],
 *   select: 2,
 *   config: { populationSize: 10, iterations: 100 }
 * });
 *
 * const iterator = run();
 * let step = iterator.next();
 * while (!step.done) {
 *   const { progress, best } = step.value;
 *   console.log(`${(progress * 100).toFixed(0)}% – best score ${best.score}`);
 *   step = iterator.next();
 * }
 *
 * console.log("Best choice:", step.value.best.choice);
 * ```
 */
export function createGntc<T = any>(config: GntcConfig<T>): GntcGenerator<T>;
