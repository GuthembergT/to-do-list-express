const list = document.querySelector('#list');
const addItem = document.querySelector('#add');
const clearAll = document.querySelector('#clear').addEventListener('click', removeAll);
const clearCompleted = document.querySelector('#clearCompleted').addEventListener('click', removeCompleted);

list.addEventListener('click', taskComplete);
list.addEventListener('click', removeSingle);

function taskComplete(e) {
    if (e.target.tagName === 'SPAN') {
        fetch('markCompleted', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                task: e.target.innerText,
                completed: e.target.classList.contains('done')
            })
        })
        .then(function (response) {
            window.location.reload()
          })
    }
}

function removeSingle(e) {
    if(e.target.className === 'deleteTask'){
        fetch('singleTask', {
            method: 'delete',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({ task:e.target.nextSibling.innerText })
        })
        .then(function(response) {
            window.location.reload();
        })
    }
}

function removeCompleted() {
    fetch('completedTasks', {
        method: 'delete',
        headers: {'Content-Type' : 'application/json'}
    })
    .then(function(response) {
        window.location.reload();
    })
}

function removeAll() {
    fetch('clear', {
        method: 'delete',
        headers: {'Content-Type' : 'application/json'}
    })
    .then(function(response) {
        window.location.reload();
    })
}