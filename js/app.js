// Credit and references used as a helpful walkthroughs: https://www.diigo.com/outliner/fii42b/Udacity-Memory-Game-Project?key=dwj0y5x9cw
// Credit to Ryan Waite and his video - https://github.com/ryanwaite28/script-store/blob/master/js/stop-watch.js
//clock/timer
let StopWatch = function StopWatch() {
  const self = this;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  let timer;
  let on = false;

  self.startTimer = function(callback) {
    if (on === true) {
      return;
    }
    on = true;
    timer = setInterval(function() {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
      }
      if (callback && callback.constructor === Function) {
        callback();
      }
    }, 1000);
    console.log('timer started');
  }

  self.stopTimer = function() {
    clearInterval(timer);
    on = false;
    console.log('timer ended: ', self.getTimeString());
  }

  self.resetTimer = function() {
    self.stopTimer();
    hours = 0;
    minutes = 0;
    seconds = 0;
  }

  self.getTimeString = function() {
    let hour = hours > 9 ? String(hours) : '0' + String(hours);
    let minute = minutes > 9 ? String(minutes) : '0' + String(minutes);
    let second = seconds > 9 ? String(seconds) : '0' + String(seconds);
    let timeString = hour + ':' + minute + ':' + second;
    return timeString;
  }

  self.getHours = function() {
    return hours;
  }

  self.getMinutes = function() {
    return minutes;
  }

  self.getSeconds = function() {
    return seconds;
  }
}

/*
 * Create a list of all of your variables
 */

let watch = new StopWatch();
let deck = document.querySelector(".deck");
let allCards = deck.querySelectorAll('li.card');
let timerText = document.querySelector('.timer');
let restart = document.getElementById('restart-btn');
let inClick = false;
let moves = 0;
let lastFlipped = null;
let matchedCards = [];
let matched = 0;
const totalPairs = 8;
let pause = false;

//shuffle function
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

//add moves function
function addMoves() {
  moves++;
  let movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

// restart moves function
function rstMoves() {
  moves = 0;
  let movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

// getting stars
function checkScore() {
  if (moves === 16 || moves === 24) {
    hideStar();
  }
}

//Removing stars/hiding
function hideStar() {
  let starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

// undo hiding stars after restarting game
function undoHideStar() {
  let starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display === 'none') {
      star.style.display = 'initial';
    }
  }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Timer start
// watch.startTimer();

// Timer stop
// watch.stopTimer();


// Display time on screen
function displayOnScreen() {
  watch.startTimer(function() {
    timerText.innerHTML = watch.getTimeString();
  });
}

// displys time in modal
function displayTime() {
  time = watch.getTimeString();
  return time;
}

// toggle modals when called
function toggleModal() {
  let modal = document.querySelector('.modal__background');
  modal.classList.toggle('hide');
}

// Get stars for Modal function
function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }
  }
  console.log(starCount);
  return starCount;
}

// Generating game stats (Modal)
function writeModalStats() {
  let timeStat = document.querySelector('.modal_time');
  let clockTime = displayTime();
  let movesStat = document.querySelector('.modal_moves');
  let starsStat = document.querySelector('.modal_stars');
  const stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  starsStat.innerHTML = `Stars = ${stars}`;
  movesStat.innerHTML = `Moves = ${moves}`;
}

// cancel button
document.querySelector('.modal_exit').addEventListener('click', toggleModal);
// replay button
document.querySelector('.modal_replay').addEventListener('click', resetGame);

// End game function
function endGame() {
  watch.stopTimer();
  writeModalStats();
  toggleModal();
  console.log('End Game');
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function activeGame() {
  allCards.forEach(function(card) {
    card.addEventListener('click', function() {
      if (inClick === false) {
        inClick = true;
        displayOnScreen();
        watch.startTimer();
        displayTime();
      }

      if (pause === true) {
        return;
      }
      if (lastFlipped === card) {
        return;
      }
      if (matchedCards.includes(card)) {
        return;
      }

      card.classList.add('open', 'show');

      if (lastFlipped !== null) {
        let lastFlippedClass = lastFlipped.children[0].className;
        let cardClass = card.children[0].className;
        if (lastFlippedClass === cardClass) {

          // If cards macth
          console.log('macth!');
          matchedCards.push(card);
          matchedCards.push(lastFlipped);
          lastFlipped.classList.add('match');
          card.classList.add('match');
          lastFlipped = null;
          addMoves();
          checkScore();
          matched++;
          if (matched === totalPairs) {
            endGame();
          }
        } else {

          // If cards macth
          console.log('no macth...');
          pause = true;
          setTimeout(function() {
            card.classList.remove('open', 'show');
            lastFlipped.classList.remove('open', 'show');
            lastFlipped = null;
            addMoves();
            checkScore();
            pause = false;
          }, 500);
        }
      } else {
        lastFlipped = card;
      }
    });
  });
}

function resetGame() {
  allCards.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
    matchedCards.pop(card);
  });
  inClick = false;
  shuffleDeck();
  rstMoves();
  undoHideStar();
  watch.stopTimer();
  watch.resetTimer();
  timerText.innerHTML = watch.getTimeString();
}
restart.addEventListener('click', resetGame);

//Start the game
activeGame();
