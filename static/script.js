console.log("hi");

class CountdownButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.timeLeft = parseInt(this.getAttribute("time") || "30");
    this.shadowRoot.innerHTML = `
            <style>
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .timer {
                    font-size: 24px;
                    font-family: Arial, sans-serif;
                }
                ::slotted(button) {
                    display: none;
                }
            </style>
            <div class="container">
                <div class="timer">${this.timeLeft} seconds</div>
                <slot></slot>
            </div>
        `;

    this.timerElement = this.shadowRoot.querySelector(".timer");
    this.slottedButton = this.querySelector("button");

    this.startCountdown();
  }

  static get observedAttributes() {
    return ["time"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "time" && oldValue !== newValue) {
      this.timeLeft = parseInt(newValue || "30");
      if (this.timerElement) {
        this.timerElement.textContent = `${this.timeLeft} seconds`;
      }
    }
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft > 0) {
        this.timerElement.textContent = `${this.timeLeft} seconds`;
      } else {
        clearInterval(interval);
        this.timerElement.style.display = "none";
        if (this.slottedButton) {
          this.slottedButton.style.display = "block";
        }
      }
    }, 1000);
  }
}

customElements.define("countdown-button", CountdownButton);
