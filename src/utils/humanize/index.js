const teamNames = {
	"Arsenal"                  : "Arsenal",
	"Aston Villa"              : "Astone Villa",
	"Bournemouth"              : "Bournemouth",
	"Brighton and Hove Albion" : "Brighton",
	"Burnley"                  : "Burnley",
	"Cardiff City"             : "Cardiff",
	"Chelsea"                  : "Chelsea",
	"Crystal Palace"           : "Crystal Palace",
	"Everton"                  : "Everton",
	"Fulham"                   : "Fulham",
	"Huddersfield Town"        : "Huddersfield",
	"Leicester City"           : "Leicester",
	"Liverpool"                : "Liverpool",
	"Manchester City"          : "Man City",
	"Manchester United"        : "Man United",
	"Newcastle United"         : "Newcastle",
	"Norwich City"             : "Norwich",
	"Sheffield United"         : "Sheffield",
	"Southampton"              : "Southampton",
	"Tottenham Hotspur"        : "Tottenham",
	"Watford"                  : "Watford",
	"West Ham United"          : "West Ham",
	"Wolverhampton Wanderers"  : "Wolves",
};

const teamName = (team) => teamNames[team];

const humanize = {
	teamName,
};

export default humanize;