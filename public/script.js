const fileName = document.getElementById("fileName")
const namespace = document.getElementById("namespace")
const parent = document.getElementById("parent")
const folderForm = document.getElementById("folderForm")
const shareForm = document.getElementById("shareForm")
const linkshare = document.getElementsByClassName("share")[0]

const deleteLink = document.querySelector('a.delete');
deleteLink?.addEventListener('click', (event) => {
    event.preventDefault();
    const url = deleteLink.getAttribute('href');
    fetch(url, { method: 'DELETE' })
});

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}

function changeUrl() {
  shareForm.setAttribute('action', linkshare.getAttribute('href'))
  shareForm.setAttribute('method', "POST")
}