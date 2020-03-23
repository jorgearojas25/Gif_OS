const gyphyObject = {
    baseUrl: 'https://api.giphy.com/v1/gifs',
    key: '?api_key=kDgsHz5JVb2MGrCVNQWBMoILrQ5wPm42',
    search: '/search',
    trending: '/trending',
    random: 'random',
    query: '&q=',
    limit: '&limit=',
    offset: '&offset=',
    rating: '&rating=',
    lang: '&lang=', 
    createUrl: (consulta) => {
        switch(consulta.tipo){
            case 'search':
                return `${gyphyObject.baseUrl}${gyphyObject.search}${gyphyObject.key}${gyphyObject.query}${consulta.search}${gyphyObject.limit}${consulta.limit}`
                break;
            case 'trending':
                return `${gyphyObject.baseUrl}${gyphyObject.trending}${gyphyObject.key}${gyphyObject.limit}${consulta.limit}`
                break;
        }
    }
}

const UrlTypes = {
    search: 'search',
    trending: 'trending'
}

class Consulta{
    constructor(tipo, limit, search){
        this.tipo = tipo,
        this.limit = limit,
        this.search = search
    }
}



