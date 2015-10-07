// define an object for reading the uploaded file (*.ged file), which is valid in IE browser. 
var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject"); 
// define an object handler of fileInputStream.
var reader = null; 
// define a static instance for the contrast of key word in the *.ged file.  
var ged = Object.create(GED); 
// define an object for the cascaded address.
var address = Object.create(Address); 
// define an object for storing genealogy individual.
var genealogyObj = Object.create(Genealogy); 
// define an object for storing all genealogy trees.
var genealogicalTree = Object.create(GenealogicalTree); 
// Affinity Coefficient
var affiCoeff=0.5;
// Genealogy Coefficient
var geneCoeff=0.5;
// define a max integer value
var INFINITY=100000000;

var writer=null;

var saveUrl=null;

var isKinship=false;

var fileNameConsanguinity="Consanguinity Adjacency Matrix";

var fileNameKinship="Kinship Adjacency Matrix";