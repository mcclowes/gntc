import score from "../index";

const model = [
	{ 
		predicted_points: 10,
		id: 1,
	},
	{ 
		predicted_points: 1,
		id: 2,
	},
	{ 
		predicted_points: 10,
		id: 3,
	},
	{ 
		predicted_points: 10,
		id: 4,
	},
	{ 
		predicted_points: 10,
		id: 5,
	},
	{ 
		predicted_points: 10,
		id: 6,
	},
	{ 
		predicted_points: 2,
		id: 7,
	},
	{ 
		predicted_points: 50,
		id: 8,
	},
	{ 
		predicted_points: 50,
		id: 9,
	},
	{ 
		predicted_points: 50,
		id: 10,
	},
	{ 
		predicted_points: 50,
		id: 11,
	},
	{ 
		predicted_points: 4,
		id: 12,
	},
	{ 
		predicted_points: 10,
		id: 13,
	},
	{ 
		predicted_points: 1000,
		id: 14,
	},
	{ 
		predicted_points: 4,
		id: 15,
	},
];

describe("positions", () => {
	it("validates valid", () => {
		expect(score.byPredictedPoints(model)).toBe(2271);
	});
});