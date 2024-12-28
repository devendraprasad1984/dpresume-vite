console.log('powerschool algoritham - finding given sum in list')
const findIfGivenSumExists = () => {
    let givenArray = [undefined, 10, 6, 15, 3, 7, 9]
    let givenSum = 20
    let found = false
    let foundNum = -1
    let tmpArr = []
    for (let i = 0; i < givenArray.length; i++) {
        let num = givenArray[i] //current element in iteration
        if (isNaN(num) === true) continue

        let diff = givenSum - num //store the difference from current element to given sum
        tmpArr = givenArray.filter((x, j) => j > i)
        //check diff from current position to entire array and exit if found and return true
        if (tmpArr.indexOf(diff) !== -1) {
            found = true
            foundNum = num
            break
        }
    }
    tmpArr=[]
    if (found) {
        console.log('found the given sum', givenSum, foundNum, (givenSum - foundNum))
    } else {
        console.log('not found the given sum', givenSum)
    }
}

// findIfGivenSumExists()

const jsIValueLoopCheck=()=>{
    for(i=0;i<3;i++){
        setTimeout(() => {
            console.log(i)
        }, 1000);
    }    
}

jsIValueLoopCheck()

