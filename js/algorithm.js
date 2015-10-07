var Algorithm = {
	isCanonLaw: true,
	//get the root node of genealogy with the specified villageKey, groupKey and genealogyKey.
	getRoot: function(villageKey, groupKey, genealogyKey) {
		var genealogy = genealogyObj.getGenealogy(villageKey, groupKey, genealogyKey);
		if (genealogy) {
			return genealogy.children;
		}
		return null;
	},
	//locate the node with the specified key in the root
	locate: function(node, identity) {
		if (node.identity == identity) {
			return node;
		} else {
			var p = null;
			if (node.children) {
				for (var i = 0; i < node.children.length; i++) {
					p = this.locate(node.children[i], identity);
					if (p) {
						break;
					}
				}
			}
			return p;
		}
	},
	//get the common ancestor
	getAncestorMaxLevel: function(leftChild, rightChild) {
		var leftRoot = this.getRoot(leftChild.village, leftChild.group, leftChild.genealogy);
		var rightRoot = this.getRoot(rightChild.village, rightChild.group, rightChild.genealogy);
		if (leftRoot != null && rightRoot != null) { //same genealogy
			if (leftRoot == rightRoot) {
				var left = this.locate(leftRoot, leftChild.identity);
				var right = this.locate(rightRoot, rightChild.identity);
				var tempLeft = left;
				var tempRight = right;
				var parents = new Array();
				while (right) {
					parents.push(right);
					right = right.parent;
				}
				while (left) {
					for (var i = 0; i < parents.length; i++) {
						if (left.identity == parents[i].identity) {
							var a = tempLeft.generation - parents[i].generation;
							var b = tempRight.generation - parents[i].generation;
							if (this.isCanonLaw == true) {
								return Math.max(a, b);
							} else {
								return a + b;
							}
						}
					}
					left = left.parent;
				}
			}
		}
		return INFINITY;
	},
	getIntimacy: function(leftChild, rightChild) {
		var maxLevel = this.getAncestorMaxLevel(leftChild, rightChild);
		return Math.pow(geneCoeff, maxLevel - 1);
	},
	geneRelationship: function() {
		if (selectedData) {
			model.initial(selectedData);
			for (var i = 0; i < model.keyValue.length; i++) {
				var strs1 = model.split(model.keyValue[i]);
				var key1 = strs1[0];
				var value1 = strs1[1];
				var leftChild = this.convertTreeNode(key1, value1);
				for (var j = 0; j < model.keyValue.length; j++) {
					if (i != j) {
						var strs2 = model.split(model.keyValue[j]);
						var key2 = strs2[0];
						var value2 = strs2[1];
						if (key1 != key2) {
							continue;
						}
						var rightChild = this.convertTreeNode(key2, value2);
						var intimacy = this.getIntimacy(leftChild, rightChild);
						model.setValue(i, j, intimacy);
						model.setValue(j, i, intimacy);
					}
				}
			}
		}
	},
	getAllPairs: function() {
		var result = new Array();
		if (model && affinity) {
			for (var i = 1; i < model.difference.length; i++) {
				var from = model.difference[i - 1];
				var to = model.difference[i];
				var temp = affinity.getPairs(from, to);
				if (temp && temp.length > 0) {
					for (var j = 0; j < temp.length; j++) {
						result.push(temp[j]);
					}
				}
			}
		}
		return result;
	},
	marry: function(arr, hb, wf, cof, start1, length1, start2, length2, length) {
		for (var i = start1; i < start1 + length1; i++) {
			if (i == hb) {
				arr[wf][i] = 0;
			} else {
				arr[wf][i] = arr[hb][i] > arr[wf][i] ? arr[hb][i] : arr[wf][i];
			}
			arr[i][wf] = arr[wf][i];
		}
		for (var i = start2; i < start2 + length2; i++) {
			if (i == wf) {
				arr[hb][i] = 0; //INFINITY
			} else {
				arr[hb][i] = arr[wf][i] > arr[hb][i] ? arr[wf][i] : arr[hb][i];
			}
			arr[i][hb] = arr[hb][i];
		} //this.connect(arr, hb, wf, cof, length);
		for (var i = start2; i < start2 + length2; i++) {
			for (var j = start1; j < start1 + length1; j++) {
				if (i != wf || j != hb) {
					var temp = cof * arr[i][wf] * arr[hb][j];
					arr[i][j] = temp > arr[i][j] ? temp: arr[i][j];
					arr[j][i] = arr[i][j];
				}
			}
		}
	},
	connect: function(arr, cof, length, pairs) {
		/*
		for (var i = 0; i < length; i++) {
			//arr[i][i] = 0;
			if (i != wf || i != hb) {
				for (var j = i + 1; j < length; j++) {
					if (j != wf || j != hb) {
						var val1 = cof * arr[i][hb] * arr[j][wf];
						var val2 = cof * arr[i][wf] * arr[j][hb];
						arr[i][j] = Math.max(Math.max(val1, val2), arr[i][j]);
						arr[j][i] = arr[i][j];
					}
				}
			}
		}
		*/
		for (var i = 0; i < length; i++) { //arr[i][i] = 0;
			for (var j = i + 1; j < length; j++) {
				if (arr[i][j] == 0) {
					for (var k = 0; k < length; k++) {
						var val = cof * arr[i][k] * arr[j][k];
						arr[i][j] = Math.max(val, arr[i][j]);
						arr[j][i] = arr[i][j];
					}
					this.resetHW(pairs);
				}
			}
		}
	},
	resetHW: function(pairs) {
		for (var i = 0; i < pairs.length; i++) {
			var hb = model.locate(pairs[i].from.key, pairs[i].from.value);
			var wf = model.locate(pairs[i].to.key, pairs[i].to.value);
			if (hb != -1 && wf != -1) {
				model.array[hb][wf] = model.array[wf][hb] = 0;
			}
		}
	},
	relationship: function() {
		this.geneRelationship(); //var pairs = this.getAllPairs();
		var pairs = affinity.pairs;
		if (selectedData && pairs && pairs.length > 0) {
			for (var i = 0; i < pairs.length; i++) {
				var hb = model.locate(pairs[i].from.key, pairs[i].from.value);
				var hbRange = model.getRange(pairs[i].from.key);
				var wf = model.locate(pairs[i].to.key, pairs[i].to.value);
				var wfRange = model.getRange(pairs[i].to.key);
				if (hb != -1 && wf != -1 && hbRange && wfRange) {
					this.marry(model.array, hb, wf, affiCoeff, hbRange.start, hbRange.length, wfRange.start, wfRange.length, model.length);
				}
			}
			for (var i = 0; i < pairs.length; i++) {
				this.connect(model.array, affiCoeff, model.length, pairs);
			}
		} //affinity
	},
	convertTreeNode: function(key, value) {
		var obj = Object.create(TreeNode);
		obj.identity = value;
		var strs = key.split('_');
		obj.village = strs[0];
		obj.group = strs[1];
		obj.genealogy = strs[2];
		return obj;
	}
}; // define an object for algorithm
var algorithm = Object.create(Algorithm);
