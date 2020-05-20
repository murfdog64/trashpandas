import Game from './classes/Game';

const pandaGame = new Game('game');

document.body.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 37:
      pandaGame.handleMove('left');
      break;
    case 38:
      pandaGame.handleMove('up');
      break;
    case 39:
      pandaGame.handleMove('right');
      break;
    case 40:
      pandaGame.handleMove('down');
      break;
    default:
      break;
  }
});

const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');

document.getElementById('popup-close').onclick = function() {
  overlay.className = '';
  popup.className = '';
}

document.getElementById('rules-btn').onclick = function() {
  overlay.className = 'show';
  popup.className = 'show';
}
