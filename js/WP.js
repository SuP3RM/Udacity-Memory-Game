/*function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

function checkScore() {
  if (moves === 16 || moves === 24) {
    removeStar();
  }
}

function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}
hideStar();
hideStar();
*/
///////////////

function toggleModal() {
  const modal = document.querySelector(.modal__background);
  modal.classList.toggle('hide');
}
toggleModal(); //1st opens it
toggleModal(); //2nd closes it

///adding data to modal Stats
function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('#timer').innerHTML;

  timeStat.innerHTML = 'Time' = ${clockTime};
}
