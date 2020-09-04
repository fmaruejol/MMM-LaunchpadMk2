"use strict";

const Launchpad = require("./Launchpad");
const events = require("events");

const MODES = {
  STATIC: 144,
  FLASH: 145,
  PULSE: 146
};

module.exports = class Button extends events.EventEmitter {
  /**
   * Creates an instance of Button. You shouldn't need to use this, Buttons are generated with a Launchpad instance.
   * @param {Launchpad} launchpad The Launchpad this button belongs to.
   * @param {Number} note The note representation of the button, used when sending messages to the Launchpad.
   *
   * @memberOf Button
   */
  constructor(launchpad, note) {
    super();

    /**
     * The Launchpad this button belongs to.
     * @type {Launchpad}
     */
    this._launchpad = launchpad;

    /**
     * The note representation of this button.
     * @type {Number}
     */
    this._note = note;

    /**
     * The current color of the button.
     * @type {Number}
     */
    this._color = 0;

    /**
     * The current mode of the button.
     * @type {String}
     */
    this._mode = "STATIC";
  }

  get note() {
    return this._note;
  }

  get color() {
    return this._color;
  }

  get mode() {
    return this._mode;
  }

  /**
   * Set the color of this button.
   *
   * @param {Number} color The note representation of the color.
   *
   * @example
   * var button = launchpad.getButton(11)
   * button.setColor(2)
   *
   * @memberOf Button
   */
  setColor(color) {
    this._color = color;
    this._launchpad.output.sendMessage([MODES["STATIC"], this._note, color]);
  }

  /**
   * Set the color and the mode of this button.
   *
   * @param {Number} color The note representation of the color.
   * @param {String} mode The mode of the button
   *
   * @example
   * var button = launchpad.getButton(11)
   * button.setColorAndMode(2, "PULSE")
   *
   * @memberOf Button
   */
  setColorAndMode(color, mode) {
    if (!MODES[mode]) {
      return;
    }

    this._color = color;
    this._mode = mode;

    this._launchpad.output.sendMessage([MODES[mode], this._note, color]);
  }

  /**
   * Flash a color in and out on a button
   *
   * @param {Number} color The note representation of the color.
   *
   * @example
   * var button = launchpad.getButton(11)
   * button.flashColor(2)
   *
   * @memberOf Button
   */
  flashColor(color) {
    this._color = color;
    this._mode = "FLASH";
    this._launchpad.output.sendMessage([MODES["FLASH"], this._note, color]);
  }

  /**
   * Pulse a color in and out on a button
   *
   * @param {Number} color The note representation of the color.
   *
   * @example
   * var button = launchpad.getButton(11)
   * button.pulseColor(2)
   *
   * @memberOf Button
   */
  pulseColor(color) {
    this._color = color;
    this._mode = "PULSE";
    this._launchpad.output.sendMessage([MODES["PULSE"], this._note, color]);
  }

  /**
   * Set a color on the button with RGB values.
   *
   * @param {Number} r Red value. 0-63
   * @param {Number} g Green value. 0-63
   * @param {Number} b Blue value. 0-63
   *
   * @example
   * var button = launchpad.getButton(11)
   * button.setRgbColor(255, 255, 255) // set color to white
   *
   * @memberOf Button
   */
  setRgbColor(r, g, b) {
    this._color = -1;
    this._launchpad.output.sendMessage([
      240,
      0,
      32,
      41,
      2,
      24,
      11,
      this._note,
      r,
      g,
      b,
      247
    ]);
  }

  /**
   * Convenience method for setting the button's color to 0.
   *
   * @example
   * var button = launchpad.getButton(11)
   * button.darken()
   *
   * @memberOf Button
   */
  darken() {
    this._color = 0;
    this._launchpad.output.sendMessage([144, this._note, 0]);
  }
};
