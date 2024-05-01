function createCard(cardData, deleteCard, openPopupImage, likeCard) {
  const cardTemplate = document.querySelector("#card-template");
  const newCard = cardTemplate.content.querySelector(".card").cloneNode(true);
  newCard.querySelector(".card__title").textContent = cardData.name;

  const newCardImage = newCard.querySelector(".card__image");
  newCardImage.src = cardData.link;
  newCardImage.alt = cardData.name;
  newCardImage.addEventListener("click", openPopupImage);

  const likeButton = newCard.querySelector(".card__like-button");
  likeButton.addEventListener("click", () => likeCard(likeButton));

  const deleteButton = newCard.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => deleteCard(newCard));

  return newCard;
}

function deleteCard(card) {
  card.remove();
}

function likeCard(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, likeCard };
