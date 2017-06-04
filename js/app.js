(function($) {
  'use strict';

  function TicTacToe() {
    this.model = new app.Model();
    this.view = new app.View();
    this.controller = new app.Controller(this.model, this.view);
  }

  var ticTacToe = new TicTacToe();

  $(window).on('load', ticTacToe.controller.setView());

}(jQuery));
