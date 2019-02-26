# Group Clock

A clock app, but includes a folder structure to organize different alarms and and activate multiple at the same time.

## Installation

To install with yarn (a little better package manager), run `npm i -g yarn` before running anything else

Install by running `yarn` or `npm install`.

If you create an expo account on www.expo.io and login with `expo login`, then you can see projects that you run even without scanning the QR code. You probably want to install with `npm i -g expo-cli` to call expo from the command line.

`yarn run start` or `npm run start` to run the expo app, which requires the expo client app on a mobile device or an emulator. This may not work if on the school server, so open up http://localhost:19002 and change the bottom right part to a tunnel instead of lan. Before, it worked for me, but if it fails, a tunnel will be slower but guaranteed work.

## Features

Clock app allowing users to set multiple of each component and group them together in a more logical fashion. Each group can be activated at the same time or individually.

Basic navigation controlled by the bottom tab.

Navigate to deeper group by tapping group.\
Top right + icon to add new group or item.\
Edit and delete items by sliding to the left.

### Alarm

Groups have a timezone set where all alarms run on that timezone.

Alarms can be set to a value and repeat for any days of the week.

### Stopwatch

Pressing the right button will start and pause the stopwatch.\
Pressing the left button when stopwatch is running will create a lap, and when it is paused, it will reset it.

### Timer

Pressing the right button will start and pause the timer.\
Pressing the left button will reset the it

### Settings

* Login/Logout
* Theme
* Timezone
* Precision
* Persistence
* Payment
* Reset All & Parts

## TODO

### Intermediate

* Group control restyling
* Colored items based on selected
* Disable buttons based on content
* Individual part screens
* Home screen

### Advanced

* Login
	* authorize (Expo Google, AuthSession)
	* database (Firebase, MongoDB)
* Payment (Expo Payments)
* Improved persist
* Dark theme
* Initial help
* Individual themed groups

## License

[MIT](LICENSE)