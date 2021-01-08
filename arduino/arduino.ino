//String command;       // String to read serial

const short whiteButtonPin = 2;
const short yellowButtonPin = 4;
const short greenButtonPin = 6;
const short blueButtonPin = 8;
const short redButtonPin = 10;

bool writed = false;
bool isUsed = false;

void setup() {
    // Activate Serial
    Serial.begin(9600);
    // Pin Setup
    pinMode(whiteButtonPin, INPUT_PULLUP);
    pinMode(yellowButtonPin, INPUT_PULLUP);
    pinMode(greenButtonPin, INPUT_PULLUP);
    pinMode(blueButtonPin, INPUT_PULLUP);
    pinMode(redButtonPin, INPUT_PULLUP);
}
 
void loop() {
  // Read from UE4
  /*if(Serial.available()){
    //TODO
  }*/

  if(digitalRead(whiteButtonPin) == HIGH){
    isUsed == true;
    SendInfo("WhitePressed");
  }else if (digitalRead(yellowButtonPin) == HIGH) {
    isUsed == true;
    SendInfo("YellowPressed");
  }else if (digitalRead(greenButtonPin) == HIGH) {
    isUsed == true;
    SendInfo("GreenPressed");
  }else if (digitalRead(blueButtonPin) == HIGH) {
    isUsed == true;
    SendInfo("BluePressed");
  }else if (digitalRead(redButtonPin) == HIGH) {
    isUsed == true;
    SendInfo("RedPressed");
  }else{
    isUsed = false;
    writed = false;
  }
}

void SendInfo(String msg)
{
  // Write in Serial
  if (isUsed != writed){
    Serial.println(msg);
    writed = true;
  }
}
