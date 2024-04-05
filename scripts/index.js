const cardTempate = document.querySelector("#card-template");
const placesList = document.querySelector(".places__list");

function createCard(cardName, cardLink, deleteCard) {
  const newCard = cardTempate.content.querySelector(".card").cloneNode(true);
  newCard.querySelector(".card__image").src = cardLink;
  newCard.querySelector(".card__image").alt = cardName;
  newCard.querySelector(".card__title").textContent = cardName;

  const deleteButton = newCard.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => deleteCard(newCard));

  return newCard;
}

function deleteCard(card) {
  card.remove();
}

initialCards.forEach((initialCard) => {
  const newCard = createCard(initialCard.name, initialCard.link, deleteCard);
  placesList.append(newCard);
});
