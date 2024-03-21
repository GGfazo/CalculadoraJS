let mInserts = new Array(17);
let mSpecialButtons = new Array(3);
let mTextDisplayer = new TextDisplayer(50, 40, 300, 50, '#202020', '#40b040');

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(25);
  textFont("Consolas")
  
  let buttonSize = 10+40;
  let offSetX = width/2-2*buttonSize*1.2;
  let offSetY = height/2+buttonSize*1.2;
  
  mInserts[0] = new Button(offSetX, offSetY+buttonSize*1.2, buttonSize, '0', '#d0a080', '#000000');
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      mInserts[i*3+j+1] = new Button(offSetX+j*buttonSize*1.2, offSetY-i*buttonSize*1.2, buttonSize, i*3+j+1, '#d0a080', '#000000');
    }
  }
  
  let symbols = ['+', '-', '*', '/'];
  for(let i = 0; i < 4; i++){
    mInserts[10+i] = new Button(offSetX+3*buttonSize*1.2, offSetY+(i-2)*buttonSize*1.2, buttonSize, symbols[i], '#80a0d0', '#000000');
  }
  
  symbols = ['(', ')'];
  for(let i = 0; i < 2; i++){
    mInserts[14+i] = new Button(offSetX+(i+1)*buttonSize*1.2, offSetY+buttonSize*1.2, buttonSize, symbols[i], '#80a0d0', '#000000');
  }
  
  mInserts[16] = new Button(offSetX+4*buttonSize*1.2, offSetY+1*buttonSize*1.2, buttonSize, ".", '#80a0d0', '#000000');
  
  mSpecialButtons[0] = new Button(offSetX+4*buttonSize*1.2, offSetY-2*buttonSize*1.2, buttonSize, "DEL", '#d02040', '#fff');
  
  mSpecialButtons[1] = new Button(offSetX+4*buttonSize*1.2, offSetY-1*buttonSize*1.2, buttonSize, "CLR", '#d02040', '#fff');
  
  mSpecialButtons[2] = new Button(offSetX+4*buttonSize*1.2, offSetY, buttonSize, "=", '#d02040', '#fff');
  
  let test = "(((2+3))+2)+3";
  
  console.log(depurate(test));
  mTextDisplayer.insertCharacter(test);
}

function draw() {
  background(120, 120, 120);

  mTextDisplayer.display();
  
  for(let button of mInserts){
    button.display();
  }
  
  for(let button of mSpecialButtons){
    button.display();
  }
}

function mouseClicked(){
  for(let button of mInserts){
    if(button.isClicked(mouseX, mouseY)){
      mTextDisplayer.insertCharacter(button.txt);
      break;
    }
  }
  
  for(let button of mSpecialButtons){
    if(button.isClicked(mouseX, mouseY)){
      if(button.txt === "DEL"){
        mTextDisplayer.eraseCharacter();
      } else if (button.txt === "CLR"){
        mTextDisplayer.clearText();        
      } else if (button.txt === "="){
        
        let error = checkErrors(mTextDisplayer.txt);
        if(error !== 0){
          prompt("ERROR: "+error);
        } else {
          mTextDisplayer.txt = ''+getNumberFromOperation(mTextDisplayer.txt);
        }
      }
      
      break;
    }
  }
}

function checkErrors(txt){
  let parenthesys = 0;
  for(let i = 0; i < txt.length; i++){
    if(txt[i] === '('){
      parenthesys++;
    }
    else if(txt[i] === ')'){
      parenthesys--;
    }
  }
  
  if(parenthesys !== 0) return "Falta paréntesis";
  else return 0;
}
