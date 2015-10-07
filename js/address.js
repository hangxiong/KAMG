var Address = {
	store: null,
	parser: function(dataLine) {
		if (!this.store) {
			this.store = Object.create(AddressStore);
			this.store.id=1;
			this.store.key=null;
			this.store.children = new Array();
		}
		if (dataLine) {
			var strs = dataLine.split(' ');
			if (strs.length >= 3) {
				this.putValue(strs[0], strs[1], strs[2]);
			}
		}
	},
	existsVillage: function(villageKey) {
		if (this.store && villageKey) {
			return this.store.exists(villageKey);
		}
		return false;
	},
	getVillage: function(villageKey) {
		if (this.store && villageKey) {
			return this.store.getChild(villageKey);
		}
		return null;
	},
	existsGroup: function(villageKey, groupKey) {
		if (this.store && villageKey && groupKey) {
			if (this.existsVillage(villageKey)) {
				var village = this.getVillage(villageKey);
				if (village) {
					return village.exists(groupKey);
				}
			}
		}
		return false;
	},
	getGroup: function(villageKey, groupKey) {
		if (this.store && villageKey && groupKey) {
			if (this.existsVillage(villageKey)) {
				var village = this.getVillage(villageKey);
				if (village) {
					return village.getChild(groupKey);
				}
			}
		}
		return null;
	},
	existsGenealogy: function(villageKey, groupKey, genealogyKey) {
		if (this.store && villageKey && groupKey && genealogyKey) {
			if (this.existsGroup(villageKey, groupKey)) {
				var group = this.getGroup(villageKey, groupKey);
				if (group) {
					return group.exists(genealogyKey);
				}
			}
		}
		return false;
	},
	getGenealogy: function(villageKey, groupKey, genealogyKey) {
		if (this.store && villageKey && groupKey && genealogyKey) {
			if (this.existsGroup(villageKey, groupKey)) {
				var group = this.getGroup(villageKey, groupKey);
				if (group) {
					return group.getChild(genealogyKey);
				}
			}
		}
		return null;
	},
	putValue: function(villageKey, groupKey, genealogyKey) {
		var village, group, genealogy;
		if (!this.existsVillage(villageKey)) {
			village = Object.create(AddressStore);
			village.id=this.store.getMaxId()+1;
			village.key = villageKey;
			village.children = new Array();
			this.store.putValue(village);
		}
		village = this.getVillage(villageKey);
		if (village) {
			if (!village.exists(groupKey)) {
				group = Object.create(AddressStore);
				group.id=village.getMaxId()+1;
				group.key = groupKey;
				group.children = new Array();
				village.putValue(group);
			}
		}
		group = village.getChild(groupKey);
		if (group) {
			if (!group.exists(genealogyKey)) {
				genealogy = Object.create(AddressStore);
				genealogy.id=group.getMaxId()+1;
				genealogy.key = genealogyKey;
				genealogy.children = new Array();
				group.putValue(genealogy);
			}
		}
	},
	getAllVillage: function() {
		var result = new Array();
		for (var i = 0; i < this.store.children.length; i++) {
			result.push(this.store.children[i].key);
		}
		return result;
	},
	getAllGroup: function(villageKey) {
		var result = new Array();
		var village = this.getVillage(villageKey);
		if (village) {
			for (var i = 0; i < village.children.length; i++) {
				result.push(village.children[i].key);
			}
		}
		return result;
	},
	getAllGenealogy: function(villageKey,groupKey) {
		var result = new Array();
		var group = this.getGroup(villageKey,groupKey);
		if (group) {
			for (var i = 0; i < group.children.length; i++) {
				result.push(group.children[i].key);
			}
		}
		return result;
	}
}
