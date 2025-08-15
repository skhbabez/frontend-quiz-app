"use strict";

const url = "data.json";
let quiz = null;

class Quiz {
  #categories;
  #currentQuestion = 0;
  #category;
  #questions;
  #quizzes;
  #noQuestions;
  #correctAnswers;
  logo;
  infoContainer;
  contentContainer;
  questionText;
  questionCount;
  progressBar;
  answerContainer;

  constructor(quizzes) {
    this.#quizzes = quizzes;
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.#categories = this.extractCategories(this.#quizzes);
    this.logo = document.getElementById("logo");
    this.infoContainer = document.getElementById("info-container");
    this.contentContainer = document.getElementById("content-container");
    this.start();
  }

  start() {
    this.emptyContentContainer();
    this.emptyInfoContainer();
    this.showCategorySelection();
    this.showWelcomeCard();
    this.hideLogo();
  }

  runQuiz(category) {
    this.#questions = this.getQuestions(category);
    this.#category = category;
    this.#currentQuestion = 0;
    this.#correctAnswers = 0;
    this.#noQuestions = this.#questions.length;
    this.setLogoCategory(category);
    this.showLogo();
    this.emptyInfoContainer();
    this.emptyContentContainer();
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

    this.showQuestion(0);
  }

  finishQuiz() {
    this.emptyContentContainer();
    this.emptyInfoContainer();
    this.showCompleteContainer();
    this.showScoreContainer();
  }

  showCompleteContainer() {
    const container = document.createElement("div");
    container.classList.add("complete-container");
    const heading = document.createElement("h1");
    heading.textContent = "Quiz completed";
    const subTitle = document.createElement("span");
    subTitle.textContent = "You scored...";
    heading.appendChild(subTitle);
    container.appendChild(heading);
    this.infoContainer.appendChild(container);
  }

  showScoreContainer() {
    const { name, url } = this.#category;
    const container = document.createElement("div");
    container.classList.add("score-container");
    const scoreCard = document.createElement("div");
    scoreCard.classList.add("score-card");
    container.appendChild(scoreCard);
    const logo = document.createElement("p");
    logo.classList.add("logo");
    const label = this.createLabel(url, name);
    logo.appendChild(label);
    logo.appendChild(document.createTextNode(name));
    scoreCard.appendChild(logo);
    this.contentContainer.appendChild(container);
    const score = document.createElement("div");
    score.classList.add("score");
    scoreCard.appendChild(score);
    const scoreCount = document.createElement("p");
    const questionCount = document.createElement("p");
    score.appendChild(scoreCount);
    score.appendChild(questionCount);
    scoreCount.textContent = this.#correctAnswers;
    questionCount.textContent = `out of ${this.#noQuestions}`;
    const submitButton = document.createElement("button");
    submitButton.classList.add("submit-btn");
    submitButton.textContent = "Play Again";
    container.appendChild(submitButton);
    submitButton.addEventListener("click", () => {
      this.start();
    });
  }

  showError() {
    let error = this.answerContainer.querySelectorAll(".error");
    if (error.length == 0) {
      error = document.createElement("p");
      error.classList.add("error");
      error.textContent = "Please select an answer";
      this.answerContainer.appendChild(error);
    }
  }

  createAnswers(options, correctOption = "", selectedOption = "") {
    return options.map((option, index) => {
      const letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(index);
      const label = document.createElement("label");
      label.classList.add("icon-btn", "option-btn");
      label.classList.add();
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
      if (selectedOption && correctOption) {
        let classes = [];
        if (correctOption === option) {
          classes.push("icon-correct");
        }
        if (correctOption === selectedOption && selectedOption === option) {
          classes.push("outline-correct");
        }

        if (selectedOption !== correctOption && selectedOption === option) {
          classes.push("outline-false");
          classes.push("icon-false");
        }
        input.disabled = true;
        label.classList.add(...classes);
      }
      return label;
    });
  }

  showQuestion(index) {
    const question = this.#questions[index];
    const current = index + 1;
    const remaining = this.#noQuestions;
    const text = question.question;
    const options = question.options;
    this.answerContainer = document.createElement("form");
    this.answerContainer.classList.add("btn-container");
    this.answerContainer.noValidate = true;

    this.createAnswers(options).forEach((option) => {
      this.answerContainer.appendChild(option);
    });
    this.questionCount.textContent = `Question ${current} of ${remaining}`;
    this.questionText.textContent = text;
    const progress = (current / remaining) * 100;
    this.progressBar.style = `width: ${progress}%`;
    const submitBtn = document.createElement("button");
    submitBtn.classList.add("submit-btn");
    submitBtn.textContent = "Submit Answer";
    submitBtn.type = "submit";
    this.answerContainer.appendChild(submitBtn);
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const result = data.get("answer");
      if (!result) {
        this.showError();
        return;
      }
      this.showAnswered(result);
    };
    this.answerContainer.addEventListener("submit", handleSubmit);
    this.contentContainer.appendChild(this.answerContainer);
  }

  showAnswered(selected) {
    const question = this.#questions[this.#currentQuestion];
    const correctOption = question.answer;
    this.emptyContentContainer();
    this.answerContainer = document.createElement("div");
    this.answerContainer.classList.add("btn-container");
    if (correctOption === selected) {
      this.#correctAnswers++;
    }
    const options = question.options;
    this.createAnswers(options, correctOption, selected).forEach((option) => {
      this.answerContainer.appendChild(option);
    });
    const submitBtn = document.createElement("button");
    submitBtn.classList.add("submit-btn");
    submitBtn.textContent = "Next Question";
    this.answerContainer.appendChild(submitBtn);
    this.contentContainer.appendChild(this.answerContainer);
    this.answerContainer.addEventListener("click", () => {
      this.#currentQuestion++;
      if (this.#currentQuestion < this.#noQuestions) {
        this.answerContainer.innerHTML = "";
        this.showQuestion(this.#currentQuestion);
      } else {
        this.finishQuiz();
      }
    });
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
    const label = this.createLabel(url, name);
    this.logo.innerHTML = "";
    this.logo.appendChild(label);
    const text = document.createElement("span");
    text.textContent = name;
    this.logo.appendChild(text);
  }

  createLabel(url, color = "accessibility") {
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
      const label = this.createLabel(url, name);
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
  quiz = new Quiz(questions.quizzes);
};

init();
