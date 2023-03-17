igcFiles = []

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    for (let file of fileList) {
        console.log(file.name)
        readText(file)
        igcFiles.push(file)
    }
});

function readText(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        res = event.target.result + '';
        console.log(event.name)
        let igc_txt = atob(res.split(',')[1]);
        let lr = countCircles(igc_txt)
        visualizeResults(file, lr)
    });
    reader.readAsDataURL(file);
}

function visualizeResults(file, lr) {
    let tableInfo = {
        flightLabel : file.name,
        circleLabel : "Links: " + lr.left + " / " + "Rechts: " + lr.right,
        turnDLabel  : lr.turnDuration + " s"
    }

    loadTableData([tableInfo])
}

function loadTableData(items) {
    const table = document.getElementById("rlTableBody");
    items.forEach(item => {
        let row = table.insertRow();
        row.insertCell(0).innerHTML = item.flightLabel;
        row.insertCell(1).innerHTML = item.circleLabel;
        row.insertCell(2).innerHTML = item.turnDLabel;
    });
}

function submitButton() {
    for (file of igcFiles) {
        readText(file)
    }
}