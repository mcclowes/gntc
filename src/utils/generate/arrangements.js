import sort from "../sort";
// positions
// 1,3,4,3 - 1
// 1,3,5,2 - 2
// 1,4,3,3 - 3
// 1,4,4,2 - 4

const generateArrangement = (list, scoringFunction, formation) => {
	let arrangement = {
		choice: {
			full: [],
			goa: sort.byPredictedPoints(list.goa).slice(0, formation[0]), 
			def: sort.byPredictedPoints(list.def).slice(0, formation[1]), 
			mid: sort.byPredictedPoints(list.mid).slice(0, formation[2]), 
			str: sort.byPredictedPoints(list.str).slice(0, formation[3]),
		},
		subs: {
			full: [],
			goa: sort.byPredictedPoints(list.goa).slice(formation[0]), 
			def: sort.byPredictedPoints(list.def).slice(formation[1]), 
			mid: sort.byPredictedPoints(list.mid).slice(formation[2]), 
			str: sort.byPredictedPoints(list.str).slice(formation[3]),
		},
		score: 0,
	};

	arrangement.choice.full = [
		...arrangement.choice.goa,
		...arrangement.choice.def,
		...arrangement.choice.mid,
		...arrangement.choice.str,
	];

	arrangement.subs.full = [
		...arrangement.subs.goa,
		...arrangement.subs.def,
		...arrangement.subs.mid,
		...arrangement.subs.str,
	];

	arrangement.score = Number(scoringFunction(arrangement.choice.full));
	return arrangement;
};

const generateArrangements = (list, scoringFunction) => {
	const mappedPlayers = {
		goa: list.filter( player => { return player.element_type === 1; } ),
		def: list.filter( player => { return player.element_type === 2; } ),
		mid: list.filter( player => { return player.element_type === 3; } ),
		str: list.filter( player => { return player.element_type === 4; } ),
	};

	const arr1 = generateArrangement(mappedPlayers, scoringFunction, [ 1, 3, 4, 3, ]);
	const arr2 = generateArrangement(mappedPlayers, scoringFunction, [ 1, 3, 5, 2, ]);
	const arr3 = generateArrangement(mappedPlayers, scoringFunction, [ 1, 4, 3, 3, ]);
	const arr4 = generateArrangement(mappedPlayers, scoringFunction, [ 1, 4, 4, 2, ]);

	return [ arr1, arr2, arr3, arr4, ];
};

export default generateArrangements;