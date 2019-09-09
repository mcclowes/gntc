import testPrice from "../price";

const model = [
	{ price: 5, },
	{ price: 10, },
];

describe("testPrice", () => {
	it("validates valid", () => {
		expect(testPrice(model)).toBe(true);
	});

	it("rejects invalid", () => {
    	model[0].price = 150;
		expect(testPrice(model)).toBe(false);
	});
});