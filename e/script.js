const UUID = crypto.randomUUID();
const ID_APP =
  "id-app-cf63f8b2c10e10008e773a856dd6a450db17857965db51fbc3006d8d810d939b";
const socket = io("https://l8qn2l7t-4999.brs.devtunnels.ms/");

const routeHashCallback = new RouteHashCallback();

const callbackRoom = () => {
  const $element = createNodeElement(`
    <div class="component">
      <a href="#/${crypto.randomUUID()}" class="button" >Crear Sala</a>
    </div>
  `);

  return $element;
};

const callbackRoomId = () => {
  const useThis = {
    values: {
      localStream: null,
      users: {},
      users_callback: [],
      users_peerConnection: [],
      configuration: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // STUN server de Google
        ],
      },
    },
  };

  const $element = createNodeElement(`
    <div class="component">
      <div class="video">
          <video></video>
      </div>
      <div class="controls">
          <button id="start-sharing">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-play">
                  <path
                      d="M20.492,7.969,10.954.975A5,5,0,0,0,3,5.005V19a4.994,4.994,0,0,0,7.954,4.03l9.538-6.994a5,5,0,0,0,0-8.062Z">
                  </path>
              </svg>
          </button>
          <button id="stop-sharing">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px"
                  y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"
                  data-svg-name="fi fi-sr-stop">
                  <path
                      d="M106.667,0h298.667C464.244,0,512,47.756,512,106.667v298.667C512,464.244,464.244,512,405.333,512H106.667  C47.756,512,0,464.244,0,405.333V106.667C0,47.756,47.756,0,106.667,0z">
                  </path>
              </svg>
          </button>
      </div>
    </div>
  `);

  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );

  $elements["start-sharing"].addEventListener("click", async () => {
    if (useThis.values.localStream) {
      const localStream = useThis.values.localStream;
      localStream?.getTracks?.().forEach((track) => track.stop());
      localStream?.close?.();

      useThis.values.users_callback = useThis.values.users_callback.map(
        (object) => {
          return {
            ...object,
            status: false,
          };
        }
      );
    }

    useThis.values.localStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const $video = document.createElement("video");
    $element.querySelector("video").replaceWith($video);
    $video.setAttribute("controls", "");
    $video.srcObject = useThis.values.localStream;
    $video.play();

    useThis.values.users_callback = useThis.values.users_callback.map(
      (object) => {
        if (!object.status) object.peerConnection();
        return {
          ...object,
          status: true,
        };
      }
    );
  });

  $elements["stop-sharing"].addEventListener("click", () => {
    const localStream = useThis.values.localStream;
    localStream?.getTracks?.().forEach((track) => track.stop());
    localStream?.close?.();

    useThis.values.users_callback = useThis.values.users_callback.map(
      (object) => {
        return {
          ...object,
          status: false,
        };
      }
    );
  });

  const callbackEmitSocket = (e) => {
    const data = e?.detail;
    const idApp = data?.head?.idApp;
    const id = data?.head?.id;
    const from = data?.head?.from;

    if (idApp == ID_APP) {
      if (id == routeHashCallback.params("id")) {
        if (from == "answer") {
          const peerConnection = useThis.values.users?.[data?.head.uuid];
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(data?.body?.answer)
          );
        }

        if (from == "candidate") {
          const peerConnection = useThis.values.users?.[data?.head.uuid];
          peerConnection.addIceCandidate(
            new RTCIceCandidate(data?.body?.candidate)
          );
        }

        if (from == "join") {
          const callbackPerConnection = async () => {
            const configuration = useThis.values.configuration;
            useThis.values.users[data.head.uuid] = new RTCPeerConnection(
              configuration
            );
            const peerConnection = useThis.values.users[data.head.uuid];
            const localStream = useThis.values.localStream;
            // Añadir el stream local al PeerConnection
            localStream
              .getTracks()
              .forEach((track) => peerConnection.addTrack(track, localStream));
            // Crear una oferta (SDP)
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            // Enviar la oferta al receptor a través de Socket.IO
            // socket.emit('offer', offer);
            socket.emit("emit-data", {
              head: {
                idApp: ID_APP,
                from: "offer",
                id: routeHashCallback.params("id"),
                uuid: UUID,
              },
              body: {
                uuid: data?.head?.uuid,
                offer,
              },
            });
            // Manejar la recepción de candidatos ICE
            peerConnection.onicecandidate = (event) => {
              if (event.candidate) {
                // socket.emit('candidate', event.candidate);
                socket.emit("emit-data", {
                  head: {
                    idApp: ID_APP,
                    from: "candidate",
                    id: routeHashCallback.params("id"),
                    uuid: UUID,
                  },
                  body: {
                    uuid: data?.head?.uuid,
                    candidate: event.candidate,
                  },
                });
              }
            };
          };

          if (useThis.values.localStream) callbackPerConnection();
          useThis.values.users_callback.push({
            peerConnection: callbackPerConnection,
            status: Boolean(useThis.values.localStream),
          });
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
  console.log(data)
  dispatchEvent(new CustomEvent("emit-data", { detail: data }));
});
