// ==== Config ====
<<<<<<< HEAD
const AIO_KEY = "aio_IQOq92ii7HzNLFfaAorv4C6JbbsF"; // Replace with your Adafruit IO key
const FEED = "Mainuddin/feeds/meter";   // Your feed

const clientID = "dashboard-" + Math.floor(Math.random() * 1000);
const broker = "io.adafruit.com";
const port = 443; // Secure WebSocket
const useSSL = true;

// ==== Connect ====
const client = new Paho.MQTT.Client(broker, port, "/mqtt", clientID);

// Called when the client connects
function onConnect() {
    document.getElementById("status").textContent = "Connected ✅";
    client.subscribe(FEED);
}

// Called when the client loses connection
function onConnectionLost(responseObject) {
    document.getElementById("status").textContent = "Connection Lost ❌";
    console.log("Connection lost: ", responseObject.errorMessage);
}

// Called when a message arrives
function onMessageArrived(message) {
    try {
        const data = JSON.parse(message.payloadString);
        if (data.l1 !== undefined) document.querySelector("#l1 .value").textContent = data.l1 + " V";
        if (data.l2 !== undefined) document.querySelector("#l2 .value").textContent = data.l2 + " V";
        if (data.l3 !== undefined) document.querySelector("#l3 .value").textContent = data.l3 + " V";
    } catch (e) {
        console.error("Invalid JSON received:", message.payloadString);
    }
}

// Connection options
const options = {
    useSSL: useSSL,
    userName: "Mainuddin", // Your Adafruit IO username
    password: AIO_KEY,
    onSuccess: onConnect,
    onFailure: function(e) {
        document.getElementById("status").textContent = "Connection Failed ❌";
        console.log("Connect failed:", e);
    }
};

// Assign callbacks
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Connect
client.connect(options);
=======
const USERNAME = "Mainuddin";
const FEED = "Mainuddin/feeds/meter";

//  Ask for key once and store in browser
if (!localStorage.getItem("aio_key")) {
    const key = prompt("Enter your Adafruit IO Key:");
    localStorage.setItem("aio_key", key);
}

const AIO_KEY = localStorage.getItem("aio_key");

const clientID = "dashboard-" + Math.floor(Math.random() * 1000);
const broker = "io.adafruit.com";
const port = 443;
const useSSL = true;

// ==== Connect ====
const client = new Paho.MQTT.Client(broker, port, "/mqtt", clientID);

// Called when connected
function onConnect() {
    document.getElementById("status").textContent = "Connected ✅";
    client.subscribe(FEED);
}

// Called when connection lost
function onConnectionLost(responseObject) {
    document.getElementById("status").textContent = "Connection Lost ❌";
    console.log("Connection lost: ", responseObject.errorMessage);
}

// Called when message arrives
function onMessageArrived(message) {
    try {
        const data = JSON.parse(message.payloadString);

        if (data.l1 !== undefined)
            document.querySelector("#l1 .value").textContent = data.l1 + " V";

        if (data.l2 !== undefined)
            document.querySelector("#l2 .value").textContent = data.l2 + " V";

        if (data.l3 !== undefined)
            document.querySelector("#l3 .value").textContent = data.l3 + " V";

    } catch (e) {
        console.error("Invalid JSON received:", message.payloadString);
    }
}

// Connection options
const options = {
    useSSL: useSSL,
    userName: USERNAME,
    password: AIO_KEY,
    onSuccess: onConnect,
    onFailure: function(e) {
        document.getElementById("status").textContent = "Connection Failed ❌";
        console.log("Connect failed:", e);
    }
};

// Assign callbacks
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Connect
client.connect(options);
>>>>>>> 2c16fde (Removed AIO key and added secure login method)
