var Affinity = {
	pairs: null,
	initial: function() {
		if (!this.pairs) {
			this.pairs = new Array();
		}
	},
	getKey: function(villageKey, groupKey, genealogyKey) {
		return villageKey + "_" + groupKey + "_" + genealogyKey;
	},
	parser: function() {
		this.initial();
		while (!reader.AtEndOfLine) {
			var dataLine = reader.ReadLine();
			var strs = dataLine.split(' ');
			if (strs.length == 8) {
				var leftKey = this.getKey(strs[0], strs[1], strs[2]);
				var rightKey = this.getKey(strs[4], strs[5], strs[6]);
				var leftKeyValue = Object.create(KeyValue);
				var rightKeyValue = Object.create(KeyValue);
				leftKeyValue.initial(leftKey, strs[3]);
				rightKeyValue.initial(rightKey, strs[7]);
				var pair = Object.create(Pair);
				pair.initial(leftKeyValue, rightKeyValue);
				this.pairs.push(pair);
			}
		}
	},
	getPairs: function(from,to) {
		var result = null;
		if (this.pairs) {
			for (var i = 0; i < this.pairs.length; i++) {
				var pair = this.pairs[i];
				if (pair.exist(from.key) && pair.exist(to.key)) {
					if (!result) {
						result = new Array();
					}
					result.push(pair);
				}
			}
		}
		return result;
	}
};
var affinity = Object.create(Affinity);
