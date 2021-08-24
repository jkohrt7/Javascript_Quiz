//Get the main quiz containers
let preQuizContent = document.querySelector(".pre-quiz")
let postQuizContent = document.querySelector(".post-quiz")
let quizContent = document.querySelector(".quiz-active")

//Make the pre-quiz 'start' button remove instructions and start the quiz
startButton = document.querySelector("#startButton");
startButton.addEventListener('click', () => {
    preQuizContent.setAttribute("hidden", true);
    quizContent.setAttribute("hidden", false);
});

//Populate the 