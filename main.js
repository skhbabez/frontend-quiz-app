"use strict";
const url = "data.json";

class Quiz {
  constructor(quizzes) {
    this.quizzes = quizzes;
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.categories = this.extractCategories(this.quizzes);
    this.logo = document.getElementById("logo");
    this.infoContainer = document.getElementById("info-container");
    this.contentContainer = document.getElementById("content-container");
    this.hideLogo();
    this.start();
  }

  start() {
    this.showCategorySelection();
    this.showWelcomeCard();
  }

  runQuiz(category) {
    this.questions = this.getQuestions(category);
    this.category = category;
    console.log(this.questions);
    this.setLogoCategory(category);
    this.showLogo();
    this.emptyInfoContainer();
    this.emptyContentContainer();
  }

  hideLogo() {
    this.logo.classList.add("hidden");
  }

  showLogo() {
    this.logo.classList.remove("hidden");
  }

  setLogoCategory(category) {
    const { name, url } = category;
    this.logo.innerHTML = "";
    const label = this.createLabel(name, url);
    this.logo.innerHTML = "";
    this.logo.appendChild(label);
    const text = document.createElement("span");
    text.textContent = name;
    this.logo.appendChild(text);
  }

  createLabel(color, url) {
    const label = document.createElement("span");
    label.classList.add("icon", `icon-${color}`);
    const img = document.createElement("img");
    img.setAttribute("src", url);
    img.setAttribute("alt", "");
    label.appendChild(img);
    return label;
  }

  showCategorySelection() {
    const categorySelection = document.createElement("div");
    categorySelection.classList.add("btn-container", "categories");

    const createSelector = (category) => {
      const { name, url } = category;
      const label = this.createLabel(name, url);
      const button = document.createElement("button");
      button.classList.add("icon-btn");
      button.setAttribute("type", "button");
      const buttonText = document.createElement("span");
      buttonText.appendChild(document.createTextNode(name));
      button.appendChild(label);
      button.appendChild(buttonText);
      button.addEventListener("click", () => this.runQuiz(category));
      return button;
    };
    this.categories.forEach((category) => {
      categorySelection.appendChild(createSelector(category));
    });
    this.contentContainer.appendChild(categorySelection);
  }

  showWelcomeCard() {
    const welcomeCard = document.createElement("div");
    welcomeCard.classList.add("welcome-card");
    const heading = document.createElement("h1");
    heading.appendChild(document.createTextNode("Welcome to the"));
    const subTitle = document.createElement("span");
    subTitle.appendChild(document.createTextNode("Frontend Quiz!"));
    heading.appendChild(subTitle);
    welcomeCard.appendChild(heading);
    const paragraph = document.createElement("p");
    paragraph.appendChild(
      document.createTextNode("Pick a subject to get started.")
    );
    welcomeCard.appendChild(paragraph);
    this.infoContainer.appendChild(welcomeCard);
  }

  emptyInfoContainer() {
    this.infoContainer.innerHTML = "";
  }

  emptyContentContainer() {
    this.contentContainer.innerHTML = "";
  }

  extractCategories() {
    return this.quizzes.map((quiz) => ({
      name: quiz.title.toLowerCase(),
      url: quiz.icon,
    }));
  }

  getQuestions(category) {
    return this.quizzes.filter(
      (quiz) => quiz.title.toLowerCase() === category.name.toLowerCase()
    )[0].questions;
  }
}

const fetchQuestions = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Questions could not be fetched: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  const questions = await fetchQuestions();
  console.log(questions);
  const quiz = new Quiz(questions.quizzes);
};

init();
