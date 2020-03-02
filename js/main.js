const SearchGifs = a => {
  return fetch(
    gyphyObject.baseUrl +
      gyphyObject.search +
      gyphyObject.key +
      gyphyObject.query +
      a
  )
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.error(`[Search bar] ${e}`);
    });
};
