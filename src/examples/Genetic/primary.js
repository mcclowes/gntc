import { test, generate, fitness, crossover, } from "../../utils";

import api from "../../api";

const ITERATIONS = 400; // optimum is 10000? 300 seems to be ok
const POPULATION_SIZE = 1000; // optimum is 1000
const SELECT = 15;

const GeneticGenerator = (playersList, topPlayersList, existingTeam, freeHit = false, freeTransfers = 0) => {
	const startingSolution = existingTeam 
		? generate.byIds(existingTeam, playersList)
		: null;

	console.log("Starting solution: ", startingSolution);

	return new api.genetic({
		iterations: ITERATIONS,
		list: playersList,
		options: topPlayersList,
		populationSize: POPULATION_SIZE,
		select: SELECT,
		startingSolution: startingSolution,
		utilities: {
			fitness: (solution, comparison) => fitness.byPredictedPoints(freeHit, freeTransfers)(solution, comparison),
			crossover: crossover.random,
			generateChoice: generate.choice.primary,
			restrictions: [
				test.price,
				test.unique,
				test.positions,
				test.teams,
			],
		},
	});
};

export default GeneticGenerator;

