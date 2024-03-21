class ParsedUnit{
  constructor(dataUsed, value, right, left){
    this.dataUsed = dataUsed;
    this.value = value;
    
    this.right = right;
    this.left = left;
  }
}

const dataUsed = {
  OPERATION: Symbol(0),
  NUMBER: Symbol(1)
}

const operations = {
  ADDI: '+',
  SUBS: '-',
  MULT: '*',
  DIVI: '/',
  S_PA: '(',
  E_PA: ')',
}

function getNumberFromOperation(txt){
  let depuratedTxt = depurate(txt);
  let parsedOperation = parse(depuratedTxt);
  
  /*
  console.log(parsedOperation.left.value);
  console.log(parsedOperation.left.dataUsed === dataUsed.NUMBER);
  console.log(parsedOperation.value);
  console.log(parsedOperation.right.value);
  console.log(parsedOperation.right.dataUsed === dataUsed.NUMBER);
  */
  
  let operated = operate(parsedOperation);
  
  return operated;
}

//Transforms an operation string, making it parseable
function depurate(txt){
  
  //Simplifies stacked + and -. For example: "2+-3" or "2-+3", or even "2--++--++++--3"
  for(let i = 0; i < txt.length; i++){
    if(txt[i] === operations.ADDI || txt[i] === operations.SUBS){
      let compoundStart = i;
      let endValue = operations.ADDI;
      
      //We check all the values, changing the symbol when finding a substraction, until we reach something different
      while(i < txt.length && (txt[i] === operations.ADDI || txt[i] === operations.SUBS)){
        if(txt[i] === operations.SUBS){
          if(endValue === operations.ADDI) endValue = operations.SUBS;
          else endValue = operations.ADDI;
        }
        i++;
      }
      
      txt = txt.substr(0, compoundStart) + endValue + txt.substr(i);
      i--; //Needed in order not to skip the next character
    }
  }
  
  //Solves + or - after / or *. For example: "2/-3" -> "2/(0-3)", instead of being operated like "(2/0)-3"
  for(let i = 0; i < txt.length; i++){
    if(txt[i] === operations.MULT || txt[i]===operations.DIVI){
      if(txt[i+1] === operations.ADDI || txt[i+1] === operations.SUBS){
        let numberStart = i+2;
        i=numberStart;
        
        while(i < txt.length && !isNaN(txt[i])) i++;
        
        txt = txt.substr(0, numberStart-1) + "(0" + txt.substr(numberStart-1, i-(numberStart-1)) + ')' + txt.substr(i);
        i--; //Needed in order not to skip the next character
      }
    }
  }
  
  //Simplifies parenthesys. For example: "((2+3))*3" -> "(2+3)*3"
  /*for(let i = 0; i < txt.length; i++){
    if(txt[i] === operations.S_PA){
      i++;
      if(txt[i] === operations.S_PA){
        let start = i-1;
        let missingParenthesys = 2;
        
        while(i < txt.length && missingParenthesys >= 2){
          i++;
          if(txt[i] === operations.S_PA){
            missingParenthesys++;
          }
          else if(txt[i] === operations.E_PA){
            missingParenthesys--;
          }
        }
        
        i++;
        if(txt[i] === operations.E_PA){
          txt = txt.substr(0, start) + txt.substr(start+1, i-start-1) + txt.substr(i+1);
        }
        //In case we missed a parenthesys
        i = start;
      }
    }
  }*/
  
  /*We check for unnecesary parenthesis. For example: "(2+3*(2+2))" -> "2+3*(2+2)"
  if(txt[0] === operations.S_PA){
    let missingParenthesys = 1;
    //We go through every character but the last one (and the first one)
    for(let i = 1; i < txt.length-1 && missingParenthesys >= 1; i++){
      if(txt[i] === operations.S_PA){
        missingParenthesys++;
      } else if (txt[i] === operations.E_PA){
        missingParenthesys--;
      }
    }
    
    //If by the end we're missing a parenthesys, we can assume it's the last one
    if(missingParenthesys === 1){
      txt = txt.substr(1, txt.length-2);
    }
  }*/
  
  return txt;
}

function parse(txt){
  let parsedBaseIndex = getBase(txt);
  
  let parsedUnit;
  
  if(!isNaN(parsedBaseIndex)){
    
    parsedUnit = new ParsedUnit(dataUsed.OPERATION, txt[parsedBaseIndex], null, null);
    parsedUnit.left = parse(txt.slice(0, parsedBaseIndex));
    parsedUnit.right = parse(txt.slice(parsedBaseIndex+1));
  
  } else {
    //We remove parenthesys
    while(txt[0] === '(' || txt[0] === ')') txt = txt.slice(1);
    while(txt[txt.length-1] === '(' || txt[txt.length-1] === ')') txt = txt.slice(0,-1);
    
    parsedUnit = new ParsedUnit(dataUsed.NUMBER, Number(txt), null, null);
  }
  
  
  return parsedUnit;
}

function operate(baseUnit){
  if(baseUnit.dataUsed === dataUsed.NUMBER){
    return baseUnit.value;
  }
  
  let lValue = null, rValue = null;
  
  if(baseUnit.left !== null){
    lValue = operate(baseUnit.left);
  }
  if(baseUnit.right !== null){
    rValue = operate(baseUnit.right);
  }
  
  let result = 0;
  switch(baseUnit.value){
    case operations.ADDI: result = lValue+rValue; break;
    case operations.SUBS: result = lValue-rValue; break;
    case operations.MULT: result = lValue*rValue; break;
    case operations.DIVI: result = lValue/rValue; break;
    default: console.log(baseUnit.value); break;
  }
  
  return result;
}

function getBase(txt){
  let parenthesysDeep = 0;
  
  let currentBase = -1; currentBaseDepth = 1000000;
  let currentOperation = operations.ADDI;
  
  for(let i = txt.length-1; i >= 0; i--){
    let additionOverridePotential = (parenthesysDeep === currentBaseDepth && (currentOperation === operations.DIVI || currentOperation === operations.MULT));
    
    switch(txt[i]){
      case operations.ADDI:
        if(parenthesysDeep < currentBaseDepth || additionOverridePotential) {currentBase = i; currentBaseDepth = parenthesysDeep; currentOperation = operations.ADDI;}
        break;
      case operations.SUBS:
        if(parenthesysDeep < currentBaseDepth || additionOverridePotential) {currentBase = i; currentBaseDepth = parenthesysDeep; currentOperation = operations.SUBS;}
        break;
      case operations.MULT:
        if(parenthesysDeep < currentBaseDepth) {currentBase = i; currentBaseDepth = parenthesysDeep; currentOperation = operations.MULT;}
        break;
      case operations.DIVI:
        if(parenthesysDeep < currentBaseDepth) {currentBase = i; currentBaseDepth = parenthesysDeep; currentOperation = operations.DIVI;}
        break;
      case operations.S_PA: parenthesysDeep--; break;
      case operations.E_PA: parenthesysDeep++; break;
      default: break;
    }    
  }
  
  if(currentBase === -1) return NaN;
  return currentBase;
}
