const testTeams = (list) => {	
	let teams = [];
	
	list.forEach(
		(player) => {
			if(!player) { return; }
			teams.push(player["team_short"]);
		}
	);

	const teamCounts = teams.map(
		(team) => {
			return teams.reduce(
				(acc, team2) => {
					return team === team2
						? acc + 1 
						: acc;
				}, 
				0);
		}
	);

	for (let team in teamCounts) {
		if (teamCounts[team] >= 4) {
			return false;
		}
	}

	return true;
};

export default testTeams;