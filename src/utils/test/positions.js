// const testGoa = (solution) => {
// 	const filteredPlayers = list.filter( player => { return player.element_type === 1; } );
// 	const valid = filteredPlayers == true && filteredPlayers.length(2);
// 	if (valid){console.log(filteredPlayers)}
// 	return true
// };
// const testDef = (solution) => {
// 	const filteredPlayers = list.filter( player => { return player.element_type === 2; } );
// 	const valid = filteredPlayers == true && filteredPlayers.length(5);
// 	if (valid){console.log(filteredPlayers)}
// 	return true
// };
// 
// const testMid = (solution) => {
// 	const filteredPlayers = list.filter( player => { return player.element_type === 3; } );
// 	const valid = filteredPlayers == true && filteredPlayers.length(5);
// 	if (valid){console.log(filteredPlayers)}
// 	return true
// };
// 
// const testStr = (solution) => {
// 	const filteredPlayers = list.filter( player => { return player.element_type === 4; } );
// 	const valid = filteredPlayers == true && filteredPlayers.length(3);
// 	if (valid){console.log(filteredPlayers)}
// 	return true
// };

const requirements = {
	goa: {
		type: 1,
		count: 2,
	},
	def: {
		type: 2,
		count: 5,
	},
	mid: {
		type: 3,
		count: 5,
	},
	str: {
		type: 4,
		count: 3,
	},
};

const testPosition = (list, position) => {
	const filteredPlayers = list
		.filter( player => {
			if(!player){ return false; }
			return player.element_type === requirements[position].type; 
		} );

	return filteredPlayers.length && filteredPlayers.length === requirements[position].count;
};

const testPositions = (list) => {
	return testPosition(list, "goa") && 
        testPosition(list, "def") && 
        testPosition(list, "mid") && 
        testPosition(list, "str");
};

export default testPositions;