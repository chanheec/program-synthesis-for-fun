// JavaScript source code
'use strict';

var NUM = "NUM";
var FALSE = "FALSE";
var VR = "VAR";
var PLUS = "PLUS";
var TIMES = "TIMES";
var LT = "LT";           // less than
var AND = "AND";
var NOT = "NOT";
var ITE = "ITE";         // if then else

var ALLOPS = [NUM, FALSE, VR, PLUS, TIMES, LT, AND, NOT, ITE];

function str(obj) { return JSON.stringify(obj); }

//Constructor definitions for the different AST nodes.


/**************************************************
 ***********  AST node definitions *****************
 ****************************************************/

class Node {
    toString() {
        throw new Error("Unimplemented method: toString()");
    }

    interpret() {
        throw new Error("Unimplemented method: interpret()");
    }
}

class False extends Node {
    toString() {
        return "false";
    }

    interpret(envt) {
        return false;
    }
}

class Var {
    constructor(name) {
        this.name = name;
    }
    
    toString() {
        return this.name;
    }

    interpret(envt) {
        return envt[this.name];
    }
}

class Num {
    constructor(val) {
        this.val = val;
    }
    
    toString() {
        return this.val.toString();
    }

    interpret(envt) {
        return this.val;
    }
}

class Plus {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    
    toString() {
        return "("+ this.left.toString() + "+" + this.right.toString()+")";
    }
    

    interpret(envt) {
        return this.left.interpret(envt) + this.right.interpret(envt);
    }
}

class Times {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    toString() {
        return "(" + this.left.toString() + "*" + this.right.toString() + ")";
    }

    interpret(envt) {
        return this.left.interpret(envt) * this.right.interpret(envt);
    }
}
    
class Lt {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    toString() {
        return "(" + this.left.toString() + "<" + this.right.toString() + ")";
    }

    interpret(envt) {
        return this.left.interpret(envt) < this.right.interpret(envt);
    }
}

class And {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }


    toString() {
        return "(" + this.left.toString() + "&&" + this.right.toString() + ")";
    }    

    interpret(envt) {
        return this.left.interpret(envt) && this.right.interpret(envt);
    }
}



class Not {
    constructor(left) {
        this.left = left;
    }
    
    toString() {
        return "(!" + this.left.toString()+ ")";
    }

    interpret(envt) {
        return !this.left.interpret(envt);
    }
}


class Ite {

    constructor(c, t, f) {
        this.cond = c;
        this.tcase = t;
        this.fcase = f;
    }
    
    toString() {
        return "(if " + this.cond.toString() + " then " + this.tcase.toString() + " else " + this.fcase.toString() + ")";
    }

    interpret(envt) {
        if (this.cond.interpret(envt)) {
            return this.tcase.interpret(envt);
        } else {
            return this.fcase.interpret(envt);
        }
    }

}
//Some functions you may find useful:

function randInt(lb, ub) {
    var rf = Math.random();
    rf = rf * (ub - lb) + lb;
    return Math.floor(rf);
}

function writeToConsole(text) {
    var csl = document.getElementById("console");
    if (typeof text == "string") {
        csl.value += text + "\n";
    } else {
        csl.value += text.toString() + "\n";
    }
}













// debug helper
// 2: verbose debug, 1: normal debug, 0: production level
var LOG_LEVEL = 0;    

function SET_LOG_LEVEL(level) {
    LOG_LEVEL = level;
}

function DEBUG_LOGGING(level, text) {
    if(level <= LOG_LEVEL) {
        writeToConsole(text);
    }
}


// function grow_intOps
// function grow_boolOps
// function elimEquvalents   or  check before inserting it to plist 
// function isCorrect



// $$ Arguments
// globalBnd : A bound on the maximum depth allowed for the generated ASTs.
// intOps: A list of the integer AST nodes the generator is allowed to use.
// boolOps: A list of the boolean AST nodes the generator is allowed to use.
// vars: A list of all the variable names that can appear in the generated expressions.
// consts: A list of all the integer constants that can appear in the generated expressions.
// inputoutput: A list of inputs/outputs to the function. Each element in the list is a map from variable names to values;
//              the variable "_out" maps to the expected output for that input.
//
// $$ Return Value
// return value: An AST for an expression that satisfies all the input/output pairs. 
//               If none is found before reaching the globalBnd, then it should return the string "FAIL".
//
// $$ Internal Variables
// int_plist     list of int type programs
// bool_plist    list of bool type programs
function bottomUp(globalBnd, intOps, boolOps, vars, consts, inputoutputs) {
    //Complete the body of randomExpr
    SET_LOG_LEVEL(2);

    var int_plist = (vars.map(v=> new Var(v))).concat(consts.map(c => new Num(c)));
    
    var bool_plist = [];
    if(boolOps.includes("FALSE")){
        bool_plist = [new False()];
    }

    // print initial inputs
    int_plist.map(e => DEBUG_LOGGING(2, e.toString()));    
    bool_plist.map(e => DEBUG_LOGGING(2, e.toString()));   

    for(var i=0; i<globalBnd; i++) {

    }




    
	return "NYI";
}


function bottomUpFaster(globalBnd, intOps, boolOps, vars, consts, inputoutput){
		
	return "NYI";
}


function run1a1(){
    writeToConsole("1a1");
	
	var rv = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [4, 5], [{x:5,y:10, _out:5},{x:8,y:3, _out:3}]);
	writeToConsole("RESULT: " + rv.toString());
	
}


function run1a2(){
	
	var rv = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [-1, 5], [
		{x:10, y:7, _out:17},
		{x:4, y:7, _out:-7},
		{x:10, y:3, _out:13},
		{x:1, y:-7, _out:-6},
		{x:1, y:8, _out:-8}		
		]);
	writeToConsole("RESULT: " + rv.toString());
	
}
   

function run1b(){
	
	var rv = bottomUpFaster(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [-1, 5], [
		{x:10, y:7, _out:17},
		{x:4, y:7, _out:-7},
		{x:10, y:3, _out:13},
		{x:1, y:-7, _out:-6},
		{x:1, y:8, _out:-8}		
		]);
	writeToConsole("RESULT: " + rv.toString());
	
}




//Useful functions for exercise 2. 
//Not so much starter code, though.

function structured(inputoutputs){
	return "NYI";
}


function run2() {
    var inpt = JSON.parse(document.getElementById("input2").value);
    //This is the data from which you will synthesize.
    writeToConsole("You need to implement this");    
}


function genData() {
    //If you write a block of code in program1 that writes its output to a variable out,
    //and reads from variable x, this function will feed random inputs to that block of code
    //and write the input/output pairs to input2.
    var program = document.getElementById("program1").value
    function gd(x) {
        var out;
        eval(program);
        return out;
    }
    var textToIn = document.getElementById("input2");
    const BOUND = 500;
    const N = 10;
    textToIn.value = "[";
    for(var i=0; i<N; ++i){
        if(i!=0){ textToIn.textContent += ", "; }
        var inpt = randInt(0, BOUND);
        textToIn.value += "[" + inpt + ", " + gd(inpt) + "]";
        if(i!=(N-1)){
        	textToIn.value += ",";
        }
    }
    textToIn.value += "]";
}
