function createCardDOM(
  cardTemplate,
  cardData,
  profileId,
  deleteCard,
  openPopupImage,
  changeLikeCard
) {
  const newCard = cardTemplate.content.querySelector(".card").cloneNode(true);
  newCard.querySelector(".card__title").textContent = cardData.name;

  newCard.dataset.cardId = cardData._id;
  newCard.dataset.cardOwnerId = cardData.owner._id;

  const newCardImage = newCard.querySelector(".card__image");
  newCardImage.src = cardData.link;
  newCardImage.alt = cardData.name;
  newCardImage.addEventListener("click", openPopupImage);

  const likeCounter = newCard.querySelector(".card__like-counter");
  likeCounter.textContent = cardData.likes.length;

  const likeButton = newCard.querySelector(".card__like-button");
  if (cardData.likes.some((like) => like._id === profileId)) {
    toggleCardLikeState(likeButton);
  }
  likeButton.addEventListener("click", () => {
    changeLikeCard(newCard.dataset.cardId, likeButton, likeCounter);
  });

  const deleteButton = newCard.querySelector(".card__delete-button");
  if (profileId === cardData.owner._id) {
    deleteButton.addEventListener("click", () => {
      deleteCard(newCard);
    });
  } else {
    deleteButton.remove();
  }

  return newCard;
}

function deleteCardDOM(card) {
  card.remove();
}

function toggleCardLikeState(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

export { createCardDOM, deleteCardDOM, toggleCardLikeState };
