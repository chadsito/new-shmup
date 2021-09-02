         "use strict";
      //////////////////
    ////// SETUP ////// 
  ////////////////////

// Una vez que se cargaron todos los .js, recien ahi declarar objetos y arrancar engine
window.onload = function(){

  // Game screen initial dimensions
  const initW = 160;
  const initH = 120;

  // Update function
  const update = function() {
    game.update();
  };

  // Render function
  const render = function() {
      display.render(game.objects, game.bg);
  };

  // Create Engine passing: minimum step in ms, FPS, updateFunction, renderFunction
  const engine  = new Engine(1000/60, 60, update, render);
  // Create Input object
  const input   = new Input();
  // Create Game passing: initW, initH, rawInput Map
  const game    = new Game(initW, initH, input.rawInput);
  // Create Display passing: canvasID, initW, initH, integralScaling
  const display = new Display('layer1', initW, initH, true);

  // Go!
  engine.start();
};