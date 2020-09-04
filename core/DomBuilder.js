class LaunchpadMk2DomBuilder {
  constructor(config, mode, onButtonClickedHandler) {
    this.config = config;
    this.mode = mode;

    if (onButtonClickedHandler) {
      this.onButtonClickedHandler = onButtonClickedHandler;
    } else {
      this.onButtonClickedHandler = (button) => {
        console.log(`[Launchpad] Button ${button} clicked`);
      };
    }

    this.buttons = [];
    for (let i = 0; i < 150; i++) {
      this.buttons[i] = { button: i, state: { press: false } };
    }
  }

  setButtonState(button, state) {
    if (this.buttons[button]) {
      this.buttons[button].state = Object.assign({}, state);
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  build() {
    const rootEl = document.createElement("div");

    if (this.config.show) {
      rootEl.classList.add("launchpad", "launchpad-" + this.config.size);

      if (this.config.debug) {
        rootEl.classList.add("debug");
      }

      const sessionLayout = [
        [104, 105, 106, 107, 108, 109, 110, 111, -1],
        [81, 82, 83, 84, 85, 86, 87, 88, 89],
        [71, 72, 73, 74, 75, 76, 77, 78, 79],
        [61, 62, 63, 64, 65, 66, 67, 68, 69],
        [51, 52, 53, 54, 55, 56, 57, 58, 59],
        [41, 42, 43, 44, 45, 46, 47, 48, 49],
        [31, 32, 33, 34, 35, 36, 37, 38, 39],
        [21, 22, 23, 24, 25, 26, 27, 28, 29],
        [11, 12, 13, 14, 15, 16, 17, 18, 19]
      ];

      sessionLayout.forEach((row) => {
        const rowEl = document.createElement("div");
        rowEl.classList.add("launchpad-row");
        row.forEach((cell) => {
          const cellEl = document.createElement("span");
          cellEl.classList.add("launchpad-button");
          cellEl.dataset.button = cell.toString(10);

          const backgroundEl = document.createElement("span");
          backgroundEl.classList.add("launchpad-button-background");
          cellEl.appendChild(backgroundEl);

          if (this.buttons[cell] && this.buttons[cell].state.press) {
            cellEl.classList.add("pressed");
          }

          if ((cell >= 104 && cell <= 111) || cell % 10 === 9) {
            cellEl.classList.add("round");
          } else if (cell !== -1) {
            cellEl.classList.add("square");
          } else {
            cellEl.classList.add("invisible");
          }

          const bind = this._getBinding(cell);
          if (bind && !cellEl.classList.contains("pressed")) {
            backgroundEl.style.background = LAUNCHPAD_COLORS_TO_HEX[bind.color];
            cellEl.style.color = this._getInvertTextColor(
              LAUNCHPAD_COLORS_TO_HEX[bind.color]
            );
            if (bind.notification === "LAUNCHPAD_TOGGLE_MODE") {
              cellEl.classList.add(
                this.mode === "NOTIFICATION" ? "static" : "pulse"
              );
            } else {
              if (bind.mode) {
                cellEl.classList.add(bind.mode.toLowerCase());
              }
            }
          }

          if (this.config.debug) {
            const text = document.createElement("span");
            text.classList.add("launchpad-button-text");
            text.innerText = cell.toString();
            cellEl.appendChild(text);

            cellEl.addEventListener("click", () => {
              this.onButtonClickedHandler(cell);
            });
          }

          rowEl.appendChild(cellEl);
        });
        rootEl.appendChild(rowEl);
      });
    }

    if (this.config.debug) {
      const bindingsEl = document.createElement("div");
      bindingsEl.classList.add("bindings");

      this.config.bindings.forEach((bind) => {
        const bindEl = document.createElement("div");
        bindEl.classList.add("bind");
        bindEl.innerText = `${bind.button}: ${bind.notification}`;
        bindingsEl.appendChild(bindEl);
      });

      rootEl.appendChild(bindingsEl);
    }

    return rootEl;
  }

  _getBinding(button) {
    for (const bind of this.config.bindings) {
      if (bind.button === button) {
        return bind;
      }
    }

    return null;
  }

  _getInvertTextColor(hex) {
    return this._contrast(hex, "#ffffff") > this._contrast(hex, "#000000")
      ? "#fff"
      : "#000";
  }

  _contrast(hex1, hex2) {
    const rgb1 = this._hexToRgb(hex1);
    const rgb2 = this._hexToRgb(hex2);

    const lum1 = this._luminescence(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this._luminescence(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  _luminescence(r, g, b) {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  _hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
}

const LAUNCHPAD_COLORS_TO_HEX = {
  0: "#000000",
  1: "#1c1c1c",
  2: "#7c7c7c",
  3: "#fcfcfc",
  4: "#ff4d47",
  5: "#ff0a00",
  6: "#5a0100",
  7: "#190000",
  8: "#ffbd62",
  9: "#ff5600",
  10: "#5a1d00",
  11: "#241800",
  12: "#fdfd21",
  13: "#fdfd00",
  14: "#585800",
  15: "#181800",
  16: "#80fd2a",
  17: "#40fd00",
  18: "#165800",
  19: "#132800",
  20: "#34fd2b",
  21: "#00fd00",
  22: "#005800",
  23: "#001800",
  24: "#33fd46",
  25: "#00fd00",
  26: "#005800",
  27: "#001800",
  28: "#32fd7e",
  29: "#00fd3a",
  30: "#005814",
  31: "#001c0f",
  32: "#2ffcb0",
  33: "#00fc91",
  34: "#005831",
  35: "#00180f",
  36: "#39bfff",
  37: "#00a7ff",
  38: "#004051",
  39: "#001018",
  40: "#4186ff",
  41: "#0050ff",
  42: "#001a5a",
  43: "#000719",
  44: "#4647ff",
  45: "#0000ff",
  46: "#00005b",
  47: "#000019",
  48: "#8347ff",
  49: "#5000ff",
  50: "#160067",
  51: "#0b0032",
  52: "#ff49ff",
  53: "#ff00ff",
  54: "#5a005a",
  55: "#190019",
  56: "#ff4d84",
  57: "#ff0752",
  58: "#5a011b",
  59: "#210010",
  60: "#ff1900",
  61: "#9b3500",
  62: "#7a5100",
  63: "#3e6400",
  64: "#2d5b2d",
  65: "#005432",
  66: "#00537e",
  67: "#0000ff",
  68: "#00444d",
  69: "#1b00d2",
  70: "#7c7c7c",
  71: "#202020",
  72: "#ff0a00",
  73: "#bafd00",
  74: "#aaed00",
  75: "#56fd00",
  76: "#008800",
  77: "#00fc7a",
  78: "#00a7ff",
  79: "#001bff",
  80: "#3500ff",
  81: "#7700ff",
  82: "#b4177e",
  83: "#412000",
  84: "#ff4a00",
  85: "#83e100",
  86: "#65fd00",
  87: "#00fd00",
  88: "#00fd00",
  89: "#45fd61",
  90: "#00fcca",
  91: "#5086ff",
  92: "#274dc9",
  93: "#827aed",
  94: "#d30cff",
  95: "#ff065a",
  96: "#ff7d00",
  97: "#b9b100",
  98: "#8afd00",
  99: "#825d00",
  100: "#392800",
  101: "#0d4c05",
  102: "#005037",
  103: "#131329",
  104: "#101f5a",
  105: "#6a3c17",
  106: "#ac0400",
  107: "#e15135",
  108: "#dc6900",
  109: "#ffe100",
  110: "#99e100",
  111: "#5fb500",
  112: "#1b1b31",
  113: "#dcfd54",
  114: "#76fcb8",
  115: "#9697ff",
  116: "#8b61ff",
  117: "#404040",
  118: "#747474",
  119: "#defcfc",
  120: "#a40400",
  121: "#350000",
  122: "#00d100",
  123: "#004000",
  124: "#b9b100",
  125: "#3d3000",
  126: "#b45d00",
  127: "#4a1400"
};
