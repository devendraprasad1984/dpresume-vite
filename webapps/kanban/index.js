const todo = document.getElementById("to-do")
const doing = document.getElementById("doing")
const done = document.getElementById("done")
const trash = document.getElementById("trash")
const taskText = document.getElementById("taskText")


const draggables = dragula([todo, doing, done, trash])
draggables.on("drag", function (el) {
    el.className.replace("ex-moved", "");
}).on("drop", function (el) {
    el.className += "ex-moved";
}).on("over", function (el, container) {
    container.className += "ex-over";
}).on("out", function (el, container) {
    container.className.replace("ex-over", "");
});

function addTask() {
    todo.innerHTML += "<li class='task'><p>" + taskText.value + "</p></li>";
    taskText.value = "";
}

function emptyTrash() {
    trash.innerHTML = "";
}
