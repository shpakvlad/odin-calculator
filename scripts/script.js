let currentValue = "0";
let previousValue = "";
let operator = "";
let isFinished = false;

let screen = document.querySelector(".screen");
let keyboardPanel = document.querySelector(".keyboard-panel");

document.addEventListener('keydown', (e) => {
    let key = e.key;

    // 1. Приравниваем клавиши к символам в switch
    if (key === "Enter") key = "=";
    if (key === "Escape") key = "C";
    if (key === "Backspace") key = "⟵";
    if (key === ",") key = "."; // Для удобства, если кто-то нажмет запятую
    if (key === "*") key = "×";
    if (key === "-") key = "–";
    if (key === "_") key = "±";
    if (key === "/") {
        e.preventDefault(); // Предотвращаем поиск по странице в браузере!!!
        key = "÷";
    }

    // 2. Список разрешенных клавиш (чтобы калькулятор не реагировал на буквы)
    const validKeys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "+", "-", "×", "÷", "=", ".", "⟵", "C", "&plusmn;", "±"
    ];

    // Если нажатая клавиша есть в списке — запускаем логику
    if (validKeys.includes(key)) {
        handleInput(key);
    }
});

keyboardPanel.addEventListener("click", (e) => {
    if (!e.target.classList.contains('button')) return; // проверка, что кликнули по кнопке
    handleInput(e.target.textContent.trim());
});

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
            // 1. Если мы ввели первое число и нажали оператор впервые
            if (currentValue !== "" && previousValue === "") {
                previousValue = currentValue;
                operator = button;
                currentValue = "";
            }
            // 2. Если мы передумали и хотим сменить оператор (currentValue уже очищено)
            else if (currentValue === "" && previousValue !== "") {
                operator = button; // Просто перезаписываем знак
            }
            // 3. Если мы уже ввели второе число и нажали оператор (цепочка вычислений: 5 + 5 [+])
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
            // 1. Если мы только что закончили предыдущий расчет, начинаем заново с "0."
            if (isFinished) {
                currentValue = "0.";
                isFinished = false;
            }
            // 2. Если точки еще нет в текущем числе
            else if (!currentValue.includes(".")) {
                // Если currentValue пустое (например, после нажатия оператора), делаем "0."
                if (currentValue === "" || currentValue === "0") {
                    currentValue = "0.";
                } else {
                    // Иначе просто приклеиваем точку в конец
                    currentValue += ".";
                }
            }
            // 3. Если точка уже есть — ничего не делаем (пропускаем)
            updateScreen();
            break;
        case "C":
            currentValue = "0";
            operator = "";
            previousValue = "";
            updateScreen();
            break;
        case "⟵":
            // 1. Если мы вводим второе число (или первое) и оно не пустое
            if (currentValue !== "" && currentValue !== "0") {
                currentValue = currentValue.slice(0, -1);

                // Если после стирания стало пусто, мы НЕ всегда ставим "0"
                if (currentValue === "") {
                    // Если оператора нет, значит мы стирали единственное число -> ставим "0"
                    if (operator === "") {
                        currentValue = "0";
                    }
                    // Если оператор есть, оставляем currentValue пустым,
                    // чтобы экран показал только "54 +"
                }
            }
            // 2. Если currentValue уже пустое, но есть оператор — стираем оператор
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
                    // Если есть минус — отрезаем его (берем всё со второго символа)
                    currentValue = currentValue.slice(1);
                } else {
                    // Если нет минуса — приклеиваем его в начало
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

function calculate(currentValue, operator, previousValue) {
// Превращаем строки в числа для математики (Аксиома!)
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

    // Округляем до 6 знаков, а затем Number() уберет лишние нули в конце
    // Например: 5.300000 превратится в 5.3
    return Number(result.toFixed(6)).toString();
}

function updateScreen() {
    // Если есть оператор, показываем всю конструкцию
    if (operator && previousValue !== null) {
        screen.textContent = `${previousValue} ${operator} ${currentValue}`;
    } else {
        // Иначе показываем только то, что вводим сейчас
        // Если currentValue пустое, показываем 0
        screen.textContent = currentValue || "0";
    }
}


//TODO: перевести комментарии