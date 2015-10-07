//the key word of ged file
var GED = { // the header of this *.ged file.
	header: 'HEAD',
	// the source of this *.ged file. It always comes from a website.
	source: 'SOUR',
	// the version of this *.ged file.
	version: 'VERS',
	// the corporation of this *.ged file.
	corporation: 'CORP',
	// the website
	website: 'WWW',
	// character set
	encoding: 'CHAR',
	// the key for individual
	indi: 'INDI',
	// full name of the individual
	name: 'NAME',
	// given name of the individual
	given: 'GIVN',
	// subname of the individual
	subname: 'SURN',
	// sex of the individual
	sex: 'SEX',
	// to store the customized key
	other: 'NOTE Other contact:',
	// the family of individual's
	family: 'FAMC',
	// the families of individual's
	families: 'FAMS',
	// the key for family
	fam: 'FAM',
	// the key of husband
	husb: 'HUSB',
	// the key of wife
	wife: 'WIFE',
	// the key of children
	chil: 'CHIL'
}; //the definition of Individual object to store individual's information
var Individual = {
	key: null,
	name: null,
	identity: null,
	subname: null,
	// default value is male.
	sex: 'M',
	families: null
}; //the definition of Family object to store the relationship of individuals
var Family = {
	key: null,
	husb: null,
	wife: null,
	children: null
}; //the definition of Tree object to store all individuals and their relationships
var Tree = {
	key: null,
	name: null,
	subname: null,
	sex: null,
	identity: null,
	generation: 0,
	parent: null,
	children: null
}; //the definition of Store object to store the cascaded address
var AddressStore = {
	id: 0,
	key: null,
	children: null,
	exists: function(key) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				var childKey = this.children[i].key;
				if (childKey && childKey == key) {
					return true;
				}
			}
			return false;
		}
	},
	getChild: function(key) {
		if (this.exists(key)) {
			for (var i = 0; i < this.children.length; i++) {
				var childKey = this.children[i].key;
				if (childKey && childKey == key) {
					return this.children[i];
				}
			}
		}
		return null;
	},
	putValue: function(value) {
		this.children.push(value);
	},
	getMaxId: function() {
		var result = 0;
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				var childId = this.children[i].id;
				if (result) {
					childId = result;
				}
				if (result < childId) {
					result = childId;
				}
			}
		}
		return result;
	},
	getChildById: function(id) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].id == id) {
					return this.children[i];
				}
			}
		}
		return null;
	},
	getIdByKey: function(key) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].key == key) {
					return this.children[i].id;
				}
			}
		}
		return 0;
	}
}; //the definition of Store object to store the genealogy information
var GenealogyStore = {
	id: 0,
	key: null,
	children: null,
	exists: function(key) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				var childKey = this.children[i].key;
				if (childKey && childKey == key) {
					return true;
				}
			}
			return false;
		}
	},
	getChild: function(key) {
		if (this.exists(key)) {
			for (var i = 0; i < this.children.length; i++) {
				var childKey = this.children[i].key;
				if (childKey && childKey == key) {
					return this.children[i];
				}
			}
		}
		return null;
	},
	putValue: function(value) {
		this.children.push(value);
	},
	getChildById: function(id) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].id == id) {
					return this.children[i];
				}
			}
		}
		return null;
	},
	getIdByKey: function(key) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].key == key) {
					return this.children[i].id;
				}
			}
		}
		return 0;
	},
	getKeyById: function(id) {
		if (this.children) {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].id == id) {
					return this.children[i].key;
				}
			}
		}
		return 0;
	}
}; // the basic information for a tree node.
var TreeNode = {
	identity: null,
	village: null,
	group: null,
	genealogy: null,
	equalVillage: function(node) {
		if (node && node.village && this.village) {
			return this.village == node.village;
		}
		return false;
	},
	equalGroup: function(node) {
		if (this.equalVillage(node)) {
			if (node.group && this.group) {
				return this.group == node.group;
			}
		}
		return false;
	},
	equalGenealogy: function(node) {
		if (this.equalGroup(node)) {
			if (node.genealogy && this.genealogy) {
				return this.genealogy == node.genealogy;
			}
		}
		return false;
	},
	equal: function(node) {
		if (this.equalGenealogy(node)) {
			if (node.identity && this.identity) {
				return this.identity == node.identity;
			}
		}
		return false;
	}
};
var KeyValue = {
	key: null,
	value: null,
	initial: function(k, v) {
		this.key = k;
		this.value = v;
	}
};
var KeyList = {
	key: null,
	list: null,
	initial: function(k) {
		this.key = k;
	},
	put: function(value) {
		if (!this.list) {
			this.list = new Array();
		}
		if (value) {
			var exist = false;
			for (var i = 0; i < this.size(); i++) {
				if (this.list[i] == value) {
					exist = true;
					break;
				}
			}
			if (!exist) {
				this.list.push(value);
			}
		}
	},
	getIndex: function(value) {
		if(this.list){
			for(var i=0;i<this.size();i++){
				if (this.list[i] == value) {
					return i;
				}
			}
		}
		return -1;
	},
	get: function(index) {
		if(this.list){
			if(index>=0&&index<this.size()){
				return this.list[index];
			}
		}
		return null;
	},
	size: function() {
		return this.list.length;
	}
};
var Pair = { // it's the KeyValue object.
	from: null,
	// it's the KeyValue object.
	to: null,
	initial: function(f, t) {
		this.from = f;
		this.to = t;
	},
	exist: function(key) {
		if (this.from.key == key || this.to.key == key) {
			return true;
		}
		return false;
	}
};
var TreeGraph = {
	store: null,
	put: function(f, t) {
		if (!this.store) {
			this.store = new Array();
		}
		var from = this.get(f);
		if (!from) {
			from = Object.create(KeyList);
			from.initial(f);
			this.store.push(from);
		}
		from.put(t);
		var to = this.get(t);
		if (!to) {
			to = Object.create(KeyList);
			to.initial(t);
			this.store.push(to);
		}
		to.put(f);
	},
	get: function(key) {
		for (var i = 0; i < this.store.length; i++) {
			if (this.store[i].key == key) {
				return this.store[i];
			}
		}
		return null;
	},
	next: function(key) {
		var curr = this.get(key);
		if (curr) {
			for (var i = 0; i < curr.size(); i++) {
				var n = curr.get(i);
				if (!this.get(n).isVisited) {
					return n;
				}
			}
		}
		return null;
	},
	change: function(key, state) {
		var curr = this.get(key);
		if (curr) {
			curr.isVisited = state;
		}
	},
	reset: function() {
		if (this.store) {
			for (var i = 0; i < this.store.length; i++) {
				this.store[i].isVisited = false;
			}
		}
	}
};
var PathNode = {
	node: null,
	children: null,
	initial: function(n) {
		this.node = n;
		this.children = new Array();
	},
	put: function(child) {
		if (!this.children) {
			var exist = false;
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i] == child) {
					exist = true;
					break;
				}
			}
			if (!exist) {
				this.children.push(child);
			}
		}
	},
	size: function() {
		if (this.children) {
			return this.children.length;
		}
		return 0;
	},
	get: function(index) {
		if (index >= 0 && index < this.size) {
			return this.children[index];
		}
		return null;
	},
	clean:function(){
		this.node=null;
		this.children=new Array();
	}
};
var Range={
	key:null,
	start:0,
	length:0
};