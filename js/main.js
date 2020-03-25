const options = document.getElementsByClassName("searchOptions")[0];
const searchButton = document.getElementById('searchButton');
const ListaTemas = document.getElementById('themesList');
const TagsSearch = document.getElementById('tagButtons');
const InputSearch = document.getElementById('userSearch');
let listaTemasAbierta = false;

window.onload = () => {
  let temaActual = localStorage.getItem('tema');
  if(temaActual){
    CambiarTema();
  }else{
    localStorage.setItem('tema','Day');
  }
}

const CambiarTema = () => {
  switch (localStorage.getItem('tema')) {
    case 'Day':
      
      break;
  
    case 'Night':
      break;
  }
}

//Generar Gifs spaces iniciales
fetch(
  gyphyObject.createUrl(new Consulta(UrlTypes.trending, 16, null))
)
  .then(data => {
    return data.json();
  })
  .then(data => {
    let dataTendencias = data.data;
    let dataSuggest = dataTendencias.splice(-4);
    VerMisGuifos();
    CreateImageContainerInZone('suggestGifs',dataSuggest, false);
    CreateImageContainerInZone("tendencesGifs", dataTendencias, true);
  })
  .catch(e => {
    console.error(`[Search bar] ${e}`);
  });

  const VerMisGuifos = () => {
    let datalocalStorage = localStorage.getItem('misGifs');
    let dataMisGifs = JSON.parse(datalocalStorage);
    CreateImageContainerInZone('misGifs', dataMisGifs, false);
  }

const OpenThemeList = () => {
  listaTemasAbierta = !listaTemasAbierta;
  if(listaTemasAbierta){
    console.log('hola')
    
    ListaTemas.setAttribute('style', 'display: flex')
  
  }else{
    ListaTemas.setAttribute('style', 'display: none')
  }
}

const SearchGifs = search => {
  if(search.length){
    return fetch(
      gyphyObject.createUrl(new Consulta(UrlTypes.search, 12, search))
    )
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(data);
        OcultarMostrarArea('tendencesArea',true);
        OcultarMostrarArea('suggestArea',true);
        OcultarMostrarArea('searchArea',false);
        CrearBotonesTag(data.data[0]);
        let text = document.getElementById('searchedText');
        text.innerHTML = search;
        InputSearch.value = search;
        CreateImageContainerInZone("resultsGifs", data.data, true);
        options.setAttribute('style', 'display: none;')
      })
      .catch(e => {
        console.error(`[Search bar] ${e}`);
      });
  }
  return null
};

const OcultarMostrarArea = (area, ocultar) => {
  let areaGifs = document.getElementById(area);
  areaGifs.setAttribute('style', `display: ${ocultar? 'none': 'block'};`)
}

const DisplaySearchOtions = async text => {
  if (text.length > 0) {
    //LimpiarBotones
    options.innerHTML = "";
    //Obtener Data
    let data = await fetch(
      gyphyObject.createUrl(new Consulta(UrlTypes.search, 1, text))
    )
      .then(data => {
        return data.json();
      })
      .catch(e => console.error(`[Display Search Options] ${e}`));
      //Crea los optionsButtons
      CrearOptionsButtons(data);
      //Activa el boton de busqueda
    searchButton.setAttribute('class', ' buttonActive searchButton outline ')
    //Despliega la lista de opciones
    options.setAttribute("style", "display: flex");
  } else {
    //Oculta la lista de opciones
    options.setAttribute("style", "display: none");
    //Inavtiva el boton de busqueda
    searchButton.setAttribute('class', 'searchButton')
  }
};

const CrearOptionsButtons = (data) => {
  let Titulo = ObtenerDatosTitulo(data.data[0]);
    Titulo.forEach(element => {
      let newButton = document.createElement("button");
      newButton.setAttribute("class", "optionSearch");
      newButton.setAttribute("onClick", `SearchGifs('${element}')`);
      newButton.innerHTML += element;
      options.appendChild(newButton);
    });
}

const CreateImageContainerInZone = async (imageZone, dataArray, gridDinamico) => {
  let zone = document.getElementById(imageZone);
  if(zone){
    zone.innerHTML = "";
  for (const image of dataArray) {
    let imgTitleSrc = ObtenerDatosTitulo(image);
    //container
    let imageContainer = CrearContainerImage(image, gridDinamico);
    //Titulo
    let title = CreatTituloImagen(imgTitleSrc);
    //imagen
    let imageContent = CrearImagenGif(image);
    //button
    let buttonMore = CrearButtonMore(imgTitleSrc);
    //tags
    let tagVar = CrearTagVar(imgTitleSrc);

    //Agregando
    imageContainer.appendChild(title);
    imageContainer.appendChild(imageContent);
    imageContainer.appendChild(buttonMore);
    imageContainer.appendChild(tagVar);
    zone.append(imageContainer);
  }
  }
  else{
    console.log(`[No se encontro el area de gifs ${imageZone} en el documento actual]`)
  }
};
const ObtenerDatosTitulo = gifImage => {
  if (gifImage.title) {
    let imgTitleSrc = gifImage.title.split(" ");
    //ESTO NO SIRVE
    let RetirarPalabras = imgTitleSrc.splice(imgTitleSrc.indexOf("GIF"));
    //ESTE RESULTADO SIRVE
    return imgTitleSrc;
  }
  return [];
};

const CrearContainerImage = (image, esDinamico) => {
  let sizeSrcImg = image.images.downsized_large.width;
  let imageContainer = document.createElement("div");
  imageContainer.setAttribute("class", "imageContainer");
  if(esDinamico){
    imageContainer.setAttribute(
      "style",
      `grid-column: ${sizeSrcImg >= 500 ? "span 2" : "span 1"};`
    );
  }else{
    imageContainer.setAttribute(
      "style",
      `grid-column: span 1;`
    );
  }
  
  return imageContainer;
};

const CreatTituloImagen = imgTitleSrc => {
  let title = document.createElement("div");
  title.setAttribute("class", "windowTitle");
  let titleText = document.createElement("p");
  titleText.setAttribute("class", "windowText");
  titleText.innerHTML = `#${imgTitleSrc.join("")}`;
  //Boton close
  let buttonClose = document.createElement("button");
  buttonClose.setAttribute("class", "closeWindow");
  //Armando la cabezera
  title.append(titleText);
  title.appendChild(buttonClose);
  return title;
};

const CrearImagenGif = image => {
  let imageContent = document.createElement("img");
  imageContent.setAttribute("src", `${image.images.downsized_large.url}`);
  imageContent.setAttribute('class', 'imageGif');
  return imageContent;
};

const CrearButtonMore = imgTitleSrc => {
  let buttonMore = document.createElement("button");
    buttonMore.setAttribute("class", "buttonMore");
    buttonMore.setAttribute("onClick", `SearchGifs('${imgTitleSrc[0]}')`);
    buttonMore.innerHTML = "Ver más…";
    return buttonMore;
}

const CrearTagVar = imgTitleSrc => {
  let tagVar = document.createElement("div");
    tagVar.setAttribute("class", "windowTitle tagVar");
    let tagContent = document.createElement("p");
    tagContent.setAttribute("class", "windowText ");
    tagContent.innerHTML = `#${imgTitleSrc.join(" #")}`;
    tagVar.appendChild(tagContent);
    return tagVar;
}

const CrearBotonesTag = (data) => {
  TagsSearch.innerHTML = ""; 
  let Tags = ObtenerDatosTitulo(data);
  Tags.forEach(element => {
    let newButton = document.createElement("button");
    newButton.setAttribute("class", "tagButton");
    newButton.setAttribute("onClick", `SearchGifs('${element}')`);
    newButton.innerHTML += `#${element}`; 
    TagsSearch.appendChild(newButton);
  });
}

