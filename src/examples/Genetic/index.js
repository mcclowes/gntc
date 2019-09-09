import { find, score, } from "../../utils";
import { Component, } from "react";

import PrimaryGeneticGenerator from "./primary";
import SecondaryGeneticGenerator from "./substitutes";
import PrintTeam from "../../components/Team";
import autobind from "autobind-decorator";
import api from "../../api";

const combinedData = api.whatTheFPLData();

// settings
const FREE_HIT = false;
const FREE_TRANSFERS = 1;
const EXISTING_TEAM = [
	{ "id": 212, }, // ederson
	{ "id": 181, }, // robertson
	{ "id": 358, }, // catchart
	{ "id": 182, }, // trent
	{ "id": 59, }, // ake
	{ "id": 214, }, // sterling
	{ "id": 191, }, // salah
	{ "id": 394, }, // wilsher
	{ "id": 151, }, // sigurdsson
	{ "id": 365, }, // success
	{ "id": 67, }, // wilson
	{ "id": 48, }, // button
	{ "id": 89, }, // gibson
	{ "id": 135, }, // townsend
	{ "id": 315, }, // long
];

class PrintGeneticTeam extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadingPrimary: 0,
			loadingSecondary: 0,
			solution: null,
			substitutes: null,
			fullTeam: null,
		};
	}


	async componentDidMount() {
		this.primaryElo = PrimaryGeneticGenerator(
			combinedData.players, 
			combinedData.topPlayers, 
			EXISTING_TEAM, 
			FREE_HIT, 
			FREE_TRANSFERS
		).runIterations();

		this.runPrimarySelection();
	}

	@autobind
	async runPrimarySelection() {
		const { value, done, } = this.primaryElo.next();
	
		if (done) {
			await this.setState(
				{
					loadingPrimary: 1,
					solution: value.choice.slice(0, 11),
				},
			);

			this.secondaryElo = SecondaryGeneticGenerator(
				combinedData.players, 
				combinedData.topPlayers, 
				this.state.solution, 
				EXISTING_TEAM, 
				FREE_HIT, 
				FREE_TRANSFERS
			).runIterations();

			this.runSecondarySelection();
		} else {
			setTimeout(() => this.setState(
				{
					loadingPrimary: value.progress,
				}, 
				this.runPrimarySelection
			));
		}
	}

	@autobind
	async runSecondarySelection() {
		const { value, done, } = this.secondaryElo.next();

		if (done) {
			await this.setState(
				{
					loadingSecondary: 1,
					substitutes: value.choice,
				},
			);

			this.chooseTeam();
		} else {
			setTimeout(() => { 
				this.setState(
					{
						loadingSecondary: value.progress,
					}, 
					this.runSecondarySelection
				);
			});
		}
	}

	chooseTeam() {
		const solution = this.state.solution; 
		const substitutes = this.state.substitutes;

		if (solution && substitutes) {
			console.log(solution, substitutes);
			const combinedTeam = [ ...solution, ...substitutes, ];
			
			console.log("Combined team", combinedTeam);

			find.captain(combinedTeam);

			// const mappedPlayers = {
			// 	goa: combinedTeam.filter( player => { return player.element_type === 1; } ),
			// 	def: combinedTeam.filter( player => { return player.element_type === 2; } ),
			// 	mid: combinedTeam.filter( player => { return player.element_type === 3; } ),
			// 	str: combinedTeam.filter( player => { return player.element_type === 4; } ),
			// };

			const bestArrangement = find.arrangement.bestArrangement(combinedTeam, score.byPredictedPoints);

			let myTeam = {
				full: [ ...combinedTeam, ],
				chosen: {
					full: bestArrangement.choice.full,
					goa: bestArrangement.choice.goa,
					def: bestArrangement.choice.def,
					mid: bestArrangement.choice.mid,
					str: bestArrangement.choice.str,
				},
				subs: {
					full: bestArrangement.subs.full,
					goa: bestArrangement.subs.goa,
					def: bestArrangement.subs.def,
					mid: bestArrangement.subs.mid,
					str: bestArrangement.subs.str,
				},
				cost: 0,
				distance: find.distance.get(combinedTeam, EXISTING_TEAM),
			};

			myTeam.cost = myTeam.full.reduce((acc, player) => acc + Number(player.price), 0);
			myTeam.points = myTeam.chosen.full.reduce((acc, player) => acc + Number(player.points_per_game), 0);
			myTeam.predicted = myTeam.chosen.full.reduce((acc, player) => acc + Number(player.predicted_points), 0);
			myTeam.last_points = myTeam.chosen.full.reduce((acc, player) => acc + Number(player.event_points), 0);
			myTeam.metric = myTeam.chosen.full.reduce((acc, player) => acc + Number(player.metric), 0);
			myTeam.total_points = myTeam.chosen.full.reduce((acc, player) => acc + Number(player.total_points), 0);

			console.log("Final full team", myTeam);

			this.setState(
				{
					fullTeam: myTeam,
				},
			);
		}
	}

	render () {
		return (this.state.fullTeam === null) 
			? <div>
				<div>Loading primary choices... {Math.floor(this.state.loadingPrimary * 100)}%</div> 
					
				<div>Loading substitute choices... {Math.floor(this.state.loadingSecondary * 100)}%</div> 
			</div> 
			: <PrintTeam team = { this.state.fullTeam } />;
	}
};

export default PrintGeneticTeam;

