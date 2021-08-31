//Get the main quiz containers
let preQuizContent = document.querySelector(".pre-quiz");
let postQuizContent = document.querySelector(".post-quiz");
let quizContent = document.querySelector(".quiz-active");
let highScores = document.querySelector(".high-scores")
let highScoresList = document.querySelector(".score-list")

let quizHeader = document.querySelector(".quiz-header");
let answerList = document.querySelector(".quiz-answers");
let numTimer = document.querySelector("#numTimer");

//Game dependent variables
let score = 0;
let timer = 59;
let timerFunction;
let delay = 1000;
let currQuestionIndex = 0;

/* ~~~~Classes and Object Declarations~~~~ */

/** 
 * @class Question  
 * @description Contain necessary components for populating the quiz screen
 * @param {[String]} question: a string containing a question about JS
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
        
        ["Adaptive Programming Interface", false],
        ["Ancient Programming Information", false],
        ["Application Programming Interface", true],
        ["Application Production Interface", false]
    ]
)

let q3 = new Question(
    "This Array method takes in a function, applies it to every element in the array, and then returns the processed array",
    [
        
        ["Array.prototype.filter()", false],
        ["Array.prototype.map()", true],
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

let questionArr = [q1,q2,q3,q4];
//let unusedQuestionPool = [q1,q2,q3,q4];


/* ~~~~Helper Functions~~~~ */


//Handles clicking a question
function handleQuestionClick(e) {
    let isSolution = e.target.getAttribute("data-answer");
    currQuestionIndex += 1;
    renderFeedback(isSolution, e);

    if(isSolution === "true") {
        score += 1;
    } 
    else {
        timer > 10 ? timer -= 10 : timer = 0; //subtract 10 or set to 0 if timer<10
    }

    if(currQuestionIndex === questionArr.length){
        setTimeout(transitionToEnd, delay);

    } else {
        setTimeout(() => {renderQuestion(questionArr[currQuestionIndex])}, delay);
    }
}

//Starts the game timer and goes to end screen when finished
function timerFunc() {
    return setInterval(() => {
        numTimer.textContent = timer;
        timer -= 1;
        if(timer < 0) {
            transitionToEnd();
            clearInterval(timerFunction);
        }
    }, 1000);
}

// Derstenfield shuffle; randomizes order of elements in an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/* ~~~~ Render Functions ~~~~ */

/** 
 * @function renderHighScores
 * @description Adds top 10 high scores in localStorage to the high score list
*/
function renderHighScores() {
    //get the list of scores and extract the top 10
    let scoreArr = JSON.parse(localStorage.getItem("scoreList"));
    scoreArr.sort((a,b) => b.score - a.score );
    scoreArr = scoreArr.slice(0,9);

    for (let i = 0; i < scoreArr.length && i < 10; i++) {
        let node = document.createElement("LI");
        node.appendChild(document.createTextNode(scoreArr[i].initials + ":  " + scoreArr[i].highScore));
        highScoresList.appendChild(node);
    }
    let buttonNode = document.createElement("BUTTON");
    buttonNode.setAttribute("onclick", "window.location.reload()");
    buttonNode.innerHTML = "Play Again";
    buttonNode.setAttribute("class", "btn btn-outline-info")
    highScores.appendChild(buttonNode);
}

/** 
 * @function renderHighScores
 * @description Adds top 10 high scores in localStorage to the high score list
 * @param isAnswer A string of the form 'true' or 'false'
 * @param e An event object whose target is the li that was clicked
*/
function renderFeedback(isAnswer, e) {
   
    if(isAnswer === 'true'){
        //highlight selection green and disable events temporarily
        e.target.setAttribute("style", "background-color: green; color: white;")
        answerList.setAttribute("style", "pointer-events: none")

        //display feedback temporarily
        correctTag = document.querySelector("#correct-feedback")
        correctTag.setAttribute("style", "display: block;")
        setTimeout(() => {
            correctTag.setAttribute("style", "display: none");
            answerList.setAttribute("style", "pointer-events: auto")
        },delay)
    } 
    else {
        //highlight slection red and disable events
        e.target.setAttribute("style", "background-color: red; color: white;")
        answerList.setAttribute("style", "pointer-events: none")

        //display feedback temporarily
        incorrectTag = document.querySelector("#incorrect-feedback")
        incorrectTag.setAttribute("style", "display: block;")
        setTimeout(() => {
            incorrectTag.setAttribute("style", "display: none");
            answerList.setAttribute("style", "pointer-events: auto")
        },delay)
    }

}

//Add a question and possible answers to the screen
function renderQuestion(question) {

    //clear out existing list elements
    answerList.innerHTML = "";

    //add question text
    quizHeader.textContent = question.text;
    
    //Append each answer in the list to the ul in the quiz container
    for(let i = 0; i < question.answers.length; i++) {
        let node = document.createElement("LI");
        node.appendChild(document.createTextNode(question.answers[i][0]));
        node.setAttribute("data-answer", question.answers[i][1]);
        answerList.appendChild(node);
    }
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

    //randomize question order
    questionArr = shuffleArray(questionArr);
    for(let i = 0; i < questionArr.length; i++) {
        questionArr[i].answers = shuffleArray(questionArr[i].answers);
    }

    //Start timer
    timerFunction = timerFunc();

    return;
}

//handles transition from in-quiz to post-quiz. 
function transitionToEnd() {
    //todo: save data locally
    clearInterval(timerFunction);
    quizContent.setAttribute("style", "display: none;");
    postQuizContent.setAttribute("style", "display: block;");
    return;
}

function transitionToHighScore() {
    preQuizContent.setAttribute("style", "display: none;")
    quizContent.setAttribute("style", "display: none;");
    postQuizContent.setAttribute("style", "display: none;");
    highScores.setAttribute("style", "display: block;");
    clearInterval(timerFunction);
    document.querySelector(".header-content").setAttribute("onclick", "")
    renderHighScores();
}


/* ~~~~ Event Listeners ~~~~ */

// I. Start Quiz
//Clicking the start button begins a new game and renders the first set of questions
startButton = document.querySelector("#startButton");
startButton.addEventListener('click', () => {
    transitionToQuiz();
    renderQuestion(questionArr[currQuestionIndex])
});

// II. Progress Quiz
// Clicking any <li> in answerList bubbles up to this event
answerList.addEventListener("click", handleQuestionClick)

// III. Let player submit their score and view high scores
// Submitting initials brings player to high scores
document.querySelector('#submitButton').addEventListener("click",() =>{

    let player = {
        initials: document.querySelector("#playerInitials").value,
        highScore: score,
    }

    if(window.localStorage.getItem("scoreList") == null) {
        window.localStorage.setItem("scoreList", JSON.stringify([player]))
    } else {
        let scores = JSON.parse(window.localStorage.getItem("scoreList"));
        scores.push(player);
        window.localStorage.setItem("scoreList", JSON.stringify(scores));
    }

    transitionToHighScore();
});

