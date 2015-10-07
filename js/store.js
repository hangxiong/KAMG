var Store = {
	map: null,
	put: function(key, value) {
		if (!this.map) {
			this.map = new Array();
		}
		var keyList = this.get(key);
		if (!keyList) {
			keyList = Object.create(KeyList);
			keyList.initial(key);
			this.map.push(keyList);
		}
		keyList.put(value);
	},
	get: function(key) {
		if (this.map) {
			for (var i = 0; i < this.map.length; i++) {
				if (this.map[i].key == key) {
					return this.map[i];
				}
			}
		}
		return null;
	},
	remove: function(key, value) {
		if (this.map) {
			var obj = this.get(key);
			if (obj) {
				var index = obj.getIndex(value);
				if (index != -1) {
					obj.list.splice(index, 1);
				}
			}
		}
	},
	getKey: function(villageKey, groupKey, genealogyKey) {
		return villageKey + "_" + groupKey + "_" + genealogyKey;
	}
}
var selectedData = Object.create(Store);