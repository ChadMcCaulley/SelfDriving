class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case "USER_CONTROLLED":
        this.#addKeyboardListeners();
        break;
      case "TRAFFIC":
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      const key = event.key.toLowerCase();
      if (key === "arrowleft") this.left = true;
      else if (key === "arrowright") this.right = true;
      else if (key === "arrowdown") this.reverse = true;
      else if (key === "arrowup") this.forward = true;
    };
    document.onkeyup = (event) => {
      const key = event.key.toLowerCase();
      if (key === "arrowleft") this.left = false;
      else if (key === "arrowright") this.right = false;
      else if (key === "arrowdown") this.reverse = false;
      else if (key === "arrowup") this.forward = false;
    };
  }
}
