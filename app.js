let client = null;

// START
function startDashboard() {
    const serial = document.getElementById("serialInput").value.trim();

    if (!serial) {
        alert("Enter Serial Number");
        return;
    }

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "flex";

    startMQTT(serial);
}

// MQTT
function startMQTT(serial) {

    let AIO_KEY = localStorage.getItem("aio_key");

    if (!AIO_KEY) {
        AIO_KEY = prompt("Enter Adafruit IO Key:");
        localStorage.setItem("aio_key", AIO_KEY);
    }

    const USERNAME = "Mainuddin";
    const FEED = USERNAME + "/feeds/meter_" + serial;

    client = new Paho.MQTT.Client(
        "io.adafruit.com",
        443,
        "/mqtt",
        "client-" + Math.random()
    );

    client.onMessageArrived = function (msg) {
        try {
            const d = JSON.parse(msg.payloadString);

            document.querySelector("#l1 .value").textContent = d.l1 + " V";
            document.querySelector("#l2 .value").textContent = d.l2 + " V";
            document.querySelector("#l3 .value").textContent = d.l3 + " V";

            document.querySelector("#i1 .value").textContent = d.i1 + " A";
            document.querySelector("#i2 .value").textContent = d.i2 + " A";
            document.querySelector("#i3 .value").textContent = d.i3 + " A";

            document.querySelector("#pt .value").textContent = d.pt + " kW";

        } catch (e) {
            console.log("JSON error:", msg.payloadString);
        }
    };

    client.connect({
        useSSL: true,
        userName: USERNAME,
        password: AIO_KEY,

        onSuccess: function () {
            document.getElementById("status").textContent =
                "Connected ✅ (" + serial + ")";
            client.subscribe(FEED);
        },

        onFailure: function () {
            document.getElementById("status").textContent = "Connection Failed ❌";
        }
    });
}

// BACK BUTTON
function goBack() {
    if (client && client.isConnected()) {
        client.disconnect();
    }

    document.getElementById("app").style.display = "none";
    document.getElementById("loginScreen").style.display = "flex";

    document.querySelectorAll(".value").forEach(v => v.textContent = "--");
}