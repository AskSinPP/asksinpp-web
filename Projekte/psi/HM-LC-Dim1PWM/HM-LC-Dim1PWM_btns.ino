//- -----------------------------------------------------------------------------------------------------------------------
// AskSin++
// 2016-10-31 papa Creative Commons - http://creativecommons.org/licenses/by-nc-sa/3.0/de/
//- -----------------------------------------------------------------------------------------------------------------------

// define this to read the device id, serial and device type from bootloader section
// #define USE_OTA_BOOTLOADER

#define EI_NOTEXTERNAL
#include <EnableInterrupt.h>
#include <AskSinPP.h>
#include <LowPower.h>

#include <Dimmer.h>


// We use a Pro Mini
// PIN for Status LED
#define LED_PIN 4
// PIN for ConfigToggleButton
#define CONFIG_BUTTON_PIN 8
// PIN for LED MOSFET
#define DIMMER_PIN 3
// PINs for external Buttons
#define BTN1_PIN 7
#define BTN2_PIN 9

// number of available peers per channel
#define PEERS_PER_CHANNEL 4

// all library classes are placed in the namespace 'as'
using namespace as;

// define all device properties
const struct DeviceInfo PROGMEM devinfo = {
    {0x11,0x12,0x48},       // Device ID
    "PsiDim1248",           // Device Serial
    {0x00,0x67},            // Device Model
    0x29,                   // Firmware Version
    as::DeviceType::Dimmer, // Device Type
    {0x01,0x00}             // Info Bytes
};

/**
 * Configure the used hardware
 */
typedef AvrSPI<10,11,12,13> SPIType;
typedef Radio<SPIType,2> RadioType;
typedef StatusLed<LED_PIN> LedType;
typedef AskSin<LedType,NoBattery,RadioType> HalType;
typedef DimmerChannel<HalType,PEERS_PER_CHANNEL> ChannelType;
typedef DimmerDevice<HalType,ChannelType,3,3,PWM8<> > DimmerType;

HalType hal;
DimmerType sdev(devinfo,0x20);
ConfigToggleButton<DimmerType> cfgBtn(sdev);
InternalButton<DimmerType> btn1(sdev, 4);
InternalButton<DimmerType> btn2(sdev, 5);

void setup () {
  DINIT(57600,ASKSIN_PLUS_PLUS_IDENTIFIER);
  if( sdev.init(hal,DIMMER_PIN) ) {
    // first init - setup connection between buttons and first channel
    sdev.channel(1).peer(cfgBtn.peer());
    sdev.channel(1).peer(btn1.peer());
    sdev.channel(1).peer(btn2.peer());
  }
  // Init the hw buttons
  buttonISR(cfgBtn,CONFIG_BUTTON_PIN);
  buttonISR(btn1, BTN1_PIN);
  buttonISR(btn2, BTN2_PIN);

  sdev.initDone();

  // Output ID and Serial in serial console
  DDEVINFO(sdev);
}

void loop() {
  hal.runready();
  sdev.pollRadio();
}
