Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    searchResult: [],
    api_key: '59d9354a6ba6f6c0a81844a496f08846',
    uri: 'https://api.themoviedb.org/3',
    language: 'it',
    availableFlag: ['en', 'it', 'es', 'fr', 'pt', 'ru', 'de', 'zh          '],
    cast: [],
    isHidden: false
  },

  mounted(){

  },

  methods: {
    search: function(){
      this.searchResult =[];
      this.isHidden = false;

      axios.get(`${this.uri}/search/movie?api_key=${this.api_key}&query=${this.searchInput}&language=${this.language}`)
      .then((response) => {

        this.searchResult = [...this.searchResult, ...response.data.results];

        axios.get(`${this.uri}/search/tv?api_key=${this.api_key}&query=${this.searchInput}&language=${this.language}`)
        .then((response) => {

          this.searchResult = [...this.searchResult, ...response.data.results];

        });
      });

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

      n = Math.floor(n / 2);
      return n;

    },

    showCast: function(i){
      // al click, devo prendere il film specifico
      // e prenderne l'id
      // ${this.uri}/search/
      this.cast =[];

      console.log(this.searchResult[i].id);
      const id = this.searchResult[i].id;

      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=59d9354a6ba6f6c0a81844a496f08846`).
      then((response) =>{
        console.log(response.data.cast.slice(0,5));
        const actors = response.data.cast.slice(0,5);
        actors.forEach((item, i) => {
          this.cast.push(item.name);
        });

        console.log(this.cast);
      });

    }



  }

});
