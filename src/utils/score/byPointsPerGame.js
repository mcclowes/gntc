import sort from "../sort";

const scoreByPointsPerGame = (list) => {
	sort.byPointsPerGame(list);

	return Number(
		list
			.reduce((acc, player, i) => {
    		return i === 0 ? 
    			acc + Number(player["points_per_game"]) * 2 : 
    			acc + Number(player["points_per_game"]);
    	}, 0)
			.toFixed(2)
	);
};

export default scoreByPointsPerGame;