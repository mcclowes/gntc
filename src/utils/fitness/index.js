import { find, score, } from "../../utils";

const byPPG = (freeHit = true, freeTransfers = 0) => (solution, comparison) => {
	const arrangementScore = find
		.arrangement
		.bestArrangement(solution, score.byPointsPerGame)
		.score;

	const distanceModifier = comparison 
		? find.distance.getModifier(comparison, solution, freeTransfers) 
		: 0;

	return freeHit
		? arrangementScore - distanceModifier // predicted score of team - minus transfer points
		: arrangementScore;
};

const byPredictedPoints = (freeHit = true, freeTransfers = 0) => (solution, comparison) => {
	const arrangementScore = find
		.arrangement
		.bestArrangement(solution, score.byPredictedPoints)
		.score;
  
	const distanceModifier = comparison 
		? find.distance.getModifier(comparison, solution, freeTransfers) 
		: 0;

	return freeHit
		? arrangementScore - distanceModifier // predicted score of team - minus transfer points
		: arrangementScore;
};

const fitness = {
	byPPG,
	byPredictedPoints,
};

export default fitness;