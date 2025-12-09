
int led1 = 11;
int led2 = 12;
int led3 = 13;
char state;

void setup() {
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  Serial.begin(9600); 
}

void loop() {
  state = Serial.read();

  if (state == 'f') {
    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);
    digitalWrite(led3, LOW);
    Serial.println("LED: off");
  }

  else if (state == 'n') {
    digitalWrite(led1, HIGH);
    digitalWrite(led2, HIGH);
    digitalWrite(led3, HIGH);
    Serial.println("LED: on");
  }
}