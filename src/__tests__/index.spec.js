import Genetic from "../index";

const ITERATIONS = 1000;
const POPULATION_SIZE = 10;
const SELECT = 15;

const testFitness = () => (solution) => {
	return solution.reduce((acc, item) => acc + item.points, 0)
}

const testCrossover = (solution1, solution2) => {
	const splitPoint = Math.min(solution1.choice.length / 2, solution1.choice[0].points + 1)

	return {
		score: 0,
		choice: [
			...solution1.choice.slice(0, splitPoint), 
			...solution2.choice.slice(splitPoint)
		],
	}
}

const testChoice = (select, list) => {
	return startingSolution
}

const testRestriction = () => {
	return true
}


const items = [
	{ "id": 1, "points": 1, element_type: 1, },
	{ "id": 10, "points": 2, element_type: 1, },
	{ "id": 12, "points": 4, element_type: 1, },
	{ "id": 12, "points": 3, element_type: 2, },
	{ "id": 13, "points": 6, element_type: 2, },
	{ "id": 14, "points": 2, element_type: 2, },
	{ "id": 15, "points": 10, element_type: 2, },
	{ "id": 16, "points": 2, element_type: 2, },
	{ "id": 17, "points": 1, element_type: 3, },
	{ "id": 18, "points": 2, element_type: 3, },
	{ "id": 19, "points": 1, element_type: 3, },
	{ "id": 2, "points": 1, element_type: 3, },
	{ "id": 20, "points": 1, element_type: 3, },
	{ "id": 3, "points": 7, element_type: 3, },
	{ "id": 4, "points": 8, element_type: 3, },
	{ "id": 5, "points": 9, element_type: 3, },
	{ "id": 6, "points": 1, element_type: 3, },
	{ "id": 7, "points": 1, element_type: 4, },
	{ "id": 8, "points": 1, element_type: 4, },
	{ "id": 9, "points": 9, element_type: 4, },
];

const startingSolution = items.slice(0, SELECT)

const populationModel = { choice: startingSolution, score: 0, };
const populationModel2 = { choice: startingSolution.reverse(), score: 0, };

let GeneticModel;

const createGenetic = (freeHit = false, freeTransfers = 0) => {
	return new Genetic({
		iterations: ITERATIONS,
		list: items,
		options: items,
		populationSize: POPULATION_SIZE,
		select: SELECT,
		startingSolution: startingSolution,
		utilities: {
			fitness: (solution, comparison) => testFitness()(solution, comparison),
			crossover: testCrossover,
			generateChoice: testChoice,
			restrictions: [
				testRestriction
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
			console.log(GeneticModel.createSeed())
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

			expect(GeneticModel.createStartingSolution().score).toBe(51);
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

			console.log(startingSolution)
			console.log(evolveResult[0].choice)
			console.log(evolveResult[1].choice)
			console.log(evolveResult[2].choice)
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
			expect(mutatedResult.score).toBe(51);
		});
	});

	describe("crossover", () => {
		it("if only one input, returns input", () => {
			const crossedOverResult = GeneticModel.crossover(populationModel);
			expect(crossedOverResult).toBe(populationModel);
		});

		it("returns a population", () => {
			const crossedOverResult = GeneticModel.crossover(populationModel, populationModel2);
			expect(crossedOverResult.choice).toHaveLength(SELECT);
			expect(crossedOverResult.score).toBe(0);
			expect(crossedOverResult.choice).not.toEqual(populationModel);
		});
	});
});