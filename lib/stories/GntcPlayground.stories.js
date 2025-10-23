"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Playground = void 0;
var _react = require("react");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _index = require("../index.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const fitnessStrategies = {
  sum: {
    label: 'Sum (default)',
    fn: (choice = []) => choice.reduce((acc, value) => acc + Number(value || 0), 0)
  },
  average: {
    label: 'Average value',
    fn: (choice = []) => {
      const total = choice.reduce((acc, value) => acc + Number(value || 0), 0);
      return choice.length === 0 ? 0 : total / choice.length;
    }
  },
  evenBias: {
    label: 'Bias towards even numbers',
    fn: (choice = []) => choice.reduce((acc, value) => {
      const numeric = Number(value || 0);
      return acc + numeric + (numeric % 2 === 0 ? numeric * 0.25 : 0);
    }, 0)
  }
};
const generateChoiceStrategies = {
  random: {
    label: 'Random subset',
    fn: (select, candidates) => {
      const pool = [...candidates];
      const selection = [];
      for (let i = 0; i < select; i += 1) {
        const index = Math.floor(Math.random() * pool.length);
        selection.push(pool[index]);
      }
      return selection;
    }
  },
  highest: {
    label: 'Highest values',
    fn: (select, candidates) => {
      return [...candidates].map(Number).sort((a, b) => b - a).slice(0, select);
    }
  },
  lowest: {
    label: 'Lowest values',
    fn: (select, candidates) => {
      return [...candidates].map(Number).sort((a, b) => a - b).slice(0, select);
    }
  }
};
const mutateStrategies = {
  randomReset: {
    label: 'Random replacement',
    fn: (solution, context) => {
      if (!solution?.choice?.length) {
        return context.createSeed();
      }
      const nextChoice = [...solution.choice];
      const index = Math.floor(Math.random() * nextChoice.length);
      const candidateIndex = Math.floor(Math.random() * context.candidates.length);
      nextChoice[index] = context.candidates[candidateIndex];
      return {
        choice: nextChoice,
        score: context.fitness(nextChoice)
      };
    }
  },
  shuffle: {
    label: 'Shuffle choice',
    fn: (solution, context) => {
      if (!solution?.choice?.length) {
        return context.createSeed();
      }
      const nextChoice = [...solution.choice].sort(() => Math.random() - 0.5);
      return {
        choice: nextChoice,
        score: context.fitness(nextChoice)
      };
    }
  }
};
const crossoverStrategies = {
  alternating: {
    label: 'Alternate genes',
    fn: (solutionA, solutionB, context) => {
      if (!solutionB?.choice?.length) {
        return solutionA;
      }
      const choice = solutionA.choice.map((value, index) => {
        if (index % 2 === 0) {
          return value;
        }
        return solutionB.choice[index] ?? value;
      });
      return {
        choice,
        score: context.fitness(choice)
      };
    }
  },
  keepBest: {
    label: 'Keep best scores',
    fn: (solutionA, solutionB) => {
      if (!solutionB?.choice?.length) {
        return solutionA;
      }
      return solutionA.score >= solutionB.score ? solutionA : solutionB;
    }
  }
};
const strategyLabel = (strategies, key) => strategies[key]?.label ?? key;
const buildUtilities = (utilitiesArgs, {
  candidates,
  select
}) => {
  const fitness = fitnessStrategies[utilitiesArgs.fitness]?.fn ?? fitnessStrategies.sum.fn;
  const generateChoice = generateChoiceStrategies[utilitiesArgs.generateChoice]?.fn ?? generateChoiceStrategies.random.fn;
  const context = {
    candidates,
    select,
    fitness,
    generateChoice,
    createSeed: () => {
      const choice = generateChoice(select, candidates);
      return {
        choice,
        score: fitness(choice)
      };
    }
  };
  const utilities = {
    fitness,
    generateChoice
  };
  if (utilitiesArgs.mutate && mutateStrategies[utilitiesArgs.mutate]) {
    utilities.mutate = solution => mutateStrategies[utilitiesArgs.mutate].fn(solution, context);
  }
  if (utilitiesArgs.crossover && crossoverStrategies[utilitiesArgs.crossover]) {
    utilities.crossover = (solutionA, solutionB) => crossoverStrategies[utilitiesArgs.crossover].fn(solutionA, solutionB, context);
  }
  return utilities;
};
const parseNumberArray = text => text.split(',').map(item => Number(item.trim())).filter(value => Number.isFinite(value));
const parseSeed = text => {
  const values = parseNumberArray(text);
  return values.length > 0 ? values : undefined;
};
const formatPercent = value => `${Math.round(value * 100)}%`;
const formatChoice = choice => JSON.stringify(choice, null, 2);
const summariseUtilities = utilities => [`Fitness: ${strategyLabel(fitnessStrategies, utilities.fitness)}`, `Generate: ${strategyLabel(generateChoiceStrategies, utilities.generateChoice)}`, `Mutate: ${strategyLabel(mutateStrategies, utilities.mutate)}`, `Crossover: ${strategyLabel(crossoverStrategies, utilities.crossover)}`].join(' \n');
const GntcVisualizer = ({
  args
}) => {
  const {
    candidatesText,
    select,
    config,
    utilities = {},
    seedText
  } = args;
  const {
    fitness: utilitiesFitness,
    generateChoice: utilitiesGenerateChoice,
    mutate: utilitiesMutate,
    crossover: utilitiesCrossover
  } = utilities;
  const candidates = (0, _react.useMemo)(() => {
    const parsed = parseNumberArray(candidatesText);
    return parsed.length > 0 ? parsed : [1, 2, 3, 4, 5, 6];
  }, [candidatesText]);
  const seed = (0, _react.useMemo)(() => parseSeed(seedText), [seedText]);
  const utilitiesConfig = (0, _react.useMemo)(() => ({
    fitness: utilitiesFitness ?? 'sum',
    generateChoice: utilitiesGenerateChoice ?? 'random',
    mutate: utilitiesMutate ?? '',
    crossover: utilitiesCrossover ?? ''
  }), [utilitiesFitness, utilitiesGenerateChoice, utilitiesMutate, utilitiesCrossover]);
  const sanitizedConfig = (0, _react.useMemo)(() => ({
    populationSize: Math.max(1, Number.parseInt(config.populationSize, 10) || 1),
    iterations: Math.max(1, Number.parseInt(config.iterations, 10) || 1)
  }), [config.iterations, config.populationSize]);
  const [stateHistory, setStateHistory] = (0, _react.useState)([]);
  const [error, setError] = (0, _react.useState)(null);
  const [step, setStep] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    setError(null);
    setStep(0);
    try {
      const builtUtilities = buildUtilities(utilitiesConfig, {
        candidates,
        select
      });
      const run = (0, _index.createGntc)({
        candidates,
        select,
        config: sanitizedConfig,
        utilities: builtUtilities,
        seed
      });
      const iterator = run();
      const snapshots = [];
      let next = iterator.next();
      while (!next.done) {
        snapshots.push(next.value);
        next = iterator.next();
      }
      if (next.value) {
        snapshots.push(next.value);
      }
      setStateHistory(snapshots);
    } catch (err) {
      setError(err);
      setStateHistory([]);
    }
  }, [candidates, select, sanitizedConfig, utilitiesConfig, seed]);
  (0, _react.useEffect)(() => {
    if (step >= stateHistory.length) {
      setStep(stateHistory.length - 1);
    }
  }, [stateHistory, step]);
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #f87171',
        padding: '1rem',
        background: '#fef2f2'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        marginTop: 0
      }
    }, "Unable to run playground"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginBottom: 0
      }
    }, error.message));
  }
  if (stateHistory.length === 0) {
    return /*#__PURE__*/React.createElement("p", null, "Adjust the controls to run the genetic algorithm.");
  }
  const currentState = stateHistory[Math.max(0, Math.min(step, stateHistory.length - 1))];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'sans-serif',
      lineHeight: 1.5,
      maxWidth: 960
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: '0.5rem'
    }
  }, "Algorithm progress"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Iteration ", step + 1, " of ", stateHistory.length, " (", formatPercent(currentState.progress), ")"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 0,
    max: Math.max(0, stateHistory.length - 1),
    value: step,
    onChange: event => setStep(Number(event.target.value))
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: '1.5rem',
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      marginTop: 0
    }
  }, "Best score"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '2rem',
      fontWeight: 700
    }
  }, currentState.best?.score ?? '—'), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: '#f9fafb',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      overflowX: 'auto'
    }
  }, formatChoice(currentState.best?.choice))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      marginTop: 0
    }
  }, "Config"), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Select"), /*#__PURE__*/React.createElement("dd", null, select)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Population size"), /*#__PURE__*/React.createElement("dd", null, sanitizedConfig.populationSize)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Iterations"), /*#__PURE__*/React.createElement("dd", null, sanitizedConfig.iterations)))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      marginTop: 0
    }
  }, "Utilities"), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: '#f9fafb',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      whiteSpace: 'pre-wrap'
    }
  }, summariseUtilities(utilitiesConfig)))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h3", null, "Population"), /*#__PURE__*/React.createElement("ol", {
    style: {
      paddingLeft: '1.5rem',
      display: 'grid',
      gap: '0.75rem'
    }
  }, currentState.population.map((solution, index) => /*#__PURE__*/React.createElement("li", {
    key: index,
    style: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Score: ", solution.score), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: '0.5rem 0 0',
      background: '#f9fafb',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      overflowX: 'auto'
    }
  }, formatChoice(solution.choice)))))));
};
GntcVisualizer.propTypes = {
  args: _propTypes.default.shape({
    candidatesText: _propTypes.default.string,
    select: _propTypes.default.number,
    config: _propTypes.default.shape({
      populationSize: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
      iterations: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
    }),
    utilities: _propTypes.default.shape({
      fitness: _propTypes.default.string,
      generateChoice: _propTypes.default.string,
      mutate: _propTypes.default.string,
      crossover: _propTypes.default.string
    }),
    seedText: _propTypes.default.string
  }).isRequired
};
const Template = args => /*#__PURE__*/React.createElement(GntcVisualizer, {
  args: args
});
const meta = {
  title: 'Playground/GntcPlayground',
  component: GntcVisualizer,
  render: Template,
  argTypes: {
    candidatesText: {
      control: 'text',
      description: 'Comma separated list of candidate values'
    },
    select: {
      control: {
        type: 'number',
        min: 1
      },
      description: 'How many candidates to select per solution'
    },
    config: {
      control: 'object',
      description: 'Genetic algorithm configuration'
    },
    utilities: {
      control: 'object',
      description: 'Select which utility strategies to apply'
    },
    seedText: {
      control: 'text',
      description: 'Optional seed (comma separated numbers)'
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive playground for experimenting with the `createGntc` genetic algorithm. Adjust candidates, configuration, and utilities to visualise how the population evolves.'
      }
    }
  }
};
const Playground = exports.Playground = {
  args: {
    candidatesText: '1, 2, 3, 4, 5, 6, 7, 8, 9',
    select: 4,
    config: {
      populationSize: 12,
      iterations: 50
    },
    utilities: {
      fitness: 'sum',
      generateChoice: 'random',
      mutate: 'randomReset',
      crossover: 'alternating'
    },
    seedText: ''
  }
};
var _default = exports.default = meta;