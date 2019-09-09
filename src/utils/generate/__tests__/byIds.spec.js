import byIds from "../byIds";

const ids = [
	{ "id": 1, },
	{ "id": 2, },
	{ "id": 3, },
	{ "id": 4, },
	{ "id": 5, },
	{ "id": 6, },
	{ "id": 7, },
	{ "id": 8, },
	{ "id": 9, },
	{ "id": 10, },
	{ "id": 11, },
	{ "id": 12, },
	{ "id": 13, },
	{ "id": 14, },
	{ "id": 15, },
];

const fullList = [
	{ "id": 1, name: "Name 1", },
	{ "id": 2, name: "Name 2", },
	{ "id": 3, name: "Name 3", },
	{ "id": 4, name: "Name 4", },
	{ "id": 5, name: "Name 5", },
	{ "id": 6, name: "Name 6", },
	{ "id": 7, name: "Name 7", },
	{ "id": 8, name: "Name 8", },
	{ "id": 9, name: "Name 9", },
	{ "id": 10, name: "Name 10", },
	{ "id": 11, name: "Name 11", },
	{ "id": 12, name: "Name 12", },
	{ "id": 13, name: "Name 13", },
	{ "id": 14, name: "Name 14", },
	{ "id": 15, name: "Name 15", },
	{ "id": 16, name: "Name 16", },
	{ "id": 17, name: "Name 17", },
	{ "id": 18, name: "Name 18", },
];

const filteredList = [
	{ "id": 1, name: "Name 1", },
	{ "id": 2, name: "Name 2", },
	{ "id": 3, name: "Name 3", },
	{ "id": 4, name: "Name 4", },
	{ "id": 5, name: "Name 5", },
	{ "id": 6, name: "Name 6", },
	{ "id": 7, name: "Name 7", },
	{ "id": 8, name: "Name 8", },
	{ "id": 9, name: "Name 9", },
	{ "id": 10, name: "Name 10", },
	{ "id": 11, name: "Name 11", },
	{ "id": 12, name: "Name 12", },
	{ "id": 13, name: "Name 13", },
	{ "id": 14, name: "Name 14", },
	{ "id": 15, name: "Name 15", },
];


describe("generate byIds", () => {
	it("returns correct list", () => {
		expect(byIds(ids, fullList)).toEqual(filteredList);
	});
});