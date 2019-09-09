const sortByPointsPerGame = (list) => {
	return list.sort((a, b) => { return b.points_per_game - a.points_per_game; });
};

export default sortByPointsPerGame;