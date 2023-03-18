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
        let lrArr = countCirclesAll(igc_txt)
        visualizeResults(file, lrArr)
    });
    reader.readAsDataURL(file);
}

function visualizeResults(file, lrArr) {

    let tableInfos = []
    for (lr of lrArr) {
        let tableInfo = {
            flightLabel : file.name,
            circleLabel : "left: " + lr.left + " / " + "right: " + lr.right,
            turnDLabel  : lr.turnDuration + " s"
        }
        tableInfos.push(tableInfo)
    }

    loadTableData(tableInfos)
    drawLineChart(lrArr)
}

function loadTableData(items) {
    const table = document.getElementById("lrTableBody");
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

function clearTable() {
//https://www.zditect.com/guide/javascript/javascript-clear-table.html
    console.log("clearing table")
    var Table = document.getElementById("lrTableBody");
    Table.innerHTML = "";

    console.log("emptying igcFiles Array")
    igcFiles.length = 0;

    console.log("reset upload button")
    document.getElementById("file-selector").value = "";

}

function drawLineChart(lrArr) {
    const ctx = document.getElementById('myChart');

    let labels = []
    let datasets = []
    let dataLeft = []
    let dataRight= []
    for (lr of lrArr) {
        labels.push(lr.turnDuration + " s")
        dataLeft.push(lr.left)
        dataRight.push(lr.right)
    }

    datasets.push({
        label: '# of left Circles',
        data: dataLeft,
        borderWidth: 1
    })

    datasets.push({
        label: '# of right Circles',
        data: dataRight,
        borderWidth: 1
    })

    new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
    });
}