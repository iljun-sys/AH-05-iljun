// 함수 인풋 -> 아웃풋
// 1. 입력 -> 처리 -> 출력
// 2. 코드를 묶어서 이름을 붙이고 재사용 

// 함수의 특징
// 1. 호출 call -> 실행 execute 
// 모든 함수는 반드시 return 한다. 
// return 문이 없으면 기본값 반환 (none, undefined)



function add(n1, n2) {
  // let result = n1 + n2
  return n1 + n2
}

// 함수 호출
f = add(10, 5)

console.log(f)
