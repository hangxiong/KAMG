var HashMap = {
	_size:0,
	_entry:null,
	putValue:function(key, value) {
		if(!this._entry){
			this._entry=new Array();
		}
		if (!this.containsKey(key)) {
			this._size++;
		}
		this._entry[key] = value;
	},
	getValue:function(key) {
		return this.containsKey(key) ? this._entry[key] : null;
	},
	containsKey:function(key) {
		if (! (key in this._entry)) {
			return false;
		} else {
			return true;
		}
	},
	remove:function(key) {
		if (this.containsKey(key) && (delete this._entry[key])) {
			this._size--;
		}
	},
	containsValue:function(value) {
		for (var temp in this._entry) {
			if (this._entry[temp] == value) {
				return true;
			}
		}
		return false;
	},
	getValues:function() {
		var values = new Array();
		for (var temp in this._entry) {
			values.push(this._entry[temp]);
		}
		return values;
	},
	getKeys:function() {
		var keys = new Array();
		for (var temp in this._entry) {
			keys.push(temp);
		}
		return keys;
	},
	size:function() {
		return this._size;
	},
	removeAll:function() {
		this._size = 0;
		this._entry = new Object();
	}
}
