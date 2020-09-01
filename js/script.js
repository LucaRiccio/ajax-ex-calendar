// Creiamo un calendario dinamico con le festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).Milestone 1
// Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.Milestone 2
// Diamo la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività.Attenzione!
// Ogni volta che cambio mese dovrò:
// Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
// Controllare quanti giorni ha il mese scelto formando così una lista
// Chiedere all’API quali sono le festività per il mese scelto
// Evidenziare le festività nella lista

$(document).ready(function(){

  var dataCorrente = moment('2018-01-01'); // Memorizzo il mese di partenza

  // Tasto Next
  $("#next").click(function(){
    if (dataCorrente.month() == 11){
      alert("Fine calendario!");
    } else {
      dataCorrente.add(1, 'M');
      $(".month-list li").remove();
      insertDays(dataCorrente);
      insertHolidays(dataCorrente);
    }
  });

  // Tasto prev
  $("#prev").click(function(){
    if (dataCorrente.month() == 0){
      alert("Fine calendario!");
    } else {
      dataCorrente.subtract(1, 'M');
      $(".month-list li").remove();
      insertDays(dataCorrente);
      insertHolidays(dataCorrente);
    }
  });

  insertDays(dataCorrente);
  insertHolidays(dataCorrente);

});


// ***FUNZIONI***

// Funzione per inserimento feste.
function insertHolidays(data){
  $.ajax(
    {
      url: "https://flynn.boolean.careers/exercises/api/holidays",
      method: "GET",
      data: {
        year:data.year(),
        month:data.month()
      },
      success: function(risposta){
        var vacanze = risposta.response;
        for (var i = 0; i < vacanze.length; i++){
          var vacanza = vacanze[i];
          console.log(vacanza);
          var listItem = $('li[data-complete-date="' + vacanza.date + '"]');
          console.log(listItem);
          if (listItem){
            listItem.addClass('holiday');
            listItem.text(listItem.text() + ' - ' + vacanza.name);
          }
        }
      },
      error: function(){
        alert("È avvenuto un errore.");
     }
    }
  );
}

// Funzione per inserimento giorni nel calendario.
function insertDays(data){
  var month = data.format('MMMM'); // Memorizzo in una var il mese.
  var year = data.format('YYYY'); // Memorizzo in una var l'anno.
  $("h1.month").html(month + " " + year); // Ottengo mese e anno
  var daysMonth = data.daysInMonth();  // Ottengo automaticamente il numero di giorni che il mese contiene.

  // Ciclo for che genera automaticamente i giorni del mese.
  for (var i = 1; i <= daysMonth; i++){
    var source = $("#day-template").html();
    var template = Handlebars.compile(source);

    var context = {
      day: addZero(i), // Ricavo il giorno utilizzando la i.
      month: month,  // Ricavo il mese dalla variabile precedentemente dichiarata.
      completeDate: year + "-" + data.format('MM') + "-" + addZero(i) // Ottengo la data completa
    };

    var html = template(context);
    $(".month-list").append(html);
  }
}

//Funzione per aggiungere lo zero
function addZero(n){
  if (n < 10){
    return '0' + n;
  }
  return n;
}
