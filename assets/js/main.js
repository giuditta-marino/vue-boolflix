Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    searchResult: [],
    api_key: '59d9354a6ba6f6c0a81844a496f08846',
    uri: 'https://api.themoviedb.org/3',
    language: 'it',
    availableFlag: ['en', 'it', 'es', 'fr', 'pt', 'ru', 'de', 'zh'],
    cast: [],
    isHidden: false,
    popular: true,
    category: 'Titoli',
    genres: [],
    firstPage: true,
    selectedGenre: '',
    popularMovies:[],
    popularSeries:[],
    popularAll:[],
    movieResult: [],
    seriesResult: [],
  },

  mounted(){
    // Prendo i film popolari
    axios.get(`${this.uri}/movie/popular?api_key=${this.api_key}&language=${this.language}&page=1`).
    then((response) => {
      this.popularMovies = [...response.data.results];
    });

    // Prendo le serie popolari
    axios.get(`${this.uri}/tv/popular?api_key=${this.api_key}&language=${this.language}&page=1`).
    then((response) => {
      this.popularSeries = [...response.data.results];
      // prendo serie e film popolari
      this.popularAll = [...this.popularMovies, ...this.popularSeries];
    });

    // Prendo i generi dei film e li pusho in genres
    axios.get(`${this.uri}/genre/movie/list?api_key=${this.api_key}`)
    .then((response) => {
      this.genres = [...response.data.genres];
    });

    // Prendo i generi delle serie e li pusho in genres se non sono contenuti già usando due variabili di appoggio
    axios.get(`${this.uri}/genre/tv/list?api_key=${this.api_key}`)
    .then((response) => {
        let movieGenres =[];
        this.genres.forEach((item, i) => {
          movieGenres.push(item.name)
        });
        let serieGenres = [... response.data.genres];
        serieGenres.forEach((item, i) => {
          if (!movieGenres.includes(item.name)) {
            this.genres.push(item);
          }
        });
        // ordino alfabeticamente i nomi dei generi
        this.genres.sort(function(a, b){
          if(a.name < b.name) {
            return -1;
          }
          if(a.name > b.name) {
            return 1;
          }
          return 0;
        });
    });

  },

  methods: {
    // funzione di ricerca tramite chiamate axios
    search: function(){
      this.searchResult = [];
      this.isHidden = false;
      this.firstPage = false;
      this.category = 'Titoli';

      axios.get(`${this.uri}/search/movie?api_key=${this.api_key}&query=${this.searchInput}&language=${this.language}`)
      .then((response) => {
        // salvo in una variabile i risultati dei film
        this.movieResult = [...response.data.results];
        // salvo in searchResult i risultati dei film per sommarli a quelli delle serie
        this.searchResult = [...this.searchResult, ...response.data.results];

        axios.get(`${this.uri}/search/tv?api_key=${this.api_key}&query=${this.searchInput}&language=${this.language}`)
        .then((response) => {
          // salvo in una variabile i risultati delle serie
          this.seriesResult = [...response.data.results];
          // sommo in searchResult i risultati delle serie a quelli dei film
          this.searchResult = [...this.searchResult, ...response.data.results];
        });
      });
    },

    filterCategory: function() {
      // filtro per categoria e per genere sia i risultati della ricerca che i popolari in firstPage
      if (this.category == 'Titoli') {
        if (this.firstPage) {
          if (this.selectedGenre != ''){
            let filtered = this.popularAll.filter((item)=>
            item.genre_ids.includes(this.selectedGenre));
            return filtered;
          }
          return this.popularAll;
        } else {
            if (this.selectedGenre != '') {
              let filtered = this.searchResult.filter((item) =>
              item.genre_ids.includes(this.selectedGenre));
              return filtered;
            }
            return this.searchResult;
          }
      } else if (this.category == 'Film') {
        if (this.firstPage) {
          if (this.selectedGenre != '') {
            let filtered = this.popularMovies.filter((item)=> item.genre_ids.includes(this.selectedGenre));
            return filtered;
          }
          return this.popularMovies;
        } else {
          if (this.selectedGenre != '') {
            let filtered = this.movieResult.filter((item)=> item.genre_ids.includes(this.selectedGenre));
            return filtered;
          }
          return this.movieResult;
        }
      } else {
        if (this.firstPage) {
          if (this.selectedGenre != '') {
            let filtered = this.popularSeries.filter((item)=> item.genre_ids.includes(this.selectedGenre));
            return filtered;
          }
          return this.popularSeries;
        } else {
          if (this.selectedGenre != '') {
            let filtered = this.seriesResult.filter((item)=> item.genre_ids.includes(this.selectedGenre));
            return filtered;
          }
          return this.seriesResult;
        }
      }
    },

    // prendo i titoli dei film e delle serie
    getTitle: function(obj){
      if (obj.title) {
        return obj.title
      } else if (obj.name) {
        return obj.name
      }
    },

    // prendo i titoli originali dei film e delle serie
    getOriginalTitle: function(obj){
      if (obj.original_title) {
        return obj.original_title
      } else if (obj.original_name) {
        return obj.original_name
      }
    },

    // trasformo il voto per esprimerlo in quinti
    voteTransform: function(n){
      n = Math.ceil(n / 2);
      return n;
    },

    // al click, devo prendere il film specifico
    // e prenderne l'id per poter, tramite chiamata axios, ottenere il cast
    showCast: function(i){
      this.cast =[];

      const id = this.searchResult[i].id;

      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=59d9354a6ba6f6c0a81844a496f08846`).
      then((response) =>{
        const actors = response.data.cast.slice(0,5);
        actors.forEach((item, i) => {
          this.cast.push(item.name);
        });
      });
    },

    // funzione per mostrare cast dei film popolari
    showCastPop: function(i){
      this.cast =[];

      const id = this.popularAll[i].id;

      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=59d9354a6ba6f6c0a81844a496f08846`).
      then((response) =>{
        const actors = response.data.cast.slice(0,5);
        actors.forEach((item, i) => {
          this.cast.push(item.name);
        });
      });
    },

    // al click sulla categoria, prendo il testo dell'a e lo assegno a this.category
    selectCategory: function(e){
      this.category = e.target.innerHTML;
      this.selectedGenre = '';
    },

    // al click sul logo, torno ai film popolari
    homePage: function () {
     this.firstPage = true;
     this.searchInput = '';
     this.category = 'Titoli';
     this.selectedGenre = '';
   },

   // titolo dinamico che indica il contenuto dei risultati
   resultsTitle: function () {
      if (this.firstPage) {
        return `Popolari su Boolflix - ${this.category}`;
      } else {
        return `Risultati della ricerca - ${this.category}`;
      }
    },
  }

});
