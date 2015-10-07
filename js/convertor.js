$(document).ready(function() { //disable all controlers
	disableAll(); //events
	$("#btnAddress").click(function() {
		var fileUrl = $("#addressFile").val();
		$("#addressFile").val("");
		if (fileUrl) {
			if (!saveUrl) {
				saveUrl = fileUrl.substring(0, fileUrl.lastIndexOf("\\")) + "\\";
			}
			reader = fileSystemObject.OpenTextFile(fileUrl, 1);
			while (!reader.AtEndOfLine) {
				var dataLine = reader.ReadLine();
				address.parser(dataLine);
			}
			reader.Close();
			$("#btnAddress").attr("disabled", "disabled");
			$("#addressFile").attr("disabled", "disabled");
			alert("Import Successfully");
			bindVillage();
			enableAll();
		}
	});
	$("#btnGenealogy").click(function() {
		var fileUrl = $("#genealogyFile").val();
		$("#genealogyFile").val("");
		if (fileUrl) {
			reader = fileSystemObject.OpenTextFile(fileUrl, 1);
			var villageKey = $("#selVillage").find("option:selected").text();
			var groupKey = $("#selGroup").find("option:selected").text();
			var genealogyKey = $("#selGenealogy").find("option:selected").text();
			genealogicalTree.parser(villageKey, groupKey, genealogyKey);
			reader.Close();
			alert("Import Successfully");
			$("#selGenealogy").change();
		}
	});
	$("#btnAffinity").click(function() {
		var fileUrl = $("#affinityFile").val();
		$("#affinityFile").val("");
		if (fileUrl) {
			reader = fileSystemObject.OpenTextFile(fileUrl, 1);
			affinity.parser();
			reader.Close();
			isKinship=true;
			alert("Import Successfully.");
			$("#btnAffinity").attr("disabled", "disabled");
			$("#affinityFile").attr("disabled", "disabled");
		}
	});
	$("#selVillage").change(function() {
		$("#divMember").html("");
		var villageKey = $("#selVillage").find("option:selected").text();
		if (villageKey != 'All') {
			bindGroup(villageKey);
		}
	});
	$("#selGroup").change(function() {
		$("#divMember").html("");
		var villageKey = $("#selVillage").find("option:selected").text();
		var groupKey = $("#selGroup").find("option:selected").text();
		if (villageKey != 'All' && groupKey != 'All') {
			bindGenealogy(villageKey, groupKey);
		}
	});
	$("#selGenealogy").change(function() {
		$("#divMember").html("");
		var villageKey = $("#selVillage").find("option:selected").text();
		var groupKey = $("#selGroup").find("option:selected").text();
		var genealogyKey = $("#selGenealogy").find("option:selected").text();
		if (villageKey != 'All' && groupKey != 'All' && genealogyKey != 'All') {
			if (genealogyObj) {
				var tree = genealogyObj.getGenealogy(villageKey, groupKey, genealogyKey);
				if (tree && tree.children) {
					geneCheckBox(tree.children);
				}
			}
		}
	});
	$("#selLaw").change(function() {
		if (algorithm) {			
			if ($("#selLaw").val() == 0) {
				algorithm.isCanonLaw = true;
			} else {
				algorithm.isCanonLaw = false;
			}
		}
	});
	$("#btnSelectAll").click(function() {
		var box = document.getElementsByName("tree");
		for (var i = 0; i < box.length; i++) {
			box[i].checked = true;
		}
	});
	$("#btnCleanAll").click(function() {
		var box = document.getElementsByName("tree");
		for (var i = 0; i < box.length; i++) {
			box[i].checked = false;
		}
	});
	$("#btnSave").click(function() {
		var villageKey = $("#selVillage").find("option:selected").text();
		var groupKey = $("#selGroup").find("option:selected").text();
		var genealogyKey = $("#selGenealogy").find("option:selected").text();
		var box = document.getElementsByName("tree");
		for (var i = 0; i < box.length; i++) {
			if (selectedData) {
				var key = selectedData.getKey(villageKey, groupKey, genealogyKey);
				var value = box[i].value;
				if (box[i].checked) {
					selectedData.put(key, value);
				} else {
					selectedData.remove(key, value);
				}
			}
		}
		alert("Save Successfully");
	});
	$("#btnGenerate").click(function() {
		affiCoeff = $("#txtAffiCoeff").val();
		geneCoeff = $("#txtGeneCoeff").val();		
		if (algorithm && model) {
			var result = new Array();			
			algorithm.relationship();
			var fileName=saveUrl+geneFileName()+'.csv';
			alert(fileName);
			writer = fileSystemObject.CreateTextFile(fileName, 2, true);
			var txt = "\t";
			var length = model.getTitle().length;
			for (var i = 0; i < length; i++) {
				txt += model.getTitle()[i] + "\t";
			}
			writer.WriteLine(txt);
			for (var i = 0; i < length; i++) {
				txt = model.getTitle()[i] + "\t";
				for (var j = 0; j < length; j++) {
					txt += model.array[i][j] + "\t";
				}
				writer.WriteLine(txt);
			}
			writer.Close();
			alert("The result has been saved.");
		}
	});
});
function disableAll() {
	$("#genealogyFile").attr("disabled", "disabled");
	$("#btnGenealogy").attr("disabled", "disabled");
	$("#affinityFile").attr("disabled", "disabled");
	$("#btnAffinity").attr("disabled", "disabled");
	$("#selVillage").attr("disabled", "disabled");
	$("#selGroup").attr("disabled", "disabled");
	$("#selGenealogy").attr("disabled", "disabled");
	$("#btnGenerate").attr("disabled", "disabled");
	$("#btnSelectAll").attr("disabled", "disabled");
	$("#btnCleanAll").attr("disabled", "disabled");
	$("#btnSave").attr("disabled", "disabled");
}
function enableAll() {
	$("#genealogyFile").removeAttr("disabled");
	$("#btnGenealogy").removeAttr("disabled");
	$("#affinityFile").removeAttr("disabled");
	$("#btnAffinity").removeAttr("disabled");
	$("#selVillage").removeAttr("disabled");
	$("#selGroup").removeAttr("disabled");
	$("#selGenealogy").removeAttr("disabled");
	$("#btnGenerate").removeAttr("disabled");
	$("#btnSelectAll").removeAttr("disabled");
	$("#btnCleanAll").removeAttr("disabled");
	$("#btnSave").removeAttr("disabled");
}
function bindVillage() {
	var sel = $("#selVillage");
	sel.empty().append("<option value='0'>All</option>");
	$("#selGroup").empty().append("<option value='0'>All</option>");
	$("#selGenealogy").empty().append("<option value='0'>All</option>");
	var result = address.getAllVillage();
	for (var i = 0; i < result.length; i++) {
		sel.append("<option value='" + result[i] + "'>" + result[i] + "</option>");
	}
}
function bindGroup(villageKey) {
	var sel = $("#selGroup");
	sel.empty().append("<option value='0'>All</option>");
	$("#selGenealogy").empty().append("<option value='0'>All</option>");
	var result = address.getAllGroup(villageKey);
	for (var i = 0; i < result.length; i++) {
		sel.append("<option value='" + result[i] + "'>" + result[i] + "</option>");
	}
}
function bindGenealogy(villageKey, groupKey) {
	var sel = $("#selGenealogy");
	sel.empty().append("<option value='0'>All</option>");
	var result = address.getAllGenealogy(villageKey, groupKey);
	for (var i = 0; i < result.length; i++) {
		sel.append("<option value='" + result[i] + "'>" + result[i] + "</option>");
	}
}
function geneCheckBox(node) {
	if (node) {
		var html = "<span>" + node.identity + "<input type='checkbox' name='tree' value='" + node.identity + "' title='" + node.identity + "' /></span>";
		html += "&nbsp&nbsp&nbsp&nbsp";
		$("#divMember").append(html);
		if (node.children) {
			for (var i = 0; i < node.children.length; i++) {
				geneCheckBox(node.children[i]);
			}
		}
	}
}

function geneFileName(){
	var s="";
	if(isKinship){
		s= fileNameKinship;
	}else{
		s= fileNameConsanguinity;
	}
	var d=new Date();
	s+=d.getMonth()+1;
	s+=d.getDate();
	s+=d.getHours();
	s+=d.getMinutes();
	s+=d.getSeconds();
	return s;
}