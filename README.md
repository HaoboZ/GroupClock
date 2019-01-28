# Group Clock

A clock app, but includes a folder structure to organize different alarms and and activate multiple at the same time.

## Installation

Install via `yarn` or `npm install`.

`yarn run start` or `npm run start` to run the expo app, which requires the expo client app on a mobile device or an emulator.

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

### Basic

* Restyle button text to icons

### Intermediate

* Reformat
	* move onPress arrow functions outside
	* styling
* Group control restyling
* Colored items based on selected
* Timer chain disable buttons
* Individual part screens

### Advanced

* Login
	* authorize (Expo Google, AuthSession)
	* database (Firebase, MongoDB)
* Payment (Expo Payments)
* Dark theme
* Initial help
* Individual themed groups

## License

[MIT](LICENSE)