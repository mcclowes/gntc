import * as arrangement from "../arrangement";
import score from "../../score";

const bestMid = [
	{ 
		predicted_points: 10,
		element_type: 1,
	},
	{ 
		predicted_points: 1,
		element_type: 1,
	},
	{ 
		predicted_points: 10,
		element_type: 2,
	},
	{ 
		predicted_points: 10,
		element_type: 2,
	},
	{ 
		predicted_points: 10,
		element_type: 2,
	},
	{ 
		predicted_points: 10,
		element_type: 2,
	},
	{ 
		predicted_points: 2,
		element_type: 2,
	},
	{ 
		predicted_points: 50,
		element_type: 3,
	},
	{ 
		predicted_points: 50,
		element_type: 3,
	},
	{ 
		predicted_points: 50,
		element_type: 3,
	},
	{ 
		predicted_points: 50,
		element_type: 3,
	},
	{ 
		predicted_points: 4,
		element_type: 3,
	},
	{ 
		predicted_points: 10,
		element_type: 4,
	},
	{ 
		predicted_points: 10,
		element_type: 4,
	},
	{ 
		predicted_points: 4,
		element_type: 4,
	},
];

const bestDef = [
	{ 
		predicted_points: 10,
		element_type: 1,
	},
	{ 
		predicted_points: 1,
		element_type: 1,
	},
	{ 
		predicted_points: 70,
		element_type: 2,
	},
	{ 
		predicted_points: 70,
		element_type: 2,
	},
	{ 
		predicted_points: 70,
		element_type: 2,
	},
	{ 
		predicted_points: 70,
		element_type: 2,
	},
	{ 
		predicted_points: 2,
		element_type: 2,
	},
	{ 
		predicted_points: 10,
		element_type: 3,
	},
	{ 
		predicted_points: 10,
		element_type: 3,
	},
	{ 
		predicted_points: 10,
		element_type: 3,
	},
	{ 
		predicted_points: 10,
		element_type: 3,
	},
	{ 
		predicted_points: 4,
		element_type: 3,
	},
	{ 
		predicted_points: 10,
		element_type: 4,
	},
	{ 
		predicted_points: 10,
		element_type: 4,
	},
	{ 
		predicted_points: 4,
		element_type: 4,
	},
];

describe("positions", () => {
	it("validates valid", () => {
		expect(arrangement.bestArrangement(bestDef, score.byPredictedPoints).score).toBe(420);
	});

	it("rejects invalid", () => {
		expect(arrangement.bestArrangement(bestMid, score.byPredictedPoints).score).toBe(320);
	});
});