/*
  Smart Garbage Sorter with IR Remote Menu

  This code replaces the joystick menu with a
  multi-level IR remote-controlled menu.

  Hardware Changes:
  - REMOVED: Joystick on A1, A2, D13
  - ADDED: IR Receiver on Digital Pin 2
*/

// --- Include Libraries ---
#include <Servo.h>
#include <LiquidCrystal_I2C.h>
#include <IRremote.hpp> // <-- You MUST install this library (v4.0 or newer)

// --- Hardware Definitions ---
LiquidCrystal_I2C lcd(0x27, 20, 4); // <-- CHANGED to 20x4
Servo servo1;

// --- IR Remote ---
const int IR_RECEIVE_PIN = 6; // CHANGED to pin 6
// The new library (IRremote.hpp) uses a static class, so these are no longer needed:
// IRrecv irrecv(IR_RECEIVE_PIN);
// decode_results results;
static unsigned long lastValidCode = 0; // For button-hold repeats

// --- Your Remote's Button Codes ---
// I've defined your hex codes here
const unsigned long BTN_SETTINGS = 0xBA45FF00;
const unsigned long BTN_OK       = 0xBF40FF00;
const unsigned long BTN_UP       = 0xB946FF00;
const unsigned long BTN_DOWN     = 0xEA15FF00;
const unsigned long BTN_RIGHT    = 0xBC43FF00;
const unsigned long BTN_LEFT     = 0xBB44FF00;
const unsigned long BTN_EXIT     = 0xF807FF00;

// --- Ultrasonic Sensor Pins ---
const int trigPin = 11;
const int echoPin = 12;
long duration;
int distance = 0;

// --- Rain Sensor Pin ---
const int rainPin = A0;

// --- Output Pins ---
const int buzzerPin = 7;
const int yellowDryPin = 3; // Changed to 3, as 2 is now for IR
const int redWetPin = 4;

// --- !!! IMPORTANT CALIBRATION REQUIRED !!! ---
// You MUST change these values by testing your new rain sensor!
const int RAIN_SENSOR_DRY_VAL = 1023; // EXAMPLE VALUE. Change this!
const int RAIN_SENSOR_WET_VAL = 485;  // EXAMPLE VALUE. Change this!

// --- Settings Variables (Managed by the Menu) ---
int defaultDistanceCM = 15;     // Starting distance
int wetnessThreshold = 5;       // Starting wetness threshold (5%)
bool buzzerEnabled = true;      // Buzzer is ON by default

// --- Menu State Machine Variables ---
bool inSettingsMode = false;    // Are we in the menu?
int menuState = 0;              // 0=Main Menu, 1=Set Dist, 2=Set Wet, 3=Set Buzz
int selectedMenuItem = 1;       // Which main menu item is selected (1, 2, or 3)
unsigned long lastSorterCheck = 0; // For non-blocking delay


void setup() {
  Serial.begin(9600);

  // Start IR Receiver
  // Note: Serial.begin() MUST be called first
  // This is the new way to start the receiver (IRremote.hpp)
  IrReceiver.begin(IR_RECEIVE_PIN, false); // Start receiver, no LED feedback

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(buzzerPin, OUTPUT);
  pinMode(yellowDryPin, OUTPUT);
  pinMode(redWetPin, OUTPUT);

  servo1.attach(8);
  servo1.write(132); // Neutral position

  Serial.println("Smart Garbage Sorter (IR Remote Mod)");
  Serial.println("---");

  lcd.init();
  lcd.backlight();
  // --- UPDATED for 20x4 ---
  lcd.print("Smart Garbage Sorter"); // Use the full width
  lcd.setCursor(0, 1);
  lcd.print("--------------------");
  lcd.setCursor(0, 3);
  lcd.print("Waiting...");
}

void loop() {
  // --- 1. ALWAYS Check for IR Input ---
  unsigned long irValue = 0;
  if (IrReceiver.decode()) {
    // Check for repeats (new method)
    if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) {
      irValue = lastValidCode; // Use last code if it's a repeat
    } else {
      // Check for a valid, non-zero code
      // (new field: decodedRawData)
      if (IrReceiver.decodedIRData.decodedRawData != 0) {
        irValue = IrReceiver.decodedIRData.decodedRawData;
        lastValidCode = irValue; // Store this new, valid code
      }
    }
    IrReceiver.resume(); // Ready for the next signal
  }

  // --- 2. Check for Global "Settings" or "Exit" buttons ---
  if (irValue == BTN_SETTINGS) {
    inSettingsMode = true;
    menuState = 0;        // Go to main menu
    selectedMenuItem = 1; // Reset selection
    irValue = 0;          // Clear value so it's not processed again
    updateMenuDisplay();  // Show the menu immediately
  }

  if (irValue == BTN_EXIT) {
    inSettingsMode = false;
    menuState = 0;
    irValue = 0;
    // Show main "Smart Garbage" screen
    lcd.clear();
    lcd.print("Smart Garbage Sorter");
    lcd.setCursor(0, 1);
    lcd.print("--------------------");
    lcd.setCursor(0, 3);
    lcd.print("Waiting...");
  }

  // --- 3. Main State Machine ---
  if (inSettingsMode) {
    // We are in the menu. Handle menu logic.
    handleMenu(irValue);
  } else {
    // We are NOT in the menu. Run normal sorter logic.
    runSorterLogic();
  }
}

/**
   Handles all menu navigation and value changes
*/
void handleMenu(unsigned long irValue) {
  if (irValue == 0) return; // No new button press, do nothing

  bool menuChanged = false; // Flag to redraw the LCD

  switch (menuState) {
    // --- Case 0: Main Menu Navigation ---
    case 0:
      if (irValue == BTN_UP) {
        selectedMenuItem--;
        if (selectedMenuItem < 1) selectedMenuItem = 3; // Wrap around
        menuChanged = true;
      }
      else if (irValue == BTN_DOWN) {
        selectedMenuItem++;
        if (selectedMenuItem > 3) selectedMenuItem = 1; // Wrap around
        menuChanged = true;
      }
      else if (irValue == BTN_OK) {
        menuState = selectedMenuItem; // Go to the selected submenu
        menuChanged = true;
      }
      break;

    // --- Case 1: Set Distance ---
    case 1:
      if (irValue == BTN_RIGHT) { // Cycle 15 -> 30 -> 40 -> 15
        if (defaultDistanceCM == 15) defaultDistanceCM = 30;
        else if (defaultDistanceCM == 30) defaultDistanceCM = 40;
        else defaultDistanceCM = 15;
        menuChanged = true;
      }
      else if (irValue == BTN_LEFT) { // Cycle 15 -> 40 -> 30 -> 15
        if (defaultDistanceCM == 15) defaultDistanceCM = 40;
        else if (defaultDistanceCM == 40) defaultDistanceCM = 30;
        else defaultDistanceCM = 15;
        menuChanged = true;
      }
      else if (irValue == BTN_OK) {
        menuState = 0; // Go back to main menu
        menuChanged = true;
      }
      break;

    // --- Case 2: Set Wetness Threshold ---
    case 2:
      if (irValue == BTN_RIGHT) {
        wetnessThreshold += 5; // Increase by 5
        if (wetnessThreshold > 100) wetnessThreshold = 100; // Max 100
        menuChanged = true;
      }
      else if (irValue == BTN_LEFT) {
        wetnessThreshold -= 5; // Decrease by 5
        if (wetnessThreshold < 0) wetnessThreshold = 0; // Min 0
        menuChanged = true;
      }
      else if (irValue == BTN_OK) {
        menuState = 0; // Go back to main menu
        menuChanged = true;
      }
      break;

    // --- Case 3: Set Buzzer On/Off ---
    case 3:
      if (irValue == BTN_LEFT || irValue == BTN_RIGHT) {
        buzzerEnabled = !buzzerEnabled; // Toggle true/false
        menuChanged = true;
      }
      else if (irValue == BTN_OK) {
        menuState = 0; // Go back to main menu
        menuChanged = true;
      }
      break;
  }

  // If any value changed, update the LCD
  if (menuChanged) {
    updateMenuDisplay();
  }
}

/**
   Redraws the LCD screen based on the current menu state
*/
void updateMenuDisplay() {
  lcd.clear();
  switch (menuState) {
    case 0: // Main Menu
      // --- UPDATED for 20x4 ---
      lcd.print("--- Main Menu ---");
      lcd.setCursor(0, 1);
      lcd.print(selectedMenuItem == 1 ? "> Set Distance" : "  Set Distance");
      lcd.setCursor(0, 2);
      lcd.print(selectedMenuItem == 2 ? "> Set Wetness" : "  Set Wetness");
      lcd.setCursor(0, 3);
      lcd.print(selectedMenuItem == 3 ? "> Set Buzzer" : "  Set Buzzer");
      break;
    case 1: // Set Distance
      // --- UPDATED for 20x4 ---
      lcd.print("1. Set Distance (cm)");
      lcd.setCursor(0, 1);
      lcd.print("--------------------");
      lcd.setCursor(0, 2);
      lcd.print("   <  [ ");
      lcd.print(defaultDistanceCM);
      lcd.print("cm ]  >   ");
      lcd.setCursor(0, 3);
      lcd.print("Press OK to save");
      break;
    case 2: // Set Wetness
      // --- UPDATED for 20x4 ---
      lcd.print("2. Set Wetness (%)");
      lcd.setCursor(0, 1);
      lcd.print("--------------------");
      lcd.setCursor(0, 2);
      lcd.print("   <  [ ");
      // Pad the number to stop flicker/messy text
      if (wetnessThreshold < 100) lcd.print(" ");
      if (wetnessThreshold < 10) lcd.print(" ");
      lcd.print(wetnessThreshold);
      lcd.print("% ]  >   ");
      lcd.setCursor(0, 3);
      lcd.print("Press OK to save");
      break;
    case 3: // Set Buzzer
      // --- UPDATED for 20x4 ---
      lcd.print("3. Set Buzzer");
      lcd.setCursor(0, 1);
      lcd.print("--------------------");
      lcd.setCursor(0, 2);
      lcd.print("   <  [ ");
      lcd.print(buzzerEnabled ? "ON " : "OFF"); // Padded "ON "
      lcd.print(" ]  >   ");
      lcd.setCursor(0, 3);
      lcd.print("Press OK to save");
      break;
  }
}

/**
   This function contains your ORIGINAL sorter logic.
   It runs when the code is NOT in settings mode.
*/
void runSorterLogic() {
  // This "if" statement replaces the delay(1000) at the end of your
  // old loop. This makes the IR remote responsive.
  if (millis() - lastSorterCheck < 250) {
    return; // Not time to check yet
  }
  lastSorterCheck = millis(); // Reset the check timer

  // --- 1. CHECK FOR GARBAGE (Ultrasonic Sensor) ---
  distance = 0; // Clear the distance
  for (int i = 0; i < 2; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(3);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(3);
    digitalWrite(trigPin, LOW);

    // Add a timeout of 50,000us (50ms) to pulseIn()
    // This stops it from blocking for 1 second
    // and makes the IR remote feel responsive.
    duration = pulseIn(echoPin, HIGH, 50000); // <-- THIS LINE IS CHANGED

    distance = distance + (duration * 0.034 / 2);
    delay(1);
  }
  distance = distance / 2; // Final average distance

  // --- 2. If garbage is detected, CHECK FOR WETNESS ---
  // (I fixed the bug here: "distance > 1" is safer than your old check)
  if (distance < defaultDistanceCM && distance > 1) {
    Serial.print("Object detected at: ");
    Serial.print(distance);
    Serial.println(" cm. Checking wetness...");
    delay(500); // Pause for object to settle

    int wetnessPercent = 0;
    int rainValue = 0;
    for (int i = 0; i < 3; i++) {
      rainValue = analogRead(rainPin);
      rainValue = constrain(rainValue, RAIN_SENSOR_WET_VAL, RAIN_SENSOR_DRY_VAL);
      wetnessPercent = (map(rainValue, RAIN_SENSOR_WET_VAL, RAIN_SENSOR_DRY_VAL, 100, 0)) + wetnessPercent;
      delay(50);
    }
    wetnessPercent = wetnessPercent / 3; // Final average percentage

    Serial.print("  ==> Wetness Percent: ");
    Serial.print(wetnessPercent);
    Serial.println("%");


    // --- 4. DECIDE and MOVE SERVO ---
    // (FIXED: Now uses the 'wetnessThreshold' from the menu)
    if (wetnessPercent > wetnessThreshold) {
      Serial.println("  ==> RESULT: WET Waste");
      servo1.write(200); // Move to WET position
      // --- UPDATED for 20x4 ---
      lcd.clear();
      lcd.print("!! WET WASTE !!");
      lcd.setCursor(0, 1);
      lcd.print("--------------------");
      lcd.setCursor(0, 2);
      lcd.print("Wetness: ");
      lcd.print(wetnessPercent);
      lcd.print("%");
      lcd.setCursor(0, 3);
      lcd.print("(Threshold: ");
      lcd.print(wetnessThreshold);
      lcd.print("%)");

      // (FIXED: Buzzer logic now checks if it's enabled)
      if (buzzerEnabled) {
        digitalWrite(buzzerPin, HIGH);
        delay(500);
        digitalWrite(buzzerPin, LOW);
        delay(500);
        digitalWrite(buzzerPin, HIGH);
        delay(500);
        digitalWrite(buzzerPin, LOW);
        delay(500);
        digitalWrite(buzzerPin, HIGH);
        delay(500);
        digitalWrite(buzzerPin, LOW);
        delay(250);
        digitalWrite(buzzerPin, HIGH);
        delay(250);
        digitalWrite(buzzerPin, LOW);
      } else {
        delay(3000); // Wait 3 sec even if buzzer is off
      }
      digitalWrite(redWetPin, LOW);

    } else {
      Serial.println("  ==> RESULT: Dry Waste");
      servo1.write(70); // Move to DRY position
      // --- UPDATED for 20x4 ---
      lcd.clear();
      lcd.print("!! DRY WASTE !!");
      lcd.setCursor(0, 1);
      lcd.print("--------------------");
      lcd.setCursor(0, 2);
      lcd.print("Wetness: ");
      lcd.print(wetnessPercent);
      lcd.print("%");
      lcd.setCursor(0, 3);
      lcd.print("(Threshold: ");
      lcd.print(wetnessThreshold);
      lcd.print("%)");

      if (buzzerEnabled) {
        digitalWrite(buzzerPin, HIGH);
        delay(3000); // Hold for 3 seconds
        digitalWrite(buzzerPin, LOW);
      } else {
        delay(3000); // Wait 3 sec even if buzzer is off
      }
      digitalWrite(yellowDryPin, LOW);
    }

    // After sorting, return to the neutral position
    servo1.write(130);
    Serial.println("---");
    Serial.println("Waiting for garbage...");

    // Reset LCD to main screen
    // --- UPDATED for 20x4 ---
    lcd.clear();
    lcd.print("Smart Garbage Sorter");
    lcd.setCursor(0, 1);
    lcd.print("--------------------");
    lcd.setCursor(0, 3);
    lcd.print("Waiting...");

  } else {
    // This makes sure the "Waiting..." message stays on screen
    // if no garbage is found.
    // --- UPDATED for 20x4 ---
    lcd.setCursor(0, 0);
    lcd.print("Smart Garbage Sorter"); // Keep title
    lcd.setCursor(0, 1);
    lcd.print("--------------------");
    lcd.setCursor(0, 2);
    lcd.print("                    "); // Clear 3rd row
    lcd.setCursor(0, 3);
    lcd.print("Waiting...          "); // Clear 4th row
  }
}