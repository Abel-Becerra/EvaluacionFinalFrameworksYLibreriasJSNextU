var game = {
  gameTimer: new Timer('1 seconds'),

  uiMovingY:null,

  uiSpaceingBetweenAxisX:null,

  uiMovingSign:'',

  init:function(){
    game.changeColor()
    game.gameDuration()
    $(".btn-reinicio").click(function(){
      if ($(".btn-reinicio").text() == "Reiniciar"){
        $(".btn-reinicio").text("Iniciar")
        $("#timer").html("02:00")

        if ($(".panel-score > h2:first-child").text("Juego Terminado").length > 0){
          $(".panel-tablero").animate({
            opacity: 1,
            width: "toggle",
            height: "toggle"},
          2000).show()

          $(".panel-score").animate({
            width: "25%"},
          2000)

          $(".time").animate({
            opacity: 1,
            width: "toggle",
            height: "toggle"},
          2000)

          $(".panel-score > h2:first-child").remove()
        }

        $("[class^='col-']").html("")

        game.gameTimer.reset()
      } else {
        $(".btn-reinicio").text("Reiniciar")
        game.fillBoard()
      }
    })
  },

  changeColor:function(){
    var tmrChangeColorForH1 = new Timer('500 miliseconds')

    tmrChangeColorForH1.every('500 miliseconds', function () {
      if ($("h1.main-titulo").hasClass("change-color-main-titulo"))
        $("h1.main-titulo").removeClass("change-color-main-titulo");
      else
        $("h1.main-titulo").addClass("change-color-main-titulo");
    })

    tmrChangeColorForH1.start();
  },

  gameDuration:function(){
    game.gameTimer.every('1 seconds', function () {
      $("#timer").html(game.countDown())
    })

    game.gameTimer.after('2 minutes', function () {
      $(".panel-tablero").animate({
        opacity: 0.25,
        width: "toggle",
        height: "toggle"},
      2000)

      $(".time").animate({
        opacity: 0.25,
        width: "toggle",
        height: "toggle"},
      2000)

      $(".panel-score").animate({
        width: "100%"},
      2000, function(){
        $(".panel-score").prepend("<h2 class='data-titulo'>Juego Terminado</h2>").css("text-align","center")
      })

      $("#timer").html("02:00")
      $("[class^='col-']").html("")

      game.gameTimer.reset()
    })
  },

  countDown:function(){
    var time = $("#timer").html()
    time = time.split(':')
    if (time[1] == "00"){
      time[0] = parseInt(time[0]) - 1
    }
    time[1] = time[1] == "00" ? "59" : parseInt(time[1]) - 1
    $("#timer").html(('0' + time[0]).substr(-2, 2) + ':' + ('0' + time[1]).substr(-2, 2))
  },

  guid:function(){
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + '-' + s4() + '-' + s4() + '-' + s4();
  },

  getImageRandom:function(){
    return '<img class="elemento" id="' + game.guid() + '" src="image/' + (Math.floor(Math.random() * 4) + 1) + '.png">'
  },

  fillBoard:function(){
    var timex = new Timer("10 miliseconds")
    $("div[class^='col']").css("justify-content", "flex-start")

    timex.every('10 miliseconds', function () {
      $(".col-1").prepend(game.getImageRandom())
      $(".col-2").prepend(game.getImageRandom())
      $(".col-3").prepend(game.getImageRandom())
      $(".col-4").prepend(game.getImageRandom())
      $(".col-5").prepend(game.getImageRandom())
      $(".col-6").prepend(game.getImageRandom())
      $(".col-7").prepend(game.getImageRandom())
    })

    timex.after('70 miliseconds', function () {
      timex.reset()
      game.gameTimer.start()
      $("div[class^='col']").css("justify-content", "flex-end")
      game.configDragAndDrop()

      game.uiSpaceingBetweenAxisX = $(".col-1").find("img:nth-child(1)")[0].x - $(".col-2").find("img:nth-child(1)")[0].x

    })

    timex.start()
  },

  reviewMatches:function(){
    var cols = $("div[class^='col']")
    for (var i = 0; i< cols.length; i++){
      var col = cols[i]
      if((7 - $(col).children().length) > 0){
        game.refill($(col))
      }
    }
  },

  refill: function(obj){
    var timex = new Timer("10 miliseconds")
    $("div[class^='col']").css("justify-content", "flex-start")

    timex.every('10 miliseconds', function () {
      $(obj).prepend(game.getImageRandom())
    })

    timex.after((7 - $(obj).children().length) + '0 miliseconds', function () {
      timex.reset()
      $("div[class^='col']").css("justify-content", "flex-end")
      game.configDragAndDrop()
    })

    timex.start()
  },

  configDragAndDrop:function(){
    $(".elemento").draggable({
      containment:".panel-tablero",
      revert:true,
      revertDuration:0,
      snap:".elemento",
      snapMode:"inner",
      snapTolerance:40,
      start:function(event, ui){
        game.uiMovingY = ui.helper[0].y
        game.uiMovingX = ui.helper[0].x
        game.uiMovingSign = $(ui.helper[0])[0].outerHTML
      }
    });

    $(".elemento").droppable({
      drop:function (event, ui){
      	/*var moved = ui.draggable[0]
      	var current = this*/
        var signed = this.outerHTML
        if ($(ui.draggable[0]).parent().attr("class") == $(this).parent().attr("class")){
          /*if (game.uiMoving > $(this)[0].y){
            $(this).insertBefore(moved)
            $(ui.draggable[0]).insertBefore(current)
          } else {
            $(this).insertAfter(moved)
            $(ui.draggable[0]).insertAfter(current)
          }*/
            $(ui.draggable[0]).replaceWith(signed)
            $(this).replaceWith(game.uiMovingSign)
        } else {
          $(ui.draggable[0]).replaceWith(signed)
          $(this).replaceWith(game.uiMovingSign)
        }
        game.configDragAndDrop()
      }
    });
  },

  removeElements:function(){
    var cols = $("div[class^='col']")
    for (var v in cols) {
      if (cols[v].className) {
        game.removeElementsInY(cols[v].className)
      } else {
        break
      }
    }
  },

  removeElementsInY: function(className){
    var lineaY = $(className).find("img")
    var matched = $.map(lineaY, function(o, i) {
      if (o.localName == "img") {
        if ($(o).attr("src") == $(o).next().attr("src")) {
          return { origin: o.id, sibling: $(o).next().attr("id") }
        }
      }
    })
    for(var t in matched) {
      $("#" + matched[t].origin).remove()
      $("#" + matched[t].sibling).remove()
    }
  },

  removeElementsInX:function(index){
    var match = []
    if ($(".col-1").find("img:nth-child(" + index + ")").attr("src") == $(".col-2").find("img:nth-child(" + index + ")").attr("src")) {
      $(".col-1").find("img:nth-child(" + index + ")").remove()
    }
    if ($(".col-2").find("img:nth-child(" + index + ")").attr("src") == $(".col-3").find("img:nth-child(" + index + ")").attr("src")) {
      match.push($(".col-1").find("img:nth-child(" + index + ")").attr("id"))
    }
  }
}

$(document).ready(game.init())
