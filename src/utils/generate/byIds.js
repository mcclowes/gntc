const findMatch = (item, list) => {
	return list.find( listItem => {
		return item.id === listItem.id; 
	});
};

const generateByIds = (ids, list) => {
	return ids.map(item => {
		return findMatch(item, list);
	});
};

export default generateByIds;