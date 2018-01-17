(function(){
    $.ajax({
        type: "GET",
        url: 'http://188.226.175.24/meldingen',
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
        $('.meldingBox ul').append("<li class='melding section group color"+ data[i].melding_id+"'>" +
        "<section class='meldingnaam span_3_of_12 col'><p>"+ data[i].melding_naam+"</p></section>" +
        "<section class='meldingnaam span_3_of_12 col'><p>"+ data[i].melding_naam+"</p></section>" +
        "<section class='span_4_of_12 col'><p>"+ data[i].date.substring(0, 9) +" "+ data[i].time +"</p></section>" +
        "<section class='span_2_of_12 col'>" +
        "<button><a href='gebruikerinfo.html?user="+ data[i].client_id +"'>info</a></button>" +
        "</section>" +
        "</li>");
    }
}