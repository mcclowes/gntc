import sort from "../index";

const model = [
	{ 
		element_type: 1,
		id: 1,
	},
	{ 
		element_type: 2,
		id: 2,
	},
	{ 
		element_type: 3,
		id: 3,
	},
	{ 
		element_type: 4,
		id: 4,
	},
	{ 
		element_type: 5,
		id: 5,
	},
	{ 
		element_type: 6,
		id: 6,
	},
	{ 
		element_type: 7,
		id: 7,
	},
	{ 
		element_type: 8,
		id: 8,
	},
	{ 
		element_type: 9,
		id: 9,
	},
	{ 
		element_type: 10,
		id: 10,
	},
	{ 
		element_type: 11,
		id: 11,
	},
	{ 
		element_type: 12,
		id: 12,
	},
	{ 
		element_type: 13,
		id: 13,
	},
	{ 
		element_type: 14,
		id: 14,
	},
	{ 
		element_type: 15,
		id: 15,
	},
];

describe("positions", () => {
	it("validates valid", () => {
		expect(sort.byPointsPerGame(model)[0].id).toBe(1);
	});
});