(function(window) {
  'use strict';

  var padLeadingZeros = function(str) {
      return str.length < 9 ?
        '0'.repeat(9 - str.length).concat(str) :
        str;
    },
    win = function(str, winPatterns) {
      var decimal = parseInt(str, 2),
        length = winPatterns.length,
        i;

      for (i = 0; i < length; i++) {
        if ((winPatterns[i] & decimal) === winPatterns[i]) {
          return winPatterns[i];
        }
      }
      return 0;
    };

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
    var self = this;
    self.model.init(Math.floor(Math.random() * 2));
  }

  Controller.prototype.setView = function(screen) {
    var self = this,
      display = screen || 'playMode';
    self.view.render(display);
  }

  Controller.prototype.setPlayMode = function(mode) {
    var self = this;
    self.model.setPlayMode(mode, function() {
      self.view.render('symbol');
    });
  };

  Controller.prototype.setSymbol = function(symbol) {
    var self = this,
      data;
    self.model.setSymbol(symbol, function() {
      self.init();
      data = {
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
    var self = this,
      data;
    self.model.replay(function() {
      data = {
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
      winPatterns = self.model.getWinPatterns(),
      players = self.model.getPlayers(),
      availableSlots = padLeadingZeros((parseInt(players[0].moveStr, 2) |
        parseInt(players[1].moveStr, 2)).toString(2)).split('').map(
        function(slot, index) {
          if (slot === '0') {
            return index;
          }
        }
      ).filter(function(slot) {
        return slot !== undefined;
      }),
      length = availableSlots.length,
      i, tempMoveStr,
      dummyMove;

    for (i = 0; i < length; i += 1) {
      var moveStr1 = players[1].moveStr.split('');
      moveStr1[availableSlots[i]] = '1';
      if (win(moveStr1.join(''), winPatterns)) {
        return availableSlots[i];
      }
    }

    for (i = 0; i < length; i += 1) {
      var moveStr0 = players[0].moveStr.split('');
      moveStr0[availableSlots[i]] = '1';
      if (win(moveStr0.join(''), winPatterns)) {
        return availableSlots[i];
      }
    }

    for (i = 0; i < length; i += 1) {
      if (availableSlots[i] === 4) {
        return availableSlots[i];
      }
    }

    for (i = 0; i < length; i += 1) {
      if (availableSlots[i] === 0 || availableSlots[i] === 2 ||
        availableSlots[i] === 6 || availableSlots[i] === 8) {
        return availableSlots[i];
      }
    }

    dummyMove = (parseInt(players[0].moveStr, 2) |
      parseInt(players[1].moveStr, 2)).toString(2);
    return padLeadingZeros(dummyMove).indexOf('0');
  }

  Controller.prototype.move = function(cell) {
    var self = this,
      moveProcess = function(slot) {
        self.model.move(slot, function(winResult, moves) {
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
        })
      };

    if (self.model.getLock()) {
      return;
    }
    moveProcess(cell);
    if (!self.model.getPlayMode() && self.model.getTurn()) {
      self.model.setLock(1);
      setTimeout(function() {
        moveProcess(self.findSlot());;
        self.model.setLock(0);
      }, 1000);
    }
  };

  window.app = window.app || {};
  window.app.Controller = Controller;

}(window));
