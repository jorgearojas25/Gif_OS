const gyphyObject = {
  baseUrl: "https://api.giphy.com/v1/gifs",
  uploadUrl: "https://upload.giphy.com/v1/gifs",
  key: "?api_key=kDgsHz5JVb2MGrCVNQWBMoILrQ5wPm42",
  search: "/search",
  trending: "/trending",
  random: "random",
  searchId: "/",
  query: "&q=",
  limit: "&limit=",
  offset: "&offset=",
  rating: "&rating=",
  lang: "&lang=",
  title: "&title=",
  username: "&username=jorgearojas",
  createUrl: consulta => {
    switch (consulta.tipo) {
      case "search":
        return `${gyphyObject.baseUrl}${gyphyObject.search}${gyphyObject.key}${gyphyObject.query}${consulta.search}${gyphyObject.limit}${consulta.limit}`;
        break;
      case "trending":
        return `${gyphyObject.baseUrl}${gyphyObject.trending}${gyphyObject.key}${gyphyObject.limit}${consulta.limit}`;
        break;
      case "upload":
        return `${gyphyObject.uploadUrl}${gyphyObject.key}${gyphyObject.username}${gyphyObject.title}${consulta.search}`;
        break;
      case "searchId":
        return `${gyphyObject.baseUrl}${gyphyObject.searchId}${consulta.search}${gyphyObject.key}`;
        break;
    }
  }
};

const UrlTypes = {
  search: "search",
  trending: "trending",
  upload: "upload",
  searchId: "searchId"
};

class Consulta {
  constructor(tipo, limit, search) {
    (this.tipo = tipo), (this.limit = limit), (this.search = search);
  }
}
