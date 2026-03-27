// ==== USER INPUT ====
let AIO_KEY = localStorage.getItem("aio_key");

if (!AIO_KEY) {
    AIO_KEY = prompt("Enter your Adafruit IO Key:");
    localStorage.setItem("aio_key", AIO_KEY);
}

// ==== CONFIG ====
const USERNAME = "Mainuddin";
const FEED = "Mainuddin/feeds/meter";

const client = new Paho.MQTT.Client(
    "io.adafruit.com",
    443,
    "/mqtt",
    "client-" + Math.random()
);

// ==== HELPER (handle -1 values) ====
function formatValue(val, unit) {
    if (val === -1 || val === undefined) return "Error";
    return val + " " + unit;
}

// ==== MESSAGE HANDLER ====
client.onMessageArrived = function (message) {
    try {
        const d = JSON.parse(message.payloadString);

        document.querySelector("#l1 .value").textContent = formatValue(d.l1, "V");
        document.querySelector("#l2 .value").textContent = formatValue(d.l2, "V");
        document.querySelector("#l3 .value").textContent = formatValue(d.l3, "V");

        document.querySelector("#i1 .value").textContent = formatValue(d.i1, "A");
        document.querySelector("#i2 .value").textContent = formatValue(d.i2, "A");
        document.querySelector("#i3 .value").textContent = formatValue(d.i3, "A");

        document.querySelector("#pt .value").textContent = formatValue(d.pt, "kW");

    } catch (e) {
        console.log("JSON Error:", message.payloadString);
    }
};

// ==== CONNECT ====
client.connect({
    useSSL: true,
    userName: USERNAME,
    password: AIO_KEY,

    onSuccess: function () {
        document.getElementById("status").textContent = "Connected ✅";
        client.subscribe(FEED);
    },

    onFailure: function (e) {
        document.getElementById("status").textContent = "Connection Failed ❌";
        console.log(e);
    }
});