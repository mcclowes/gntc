import * as distance from "../distance";

const currentTeam = [
	{ "id": 1, },
	{ "id": 10, },
	{ "id": 11, },
	{ "id": 12, },
	{ "id": 13, },
	{ "id": 14, },
	{ "id": 15, },
	{ "id": 2, },
	{ "id": 3, },
	{ "id": 4, },
	{ "id": 5, },
	{ "id": 6, },
	{ "id": 7, },
	{ "id": 8, },
	{ "id": 9, },
];

const newTeam1 = [
	{ "id": 10, },
	{ "id": 11, },
	{ "id": 12, },
	{ "id": 13, },
	{ "id": 14, },
	{ "id": 15, },
	{ "id": 16, },
	{ "id": 2, },
	{ "id": 3, },
	{ "id": 4, },
	{ "id": 5, },
	{ "id": 6, },
	{ "id": 7, },
	{ "id": 8, },
	{ "id": 9, },
];

const newTeam2 = [
	{ "id": 10, },
	{ "id": 11, },
	{ "id": 12, },
	{ "id": 13, },
	{ "id": 14, },
	{ "id": 15, },
	{ "id": 16, },
	{ "id": 17, },
	{ "id": 18, },
	{ "id": 19, },
	{ "id": 20, },
	{ "id": 6, },
	{ "id": 7, },
	{ "id": 8, },
	{ "id": 9, },
];

describe("distance", () => {
	describe("getDistance", () => {
		it("returns correct distance", () => {
			expect(distance.getDistance(currentTeam, newTeam1)).toBe(1);
			expect(distance.getDistance(currentTeam, newTeam2)).toBe(5);
		});
	});

	describe("getDistanceModifier", () => {
		it("returns correct distance", () => {
			expect(distance.getDistanceModifier(currentTeam, newTeam1)).toBe(2 * 4);
			expect(distance.getDistanceModifier(currentTeam, newTeam2)).toBe(6 * 4);
		});

		it("returns correct distance with free transfers included", () => {
			expect(distance.getDistanceModifier(currentTeam, newTeam1, 1)).toBe(1 * 4);
			expect(distance.getDistanceModifier(currentTeam, newTeam1, 2)).toBe(0 * 4);

			expect(distance.getDistanceModifier(currentTeam, newTeam2, 1)).toBe(5 * 4);
			expect(distance.getDistanceModifier(currentTeam, newTeam2, 3)).toBe(3 * 4);
			expect(distance.getDistanceModifier(currentTeam, newTeam2, 5)).toBe(1 * 4);
		});
	});
});