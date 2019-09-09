//import sort from "../sort";

const get = (team1, team2) => {
	let reducedList = [];
	team1.map(player=>reducedList.push(player.id));
	team2.map(player=>reducedList.push(player.id));

	return new Set(reducedList).size - team1.length;
};

const getModifier = (team1, team2, freeTransfers = 0) => {
	const nonFreeTransfers = get(team1, team2) - freeTransfers + 1;
	return nonFreeTransfers * 4;
};

const distance = { get, getModifier, };

export default distance;