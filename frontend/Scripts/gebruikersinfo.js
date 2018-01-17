(function(){
    var url_string = window.location.href
    var url = new URL(url_string);
    var userId = url.searchParams.get("user");

    $('form button').on('click', changeSettings);

    $.ajax({
        type: "GET",
        url: 'http://188.226.175.24/user/' + userId,
        success: userAjax
    });


    $.ajax({
        type: "GET",
        url: 'http://188.226.175.24/meldingen/' + userId,
        success: meldingAjax
    });

    $.ajax({
        type: "GET",
        url: 'http://188.226.175.24/activeiten/' + userId,
        success: instellingenAjax
    });

    $.ajax({
        type: "GET",
        url: 'http://188.226.175.24/zorgdag/' + userId,
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
    $('#naam').val(data[0].name);
    $('#adres').val(data[0].address);
}

function meldingAjax(data){
    buildMessageTemplate(data.response);
}

function buildMessageTemplate(data){
    deleteListContent();
    // changeStatus(data);
    addMessageListContent(data);
}

function deleteListContent(){
    $('.meldingBox ul').empty();
}

function changeStatus(data){
    for(var i = 0; i < data.length; i++){
        $.ajax({
            type: "POST",
            url: 'http://188.226.175.24/changestatus/' + data[i].melding_persoon_id
        });
    }
}

function addMessageListContent(data) {
    for(var i = 0; i < data.length; i++){
        $('.meldingBox ul').append("<li class='melding section group color"+ data[i].melding_id+" background"+ data[i].status+"'>" +
            "<section class='meldingnaam span_6_of_12 col'><p>"+ data[i].melding_naam+"</p></section>" +
            "<section class='span_4_of_12 col'><p>"+ data[i].date.substring(0, 9) +" "+ data[i].time +"</p></section>" +
            "</li>")
    }
}

function instellingenAjax(data){
    buildInstellingenTemplate(data.response);
}

function buildInstellingenTemplate(data){
    addInstellingen(data);
}

function addInstellingen(data){
    $('#wc').val(data[0].wc);
    $('#douche').val(data[0].douche);
}

function zorgdagAjax(data){
    addZorgdag(data.response);
}

function addZorgdag(data){
    let toiletCount = [];
    let doucheCount = [];

    for(let i = 0; i < data.length; i++){
        if(data[i].water == 8){
            toiletCount.push(data[i].water);
        }
        if(data[i].water == 49){
            doucheCount.push(data[i].water)
        }
    }

    $('#vandaagwc').text(toiletCount.length);
    $('#vandaagdouche').text(doucheCount.length);
    // let labels = [];
    // for(let i = 0; i < data.length; i++){
    //     if(data[i].water != 0){
    //         labels.push(data[i].time);
    //     } else {
    //         labels.push("");
    //     }
    //
    // }
    //
    // let dataArray = [];
    // for(let i = 0; i < data.length; i++){
    //     dataArray.push(data[i].water);
    // }
    //
    // var ctx = document.getElementById("myChart").getContext('2d');
    // var chart = new Chart(ctx, {
    //     // The type of chart we want to create
    //     type: 'line',
    //
    //     // The data for our dataset
    //     data: {
    //         labels: labels,
    //         datasets: [{
    //             label: "Week 47",
    //             backgroundColor: 'rgb(179, 203, 230)',
    //             borderColor: 'rgb(179, 203, 230)',
    //             data: dataArray,
    //         }]
    //     },
    //
    //     // Configuration options go here
    //     options: {}
    // });
}

function changeSettings(e){
    e.preventDefault();
    if($(this).parent().find('input').attr('readonly')){
        $(this).parent().find('input').prop('readonly', false);
        $(this).find('img').prop('src', 'Assets/confirm.png');
        $(this).parent().find('input').select();
    } else {
        $(this).parent().find('input').prop('readonly', true);
        $(this).find('img').prop('src', 'Assets/change.png');
        changeInstellingen($(this).parent().find('input'));
    }
}

function changeInstellingen(water){
    let name = water[0].name;
    let value = water.val();

    var url_string = window.location.href
    var url = new URL(url_string);
    var userId = url.searchParams.get("user");

    if(name === "wc"){
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: 'http://188.226.175.24/changeinstellingen/',
            data: {
                id: userId,
                wc: value
            }
        });
    }

    if(name === "douche"){
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: 'http://188.226.175.24/changeinstellingen/' + data[i].melding_persoon_id,
            data: {
                id: userId,
                douche: value
            }
        });
    }
}