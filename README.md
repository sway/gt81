![GT81 logo](./public/images/logo.png)

# GT81

This is a web-based version of the workout dashboard you can find in BEAT81 classes. It was built in 2020 during the 2nd lockdown to be used during both online and offline workouts.

Made by [@sway](https://honza.xyz)

## HOW DOES IT WORK

GT81 connects to your heart-rate monitor over Bluetooth to be able to measure your heart rate and calculate the amount of calories burned and grit points earned based on your gender, age, and weight.

All measurement and calculation happens locally and no data is sent anywhere.

You can access it [online](https://gt81.honza.xyz) or clone this repo and run it locally:

```
yarn install
yarn run dev
```

## WHAT DO I NEED?

You will need a laptop, tablet, or phone with a modern browser that supports (Web) Bluetooth, which are currently Chrome, Firefox, and Edge on macOS, Windows, and Android. Sadly, Web Bluetooth is not supported on iOS and iPad OS devices, so there's no way to connect.

You will also need a Bluetooth-enabled heart rate monitor, ideally in the form of a chest strap. It does not really matter which one you get as long as it supports BLE (Bluetooth Low Energy). generic Bluetooth HR monitor. You can get a generic brand one on Amazon for approx. 30 EUR (e.g. [this one](https://www.amazon.de/-/en/Heartbeat-Bluetooth-Runtastic-Endomtom-Monitor/dp/B07DRKYZKM/)).

## HOW DO I START?

Once you've configured your profile, pur your HR monitor on and click on "Connect to device". Pick the device from the list displayed by the browser to pair and connect. The list only includes HR monitors, so the one you see is likely the one you have.

For mac OS users:

> 💁🏻‍♀️ If you don't see any devices you might need to allow access to Bluetooth to your browser in System Preferences → Security & Privacy → Privacy → Bluetooth.

## LICENSE

This work is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1).

This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.
