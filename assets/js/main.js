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

    // Prendo i generi dei film
    axios.get(`${this.uri}/genre/movie/list?api_key=${this.api_key}`)
    .then((response) => {
      let movieGenres = [...response.data.genres];
      movieGenres.forEach((item) => {
        this.genres.push(item.name);
      });
    });

    // Prendo i generi delle serie
    axios.get(`${this.uri}/genre/tv/list?api_key=${this.api_key}`)
    .then((response) => {
      let serieGenres = [...response.data.genres];
      serieGenres.forEach((item) => {
        if (!this.genres.includes(item.name)) {
          this.genres.push(item.name);
        }
      });
    });
  },

  computed: {

  },

  methods: {
    showGenre: function(){
      console.log(this.selectedGenre);
    },
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
      // filtro per categoria sia i risultati della ricerca che i popolari in firstPage
      if (this.category == 'Titoli') {
        if (this.firstPage) {
          return this.popularAll;
        } else {
          if (this.selectedGenre != '') {
            this.searchResult.filter((item) => item.genre_ids.includes(this.selectedGenre));
          }
          return this.searchResult;
        }
      } else if (this.category == 'Film') {
        if (this.firstPage) {
          return this.popularMovies;
        } else {
          return this.movieResult;
        }
      } else {
        if (this.firstPage) {
          return this.popularSeries;
        } else {
          return this.seriesResult;
        }
      }
    },

    getTitle: function(obj){
      if (obj.title) {
        return obj.title
      } else if (obj.name) {
        return obj.name
      }
    },

    getOriginalTitle: function(obj){
      if (obj.original_title) {
        return obj.original_title
      } else if (obj.original_name) {
        return obj.original_name
      }
    },

    voteTransform: function(n){

      n = Math.ceil(n / 2);
      return n;

    },

    showCast: function(i){
      // al click, devo prendere il film specifico
      // e prenderne l'id
      // ${this.uri}/search/
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

    selectCategory: function(e){
      // al click sulla categoria, prendo il testo dell'a e lo assegno a this.category
      this.category = e.target.innerHTML;
      this.selectedGenre = '';
    },

    homePage: function () {
     // this.firstPage = true;
     this.category = 'Titoli';
     this.selectedGenre = '';
   },

   resultsTitle: function () {
      if (this.firstPage) {
        return `Popolari su Boolflix - ${this.category}`;
      } else {
        return `Risultati della ricerca - ${this.category}`;
      }
    },
  }

});
