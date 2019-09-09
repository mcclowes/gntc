const sortByPosition = (list) => {
	return list.sort((a, b) => b["element_type"] - a["element_type"]);
};

export default sortByPosition;