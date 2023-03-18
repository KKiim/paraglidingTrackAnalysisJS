/**
 * Diese Analyse basiert auf einer Java Implementierung von Lars Roloff
 * https://github.com/wolke19/xcircles
 */


function countCircles(igc_txt) {
    let flight = parseIGC(igc_txt)
    return calcLeftRightTurns2(flight)
}

function countCirclesAll(igc_txt) {
    let flight = parseIGC(igc_txt)
    res = []
    for (let i = 1; i <= 45; i++) {
        res.push(calcLeftRightTurns2(flight, i))
    }
    return res;
}

function parseIGC(igc_txt) {
    koordArray = []

    for (let line of igc_txt.split('\n')) {
        if (line[0] == 'B') {
            koordArray.push(line)
        }
    }

    let xyPosArray = new Array(koordArray.length).fill().map(() => new Array(2));

    for (let i = 0; i < xyPosArray.length - 1; i++) {

        let oldLine = koordArray[i];
        let line = koordArray[i + 1];

        xyPosArray[i][0] = parseInt(line.substring(7, 14)) - parseInt(oldLine.substring(7, 14));
        xyPosArray[i][1] = parseInt(line.substring(15, 23)) - parseInt(oldLine.substring(15, 23));

        // Drehrichtung unter Beachtung der N/S E/W Koordinatenangaben berichtigen
        let northSouth = line.charAt(14);
        let westEast = line.charAt(23);
        if (northSouth === 'S') {
            xyPosArray[i][0] = -xyPosArray[i][0];
        }
        if (westEast === 'W') {
            xyPosArray[i][1] = -xyPosArray[i][1];
        }
    }

    let interval = parseInt(koordArray[1].substring(5, 7) - koordArray[0].substring(5, 7))

    let flight =  { flightName: "myFlightName :)",
                    xyPosArray : xyPosArray,
                    interval   : interval}

    return flight
}

function calcLeftRightTurns(flight) {
    let v              = flight.xyPosArray
    const interval     = flight.interval
    const turnDuration = document.getElementById("maxCircleDuration").value;
    console.log("Interval: " + interval + "turnDuration(Parameter): " + turnDuration)

    let leftRightTurns = {
        left: 0,
        right: 0,
        turnDuration: turnDuration
    }
    let dataPointCounter = 0;
    let angleCounter = 0;

    for (let i = 1; i < v.length; i++) {

        angleCounter += changeOfDirInDeg(v[i - 1][0], v[i - 1][1], v[i][0], v[i][1]);
        dataPointCounter++;

        if (dataPointCounter > (turnDuration / interval) && angleCounter < 360 && angleCounter > -360) {
            angleCounter = 0;
            dataPointCounter = 0;
        }
        else if (angleCounter >= 360) {
            leftRightTurns.right++;
            angleCounter -= 360;
            dataPointCounter = 0;
        }
        else if (angleCounter <= -360) {
            leftRightTurns.left++;
            angleCounter += 360;
            dataPointCounter = 0;
        }
    }
    return leftRightTurns;
}

function calcLeftRightTurns2(flight, turnDuration = null) {
    if (turnDuration == null) {
        turnDuration = document.getElementById("maxCircleDuration").value;
    }
    let v              = flight.xyPosArray
    const interval     = flight.interval
    console.log("Interval: " + interval + "turnDuration(Parameter): " + turnDuration)

    let leftRightTurns = {
        left: 0,
        right: 0,
        turnDuration: turnDuration
    }

    let angleArray = []

    for (let i = 1; i < v.length; i++) {
        angleArray.push( changeOfDirInDeg(v[i - 1][0], v[i - 1][1], v[i][0], v[i][1]))
    }

    const maxPointsC = (turnDuration / interval)
    for (let j = 0; j < angleArray.length - 1; j++) {

        let maxPoints = Math.min(maxPointsC, angleArray.length - j)

        let aSum = 0
        for (let k = 0; k < maxPoints ; k++) {
            aSum += angleArray[j + k]
            aSum = Math.max(0, aSum)

            if (aSum >= 360) {
                leftRightTurns.right++;
                j += k
                break
            }
        }
    }

    for (let j = 0; j < angleArray.length - 1; j++) {

        let maxPoints = Math.min(maxPointsC, angleArray.length - j)

        aSum = 0
        for (let k = 0; k < maxPoints ; k++) {
            aSum += angleArray[j + k]
            aSum = Math.min(0, aSum)


            if (aSum <= -360) {
                leftRightTurns.left++;
                j += k
                break
            }
        }
    }
    return leftRightTurns;
}


function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function changeOfDirInDeg(n1, e1, n2, e2) {

    let kreuzprodukt = n1 * e2 - e1 * n2;

    if (kreuzprodukt == 0) {
        return 0;
    }

    let skalarprodukt = n1 * n2 + e1 * e2;
    let betragV1 = Math.sqrt(n1 * n1 + e1 * e1);
    let betragV2 = Math.sqrt(n2 * n2 + e2 * e2);

    let richtungsAenderung = radiansToDegrees(Math.acos((skalarprodukt / (betragV1 * betragV2))));

    if (kreuzprodukt < 0) {
        richtungsAenderung *= -1;
    }

    return richtungsAenderung;
}

