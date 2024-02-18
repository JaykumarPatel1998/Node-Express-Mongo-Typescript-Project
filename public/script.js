const fileName = document.getElementById("fileName")
const namespace = document.getElementById("namespace")
const parent = document.getElementById("parent")
const folderForm = document.getElementById("folderForm")
const shareForm = document.getElementById("shareForm")
const deleteForm = document.getElementById("deleteForm")

const deleteLink = document.querySelector('a.delete');
deleteLink?.addEventListener('click', (event) => {
    event.preventDefault();
    const url = deleteLink.getAttribute('href');
    fetch(url, { method: 'DELETE' })
});

function changeShareUrl(event) {
  shareForm.setAttribute('action', event.target.getAttribute('data-shareurl'))
  shareForm.setAttribute('method', "POST")
}
function changeDeleteUrl(event) {
  deleteForm.setAttribute('action', event.target.getAttribute('data-shareurl'))
}

function deleteFile(event) {
  event.preventDefault();
  fetch(deleteForm.getAttribute('action'), {
    method: 'DELETE'
  }).then((response)=>{
    location.reload()
  })
}