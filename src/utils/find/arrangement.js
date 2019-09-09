import generate from "../generate";

const bestArrangement = (list, scoringFunction) => {
	const arrangements = generate.arrangements(list, scoringFunction);

	arrangements
		.sort((a, b) => {
			return b.score - a.score;
		});
    
	return arrangements[0];
};

const arrangement = { bestArrangement, };

export default arrangement;