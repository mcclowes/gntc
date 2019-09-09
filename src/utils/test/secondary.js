import price from "./price";
import unique from "./unique";
import positions from "./positions";
import teams from "./teams";

const testSecondary = (list, primary) => {
	const testPrice = price([ ...list, ...primary, ]);
	const testUnique = unique([ ...list, ...primary, ]);
	const testPositions = positions([ ...list, ...primary, ]);
	const testTeams = teams([ ...list, ...primary, ]);

	return [ testPrice, testUnique, testPositions, testTeams, ].every(test=>test === true);
};

export default testSecondary;