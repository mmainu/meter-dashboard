// ==== Config ====
const AIO_KEY = "aio_yOHS77y1DOhhIn2JMwPH4in99sXR"; // Replace with your Adafruit IO key
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
