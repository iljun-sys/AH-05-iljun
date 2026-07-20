// =============================================================
//  JS 사칙연산 계산기 v2
//  - querySelector / querySelectorAll 로 요소를 선택
//  - addEventListener 로 클릭 이벤트를 연결 (인라인 onclick 미사용)
// =============================================================

// -------------------------------------------------------------
//  [querySelector] 화면에 쓰는 요소들을 미리 선택해 둔다.
// -------------------------------------------------------------
const display = document.querySelector("#display");              // 결과 표시창
const onOffBtn = document.querySelector(".on-off");              // 전원 버튼
const allButtons = document.querySelectorAll(".buttons button"); // 모든 버튼
const otherButtons = document.querySelectorAll(".buttons button:not(.on-off)"); // 전원 외 버튼

// -------------------------------------------------------------
//  상태 값
// -------------------------------------------------------------
let currentFormula = "";   // 지금까지 입력된 수식 (예: "12 + 3 * 4")
let isPowerOn = true;      // 전원 on/off
let isCalculated = false;  // 방금 Enter 로 계산을 끝냈는지

// -------------------------------------------------------------
//  사칙연산 함수 (화살표 함수)
// -------------------------------------------------------------
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// -------------------------------------------------------------
//  숫자 입력 처리
// -------------------------------------------------------------
function appendNumber(number) {
    if (!isPowerOn) return;

    // 계산이 끝난 상태에서 숫자를 누르면 새 수식을 시작한다.
    if (isCalculated) {
        display.value = "";
        currentFormula = "";
        isCalculated = false;
    }

    if (display.value === "0" || display.value === "Error" || display.value === "DivBy0") {
        display.value = number;
        currentFormula = number;
    } else {
        display.value += number;
        currentFormula += number;
    }
}

// -------------------------------------------------------------
//  연산자 입력 처리
// -------------------------------------------------------------
function appendOperator(operator) {
    if (!isPowerOn) return;
    if (display.value === "Error" || display.value === "DivBy0") return;

    // 계산 직후 연산자를 누르면 결과값에 이어서 계산한다.
    if (isCalculated) {
        isCalculated = false;
    }

    // 수식이 비어 있으면 0 부터 시작하게 한다.
    if (currentFormula === "") {
        currentFormula = "0";
    }

    // 마지막이 연산자(" + ")로 끝나면, 새 연산자로 교체한다.
    if (currentFormula.endsWith(" ")) {
        currentFormula = currentFormula.slice(0, -3);
    }

    currentFormula += " " + operator + " ";
    display.value = currentFormula;
}

// -------------------------------------------------------------
//  초기화 (C)
// -------------------------------------------------------------
function clearDisplay() {
    if (!isPowerOn) return;
    display.value = "0";
    currentFormula = "";
    isCalculated = false;
}

// -------------------------------------------------------------
//  전원 on/off
// -------------------------------------------------------------
function togglePower() {
    isPowerOn = !isPowerOn;

    if (isPowerOn) {
        display.value = "0";
        display.style.backgroundColor = "#222";
        onOffBtn.classList.add("on");
        otherButtons.forEach((btn) => (btn.disabled = false));
    } else {
        display.value = "";
        display.style.backgroundColor = "#111";
        onOffBtn.classList.remove("on");
        otherButtons.forEach((btn) => (btn.disabled = true));
        currentFormula = "";
        isCalculated = false;
    }
}

// -------------------------------------------------------------
//  계산 (곱셈·나눗셈을 먼저, 그다음 덧셈·뺄셈)
// -------------------------------------------------------------
function calculate(formula) {
    const tokens = formula.trim().split(/\s+/);
    if (tokens.length < 3 || tokens.length % 2 === 0) {
        return "Error";
    }

    // 1단계: 곱셈·나눗셈 먼저
    const intermediateTokens = [];
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        if (token === "*" || token === "/") {
            const left = Number(intermediateTokens.pop());
            const right = Number(tokens[i + 1]);

            if (isNaN(left) || isNaN(right)) return "Error";

            let res;
            if (token === "*") {
                res = multiply(left, right);
            } else {
                if (right === 0) return "DivBy0";
                res = divide(left, right);
            }
            intermediateTokens.push(res);
            i += 2;
        } else {
            intermediateTokens.push(token);
            i++;
        }
    }

    // 2단계: 덧셈·뺄셈
    let result = Number(intermediateTokens[0]);
    if (isNaN(result)) return "Error";

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextValue = Number(intermediateTokens[j + 1]);

        if (isNaN(nextValue)) return "Error";

        if (operator === "+") {
            result = add(result, nextValue);
        } else if (operator === "-") {
            result = subtract(result, nextValue);
        } else {
            return "Error";
        }
    }
    return result;
}

// -------------------------------------------------------------
//  Enter (계산 실행)
// -------------------------------------------------------------
function performCalculate() {
    if (!isPowerOn || !currentFormula) return;

    // 연산자로 끝나면 그 연산자를 떼고 계산한다.
    if (currentFormula.endsWith(" ")) {
        currentFormula = currentFormula.trim();
    }

    const result = calculate(currentFormula);
    display.value = result;
    isCalculated = true;

    if (result === "Error" || result === "DivBy0") {
        currentFormula = "";
    } else {
        currentFormula = result.toString();
    }
}

// -------------------------------------------------------------
//  [addEventListener] 버튼 클릭을 하나의 핸들러로 처리한다.
//  각 버튼의 data-* 속성(dataset)을 보고 어떤 동작인지 판단한다.
// -------------------------------------------------------------
function handleButtonClick(event) {
    const button = event.currentTarget;
    const { number, operator, action } = button.dataset;

    if (number !== undefined) {
        appendNumber(number);
    } else if (operator !== undefined) {
        appendOperator(operator);
    } else if (action === "clear") {
        clearDisplay();
    } else if (action === "enter") {
        performCalculate();
    } else if (action === "power") {
        togglePower();
    }
}

// 모든 버튼에 클릭 이벤트를 등록한다.
allButtons.forEach((button) => {
    button.addEventListener("click", handleButtonClick);
});

// 페이지가 로드되면 전원 버튼을 켜진 상태(초록)로 표시한다.
window.addEventListener("load", () => {
    onOffBtn.classList.add("on");
});
