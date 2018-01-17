(function(){
    $.ajax({
        type: "GET",
        url: 'http://188.226.175.24/users',
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
            "<section class='gebruikernaam span_4_of_12 col'><p>"+ data[i].name +"</p></section>" +
            "<section class='gebruikeradres span_6_of_12 col'><p>"+ data[i].address +"</p></section>" +
            "<section class='span_2_of_12 col'>" +
            "<button><a href='gebruikerinfo.html?user="+ data[i].client_id +"'>info</a></button>" +
            "</section>" +
            "</li>")
    }
}

function addUser(e){
    e.preventDefault();

    adres = $('#adres').val();
    name = $('#name').val();


    $.ajax({
        type: "POST",
        url: 'http://188.226.175.24/user',
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            address: adres,
            name: name
        }),
        success: addInstelling
    });


}

function addInstelling(data){
    id = data.response.insertId;
    wc = Number($('#wc').val());
    douche = Number($('#douche').val());

    $.ajax({
        type: "POST",
        url: 'http://188.226.175.24/userInstelling',
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            id: id,
            wc: wc,
            douche: douche
        })
    });
    //
    // window.location.href = "gebruikers.html";
}