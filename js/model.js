(function(window) {
  'use strict';

  var winPatterns = [
        448, 56, 7, 292,  // 111000000, 000111000, 000000111, 100100100,
        146, 73, 273, 84  // 010010010, 001001001, 100010001, 001010100
      ],
      players = [
        { moveStr: '000000000', symbol: '', score: 0 },
        { moveStr: '000000000', symbol: '', score: 0 }
      ],
      turn = 0,
      multiPlay = 0,
      firstTurn = 0,
      lock = 0,
      win = function(str) {
        var decimal = parseInt(str, 2),
          length = winPatterns.length,
          i;

        for (i = 0; i < length; i++) {
          if ((winPatterns[i] & decimal) === winPatterns[i]) {
            return winPatterns[i];
          }
        }
        return 0;
      }

  function Model() {

  }

  Model.prototype.getPlayers = function() {
    return players;
  }

  Model.prototype.getLock = function() {
    return lock;
  }

  Model.prototype.setLock = function(value) {
    lock = value;
  }

  Model.prototype.getTurn = function() {
    return turn;
  }

  Model.prototype.getFirstTurn = function() {
    return firstTurn;
  }

  Model.prototype.getPlayMode = function() {
    return multiPlay;
  }

  Model.prototype.init = function(value) {
    firstTurn = value;
    turn = value;
  }

  Model.prototype.resetAll = function(callback) {
    players.forEach(function(obj) {
      obj.moveStr = '000000000';
      obj.symbol = '';
      obj.score = 0;
    });
    turn = 0;
    multiPlay = 0;
    firstTurn = 0;
    lock = 0;
    callback();
  }

  Model.prototype.replay = function(callback) {
    players.forEach(function(obj) {
      obj.moveStr = '000000000';
    });
    turn = firstTurn;
    callback();
  }

  Model.prototype.setSymbol = function(symbol, callback) {
    var self = this;
    players[0].symbol = symbol;
    players[1].symbol = symbol === 'O' ? 'X' : 'O';
    callback();
  }

  Model.prototype.setPlayMode = function(mode, callback) {
    multiPlay = mode;
    callback();
  }

  Model.prototype.move = function(cell, callback) {
    var player = players[turn],
        moveStr = player.moveStr,
        tempMoveStr,
        tempMove0, tempMove1, i,
        winResult,
        moves;

    tempMoveStr = moveStr.split('');
    tempMoveStr[cell] = '1';
    player.moveStr = tempMoveStr.join('');
    winResult = win(player.moveStr);
    if(winResult) {
      player.score++;
    }
    else {
      turn = turn === 0 ? 1 : 0;
    }
    tempMove0 = players[0].moveStr.split('');
    tempMove1 = players[1].moveStr.split('');
    moves = '';
    for(i = 0; i < 9; i++) {
      if(parseInt(tempMove0[i]) || parseInt(tempMove1[i])) {
        moves += tempMove0[i] === '0' ? players[1].symbol : players[0].symbol;
      }
      else {
        moves += ' ';
      }
    }
    callback(winResult, moves);
  }

  window.app = window.app || {};
  window.app.Model = Model;

}(window));
