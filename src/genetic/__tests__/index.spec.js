import Genetic from "../index";
import { test, generate, fitness, crossover, } from "../../../utils";
//import generateCombinedData from "../../../generateCombinedData";

const ITERATIONS = 1000;
const POPULATION_SIZE = 10;
const SELECT = 15;

const playersList = [
	{ "id": 1, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 10, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 12, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 12, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 13, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 14, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 15, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 16, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 17, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 18, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 19, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 2, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 20, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 3, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 4, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 5, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 6, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 7, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 8, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 9, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
];

const startingSolution = [
	{ "id": 10, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 12, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 12, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 13, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 14, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 15, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 16, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 2, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 3, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 4, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 5, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 6, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 7, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 8, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 9, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
];

const populationModel = { choice: startingSolution, score: 0, };

let GeneticModel;

const createGenetic = (freeHit = false, freeTransfers = 0) => {
	return new Genetic({
		iterations: ITERATIONS,
		list: playersList,
		options: playersList,
		populationSize: POPULATION_SIZE,
		select: SELECT,
		startingSolution: startingSolution,
		utilities: {
			fitness: freeHit 
				? fitness.byFreeHitScore 
				: () => { return fitness.byPPG(freeTransfers); },
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

describe("fitness", () => {
	beforeEach(() => {
		GeneticModel = createGenetic(true);
	});

	describe("createSeed", () => {
		it("generates a team", () => {
			expect(GeneticModel.createSeed().choice).toHaveLength(SELECT);
			expect(GeneticModel.createSeed().choice[0].id).toBeTruthy();

			expect(GeneticModel.createSeed().score).toBeTruthy();
			expect(GeneticModel.createSeed().score * 0).toBe(0); // is not NaN
		});
	});

	describe("createStartingSolution", () => {
		it("generates a team", () => {
			expect(GeneticModel.createStartingSolution().choice).toHaveLength(SELECT);
			expect(GeneticModel.createStartingSolution().choice[0].id).toBeTruthy();

			expect(GeneticModel.createStartingSolution().score).toBe(12);
		});
	});  

	describe("iteration", () => {
		it("returns a population", () => {
			GeneticModel.initialise();

			const iterationResult = GeneticModel.iteration(1);

			expect(iterationResult).toHaveLength(10);
			expect(iterationResult[0].choice).toHaveLength(SELECT);
			expect(iterationResult[0].choice[0].id).toBeTruthy();
			expect(iterationResult[0].score * 0).toBe(0);
		});
	});

	describe("evolve", () => {
		it("returns a population", () => {
			GeneticModel.initialise();

			const evolveResult = GeneticModel.evolve(
				[
					populationModel, 
					populationModel,  
					populationModel,
				]);

			expect(evolveResult).toHaveLength(3);
			expect(evolveResult[0].choice).toHaveLength(SELECT);
			expect(evolveResult[0].choice[0].id).toBeTruthy();
			expect(evolveResult[0].score * 0).toBe(0);
		});
	});

	describe("mutate", () => {
		it("returns a population", () => {
			const mutatedResult = GeneticModel.mutate(populationModel);
			expect(mutatedResult.choice).toHaveLength(SELECT);
			expect(mutatedResult.score).toBe(12);
		});
	});

	describe("crossover", () => {
		it("if only one input, returns input", () => {
			const crossedOverResult = GeneticModel.crossover(populationModel);
			expect(crossedOverResult).toBe(populationModel);
		});

		it("returns a population", () => {
			const crossedOverResult = GeneticModel.crossover(populationModel, populationModel);
			expect(crossedOverResult.choice).toHaveLength(SELECT);
			expect(crossedOverResult.score).toBe(0);
		});
	});
});