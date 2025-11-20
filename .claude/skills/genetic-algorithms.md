# Genetic Algorithms

## Description
Expert guidance on genetic algorithms - a metaheuristic optimization technique inspired by natural selection and evolutionary biology.

## Computer Science Principles

### Core Concepts

**Genetic Algorithms (GAs)** are search and optimization algorithms based on the principles of natural selection and genetics. They are part of the broader family of evolutionary algorithms.

**Key Principles:**

1. **Population-Based Search**: Unlike traditional optimization methods that work with a single solution, GAs maintain a population of candidate solutions that evolve over generations.

2. **Survival of the Fittest**: Solutions are evaluated using a fitness function, and better solutions have higher probability of contributing to the next generation.

3. **Genetic Representation**: Solutions are encoded as chromosomes (typically binary strings, real-valued vectors, or permutations).

4. **Evolutionary Operators**:
   - **Selection**: Choose parents based on fitness
   - **Crossover (Recombination)**: Combine genetic information from two parents
   - **Mutation**: Introduce random variations to maintain diversity
   - **Elitism**: Preserve best solutions across generations

### Algorithm Complexity

- **Time Complexity**: O(g × n × f) where:
  - g = number of generations
  - n = population size
  - f = fitness function evaluation time

- **Space Complexity**: O(n × l) where:
  - n = population size
  - l = chromosome length

### When to Use Genetic Algorithms

**Good For:**
- Complex optimization problems with large search spaces
- Problems where gradient information is unavailable or unreliable
- Multi-objective optimization
- Problems with discontinuous, noisy, or non-differentiable fitness functions
- Constraint satisfaction problems
- Feature selection, hyperparameter tuning

**Not Ideal For:**
- Simple, well-understood problems with known optimal solutions
- Problems requiring exact solutions (GAs find approximate solutions)
- Real-time applications requiring fast convergence
- Problems where gradient-based methods work well

## Implementation Guide

### Basic Algorithm Structure

```
1. Initialize population randomly
2. Evaluate fitness of each individual
3. While termination condition not met:
   a. Select parents based on fitness
   b. Apply crossover to create offspring
   c. Apply mutation to offspring
   d. Evaluate offspring fitness
   e. Select survivors for next generation
4. Return best solution found
```

### Implementation Components

#### 1. Chromosome Representation

**Binary Encoding:**
```python
# Example: Optimize 5 variables in range [0, 31]
chromosome = [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, ...]  # 5 bits per variable
```

**Real-Valued Encoding:**
```python
chromosome = [3.14, 2.71, 1.41, 0.57]  # Direct representation
```

**Permutation Encoding:**
```python
chromosome = [3, 1, 4, 2, 5]  # For ordering problems (TSP, scheduling)
```

#### 2. Fitness Function

```python
def fitness_function(chromosome):
    """
    Evaluates how good a solution is.
    Higher values indicate better solutions.
    """
    # Decode chromosome to problem variables
    variables = decode(chromosome)

    # Calculate objective function
    score = objective_function(variables)

    # Handle constraints (penalty method)
    penalty = calculate_constraint_violations(variables)

    return score - penalty
```

#### 3. Selection Methods

**Roulette Wheel Selection:**
```python
def roulette_wheel_selection(population, fitnesses):
    total_fitness = sum(fitnesses)
    probabilities = [f / total_fitness for f in fitnesses]
    selected_idx = random.choices(range(len(population)),
                                  weights=probabilities, k=1)[0]
    return population[selected_idx]
```

**Tournament Selection:**
```python
def tournament_selection(population, fitnesses, tournament_size=3):
    tournament_indices = random.sample(range(len(population)),
                                      tournament_size)
    tournament_fitnesses = [fitnesses[i] for i in tournament_indices]
    winner_idx = tournament_indices[
        tournament_fitnesses.index(max(tournament_fitnesses))
    ]
    return population[winner_idx]
```

#### 4. Crossover Operators

**Single-Point Crossover:**
```python
def single_point_crossover(parent1, parent2):
    point = random.randint(1, len(parent1) - 1)
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    return child1, child2
```

**Two-Point Crossover:**
```python
def two_point_crossover(parent1, parent2):
    point1, point2 = sorted(random.sample(range(len(parent1)), 2))
    child1 = parent1[:point1] + parent2[point1:point2] + parent1[point2:]
    child2 = parent2[:point1] + parent1[point1:point2] + parent2[point2:]
    return child1, child2
```

**Uniform Crossover:**
```python
def uniform_crossover(parent1, parent2):
    child1, child2 = [], []
    for gene1, gene2 in zip(parent1, parent2):
        if random.random() < 0.5:
            child1.append(gene1)
            child2.append(gene2)
        else:
            child1.append(gene2)
            child2.append(gene1)
    return child1, child2
```

#### 5. Mutation Operators

**Bit Flip Mutation (Binary):**
```python
def bit_flip_mutation(chromosome, mutation_rate=0.01):
    mutated = chromosome.copy()
    for i in range(len(mutated)):
        if random.random() < mutation_rate:
            mutated[i] = 1 - mutated[i]  # Flip bit
    return mutated
```

**Gaussian Mutation (Real-Valued):**
```python
def gaussian_mutation(chromosome, mutation_rate=0.1, sigma=0.1):
    mutated = chromosome.copy()
    for i in range(len(mutated)):
        if random.random() < mutation_rate:
            mutated[i] += random.gauss(0, sigma)
    return mutated
```

**Swap Mutation (Permutation):**
```python
def swap_mutation(chromosome, mutation_rate=0.1):
    mutated = chromosome.copy()
    if random.random() < mutation_rate:
        i, j = random.sample(range(len(mutated)), 2)
        mutated[i], mutated[j] = mutated[j], mutated[i]
    return mutated
```

## Complete Implementation Example

```python
import random
import numpy as np

class GeneticAlgorithm:
    def __init__(self,
                 fitness_function,
                 chromosome_length,
                 population_size=100,
                 crossover_rate=0.8,
                 mutation_rate=0.01,
                 elitism_count=2,
                 max_generations=100):
        self.fitness_function = fitness_function
        self.chromosome_length = chromosome_length
        self.population_size = population_size
        self.crossover_rate = crossover_rate
        self.mutation_rate = mutation_rate
        self.elitism_count = elitism_count
        self.max_generations = max_generations

    def initialize_population(self):
        """Create random initial population."""
        return [
            [random.randint(0, 1) for _ in range(self.chromosome_length)]
            for _ in range(self.population_size)
        ]

    def evaluate_population(self, population):
        """Evaluate fitness for all individuals."""
        return [self.fitness_function(chromosome) for chromosome in population]

    def select_parents(self, population, fitnesses):
        """Tournament selection."""
        tournament_size = 3
        tournament_indices = random.sample(range(len(population)), tournament_size)
        tournament_fitnesses = [fitnesses[i] for i in tournament_indices]
        winner_idx = tournament_indices[
            tournament_fitnesses.index(max(tournament_fitnesses))
        ]
        return population[winner_idx]

    def crossover(self, parent1, parent2):
        """Single-point crossover."""
        if random.random() < self.crossover_rate:
            point = random.randint(1, self.chromosome_length - 1)
            child1 = parent1[:point] + parent2[point:]
            child2 = parent2[:point] + parent1[point:]
            return child1, child2
        return parent1.copy(), parent2.copy()

    def mutate(self, chromosome):
        """Bit flip mutation."""
        mutated = chromosome.copy()
        for i in range(len(mutated)):
            if random.random() < self.mutation_rate:
                mutated[i] = 1 - mutated[i]
        return mutated

    def run(self):
        """Execute the genetic algorithm."""
        # Initialize
        population = self.initialize_population()
        best_solution = None
        best_fitness = float('-inf')
        fitness_history = []

        # Evolution loop
        for generation in range(self.max_generations):
            # Evaluate fitness
            fitnesses = self.evaluate_population(population)

            # Track best solution
            max_fitness_idx = fitnesses.index(max(fitnesses))
            if fitnesses[max_fitness_idx] > best_fitness:
                best_fitness = fitnesses[max_fitness_idx]
                best_solution = population[max_fitness_idx].copy()

            fitness_history.append({
                'generation': generation,
                'best_fitness': best_fitness,
                'avg_fitness': sum(fitnesses) / len(fitnesses),
                'worst_fitness': min(fitnesses)
            })

            # Create new population
            new_population = []

            # Elitism: keep best individuals
            sorted_indices = sorted(range(len(fitnesses)),
                                  key=lambda i: fitnesses[i],
                                  reverse=True)
            for i in range(self.elitism_count):
                new_population.append(population[sorted_indices[i]].copy())

            # Generate offspring
            while len(new_population) < self.population_size:
                # Selection
                parent1 = self.select_parents(population, fitnesses)
                parent2 = self.select_parents(population, fitnesses)

                # Crossover
                child1, child2 = self.crossover(parent1, parent2)

                # Mutation
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)

                new_population.extend([child1, child2])

            # Trim to population size
            population = new_population[:self.population_size]

        return {
            'best_solution': best_solution,
            'best_fitness': best_fitness,
            'fitness_history': fitness_history
        }


# Example Usage: Optimize the OneMax problem
def onemax_fitness(chromosome):
    """Fitness = number of 1s in chromosome."""
    return sum(chromosome)

# Run GA
ga = GeneticAlgorithm(
    fitness_function=onemax_fitness,
    chromosome_length=50,
    population_size=100,
    crossover_rate=0.8,
    mutation_rate=0.02,
    elitism_count=2,
    max_generations=100
)

result = ga.run()
print(f"Best solution: {result['best_solution']}")
print(f"Best fitness: {result['best_fitness']}")
```

## Advanced Techniques

### 1. Adaptive Parameters

```python
def adaptive_mutation_rate(generation, max_generations, base_rate=0.01):
    """Decrease mutation rate over time."""
    return base_rate * (1 - generation / max_generations)
```

### 2. Multi-Objective Optimization (NSGA-II)

Use Pareto dominance for problems with multiple conflicting objectives:
- Non-dominated sorting
- Crowding distance for diversity
- Selection based on rank and crowding distance

### 3. Constraint Handling

**Penalty Method:**
```python
def fitness_with_penalty(chromosome):
    objective = calculate_objective(chromosome)
    penalty = sum(max(0, constraint_violation(chromosome, c))
                  for c in constraints)
    return objective - penalty_coefficient * penalty
```

**Repair Method:**
```python
def repair_chromosome(chromosome):
    """Modify chromosome to satisfy constraints."""
    while not is_valid(chromosome):
        # Apply repair operations
        chromosome = fix_violations(chromosome)
    return chromosome
```

### 4. Hybrid Approaches

Combine GAs with local search:
```python
def local_search(chromosome):
    """Hill climbing to improve solution."""
    improved = chromosome.copy()
    # Apply local optimization
    return improved

# Apply after crossover/mutation
offspring = local_search(offspring)
```

## Common Pitfalls and Solutions

1. **Premature Convergence**
   - Solution: Increase mutation rate, use diversity preservation

2. **Slow Convergence**
   - Solution: Adjust selection pressure, increase population size

3. **Poor Exploration**
   - Solution: Balance exploration vs exploitation, use adaptive parameters

4. **Fitness Function Issues**
   - Ensure fitness scaling is appropriate
   - Avoid fitness functions with large plateaus

## Parameter Tuning Guidelines

- **Population Size**: 50-200 (larger for complex problems)
- **Crossover Rate**: 0.6-0.95 (typically 0.8)
- **Mutation Rate**: 1/chromosome_length to 0.1
- **Selection Pressure**: Tournament size 2-7
- **Elitism**: 1-5% of population

## Resources and Further Reading

- **Classic Paper**: Holland, J. (1975). "Adaptation in Natural and Artificial Systems"
- **Modern Overview**: Goldberg, D. (1989). "Genetic Algorithms in Search, Optimization, and Machine Learning"
- **Applications**: Scheduling, neural network training, game AI, financial modeling

---

When implementing genetic algorithms:
1. Start simple and iterate
2. Visualize fitness over generations
3. Experiment with different operators
4. Consider problem-specific representations
5. Benchmark against other optimization methods
