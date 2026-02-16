/**
 * @file The main script for the calculator.
 * Implements calculation logic, DOM event handling, and keyboard support.
 * @author Vladyslav Shpakov aka sendsay
 * @version 1.0.0
 */

/**
 * Current value, showing on screen
 * @type {string}
 */
let currentValue = "0";

/**
 * Previous entering value
 * @type {string}
 */
let previousValue = "";

/**
 * Stores selected mathematical operator
 * @type {string}
 */
let operator = "";

/**
 * Flag indicating whether the current calculation is complete
 * @type {boolean}
 */
let isFinished = false;

/**
 * Calculator display element
 * @type {HTMLDivElement}
 */
let screen = document.querySelector(".screen");

/**
 * Calculator keyboard pad element
 * @type {HTMLDivElement}
 */
let keyboardPanel = document.querySelector(".keyboard-panel");

document.addEventListener('keydown', (e) => {
    let key = e.key;

    // Assign keys to symbols in switch
    if (key === "Enter") key = "=";
    if (key === "Escape") key = "C";
    if (key === "Backspace") key = "⟵";
    if (key === ",") key = "."; // For convenience, if someone presses the comma key
    if (key === "*") key = "×";
    if (key === "-") key = "–";
    if (key === "_") key = "±";
    if (key === "/") {
        e.preventDefault(); // Prevent searching on the page in the browser!!!
        key = "÷";
    }

    // List of permitted keys (so that the calculator does not respond to letters)
    const validKeys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "+", "-", "×", "÷", "=", ".", "⟵", "C", "±"
    ];

    // If the pressed key is in the list, we run the logic.
    if (validKeys.includes(key)) {
        handleInput(key);
    }
});

keyboardPanel.addEventListener("click", (e) => {
    if (!e.target.classList.contains('button')) return; // check if button click
    handleInput(e.target.textContent.trim());
});

/**
 * Central input processing logic.
 * Processes button presses on the screen and keys on the keyboard,
 * distributing actions between entering numbers, selecting an operation, or calculating.
 *
 * @param {string} button - Meaning of the pressed button (number, operator, or special character)
 * @returns {void}
 */
function handleInput(button) {
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
        case "9": {
            if (isFinished) {
                currentValue = button;
                isFinished = false;
            } else {
                if (currentValue === "0") {
                    currentValue = button;
                } else {
                    currentValue += button;
                }
            }
            updateScreen();
        }
            break;
        case "+":
        case "–":
        case "×":
        case "÷":
            // If we entered the first number and pressed the operator for the first time
            if (currentValue !== "" && previousValue === "") {
                previousValue = currentValue;
                operator = button;
                currentValue = "";
            }
            // If we change our minds and want to switch operators (currentValue has already been cleared)
            else if (currentValue === "" && previousValue !== "") {
                operator = button; // Просто перезаписываем знак
            }
            // If we have already entered the second number and pressed the operator (calculation chain: 5 + 5 [+])
            else if (currentValue !== "" && previousValue !== "") {
                previousValue = calculate(previousValue, operator, currentValue);
                operator = button;
                currentValue = "";
            }

            updateScreen();
            break;
        case "=":
            if (previousValue !== "" && operator !== "" && currentValue !== "") {
                currentValue = calculate(previousValue, operator, currentValue);
                operator = "";
                previousValue = "";
                isFinished = true;
                updateScreen();
            }
            break;
        case "." :
            // If we have just finished the previous calculation, we start again from ‘0.’
            if (isFinished) {
                currentValue = "0.";
                isFinished = false;
            }
            // If the point is not yet in the current number
            else if (!currentValue.includes(".")) {
                // If currentValue is empty (for example, after pressing the operator), we set it to ‘0.’
                if (currentValue === "" || currentValue === "0") {
                    currentValue = "0.";
                } else {
                    // Otherwise, just stick a dot at the end.
                    currentValue += ".";
                }
            }
            // If the point already exists, do nothing (skip).
            updateScreen();
            break;
        case "C":
            currentValue = "0";
            operator = "";
            previousValue = "";
            updateScreen();

            break;
        case "⟵":
            // If we enter the second number (or the first) and it is not empty
            if (currentValue !== "" && currentValue !== "0") {
                currentValue = currentValue.slice(0, -1);

                // If it is empty after deletion, we do NOT always put ‘0’.
                if (currentValue === "") {
                    // If there is no operator, it means we deleted the singular form -> we put ‘0’
                    if (operator === "") {
                        currentValue = "0";
                    }
                    // If there is an operator,
                    // //leave currentValue empty so that the screen only shows ‘54 +’
                }
            }
            // If currentValue is already empty, but there is an operator, we delete the operator.
            else if (operator !== "") {
                operator = "";
                currentValue = previousValue;
                previousValue = "";
            }
            updateScreen();
            break;
        case "±":
            if (currentValue !== "0" && currentValue !== "") {
                if (currentValue.startsWith("-")) {
                    // If there is a minus sign,
                    // we cut it off (taking everything from the second character onwards).
                    currentValue = currentValue.slice(1);
                } else {
                    // If there is no minus sign, we stick it at the beginning.
                    currentValue = "-" + currentValue;
                }
            }
            updateScreen();
            break;
        default:
            console.log("unknown");
            break;
    }
}

/**
 * Calculate operation between two numbers
 * Call when user press = button or have all data for make calculation (exm. 5+6)
 *
 * @param {string} currentValue - First number (operand A)
 * @param {string} operator - Operation sign (+, -, *, /)
 * @param {string} previousValue - Second number (operand B).
 * @returns {string} Result calculation
 */
function calculate(currentValue, operator, previousValue) {
// Converting strings into numbers for mathematics (Axiom!)
    const num1 = parseFloat(currentValue);
    const num2 = parseFloat(previousValue);
    let result;

    switch (operator) {
        case "+": result = num1 + num2; break;
        case "–": result = num1 - num2; break;
        case "×": result = num1 * num2; break;
        case "÷":
            if (num2 === 0) return "Error";
            result = num1 / num2;
            break;
        default: return previousValue;
    }

    // Round to 6 digits, and then Number() will remove the extra zeros at the end.
    // For example: 5.300000 will become 5.3.
    return Number(result.toFixed(6)).toString();
}

/**
 * Update screen data
 *
 * @returns {void}
 */
function updateScreen() {
    // If there is an operator, we show the entire structure.
    if (operator && previousValue !== "") {
        screen.textContent = `${previousValue} ${operator} ${currentValue}`;
    } else {
        // Otherwise, we only show what we are entering now.
        // If currentValue is empty, we show 0.
        screen.textContent = currentValue || "0";
    }
}