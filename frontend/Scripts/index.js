(function(){
    $.ajax({
        type: "GET",
        url: 'http://95.85.46.251/meldingen',
        success: userAjax
    });
})();

function userAjax(data){
    buildTemplate(data.response);
}

function buildTemplate(data){
    deleteListContent();
    addListContent(data);
}

function deleteListContent(){
    $('.meldingBox ul').empty();
}

function addListContent(data){
    for(var i = 0; i < data.length; i++){
        $('.meldingBox ul').append("<li class='melding section group color"+ data[i].melding_id+" background"+ data[i].status+"'>" +
        "<section class='meldingnaam span_6_of_12 col'><p>"+ data[i].melding_naam+"</p></section>" +
        "<section class='span_4_of_12 col'><p>"+ data[i].date.substring(0, 9) +" "+ data[i].time +"</p></section>" +
        "<section class='span_2_of_12 col'>" +
        "<button><a href='gebruikerinfo.html'>info</a></button>" +
        "</section>" +
        "</li>")
    }
}