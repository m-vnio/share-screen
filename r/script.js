const UUID = crypto.randomUUID();
const ID_APP =
  "id-app-cf63f8b2c10e10008e773a856dd6a450db17857965db51fbc3006d8d810d939b";
const socket = io("https://l8qn2l7t-4999.brs.devtunnels.ms/");

const routeHashCallback = new RouteHashCallback();

const callbackRoom = () => {
  const $element = createNodeElement(`
    <div class="component">

      <div>
        <input type="text" placeholder="id">
        <a href="#/" class="button" >unirse</a>
      </div>
      
    </div>
  `);

  const a = $element.querySelector("a");

  $element.querySelector("input").addEventListener("input", (e) => {
    a.href = `#/${e.target.value.trim()}`;
  });

  return $element;
};

const callbackRoomId = () => {
  const useThis = {
    values: {
      localStream: null,
      users: {},
      users_callback: [],

      peerConnection: null,
      configuration: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // STUN server de Google
        ],
      },
    },
  };
  const $element = createNodeElement(`
    <div class="component">
      <video id="screen-video" width="100%" controls autoplay></video>
    </div>
  `);

  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );

  socket.emit("emit-data", {
    head: {
      idApp: ID_APP,
      from: "join",
      id: routeHashCallback.params("id"),
      uuid: UUID,
    },
    body: {},
  });

  $elements["screen-video"].addEventListener("loadedmetadata", () => {
    $elements["screen-video"].play();
  });

  const callbackEmitSocket = (e) => {
    const data = e?.detail;
    const idApp = data?.head?.idApp;
    const id = data?.head?.id;
    const from = data?.head?.from;

    if (idApp == ID_APP) {
      if (id == routeHashCallback.params("id")) {
        if (data?.body?.uuid == UUID) {
          if (from == "offer") {
            const callback = async (offer) => {
              // Crear una nueva RTCPeerConnection
              const configuration = useThis.values.configuration;
              const peerConnection = new RTCPeerConnection(configuration);
              useThis.values.peerConnection = peerConnection;
              // Manejar los candidatos ICE
              peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                  socket.emit("emit-data", {
                    head: {
                      idApp: ID_APP,
                      from: "candidate",
                      id: routeHashCallback.params("id"),
                      uuid: UUID,
                    },
                    body: {
                      candidate: event.candidate,
                    },
                  });
                }
              };
              // Cuando se recibe el stream del emisor
              peerConnection.ontrack = (event) => {
                $elements["screen-video"].srcObject = event.streams[0];
              };
              // Establecer la oferta como la descripción remota
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
              );
              // Crear una respuesta (SDP)
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);
              // Enviar la respuesta al emisor
              socket.emit("emit-data", {
                head: {
                  idApp: ID_APP,
                  from: "answer",
                  id: routeHashCallback.params("id"),
                  uuid: UUID,
                },
                body: {
                  answer,
                },
              });
            };
            callback(data?.body?.offer);
          }
          if (from == "candidate") {
            const peerConnection = useThis.values.peerConnection;
            peerConnection.addIceCandidate(
              new RTCIceCandidate(data?.body?.candidate)
            );
          }
        }
      }
    }
  };

  addEventListener("emit-data", callbackEmitSocket);
  addEventListener(
    "hashchange",
    () => {
      removeEventListener("emit-data", callbackEmitSocket);
    },
    { once: true }
  );

  return $element;
};

routeHashCallback.set([
  { hash: "/", callback: callbackRoom },
  { hash: "/:id", callback: callbackRoomId },
]);

addEventListener("hashchange", () => {
  document.getElementById("app").innerHTML = "";
  document.getElementById("app").append(routeHashCallback.get() ?? "");
});
dispatchEvent(new CustomEvent("hashchange"));

socket.on("emit-data", (data) => {
  dispatchEvent(new CustomEvent("emit-data", { detail: data }));
});
