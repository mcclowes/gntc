const assignCaptain = (list) => {
	let captain = { 
		points_per_game: 0, 
		predicted_points: 0,
	};

	list.forEach(player => {
		captain = player.predicted_points > captain.predicted_points ? player : captain; 
	});
	
	captain.captain = true;
	
	captain.points_per_game = captain.points_per_game * 2;
	captain.predicted_points = captain.predicted_points * 2;
	captain.price_per_point = captain.price_per_point / 2;

	return captain;
};

export default assignCaptain;