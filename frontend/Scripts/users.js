(function(){
    $.ajax({
        type: "GET",
        url: 'http://95.85.46.251/users',
        success: userAjax
    });

    $('.saveButton').on('click', addUser);
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
            "<section class='gebruikeradres span_10_of_12 col'><p>"+ data[i].address +"</p></section>" +
            "<section class='span_2_of_12 col'>" +
            "<button><a href='gebruikerinfo.html?user="+ data[i].client_id +"'>info</a></button>" +
            "</section>" +
            "</li>")
    }
}

function addUser(e){
    e.preventDefault();

    adres = $('#adres').val();

    $.ajax({
        type: "POST",
        url: 'http://95.85.46.251/user',
        data: {
            address: adres
        }
    });

    window.location.href = "gebruikers.html";
}