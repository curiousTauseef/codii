var SAVE_TIME_THRESHOLD = 1000;
var lastChange = 0;
var unsavedChanges = false;
var currentText = "";

var editor = CodeMirror.fromTextArea(document.getElementById("userdefined-awesomeness"), {
    mode: "text/html",
    lineNumbers: "true",
    theme: "monokai",
    fullScreen: true,
    lineWrap: true
});

editor.on("change", onEditorChanged);

function onEditorChanged(cm, e) {
	currentText = cm.getValue();
	unsavedChanges = true;
}

function checkForChanges() {
	if(unsavedChanges) {
		saveCurrentCodi(currentText);
		unsavedChanges = false;
	}

	setTimeout(checkForChanges, SAVE_TIME_THRESHOLD);
}
setTimeout(checkForChanges, SAVE_TIME_THRESHOLD);


function saveCurrentCodi(text) {
	if(window.currentCodiId == "") {
		saveNewCodi(text);
	} else {
		updateCodi(text);
	}
}

function saveNewCodi(text) {
	$.post("/", {content: text}, function(data, textStatus) {
		if(data == "err") return;

		window.currentCodiId = data;
		updateWindowUrl();
	});
}

function updateCodi(text) {
	$.post("/" + currentCodiId, {content: text});
}

function updateWindowUrl() {
	History.replaceState({state:3}, "Codii", currentCodiId);
}