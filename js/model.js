var Model = {
	array: null,
	title: null,
	keyValue: null,
	difference: null,
	length:null,
	initial: function(store) {
		this.array = new Array();
		this.title = new Array();
		this.keyValue = new Array();
		this.difference = new Array();
		if (store && store.map) {
			var index = 0;			
			for (var i = 0; i < store.map.length; i++) {
				var key = store.map[i].key;
				for (var j = 0; j < store.map[i].size(); j++) {
					var value = store.map[i].get(j);
					this.title.push(value);
					this.keyValue.push(this.getKey(key, value));
					this.putDiff(key, index, store.map[i].size());
				}
				index = index + store.map[i].size();
			}
			this.length=index;
			for (var i = 0; i < index; i++) {
				this.array[i] = new Array();
				for (var j = 0; j < index; j++) {
					this.array[i][j] = 0;
				}
			}
		}
	},
	getKey: function(key, value) {
		return key + ":" + value;
	},
	split: function(kv) {
		return kv.split(":");
	},
	getTitle: function() {
		return this.title;
	},
	locate: function(key, value) {
		var k = this.getKey(key, value);
		if (k) {
			for (var i = 0; i < this.keyValue.length; i++) {
				if (this.keyValue[i] == k) {
					return i;
				}
			}
		}
		return - 1;
	},
	setValue: function(row, col, value) {
		if (row >= 0 && row < this.array.length && col >= 0 && col < this.array.length) {
			this.array[row][col] = value;
		}
	},
	getValue: function(row, col, value) {
		if (row >= 0 && row < this.array.length && col >= 0 && col < this.array.length) {
			return this.array[row][col];
		}
		return 0;
	},
	putDiff: function(key, start, length) {
		if (key && this.difference) {
			var exist = false;
			for (var i = 0; i < this.difference.length; i++) {
				if (this.difference[i].key == key) {
					exist = true;
					break;
				}
			}
			if (!exist) {
				var range = Object.create(Range);
				range.key = key;
				range.start = start;
				range.length = length;
				this.difference.push(range);
			}
		}
	},
	getRange: function(key) {
		for (var i = 0; i < this.difference.length; i++) {
			if (this.difference[i].key == key) {
				return this.difference[i];
			}
		}
		return null;
	}
};
var model = Object.create(Model);
