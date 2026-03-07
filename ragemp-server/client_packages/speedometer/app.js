const rpmNeedle = document.getElementById("needle");
const speedValue = document.getElementById("speedValue");

const rpmDegMin = -117;
const rpmDegMax = 117;
const maxRpm = 10000;

function roundTo(value, round) {
    return round * Math.floor(value / 25);
}

function calculateRpmAngle(rpm) {
    let r = roundTo(rpm * maxRpm, 25);
    const angleRange = Math.abs(rpmDegMin - rpmDegMax);
    let rotation = rpmDegMin + (r / maxRpm) * angleRange;
    if (r >= 9400) {
        let jitter = Math.random() * 30;
        if (Math.random() < 0.5) jitter = -jitter;
        rotation += jitter;
    }
    return rotation;
}

function setRPMValue(rpm) {
    const rot = calculateRpmAngle(rpm);
    rpmNeedle.style.transform = "rotate(" + rot + "deg)";
}

function setSpeedValue(value) {
    speedValue.textContent = String(Math.floor(value));
}
