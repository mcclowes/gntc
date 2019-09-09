const testPrice = (list) => {
	return list.reduce((acc, player) => {
		if(!player) { return 999; }
    
		return acc + Number(player.price);
	}, 0) <= 100;
};

export default testPrice;