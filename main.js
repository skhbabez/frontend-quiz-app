const url = "data.json";

class Quiz {
  constructor(quizzes) {
    this.quizzes = quizzes;
    this.initializeQuiz();
  }

  initializeQuiz() {
    this.categories = this.extractCategories(this.quizzes);
    console.log(this.categories);
    this.logo = document.getElementById("logo");
    this.infoContainer = document.getElementById("info-container");
    this.hideLogo();
  }
  start() {
    this.showCategorySelection();
    this.showWelcomeCard();
  }

  hideLogo() {
    this.logo.classList.add("hidden");
  }

  showLogo() {
    this.logo.classList.remove("hidden");
  }

  setLogoCategory(category) {
    this.logo.textContent = category;
    this.logo.classList.add(`icon-${category}`);
  }

  showCategorySelection() {
    const categorySelection = document.createElement("div");
    categorySelection.classList.add("btn-container");
    const createSelector = (categories) => {
      const button = document.createElement("button");
    };
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

  extractCategories() {
    return this.quizzes.map((quiz) => ({
      title: quiz.title.toLowerCase(),
      icon: quiz.icon,
    }));
  }

  getQuiz(category) {
    return this.quizzes.filter(
      (quiz) => quiz.title.toLowerCase() === category.toLowerCase()
    );
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
  quiz.start();
};

init();
