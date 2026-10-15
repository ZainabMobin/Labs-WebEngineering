// state management variables, initially are set to  zero
var m = 0; // m value for set, add, recall and clear operation
var curr = ''; // string concatenating operators and operands
var hasPoint = false; // to keep check of any number to be overwritten on the bydefault .0 value inserted after the point
var hasAnswerEvalNow = false; // checks to continue with the answer as the input the next calculation, else restarts wth a new variable 
// for eg. 5+9 (evaluated) => 14 
//          if operator/function is pressed, we continue with it 14 + [...] , pressing radical sign gets sqrt(14) etc.
//          if another number is pressed, start fresh calculation

// must clear everything, all variableslike curr, m etc
function reset(){
    document.getElementById("display-screen").innerHTML = "";
    curr = '';
    m = '';
    hasPoint = false;
    hasAnswerEvalNow = false;
    console.log("cleared");
}
function appendElement(val){
    // we contcatenate only operators, point, function (like square, sqrt etc) after final answers for chaining, not other numbers
    if ( /^[0-9]$/.test(val) && hasAnswerEvalNow){ //reset prev answer, do not concatenate if a number is entered
        console.log("val entered is a number only, reset calculation! : ", val);   
        curr = ''
        hasAnswerEvalNow = false;
    }
    if (Number.isInteger(val) && hasPoint){
        // remove the added 0 after the point for normal overwrite
        curr = curr.slice(0, curr.length-1);
        console.log("removed zero after point!");
        hasPoint = false; //resumes normal writing instead of overwrite mode
    }  
    curr = curr + '' + val;
    hasAnswerEvalNow = false; //reset finally after concatenating the value
    displayScreen(curr);
}

function displayScreen(val){
    document.getElementById("display-screen").innerHTML = val; 
    
    console.log("got this: ", val);
    console.log(" curr: ", curr);
    
    if (Number.isNaN(val) || val === "NaN" || val === "Error" || val === "Infinity"){
        curr = '';
        console.log("catered for errors: ", val);
    }
    else {
        curr = val; //update current to result to pick up from there
    }
}

function calculate(){
    result = eval(curr);
    displayScreen(result);
    hasAnswerEvalNow = true;
}
function absolute(){
    curr = Math.abs(curr);
    displayScreen(curr);
}

function getSquare(){
    displayScreen(curr*curr);
}
function getSquareRoot(){
    if (curr < 0){
        displayScreen("Error");
        return;
    }
    displayScreen(Math.sqrt(curr));
}

//always adds a .0, and if something is written after that then overwrite it in the appendElement function
function addPoint(){
    if(hasAnswerEvalNow){  
        hasAnswerEvalNow = false;
    } 

    curr = curr + ".0";
    hasPoint = true; //state management to track if overwrite mode is enabled
    displayScreen(curr);
}

function getInverse(){
    res = eval(curr);
    if (res === "0"){
        displayScreen("Error");
        return;
    }
    displayScreen(eval(1/res));
}

function MClear(){
    m = 0;
    console.log("clear m cal");
}
function MStore(){
    val = document.getElementById("display-screen").innerHTML;
    if ( !val ) return; // dont update for empty string 
    m = val;
    console.log("got m val: ", val);
}

function MPlus(){
    val = document.getElementById("display-screen").innerHTML;
    if ( !val ) return; // dont update for empty string 
    m = m + val;
    console.log("got m val: ", val);
}
function MRecall(){
    curr = curr + String(m);
    displayScreen(curr);
}