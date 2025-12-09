
#include <Servo.h>
#include <LiquidCrystal_I2C.h>

Servo servo1;

LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- Ultrasonic Sensor Pins (For detecting garbage) ---
const int trigPin = 11;
const int echoPin = 12;
const int buzzerPin = 7;
const int yellowDryPin = 2;
const int redWetPin = 4;
long duration;
int distance = 0;

// --- Rain Sensor Pin (For detecting wetness) ---
// Connect the ANALOG (A0, A1, etc.) pin from your sensor module
const int rainPin = A0;
int rainValue = 0;      // Stores the raw analog reading (0-1023)
int wetnessPercent = 0; // Stores the calculated percentage (0-100%)
int defaultWetnessPercnetage = 1;
int defaultDistanceCM = 20;

const int swPin = 13;  // Digital pin for the switch
const int xPin = A2;  // Analog pin for X-axis
const int yPin = A1;  // Analog pin for Y-axis

// --- !!! IMPORTANT CALIBRATION REQUIRED !!! ---
// You MUST change these values by testing your new rain sensor!
// Follow the instructions in the guide to find these numbers.
//
// 1. Run this code, open the Serial Monitor (9600 baud).
// 2. See the "Raw Rain Value" when the sensor is COMPLETELY DRY.
//    That is your 'RAIN_SENSOR_DRY_VAL'. (Probably 900-1023).
// 3. Put a few drops of water on the sensor. See the value drop.
//    The lowest value you see is your 'RAIN_SENSOR_WET_VAL'. (Probably 200-500).

const int RAIN_SENSOR_DRY_VAL = 1023; // EXAMPLE VALUE. Change this!
const int RAIN_SENSOR_WET_VAL = 485; // EXAMPLE VALUE. Change this!


// --- Logic & Servo Settings ---
// If the calculated "wetness" is above this percentage,
// it will be sorted as WET waste.
const int WET_WASTE_THRESHOLD_PERCENT = 1;

// The distance (in cm) that triggers the sensor.
// If garbage is closer than this, the sorter activates.


void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(buzzerPin, OUTPUT);

  pinMode(yellowDryPin, OUTPUT);
  pinMode(redWetPin, OUTPUT);

  pinMode(swPin, INPUT_PULLUP);

  servo1.attach(8);
  servo1.write(132); // Start the servo in the neutral (90-degree) position
  Serial.println("Smart Garbage Sorter (Rain Sensor Mod)");
  Serial.println("---");
  Serial.println("Waiting for garbage...");

  lcd.init();
  // Turn on the backlight
  lcd.backlight();
  // Set the cursor to the first column (0) and first row (0)
  lcd.setCursor(0, 0);
  // Print "Hello, World!" on the first line
  lcd.print("Smart Garbage");
}

void loop() {
  // --- 1. CHECK FOR GARBAGE (Ultrasonic Sensor) ---

  // Clear the distance from the last loop
  distance = 0;

  
  int xValue = analogRead(xPin);
  int yValue = analogRead(yPin);
  int swValue = digitalRead(swPin);


// 1. Check if the button is pressed to ENTER settings
if (swValue == 0) {
  delay(50); // Simple debounce

  // 2. Wait for the user to RELEASE the button
  //    This prevents you from immediately exiting the menu.
  while (digitalRead(swPin) == 0) {
    // Do nothing, just wait for release
    delay(10);
  }

  // 3. Use a 'do-while' loop. This always runs at least ONCE.
  do {
    // --- This is your settings menu code ---
    lcd.clear();
    lcd.print("Setting Mode");
    delay(1500);

    lcd.clear();
    lcd.print("Up/Down - Change");
    lcd.setCursor(0, 1);
    lcd.print("Default Wetness");
    delay(2500);
    yValue = analogRead(yPin); // Read value *before* the loop
    while (yValue > 900 || yValue < 200) {
      if (yValue > 900) { // User wants to decrease (Right)
        if (defaultWetnessPercnetage > 0) { // Only allow decreasing if it's ABOVE 10
          defaultWetnessPercnetage--;
        }
      } else if (yValue < 200) { // User wants to increase (Left)
        if (defaultWetnessPercnetage < 100) { // Only allow increasing if it's BELOW 40
          defaultWetnessPercnetage++;
        }
      }
      lcd.clear();
      lcd.print("Default Wetness");
      lcd.setCursor(0, 1);
      lcd.print("Percent: ");
      lcd.print(defaultWetnessPercnetage);
      lcd.print("%");
      delay(250); // Shortened delay for better response
      
      yValue = analogRead(yPin); // *** CRITICAL: Read value *inside* loop to exit
    }

    lcd.clear();
    lcd.print("R/L - Change");
    lcd.setCursor(0, 1);
    lcd.print("Default Distance");
    delay(2500);
    xValue = analogRead(xPin); // Read value *before* the loop
    while (xValue > 900 || xValue < 200) {
      if (xValue > 900) { // User wants to decrease (Right)
        if (defaultDistanceCM > 10) { // Only allow decreasing if it's ABOVE 10
          defaultDistanceCM--;
        }
      } else if (xValue < 200) { // User wants to increase (Left)
        if (defaultDistanceCM < 40) { // Only allow increasing if it's BELOW 40
          defaultDistanceCM++;
        }
      }
      lcd.clear();
      lcd.print("Default Distance:");
      lcd.setCursor(0, 1);
      lcd.print(defaultDistanceCM);
      lcd.print("CM");
      delay(250); // Shortened delay
      
      xValue = analogRead(xPin); // *** CRITICAL: Read value *inside* loop to exit
    }

    // 4. Read the switch value again to check if we should EXIT
    swValue = digitalRead(swPin);

  } while (swValue == 1); // 5. Loop *while* the button is NOT pressed (still 1)
  
  // 6. Wait for the user to release the exit press
  while (digitalRead(swPin) == 0) {
    // Do nothing, just wait for release
    delay(10);
  }

} // End of the main 'if (swValue == 0)' block
  

  // Take 2 readings and average them to reduce errors
  for (int i = 0; i < 2; i++) {
    // Trigger the ultrasonic ping
    digitalWrite(trigPin, LOW);
    delayMicroseconds(3);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(3);
    digitalWrite(trigPin, LOW);

    // Read the echo
    duration = pulseIn(echoPin, HIGH);

    // Calculate distance and add it to the total
    // (This is an accumulating average)
    distance = distance + (duration * 0.034 / 2);
    delay(1);
  }
  distance = distance / 2; // Final average distance

  // --- 2. If garbage is detected, CHECK FOR WETNESS (Rain Sensor) ---
  if (distance < defaultDistanceCM && distance > defaultWetnessPercnetage) {
    Serial.print("Object detected at: ");
    Serial.print(distance);
    Serial.println(" cm. Checking wetness...");
    delay(500); // Pause for 1 second to let the object settle

    // Clear the wetness value from the last loop
    wetnessPercent = 0;

    // Take 3 readings and average them
    for (int i = 0; i < 3; i++) {
      rainValue = analogRead(rainPin);
      rainValue = constrain(rainValue, RAIN_SENSOR_WET_VAL, RAIN_SENSOR_DRY_VAL);
      wetnessPercent = (map(rainValue, RAIN_SENSOR_WET_VAL, RAIN_SENSOR_DRY_VAL, 100, 0))+wetnessPercent;
      delay(50);
    }
    wetnessPercent = wetnessPercent / 3; // Final average percentage

    Serial.print("  ==> Wetness Percent: ");
    Serial.print(wetnessPercent);
    Serial.println("%");


    // --- 4. DECIDE and MOVE SERVO ---
    if (wetnessPercent > WET_WASTE_THRESHOLD_PERCENT) {
      Serial.println("  ==> RESULT: WET Waste");
      servo1.write(200); // Move to WET position
      lcd.clear();
      lcd.print("WET, Wetness");
      lcd.setCursor(0, 1);
      lcd.print("Percent: ");
      lcd.print(wetnessPercent);
      lcd.print("%");
      digitalWrite(redWetPin, HIGH);
      digitalWrite(buzzerPin, HIGH);
      delay(500); // Hold for 3 seconds
      digitalWrite(buzzerPin, LOW);
      delay(500); // Hold for 3 seconds
      digitalWrite(buzzerPin, HIGH);
      delay(500); // Hold for 3 seconds
      digitalWrite(buzzerPin, LOW);
      delay(500);
      digitalWrite(buzzerPin, HIGH);
      delay(500); // Hold for 3 seconds
      digitalWrite(buzzerPin, LOW);
      delay(250); // Hold for 3 seconds
      digitalWrite(buzzerPin, HIGH);
      delay(250); // Hold for 3 seconds
      digitalWrite(buzzerPin, LOW);
      digitalWrite(redWetPin, LOW);
    } else {
      Serial.println("  ==> RESULT: Dry Waste");
      servo1.write(70); // Move to DRY position
      lcd.clear();
      lcd.print("DRY, Wetness");
      lcd.setCursor(0, 1);
      lcd.print("Percent: ");
      lcd.print(wetnessPercent);
      lcd.print("%");
      digitalWrite(yellowDryPin, HIGH);
      digitalWrite(buzzerPin, HIGH);
      delay(3000); // Hold for 3 seconds
      digitalWrite(buzzerPin, LOW);
      digitalWrite(yellowDryPin, LOW);
    }

    // After sorting, return to the neutral position
    servo1.write(130);
    Serial.println("---");
    Serial.println("Waiting for garbage...");

  } // end if (garbage detected)

  // Reset values for the next  loop
  distance = 0;
  wetnessPercent = 0;
  lcd.clear();
  lcd.print("Smart Garbage");
  delay(1000); // Wait 1 second before checking again
}