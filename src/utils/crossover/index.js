import { sort, } from "../../utils";

const random = (solution1, solution2) => {
	solution1.choice = sort.byPosition(solution1.choice);
	solution2.choice = sort.byPosition(solution2.choice);

	const crossedOver = {
		score: 0,
		choice: solution1.choice.map((player, i) => {
			return Math.random() >= 0.5 ? player : solution2.choice[i]; 
		}),
	};

	return crossedOver;
};

const crossover = {
	random,
};

export default crossover;