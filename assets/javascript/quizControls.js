//Get the main quiz containers
let preQuizContent = document.querySelector(".pre-quiz");
let postQuizContent = document.querySelector(".post-quiz");
let quizContent = document.querySelector(".quiz-active");

let quizHeader = document.querySelector(".quiz-header");
let answerList = document.querySelector(".quiz-answers");



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

let questionArr = [q1,q2,q3,q4];
let unusedQuestionPool = [q1,q2,q3,q4];

//Add a question and possible answers to the screen
function renderQuestion(question) {
    console.log(unusedQuestionPool)
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
    if(isSolution) {
        //TODO: update score, display message
        console.log("+1")
        //Select new question
    }
    if(unusedQuestionPool.length === 0){
        //TODO: send to end screen
        console.log("The End")
        return;
    } else {
        renderQuestion(drawFromQuestionPool());
    }
}

//returns a question in the pool and then removes it
function drawFromQuestionPool() {
    nextQuestionIndex = Math.floor(Math.random() * unusedQuestionPool.length);
    nextQuestion = unusedQuestionPool[nextQuestionIndex];
    unusedQuestionPool.splice(nextQuestionIndex, 1);
    return nextQuestion;
}

//Start button resets question pool and moves from pre-quiz divs to quiz-active divs
startButton = document.querySelector("#startButton");
startButton.addEventListener('click', () => {

    //ensure all questions are currently in the question pool using a shallow copy
    unusedQuestionPool = questionArr.map((x) => x);

    //swap from beginning screen to quiz screen
    preQuizContent.setAttribute("style", "display: none;");
    quizContent.setAttribute("style", "display: block;");

    //select the first question to populate the quiz screen and remove it from the pool
    renderQuestion(drawFromQuestionPool());
});

//
answerList.addEventListener("click", handleQuestionClick)
