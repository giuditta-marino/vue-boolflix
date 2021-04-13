// Milestone   1: Creare   un   layout   base   con   una   searchbar   (una   input   e   un   button)   in   cui   possiamo scrivere   completamente   o   parzialmente   il   nome   di   un   film.   Possiamo,   cliccando   il bottone,   cercare   sull’API   tutti   i   film   che   contengono   ciò   che   ha   scritto   l’utente. Vogliamo   dopo   la   risposta   dell’API   visualizzare   a   schermo   i   seguenti   valori   per   ogni film   trovato: 1.Titolo 2.Titolo   Originale 3.Lingua 4.Voto

Vue.config.devtools = true;

var app = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    searchResult: [],
    api_key: '59d9354a6ba6f6c0a81844a496f08846',
    uri: 'https://api.themoviedb.org/3',
    language: 'it'
  },

  methods: {
    search: function(){
      axios.get(`${this.uri}/search/movie?api_key=${this.api_key}&query=${this.searchInput}&language=${this.language}`)
      .then((response) => {
        console.log(response.data.results);
        console.log(this.searchResult)
        this.searchResult = response.data.results
        console.log(this.searchResult)
        console.log(this.searchResult[0].poster_path);
      });
    }
  }

  // if (message[lastIndex].text.length > 35) {
  //   return message[lastIndex].text.substring(0, 35) + '...';
  // } else {
  //   return message[lastIndex].text
  // }


});
