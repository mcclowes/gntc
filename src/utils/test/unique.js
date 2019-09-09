const testUnique = (list) => {
	let reducedList = [];
	list.forEach(player => {
		if(!player) { return; }
		reducedList.push(player.id);
	});
  
	return new Set(reducedList).size === list.length;
};

export default testUnique;