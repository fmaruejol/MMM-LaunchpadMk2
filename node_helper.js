"use strict";

const NodeHelper = require("node_helper");
const Launchpad = require("./core/Launchpad");

module.exports = NodeHelper.create({
  /**
   * @type Launchpad
   */
  launchpad: null,

  /**
   * @type object
   */
  config: null,

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "CONNECT_TO_LAUNCHPAD":
        this.config = payload;
        this.launchpad = new Launchpad({
          inPort: this.config.inPort,
          outPort: this.config.outPort,
          virtual: this.config.virtual
        });

        for (let i = 0; i < 150; i++) {
          this.registerToBasicButtonEvents(i);
        }

        this.config.bindings.forEach((bind) => {
          this.bindButton(bind);
        });

        break;
      case "BUTTON_CLICKED": // Debug only
        setTimeout(() => {
          this.launchpad.getButton(payload).emit("release");
        }, 300);
        this.launchpad.getButton(payload).emit("press");
        break;
      case "DARKEN_ALL":
        this.launchpad.darkAll();
        break;
      case "SET_COLORS":
        this.config.bindings.forEach((bind) => {
          if (bind.color) {
            this.setButtonColor(bind.button, bind.color);
          }
        });
        break;
    }
  },

  registerToBasicButtonEvents(button) {
    const but = this.launchpad.getButton(button);
    if (but) {
      but.on("press", () => {
        setTimeout(
          () =>
            this.sendSocketNotification("LAUNCHPAD_BUTTON_PRESSED", { button }),
          0
        );
      });

      but.on("release", () => {
        setTimeout(
          () =>
            this.sendSocketNotification("LAUNCHPAD_BUTTON_RELEASED", {
              button
            }),
          0
        );
      });
    }
  },

  bindButton(payload) {
    const button = this.launchpad.getButton(payload.button);
    if (button) {
      if (payload.color) {
        this.setButtonColor(
          payload.button,
          payload.color,
          payload.mode ? payload.mode : "STATIC"
        );
      }

      button.on("press", () => {
        if (payload.notification === "LAUNCHPAD_TOGGLE_MODE") {
          this.setButtonColor(
            payload.button,
            payload.color,
            button.mode === "STATIC" ? "PULSE" : "STATIC"
          );
        }

        this.sendSocketNotification(payload.notification, {
          payload: payload.payload,
          button: payload.button
        });
      });
    }
  },

  setButtonColor(button, color, mode = "STATIC") {
    const but = this.launchpad.getButton(button);
    if (but) {
      but.setColorAndMode(color, mode);
    }
  }
});
