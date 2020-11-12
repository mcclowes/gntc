"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEBUG = false;

var gntc = /*#__PURE__*/function () {
  function gntc(props) {
    _classCallCheck(this, gntc);

    var list = props.list,
        options = props.options,
        populationSize = props.populationSize,
        iterations = props.iterations,
        utilities = props.utilities,
        select = props.select,
        loader = props.loader,
        startingSolution = props.startingSolution;
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

  _createClass(gntc, [{
    key: "runIterations",
    value: /*#__PURE__*/regeneratorRuntime.mark(function runIterations() {
      var i;
      return regeneratorRuntime.wrap(function runIterations$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.initialise();
              i = 0;

            case 2:
              if (!(i < this.iterations)) {
                _context.next = 9;
                break;
              }

              this.population = this.iteration(i);
              _context.next = 6;
              return {
                progress: i / this.iterations
              };

            case 6:
              i++;
              _context.next = 2;
              break;

            case 9:
              return _context.abrupt("return", this.best);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, runIterations, this);
    }) // establish an initial pool of solutions

  }, {
    key: "initialise",
    value: function initialise() {
      var _this = this;

      this.population = Array(this.populationSize).fill(0).map(function () {
        return _this.startingSolution ? _this.createStartingSolution() : _this.createSeed();
      });
      return;
    } // create a dumb solution

  }, {
    key: "createSeed",
    value: function createSeed() {
      var choice = this.utilities.generateChoice(this.select, this.options);
      var solution = {
        score: this.utilities.fitness(choice, this.startingSolution),
        choice: choice
      };
      return solution;
    }
  }, {
    key: "createStartingSolution",
    value: function createStartingSolution() {
      var choice = this.startingSolution;
      var solution = {
        score: this.utilities.fitness(choice, this.startingSolution),
        choice: choice
      };
      return solution;
    } // run an iteration of the algorithm

  }, {
    key: "iteration",
    value: function iteration(i) {
      var _this2 = this;

      var population = this.population;

      if (DEBUG && i % 100 === 0) {
        this.loader(i);
      }

      population.forEach(function (solution) {
        // todo : map? and return score
        solution.score = _this2.utilities.fitness(solution.choice, _this2.startingSolution);

        if ( // test
        _this2.utilities.restrictions && _this2.utilities.restrictions.map(function (restriction) {
          return restriction(solution.choice);
        }).some(function (restriction) {
          return restriction === false;
        })) {
          solution.score = 0;
        }
      });
      population.sort(function (a, b) {
        return b.score - a.score;
      }); // track best

      if (this.best.score < population[0].score) {
        this.best.score = population[0].score;
        this.best.choice = population[0].choice;
        (0, _utils.debugPrint)("NEW BEST -> ", this.best.score, this.best.choice);
      } // mutate


      population = this.evolve(population);
      return population;
    }
  }, {
    key: "evolve",
    value: function evolve(population) {
      var _this3 = this;

      return population.map(function (solution, i) {
        var chance = Math.random();

        if (i > population.length / 4) {
          if (chance > 0.9) {
            // seed new solution
            return _this3.mutate(solution);
          }

          if (chance > 0.7) {
            // cross with new solution
            return _this3.crossover(solution, _this3.createSeed());
          }

          if (chance > 0.3) {
            // cross with another solution
            //const solution2 = Math.floor(Math.random() * population.length)
            var solution2 = Math.floor(Math.abs(Math.random() - Math.random()) * population.length);
            return _this3.crossover(solution, population[solution2]);
          }
        }

        return solution;
      });
    }
  }, {
    key: "mutate",
    value: function mutate(solution) {
      return this.utilities.mutate ? this.utilities.mutate(solution) : this.createSeed();
    }
  }, {
    key: "crossover",
    value: function crossover(solution1, solution2) {
      if (!solution2) {
        return solution1;
      }

      return this.utilities.crossover(solution1, solution2);
    }
  }]);

  return gntc;
}();

gntc.propTypes = {
  iterations: _propTypes["default"].number,
  list: _propTypes["default"].array,
  seeds: _propTypes["default"].number,
  startingSolution: _propTypes["default"].array,
  utilities: _propTypes["default"].shape({
    fitness: _propTypes["default"].array,
    restrictions: _propTypes["default"].array,
    mutate: _propTypes["default"].array,
    crossover: _propTypes["default"].array
  })
};
var _default = gntc;
exports["default"] = _default;