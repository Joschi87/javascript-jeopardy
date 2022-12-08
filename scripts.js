var activeTeam = "";
var map;
$(function(){
    $.ajax({
        'async': false,
        'global': false,
        type:'GET',
        dataType:'json',
        url:'board.json',
        success:function(data){
            map = data;
            loadBoard();
            loadUsers();
            updateScore();
        }
    });
    $('.unanswered').click(function(){
        var category = $(this).parent().data('category');
        var question = $(this).data('question');
        var value = map[category].questions[question].value;
        var answers = $('#answers');
        $('.modal-title').empty().text(map[category].name);
        $('#question').empty().text(map[category].questions[question].question);
        answers.empty();
        $.each(map[category].questions[question].answers, function(i, answer){
            answers.append(
                '<button class="btn btn-danger answer" ' +
                    'data-category="'+category+'"' +
                    'data-question="'+question+'"' +
                    'data-value="'+value+'"' +
                    'data-correct="'+answer.correct+'"' +
                    '>'+ answer.text+'</button><br><br>'
            )
        });
        $('#question-modal').modal('show');
        //console.log(category, question);
        //console.log(map[category].questions[question]);
        handleAnswer();
    });

});

function loadBoard(){
    var board = $('#main-board');
    var columns = map.length;
    var column_width = parseInt(12/columns);
    $.each(map, function(i,category){
        //load category name
        var header_class = 'text-center col-md-' + column_width;
        if (i === 0 && columns % 2 != 0){
            header_class += ' col-md-offset-1';
        }
        $('.panel-heading').append(
            '<div class="'+header_class+'"><h4>'+category.name+'</h4></div>'
        );
        //add column
        var div_class = 'category col-md-' + column_width;
        if (i === 0 && columns % 2 != 0){
            div_class += ' col-md-offset-1';
        }
        board.append('<div class="'+div_class+'" id="cat-'+i+'" data-category="'+i+'"></div>');
        var column = $('#cat-'+i);
        $.each(category.questions, function(n,question){
            //add questions
            column.append('<div class="well question unanswered" data-question="'+n+'">'+question.value+'</div>')
        });
    });
    $('.panel-heading').append('<div class="clearfix"></div>');

}

function updateScore(){
    var lenghtUsers = users.length;
    var output = "";
    for (var i = 0; i < lenghtUsers; i++){
        output += "Team: " + users[i].name + " Score: " + users[i].score +"</br>";
    }
    document.getElementById("score").innerHTML = output;
}

function handleAnswer(){
    $('.answer').click(function(){
        var tile= $('div[data-category="'+$(this).data('category')+'"]>[data-question="'+$(this).data('question')+'"]')[0];
        $(tile).empty().removeClass('unanswered').unbind().css('cursor','not-allowed');
        if ($(this).data('correct')){
            var index = users.findIndex(function(item, i){
                return item.name === activeTeam;
            });
            users[index].score += parseInt($(this).data('value'));
        }else {
            setActivTeam();
        }
        $('#question-modal').modal('hide');
        updateScore()
    })
}

function loadUsers(){
    $.ajax({
        'async': false,
        'global': false,
        type: 'GET',
        dataType: 'json',
        url: 'players.json',
        success: function (data) {
            users = data;
            setActivTeam();
        }
    })
}

function setActivTeam(){
    if (activeTeam === "") {
        for (let i = 0; i < users.length; i++) {
            if (users[i].beginner === true) {
                activeTeam = users[i];
            }
        }
    }else {
        var randomNum;
        for (var j = 0; j < 20; j++){
            randomNum = Math.floor(Math.random() * users.length);
            if (users[randomNum].name !== activeTeam.name){
                activeTeam = users[randomNum];
                break;
            }
        }
    }
    console.log(activeTeam);
    document.getElementById("activTeam").innerHTML = activeTeam.name;
}