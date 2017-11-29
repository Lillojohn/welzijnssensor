(function(){
    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/users',
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
    $('.gebruikerBox ul').empty();
}

function addListContent(data){
    for(var i = 0; i < data.length; i++){
        $('.gebruikerBox ul').append("<li class='gebruiker section group'>" +
            "<section class='gebruikeradres span_6_of_12 col'><p>"+ data[i].address +"</p></section>" +
            "<section class='gebruikertelefoon span_4_of_12 col'><p>"+ data[i].phonenumber +"</p></section>" +
            "<section class='span_2_of_12 col'>" +
            "<button><a href='gebruikerinfo.html?user="+ data[i].client_id +"'>info</a></button>" +
            "</section>" +
            "</li>")
    }
}