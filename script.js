
function saveState(sizeNum, files) {
    localStorage.setItem('storageSize', sizeNum.toString());
    localStorage.setItem('storageFiles', JSON.stringify(files));
}


function loadState() {
    const size = parseFloat(localStorage.getItem('storageSize')) || 0;
    const files = JSON.parse(localStorage.getItem('storageFiles')) || [];

    return { sizeNum: size, files };
}


function updateDotPosition(sizeNum) {
    const gradientBar = document.querySelector('.gradient-bar');
    gradientBar.style.width = `${sizeNum}%`;
}


function updateLeft(sizeNum) {
    const left = document.getElementById("left");
    left.innerText = Math.round((100 - sizeNum) * 100) / 100;
}


function openFileExplorer() {
    document.getElementById('file-input').click();
}

function updateUI(){
    const storageState = loadState();
    const sizeElement = document.getElementById('size');
    sizeElement.innerText = storageState.sizeNum;
    updateDotPosition(storageState.sizeNum);
    updateLeft(storageState.sizeNum);
}

function createFileButton(selectedFile,selectedFileSize){
    const filesDiv = document.getElementById("files");
    const button = document.createElement('button');
    button.textContent = selectedFile.name;
    button.classList.add('file-button');
    button.id=selectedFile.name;
    button.onclick = function () {
        handleRemove(button, selectedFileSize);
            };
    filesDiv.appendChild(button);
}

function handleFileSelect(event) {
    const selectedFiles = event.target.files;
    const storageState = loadState();

    for (let i = 0; i < selectedFiles.length; i++) {
        const selectedFile = selectedFiles[i];
        const selectedFileSize = Math.round((selectedFile.size / 1000000) * 100) / 100;
        const allowedTypes = ['image/jpeg','image/jpg','image/png','image/gif']
        if(!allowedTypes.includes(selectedFile.type)){
             alert("File format isn't supported");}
        else{
            if (storageState.sizeNum + selectedFileSize >= 100){                
                alert("There is not enough space on the disk");}
            else{
                storageState.sizeNum = Math.round((storageState.sizeNum + selectedFileSize) * 100) / 100;
                storageState.files.push({ name: selectedFile.name, size: selectedFileSize });
                saveState(storageState.sizeNum, storageState.files);
                updateUI();
                createFileButton(selectedFile,selectedFileSize);
            } 
        }
    }
}


function handleRemove(button, fileSize) {
    const storageState = loadState();
    storageState.sizeNum = Math.round((storageState.sizeNum - fileSize) * 100) / 100;
    storageState.files = storageState.files.filter(file => file.name !== button.id);
    saveState(storageState.sizeNum, storageState.files);
    updateUI();
    button.style.display = 'none';
    document.getElementById('file-input').value = '';
}


document.addEventListener('DOMContentLoaded', function () {
    updateUI()
    const storageState = loadState();
    storageState.files.forEach(file => {
        createFileButton(file,file.size)
    });
});


function clearState() {
    localStorage.removeItem('storageSize');
    localStorage.removeItem('storageFiles');
}