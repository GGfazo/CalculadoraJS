class Button{
  constructor(x, y, size, txt, buttonColor, textColor){
    this.x = x;
    this.y = y;
    this.size = size;
    this.txt = txt;
    this.buttonColor = buttonColor;
    this.textColor = textColor;
  }
  
  isClicked(pX, pY){
    return ((pow(this.x-pX,2)+pow(this.y-pY,2))<=pow(this.size/2,2));
  }
  
  display(){
    fill(this.buttonColor);
    circle(this.x, this.y, this.size);
    
    textAlign(CENTER);
    fill(this.textColor);
    text(this.txt, this.x, this.y)
  }
}
