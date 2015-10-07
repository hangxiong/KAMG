var GenealogicalTree = { //parse the data line by line
	//return true if current object is individual
	isIndividual: false,
	//return true if current object is family
	isFamily: false,
	//return the current object (family or individual)
	currObject: null,
	//store all individual objects
	hashmapIndi: null,
	//store all family objects
	hashmapFam: null,
	//the root of the tree
	root: null,
	//store the individual keys
	keyCollection: null,
	// store the individual objects
	nodeCollection: null,
	// the key of current village
	villageKey: null,
	// the key of current group
	groupKey: null,
	// the key of current genealogy
	genealogyKey: null,
	parser: function(vKey, grpKey, geneKey) {
		var currIndiKey = null;
		var currFamKey = null;
		this.villageKey = vKey;
		this.groupKey = grpKey;
		this.genealogyKey = geneKey;
		this.isIndividual = false;
		this.isFamily = false;
		this.currObject = null;
		this.root = null;
		this.keyCollection = null;
		this.nodeCollection = null;
		this.keyCollection = new Array();
		this.nodeCollection = new Array();
		this.hashmapIndi = Object.create(HashMap);
		this.hashmapFam = Object.create(HashMap);
		while (!reader.AtEndOfLine) {
			var dataLine = reader.ReadLine();
			if (this.getIndiKey(dataLine)) {
				currIndiKey = this.getIndiKey(dataLine);
				var individual = Object.create(Individual);
				individual.key = currIndiKey;
				individual.families = new Array();
				this.hashmapIndi.putValue(currIndiKey, individual);
			}
			if (this.getFamKey(dataLine)) {
				currFamKey = this.getFamKey(dataLine);
				var family = Object.create(Family);
				family.key = currFamKey;
				family.children = new Array();
				this.hashmapFam.putValue(currFamKey, family);
			}
			if(dataLine&&dataLine.indexOf(ged.other)!=-1){
				var strs=dataLine.split(' ');
				this.currObject.identity=strs[strs.length-1];
				continue;
			}
			if (this.isIndividual && currIndiKey) {
				this.currObject = this.hashmapIndi.getValue(currIndiKey); //fill the value for individual object
				this.fillValue(dataLine);
			}
			if (this.isFamily && currFamKey) {
				this.currObject = this.hashmapFam.getValue(currFamKey); //fill the value for individual object
				this.fillValue(dataLine);
			}
		}
		this.createTree();
	},
	// get the key of individual, return null if not
	getIndiKey: function(dataLine) {
		if (dataLine) {
			var strs = dataLine.split(' ');
			if (strs[0] == 0 && strs[2] == ged.indi) {
				this.isIndividual = true;
				this.isFamily = false;
				return strs[1];
			}
		}
		return null;
	},
	// get the key of family, return null if not
	getFamKey: function(dataLine) {
		if (dataLine) {
			var strs = dataLine.split(' ');
			if (strs[0] == 0 && strs[2] == ged.fam) {
				this.isFamily = true;
				this.isIndividual = false;
				return strs[1];
			}
		}
		return null;
	},
	// fill the value for the individual or family
	fillValue: function(dataLine) {
		if (dataLine) {
			var strs = dataLine.split(' ');
			switch (strs[1]) {
			case ged.name:
				this.currObject.name = strs[2];
				break;
			case ged.subname:
				this.currObject.subname = strs[2];
				break;
			case ged.sex:
				this.currObject.sex = strs[2];
				break;
			case ged.husb:
				this.currObject.husb = strs[2];
				break;
			case ged.wife:
				this.currObject.wife = strs[2];
				break;
			case ged.families:
			case ged.family:
				this.currObject.families.push(strs[2]);
				break;
			case ged.chil:
				this.currObject.children.push(strs[2]);
				break;
			case ged.families:
				this.currObject.families.push(strs[2]);
				break;
			}
		}
	},
	//create a tree for this current
	createTree: function() {
		var familyKeys = this.hashmapFam.getKeys();
		for (var i = 0; i < familyKeys.length; i++) {
			var familyKey = familyKeys[i];
			var family = this.hashmapFam.getValue(familyKey);
			if (family && family.husb && family.children) {
				var parentKey = family.husb;
				var parent = null;
				if (this.hasCreated(parentKey)) {
					parent = this.getNode(parentKey);
				} else {
					parent = this.convert(this.hashmapIndi.getValue(parentKey));
					this.nodeCollection.push(parent);
				}
				if (parent) {
					for (var j = 0; j < family.children.length; j++) {
						var childKey = family.children[j];
						var child = null;
						if (this.hasCreated(childKey)) {
							child = this.getNode(childKey);
						} else {
							child = this.convert(this.hashmapIndi.getValue(childKey));
						}
						child.parent = parent;
						parent.children.push(child);
					}
				}
			}
		}
		if (this.nodeCollection.length > 0) {
			var curr = this.nodeCollection[0];
			while (curr.parent) {
				curr = curr.parent;
			}
			this.root = curr;
			this.root.generation = 0;
			this.calcGeneration(this.root);
			genealogyObj.initial();
			var vId = address.getVillage(this.villageKey).id;
			var grpId = address.getGroup(this.villageKey, this.groupKey).id;
			var geneId = address.getGenealogy(this.villageKey, this.groupKey, this.genealogyKey).id;
			genealogyObj.putValue(vId, this.villageKey, grpId, this.groupKey, geneId, this.genealogyKey, this.root);
		}
	},
	//get the node of the individual object with specified key.
	getNode: function(key) {
		var node = null;
		for (var i = 0; i < this.nodeCollection.length; i++) {
			if (this.nodeCollection[i]) {
				node = this.getNodes(this.nodeCollection[i], key);
				if (node) {
					break;
				}
			}
		}
		return node;
	},
	//get the node of the individual object with specified key.
	getNodes: function(curr, key) {
		if (curr && key) {
			if (curr.key == key) {
				return curr;
			} else {
				var p = null;
				if (curr.children) {
					for (var i = 0; i < curr.children.length; i++) {
						p = this.getNodes(curr.children[i], key);
						if (p) {
							break;
						}
					}
				}
				return p;
			}
		}
		return null;
	},
	//convert the individual object to tree object.
	convert: function(individual) {
		var tree = Object.create(Tree);
		tree.key = individual.key;
		tree.name = individual.name;
		tree.subname = individual.subname;
		tree.sex = individual.sex;
		tree.identity = individual.identity;
		tree.parent = null;
		tree.children = new Array();
		this.keyCollection.push(individual.key);
		return tree;
	},
	//return true if the object is created.
	hasCreated: function(key) {
		for (var i = 0; i < this.keyCollection.length; i++) {
			var temp = this.keyCollection[i];
			if (key == temp) {
				return true;
			}
		}
		return false;
	},
	//calculate the generation
	calcGeneration: function(parent) {
		if (parent && parent.children) {
			for (var i = 0; i < parent.children.length; i++) {
				var child = parent.children[i];
				child.generation = parent.generation + 1;
				this.calcGeneration(child);
			}
		}
	}
};