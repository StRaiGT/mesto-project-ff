import "/src/pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, deleteCard, likeCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";

const popups = document.querySelectorAll(".popup");
const placesList = document.querySelector(".places__list");

const profileEditButton = document.querySelector(".profile__edit-button");
const popupEditProfile = document.querySelector(".popup_type_edit");
const profileTitleInput = popupEditProfile.querySelector(".popup__input_type_name");
const profileDescriptionInput = popupEditProfile.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const cardAddButton = document.querySelector(".profile__add-button");
const popupAddCard = document.querySelector(".popup_type_new-card");
const cardNameInput = popupAddCard.querySelector(".popup__input_type_card-name");
const cardLinkInput = popupAddCard.querySelector(".popup__input_type_url");

const popupImage = document.querySelector(".popup_type_image");
const popupCardImage = document.querySelector(".popup__image");
const popupCardCaption = document.querySelector(".popup__caption");

popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (
      evt.target.classList.contains("popup_is-opened") ||
      evt.target.classList.contains("popup__close")
    ) {
      closePopup(popup);
    }
  });
});

function openPopupImage(evt) {
  popupCardImage.src = evt.target.src;
  popupCardImage.alt = evt.target.alt;
  popupCardCaption.textContent = evt.target.alt;
  openPopup(popupImage);
}

initialCards.forEach((initialCard) => {
  const newCard = createCard(initialCard, deleteCard, openPopupImage, likeCard);
  placesList.append(newCard);
});

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(popupEditProfile);
});

popupEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(popupEditProfile);
});

cardAddButton.addEventListener("click", () => {
  openPopup(popupAddCard);
});

popupAddCard.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const newCard = createCard(newCardData, deleteCard, openPopupImage, likeCard);
  placesList.prepend(newCard);
  closePopup(popupAddCard);
  cardNameInput.value = "";
  cardLinkInput.value = "";
});
