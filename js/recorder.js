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

// ! Constantes para cargar la camara
const constrains = {
  audio: false,
  video: {
    width: { max: 640 },
    height: { max: 480 }
  }
};

// ? opciones para usar la barra de la libreria
let loadingVar = {
  strokeWidth: 3,
  easing: "easeInOut",
  duration: 3000,
  color: "#F7C9F3",
  trailColor: "#999999",
  trailWidth: 3,
  svgStyle: { width: "100%", height: "100%" }
};

// * Creacion del objeto barra de carga * 
let barra = new ProgressBar.Line(
  document.getElementById("forwardView"),
  loadingVar
);

// * Variables de uso para el recorder *
let camera;
let recorder;
let blob;
let data;
let timeStart;
let misGifs = [];
let TimeDuring;

// * Cambia el display de la ventana de record *
const ChangeDisplay = (element, estado) => {
    element.setAttribute("style", `display: ${estado ? "flex" : "none"};`);
  };

// * Crea el objeto de recorder, recibe el stream *
// * Sream: Imagen actual de la camara *
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

// * Uso de un addEventListener para la copia del URL del gif *
// ? Podria hacerlo con una funcion, pero practicaba el uso de events Listeners
buttonCopy.addEventListener('click', event => {
    let val = buttonCopy.getAttribute('value');

    navigator.clipboard.writeText(val).then(() => {
        console.log('texto copiado');
    })
})

// * Confirma la lectura de instrucciones, display de la ventana de record, crea el stream *
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

// TODO: Aun no se implementa
const CancelarGrabacion = () => {
  console.log("Funcionando CancelarGrabacion");
};

// * Crea el objeto recorder, inicia la grabacion, guarda la hora de inicio, actualiza el contador *
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

// * Detiene la grabacion, guarda el blob, Guarda el tiempo de duracion, setea el url para mostrar despues *
// ! Destruye el objeto recorder
// ! Detiene el uso de la camara
// ? El tiempo de duracion es para calcular el recorrido de la barra
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

// * Actualiza el tiempo del timer *
const UpdateTimer = () => {
  if (!recorder) {
    return false;
  }

  timer.value = calcularDuracion((new Date().getTime() - timeStart) / 1000);

  setTimeout(UpdateTimer, 1000);
};

// * Evalua los segundos apartir de la hora de inicio *
// ? Podria usar la libreria de momment.js
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

// *Activa la animcaion de la barra*
// TODO: Conectar a la reproduccion del gif
// ? Evaluando la posibilidad de reproducir una sola vuelta del gif
const ReproducirGrabacion = () => {
  console.log("Funcionando ReproducirGrabacion");
  barra.set(0.0);
  barra.animate(1.0);
};

// * Devuelve al inicio de la grabacion *
const RepetirGrabacion = () => {
  console.log("Funcionando RepetirGrabacion");
  ChangeDisplay(video, true);
  ChangeDisplay(videGuardado, false);
  ChangeDisplay(forwardGif, false);
  ChangeDisplay(caputreGif, true);
  AceptarGrabacion();
};

// * Crea el multi-part (form-data), anexa el blob, envia a guardar la data del gif en localStorage *
// TODO: Mudar mas funciones a await para correr la barra en porcentaje de progreso
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

// * Setea el display Final *
const MostrarFinal = () => {

    ChangeDisplay(cancelAction, false);
    ChangeDisplay(uploading, false);
    ChangeDisplay(videGuardado, true);
    ChangeDisplay(finalVideoActions, true);
    ChangeDisplay(finishAction, true);
}

// * Usa el id para consultarlo, tomar la data y almacenarla *
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

// * Resetea display *
// TODO: No se puede interrumpir el fetch, buscar el ultimo elemento en localStorage y eliminarlo para no mostrarlo
// ! Simular la cancelacion
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

// * Invoca la ventana de guardar con el blob *
const DescargarGrabacion = () => {
  console.log("Funcionando DescargarGrabacion");
  invokeSaveAsDialog(blob, 'miGif.gif')
};

// * Cambia el display a las instrucciones y actualiza el area de misGifs *
const TerminarGrabacion = () => {
  console.log("Funcionando TerminarGrabacion");
  ChangeDisplay(ventanaGrabacion, false);
  ChangeDisplay(ventanaConfirmacion, true);
  VerMisGuifos();
};

// TODO: Usar el tiempo de duracion para correr un timer al reproducir
timerFinish.value = "00:00";

