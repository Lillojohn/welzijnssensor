(function(){
    var url_string = window.location.href
    var url = new URL(url_string);
    var userId = url.searchParams.get("user");

    $.ajax({
        type: "GET",
        url: 'http://95.85.46.251/user/' + userId,
        success: userAjax
    });


    $.ajax({
        type: "GET",
        url: 'http://95.85.46.251/meldingen/' + userId,
        success: meldingAjax
    });

    $.ajax({
        type: "GET",
        url: 'http://95.85.46.251/activeiten/' + userId,
        success: activeitenAjax
    });

    $.ajax({
        type: "GET",
        url: 'http://95.85.46.251/zorgdag/' + userId,
        success: zorgdagAjax
    });
})();

function userAjax(data){
    buildTemplate(data.response);
}

function buildTemplate(data){
    addListContent(data);
}

function addListContent(data){
    $('#adres').val(data[0].address);
}

function meldingAjax(data){
    buildMessageTemplate(data.response);
}

function buildMessageTemplate(data){
    deleteListContent();
    addMessageListContent(data);
}

function deleteListContent(){
    $('.meldingBox ul').empty();
}

function addMessageListContent(data) {
    for(var i = 0; i < data.length; i++){
        $('.meldingBox ul').append("<li class='melding section group'>" +
            "<section class='meldingnaam span_6_of_12 col'><p>"+ data[i].melding_naam+"</p></section>" +
            "<section class='span_4_of_12 col'><p>"+ data[i].date.substring(0, 9) +" "+ data[i].time +"</p></section>" +
            "<section class='span_2_of_12 col'>" +
            "<button><a href='gebruikerinfo.html'>info</a></button>" +
            "</section>" +
            "</li>")
    }
}

function activeitenAjax(data){
    buildActiveitenTemplate(data.response);
}

function buildActiveitenTemplate(data){
    addActiviteiten(data);
}

function addActiviteiten(data){
    var actiectx = document.getElementById("actieChart").getContext('2d');
    var actiechart = new Chart(actiectx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ["Toilet gebruik per dag", "Gem liter gebruik toilet", "Douchte gebruik per dag", "Liters de hele dag"],
            datasets: [{
                label: "Vandaag",
                backgroundColor: 'rgb(179, 203, 230)',
                borderColor: 'rgb(179, 203, 230)',
                data: [data[0].avg_toilet_per_day, data[0].avg_litre_per_toiler, data[0].avg_shower_per_day, data[0].avg_litre_per_day],
            }]
        },

        // Configuration options go here
        options: {}
    });
}

function zorgdagAjax(data){
    addZorgdag(data.response);
}

function addZorgdag(data){
    console.log(data)
}