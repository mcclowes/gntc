"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGntc = void 0;

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DEBUG = process.env.DEBUG === true;

var debugPrint = function debugPrint() {
  for (var _len = arguments.length, toPrint = new Array(_len), _key = 0; _key < _len; _key++) {
    toPrint[_key] = arguments[_key];
  }

  return DEBUG ? console.log(toPrint) : null;
};

var getRandomElements = function getRandomElements(arr, numElements) {
  var shuffled = arr.slice(); // Copy the array

  var i = arr.length,
      temp,
      index; // Shuffle array using the Fisher-Yates shuffle algorithm

  while (i--) {
    index = Math.floor(Math.random() * (i + 1));
    temp = shuffled[i];
    shuffled[i] = shuffled[index];
    shuffled[index] = temp;
  }

  var pick = shuffled.slice(0, numElements);
  pick.sort(function (a, b) {
    return b - a;
  });
  return pick;
};

var defaultFitness = function defaultFitness(choice) {
  return (choice === null || choice === void 0 ? void 0 : choice.reduce(function (acc, x) {
    return acc + x;
  }, 0)) || choice;
};

var defaultGenerateChoice = function defaultGenerateChoice(select, candidates) {
  var pick = getRandomElements(candidates, select);
  return pick;
};

var createGntc = function createGntc(props) {
  var _props$utilities = props.utilities;
  _props$utilities = _props$utilities === void 0 ? {} : _props$utilities;
  var _props$utilities$fitn = _props$utilities.fitness,
      fitness = _props$utilities$fitn === void 0 ? defaultFitness : _props$utilities$fitn,
      crossover = _props$utilities.crossover,
      mutate = _props$utilities.mutate,
      _props$utilities$gene = _props$utilities.generateChoice,
      generateChoice = _props$utilities$gene === void 0 ? defaultGenerateChoice : _props$utilities$gene,
      restrictions = _props$utilities.restrictions,
      candidates = props.candidates,
      select = props.select,
      _props$config = props.config,
      populationSize = _props$config.populationSize,
      iterations = _props$config.iterations,
      loader = props.loader,
      seed = props.seed;
  var population = [];
  var best = {
    score: -1,
    choice: seed
  };

  var initialise = function initialise() {
    population = Array(populationSize).fill(0).map(function () {
      return seed ? createStartingSolution() : createSeed();
    });
  };

  var mutateSolution = function mutateSolution(solution) {
    return mutate ? mutate(solution) : createSeed();
  };

  var crossoverSolutions = function crossoverSolutions(solution1, solution2) {
    return crossover ? crossover(solution1, solution2) : solution1;
  };

  var evolvePopulation = function evolvePopulation(population) {
    return population.map(function (solution, i) {
      var chance = Math.random();

      if (i > population.length / 4) {
        if (chance > 0.9) {
          return mutateSolution(solution);
        }

        if (chance > 0.7) {
          return crossoverSolutions(solution, createSeed());
        }

        if (chance > 0.3) {
          var solution2 = population[Math.floor(Math.abs(Math.random() - Math.random()) * population.length)];
          return crossoverSolutions(solution, solution2);
        }
      }

      return solution;
    });
  };

  var createSeed = function createSeed() {
    var choice = generateChoice(select, candidates);
    var score = fitness(choice, seed);
    return {
      score: score,
      choice: choice
    };
  };

  var createStartingSolution = function createStartingSolution() {
    var choice = seed;
    var score = fitness(choice, seed);
    return {
      score: score,
      choice: choice
    };
  };

  var iteration = function iteration(i) {
    if (DEBUG && i % 100 === 0) loader(i);
    population.forEach(function (solution) {
      solution.score = fitness(solution.choice, seed);

      if (restrictions && restrictions.map(function (restriction) {
        return restriction(solution.choice);
      }).some(function (res) {
        return res === false;
      })) {
        solution.score = 0;
      }
    });
    population.sort(function (a, b) {
      return b.score - a.score;
    });

    if (best.score < population[0].score) {
      best = {
        score: population[0].score,
        choice: population[0].choice
      };
      debugPrint("NEW BEST -> ", best.score, best.choice);
    }

    population = evolvePopulation(population);
  };

  var runIterations = /*#__PURE__*/_regeneratorRuntime["default"].mark(function runIterations() {
    var i;
    return _regeneratorRuntime["default"].wrap(function runIterations$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            initialise();
            i = 0;

          case 2:
            if (!(i < iterations)) {
              _context.next = 9;
              break;
            }

            iteration(i);
            _context.next = 6;
            return {
              progress: i / iterations,
              best: best,
              population: population
            };

          case 6:
            i++;
            _context.next = 2;
            break;

          case 9:
            return _context.abrupt("return", {
              progress: 1,
              best: best,
              population: population
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, runIterations);
  });

  return runIterations;
};

exports.createGntc = createGntc;