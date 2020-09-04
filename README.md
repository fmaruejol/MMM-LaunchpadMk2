# MMM-LaunchpadMk2

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) smart mirror project.

This module allows you to bind buttons of [Launchpad Mk2](https://novationmusic.com/en/launch/launchpad-mk2) to global notifications.

## Example (if you choose to show something)
![Example of MMM-LaunchpadMk2 (no bindings)](images/sample-no-bindings.png?raw=true "Example screenshot (no bindings)")
![Example of MMM-LaunchpadMk2 (with bindings)](images/sample-with-bindings.png?raw=true "Example screenshot (with bindings)")

## Prerequisites

### OSX

* Some version of Xcode (or Command Line Tools)
* Python (for node-gyp)

### Windows

* Microsoft Visual C++ (the Express edition works fine)
* Python (for node-gyp)

### Linux

* A C++ compiler
* You must have installed and configured ALSA. Without it this module will **NOT** build.
* Install the libasound2-dev package.
* Python (for node-gyp)

## Installation

To install the module, use your terminal to:
1. Navigate to your MagicMirror's modules folder. If you are using the default installation directory, use the command:<br>`cd ~/MagicMirror/modules`
2. Copy the module to your computer by executing the following command:<br>`git clone https://github.com/fmaruejol/MMM-LaunchpadMk2.git`

## Using the module

### MagicMirror² Configuration

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        ...
        {
            module: "MMM-Launchpad",
            position: "top_left",
            config: {
                show: true,
                inPort: 0,
                outPort: 1,
                bindings: [
                      {
                        button: 89,
                        color: 70,
                        notification: "LAUNCHPAD_TOGGLE_MODE",
                        payload: null
                      },
                      {
                        button: 110,
                        color: 10,
                        notification: "LAUNCHPAD_DARKEN_ALL",
                        payload: null
                      },
                      {
                        button: 111,
                        color: 10,
                        notification: "LAUNCHPAD_SET_COLORS",
                        payload: null
                      }
                ]
            }
        },
        ...
    ]
}
```

### Configuration Options

| Option     | Details                                                                                                                                         |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `show`     | *Optional* - Display an HTML representation of the Launchpad. <br>**Type:** `boolean`<br>**Default:** `false`                                   |
| `debug`    | *Optional* - Enable debug mode. <br>**Type:** `boolean`<br>**Default:** `false`                                                                 |
| `virtual`  | *Optional* - Emulate a Launchpad even if you haven't one.<br>**Type:** `boolean`<br>**Default:** `false`                                        |
| `size`     | *Optional* - Size of the HTML representation <br>**Type:** `string`<br>**Default:** `"medium"`<br>**Options:** `"small"`, `"medium"`, `"large"` |
| `inPort`   | *Optional* - The midi input port the Launchpad use. <br>**Type:** `number`<br>**Default:** `0`                                                                    |
| `outPort`  | *Optional* - The midi output port the Launchpad use. <br>**Type:** `number`<br>**Default:** `0`                                                                     |
| `bindings` | *Optional* - An array of [bindings options](#binding-options). <br>**Type:** `array`<br>**Default:** `[]`                                       |

### Binding Options

| Option         | Details                                                                                                                        |
|----------------|--------------------------------------------------------------------------------------------------------------------------------|
| `button`       | **Required** - The button where the binding is mapped. <br>**Type:** `number`                                                  |
| `notification` | **Required** - The notification id to bind. <br>**Type:** `string`<br>                                                         |
| `payload`      | *Optional* - The notification payload.<br>**Type:** `boolean`<br>**Default:** `undefined`                                      |
| `color`        | *Optional* - Color of the button (between 0 and 127, [colors table here](images/launchpad-colors.png)). <br>**Type:** `number` |
| `mode`         | *Optional* - Mode of button. <br>**Type:** `string`<br>**Default:** `static`<br>**Options:** `"static"`, `"pulse"`, `"flash"`  |

### Special bind

| Notification            | Effect                                                                                                                                                                                                                                                                       |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `LAUNCHPAD_TOGGLE_MODE` | Change mode between `NOTIFICATION` and `DESCRIPTION`. <br>In `NOTIFICATION` mode, notification are dispatched normally. <br>In `DESCRIPTION` mode an alert with the binding is opened ([alert](https://docs.magicmirror.builders/modules/alert.html) module should be enabled). |
| `LAUNCHPAD_DARKEN_ALL`  | Switch off all buttons (even the configured ones).                                                                                                                                                                                                                           |
| `LAUNCHPAD_SET_COLORS`  | Switch on all buttons switched off by `LAUNCHPAD_DARKEN_ALL` notification.                                                                                                                                                                                                   |


## Special Thanks

* [Michael Teeuw](https://github.com/MichMich) for inspiring me and many others to build a MagicMirror module.
* The community of magicmirror.builders for help in the development process and all contributors for finding and fixing errors in this module.
