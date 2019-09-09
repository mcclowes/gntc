import choice from "../choice";

const fullList = [
	{ "id": 1, name: "Name 1", element_type: 0, },
	{ "id": 2, name: "Name 2", element_type: 0, },
	{ "id": 3, name: "Name 3", element_type: 1, },
	{ "id": 4, name: "Name 4", element_type: 1, },
	{ "id": 5, name: "Name 5", element_type: 1, },
	{ "id": 6, name: "Name 6", element_type: 1, },
	{ "id": 7, name: "Name 7", element_type: 1, },
	{ "id": 8, name: "Name 8", element_type: 2, },
	{ "id": 9, name: "Name 9", element_type: 2, },
	{ "id": 10, name: "Name 10", element_type: 2, },
	{ "id": 11, name: "Name 11", element_type: 2, },
	{ "id": 12, name: "Name 12", element_type: 2, },
	{ "id": 13, name: "Name 13", element_type: 3, },
	{ "id": 14, name: "Name 14", element_type: 3, },
	{ "id": 15, name: "Name 15", element_type: 3, },
	{ "id": 16, name: "Name 16", element_type: 1, },
	{ "id": 17, name: "Name 17", element_type: 2, },
	{ "id": 18, name: "Name 18", element_type: 3, },
];


describe("generate choice", () => {
	it("returns correct length", () => {
		expect(choice.primary(15, fullList)).toHaveLength(15);
	});
});

describe("generate choice", () => {
	it("returns correct length", () => {
		expect(choice.secondary(4, fullList)).toHaveLength(4);
	});
});