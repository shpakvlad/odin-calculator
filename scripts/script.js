
let currentValue = null;
let previousValue = null;
let operator = null;

let keyboardPanel = document.querySelector(".keyboard-panel");

keyboardPanel.addEventListener("click", (e) => {
   let button = e.target.textContent.trim();

    switch (button) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            console.log('digit');
            break;
        case "+":
        case "-":
        case "×":
        case "÷":
            console.log('operator');
            break;
        case "=":
            console.log('equal');
            break;
        case "." :
            console.log("dot");
            break;
        case "C":
            console.log("clear");
            break;
        default:
            console.log("unknown");
            break;
    }
});