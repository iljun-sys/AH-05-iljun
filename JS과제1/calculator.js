// =============================================================
//  콘솔 사칙연산 계산기 (오늘 배운 문법 총동원 버전)
//  사용법: 콘솔에 start() 입력  또는  start("1 + 2 * 3")
// =============================================================

// -------------------------------------------------------------
//  [11. 함수 - 화살표 함수]
//  사칙연산 함수들을 화살표 함수로 정의
//  (한 줄이면 중괄호·return 생략 가능 → 오늘 배운 문법)
// -------------------------------------------------------------
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// -------------------------------------------------------------
//  [10. 객체]
//  연산자(key)와 함수(value)를 객체로 묶는다.
//  이렇게 하면 operators[token] 으로 함수를 바로 꺼낼 수 있고,
//  "token in operators" 로 연산자인지 확인할 수 있다. ([10. in])
// -------------------------------------------------------------
const operators = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
};

// 우선순위별로 나눠둔 배열 ([9. 배열] + [10. includes])
const highPriority = ["*", "/"];   // 먼저 계산
const lowPriority = ["+", "-"];    // 나중에 계산

// -------------------------------------------------------------
//  계산식 입력받기 [11. 함수]
// -------------------------------------------------------------
const inputFormula = () => prompt("계산식을 입력하세요. (예: 1 + 2 * 3)");

// -------------------------------------------------------------
//  숫자 검증 헬퍼 [11. 함수 + 4. 논리연산]
//  문자열을 숫자로 바꿔보고, 숫자가 아니면 null 반환
// -------------------------------------------------------------
const toNumber = (text) => {
  const n = Number(text);
  return isNaN(n) ? null : n;   // [3. 삼항 연산자]
};

// -------------------------------------------------------------
//  핵심: 계산 함수
//  1단계에서 * / 를 먼저 처리하고, 2단계에서 + - 를 처리
// -------------------------------------------------------------
function calculate(formula) {
  // [6. 문자열] trim으로 앞뒤 공백 제거 → 공백 기준으로 나눠 배열로
  const tokens = formula.trim().split(/\s+/);

  // [7. 조건문] 토큰 개수 검증
  // 올바른 식은 "숫자 연산자 숫자 ..." 형태라 항상 홀수 개
  if (tokens.length < 3 || tokens.length % 2 === 0) {
    return { error: "형식이 올바르지 않습니다. (예: 1 + 2 * 3)" };
  }

  // ---- 1단계: 곱셈·나눗셈 먼저 ----
  const midTokens = [];   // [9. 배열]
  let i = 0;

  // [8. 반복문 - while]
  while (i < tokens.length) {
    const token = tokens[i];

    // [10. in] 이 토큰이 고순위 연산자(* /)인가?
    if (highPriority.includes(token)) {
      const left = toNumber(midTokens.pop());       // 직전에 넣은 숫자를 꺼냄
      const right = toNumber(tokens[i + 1]);         // 다음 숫자

      // [4. 논리연산] 둘 중 하나라도 숫자가 아니면
      if (left === null || right === null) {
        return { error: "숫자가 올바르지 않습니다." };
      }

      // [7. 조건문] 0으로 나누기 방지
      if (token === "/" && right === 0) {
        return { error: "0으로 나눌 수 없습니다." };
      }

      // 객체에서 연산 함수를 꺼내 실행 [10. 객체 활용]
      const res = operators[token](left, right);
      midTokens.push(res);
      i += 2;   // 연산자 + 오른쪽 숫자를 건너뜀
    } else {
      midTokens.push(token);
      i++;
    }
  }

  // ---- 2단계: 덧셈·뺄셈 ----
  let result = toNumber(midTokens[0]);
  if (result === null) return { error: "숫자가 올바르지 않습니다." };

  // [8. 반복문 - for] 2칸씩 건너뛰며 (연산자, 숫자) 처리
  for (let j = 1; j < midTokens.length; j += 2) {
    const token = midTokens[j];
    const next = toNumber(midTokens[j + 1]);

    if (next === null) return { error: "숫자가 올바르지 않습니다." };

    // [10. in] 저순위 연산자(+ -)가 맞는지 확인
    if (!lowPriority.includes(token)) {
      return { error: `알 수 없는 연산자입니다: ${token}` };
    }

    result = operators[token](result, next);   // 객체에서 함수 꺼내 실행
  }

  return { value: result };   // [10. 객체] 성공 결과도 객체로 반환
}

// -------------------------------------------------------------
//  시작 함수 [11. 함수]
// -------------------------------------------------------------
function start(formula) {
  // [4. 논리연산 + truthy] 인자가 없으면 prompt로 물어봄
  let input = formula || inputFormula();

  if (!input) {
    console.log("계산식을 입력해주세요.");
    return;
  }

  const result = calculate(input);

  // [10. in] 결과 객체에 error가 있으면 에러, 아니면 정상 출력
  if ("error" in result) {
    console.log(`❌ 에러: ${result.error}`);   // [6. 템플릿 리터럴]
  } else {
    console.log(`✅ ${input.trim()} = ${result.value}`);
  }
}

// -------------------------------------------------------------
//  도움말 [6. 템플릿 리터럴 - 여러 줄]
// -------------------------------------------------------------
function help() {
  console.log(`
🧮 콘솔 계산기 사용법
─────────────────────────
start()              → 입력창이 뜹니다
start("1 + 2 * 3")   → 바로 계산합니다
help()               → 이 도움말

지원 연산: +  -  *  /
· 숫자와 연산자 사이는 공백으로 구분
· 곱셈·나눗셈이 덧셈·뺄셈보다 먼저 계산됩니다
  `);
}

// 페이지 로드 시 안내 출력
console.log('계산기 준비 완료! start() 를 입력하세요. (도움말: help())');
