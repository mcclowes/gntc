import fitness from "../index";

const currentTeam = [
	{ "id": 1, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 10, "points_per_game": 1, "predicted_points": 1, element_type: 1, },
	{ "id": 12, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 12, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 13, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 14, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 15, "points_per_game": 1, "predicted_points": 1, element_type: 2, },
	{ "id": 2, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 3, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 4, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 5, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 6, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 7, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 8, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 9, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
];

const newTeam1 = [
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

const newTeam2 = [
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
	{ "id": 20, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 6, "points_per_game": 1, "predicted_points": 1, element_type: 3, },
	{ "id": 7, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 8, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
	{ "id": 9, "points_per_game": 1, "predicted_points": 1, element_type: 4, },
];

describe("fitness", () => {
	describe("byPPG", () => {
		it("returns correct distance", () => {
			expect(fitness.byPPG()(newTeam1, currentTeam)).toBe(12 - 4);
			expect(fitness.byPPG()(newTeam2, currentTeam)).toBe(12 - 20);

			expect(fitness.byPPG(1)(newTeam1, currentTeam)).toBe(12);
			expect(fitness.byPPG(1)(newTeam2, currentTeam)).toBe(12 - 16);
		});
	});

	describe("byPredictedPoints", () => {
		it("returns correct distance", () => {
			expect(fitness.byPredictedPoints()(newTeam1, currentTeam)).toBe(12 - 4);
			expect(fitness.byPredictedPoints()(newTeam2, currentTeam)).toBe(12 - 20);

			expect(fitness.byPredictedPoints(1)(newTeam1, currentTeam)).toBe(12);
			expect(fitness.byPredictedPoints(1)(newTeam2, currentTeam)).toBe(12 - 16);
		});
	});

	describe("byFreeHitScore", () => {
		it("returns correct distance", () => {
			expect(fitness.byFreeHitScore(newTeam1, currentTeam)).toBe(12);
			expect(fitness.byFreeHitScore(newTeam2, currentTeam)).toBe(12);
		});
	});
});