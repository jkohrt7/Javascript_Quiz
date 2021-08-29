//Get the main quiz containers
let preQuizContent = document.querySelector(".pre-quiz");
let postQuizContent = document.querySelector(".post-quiz");
let quizContent = document.querySelector(".quiz-active");

let quizHeader = document.querySelector(".quiz-header");
let answerList = document.querySelector(".quiz-answers");

//Game dependent variables
let score = 0;
let timer = 60;

/* ~~~~Classes and Object Declarations~~~~ */

/** 
 * @class Question  
 * @description Contain necessary components for populating the quiz screen
 * @param {String} question: a string containing a question about JS
 * @param {[String, bool]} answers: an array of string/boolean pairs containing possible answers and their validity
 */

class Question {
    constructor(text, answers) {
        this.text = text;
        this.answers = answers;
    }
}

//All the questions that will show up in the quiz
let q1 = new Question(
    "JavaScript hoisting refers to the process whereby the compiler...",
    [
        ["Allocates memory for the variable and function declarations before executing the code", true],
        ["Translates JavaScript to machine code for execution", false],
        ["Makes any necessary changes to HTML before rendering it in a web browser", false],
        ["Assigns types to all assigned variables before executing the code", false]
    ]
)

let q2 = new Question(
    "API stands for...",
    [
        ["Application Programming Interface", true],
        ["Adaptive Programming Interface", false],
        ["Ancient Programming Information", false],
        ["Application Production Interface", false]
    ]
)

let q3 = new Question(
    "This Array method takes in a function, applies it to every element in the array, and then returns the processed array",
    [
        ["Array.prototype.map()", true],
        ["Array.prototype.filter()", false],
        ["Array.prototype.reduce()", false],
        ["Array.prototype.apply()",false]
    ]
)

let q4 = new Question(
    "JavaScript is the most widely used server-side programming language.",
    [
        ["Yes, it is more widespread than PHP", false],
        ["No, Ruby is more widespread", false],
        ["Yes, and it is the most popular client-side language", false],
        ["No, but it is the most popular client-side language", true]
    ]
)

const questionArr = [q1,q2,q3,q4];
let unusedQuestionPool = [q1,q2,q3,q4];

/* ~~~~Helper Functions~~~~ */

//Add a question and possible answers to the screen
function renderQuestion(question) {

    //clear out existing list elements
    answerList.innerHTML = "";

    //add question text
    console.log(question);
    quizHeader.textContent = question.text;
    
    //Append each answer in the list to the ul in the quiz container
    for(let i = 0; i < question.answers.length; i++) {
        let node = document.createElement("LI");
        node.appendChild(document.createTextNode(question.answers[i][0]));
        node.setAttribute("data-answer", question.answers[i][1]);
        answerList.appendChild(node);
    }
}

//Handles clicking a question
function handleQuestionClick(e) {
    let isSolution = e.target.getAttribute("data-answer");
    renderFeedback(isSolution);

    if(isSolution) {
        score += 1;
    } 

    if(unusedQuestionPool.length === 0){
        //TODO: send to end screen
        transitionToEnd();
        return;
    } else {
        renderQuestion(drawFromQuestionPool());
    }
}

//Displays a temporary feedback message
function renderFeedback(isAnswer) {
   
    //display correct/incorrect for 3 seconds.
    if(isAnswer === false){
        correctTag = document.querySelector("#correct-feedback")
        correctTag.setAttribute("style", "display: block;")
        setTimeout(() => {
            correctTag.setAttribute("style", "display: none");
        },3000)
    } 
    else {
        incorrectTag = document.querySelector("#incorrect-feedback")
        incorrectTag.setAttribute("style", "display: block;")
        setTimeout(() => {
            incorrectTag.setAttribute("style", "display: none");
        },3000)
    }

}

//Returns a question in the pool and then removes it
function drawFromQuestionPool() {
    nextQuestionIndex = Math.floor(Math.random() * unusedQuestionPool.length);
    nextQuestion = unusedQuestionPool[nextQuestionIndex];
    unusedQuestionPool.splice(nextQuestionIndex, 1);
    return nextQuestion;
}

//Starts the game timer and goes to end screen when finished
function beginTimer() {
    setInterval(() => {

    });
}

/* ~~~~ Transition Functions ~~~~ */

//Handles transition from pre-quiz to in-quiz
function transitionToQuiz() {
    //Reset global game variables
    unusedQuestionPool = questionArr.map((x) => x);
    score = 0;

    //Alter visible divs
    preQuizContent.setAttribute("style", "display: none;");
    quizContent.setAttribute("style", "display: block;");
    return;
}

//handles transition from in-quiz to post-quiz
function transitionToEnd() {
    //todo: save data locally

    quizContent.setAttribute("style", "display: none;");
    postQuizContent.setAttribute("style", "display: block;");
    return;
}

//handles transition from post-quiz to pre-quiz
function transitionToStart() {
    postQuizContent.setAttribute("style", "display: none;");
    preQuizContent.setAttribute("style", "display: block;");
    return;
}

/* ~~~~ Event Listeners ~~~~ */

//Clicking the start button begins a new game and renders the first set of questions
startButton = document.querySelector("#startButton");
startButton.addEventListener('click', () => {
    transitionToQuiz();
    renderQuestion(drawFromQuestionPool());
});

//Clicking any <li> in answerList bubbles up to this event
answerList.addEventListener("click", handleQuestionClick)
