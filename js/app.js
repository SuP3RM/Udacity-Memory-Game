
// Credit to Ryan Waite and his video - https://github.com/ryanwaite28/script-store/blob/master/js/stop-watch.js
//clock/timer
const StopWatch = function StopWatch() {
  const self = this;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  let timer;
  let on = false;

  self.startTimer = function(callback) {
    if(on === true) { return; }
    on = true;
    timer = setInterval(function(){
      seconds++;
      if(seconds === 60) {
        seconds = 0;
        minutes++;
        if(minutes === 60) {
          minutes = 0;
          hours++;
        }
      }
      if(callback && callback.constructor === Function) {
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
 * Create a list that holds all of your cards and variables
 */

 var cards = [
   'fa-diamond', 'fa-diamond',
   'fa-paper-plane-o', 'fa-paper-plane-o',
   'fa-anchor', 'fa-anchor',
   'fa-bolt', 'fa-bolt',
   'fa-cube', 'fa-cube',
   'fa-bomb', 'fa-bomb',
   'fa-bicycle', 'fa-bicycle',
   'fa-leaf', 'fa-leaf'
];

let watch = new StopWatch();

// https://www.diigo.com/outliner/fii42b/Udacity-Memory-Game-Project?key=dwj0y5x9cw
// https://codepen.io/lilaznbliss/pen/BVgLPe

let deck = document.querySelector(".deck");
let allCards = deck.querySelectorAll('li.card');

let moves = 0;

let restart = document.getElementById('restart-btn');
let timerText = document.getElementById('timer');

let iClick = false;

//shuffle function
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

//add moves
function addMoves() {
  moves++;
  const movesText = document.querySelector('.moves');
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
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
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
/*
// Used like so
var arr = [2, 11, 37, 42];
arr = shuffle(arr);
console.log(arr);
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Timer start
function startTimer() {
  watch.startTimer(function(){
    timerText.innerText = watch.getTimeString();
  });
}
//Timer stop
function stopTimer() {
  watch.stopTimer();
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

 let lastFlipped = null;
 let matchedCards = [];
 let pause = false;

 function activeGame() {
   allCards.forEach(function(card) {
     card.addEventListener('click', function(){
       if (iClick === false) {
         iClick = true;
         startTimer();
       }

       if (pause === true) {return}
       if (lastFlipped === card) {return}
       if (matchedCards.includes(card)) {return}

       card.classList.add('open', 'show');

       if (lastFlipped !== null) {
         let lastFlippedClass = lastFlipped.children[0].className;
         let cardClass = card.children[0].className;
         if (lastFlippedClass === cardClass) {
           // If cards macth
           console.log('macth!');
           matchedCards.push(card);
           matchedCards.push(lastFlipped);
           lastFlipped = null;
           addMoves();
           checkScore();
         }
         else {
           // If cards macth
           console.log('no macth...');
           pause = true;
           setTimeout(function(){
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
   allCards.forEach(function(card){
     card.classList.remove('open', 'show');
     matchedCards.pop(card);
   });

   iClick = false;

   //shuffle cards
   shuffleDeck();

   stopTimer();
   watch.resetTimer();
   timerText.innerText = watch.getTimeString();

 }
 restart.addEventListener('click', resetGame);

 //Start the game
 activeGame();
