const options = document.getElementsByClassName("searchOptions")[0];

const SearchGifs = search => {
  return fetch(
    gyphyObject.createUrl(new Consulta(UrlTypes.search, 12, search))
  )
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data);
      OcultarArea('tendencesArea');
      CreateImageContainerInZone("resultsGifs", data.data);
      options.setAttribute('style', 'display: none;')
    })
    .catch(e => {
      console.error(`[Search bar] ${e}`);
    });
};

const OcultarArea = (area) => {
  let areaGifs = document.getElementById(area);
  areaGifs.setAttribute('style', 'display: none;')
}

const DisplaySearchOtions = async text => {
  if (text.length > 0) {
    //LimpiarBotones
    options.innerHTML = "";
    let data = await fetch(
      gyphyObject.createUrl(new Consulta(UrlTypes.search, 1, text))
    )
      .then(data => {
        return data.json();
      })
      .catch(e => console.error(`[Display Search Options] ${e}`));
    let Titulo = ObtenerDatosTitulo(data.data[0]);
    Titulo.forEach(element => {
      let newButton = document.createElement("button");
      newButton.setAttribute("class", "optionSearch");
      newButton.innerHTML += element;
      options.appendChild(newButton);
    });
    options.setAttribute("style", "display: flex");
  } else {
    options.setAttribute("style", "display: none");
  }
};

fetch(
  gyphyObject.createUrl(new Consulta(UrlTypes.trending, 16, null))
)
  .then(data => {
    return data.json();
  })
  .then(data => {
    let dataCompleta = data.data;
    console.log(dataCompleta);
    let x = dataCompleta.splice(-4);
    CreateImageContainerInZone('suggestGifs',x)
    console.log(x)
    console.log(dataCompleta);
    CreateImageContainerInZone("tendencesGifs", dataCompleta);
  })
  .catch(e => {
    console.error(`[Search bar] ${e}`);
  });

const CreateImageContainerInZone = async (imageZone, dataArray) => {
  let zone = document.getElementById(imageZone);
  zone.innerHTML = "";
  console.log(zone);
  for (const image of dataArray) {
    let imgTitleSrc = ObtenerDatosTitulo(image);
    //container
    let imageContainer = CrearContainerImage(image);
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

const CrearContainerImage = image => {
  let sizeSrcImg = image.images.downsized_large.width;
  let imageContainer = document.createElement("div");
  imageContainer.setAttribute("class", "imageContainer");
  imageContainer.setAttribute(
    "style",
    `grid-column: ${sizeSrcImg >= 500 ? "span 2" : "span 1"};`
  );
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
  return imageContent;
};

const CrearButtonMore = imgTitleSrc => {
  let buttonMore = document.createElement("button");
    buttonMore.setAttribute("class", "buttonMore");
    buttonMore.setAttribute('value', `${imgTitleSrc[0]}`);
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

