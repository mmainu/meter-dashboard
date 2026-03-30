let client;
let serial = "";
let config = {};

// ===== INIT =====
window.onload = function () {
    showScreen("loginScreen");
};

// ===== SCREEN CONTROL =====
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "flex";
}

// ===== LOGIN =====
function goToSelection() {

    serial = document.getElementById("serialInput").value.trim();

    if (!serial) {
        alert("Enter Serial");
        return;
    }

    showScreen("selectionScreen");
}

// ===== NAVIGATION =====
function openConfig() {
    showScreen("configScreen");
}

function openDashboard() {

    showScreen("dashboardScreen");

    connectMQTT(() => {
        subscribeData();
    });
}

function goBack(from) {

    if (from === "selection") showScreen("loginScreen");
    if (from === "config" || from === "dashboard") showScreen("selectionScreen");
}

// ===== CONFIG =====
function editParam(p) {
    let val = prompt("Enter register for " + p);
    if (val) {
        config[p] = parseInt(val);
        document.getElementById(p + "_reg").textContent = val;
    }
}

function saveConfig() {

    connectMQTT(() => {

        const topic = `Mainuddin/feeds/meter_${serial}_config`;
        client.send(topic, JSON.stringify(config));

        alert("Config Sent");

        showScreen("selectionScreen");
    });
}

// ===== MQTT =====
function connectMQTT(callback) {

    let key = localStorage.getItem("aio_key");

    if (!key) {
        key = prompt("Enter AIO Key");
        localStorage.setItem("aio_key", key);
    }

    client = new Paho.MQTT.Client(
        "io.adafruit.com",
        443,
        "/mqtt",
        "web-" + Math.random()
    );

    client.onMessageArrived = onMessageArrived;

    client.connect({
        useSSL: true,
        userName: "Mainuddin",
        password: key,

        onSuccess: function () {
            document.getElementById("status").textContent = "Connected ✅";
            callback();
        }
    });
}

// ===== SUBSCRIBE =====
function subscribeData() {
    const topic = `Mainuddin/feeds/meter_${serial}`;
    client.subscribe(topic);
}

// ===== DATA =====
function onMessageArrived(msg) {

    let d = JSON.parse(msg.payloadString);

    if (d.l1) document.getElementById("l1").textContent = d.l1 + " V";
    if (d.l2) document.getElementById("l2").textContent = d.l2 + " V";
    if (d.l3) document.getElementById("l3").textContent = d.l3 + " V";

    if (d.i1) document.getElementById("i1").textContent = d.i1 + " A";
    if (d.i2) document.getElementById("i2").textContent = d.i2 + " A";
    if (d.i3) document.getElementById("i3").textContent = d.i3 + " A";

    if (d.pf) document.getElementById("pf").textContent = d.pf;
}