// Skeleton Code: https://people.csail.mit.edu/asolar/SynthesisCourse/Assignment1.htm
// Chanhee Cho (cksgml@snu.ac.kr)


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













// debug helpers
// 2: verbose debug, 1: normal debug, 0: production level
var LOG_LEVEL = 0;                                  // production level by default  
function SET_LOG_LEVEL(level) {LOG_LEVEL = level;}  // To get log, set LOG_LEVEL to 1 or 2 
function DEBUG_LOGGING(level, text) {
    if(level <= LOG_LEVEL) 
        writeToConsole(text);
}

// check is 'pgm' satisfies 'inputoutputs'.
//
// $$ arguments
// pgm: program to check
// inputoutputs: specification (programming by example)
//
// return value: true / false 
function isCorrect(pgm, inputoutputs) {
    return inputoutputs.every(i => (pgm.interpret(i) == i["_out"]));
}

// check whether 'plist' containts an answer.
//
// $$ arguments
// plist: program list to check
// inputoutputs: specification (programming by example)
//
// return value: index of answer (if found)
//               -1              (if answer does not exist)
function findAnswerIndex(plist, inputoutputs) {
    return plist.findIndex(e => isCorrect(e, inputoutputs));
}


// check if 'pgm1' and 'pgm2' is equivanlent.
// note that "observational equivalence" is not 'real' equivalence
//
// $$ arguments
// pgm1: program to check
// pgm2: program to check
// inputoutputs: specification (programming by example)
//
// return value: true / false 
function isEquivalent(pgm1, pgm2, inputoutputs) {
    return inputoutputs.every(i => (pgm1.interpret(i) == pgm2.interpret(i)));
}

// check if 'pgm' is not equivalnt to any program in 'plist'
//
// $$ arguments
// pgm: program to check
// plist: program list
// inputoutputs: specification (programming by example)
//
// return value: true / false 
function isNew(pgm, plist, inputoutputs) {
    return plist.every(i => !isEquivalent(pgm, i, inputoutputs));
}

// generate new programs using existing pgms and 'intOps'
//
// $$ arguments
// intOps: Ops that return 'int type' , subset of [VR, NUM, PLUS, TIMES, ITE]
// int_plist: generated programs of int type
// bool_plist: generated programs of bool type
//
// return value:  list of newly generated programs
function grow_intOps(intOps, int_plist, bool_plist){
    DEBUG_LOGGING(2, "grow_intOps begin");
    DEBUG_LOGGING(2, str(intOps));
    DEBUG_LOGGING(2, int_plist);
    DEBUG_LOGGING(2, bool_plist);
    var generated_pgms = [];

    // VR, NUM is already handled at the beginning of bottomUp()
    // note that +,* are commutative 
    if(intOps.includes("PLUS")) {
        for(var i=0; i<int_plist.length; i++) {
            for(var j=0; j<=i; j++) {
                generated_pgms.push(new Plus(int_plist[i],int_plist[j]));
            }
        }
    }
    if(intOps.includes("TIMES")) {
        for(var i=0; i<int_plist.length; i++) {
            for(var j=0; j<=i; j++) {
                generated_pgms.push(new Times(int_plist[i],int_plist[j]));
            }
        }
    }

    if(intOps.includes("ITE")) {
        for(var i=0; i<int_plist.length; i++) {
            for(var j=0; j<int_plist.length; j++) {
                for(var k=0; k<bool_plist.length; k++)
                    generated_pgms.push(new Ite(bool_plist[k], int_plist[i], int_plist[j]));
            }
        }
    }
    return generated_pgms;
}


// generate new programs using existing pgms and 'boolOps'
//
// $$ arguments
// boolOps: Ops that return 'bool type' , subset of [AND, NOT, LT, FALSE]
// int_plist: generated programs of int type
// bool_plist: generated programs of bool type
//
// return value:  list of newly generated programs
function grow_boolOps(boolOps, int_plist, bool_plist){
    DEBUG_LOGGING(2, "grow_boolOps begin");
    var generated_pgms = [];

    // FALSE is already handled at the beginning of bottomUp()
    // note that 'and' is commutative 
    if(boolOps.includes("AND")) {
        for(var i=0; i<bool_plist.length; i++) {
            for(var j=0; j<i; j++) {  // i=j is not needed ('X and X' is X)
                generated_pgms.push(new And(bool_plist[i],bool_plist[j]));
            }
        }
    }

    // less than
    if(boolOps.includes("LT")) {
        for(var i=0; i<int_plist.length; i++) {
            for(var j=0; j<int_plist.length; j++) {
                generated_pgms.push(new Lt(int_plist[i],int_plist[j]));
            }
        }
    }

    if(boolOps.includes("NOT")) {
        for(var i=0; i<bool_plist.length; i++) {
            generated_pgms.push(new Not(bool_plist[i]));
        }
    }
    return generated_pgms;
}


// $$ Arguments
// globalBnd : A bound on the maximum depth allowed for the generated ASTs.
// intOps: A list of the integer AST nodes the generator is allowed to use.
// boolOps: A list of the boolean AST nodes the generator is allowed to use.
// vars: A list of all the variable names that can appear in the generated expressions.
// consts: A list of all the integer constants that can appear in the generated expressions.
// inputoutput: A list of inputs/outputs to the function. Each element in the list is a map from variable names to values;
//              the variable "_out" maps to the expected output for that input.
//
// return value: An AST for an expression that satisfies all the input/output pairs. 
//               If none is found before reaching the globalBnd, then it should return the string "FAIL".
//
// $$ Internal Variables
// int_plist     list of int type programs
// bool_plist    list of bool type programs
function bottomUp(globalBnd, intOps, boolOps, vars, consts, inputoutputs) {     //Complete the body of randomExpr
    SET_LOG_LEVEL(1);

    // set initial program lists
    var int_plist = (vars.map(v=> new Var(v))).concat(consts.map(c => new Num(c)));   // assume Var, Num is included in intOps 
    var bool_plist = [];
    if(boolOps.includes("FALSE")){
        bool_plist = [new False()];
    }

    // print initial inputs
    DEBUG_LOGGING(2, "initial int_plist");
    int_plist.map(e => DEBUG_LOGGING(2, e.toString()));    
    DEBUG_LOGGING(2, "initial bool_plist");
    bool_plist.map(e => DEBUG_LOGGING(2, e.toString()));   

    var idx;
    var generated_int_list;
    var generated_bool_list;
    for(var i=0; i<globalBnd; i++) {
        DEBUG_LOGGING(1, str(i) + "-th loop begin");

        // check if an answer exists
        idx = findAnswerIndex(int_plist, inputoutputs);
        if(idx != -1) return int_plist[idx];
        idx = findAnswerIndex(bool_plist, inputoutputs);
        if(idx != -1) return bool_plist[idx];

        // make new programs using context free grammar
        generated_int_list  = grow_intOps(intOps, int_plist, bool_plist);
        generated_int_list.map(e => DEBUG_LOGGING(2, e.toString()));  
        generated_bool_list = grow_boolOps(boolOps,int_plist,bool_plist);
        generated_bool_list.map(e => DEBUG_LOGGING(2, e.toString()));

        // if generated pgm is new, push to the list  instead of "elimEquvalents"  
        generated_int_list.map(e => ((isNew(e,int_plist,inputoutputs) ? int_plist.push(e) : -1 )));     // -1 : do nothing
        generated_bool_list.map(e => ((isNew(e,bool_plist,inputoutputs) ? bool_plist.push(e) : -1 )));  // -1 : do nothing
    }
	return "FAIL";
}


function bottomUpFaster(globalBnd, intOps, boolOps, vars, consts, inputoutput){
		
	return "NYI";
}     


function run1a1(){
    writeToConsole("1a1 - 1");
    var rv1 = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [4, 5], [{x:5,y:10, _out:5},{x:8,y:3, _out:8}]);
	writeToConsole("RESULT: " + rv1.toString());
    
    writeToConsole("1a1 - 2");
	var rv2 = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [4, 5], [{x:5,y:10, _out:5},{x:8,y:3, _out:3}]);
    writeToConsole("RESULT: " + rv2.toString());
    
    writeToConsole("1a1 - 3");
    var rv3 = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [2, 3], 
                          [{x:5,y:10, _out:40},{x:8,y:3, _out:25}, {x:2,y:30, _out:94}]);   // 2x + 3y
	writeToConsole("RESULT: " + rv3.toString());
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
