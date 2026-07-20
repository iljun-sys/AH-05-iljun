// Timer API

// 1) setTimeout : 일정 시간 후 특정 함수를 한 번 호출하는 기능

// setTimeout(
//   () => console.log("3초 경과"),
//   3000 // 3000ms = 3s
// )

let conter = 1
const timerId = setInterval(
  () => {
    if (counter > 3) {
      clearInterval(timeId)
    }
    console.log("2초 경과", counter),
    counter++    

  },
  2000
)