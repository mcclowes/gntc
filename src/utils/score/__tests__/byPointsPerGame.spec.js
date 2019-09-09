import score from "../index";

const model = [
	{ 
		points_per_game: 10,
		id: 1,
	},
	{ 
		points_per_game: 1,
		id: 2,
	},
	{ 
		points_per_game: 10,
		id: 3,
	},
	{ 
		points_per_game: 10,
		id: 4,
	},
	{ 
		points_per_game: 10,
		id: 5,
	},
	{ 
		points_per_game: 10,
		id: 6,
	},
	{ 
		points_per_game: 2,
		id: 7,
	},
	{ 
		points_per_game: 50,
		id: 8,
	},
	{ 
		points_per_game: 50,
		id: 9,
	},
	{ 
		points_per_game: 50,
		id: 10,
	},
	{ 
		points_per_game: 50,
		id: 11,
	},
	{ 
		points_per_game: 4,
		id: 12,
	},
	{ 
		points_per_game: 10,
		id: 13,
	},
	{ 
		points_per_game: 1000,
		id: 14,
	},
	{ 
		points_per_game: 4,
		id: 15,
	},
];

describe("positions", () => {
	it("validates valid", () => {
		expect(score.byPointsPerGame(model)).toBe(2271);
	});
});