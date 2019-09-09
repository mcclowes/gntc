import sort from "../sort";

const scoreByPredictedPoints = (list) => {
	sort.byPredictedPoints(list);

	return Number(
		list
			.reduce((acc, player, i) => {
    		return i === 0 ? 
    			acc + Number(player["modified_predicted_points"]) * 2 : 
    			acc + Number(player["modified_predicted_points"]);
    	}, 0)
			.toFixed(2) 
	);
};

export default scoreByPredictedPoints;