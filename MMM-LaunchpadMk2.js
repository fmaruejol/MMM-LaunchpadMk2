"use strict";

Module.register("MMM-LaunchpadMk2", {
  defaults: {
    name: "MMM-LaunchpadMk2",
    show: false,
    debug: false,
    virtual: false,
    size: "medium", // small, medium or large
    inPort: 0,
    outPort: 1,
    bindings: []
  },

  /**
   * @type LaunchpadMk2DomBuilder
   */
  domBuilder: null,

  /**
   * @type string Possible values ["NOTIFICATION", "DESCRIPTION"]
   */
  mode: "NOTIFICATION",

  start: function () {
    Log.info("Starting module: " + this.name);

    this.sendSocketNotification("CONNECT_TO_LAUNCHPAD", this.config);
  },

  getDom: function () {
    if (!this.domBuilder) {
      // eslint-disable-next-line no-undef
      this.domBuilder = new LaunchpadMk2DomBuilder(
        this.config,
        this.mode,
        (button) => {
          this.sendSocketNotification("BUTTON_CLICKED", button);
        }
      );
    }

    return this.domBuilder.build();
  },

  getStyles: function () {
    return [this.file("css/styles.css"), "font-awesome.css"];
  },

  getScripts: function () {
    return [this.file("core/DomBuilder.js")];
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "LAUNCHPAD_BUTTON_PRESSED":
        this.domBuilder.setButtonState(payload.button, { press: true });
        this.updateDom(0);
        break;
      case "LAUNCHPAD_BUTTON_RELEASED":
        this.domBuilder.setButtonState(payload.button, { press: false });
        this.updateDom(0);
        break;
      case "LAUNCHPAD_TOGGLE_MODE":
        this.mode =
          this.mode === "NOTIFICATION" ? "DESCRIPTION" : "NOTIFICATION";
        this.domBuilder.setMode(this.mode);
        break;
      case "LAUNCHPAD_DARKEN_ALL":
        this.sendSocketNotification("DARKEN_ALL");
        break;
      case "LAUNCHPAD_SET_COLORS":
        this.sendSocketNotification("SET_COLORS");
        break;
      default:
        switch (this.mode) {
          case "NOTIFICATION":
            this.sendNotification(notification, payload.payload || {});
            break;
          case "DESCRIPTION":
            if (MM.getModules().withClass("alert").length > 0) {
              this.sendNotification("SHOW_ALERT", {
                type: "notification",
                title: `Launchpad button "${payload.button}"`,
                message: `${notification}`
              });
            } else {
              Log.warn(
                `Launchpad mode "DESCRIPTION" needs the default module "alert" to be enabled`
              );
            }
            break;
        }
    }
  }
});
