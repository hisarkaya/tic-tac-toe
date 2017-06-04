(function(window) {
  'use strict';

  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind('setPlayMode', function(mode) {
      self.setPlayMode(mode);
    });

    self.view.bind('setSymbol', function(symbol) {
      self.setSymbol(symbol);
    });

    self.view.bind('back', function() {
      self.back();
    });

    self.view.bind('move', function(cell) {
      self.move(cell);
    });

    self.view.bind('resetAll', function() {
      self.resetAll();
    });

    self.view.bind('replay', function() {
      self.replay();
    });

  }

  Controller.prototype.init = function() {
    var self = this,
      rnd = Math.floor(Math.random() * 2);
    self.model.init(rnd);
  }

  Controller.prototype.setView = function(screen) {
    var self = this;
    var display = screen || 'playMode';
    self.view.render(display);
  }

  Controller.prototype.setPlayMode = function(mode) {
    var self = this;
    self.model.setPlayMode(mode, function() {
      self.view.render('symbol');
    });
  };

  Controller.prototype.setSymbol = function(symbol) {
    var self = this;
    self.model.setSymbol(symbol, function() {
      self.init();
      var data = {
        players: self.model.getPlayers(),
        turn: self.model.getTurn(),
        multiPlay: self.model.getPlayMode()
      };
      self.view.render('board', data);
      if (!data.multiPlay && data.turn) {
        self.move(4);
      }
    });
  };

  Controller.prototype.back = function() {
    var self = this;
    self.view.render('playMode');
  };

  Controller.prototype.resetAll = function() {
    var self = this;
    self.model.resetAll(function() {
      self.view.render('playMode');
    });
  };

  Controller.prototype.replay = function() {
    var self = this;
    self.model.replay(function() {
      var data = {
        players: self.model.getPlayers(),
        turn: self.model.getFirstTurn(),
        multiPlay: self.model.getPlayMode()
      };
      self.view.render('board', data);
      if (!data.multiPlay && data.turn) {
        self.move(4);
      }
    });
  };

  Controller.prototype.findSlot = function() {
    var self = this,
      str = (parseInt(self.model.getPlayers()[0].moveStr, 2) | parseInt(self.model.getPlayers()[1].moveStr, 2)).toString(2);
    str = str.length < 9 ?
      '0'.repeat(9 - str.length).concat(str) :
      str;
    return str.indexOf('0');
  }

  Controller.prototype.move = function(cell) {
    var self = this,
      computerMoveCell;

    if(self.model.getLock()) {
      return;
    }

    self.model.move(cell, function(winResult, moves) {
      self.view.render('turnInfo', {
        turn: self.model.getTurn()
      });
      self.view.render('gameBoard', {
        winResult,
        moves
      });
      if (winResult || moves.indexOf(' ') === -1) {
        self.view.render('scores', {
          score1: self.model.getPlayers()[0].score,
          score2: self.model.getPlayers()[1].score
        });
        self.view.render('result', {
          turn: self.model.getTurn(),
          multiPlay: self.model.getPlayMode(),
          draw: moves.indexOf(' ') < 0 && !!!winResult
        });
      }
    });

    if (!self.model.getPlayMode() && self.model.getTurn()) {
      self.model.setLock(1);
      setTimeout(function() {
        computerMoveCell = self.findSlot();
        self.model.move(computerMoveCell, function(winResult, moves) {
          self.view.render('turnInfo', {
            turn: self.model.getTurn()
          });
          self.view.render('gameBoard', {
            winResult,
            moves
          });
          if (winResult || moves.indexOf(' ') === -1) {
            self.view.render('scores', {
              score1: self.model.getPlayers()[0].score,
              score2: self.model.getPlayers()[1].score
            });
            self.view.render('result', {
              turn: self.model.getTurn(),
              multiPlay: self.model.getPlayMode(),
              draw: moves.indexOf(' ') < 0  && !!!winResult
            });
          }
        });
        self.model.setLock(0);
      }, 1000);
    }
  };

  window.app = window.app || {};
  window.app.Controller = Controller;

}(window));
