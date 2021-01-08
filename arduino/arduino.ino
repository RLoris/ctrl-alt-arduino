// Variables globales
String command;       // Chaine de caractères utilisée dans la communication Unreal vers Arduino

int whiteButtonState = 0;
int yellowButtonState = 0;
int greenButtonState = 0;
int blueButtonState = 0;
int redButtonState = 0; 

/*
const short whiteLedPin = 2;
const short yellowLedPin = 3;
const short greenLedPin = 4;
const short blueLedPin = 5;
const short redLedPin = 6;
*/

const short whiteButtonPin = 2;
const short yellowButtonPin = 4;
const short greenButtonPin = 6;
const short blueButtonPin = 8;
const short redButtonPin = 10;

void setup() {
    // Activation du Serial
    Serial.begin(9600);
    // Parametrage des pins
    // LEDs 
/*    pinMode(whiteLedPin, OUTPUT); 
    pinMode(yellowLedPin, OUTPUT);
    pinMode(greenLedPin, OUTPUT);
    pinMode(blueLedPin, OUTPUT);
    pinMode(redLedPin, OUTPUT); */

    // Buttons
    pinMode(whiteButtonPin, INPUT_PULLUP);
    pinMode(yellowButtonPin, INPUT_PULLUP);
    pinMode(greenButtonPin, INPUT_PULLUP);
    pinMode(blueButtonPin, INPUT_PULLUP);
    pinMode(redButtonPin, INPUT_PULLUP);
}
 
void loop() {
  // Partie gestion de la LED
  if(Serial.available()){
    /* On insére dans la chaine de caractère "command" le contenu du Serial en lisant sa dernière ligne d'instruction
      command = Serial.readStringUntil('\n');
      // On teste la chaine de caractère pour voir si elle correspond à un cas géré
      if(command.equals("SwitchOnLED")){
        // On lance la fonction Arduino correspondant à la commande reçue
          SwitchOnLED();
      }
      else if(command.equals("SwitchOffLED")){
        // On lance la fonction Arduino correspondant à la commande reçue
          SwitchOffLED();
      }
      else{
        // Si le Serial contient une ligne d'instruction ne correspondant à aucune commande prévue, on affiche un message d'erreur
          Serial.println("Invalid command");
      }*/
  }

  // On teste cette valeur pour savoir si le bouton est pressé ou non
  whiteButtonState = digitalRead(whiteButtonPin);
  if(whiteButtonState == HIGH)
  {
    SendInfo("WhitePressed");
  }
  else if (digitalRead(yellowButtonPin) == HIGH) {
    SendInfo("YellowPressed");
  }
  else if (digitalRead(greenButtonPin) == HIGH) {
    SendInfo("GreenPressed");
  }
  else if (digitalRead(blueButtonPin) == HIGH) {
    SendInfo("BluePressed");
  }
  else if (digitalRead(redButtonPin) == HIGH) {
    SendInfo("RedPressed");
  }
  else{
    SendInfo("NothingPressed");
  }
}

void SendInfo(String msg)
{
  // On insére dans le Serial la chaine de caractère reçue, elle sera lue dans Unreal
  Serial.println(msg);
}
/*
void SwitchOnLED(int color)
{
  // Switch specified led on
  switch (color) {
    case 0: digitalWrite(whiteLedPin, HIGH);
      break;
     case 1: digitalWrite(yellowLedPin, HIGH);
      break;
     case 2: digitalWrite(greenLedPin, HIGH);
      break;
     case 3: digitalWrite(blueLedPin, HIGH);
      break;
     case 4: digitalWrite(redLedPin, HIGH);
      break;
    default: return;
  }

  // Pour debug éventuel, on affiche dans le Serial une ligne décrivant l'action de la fonction
  Serial.println("Switch On LED");
}

void SwitchOffLED(int color)
{
  switch (color) {
    case 0: digitalWrite(whiteLedPin, LOW);
      break;
     case 1: digitalWrite(yellowLedPin, LOW);
      break;
     case 2: digitalWrite(greenLedPin, LOW);
      break;
     case 3: digitalWrite(blueLedPin, LOW);
      break;
     case 4: digitalWrite(redLedPin, LOW);
      break;
    default: return;
  }

  // Pour debug éventuel, on affiche dans le Serial une ligne décrivant l'action de la fonction
  Serial.println("Switch Off LED");
  // Switch specified led off
}

int GetColor(String color) {
  if (color == "white"){
    return 0;
  } 
  if (color == "yellow") {
    return 1;
  }
  if (color == "green") {
    return 2;
  }
  if (color == "blue") {
    return 3;
  }
  if (color == "red") {
    return 4;
  }
  return -1;
}
*/
