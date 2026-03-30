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

     document.querySelector("#l1 .value").textContent = d.l1 + " V";
    document.querySelector("#l2 .value").textContent = d.l2 + " V";
    document.querySelector("#l3 .value").textContent = d.l3 + " V";

    document.querySelector("#i1 .value").textContent = d.i1 + " A";
    document.querySelector("#i2 .value").textContent = d.i2 + " A";
    document.querySelector("#i3 .value").textContent = d.i3 + " A";

    document.querySelector("#pf .value").textContent = d.pf ;
}