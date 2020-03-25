const ventanaConfirmacion = document.getElementById("recordGif");
const ventanaGrabacion = document.getElementById("recordGifWindow");
const video = document.getElementById("myVideo");
const videGuardado = document.getElementById("videoGuardado");
const finalVideoActions = document.getElementById("videoActions");
const caputreGif = document.getElementById("captureGif");
const uploading = document.getElementById("uploading");
const timer = document.getElementById("timer");
const timerFinish = document.getElementById("timerFinish");
const recordingGif = document.getElementById("recordingGif");
const forwardGif = document.getElementById("forwardGif");
const cancelAction = document.getElementById("cancelAction");
const finishAction = document.getElementById("finishAction");
const buttonCopy = document.getElementById('copyGif');

var constrains = {
  audio: false,
  video: {
    width: { max: 640 },
    height: { max: 480 }
  }
};

let loadingVar = {
  strokeWidth: 3,
  easing: "easeInOut",
  duration: 3000,
  color: "#F7C9F3",
  trailColor: "#999999",
  trailWidth: 3,
  svgStyle: { width: "100%", height: "100%" }
};

let barra = new ProgressBar.Line(
  document.getElementById("forwardView"),
  loadingVar
);
//var barrasubir = new ProgressBar.Line(document.getElementById('conteprogresbar-subir'), loadingVar);

let camera;
let recorder;
let blob;
let data;
let timeStart;
let misGifs = [];
let TimeDuring;

const ChangeDisplay = (element, estado) => {
  element.setAttribute("style", `display: ${estado ? "flex" : "none"};`);
};

const CrearRecorder = stream => {
  return RecordRTC(stream, {
    type: "gif",
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    disablelogs: true,
    timeSlice: 1000
  });
};

buttonCopy.addEventListener('click', event => {
    let val = buttonCopy.getAttribute('value');

    navigator.clipboard.writeText(val).then(() => {
        console.log('texto copiado');
    })
})

const AceptarGrabacion = () => {
  console.log("Funcionando AceptarGrabacion");
  ChangeDisplay(video, true);
  ChangeDisplay(ventanaConfirmacion, false);
  ChangeDisplay(ventanaGrabacion, true);
  ChangeDisplay(finalVideoActions, false);
  ChangeDisplay(finishAction, false);
  ChangeDisplay(caputreGif, true);
  ChangeDisplay(videGuardado, false);
  navigator.mediaDevices
    .getUserMedia(constrains)
    .then(stream => {
      camera = stream;
      video.srcObject = camera;
    })
    .catch(console.error);
  console.log(camera);
};

const CancelarGrabacion = () => {
  console.log("Funcionando CancelarGrabacion");
};

const IniciarGrabacion = () => {
  recorder = CrearRecorder(camera);
  console.log(recorder);
  console.log("Funcionando IniciarGrabacion");
  ChangeDisplay(caputreGif, false);
  ChangeDisplay(recordingGif, true);
  recorder.startRecording();
  timeStart = new Date().getTime();
  UpdateTimer();
  return false;
};

const ParaGrabacion = () => {
  console.log("Funcionando ParaGrabacion");
  ChangeDisplay(recordingGif, false);
  ChangeDisplay(forwardGif, true);
  recorder.stopRecording(() => {
    blob = recorder.getBlob();
    TimeDuring = blob.size / 300;
    videGuardado.src = recorder.toURL();

    ChangeDisplay(video, false);
    ChangeDisplay(videGuardado, true);

    recorder.destroy();
    recorder = null;

    camera.getTracks().forEach(function(track) {
      track.stop();
    });
  });
  console.log(`ATENCION ACA ${TimeDuring}`);
  loadingVar.duration = TimeDuring;
  barra.set(0.0);
  barra.animate(1.0);
};

const UpdateTimer = () => {
  if (!recorder) {
    return false;
  }

  timer.value = calcularDuracion((new Date().getTime() - timeStart) / 1000);

  setTimeout(UpdateTimer, 1000);
};

function calcularDuracion(segundos) {
  let hr = Math.floor(segundos / 3600);
  let min = Math.floor((segundos - hr * 3600) / 60);
  let seg = Math.floor(segundos - hr * 3600 - min * 60);

  if (min < 10) {
    min = "0" + min;
  }

  if (seg < 10) {
    seg = "0" + seg;
  }

  if (hr <= 0) {
    return min + ":" + seg;
  }
  let time = hr + ":" + min + ":" + seg;
  console.log(time);
  return time;
}

const ReproducirGrabacion = () => {
  console.log("Funcionando ReproducirGrabacion");
  barra.set(0.0);
  barra.animate(1.0);
};

const RepetirGrabacion = () => {
  console.log("Funcionando RepetirGrabacion");
  ChangeDisplay(video, true);
  ChangeDisplay(videGuardado, false);
  ChangeDisplay(forwardGif, false);
  ChangeDisplay(caputreGif, true);
  AceptarGrabacion();
};

const SubirGrabacion = async () => {
  console.log("Funcionando SubirGrabacion");
  ChangeDisplay(forwardGif, false);
  ChangeDisplay(videGuardado, false);
  ChangeDisplay(uploading, true);
  ChangeDisplay(cancelAction, true);
  //form data
  data = new FormData();
  data.append("file", blob, "miGuifo.gif");

  let params = {
    method: "POST",
    body: data
  };

  let responseApi = await fetch(
    gyphyObject.createUrl(new Consulta(UrlTypes.upload, null, 'Mis GIFS GUIFOS')),
    params
  ).then(response => {
      return response.json();
  }).then(response => {
      GuardarGifLocalStorage(response.data.id)
  }).catch(e => {console.error(e)});
  
  MostrarFinal();
  return responseApi;
};

const MostrarFinal = () => {

    ChangeDisplay(cancelAction, false);
    ChangeDisplay(uploading, false);
    ChangeDisplay(videGuardado, true);
    ChangeDisplay(finalVideoActions, true);
    ChangeDisplay(finishAction, true);
}

const GuardarGifLocalStorage = async id => {
    let d = await fetch(
        gyphyObject.createUrl(new Consulta(UrlTypes.searchId, null, id))
      ).then(response => {
          return response.json();
      }).then(response => {
          console.log(response);
          let URI = response.data.images.downsized.url;
          document.getElementById('copyGif').setAttribute('value', URI);
          let Storage = localStorage.getItem('misGifs');
            if (Storage) {
                misGifs = JSON.parse(Storage);
                misGifs.push(response.data);
                localStorage.setItem('misGifs', JSON.stringify(misGifs));
            }else{
                console.log(response);
                misGifs.push(response.data);
                localStorage.setItem('misGifs', JSON.stringify(misGifs));
            }
      }).catch(e => {console.error(e)})
      
}

const CancelarSubida = () => {
  console.log("Funcionando CancelarSubida");
  ChangeDisplay(cancelAction, false);
  ChangeDisplay(finalVideoActions, false);
  ChangeDisplay(finishAction, false);
  ChangeDisplay(finalVideoActions, false);
  ChangeDisplay(finishAction, false);
  ChangeDisplay(uploading, false);
  ChangeDisplay(videGuardado, true);
  ChangeDisplay(forwardGif, true);
};


const DescargarGrabacion = () => {
  console.log("Funcionando DescargarGrabacion");
  invokeSaveAsDialog(blob, 'miGif.gif')
};

const TerminarGrabacion = () => {
  console.log("Funcionando TerminarGrabacion");
  ChangeDisplay(ventanaGrabacion, false);
  ChangeDisplay(ventanaConfirmacion, true);
  VerMisGuifos();
};

timerFinish.value = "00:00";

const GuardarEnLocalStorage = data => {};

const Test = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true
    })
    .then(async function(stream) {
      let recorder = RecordRTC(stream, {
        type: "video"
      });
      recorder.startRecording();

      const sleep = m => new Promise(r => setTimeout(r, m));
      await sleep(3000);

      recorder.stopRecording(function() {
        let blob = recorder.getBlob();
        invokeSaveAsDialog(blob);
      });
    });
};
