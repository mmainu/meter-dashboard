// 🔹 Adafruit IO credentials
const username = "Mainuddin";
const aioKey = "aio_BPKs38skLh4Zq0699HZUtMj6mFHv";

// 🔹 MQTT connection (WebSocket)
const client = mqtt.connect("wss://io.adafruit.com/mqtt/", {
  username: username,
  password: aioKey,
  reconnectPeriod: 3000   // auto reconnect
});

// 🔹 Topic
const topic = `${username}/feeds/meter`;

// 🔹 On Connect
client.on("connect", () => {
  console.log("MQTT Connected");
  const status = document.getElementById("status");
  if (status) status.innerText = "Connected ✅";

  client.subscribe(topic);
});

// 🔹 On Message Receive
client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    updateBox("l1", "box1", data.l1);
    updateBox("l2", "box2", data.l2);
    updateBox("l3", "box3", data.l3);

  } catch (err) {
    console.log("JSON Error:", message.toString());
  }
});

// 🔹 On Error
client.on("error", (err) => {
  console.log("MQTT Error:", err);
  const status = document.getElementById("status");
  if (status) status.innerText = "Error ❌";
});

// 🔹 On Disconnect
client.on("offline", () => {
  const status = document.getElementById("status");
  if (status) status.innerText = "Offline ⚠️";
});

// 🔹 UI Update Function
function updateBox(valueId, boxId, value) {
  const valueElement = document.getElementById(valueId);
  const boxElement = document.getElementById(boxId);

  if (!valueElement || !boxElement) return;

  valueElement.innerText = value + " V";

  // 🔹 Voltage condition logic
  if (value < 210) {
    boxElement.className = "box low";
  } else if (value > 250) {
    boxElement.className = "box high";
  } else {
    boxElement.className = "box normal";
  }
}
