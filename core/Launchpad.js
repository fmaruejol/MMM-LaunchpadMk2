"use strict";

const midi = require("midi");
const events = require("events");

const Button = require("./Button");

module.exports = class Launchpad extends events.EventEmitter {
  /**
   * Launchpad constructor.
   *
   * @param {object} options
   */
  constructor(options) {
    super();

    const _defaults = {
      inPort: 0,
      outPort: 0,
      virtual: false
    };

    options = Object.assign({}, _defaults, options);

    /**
     * All the buttons on this Launchpad. Get one by using `getButton`.
     * @type {Button[]}
     */
    this._buttons = [];

    if (!options.virtual) {
      this._input = new midi.input();
      this._output = new midi.output();

      this._input.openPort(options.inPort);

      this._input.on("message", (dTime, message) => {
        if (message[0] === 176 || message[0] === 144) {
          if (message[2] > 0) {
            this.emit("press", {
              button: this._buttons[message[1]],
              velocity: message[2]
            });
            this._buttons[message[1]].emit("press", { velocity: message[2] });
          } else {
            this.emit("release", this._buttons[message[1]]);
            this._buttons[message[1]].emit("release");
          }
        }
      });

      this._output.openPort(options.outPort);
    } else {
      this._input = { on: () => {} };
      this._output = {
        sendMessage: (msg) => console.log(`[Launchpad] ${msg}`)
      };
    }

    for (let i = 0; i < 150; i++) {
      this._buttons.push(new Button(this, i));
    }

    this.lightAll(0);
  }

  get input() {
    return this._input;
  }

  get output() {
    return this._output;
  }

  /**
   * Get a button on this Launchpad
   *
   * @param {Number} position The number of the button on the current layout
   *
   * @returns {Button}
   *
   * @example
   * let button = myLaunchpad.getButton(11)
   *
   * // do whatever with the button
   * button.setRgbColor(10, 30, 10)
   *
   * @memberOf Launchpad
   */
  getButton(position) {
    if (!this._buttons[position]) {
      console.error(`Cannot find button at position "${position}"`);
      return null;
    }

    return this._buttons[position];
  }

  getUpButton() {
    return this.getButton(104);
  }

  getDownButton() {
    return this.getButton(105);
  }

  getLeftButton() {
    return this.getButton(106);
  }

  getRightButton() {
    return this.getButton(107);
  }

  getSessionButton() {
    return this.getButton(108);
  }

  getUser1Button() {
    return this.getButton(109);
  }

  getUser2Button() {
    return this.getButton(110);
  }

  getMixerButton() {
    return this.getButton(111);
  }

  /**
   * Convenience method to light up all the buttons on the Launchpad a certain color.
   *
   * @param {Number} color Note representation of the color.
   *
   * @example
   * myLaunchpad.lightAll(23)
   *
   * @memberOf Launchpad
   */
  lightAll(color) {
    this.output.sendMessage([240, 0, 32, 41, 2, 24, 14, color, 247]);
  }

  /**
   * Convenience method to light up all the buttons on the Launchpad a certain color with RGB values.
   *
   * @param {Number} r Red value. 0-63
   * @param {Number} g Green value. 0-63
   * @param {Number} b Blue value. 0-63
   *
   * @example
   * myLaunchpad.lightAllRgb(10, 30, 10)
   *
   * @memberOf Launchpad
   */
  lightAllRgb(r, g, b) {
    this._buttons.forEach((button) => button.setRgbColor(r, g, b));
  }

  /**
   * Convenience method to darken all buttons on the Launchpad.
   *
   * @example
   * myLaunchpad.darkAll()
   *
   * @memberOf Launchpad
   */
  darkAll() {
    this._buttons.forEach((button) => button.darken());
  }

  /**
   * Set the Launchpad's layout.
   *
   * @param {String} layout The layout you want to switch to. Can be one of _NOTE, DRUM, FADER, PROGRAMMER_.
   *
   * @example
   * myLaunchpad.toLayout("USER1")
   *
   * @memberOf Launchpad
   */
  setLayout(layout) {
    this._output.sendMessage([240, 0, 32, 41, 2, 16, 44, LAYOUTS[layout], 247]);
  }

  /**
   * Scroll text across the Launchpad.
   *
   * @param {String} text The text to scroll.
   * @param {Number} color Note representation of the text color.
   * @param {Boolean} loop If true, will loop the text scrolling until another text scroll message is sent.
   * @param {Number} speed The speed of the text scrolling. 1-7
   *
   * @example
   * myLaunchpad.scrollText("Hello node!", 23, true, 5)
   *
   * @memberOf Launchpad
   */
  scrollText(text, color = 3, loop = false, speed = 4) {
    let message = [240, 0, 32, 41, 2, 24, 20, color, loop ? 1 : 0, speed];

    for (var i = 0; i < text.length; i++) message.push(text.charCodeAt(i));

    message.push(247);

    this.output.sendMessage(message);
  }
};

const LAYOUTS = {
  SESSION: 0,
  USER1: 1,
  USER2: 2,
  FADER: 4,
  PAN: 5
};
