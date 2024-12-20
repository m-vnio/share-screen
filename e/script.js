if (!localStorage.getItem("user-UUID")) {
  localStorage.setItem("user-UUID", crypto.randomUUID());
}

const UUID = localStorage.getItem("user-UUID");
const ID_APP =
  "id-app-cf63f8b2c10e10008e773a856dd6a450db17857965db51fbc3006d8d810d939b";
const socket = io("https://l8qn2l7t-4999.brs.devtunnels.ms/");

const routeHashCallback = new RouteHashCallback();

const callbackRoom = () => {
  const $element = createNodeElement(`
    <div class="div_DtHTBBa">
      <a href="#/${crypto.randomUUID()}" >Crear sala</a>
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
    functions: {},
  };

  const $element = createNodeElement(`
    <div class="component">
      <div class="div_QDTsMJn">
        <div class="div_4CJDpaw">
          <input type="text" value="${routeHashCallback.params("id")}" readonly>
          <button id="copy-code"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-svg-name="fi fi-rr-copy"><path d="m15 20h-10a5.006 5.006 0 0 1 -5-5v-10a5.006 5.006 0 0 1 5-5h10a5.006 5.006 0 0 1 5 5v10a5.006 5.006 0 0 1 -5 5zm-10-18a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-10a3 3 0 0 0 -3-3zm19 17v-13a1 1 0 0 0 -2 0v13a3 3 0 0 1 -3 3h-13a1 1 0 0 0 0 2h13a5.006 5.006 0 0 0 5-5z"></path></svg></button>
        </div>
      </div>
      <div class="video">
          <video></video>
      </div>
      <div class="controls">
          
          <button id="share-with-share-screen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-screencast"><path d="m1.5,19c.828,0,1.5.672,1.5,1.5s-.672,1.5-1.5,1.5S0,21.328,0,20.5s.672-1.5,1.5-1.5Zm6.5,2c0-3.86-3.14-7-7-7-.552,0-1,.448-1,1s.448,1,1,1c2.757,0,5,2.243,5,5,0,.552.448,1,1,1s1-.448,1-1Zm5,0c0-6.617-5.362-12-11.953-12-.552,0-1,.448-1,1s.448,1,1,1c5.488,0,9.953,4.486,9.953,10,0,.552.448,1,1,1s1-.448,1-1Zm11-4V7c0-2.757-2.243-5-5.001-5l-14.129.018C2.598,2.018.609,3.551.033,5.746c-.079.3.01.619.199.865.189.246.505.389.815.389,7.685,0,13.936,6.28,13.936,14,0,.552.465,1,1.017,1h3c2.757,0,5-2.243,5-5Z"></path></svg>
          </button>
          <label class="label_nwpBtLK" id="stop-sharing">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" data-svg-name="fi fi-sr-folder"><g><path d="M0,191.808V384c0.071,58.881,47.786,106.596,106.667,106.667h298.667C464.214,490.596,511.93,442.881,512,384V189.44   L0,191.808z"></path><path d="M405.333,64H266.069c-3.299,0.022-6.56-0.708-9.536-2.133l-67.328-33.792c-8.888-4.426-18.679-6.733-28.608-6.741h-53.931   C47.786,21.404,0.071,69.119,0,128v21.141l509.077-2.368C497.961,98.408,454.959,64.099,405.333,64z"></path></g></svg>
            <input id="inputFile" type="file" style="display:none" accept="video/*">
          </label>
          <button id="share-with-url">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-url"><path d="m18.707,22.293l-2.537-2.537c.524-.791.83-1.738.83-2.756,0-2.757-2.243-5-5-5s-5,2.243-5,5,2.243,5,5,5c1.018,0,1.965-.306,2.756-.83l2.537,2.537c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023,0-1.414Zm.293-22.293H5C2.239,0,0,2.239,0,5v5c0,2.761,2.239,5,5,5h.29c.861-2.891,3.539-5,6.71-5s5.849,2.109,6.71,5h.29c2.761,0,5-2.239,5-5v-5c0-2.761-2.239-5-5-5Zm-10.595,5.562l-.314,3.659c-.031.44-.337.779-.706.779-.244,0-.471-.151-.601-.4l-.831-1.6-.831,1.6c-.129.249-.356.4-.601.4-.368,0-.675-.339-.706-.779l-.314-3.659c-.026-.302.212-.562.515-.562.27,0,.494.207.516.477l.212,2.681.75-1.443c.193-.372.725-.372.918,0l.75,1.443.21-2.681c.021-.269.246-.477.516-.477h.002c.303,0,.541.26.515.562Zm5.978,0l-.314,3.659c-.031.44-.337.779-.706.779-.244,0-.471-.151-.601-.4l-.831-1.6-.831,1.6c-.129.249-.356.4-.601.4-.368,0-.675-.339-.706-.779l-.314-3.659c-.026-.302.212-.562.515-.562.27,0,.494.207.516.477l.212,2.681.75-1.443c.193-.372.725-.372.918,0l.75,1.443.21-2.681c.021-.269.246-.477.516-.477h.002c.303,0,.541.26.515.562Zm6.022,0l-.314,3.659c-.031.44-.337.779-.706.779-.244,0-.471-.151-.601-.4l-.831-1.6-.831,1.6c-.129.249-.356.4-.601.4-.368,0-.675-.339-.706-.779l-.314-3.659c-.026-.302.212-.562.515-.562.27,0,.494.207.516.477l.212,2.681.75-1.443c.193-.372.725-.372.918,0l.75,1.443.21-2.681c.021-.269.246-.477.516-.477h.002c.303,0,.541.26.515.562Z"></path></svg>
          </button>
          <hr id="hr-line" class="hr_v5ql2eJ">
          <button id="user-conecting" class="users">
            <small>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-svg-name="fi fi-sr-users-alt"><path d="M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM5.683,16H1a1,1,0,0,1-1-1A6.022,6.022,0,0,1,5.131,9.084a1,1,0,0,1,1.1,1.266A6.009,6.009,0,0,0,6,12a5.937,5.937,0,0,0,.586,2.57,1,1,0,0,1-.9,1.43ZM17,24H7a1,1,0,0,1-1-1,6,6,0,0,1,12,0A1,1,0,0,1,17,24ZM18,8a4,4,0,1,1,4-4A4,4,0,0,1,18,8ZM6,8a4,4,0,1,1,4-4A4,4,0,0,1,6,8Zm17,8H18.317a1,1,0,0,1-.9-1.43A5.937,5.937,0,0,0,18,12a6.009,6.009,0,0,0-.236-1.65,1,1,0,0,1,1.105-1.266A6.022,6.022,0,0,1,24,15,1,1,0,0,1,23,16Z"></path></svg>
            </small>
            <span id="user-conecting-num">0</span>
          </button>
          <button id="stop-sharing" class="stop" style="display:none">
            <small>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" data-svg-name="fi fi-sr-stop"><path d="M106.667,0h298.667C464.244,0,512,47.756,512,106.667v298.667C512,464.244,464.244,512,405.333,512H106.667  C47.756,512,0,464.244,0,405.333V106.667C0,47.756,47.756,0,106.667,0z"></path></svg>
            </small>
            <span>Detener</span>
          </button>
        </div>
    </div>
  `);

  const $elements = createObjectElement(
    $element.querySelectorAll("[id]"),
    "id",
    true
  );

  useThis.functions.startLocalStream = () => {
    $elements["user-conecting-num"].textContent =
      useThis.values.users_callback.length;

    if (useThis.values.localStream) {
      $elements["stop-sharing"].style.display = "";

      useThis.values.users_callback = useThis.values.users_callback.map(
        (object) => {
          if (object.status) object.peerConnection();
          return {
            ...object,
            status: false,
          };
        }
      );
    }
  };

  useThis.functions.stopLocalStream = () => {
    const localStream = useThis.values.localStream;
    useThis.values.localStream = null;
    localStream?.getTracks?.().forEach((track) => track.stop());
    localStream?.close?.();

    $elements["stop-sharing"].style.display = "none";

    useThis.values.users_callback = useThis.values.users_callback.map(
      (object) => {
        return {
          ...object,
          status: true,
        };
      }
    );
  };

  $elements["copy-code"].addEventListener("click", () => {
    navigator.clipboard.writeText(location.href.replace("/e/", "/r/"));
  });

  $elements["stop-sharing"].addEventListener("click", () => {
    useThis.functions.stopLocalStream();
  });

  $elements["share-with-share-screen"].addEventListener("click", async () => {
    try {
      const localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      useThis.functions.stopLocalStream();
      useThis.values.localStream = localStream;
      useThis.functions.startLocalStream();

      const $video = document.createElement("video");
      $element.querySelector("video").replaceWith($video);
      $video.setAttribute("controls", "");

      $video.addEventListener("loadedmetadata", () => {
        $video.play();
      });

      $video.srcObject = useThis.values.localStream;
    } catch (error) {
      alert(error.message);
    }
  });

  $elements["share-with-url"].addEventListener("click", () => {
    const url = prompt("ingrese una url");

    try {
      const nURL = new URL(url);

      const $video = document.createElement("video");
      $element.querySelector("video").replaceWith($video);
      $video.setAttribute("controls", "");

      $video.addEventListener("loadedmetadata", () => {
        const stream = $video.captureStream();

        useThis.functions.stopLocalStream();
        useThis.values.localStream = stream;
        useThis.functions.startLocalStream();

        $video.play();
      });

      $video.addEventListener("error", (e) => {
        if (e.target.error.code == 4) {
          alert("El video no puede ser reproducido");
        }
      });

      if (nURL.href.includes(".m3u8")) {
        const callbackVideo = ($video, $videoSrc) => {
          if (Hls.isSupported()) {
            const video = $video;
            const hls = new Hls();

            // Cargar el archivo HLS
            hls.loadSource($videoSrc); // Reemplaza con la URL de tu archivo HLS

            // Asociar el HLS al reproductor de video
            hls.attachMedia(video);

            // Manejar eventos
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log(
                "Manifest parsed, found " +
                  data.levels.length +
                  " quality level(s)"
              );
            });

            // Manejar el caso cuando no se puede usar hls.js (por ejemplo, si el navegador soporta HLS nativamente)
          } else if ($video.canPlayType("application/vnd.apple.mpegurl")) {
            // Para Safari que soporta HLS de manera nativa
            $video.src = $videoSrc; // Reemplaza con la URL de tu archivo HLS
          } else {
            console.error("HLS no es soportado por este navegador");
          }
        };
        callbackVideo($video, nURL.href);
      } else {
        $video.src = nURL.href;
      }
    } catch (error) {
      alert("La url no es valida");
    }
  });

  $elements.inputFile.addEventListener("input", (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type.includes("video")) {
        const $video = document.createElement("video");
        $element.querySelector("video").replaceWith($video);
        $video.setAttribute("controls", "");

        $video.addEventListener("loadedmetadata", () => {
          const stream = $video.captureStream();
          useThis.functions.stopLocalStream();
          useThis.values.localStream = stream;
          useThis.functions.startLocalStream();
          $video.play();
        });

        $video.src = URL.createObjectURL(file);
      }
    }
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

          const uuid = data?.head?.uuid;

          useThis.values.users_callback = useThis.values.users_callback
            .filter((object) => object.uuid != uuid)
            .concat({
              uuid: uuid,
              peerConnection: callbackPerConnection,
              status: Boolean(useThis.values.localStream),
            });

          useThis.functions.startLocalStream();
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
