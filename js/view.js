(function(window, $) {
  'use strict';

  function View() {
    this.$playModelBox = $('.play-mode-box');
    this.$symbolBox = $('.symbol-box');
    this.$symbolBoxP = $('.symbol-box > p');
    this.$boardBox = $('.board-box');
    this.$onePlayer = $('.one-player');
    this.$twoPlayer = $('.two-player');
    this.$backButton = $('.back-button');
    this.$chooseX = $('.choose-x');
    this.$chooseO = $('.choose-o');
    this.$drawMessage = $('.draw-message');
    this.$loseMessage = $('.lose-message');
    this.$winMessage = $('.win-message');
    this.$gameBoard = $('.game-board');
    this.$cells = $('.game-board td');
    this.$header = $('.header');
    this.$footer = $('.footer');
    this.$resetAll = $('.reset-all');
    this.$replay = $('.replay');
    this.$playerOneTurn = $('.player-one-turn');
    this.$playerTwoTurn = $('.player-two-turn');
  }

  View.prototype.render = function(screen, data) {
    var self = this,
        winResult, moves, winResultBinary;

    switch(screen) {
    case 'playMode':
      self.$playModelBox.show();
      self.$symbolBox.hide();
      self.$boardBox.hide();
      self.$footer.hide();
      self.$header.hide();
      break;
    case 'symbol':
      self.$playModelBox.hide();
      self.$symbolBox.fadeIn(600);
      self.$boardBox.hide();
      self.$footer.hide();
      self.$header.hide();
      break;
    case 'board':
      self.$playModelBox.hide();
      self.$symbolBox.hide();
      self.$boardBox.fadeIn(600);
      self.$loseMessage.hide();
      self.$winMessage.hide();
      self.$drawMessage.hide();
      self.$footer.show();
      self.$header.show();
      self.$header.find('.score-1').find('.points').text(data.players[0].score)
                  .end()
                  .find('.name').text((data.multiPlay ? 'player 1' : 'you') + '(' + data.players[0].symbol + '):' );

      self.$header.find('.score-2').find('.points').text(data.players[1].score)
                  .end()
                  .find('.name').text((data.multiPlay ? 'player 2' : 'computer')  + '(' + data.players[1].symbol + '):' );

      self.$playerOneTurn.hide();
      self.$playerTwoTurn.hide();
      if(!data.turn) {
        self.$playerOneTurn.show();
      }
      else {
        self.$playerTwoTurn.show();
      }
      self.$cells.each(function() {
        $(this).text('');
        $(this).removeClass('win-cell');
      });
      break;
    case 'gameBoard':
      winResult = data.winResult;
      winResultBinary = winResult.toString(2).length < 9 ?
                    '0'.repeat(9 - winResult.toString(2).length).concat(winResult.toString(2))
                    : winResult.toString(2);
      moves = data.moves;

      self.$cells.each(function() {
        $(this).text(String(moves[this.id]).trim());
        if(winResult > 0) {
          if(winResultBinary[this.id] === '1') {
            $(this).addClass('win-cell');
          }
          if(!$(this).text()) {
            $(this).text(' ');
          }
        }
      });
      break;

    case 'turnInfo':
      self.$playerOneTurn.hide();
      self.$playerTwoTurn.hide();
      if(!data.turn) {
        self.$playerOneTurn.show();
      }
      else {
        self.$playerTwoTurn.show();
      }
      break;
    case 'scores':
      self.$header.find('.score-1').find('.points').text(data.score1);
      self.$header.find('.score-2').find('.points').text(data.score2);
      break;
    case 'result':
      if(data.draw) {
        self.$drawMessage.show();
      }
      else {
        if(!data.turn) {
          if(!data.multiPlay) {
            self.$winMessage.find('p').text('you won!!! :)').end().show();
          }
          else {
            self.$winMessage.find('p').text('player 1 won!').end().show();
          }
        }
        else {
          if(!data.multiPlay) {
            self.$loseMessage.find('p').end().show();
          }
          else {
            self.$winMessage.find('p').text('player 2 won!').end().show();
          }
        }
      }
      break;
    }
  }

  View.prototype.bind = function(event, handler) {

    var self = this;

    switch (event) {
    case 'setPlayMode':
      self.$onePlayer.on('click', function() {
        self.$symbolBoxP.text('would you like to be X or O?');
        handler(0);
      });
      self.$twoPlayer.on('click', function() {
        self.$symbolBoxP.text('player 1 : would you like X or O?');
        handler(1);
      });
      break;
    case 'back':
      self.$backButton.on('click', function() {
        handler();
      });
      break;
    case 'resetAll':
        self.$resetAll.on('click', function() {
          handler();
        });
        break;
    case 'setSymbol':
      self.$chooseX.on('click', function() {
        handler('X');
      });
      self.$chooseO.on('click', function() {
        handler('O');
      });
      break;
    case 'move':
      self.$gameBoard.on('click', 'td', function() {
        if(!$(this).html()) {
            handler(this.id);
        }
      });
      break;
    case 'replay':
        self.$replay.on('click', function() {
          handler();
        });
        break;
    }
  }

  window.app = window.app || {};
  window.app.View = View;

}(window, jQuery));
