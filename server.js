const express = require('express');
const path = require('path');
const PushNotifications = require("@pusher/push-notifications-server");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const beamsClient = new PushNotifications({
  instanceId: "eeb902ab-af5a-482c-ad98-77adc283449c",
  secretKey: "B3FCAABB8C4C1E88572D266E800A76B77B61B12C02C6930142B70214CA60A538",
});

app.get("/auth", function (req, res) {
  const userId = req.query["user_id"];
  const userIDInQueryParam = req.query["user_id"];
  console.log(userId)
  if (userId != userIDInQueryParam) {
    res.status(401).send("Inconsistent request");
  } else {
    const beamsToken = beamsClient.generateToken(userId);
    res.send(JSON.stringify(beamsToken));
  }
});

app.get("/not/:id", (req, res) => {
  const id = req.params.id
  beamsClient
  .publishToUsers([id], {
    apns: {
      aps: {
        alert: {
          title: "OIIII GORDAO",
          body: "OIIII GORDAO",
        },
      },
    },
    fcm: {
      notification: {
        title: "OIIII GORDAO",
        body: "OIIII GORDAO",
      },
    },
    web: {
      notification: {
        title: "OIIII GORDAO",
        body: "OIIII GORDAO",
      },
    },
  })
  .then((publishResponse) => {

    req.res.send(publishResponse.publishId)
  })
  .catch((error) => {
    console.error("Error:", error);
  });
})

app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});
