// ==== USER INPUT (SAFE) ====
let AIO_KEY = localStorage.getItem("aio_key");

if (!AIO_KEY) {
    AIO_KEY = prompt("Enter your Adafruit IO Key:");
    if (AIO_KEY) {
        localStorage.setItem("aio_key", AIO_KEY);
    } else {
        alert("AIO Key required!");
    }
}

// ==== CONFIG ====
const USERNAME = "Mainuddin";
const FEED = "Mainuddin/feeds/meter";

const clientID = "dashboard-" + Math.floor(Math.random() * 1000);
const broker = "io.adafruit.com";
const port = 443;

// ==== INIT CLIENT ====
const client = new Paho.MQTT.Client(broker, port, "/mqtt", clientID);

// ==== CALLBACKS ====
client.onConnectionLost = function (responseObject) {
    document.getElementById("status").textContent = "Connection Lost ❌";
    console.log("Connection lost:", responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
    try {
        const data = JSON.parse(message.payloadString);

        if (data.l1 !== undefined)
            document.querySelector("#l1 .value").textContent = data.l1 + " V";

        if (data.l2 !== undefined)
            document.querySelector("#l2 .value").textContent = data.l2 + " V";

        if (data.l3 !== undefined)
            document.querySelector("#l3 .value").textContent = data.l3 + " V";

    } catch (e) {
        console.error("JSON Error:", message.payloadString);
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
        console.log("Connect failed:", e);
    }
});