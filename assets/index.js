var scoreToWin = 0;
var playersArr = JSON.parse(localStorage.getItem("winners-arr")) ? JSON.parse(localStorage.getItem("winners-arr")) : [];

function commonJs(){
    $(".players-list-section").hide();
    $(".scoring-section").hide();
    $(".new-player-addition").hide();
    $(".edit-win-score-field").hide();
    $(".stats-main-box").hide();
    $(".playersCountNextBtn").prop("disabled", true);

    var playersCount = 0;
    $(".playersCountNextBtn").on("click", function (){
        playersCount = parseInt($("#noOfPlayers").val());
        scoreToWin = parseInt($("#scoreToWin").val()) ? parseInt($("#scoreToWin").val()) : 100;
        window.localStorage.removeItem("score-to-win");
        localStorage.setItem("score-to-win", scoreToWin);
        $(".players-count-section").hide();
        $(".players-list-section").show();
        for(let i = 1; i <= playersCount; i++){
            a = document.createElement("div");
            a.setAttribute("class", "lists form-group row pt-2 pb-2")

            b = document.createElement("label");
            b.setAttribute("class", "col-form-label");
            b.setAttribute("htmlFor", "player" + i);
            b.innerHTML = "Player " + i;

            c = document.createElement("div");
            c.setAttribute("class", "input-field");

            d = document.createElement("input");
            d.setAttribute("type", "text");
            d.setAttribute("name", "player"+i+"name");
            d.setAttribute("class", "form-control");
            d.setAttribute("id", "player"+i);
            d.setAttribute("required", "required");
            d.setAttribute("onkeypress", "return /[a-z]/i.test(event.key)");

            c.appendChild(d);
            a.appendChild(b);
            a.appendChild(c);

            $(".players-list-section .container-div").append(a);
        }
    });

    var arr = [];
    $(".playersListNextBtn").on("click", function (e){
        var isValid = true;
        $('.players-list input[type="text"]').each(function() {
            let playerName = $(this).val();
            arr.push(playerName);
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        });
        if (isValid == false){
            e.preventDefault();
        }
        else{
            $(".players-list-section").hide();
            $(".scoring-section").show();
        }

        var countPos = 1;
        for(let i = 0; i < arr.length; i++){
            let a = document.createElement("li");
            a.setAttribute("class", arr[i] + "List");
            let b = document.createElement("div");
            b.setAttribute("class", "players-name");
            b.innerHTML = "<div class='position-and-name'><span>" + countPos + "</span><p>"+ arr[i] + "</p></div>";
            a.appendChild(b);
            $(".scoring-section .name-list").append(a);
            countPos++;

            let c = document.createElement("li");
            c.setAttribute("class", "players-score");

            for( let j = 1; j <= 20; j++){
                let d = document.createElement("input");
                d.setAttribute("type", "number");
                d.setAttribute("class", arr[i] + "Score" + j + " " + arr[i]);
                d.setAttribute("id", arr[i]);
                d.setAttribute("value", "");
                c.append(d);
            }
            $(".scoring-section .score-list").append(c);

            let e = document.createElement("li");
            e.setAttribute("class", arr[i] + "TotalScore");
            e.innerHTML = "<span>0</span>";
            $(".scoring-section .total-score-list").append(e);
        }
    });

    $(document).on("click", ".scoring-update-btns .update-btn", function (){
        window.localStorage.removeItem("name-list");
        window.localStorage.removeItem("score-fields");
        window.localStorage.removeItem("total-score-fields");
        var count = 1;

        $totalScoreFields = $(".scoring-section .scoring-full-chart .total-score-list");
        $scoreFields = $(".scoring-section .scoring-full-chart .score-list");
        $nameFields = $(".scoring-section .scoring-full-chart .name-list");

        $totalScoreFields.find('li').sort(function(a, b) {
            return +a.dataset.order - +b.dataset.order;
        }).appendTo($totalScoreFields);

        $scoreFields.find('li').sort(function(a, b) {
            return +a.dataset.order - +b.dataset.order;
        }).appendTo($scoreFields);

        $nameFields.find('li').sort(function(a, b) {
            return +a.dataset.order - +b.dataset.order;
        }).appendTo($nameFields);

        $(".scoring-section .scoring-full-chart .name-list li").each(function (){
            $(this).find(".players-name").find(".position-and-name").find("span").text(count);
            $playerName = $(this).find(".players-name").find(".position-and-name").find("p").text();
            count++;
        });

        var playerOutCount = 0;
        $(".scoring-section .scoring-full-chart .score-list .in-game").each(function (){
            playerOutCount++;
        });

       $(".stats-main-box .stats-list").find("ul").remove();
       var ul = document.createElement("ul");
       for(let x = 0; x < playersArr.length; x++){
           a = document.createElement("li");
           a.setAttribute("class", playersArr[x]);
           b = document.createElement("p");
           b.setAttribute("class", "name");
           b.innerHTML = playersArr[x];
           c = document.createElement("h2");
           c.setAttribute("class", "win-streak");
           c.innerHTML = 0;
           a.appendChild(b);
           a.appendChild(c);
           ul.appendChild(a);
       }
        $(".stats-list").append(ul);

        var $increm = 0;
        var $winnerName = '';
        if(playerOutCount === 1){
            let $winnerScore = $(".scoring-section .scoring-full-chart .score-list .in-game").attr("data-order");
            $(".scoring-section .scoring-full-chart .name-list li").each(function (){
                if($(this).attr("data-order") === $winnerScore){
                    $winnerName = $(this).find(".players-name").find(".position-and-name").find("p").text();
                    $("#congratulationsPopup").find(".congrats-content-div").find("p").text($winnerName);
                    $(".congrats-gif").find("img").attr("src", "assets/images/fireworks-gif.gif");
                    $("#congratulationsPopup").modal("show");
                    setTimeout(function () {
                        $("#congratulationsPopup").modal("hide");
                        $(".congrats-gif").find("img").attr("src", "");
                        $winnersLocalStorage = localStorage.getItem("winners-list");
                        $(".winners-list").append($winnersLocalStorage);

                        $(".winners-list li").each(function (){
                            $selectStreak = $(this).find("#winnerStreak").find("span").text();
                            $(this).attr("data-select-streak", $selectStreak);
                        });

                        $winnerSelectFields = $(".winners-list-section .winners-list");

                        $winnerSelectFields.find('li').sort(function(a, b) {
                            return -a.dataset.selectStreak - -b.dataset.selectStreak;
                        }).appendTo($winnerSelectFields);

                        $(".scoring-section").hide();
                        $(".winners-list-section").show();
                    }, 5000);
                    let $playersWinCount = parseInt($("." + $winnerName).find(".win-streak").html());
                    $increm = $playersWinCount+1;
                }
            });
            $("." + $winnerName).find(".win-streak").text($increm);
        }

        localStorage.setItem("name-list", $nameFields.html());
        localStorage.setItem("score-fields", $scoreFields.html());
        localStorage.setItem("total-score-fields", $totalScoreFields.html());
     });

    $(".stats-btn").on("click", function (){
        $(this).hide();
        $stats = localStorage.getItem("winners-list");
        $(".stats-main-box .stats-list").innerHTML="";
        $(".stats-main-box .stats-list").append($stats);
        $(".stats-main-box .stats-list").each(function (){
            $(this).find("li").find(".inputRadio").remove();
        });
         $(".stats-main-box").show();

        var count = 1;
         $(".stats-list li").each(function (){
            $streak = $(this).find("#winnerStreak").find("span").text();
            $(this).attr("data-streak", $streak);

             let a = document.createElement("div");
             a.setAttribute("class", "winnerSequence");
             a.innerHTML = "<span>" + count + "</span>";
             $(this).find(".winnerName").prepend(a);
             count++;
         });


        $winnerFields = $(".stats-list");

        $winnerFields.find('li').sort(function(a, b) {
            console.log(a.dataset.streak, b.dataset);
            return -a.dataset.streak - -b.dataset.streak;
        }).appendTo($winnerFields);
    });

    $(".add-player-btn").on("click", function (){
        $(".edit-win-score-field").hide();
        $(".new-player-addition").show();
        $(".new-player-addition input").val('');
    });

    $(".edit-win-score-btn").on("click", function (){
        $(".new-player-addition").hide();
        $(".edit-win-score-field").show();
        $(".edit-win-score-field input").val('');
    });

    $(".close-player-added").on("click", function (){
        $(".new-player-addition").hide();
        $(".new-player-addition input").val('');
    });

    $(".close-edit-win-score").on("click", function (){
        $(".edit-win-score-field").hide();
        $(".edit-win-score-field input").val('');
    });

    $(".player-added-btn").on("click", function (e){
        var ifValid = true;
        var newPlayerName;
        $('.new-player-addition input[type="text"]').each(function() {
            newPlayerName = $(this).val();
            // arr.push(playerName);
            if ($.trim($(this).val()) == '') {
                ifValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        });
        if (ifValid == false){
            e.preventDefault();
        }
        else{
            $(".new-player-addition").hide();

            let a = document.createElement("li");
            a.setAttribute("class", newPlayerName + "List");
            let b = document.createElement("div");
            b.setAttribute("class", "players-name");
            b.innerHTML = "<div class='position-and-name'><span></span><p>"+ newPlayerName + "</p></div>";
            a.appendChild(b);
            $(".scoring-section .name-list").append(a);

            let e = document.createElement("li");
            e.setAttribute("class", newPlayerName + "TotalScore");
            e.innerHTML = "<span>0</span>";
            $(".scoring-section .total-score-list").append(e);

            let c = document.createElement("li");
            c.setAttribute("class", "players-score");
            for( let j = 1; j <= 20; j++){
                let d = document.createElement("input");
                d.setAttribute("type", "number");
                d.setAttribute("class", newPlayerName + "Score" + j + " " + newPlayerName);
                d.setAttribute("id", newPlayerName);
                c.append(d);
            }
            $(".scoring-section .score-list").append(c);
        }
    });

    $(".save-edit-win-score").on("click", function (){
        newScoreToWin = parseInt($(".edit-win-score-field input").val());
        window.localStorage.removeItem("score-to-win");
        localStorage.setItem("score-to-win", newScoreToWin);
        $(".edit-win-score-field").hide();
        $(".edit-win-score-field input").val('');
    });

    $(document).on("click", ".cancel-nav a", function (){
        location.reload();
        $(".stats-btn").show();
    });

    $(document).on("click", ".continuePreviousMatchBtn", function (){
        $(".players-count-section").hide();
        $(".players-list-section").hide();
        $(".scoring-section").show();

        $nameList = localStorage.getItem("name-list");
        $scoreList = localStorage.getItem("score-fields");
        $totalScoreList = localStorage.getItem("total-score-fields");

        $(".scoring-section .scoring-full-chart .name-list").append($nameList);
        $(".scoring-section .scoring-full-chart .total-score-list").append($totalScoreList);
        $(".scoring-section .scoring-full-chart .score-list").append($scoreList);
    });
}

function calculateSum(){
    $(document).on("keyup", ".players-score input[type='number']", function (){
        $player = $(this).attr("id");
        $playerClass = $(this).attr("class").toString().split(" ")[0];
        $expenses = $(this).parents('.players-score').find('input');
        $scoreDiv = $(this).parents('.players-score').parents(".score-list");
        $expenseTotal = $("." + $player + "TotalScore").find("span");
        $expenseTotal.val('0');
        $winScore = JSON.parse(window.localStorage.getItem('score-to-win')) ? JSON.parse(window.localStorage.getItem('score-to-win')) : 100;

        $.each($expenses,function(index,object){
            if($(object).val()!='')
            {
                object.setAttribute("value", $(object).val());
                if($(object).val() === "0" || $(object).val() === 0){
                    $("." + $playerClass).addClass("has-winner");
                }else{
                    $("." + $playerClass).removeClass("has-winner");
                }
                var abc = $expenseTotal.val(parseInt($expenseTotal.val())+parseInt($(object).val()));
                $expenseTotal.text(abc.val());
                $("." + $player + "TotalScore").attr("data-order", abc.val());
                $("." + $player + "List").attr("data-order", abc.val());
                $(this).parent().attr("data-order", abc.val());
            }
        })

        $id = $(this).attr("id");
        $totalVal = $(this).parent().attr("data-order");

        if($totalVal >= $winScore){
            $(this).parent().addClass("in-danger");
            $(this).parent().removeClass("in-game");
            $(".scoring-full-chart .total-score-list ." + $id + "TotalScore").addClass("in-danger");
        }
        if($totalVal < $winScore){
            $(this).parent().removeClass("in-danger");
            $(this).parent().addClass("in-game");
            $(".scoring-full-chart .total-score-list ." + $id + "TotalScore").removeClass("in-danger");
        }
    });
}

function countChar(val) {
    var len = val.value.length;
    if (len >= 1) {
        $(".playersCountNextBtn").prop("disabled", false);
    }else{
        $(".playersCountNextBtn").prop("disabled", true);
    }
}

function winnersList(){
    $(".winnersListAddWinnerBtn").on('click', function (){
        $(".new-winner-addition").show();
        $(".new-winner-addition input").val('');
        $(".new-winner-addition input").css({
            "border": "",
            "background": ""
        });
    });

    $(".winner-added-btn").on("click", function (){
        var ifValid = true;
        var newWinnerName;
        $('.new-winner-addition input[type="text"]').each(function() {
            newWinnerName = $(this).val();
            if ($.trim($(this).val()) == '') {
                ifValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        });
        if (ifValid == false){
            e.preventDefault();
        }
        else {
            $(".new-winner-addition").hide();
            let a = document.createElement("li");
            a.setAttribute("class", newWinnerName + "List");
            let f = document.createElement("div");
            f.setAttribute("class","winnerSeries");
            f.innerHTML = "<span>1</span>";
            let b = document.createElement("div");
            b.setAttribute("class", "winnerName");
            b.innerHTML = "<p>"+ newWinnerName + "</p>";
            let e = document.createElement("div");
            e.setAttribute("class", "inputRadio");
            let c = document.createElement("input");
            c.setAttribute("type", "radio");
            c.setAttribute("id", "winnerRadioBtn");
            c.setAttribute("name", "radioGroup");
            c.setAttribute("value", newWinnerName);
            let d = document.createElement("p");
            d.setAttribute("id", "winnerStreak");
            d.innerHTML="<span>0</span>";
            b.appendChild(d);
            e.appendChild(c);
            a.appendChild(b);
            a.appendChild(e);
            $(".winners-list").append(a);
        }
    });

    $(".close-winner-added").on("click", function (){
        $(".new-winner-addition").hide();
        $(".new-winner-addition input").val('');
    });

    $(".winnersListSaveBtn").on("click", function() {
        $(".winners-list li").each(function (i){
        let $name = $(this).find("input:radio[name='radioGroup']:checked").val();
          if($(this).attr("class") === $name+'List'){
              let individualStreak = $(this).find("#winnerStreak").find("span")
              individualStreak.html(parseInt($(individualStreak).html(), 10)+1);
          }
        });
        localStorage.setItem("winners-list",$(".winners-list").html());
        $(".winners-list-section").hide();

        $stats = localStorage.getItem("winners-list");
        $(".stats-main-box .stats-list").innerHTML="";
        $(".stats-main-box .stats-list").append($stats);
        $(".stats-main-box .stats-list").each(function (){
            $(this).find("li").find(".inputRadio").remove();
            $(this).find("ul").remove();
        });
        $(".stats-main-box").show();
    });
}

$(document).ready(function (){
    if (originalPotion === false) originalPotion = $(window).width() + $(window).height();
   commonJs();
   calculateSum();
   getMobileOperatingSystem();
   winnersList();
});

function onKeyboardOnOff(isOpen) {
    // Write down your handling code
    if (isOpen) {
        // keyboard is open
    } else {
        // keyboard is closed
    }
}

var originalPotion = false;

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "winphone";
    }

    if (/android/i.test(userAgent)) {
        return "android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
    }

    return "";
}

function applyAfterResize() {

    if (getMobileOperatingSystem() != 'ios') {
        if (originalPotion !== false) {
            var wasWithKeyboard = $('body').hasClass('view-withKeyboard');
            var nowWithKeyboard = false;

            var diff = Math.abs(originalPotion - ($(window).width() + $(window).height()));
            if (diff > 100) nowWithKeyboard = true;

            $('body').toggleClass('view-withKeyboard', nowWithKeyboard);
            if (wasWithKeyboard != nowWithKeyboard) {
                onKeyboardOnOff(nowWithKeyboard);
            }
        }
    }
}

$(document).on('focus blur', 'select, input[type=text]', function(e){
    var $obj = $(this);
    var nowWithKeyboard = (e.type == 'focusin');
    $('body').toggleClass('view-withKeyboard', nowWithKeyboard);
    onKeyboardOnOff(nowWithKeyboard);
});

$(window).on('resize orientationchange', function(){
    applyAfterResize();
});