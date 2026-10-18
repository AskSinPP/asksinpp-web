// AskSin++: 2016-10-31 papa; BME280 example: 2019-10-02 jp112sdl.
// Original: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/c0ad384c66a8e4887f4cacc591af5d3b88167886/examples/HM-WDS40-TH-I-BME280/HM-WDS40-TH-I-BME280.ino
// Original and this adapted sketch: CC BY-NC-SA 3.0 Germany.
// https://creativecommons.org/licenses/by-nc-sa/3.0/de/
// Tutorial adaptation, 2026: stable 3.3 V supply, NoBattery, no LCD,
// explicit BME280 address and normal mode, checked floating-point readings,
// bounded Wire transfers and retry on the next measurement interval.
// Compile-checked for arduino:avr:pro:cpu=8MHzatmega328; not hardware-tested.

#define EI_NOTEXTERNAL
#include <EnableInterrupt.h>
#include <AskSinPP.h>
#include <LowPower.h>
#include <MultiChannelDevice.h>
#include <Wire.h>
#include <BME280I2C.h>
#include <math.h>

#define LED_PIN 4
#define CONFIG_BUTTON_PIN 8
#define PEERS_PER_CHANNEL 6
#define MSG_INTERVAL 180UL

using namespace as;

// Illustrative identity only: choose unused ID and serial before pairing.
const DeviceInfo PROGMEM devinfo = {
  {0xA1, 0xB2, 0xC3},
  "ASBME00001",
  {0x00, 0x3F},
  0x10,
  as::DeviceType::THSensor,
  {0x01, 0x00}
};

typedef AvrSPI<10, 11, 12, 13> SPIType;
typedef Radio<SPIType, 2> RadioType;
typedef StatusLed<LED_PIN> LedType;
typedef AskSin<LedType, NoBattery, RadioType> Hal;
Hal hal;

const BME280I2C::Settings sensorSettings(
  BME280::OSR_X1, BME280::OSR_X1, BME280::OSR_X1,
  BME280::Mode_Normal, BME280::StandbyTime_1000ms,
  BME280::Filter_Off, BME280::SpiEnable_False,
  BME280I2C::I2CAddr_0x76
);

class WeatherEventMsg : public Message {
public:
  void init(uint8_t count, int16_t temperature, uint8_t humidity, bool low) {
    const uint16_t raw = static_cast<uint16_t>(temperature);
    uint8_t high = (raw >> 8) & 0x7F;
    if (low) high |= 0x80;
    Message::init(0x0C, count, 0x70, BIDI | WKMEUP, high, raw & 0xFF);
    pload[0] = humidity;
  }
};

class WeatherChannel
    : public Channel<Hal, List1, EmptyList, List4, PEERS_PER_CHANNEL, List0>,
      public Alarm {
  BME280I2C sensor_;
  bool sensorReady_;
  WeatherEventMsg message_;

  bool connectSensor() {
    Wire.clearWireTimeoutFlag();
    sensorReady_ = sensor_.begin();
    sensorReady_ = sensorReady_
        && sensor_.chipModel() == BME280::ChipModel_BME280
        && !Wire.getWireTimeoutFlag();
    if (sensorReady_) {
      // First x1 sample in normal mode; no long interval delay in loop().
      delay(50);
    }
    return sensorReady_;
  }

  bool measure(int16_t& temperature, uint8_t& humidity) {
    if (!sensorReady_ && !connectSensor()) {
      DPRINTLN(F("BME280 fehlt: Adresse, Versorgung und I2C pruefen."));
      return false;
    }

    float pressure, temp, hum;
    Wire.clearWireTimeoutFlag();
    sensor_.read(pressure, temp, hum, BME280::TempUnit_Celsius,
                 BME280::PresUnit_Pa);
    if (Wire.getWireTimeoutFlag() || !isfinite(temp) || !isfinite(hum)
        || temp < -40.0f || temp > 85.0f || hum < 0.0f || hum > 100.0f) {
      sensorReady_ = false;
      DPRINTLN(F("BME280 Lesefehler: kein Messwerttelegramm, spaeter erneut."));
      return false;
    }

    // Convert only after validation: 0.1 degree Celsius and integer % RH.
    temperature = static_cast<int16_t>(lroundf(temp * 10.0f));
    humidity = static_cast<uint8_t>(lroundf(hum));
    DPRINT(F("T=")); DPRINT(temp);
    DPRINT(F(" C, H=")); DPRINT(hum); DPRINTLN(F(" %"));
    return true;
  }

public:
  WeatherChannel()
      : Channel(), Alarm(5), sensor_(sensorSettings), sensorReady_(false) {}

  void setup(Device<Hal, List0>* dev, uint8_t number, uint16_t address) {
    Channel::setup(dev, number, address);
    Wire.begin();
    Wire.setWireTimeout(25000UL, true);  // AVR Core 1.8.6: microseconds.
    sysclock.add(*this);
  }

  void trigger(AlarmClock& clock) override {
    set(seconds2ticks(MSG_INTERVAL));
    clock.add(*this);

    int16_t temperature;
    uint8_t humidity;
    if (!measure(temperature, humidity)) return;

    const uint8_t count = device().nextcount();
    message_.init(count, temperature, humidity, device().battery().low());
    if (count % 20 == 1) {
      device().sendPeerEvent(message_, *this);
    } else {
      device().broadcastEvent(message_, *this);
    }
  }

  uint8_t status() const { return 0; }
  uint8_t flags() const { return 0; }
};

typedef MultiChannelDevice<Hal, WeatherChannel, 1> WeatherType;
WeatherType sdev(devinfo, 0x20);
ConfigButton<WeatherType> cfgBtn(sdev);

void setup() {
  DINIT(57600, ASKSIN_PLUS_PLUS_IDENTIFIER);
  sdev.init(hal);
  buttonISR(cfgBtn, CONFIG_BUTTON_PIN);
  sdev.initDone();
}

void loop() {
  const bool alarmWorked = hal.runready();
  const bool radioWorked = sdev.pollRadio();
  if (!alarmWorked && !radioWorked) {
    hal.activity.savePower<Sleep<>>(hal);
  }
}
