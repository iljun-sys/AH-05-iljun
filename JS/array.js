// Array 배열
// 여러 값을 하나로 묶은 자료형
// 인덱스index: 배열 내에서의 데이터 번호

let numbers = [10, 20, 30, "40"];

console.log(numbers[0]);

console.log(numbers.at(-1));

for (const [i, n] of numbers.entries()) {
  console.log(i, n);
}

