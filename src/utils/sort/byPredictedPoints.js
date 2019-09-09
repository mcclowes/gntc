const sortPredictedPoints = (list) => {
	return list
		.sort((a, b) => { 
			return b.predicted_points - a.predicted_points; 
		});
};

export default sortPredictedPoints;