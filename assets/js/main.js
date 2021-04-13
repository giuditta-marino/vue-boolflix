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
  },

  mounted(){

  },

  methods: {
    search: function(){
      this.searchResult =[];

      axios.get(`${this.uri}/search/movie?api_key=${this.api_key}&query=${this.searchInput}&language=${this.language}`)
      .then((response) => {

        this.searchResult = [...this.searchResult, ...response.data.results];

        console.log(this.searchResult);

        axios.get(`https://api.themoviedb.org/3/search/tv?api_key=59d9354a6ba6f6c0a81844a496f08846&query=${this.searchInput}&language=it`)
        .then((response) => {
          console.log(response.data.results);

          this.searchResult = [...this.searchResult, ...response.data.results];

          console.log(this.searchResult);
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

    }



  }

});
