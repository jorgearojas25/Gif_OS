const options = document.getElementsByClassName("searchOptions")[0];
const searchButton = document.getElementById("searchButton");
const ListaTemas = document.getElementById("themesList");
const TagsSearch = document.getElementById("tagButtons");
const InputSearch = document.getElementById("userSearch");
const style = document.getElementById("themeStlye");
const tendencesArea = document.getElementById("tendencesArea");
const suggestArea = document.getElementById("suggestArea");
const searchArea = document.getElementById("searchArea");
let listaTemasAbierta = true;

// * INICIA LA PAGINA *
// ! TEMA y GIFS INICIALES
window.onload = () => {
  let temaActual = localStorage.getItem("tema");
  if (temaActual) {
    CambiarTema(temaActual);
  } else {
    localStorage.setItem("tema", "Day");
    CambiarTema(localStorage.getItem("tema"));
  }

  // * Generar Gifs spaces iniciales *
  fetch(gyphyObject.createUrl(new Consulta(UrlTypes.trending, 16, null)))
  //Parsea el cuerpo en JSON
    .then(data => {
      return data.json();
    })
    //Envia la data necesaria para crear las tendencias y las sugerencias
    .then(data => {
      let dataTendencias = data.data;
      let dataSuggest = dataTendencias.splice(-4);
      VerMisGuifos();
      CreateImageContainerInZone("suggestGifs", dataSuggest, false);
      CreateImageContainerInZone("tendencesGifs", dataTendencias, true);
    })
    //Recibe el error
    .catch(e => {
      console.error(`[Search bar] ${e}`);
    });
};

// * Cambia el link del tema *
const CambiarTema = tema => {
  switch (tema) {
    case "Day":
      style.href = "../styles/styleDay.css";
      document.getElementById("sDay").setAttribute("class", "underline");
      document
        .getElementById("buttonDay")
        .setAttribute("class", "selectedTheme activeTheme");
      document.getElementById("sNight").setAttribute("class", "none");
      document
        .getElementById("buttonNight")
        .setAttribute("class", "selectedTheme");
      OpenCloseThemeList();
      break;
    case "Night":
      style.href = "../styles/styleNight.css";
      document.getElementById("sDay").setAttribute("class", "none");
      document
        .getElementById("buttonDay")
        .setAttribute("class", "selectedTheme");
      document.getElementById("sNight").setAttribute("class", "underline");
      document
        .getElementById("buttonNight")
        .setAttribute("class", "selectedTheme activeTheme");
      OpenCloseThemeList();
      break;
  }
};

// * Cambia el local storage del tema seleccionado y lo aplica*
const SetStyle = style => {
  localStorage.setItem("tema", style);
  CambiarTema(style);
};

// * Recolecta la data del local storage para mis gifs *
const VerMisGuifos = () => {
  let datalocalStorage = localStorage.getItem("misGifs");
  let dataMisGifs = JSON.parse(datalocalStorage);
  CreateImageContainerInZone("misGifs", dataMisGifs, false);
};

// * Abre o cierra la lista de temas *
const OpenCloseThemeList = () => {
  listaTemasAbierta = !listaTemasAbierta;
  if (listaTemasAbierta) {
    ListaTemas.setAttribute("style", "display: flex");
  } else {
    ListaTemas.setAttribute("style", "display: none");
  }
};

//* Recibe un texto para buscar en la API *
const SearchGifs = search => {
  if (search.length) {
    return fetch(
      gyphyObject.createUrl(new Consulta(UrlTypes.search, 12, search))
    )
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(data);
        OcultarMostrarArea(tendencesArea, true);
        OcultarMostrarArea(suggestArea, true);
        OcultarMostrarArea(searchArea, false);
        CrearBotonesTag(data.data[0]);
        let text = document.getElementById("searchedText");
        text.innerHTML = search;
        InputSearch.value = search;
        CreateImageContainerInZone("resultsGifs", data.data, true);
        options.setAttribute("style", "display: none;");
      })
      .catch(e => {
        console.error(`[Search bar] ${e}`);
      });
  }
  return null;
};

// * Cambia el display de las areas de gifs *
const OcultarMostrarArea = (area, ocultar) => {
  area.setAttribute("style", `display: ${ocultar ? "none" : "block"};`);
};

// * Muestra las opciones de busqueda *
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
    searchButton.setAttribute("class", " buttonActive searchButton outline ");
    //Despliega la lista de opciones
    options.setAttribute("style", "display: flex");
  } else {
    //Oculta la lista de opciones
    options.setAttribute("style", "display: none");
    //Inavtiva el boton de busqueda
    searchButton.setAttribute("class", "searchButton");
  }
};

// * Crea los botones tag al buscar algo *
const CrearBotonesTag = data => {
  TagsSearch.innerHTML = "";
  let Tags = ObtenerDatosTitulo(data);
  Tags.forEach(element => {
    let newButton = document.createElement("button");
    newButton.setAttribute("class", "tagButton");
    newButton.setAttribute("onClick", `SearchGifs('${element}')`);
    newButton.innerHTML += `#${element}`;
    TagsSearch.appendChild(newButton);
  });
};

// * Crea las opciones de busquedas *
const CrearOptionsButtons = data => {
  let Titulo = ObtenerDatosTitulo(data.data[0]);
  Titulo.forEach(element => {
    let newButton = document.createElement("button");
    newButton.setAttribute("class", "optionSearch");
    newButton.setAttribute("onClick", `SearchGifs('${element}')`);
    newButton.innerHTML += element;
    options.appendChild(newButton);
  });
};

// * Crea los contenedores de Gifs con todos sus elementos *
// * Recibe la zona de pintado, la data del API, pintura dinamica o no * 
const CreateImageContainerInZone = async (
  imageZone,
  dataArray,
  gridDinamico
) => {
  let zone = document.getElementById(imageZone);
  if (zone) {
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
  } else {
    console.log(
      `[No se encontro el area de gifs ${imageZone} en el documento actual]`
    );
  }
};

//* Busca el titulo del objeto lo convierte en un Array de palabras hasta la palabra clave GIF *
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

//* Crea el container del gif *
const CrearContainerImage = (image, esDinamico) => {
  let sizeSrcImg = image.images.downsized_large.width;
  let imageContainer = document.createElement("div");
  imageContainer.setAttribute("class", "imageContainer");
  if (esDinamico) {
    imageContainer.setAttribute(
      "style",
      `grid-column: ${sizeSrcImg >= 500 ? "span 2" : "span 1"};`
    );
  } else {
    imageContainer.setAttribute("style", `grid-column: span 1;`);
  }

  return imageContainer;
};

// * Crea el titulo para el container *
const CreatTituloImagen = imgTitleSrc => {
  let title = document.createElement("div");
  title.setAttribute("class", "windowTitle");
  let titleText = document.createElement("p");
  titleText.setAttribute("class", "windowText bold");
  titleText.innerHTML = `#${imgTitleSrc.join("")}`;
  //Boton close
  let buttonClose = document.createElement("button");
  buttonClose.setAttribute("class", "closeWindow");
  //Armando la cabezera
  title.append(titleText);
  title.appendChild(buttonClose);
  return title;
};

// * Crea la imagen del container *
const CrearImagenGif = image => {
  let imageContent = document.createElement("img");
  imageContent.setAttribute("src", `${image.images.downsized_large.url}`);
  imageContent.setAttribute("class", "imageGif");
  return imageContent;
};

// * Crea boton ver mas para el container * 
const CrearButtonMore = imgTitleSrc => {
  let buttonMore = document.createElement("button");
  buttonMore.setAttribute("class", "buttonMore");
  buttonMore.setAttribute("onClick", `SearchGifs('${imgTitleSrc[0]}')`);
  buttonMore.innerHTML = "Ver más…";
  return buttonMore;
};

// * Crea la barra de tags para el container *
const CrearTagVar = imgTitleSrc => {
  let tagVar = document.createElement("div");
  tagVar.setAttribute("class", "windowTitle tagVar");
  let tagContent = document.createElement("p");
  tagContent.setAttribute("class", "windowText bold");
  tagContent.innerHTML = `#${imgTitleSrc.join(" #")}`;
  tagVar.appendChild(tagContent);
  return tagVar;
};


