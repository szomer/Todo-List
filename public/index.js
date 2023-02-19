function show(id) {
  var deleteButton = document.getElementById('btn-' + id);
  deleteButton.classList.remove('hidden');
}

function hide(id) {
  var deleteButton = document.getElementById('btn-' + id);
  deleteButton.classList.add('hidden');
}
