import testPositions from "../positions";

const model = [
	{ element_type: 1, },
	{ element_type: 1, },
	{ element_type: 2, },
	{ element_type: 2, },
	{ element_type: 2, },
	{ element_type: 2, },
	{ element_type: 2, },
	{ element_type: 3, },
	{ element_type: 3, },
	{ element_type: 3, },
	{ element_type: 3, },
	{ element_type: 3, },
	{ element_type: 4, },
	{ element_type: 4, },
	{ element_type: 4, },
];

describe("positions", () => {
	it("validates valid", () => {
		expect(testPositions(model)).toBe(true);
	});

	it("rejects invalid", () => {
		model.pop();
		expect(testPositions(model)).toBe(false);
	});
});