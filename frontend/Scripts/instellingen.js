function setEventListener(){
    $('form button').on('click', changeSettings);
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
    }
}


setEventListener();