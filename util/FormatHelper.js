class FormatHelper {
	static searchToList(searchResult) {
		let output = [];
		searchResult.hits.forEach(function(instrumentCategory) {
			// Ensure there are topHits in the category
			if (instrumentCategory.topHits) {
				instrumentCategory.topHits.forEach(function(instrument) {
					instrument.instrumentType = instrumentCategory.instrumentType;
					output.push(instrument);
				});
			}
		});
		return output;
	}
}

module.exports = {
	FormatHelper
};
