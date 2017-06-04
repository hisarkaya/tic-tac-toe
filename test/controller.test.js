describe('controller', function() {

  var subject, model, view;

  var setUpModel = function(obj) {

    model.setPlayMode.and.callFake(function (mode, callback) {
    			callback();
    		});

    model.setSymbol.and.callFake(function (symbol, callback) {
    			callback();
    		});
    model.move.and.callFake(function (cell, callback) {
    			callback(obj.winResult, obj.moves);
    		});
    model.getPlayers.and.callFake(function () {
    			return obj.players;
    		});
    model.getTurn.and.callFake(function () {
    			return obj.turn;
    		});
    model.getPlayMode.and.callFake(function () {
    			return obj.multiPlay;
    		});

    model.init.and.callFake(function(num) {

    });

    model.resetAll.and.callFake(function (callback) {
    			callback();
    		});
  }

  var createStubView = function() {
    var eventRegistry = {};
    return {
      render: jasmine.createSpy('render'),
      bind: function(event, handler) {
        eventRegistry[event] = handler;
      },
      trigger: function(event, parameter) {
        eventRegistry[event](parameter);
      }
    };
  };

  beforeEach(function() {
    model = jasmine.createSpyObj('model', ['setPlayMode', 'setSymbol', 'move', 'getPlayers',
                                            'getTurn', 'getPlayMode', 'init', 'resetAll', 'getLock']);
    view = createStubView();
    subject = new app.Controller(model, view);

  });

  it('should start with play mode selection screen', function() {
    setUpModel();
    subject.setView();
    expect(view.render).toHaveBeenCalledWith('playMode');
  });


  describe('playMode', function() {

    it('should set the value of play mode in model', function() {

      setUpModel({playMode: 0});
      view.trigger('setPlayMode', 1);

      expect(model.setPlayMode).toHaveBeenCalledWith(1, jasmine.any(Function));

    });

    it('should display the symbol selection screen', function() {
      setUpModel({playMode: 0});
      view.trigger('setPlayMode', 1);
      expect(view.render).toHaveBeenCalledWith('symbol');
    });

  });

  describe('symbol', function() {

    it('should set the value of player 1\'s symbol in model', function() {

      var data = {
        players: [
          { moveStr: '000000000', symbol: '', score: 0, id: 1 },
          { moveStr: '000000000', symbol: '', score: 0, id: 2 }
        ]
      };

      setUpModel(data);
      view.trigger('setSymbol', 'X');
      expect(model.setSymbol).toHaveBeenCalledWith('X', jasmine.any(Function));
    });

    it('should display the board screen', function() {

      var data = {
        players: [
          { moveStr: '000000000', symbol: 'X', score: 0, id: 1 },
          { moveStr: '000000000', symbol: 'O', score: 0, id: 2 }
        ],
        turn: 0,
        multiPlay: 1
      };

      setUpModel(data);
      view.trigger('setSymbol', 'X');
      expect(view.render).toHaveBeenCalledWith('board', data);
    });



    it('should display the play mode screen if \'back\' button is clicked', function() {
      view.trigger('back');
      expect(view.render).toHaveBeenCalledWith('playMode');
    });

    it('should set the turn randomly in model', function() {
      var data = {
        turn: 0
      };
      setUpModel(data);
      view.trigger('setSymbol', 'X');
      expect(model.init).toHaveBeenCalledWith(jasmine.any(Number));
    });

  });

  describe('reset all', function() {
    it('should set the screen as play mode selection', function() {
      setUpModel({});
      view.trigger('resetAll');
      expect(view.render).toHaveBeenCalledWith('playMode');
    });

    it('should reset the model', function() {
      var data = {
        players: [
          { moveStr: '100100100', symbol: 'X', score: 2, id: 1 },
          { moveStr: '000010001', symbol: 'O', score: 1, id: 2 }
        ],
        turn: 1,
        multiPlay: 1
      };
      setUpModel(data);
      view.trigger('resetAll');
      expect(model.resetAll).toHaveBeenCalled();
    });
  });


  describe('move', function() {
    it('should update the move string of current player in model ', function() {
      var data = {
        winResult: 0,
        moves: 'X XOOX XO'
      };
      setUpModel(data);
      view.trigger('move',2);
      expect(model.move).toHaveBeenCalledWith(2, jasmine.any(Function));
    });
  });


});
