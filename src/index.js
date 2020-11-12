import PropTypes from "prop-types";

const DEBUG = process.env.DEBUG === true;

const debugPrint = (...toPrint) => {
  return DEBUG ? console.log(toPrint) : null;
};

class gntc {
  constructor(props) {
    const {
      list,
      options,
      populationSize,
      iterations,
      utilities,
      select,
      loader,
      startingSolution
    } = props;

    this.list = list;
    this.options = options ? options : list;

    this.utilities = {
      fitness: utilities.fitness,
      crossover: utilities.crossover,
      mutate: utilities.mutate,
      restrictions: utilities.restrictions,
      generateChoice: utilities.generateChoice
    };

    this.iterations = iterations; // how many times to iterate
    this.select = select; // how many in size of solution
    this.populationSize = populationSize; // how many populationSize to work with
    this.population = [];
    this.startingSolution = startingSolution;

    this.best = {
      score: -1,
      choice: startingSolution
    };

    this.loader = loader;
  }

  *runIterations() {
    this.initialise();

    for (let i = 0; i < this.iterations; i++) {
      this.population = this.iteration(i);

      yield {
        progress: i / this.iterations
      };
    }

    return this.best;
  }

  // establish an initial pool of solutions
  initialise() {
    this.population = Array(this.populationSize)
      .fill(0)
      .map(() => {
        return this.startingSolution
          ? this.createStartingSolution()
          : this.createSeed();
      });

    return;
  }

  // create a dumb solution
  createSeed() {
    const choice = this.utilities.generateChoice(this.select, this.options);

    const solution = {
      score: this.utilities.fitness(choice, this.startingSolution),
      choice: choice
    };

    return solution;
  }

  createStartingSolution() {
    const choice = this.startingSolution;

    const solution = {
      score: this.utilities.fitness(choice, this.startingSolution),
      choice: choice
    };

    return solution;
  }

  // run an iteration of the algorithm
  iteration(i) {
    let population = this.population;

    if (DEBUG && i % 100 === 0) {
      this.loader(i);
    }

    population.forEach(solution => {
      // todo : map? and return score
      solution.score = this.utilities.fitness(
        solution.choice,
        this.startingSolution
      );

      if (
        // test
        this.utilities.restrictions &&
        this.utilities.restrictions
          .map(restriction => restriction(solution.choice))
          .some(restriction => restriction === false)
      ) {
        solution.score = 0;
      }
    });

    population.sort((a, b) => {
      return b.score - a.score;
    });

    // track best
    if (this.best.score < population[0].score) {
      this.best.score = population[0].score;
      this.best.choice = population[0].choice;
      debugPrint("NEW BEST -> ", this.best.score, this.best.choice);
    }

    // mutate
    population = this.evolve(population);

    return population;
  }

  evolve(population) {
    return population.map((solution, i) => {
      const chance = Math.random();

      if (i > population.length / 4) {
        if (chance > 0.9) {
          // seed new solution
          return this.mutate(solution);
        }
        if (chance > 0.7) {
          // cross with new solution
          return this.crossover(solution, this.createSeed());
        }
        if (chance > 0.3) {
          // cross with another solution
          //const solution2 = Math.floor(Math.random() * population.length)
          const solution2 = Math.floor(
            Math.abs(Math.random() - Math.random()) * population.length
          );
          return this.crossover(solution, population[solution2]);
        }
      }

      return solution;
    });
  }

  mutate(solution) {
    return this.utilities.mutate
      ? this.utilities.mutate(solution)
      : this.createSeed();
  }

  crossover(solution1, solution2) {
    if (!solution2) {
      return solution1;
    }
    return this.utilities.crossover(solution1, solution2);
  }
}

gntc.propTypes = {
  iterations: PropTypes.number,
  list: PropTypes.array,
  seeds: PropTypes.number,
  startingSolution: PropTypes.array,
  utilities: PropTypes.shape({
    fitness: PropTypes.array,
    restrictions: PropTypes.array,
    mutate: PropTypes.array,
    crossover: PropTypes.array
  })
};

export default gntc;
