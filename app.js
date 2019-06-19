/*
GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

var scores, roundScore, maxScore, previousRoll;
var activePlayer, gameState;

// create new game
function init() {
  // randomly choose the active player
  activePlayer = Math.floor(Math.random() * 2);
  gameState = true;
  maxScore = Number($('#max-score').value);
  resetScore();
  resetUI();
  $('#max-score').disabled = true;
}

function resetScore() {
  scores = [0, 0];
  roundScore = 0;
  // endScore = Number(prompt('Enter the winning score:'));
  previousRoll = [0, 0];
}

function resetUI() {
  // reset global scores
  $('#score-0').textContent = '0';
  $('#score-1').textContent = '0';

  // reset round scores
  $('#current-0').textContent = '0';
  $('#current-1').textContent = '0';

  // reset names
  $('#name-0').textContent = 'PLAYER 1';
  $('#name-1').textContent = 'PLAYER 2';

  // reset active player
  $('.player-0-panel').classList.remove('active');
  $('.player-1-panel').classList.remove('active');
  $('.player-' + activePlayer + '-panel').classList.add('active');
  hideDices();

  // re-activate buttons
  $('.btn-roll').disabled = false;
  $('.btn-hold').disabled = false;
}

function rollDice() {
  if (gameState) {
    var dices = [0, 0];
    dices[0] = Math.floor(Math.random() * 6) + 1;
    dices[1] = Math.floor(Math.random() * 6) + 1;
    if (dices[0] === 1 && dices[1] === 1) {
      switchPlayer();
    }
    else if (dices.includes(6) && previousRoll.includes(6)) {
      scores[activePlayer] = 0;
      $('#score-' + activePlayer).textContent = scores[activePlayer];
      switchPlayer();
    }
    else {
      if (isDicesHidden()) {
        showDices();
      }
      // set dices images
      $('#dice-1').src = 'dice-' + (dices[0]) + '.png';
      $('#dice-2').src = 'dice-' + (dices[1]) + '.png';

      roundScore += dices.reduce((a, b) => a + b, 0);
      $('#current-' + activePlayer).textContent = roundScore;
      previousRoll = dices;
    }
  }
}

function hold() {
  if (gameState) {
    scores[activePlayer] += roundScore;
    $('#score-' + activePlayer).textContent = scores[activePlayer];
    // check if there is a winner
    if (scores[activePlayer] >= maxScore) {
      $('.player-' + activePlayer + '-panel').classList.remove('active');
      $('#name-' + activePlayer).textContent = 'Winner!';
      hideDices();
      gameState = false;

      // disable buttons 
      $('.btn-roll').disabled = true;
      $('.btn-hold').disabled = true;

      // Enable the MaxScore Specifier
      $('#max-score').disabled = false;
    }
    else {
      switchPlayer();
    }
  }
}

function switchPlayer() {
  roundScore = 0;
  previousRoll = [0, 0];
  $('#current-' + activePlayer).textContent = roundScore;
  $('.player-' + activePlayer + '-panel').classList.remove('active');
  activePlayer = (activePlayer + 1) % 2; // toggle active player
  $('.player-' + activePlayer + '-panel').classList.add('active');
  hideDices();
}

//Event Listeners
$('.btn-roll').addEventListener('click', rollDice);
$('.btn-hold').addEventListener('click', hold);
$('.btn-new').addEventListener('click', init);

// Helper Methods 
function $(selector) {
  return document.querySelector(selector);
}

function hideDices() {
  document.querySelectorAll('.dice').forEach(function (e) {
    e.style.display = 'none';
  });
}

function showDices() {
  document.querySelectorAll('.dice').forEach(function (e) {
    e.style.display = 'block';
  });
}

function isDicesHidden() {
  var hidden = true;
  document.querySelectorAll('.dice').forEach(function (e) {
    hidden = hidden && (e.style.display === 'none');
  });

  return hidden;
}