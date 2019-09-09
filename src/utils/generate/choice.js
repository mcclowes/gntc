const randomZeroTo = (max) => Math.floor(Math.random() * max);

const required = [ 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, ];

const filterPlayers = (players, position) => players.filter( player => player["element_type"] === position);
const generateSubArrays = (players) => {
	return [
		filterPlayers(players, 1),
		filterPlayers(players, 2),
		filterPlayers(players, 3),
		filterPlayers(players, 4),
	];
};

const primary = (select, list) => {  
	const playerSubArrays = generateSubArrays(list);

	return Array(select).fill(0).map((x, i) => { 
		const validChoices = playerSubArrays[required[i]];
		const index = randomZeroTo(validChoices.length);
		return validChoices[index]; 
	});
};

const secondary = (existing) => (select, list) => {
	const playerSubArrays = generateSubArrays(list);

	let existingPositions = existing
		.map((player) => player["element_type"] - 1 );

	let requirePositions = [ 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, ];

	for (let i = 0; i < existingPositions.length; i++) {
		const toFind = existingPositions[i];

		if(requirePositions.indexOf(toFind)){
			requirePositions.splice(requirePositions.indexOf(toFind), 1);
		}
	}

	return Array(select).fill(0).map((x, i) => {
		const validChoices = playerSubArrays[requirePositions[i]];
		const index = randomZeroTo(validChoices.length);
		return validChoices[index]; 
	});
};

const choice = {
	primary,
	secondary,
};

export default choice;