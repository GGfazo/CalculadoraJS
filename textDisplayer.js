class TextDisplayer{
  constructor(x, y, w, h, backColor, textColor){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.backColor = backColor;
    this.textColor = textColor;
    
    this.txt = "";
  }
  
  insertCharacter(character){
    this.txt += character;
  }
  
  eraseCharacter(){
    this.txt = this.txt.slice(0, -1);
  }
  
  clearText(){
    this.txt = "";
  }
  
  display(){
    fill(this.backColor);
    rect(this.x, this.y, this.w, this.h);
    
    textAlign(RIGHT);
    fill(this.textColor);
    text(this.txt, this.x, this.y, this.w, this.h);
  }
}
