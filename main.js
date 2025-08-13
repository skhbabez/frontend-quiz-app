"use strict";
const url = "data.json";
let quiz = null;

class Quiz {
  #categories;
  #currentQuestion = 0;
  #category;
  #questions;
  #quizzes;
  logo;
  infoContainer;
  contentContainer;
  questionText;
  questionCount;
  progressBar;

  constructor(quizzes) {
    this.#quizzes = quizzes;
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.#categories = this.extractCategories(this.#quizzes);
    this.logo = document.getElementById("logo");
    this.infoContainer = document.getElementById("info-container");
    this.contentContainer = document.getElementById("content-container");
    this.hideLogo();
    this.start();
  }

  start() {
    this.emptyContentContainer();
    this.emptyInfoContainer();
    this.showCategorySelection();
    this.showWelcomeCard();
  }

  runQuiz(category) {
    this.#questions = this.getQuestions(category);
    this.#category = category;
    this.#currentQuestion = 0;
    console.log(this.#questions);
    this.setLogoCategory(category);
    this.showLogo();
    this.emptyInfoContainer();
    this.emptyContentContainer();
    // create question container
    this.questionContainer = document.createElement("div");
    this.questionContainer.classList.add("question-container");
    const content = document.createElement("div");
    this.questionCount = document.createElement("p");
    this.questionText = document.createElement("p");
    content.appendChild(this.questionCount);
    content.appendChild(this.questionText);
    this.questionContainer.appendChild(content);
    const progressBarWrapper = document.createElement("div");
    this.progressBar = document.createElement("div");
    progressBarWrapper.classList.add("progress-bar");
    progressBarWrapper.appendChild(this.progressBar);
    this.questionContainer.appendChild(progressBarWrapper);
    this.infoContainer.appendChild(this.questionContainer);
    this.answerContainer = document.createElement("form");
    this.answerContainer.classList.add("btn-container");
    this.answerContainer.noValidate = true;
    this.contentContainer.appendChild(this.answerContainer);

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const result = data.get("answer");
      if (!result) {
        this.showError();
      }
      console.log(result);
    };
    this.answerContainer.addEventListener("submit", handleSubmit);
    this.showQuestion(0);
  }

  showError() {
    const error = document.createElement("p");
    error.classList.add("error");
    error.textContent = "Please select an answer";
    this.answerContainer.appendChild(error);
  }

  createAnswers(options, selectedOption = "") {
    return options.map((option, index) => {
      const letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(index);
      const label = document.createElement("label");
      label.classList.add("icon-btn", "option-btn");
      const icon = document.createElement("span");
      icon.classList.add("icon");
      icon.textContent = letter;
      const text = document.createElement("span");
      text.textContent = option;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      input.id = "answer-" + letter;
      label.appendChild(icon);
      label.appendChild(text);
      label.appendChild(input);
      return label;
    });
  }

  showQuestion(index) {
    const question = this.#questions[index];
    const current = index + 1;
    const remaining = this.#questions.length;
    const text = question.question;
    const options = question.options;
    this.questionCount.textContent = `Question ${current} of ${remaining}`;
    this.questionText.textContent = text;
    const progress = (current / remaining) * 100;
    this.progressBar.style = `width: ${progress}%`;
    this.createAnswers(options).forEach((option) => {
      this.answerContainer.appendChild(option);
    });
    const submitBtn = document.createElement("button");
    submitBtn.classList.add("submit-btn");
    submitBtn.textContent = "Submit Answer";
    submitBtn.type = "submit";
    this.answerContainer.appendChild(submitBtn);
  }

  showAnswered() {}

  //   <div class="btn-container">
  // <label class="icon-btn option-btn icon-correct outline-correct">
  //   <span class="icon"> A </span>
  //   <span>4,5:1</span>
  //   <input disabled type="radio" name="answer" />
  // </label>

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
      buttonText.textContent = name;
      button.appendChild(label);
      button.appendChild(buttonText);
      button.addEventListener("click", () => this.runQuiz(category));
      return button;
    };
    this.#categories.forEach((category) => {
      categorySelection.appendChild(createSelector(category));
    });
    this.contentContainer.appendChild(categorySelection);
  }

  showWelcomeCard() {
    const welcomeCard = document.createElement("div");
    welcomeCard.classList.add("welcome-card");
    const heading = document.createElement("h1");
    heading.textContent = "Welcome to the";
    const subTitle = document.createElement("span");
    subTitle.textContent = "Frontend Quiz!";
    heading.appendChild(subTitle);
    welcomeCard.appendChild(heading);
    const paragraph = document.createElement("p");
    paragraph.textContent = "Pick a subject to get started.";
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
    return this.#quizzes.map((quiz) => ({
      name: quiz.title.toLowerCase(),
      url: quiz.icon,
    }));
  }

  getQuestions(category) {
    return this.#quizzes.filter(
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
  quiz = new Quiz(questions.quizzes);
};

init();
