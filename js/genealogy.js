var Genealogy = {
	store: null,
	initial: function() {
		if (!this.store) {
			this.store = Object.create(GenealogyStore);
			this.store.id = 1;
			this.store.key = null;
			this.store.children = new Array();
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
	putValue: function(villageId, villageKey, groupId, groupKey, genealogyId, genealogyKey, tree) {
		var village, group, genealogy;
		if (!this.existsVillage(villageKey)) {
			village = Object.create(GenealogyStore);
			village.id = villageId;
			village.key = villageKey;
			village.children = new Array();
			this.store.putValue(village);
		}
		village = this.getVillage(villageKey);
		if (village) {
			if (!village.exists(groupKey)) {
				group = Object.create(GenealogyStore);
				group.id = groupId;
				group.key = groupKey;
				group.children = new Array();
				village.putValue(group);
			}
		}
		group = village.getChild(groupKey);
		if (group) {
			if (!group.exists(genealogyKey)) {
				genealogy = Object.create(GenealogyStore);
				genealogy.id = genealogyId;
				genealogy.key = genealogyKey;
				genealogy.children = tree;
				group.putValue(genealogy);
			}
		}
	}
}
