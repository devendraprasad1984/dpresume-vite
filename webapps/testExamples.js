String.prototype.reverseme = function () {
    return reverseString(this)
}
const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
const sampleLoop = () => {
    console.log('hello')
    let list = [1, 2, 3, 4, 5, 6]
    let obj = {1: 'dev', 2: 'kittu', 3: 'akshat'}
    for (let i in list) {
        console.log(i, list[i])
    }

    for (let i in obj) {
        console.log(i, obj[i])
    }
}
const minMaxIndexes = () => {
    //find min max and sum at indexes
    let array = [
        [1001, 50]
        , [1001, 68]
        , [1002, 69]
        , [1002, 68]
        , [1004, 9], [1004, 13], [1005, 56], [1005, 96], [1005, 30], [1006, 46], [1006, 6], [1006, 48], [1007, 59], [1007, 30], [1007, 9], [1009, 79], [1010, 42], [1012, 37], [1013, 64], [1017, 55], [1018, 29], [1020, 60], [1020, 29], [1021, 44], [1022, 62], [1024, 2], [1025, 6], [1028, 5], [1029, 6], [1029, 82]];
    // find min,max at index 0
    // and 1 and sum up min-max at 0 with index 1
    let [min0, max0, min1, max1] = [array[0][0], array[0][1], array[0][0], array[0][1]]
    for (let i in array) {
        let valArr = array[i]
        if (valArr[0] > max0) max0 = valArr[0]
        if (valArr[1] > max1) max1 = valArr[1]

        if (valArr[0] < min0) min0 = valArr[0]
        if (valArr[1] < min1) min1 = valArr[1]
    }
    console.log('min-max at 0', min0, max0)
    console.log('min-max at 1', min1, max1)
}
// minMaxIndexes()

const findPairSum = (arr, givensum) => {
    let pairSum = []
    for (let i in arr) {
        let curVal = arr[i]
        if (curVal === undefined || curVal === null || isNaN(curVal)) continue
        let diff = givensum - curVal
        if (pairSum.indexOf(diff) === -1 && arr.indexOf(diff) !== -1) {
            pairSum.push(curVal, diff)
        }
    }
    console.log('pair of numbers that equals givan sum', givensum, '=', pairSum)
}

const uniqueAndSort = (ar) => {
    let uniqSortCounter = {}
    for (let i of ar)
        uniqSortCounter[i] = uniqSortCounter[i] === undefined ? 1 : uniqSortCounter[i] + 1
    return uniqSortCounter
    //this is another way of sorting the array, keys are automatically sorted
}
// console.log(makeUnique([1, 2, 3, 9, 8, 5, 5, 3, 3, 3]))

const countForTallestCandle = () => {
    let candles = [1, 2, 3, 5, 5, 3, 3, 3]
    // let sortedCandles=candles.sort((a,b)=>a-b)
    let uniqSort = uniqueAndSort(candles)
    let distinctArr = Object.keys(uniqSort)
    let lengthOfUniqElem = distinctArr.length - 1
    let tallestCandle = distinctArr[lengthOfUniqElem]
    let secondTallestCandle = distinctArr[lengthOfUniqElem - 1]
    let tallestCounter = uniqSort[tallestCandle]
    let secondTallestCounter = uniqSort[secondTallestCandle]
    // for (let i of candles) {
    //     if (i === tallestCandle) tallestCounter++
    //     if (i === secondTallestCandle) secondTallestCounter++
    // }
    console.log('candles', candles, 'unique', uniqSort, 'tallest candle', tallestCandle, '2nd tallest candle', secondTallestCandle)
    console.log('tallest counter', tallestCounter, '2nd tallest counter', secondTallestCounter)
}
// countForTallestCandle()

const reduceTest = () => {
    let sum = [1, 2, 3, 4, 5, 6].reduce((prev, cur, index) => {
        return prev + cur
    }, 0)
    console.log(sum)
}
const functionComposer = (listOfFunctions, initVal) => {
    let res = initVal
    for (let fn of listOfFunctions) {
        res = fn(res)
    }
    return res
}
const foo = initVal => {
    let listofFn = [x => x * 2, x => x + 1, x => x - 5]
    let fn = functionComposer(listofFn, initVal)
    return fn
}
// console.log('functional sequencing as composer pattern call, output of 1 function as input of the other, INIT=',10,'becomes',foo(10))
const reverseString = (string1) => {
    let string2 = ''
    for (let i = string1.length - 1; i >= 0; i--) {
        string2 += string1[i]
    }
    return string2
}
const testArrayStringReverse = () => {
    console.log('1234321', '==', reverseString('1234321'))
    console.log('hello', '==', reverseString('hello'))
    console.log('test', '==', 'test'.reverseme())
    // console.log('[test]', '==', 'test'.split('').reverseme())
}
const countOfObjects = () => {
    let objects = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 5, y: 2}, {x: 1, y: 2}, {x: 3, y: 5}, {x: 4, y: 4}]
    let objCounter = {}
    for (let i in objects) {
        let curObj = objects[i]
        if (curObj.x === curObj.y) objCounter[i] = curObj.x + ', ' + curObj.y
    }
    console.log('objects equals x==y', objCounter, Object.keys(objCounter).length)
}
const quickDateTest = () => {
    var format = 'dd/mm/yyyy hh:mm:ss'
    // var format = 'yyyy-mm-dd hh:mm:ss'
    var newFormatteDate = format;
    var date_test = new Date(Date.now());
    console.log(pad(date_test.getDate(), 2), pad(date_test.getMonth(), 2), pad(date_test.getFullYear(), 4));
    newFormatteDate = newFormatteDate
        .replace('dd', pad(date_test.getDate(), 2))
        .replace('mm', pad(date_test.getMonth(), 2))
        .replace('yyyy', pad(date_test.getFullYear(), 2))
        .replace('hh', pad(date_test.getHours(), 2))
        .replace('mm', pad(date_test.getMinutes(), 2))
        .replace('ss', pad(date_test.getSeconds(), 2))
    console.log("the formatted date of format is " + format + "->" + newFormatteDate)
}
const evenOddMultiplier = () => {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let res = arr.map(x => x % 2 === 0 ? x * 2 : x * 3)
    console.log(arr, res)
}
let brackets = []
const balancedBrackets = (l, r, s) => {
    if (l === 0 && r === 0)
        brackets.push(s)
    if (l > 0)
        balancedBrackets(l - 1, r + 1, s + '(')
    if (r > 0)
        balancedBrackets(l, r - 1, s + ')')
}
// balancedBrackets(3, 0, "")
// console.log('brackets', brackets.join(''))

const isBalancedString = () => {
    let exp = '[()]{}{[()()]()}'
    let openVals = '{[('
    let closeVals = '}])'
    let stack = []
    for (let i of exp) {
        if (openVals.indexOf(i) !== -1)
            stack.push(i)
        else if (closeVals.indexOf(i) !== -1)
            stack.pop()
    }
    console.log('string', exp, 'is', (stack.length === 0 ? 'balanced' : 'not balanced'))
}
const powerset = () => {
    let arr = [1, 2, 3, 4]
    let res = [[]]
    for (let i of arr) {
        let len = res.length
        for (let j = 0; j < len; j++) {
            res.push([...res[j], i])
        }
    }
    console.log('powerset of', arr, 'is', res)
}
// powerset()

const words = ['hello', 'world', 'this is fine!', 'this a final']
const hocUsingReduce = (w1, w2) => {
    if (w1.length > w2.length)
        return w1
    else
        return w2
}
// console.log('longest word is', words.reduce(hocUsingReduce))

const left2RightCompose = () => {
    let funcArr = [
        x => x * 2,
        x => x + 1,
        x => x - 5,
        x => x - 10,
        x => x + 40
    ]
    let iVal = 100
    let res = iVal
    for (let fn of funcArr) {
        res = fn(res)
    }
    console.log('final result of function listing....', iVal, res)
}
const minmaxsum_setof4 = () => {
    let arr = [5, 4, 2, 3, 7]
    let min = Math.min(...arr)
    let max = Math.max(...arr)
    let sum = arr.reduce((p, c) => p + c, 0)
    console.log('min sum', sum - max, 'max sum', sum - min)
}
// minmaxsum_setof4()

const incrementArrayBy1 = (ar) => {
    // let ar = [1, 2, 3]
    // console.log('ar',ar)
    let num = Number(ar.join('')) + 1
    let updatedArr = num.toString().split('').map(x => Number(x))
    return [ar, updatedArr]
}
// console.log(incrementArrayBy1([1,2,3,4]))

const profilingClosure = (func) => {
    return function () {
        let start = new Date()
        let retval = func.apply(this, arguments)
        let end = new Date()
        return {msg: ` took ${end.getTime() - start.getTime()}s to execute`, result: retval}
    }
}
// console.log(profilingClosure(Math.max).call(undefined, [2, 3, 4]))
// console.log(profilingClosure(incrementArrayBy1).call(undefined, [9, 9]))

const singularity = (data) => {
    // data = '15931593950382205972005873020585729295767920094768300288002957529'
    let res = data.split('').reduce((p, c) => p + Number(c), 0)
    // console.log('sum is', res)
    if (res.toString().split('').length > 1)
        return singularity(res.toString())
    else
        return res
}
// console.log(singularity('15931593950'))
// console.log(singularity('15931593950382205972005873020585729295767920094768300288002957529'))

function* testYieldInteger(val) {
    yield val
    yield val + 10
}

//way hack to make chained operation
function* testYieldFuncSeq() {
    yield (p) => {
        // console.log('called first function, param', p)
        return 'first function done'
    }
    yield (p) => {
        console.log('called second function, param', p)
        return '2nd function done'
    }
}

// let testYieldInt = testYieldInteger(10)
// console.log(testYieldInt.next().value, testYieldInt.next().value)
// let seq = testYieldFuncSeq()
// let firstOutput = seq.next().value('nice')
// let secondOutput = seq.next().value(firstOutput)
// console.log(secondOutput)
const chainedBuilderClass = () => {
    let chainedObject = {}
    chainedObject.first = (param) => {
        chainedObject.firstParam = param
        return chainedObject
    }
    chainedObject.second = (param) => {
        chainedObject.secondParam = param
        return chainedObject
    }
    chainedObject.third = (param) => {
        chainedObject.thirdParam = param
        return chainedObject
    }
    chainedObject.build = () => {
        return JSON.stringify(chainedObject)
    }
    return chainedObject
}
// console.log(chainedBuilderClass().first('one').second('2nd').third('third').build())

const testClassVanilaTypes = () => {
    function user(name) {
        this.name = name
        //fine is a property of user
        //arrow function binds this from lexical scope which parent class user in this case and this avoids user to explicitely bind in class
        this.fine = () => {
            return this.name + ' is good lad'
        }
    }

    user.prototype.sayhello = function () {
        return 'hello, ' + this.name + '.'
    }

    let dp = new user('Devendra')
    let jyoti = new user('jyoti')
    let users = [dp, jyoti]
    // console.log(dp.sayhello(), dp.fine())
    // console.log(jyoti.sayhello())
    for (let u of users) {
        console.log(u.sayhello(), u.fine())

    }
}
// testClassVanilaTypes()
const testClassEs6Types = () => {
    class test {
        constructor(name) {
            this.name = name
        }

        sayhello() {
            return 'hi, ' + this.name
        }
    }


    let dpr = new test('dpresume')
    let devn = new test('devendra')
    for (let u of [dpr, devn]) {
        console.log(u.sayhello())
    }
}
// testClassEs6Types()
const testClosure = () => {
    //closure is the concept in js by which nested scope has access to its outer scope irrespective of how and where that variable is defined
    // simple terms
    let name = 'devendra'

    function printName() {
        console.log(name)
    }

    printName() //name is global inside testclosure scope and can be used inside of printName
    name = 'jyoti'
    printName()
    name = 'rajkumar'
    printName()

    //another example
    function outerFunction(outerVariable) {
        const outer2 = 'hi'
        return function (innerVariable) {
            console.log('outer2 variable', outer2)
            console.log('outer variable', outerVariable) //outervariable is accessed inside inner because of closure
            console.log('inner variable', innerVariable)
            console.log('complete sentence', outerVariable + ' - ' + innerVariable)
        }
    }

    let scopeInnerByOuter = outerFunction('devendra')
    scopeInnerByOuter('prasadf')
}
const stairCaseProblem = () => {
    let numberOfTimes = 5
    let res = "\n"
    let space = " "
    let char = '#'
    for (let i = 1; i <= numberOfTimes; i++) {
        res += space.repeat(numberOfTimes - i) + char.repeat(i)
        res += '\n'
    }
    console.log('staircase output', res)
}
// stairCaseProblem()
const binarySearchLogic = (arr, searchValue, start, end) => {
    if (end < start) return false
    let mid = Math.floor((start + end) / 2)
    if (arr[mid] === searchValue) return true
    else if (arr[mid] < searchValue) return binarySearchLogic(arr, searchValue, mid + 1, end)
    else if (arr[mid] > searchValue) return binarySearchLogic(arr, searchValue, start, mid - 1)
}
// let arr = [1, 3, 5, 7, 8, 9]
// console.log('found',binarySearchLogic(arr, 7, 0, arr.length - 1))
const flattenLinkedList = () => {
    function node(data) {
        this.data = data
        this.next = null
        this.child = null
    }

    const newNode = (data) => {
        return new node(data)
    }
    const printNode = (head) => {
        if (!head) return null
        let printList = []
        while (head) {
            printList.push(head.data)
            head = head.next
        }
        console.log('nodes listing', printList.join('->'))
    }
    const flatten = (head) => {
        if (!head) return null
        let stack = [head], cur = null, prev = null
        while (stack.length > 0) {
            cur = stack.pop()
            if (prev) {
                cur.prev = prev
                prev.next = cur
            }
            if (cur.next) {
                stack.push(cur.next)
            }
            if (cur.child) {
                stack.push(cur.child)
                cur.child = null
            }
            prev = cur
        }
        return head
    }

    let child13 = newNode(16)
    child13.child = newNode(3)

    // # Child List of 10
    let head1 = newNode(4)
    head1.next = newNode(20)
    head1.next.child = newNode(2)

    // #Child of 20
    head1.next.next = newNode(13)
    head1.next.next.child = child13

    // # Child of 9
    let child9 = newNode(19)
    child9.next = newNode(15)

    // # Child List of 17
    let child17 = newNode(9)
    child17.next = newNode(8)
    child17.child = child9

    // # Child List of 7
    let head2 = newNode(17)
    head2.next = newNode(6)
    head2.child = child17

    // # Main List
    let head = newNode(10)
    head.child = head1
    head.next = newNode(5)
    head.next.next = newNode(12)
    head.next.next.next = newNode(7)
    head.next.next.next.child = head2
    head.next.next.next.next = newNode(11)

    flatten(head)
    printNode(head)
}
// flattenLinkedList()
const flattenBinaryTreeIntoLinkedList = () => {
    function node(key) {
        this.key = key
        this.left = null
        this.right = null
    }

    const newNode = (key) => new node(key)
    const flatten = (root) => {
        if (!root || (!root.left && root.right))
            return null
        if (root.left) {
            flatten(root.left)
            let tmpRight = root.right
            root.right = root.left
            root.left = null
            let tmp = root.right
            while (tmp.right)
                tmp = tmp.right
            tmp.right = tmpRight
            flatten(root.right)
        }
    }
    let printList = []
    const inorderTraversal = (root) => {
        if (!root) return null
        inorderTraversal(root.left)
        printList.push(root.key)
        inorderTraversal(root.right)
    }
    let root = newNode(1)
    root.left = newNode(2)
    root.right = newNode(5)
    root.left.left = newNode(3)
    root.left.right = newNode(4)
    root.right.right = newNode(6)
    flatten(root)
    inorderTraversal(root)
    console.log('printing binary tree as list traversal', root, printList.join('->'))
}
// flattenBinaryTreeIntoLinkedList()
const longestPalindrome = () => {
    const isPalindrome = (str1) => str1 === str1.split('').reverse().join('')
    const findPalindrome = (stringValue) => {
        if (stringValue === '') return null
        let maxLength = 0, maxString = ''
        for (let i = 0; i < stringValue.length; i++) {
            let strsub = stringValue.substr(i, stringValue.length)
            for (let j = strsub.length; j >= 0; j--) {
                let subsubstr = strsub.substr(0, j)
                if (subsubstr.length <= 1) continue
                if (isPalindrome(subsubstr)) {
                    if (subsubstr.length > maxLength) {
                        maxLength = subsubstr.length
                        maxString = subsubstr
                    }
                }
            }
        }
        return {maxString, maxLength}
    }
    console.log(findPalindrome('abracadabra'))
    console.log(findPalindrome('HYTBCABADEFGHABCDEDCBAGHTFYW12345678987654321ZWETYGDE'))
}
const spiralPrintingOf2DArray = () => {
    //print 2d array matrix in spiral form which mean row->right to end, then down to cols, left to row and the up
    let arr = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 11, 12, 13],
        [14, 15, 16, 17]
    ]
    let spiralObject = []
    let k = 0, m = arr.length, l = 0, n = arr[0].length, i = 0
    console.log(k, m, l, n)
    while (k < m && l < n) {
        for (i = l; i < n; ++i) {
            spiralObject.push(arr[k][i])
        }
        k++
        for (i = k; i < m; ++i) {
            spiralObject.push(arr[i][n - 1])
        }
        n--
        if (k < m) {
            for (i = n - 1; i >= l; --i) {
                spiralObject.push(arr[m - 1][i])
            }
            m--;
        }
        if (l < n) {
            for (i = m - 1; i >= k; --i) {
                spiralObject.push(arr[i][l])
            }
            l++;
        }
    }
    console.log(spiralObject.join('->'))
}
const groupAnagrams = () => {
    let sort = (w) => {
        return w.split('').sort().join('')
    }
    let check = (w1, w2) => {
        return sort(w1) === sort(w2)
    }
    let words = [
        "CARS", "REPAID", "DUES", "NOSE", "SIGNED", "LANE",
        "PAIRED", "ARCS", "GRAB", "USED", "ONES", "BRAG",
        "SUED", "LEAN", "SCAR", "DESIGN"]
    let res = {}
    for (let w of words) {
        let sorted = sort(w)
        if (res[sorted])
            res[sorted].push(w)
        else
            res[sorted] = [w]
    }
    console.log('listing by anagrams', res)
}
// groupAnagrams()
const findDuplicates = () => {
    let arr = [1, 2, 3, 4, 4, 4, 5, 6, 6]
    let counter = {}
    for (let i of arr) {
        if (counter[i] !== undefined)
            counter[i] = counter[i] + 1
        else
            counter[i] = 1
    }
    for (let i in counter) {
        if (counter[i] > 1) {
            console.log('value: ', i, 'duplicate count', counter[i])
        }
    }
}
const findDuplicates_1 = () => {
    let arr = [1, 2, 3, 4, 4, 5, 6, 6, 6]
    let len = arr.length
    let prevElem = arr[0], el = arr[0]
    for (let i = 0; i < len; i++) {
        if (i > arr.length) break
        if (prevElem == arr[i]) {
            continue
        }
        let el = arr[i]
        let counterOccurance = 1
        for (let j = i + 1; j < len; j++) {
            if (el !== arr[j]) continue
            counterOccurance++
        }
        prevElem = el
        if (counterOccurance > 1)
            console.log('element occurance', el, counterOccurance, 'times')
    }
}
// findDuplicates_1()
const pairSum = () => {
    let arr = [1, 2, 3, 4, 5, 6, 7]
    let sum = 9
    let len = arr.length
    for (let i = 0; i < len; i++) {
        let diff = sum - arr[i]
        for (let j = i; j < len; j++) {
            if (diff === arr[j])
                console.log('pair is', arr[i], arr[j])
        }
    }
}
const rotateAnArrayAtPivot = () => {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let newArray = []
    let merge = []
    let pivot = 4
    for (let i = 0; i < pivot; i++) {
        let v = arr[i]
        newArray.push(v)
        arr[i] = 0
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) merge.push(arr[i])
    }
    console.log(arr, newArray, [...merge, ...newArray])
}
// rotateAnArrayAtPivot()
const columnizeArray = () => {
    let arr = [
        [1, 5, 9],
        [2, 6, 10],
        [3, 7, 11],
        [4, 8, 12]
    ]
    //output=[1,2,3,4,5,6,7,8,9,10,11,12]
    let newArr = []
    let rows = arr.length
    let cols = arr[0].length
    for (let i = 0; i < cols; i++) {
        // let cell = arr[(i * cols + Math.floor(i / rows)) * rows]
        for (let j = 0; j < rows; j++) {
            let cell = arr[j][i]
            console.log(cell)
        }
    }
}
// columnizeArray()
const countNumber = (num) => {
    return Math.ceil(Math.log(num + 1) / Math.LN10)
}
// console.log(countNumber(777777777777777777777777777777))
const debounce = (fn, wait) => {
    // The debounce() function forces a function to wait a certain amount of time before running again.
    // The function is built to limit the number of times a function is called.
    // The function aims to reduce overhead by preventing a function from being called several times
    // in succession.
    let timeout;
    return function () {
        let context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(context, arguments);
        }, wait);
    }
}
const throtleCheck = () => {
    console.log('throttle example')
}
const jsTrick1 = () => {
    var myObject = {
        foo: "bar",
        func: function () {
            var self = this;
            console.log("outer func:  this.foo = " + this.foo);
            console.log("outer func:  self.foo = " + self.foo);
            (function () {
                console.log("inner func:  this.foo = " + this.foo);
                console.log("inner func:  self.foo = " + self.foo);
            }());
        }
    };
    myObject.func();
}
const jsTrick2 = () => {
    (function () {
        var a = b = 3;
    })();

    console.log("a defined? " + (typeof a !== 'undefined'));
    console.log("b defined? " + (typeof b !== 'undefined'));
}
const promiseTestPlusMinus = () => {
    const createPromise = (x) => {
        return new Promise((resolve, reject) => {
            if (x)
                resolve(x)
            else
                reject('failed')
        })
    }
    const plus = async (num) => {
        return num + await createPromise(5) + await createPromise(10)
    }
    const minus = async (num) => {
        return num - await createPromise(2) - await createPromise(5)
    }
    let number = 40
    let promiseResult = plus(number).then(data => minus(data).then(res => res).catch(err => err))
    promiseResult.then(r => {
        console.log('promise plus minus: ', number, ' = ', r)
    })

}
//promiseTestPlusMinus()
const thisContextChange = () => {
    var hero = {
        _name: 'John Doe',
        getSecretIdentity: function () {
            return this._name;
        }
    }
    let stoleSecretIdentity = hero.getSecretIdentity;
    console.log(stoleSecretIdentity());
    console.log(hero.getSecretIdentity());
}
// thisContextChange()
const lengthKnowledgeCheck = () => {
    let length = 10;

    function fn() {
        console.log('length', this.length);
    }

    let obj = {
        length: 5,
        method: function (fn) {
            // console.log(fn, arguments)
            fn();
            arguments[0]();
        }
    }
    obj.method(fn, 1)
}
// lengthKnowledgeCheck()

const checkoutput1 = () => {
    (function () {
        try {
            throw new Error();
        } catch (x) {
            var x = 1, y = 2;
            console.log('inside error', x);
        }
        console.log(x);
        console.log(y);
    })();
}
// checkoutput1()


//
// var d = {};
// [ 'zebra', 'horse' ].forEach(function(k) {
//     d[k] = undefined;
// });
// console.log(Object.values(d), Object.keys(d))
//
const coronaSequenceTest = () => {
    function checkCorona(V, B, N) {
        // let V = 'coronavirus'
        // let N = 3
        // let B = ['abcde', 'crnas', 'onarous']
        let result = []
        for (let seq of B) {
            if (seq === '') continue
            let foundAt = -1
            let positive = false
            let foundCounter = 0
            for (let k = 0; k < seq.length; k++) {
                let chr = seq[k]
                for (let j = foundAt + 1; j < V.length; j++) {
                    let chrV = V[j]
                    if (chr === chrV) {
                        foundAt = j
                        foundCounter = foundCounter + 1
                        break
                    }
                }
            }
            if (seq.length === foundCounter) {
                positive = true
            }
            result.push(seq + '===>' + (positive ? ' - POSITIVE' : ' - NEGATIVE'))
        }
        return result
    }


    let input_stdin_array = ['coronavirus', '3', 'abcde', 'crnas', 'onarous', '']
    let [V, N, ...B] = input_stdin_array
    let output = checkCorona(V, B, N)
    console.log(V, '\n', output.join('\n'));
}
// coronaSequenceTest()

const longestValidParenthesis = () => {
    // let str = ')()())'
    // let str = '(()'
    // let str="()(())"
    // let str="(()()"
    let str = '()(()))()'
    if (str.length <= 1) return 0
    let s1 = '('
    let s2 = ')'
    let foundStart = 0
    let stack = []
    let stack2 = []
    for (let i of str) {
        if (i === s1) {
            foundStart = foundStart + 1
            stack.push(i)
            stack2.push(i)
        } else if (i === s2 && foundStart >= 1) {
            stack.push(i)
            stack2.pop()
            foundStart = foundStart - 1
        }
    }
    let res = stack.length - stack2.length
    console.log('length of longest valid ', str, stack, stack2)
}
// longestValidParenthesis()

const maxSumLessGiveSum = () => {
    let K = 60
    let sum = 0
    let arr = [1, 2, 34, 25, 54, 75, 43]
    //let filter = arr.filter(x => x < K).sort((a, b) => a - b)
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            let innerSum = arr[i] + arr[j]
            if (innerSum > K) break
            sum = innerSum
        }
    }
    console.log(arr, K, sum)
}
const leastCommonInterestOutOf2Lists = () => {

}
// maxSumLessGiveSum()
const checkArrayElementUsingBinarySearchAndInsertAtRelevantPosIfNotFound = () => {
    let isFound = false
    let found = {}

    function findElementPosUsingBinary(start, end, elementValue) {
        let startX = start
        let endX = end
        let mid = Math.floor((start + end) / 2)
        // if (end > start) found = {start, mid, end, found: false}
        let check = elementValue === arr[mid]
        if (check === true || end > start) {
            found = {start, mid, end, found: check}
            isFound = true
        } else if (elementValue > arr[mid]) {
            startX = mid + 1
        } else if (elementValue < arr[mid]) {
            endX = mid - 1
        }
        if (isFound === false) {
            findElementPosUsingBinary(startX, endX, elementValue)
        }
    }

    arr = [1, 2, 5, 6, 8, 9]
    let element = 5
    findElementPosUsingBinary(0, arr.length - 1, element)
    // let isFound = found['foundAt'] !== -1
    // let newArray = !isFound ? [...arr, element].sort((a, b) => a - b) : arr
    if (found['found'] === false) arr.splice(found['start'], 0, element)
    console.log(arr, found)
}

const createEveryCombinationInAString = () => {
    //generate all possible combinations of a string
    let str = 'abc'
    // let len=Math.pow(2*str.length)
    let len = str.length
    let res = []
    res.push(str)
    for (let i = 0; i < len; i++) {
        for (let j = i; j < len; j++) {
            let substr = str.substr(i, j)
            if (substr.length !== 0)
                res.push(str.substr(i, j))
        }
    }
    console.log(res)
}

// createEveryCombinationInAString()
// checkArrayElementUsingBinarySearchAndInsertAtRelevantPosIfNotFound()

const swapCaseAndNumbers = () => {
    function switchCase(char) {
        if (typeof char !== "string") return ''

        let charCode = char.charCodeAt(0)
        if (charCode >= 65 && charCode <= 90)
            return char.toLowerCase()
        else if (charCode >= 97 && charCode <= 122)
            return char.toUpperCase()
        else
            return char
    }

    function swap(param) {
        let newParam = '';
        let numFirstFound = false
        let firstNumIndex = -1
        for (let index in param) {
            let chr = param[index]
            let isnum = (isNaN(chr) === false && chr !== ' ')

            // if(isnum){
            //   console.log(isnum, chr, index)
            // }

            if (chr === ' ') {
                numFirstFound = false
                firstNumIndex = -1
                newParam += chr
            } else if (isnum === true && index !== firstNumIndex && numFirstFound === true) {
                //console.log('found 2nd number',chr, 'at', index)
                let tmp = newParam.split('')
                tmp[firstNumIndex] = param[index]
                newParam = tmp.join('').toString() + param[firstNumIndex]
                //newParam+=param[firstNumIndex]
                //console.log('updated',param[index], param[firstNumIndex], newParam)
                numFirstFound = false
                firstNumIndex = -1
            } else if (isnum === true && firstNumIndex === -1 && numFirstFound === false) {
                //console.log('found 1st number',chr,'at',index)
                firstNumIndex = index
                numFirstFound = true
                newParam += chr
            } else {
                newParam += switchCase(chr)
            }
        }
        return newParam;
    }

    let str1 = swap("6Hello4 -8World, 7 yes3")
    console.log(str1);
    console.log(swap("Hello -5LOL6du5d4e"));
    // console.log(swap("2S 6 du5d4e"));
}
// swapCaseAndNumbers()

const CountingAnagrams = (str) => {
    let anagramObject = {}
    let words = str.split(' ')
    let anagramCounter = 0
    for (let w of words) {
        if (w.length == 1) continue
        let sortChars = w.split('').sort((a, b) => b.charCodeAt(0) - a.charCodeAt(0)).join('')
        if (anagramObject[sortChars] === undefined) {
            anagramObject[sortChars] = [w]
        } else {
            let temp = anagramObject[sortChars]
            temp.push(w)
            let uniqVals = [...new Set(temp)]
            anagramObject[sortChars] = uniqVals
        }
    }
    for (let key in anagramObject) {
        let vals = anagramObject[key]
        if (vals.length > 1 || vals.indexOf(key.toString()) >= 0) {
            anagramCounter += 1
        }
    }
    return anagramCounter;
}
const quickSortExample = () => {
    const quicksort_recursion = arr =>
        arr.length <= 1
            ? arr
            : [
                ...quicksort_recursion(arr.slice(1).filter((el) => el < arr[0])),
                arr[0],
                ...quicksort_recursion(arr.slice(1).filter((el) => el >= arr[0])),
            ];
    let counter = 0

    function quicksort_swap(array) {
        if (array.length <= 1) {
            return array;
        }

        counter += 1
        var pivot = array[0];
        var left = [];
        var right = [];
        console.log('iterating', counter)
        for (var i = 1; i < array.length; i++) {
            array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
        }

        return quicksort_swap(left).concat(pivot, quicksort_swap(right));
    };

    const arr = [10, 6, 7, 4, 7, 3, 2, 1, 0]
    console.log('array', arr, 'FASTEST: quick sort example (best/average-OnLogn, worst: 0n^2)', quicksort_swap(arr))
}

// findPairSum([undefined, 10, 6, 15, 3, 7, 9,12,21,1], 22)


const powerSchoolTest = () => {
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
        tmpArr = []
        if (found) {
            console.log('found the given sum', givenSum, foundNum, (givenSum - foundNum))
        } else {
            console.log('not found the given sum', givenSum)
        }
    }

    findIfGivenSumExists()
    const jsIValueLoopCheck = () => {
        for (i = 0; i < 3; i++) {
            setTimeout(() => {
                console.log(i)
            }, 1000);
        }
    }
    jsIValueLoopCheck()
}
const symmetricalDiffrences = () => {
    /*
    reducer problem
        The mathematical term symmetric difference (△ or ⊕) of two sets is the set of elements which are in either of the two sets but not in both. For example, for sets A = {1, 2, 3} and B = {2, 3, 4}, A △ B = {1, 4}.
        Symmetric difference is a binary operation, which means it operates on only two elements. So to evaluate an expression involving symmetric differences among three elements (A △ B △ C), you must complete one operation at a time.
        Thus, for sets A and B above, and C = {2, 3}, A △ B △ C = (A △ B) △ C = {1, 4} △ {2, 3} = {1, 2, 3, 4}.
        sym([1, 2, 3], [5, 2, 1, 4]) should return [3, 4, 5].
        Passed: sym([1, 2, 3], [5, 2, 1, 4]) should contain only three elements.
        Passed: sym([1, 2, 3, 3], [5, 2, 1, 4]) should return [3, 4, 5].
        Passed: sym([1, 2, 3, 3], [5, 2, 1, 4]) should contain only three elements.
        Passed: sym([1, 2, 3], [5, 2, 1, 4, 5]) should return [3, 4, 5].
        Passed: sym([1, 2, 3], [5, 2, 1, 4, 5]) should contain only three elements.
        sym([1, 2, 5], [2, 3, 5], [3, 4, 5]) should return [1, 4, 5]
        sym([1, 2, 5], [2, 3, 5], [3, 4, 5]) should contain only three elements.
        sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5]) should return [1, 4, 5].
        Passed: sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5]) should contain only three elements.
        sym([3, 3, 3, 2, 5], [2, 1, 5, 7], [3, 4, 6, 6], [1, 2, 3]) should return [2, 3, 4, 6, 7].
        sym([3, 3, 3, 2, 5], [2, 1, 5, 7], [3, 4, 6, 6], [1, 2, 3]) should contain only five elements.
        sym([3, 3, 3, 2, 5], [2, 1, 5, 7], [3, 4, 6, 6], [1, 2, 3], [5, 3, 9, 8], [1]) should return [1, 2, 4, 5, 6, 7, 8, 9].
        sym([3, 3, 3, 2, 5], [2, 1, 5, 7], [3, 4, 6, 6], [1, 2, 3], [5, 3, 9, 8], [1]) should contain only eight elements.
    * */

    function symdiff(arr1, arr2) {
        let arr = []
        for (let i of arr1) {
            if (arr.indexOf(i) !== -1 || arr2.indexOf(i) !== -1) continue
            arr.push(i)
        }
        for (let i of arr2) {
            if (arr.indexOf(i) !== -1 || arr1.indexOf(i) !== -1) continue
            arr.push(i)
        }
        return arr
    }

    function sym(...args) {
        return args.reduce(symdiff)
    }

    let res = sym([1, 2, 3], [5, 2, 1, 4])
    // let res = sym([1, 2, 5], [2, 3, 5], [3, 4, 5])
    // let res = sym([1, 2, 3, 3], [5, 2, 1, 4])
    console.log('result', res)
}
const updateInventoryInArray = () => {
    //Compare and update the inventory stored in a 2D array against a second 2D array of a fresh delivery. Update the current existing inventory item quantities (in arr1). If an item cannot be found, add the new item and quantity into the inventory array. The returned inventory array should be in alphabetical order by item.
    /*
    The function updateInventory should return an array.
        updateInventory([[21, "Bowling Ball"], [2, "Dirty Sock"], [1, "Hair Pin"], [5, "Microphone"]], [[2, "Hair Pin"], [3, "Half-Eaten Apple"], [67, "Bowling Ball"], [7, "Toothpaste"]]) should return an array with a length of 6.
        updateInventory([[21, "Bowling Ball"], [2, "Dirty Sock"], [1, "Hair Pin"], [5, "Microphone"]], [[2, "Hair Pin"], [3, "Half-Eaten Apple"], [67, "Bowling Ball"], [7, "Toothpaste"]]) should return [[88, "Bowling Ball"], [2, "Dirty Sock"], [3, "Hair Pin"], [3, "Half-Eaten Apple"], [5, "Microphone"], [7, "Toothpaste"]].
        updateInventory([[21, "Bowling Ball"], [2, "Dirty Sock"], [1, "Hair Pin"], [5, "Microphone"]], []) should return [[21, "Bowling Ball"], [2, "Dirty Sock"], [1, "Hair Pin"], [5, "Microphone"]].
        updateInventory([], [[2, "Hair Pin"], [3, "Half-Eaten Apple"], [67, "Bowling Ball"], [7, "Toothpaste"]]) should return [[67, "Bowling Ball"], [2, "Hair Pin"], [3, "Half-Eaten Apple"], [7, "Toothpaste"]].
        updateInventory([[0, "Bowling Ball"], [0, "Dirty Sock"], [0, "Hair Pin"], [0, "Microphone"]], [[1, "Hair Pin"], [1, "Half-Eaten Apple"], [1, "Bowling Ball"], [1, "Toothpaste"]]) should return [[1, "Bowling Ball"], [0, "Dirty Sock"], [1, "Hair Pin"], [1, "Half-Eaten Apple"], [0, "Microphone"], [1, "Toothpaste"]].
    */

    function updateInventory(arr1, arr2) {
        return arr1;
    }

    // Example inventory lists
    var curInv = [
        [21, "Bowling Ball"],
        [2, "Dirty Sock"],
        [1, "Hair Pin"],
        [5, "Microphone"]
    ];

    var newInv = [
        [2, "Hair Pin"],
        [3, "Half-Eaten Apple"],
        [67, "Bowling Ball"],
        [7, "Toothpaste"]
    ];

    updateInventory(curInv, newInv);
}

const minWindowSubstring = () => {
    // Min Window Substring
    // Have the function MinWindowSubstring(strArr) take the array of strings stored in strArr,
    // which will contain only two strings, the first parameter being the string N and the second parameter being a string
    // K of some characters, and your goal is to determine the smallest substring of N that contains all the characters in K.
    // For example: if strArr is ["aaabaaddae", "aed"] then the smallest substring of N that contains the characters a, e, and d is
    // "dae" located at the end of the string. So for this example your program should return the string dae.
    //Another example: if strArr is ["aabdccdbcacd", "aad"] then the smallest substring of N that contains all
    //of the characters in K is "aabd" which is located at the beginning of the string. Both parameters will be strings
    //ranging in length from 1 to 50 characters and all of K's characters will exist somewhere in the string N.
    //Both strings will only contains lowercase alphabetic characters.
    // Examples
    // Input: ["ahffaksfajeeubsne", "jefaa"]
    // Output: aksfaje
    // Input: ["aaffhkksemckelloe", "fhea"]
    // Output: affhkkse
    const checkLowerSubstringExistance = (arr) => {
        const foundAllOfK = (str) => {
            const strK = arr[1].split('')
            const sliceArr = str.split('')
            //find if all characters in strK exists in myslice
            let kCount = strK.length
            let foundCount = 0
            for (let k = 0; k < kCount; k++) {
                if (sliceArr.indexOf(strK[k]) !== -1) foundCount += 1
            }
            return foundCount >= kCount
        }

        const strN = arr[0]
        const strK = arr[1].split('')
        for (let i = strK.length, len = strN.length; i <= len; i++) {
            for (let j = 0; j <= len - i; j++) {
                let myslice = strN.substr(j, i)
                if (foundAllOfK(myslice) === true) {
                    return 'found-' + myslice
                }
            }
        }
        return 'not found'
    }
    console.log(checkLowerSubstringExistance(["ahffaksfajeeubsne", "jefaa"]))
}
// minWindowSubstring()


const arrayNestingMain = () => {
    //leetcode problem
    // You are given an integer array nums of length n where nums is a permutation of the numbers in the range [0, n - 1].
    //
    //     You should build a set s[k] = {nums[k], nums[nums[k]], nums[nums[nums[k]]], ... } subjected to the following rule:
    //
    //     The first element in s[k] starts with the selection of the element nums[k] of index = k.
    //     The next element in s[k] should be nums[nums[k]], and then nums[nums[nums[k]]], and so on.
    //     We stop adding right before a duplicate element occurs in s[k].
    //     Return the longest length of a set s[k].
    //
    // Input: nums = [5,4,0,3,1,6,2]
    // Output: 4
    // Explanation:
    //     nums[0] = 5, nums[1] = 4, nums[2] = 0, nums[3] = 3, nums[4] = 1, nums[5] = 6, nums[6] = 2.
    // One of the longest sets s[k]:
    // s[0] = {nums[0], nums[5], nums[6], nums[2]} = {5, 6, 2, 0}
    //Input: nums = [0,1,2]
    // Output: 1

    var arrayNesting = function (nums) {
        if (nums.length === 0) return []
        if (nums.length === 1) return nums

        let isDuplicateFound = false
        let obj = {}
        let maxLen = 0
        for (let i of nums) {
            let curIterIndex = i
            let res = [curIterIndex]
            while (!isDuplicateFound) {
                let valueAtIndex = nums[curIterIndex]
                isDuplicateFound = res.indexOf(valueAtIndex) !== -1
                if (!isDuplicateFound) {
                    res.push(valueAtIndex)
                    curIterIndex = valueAtIndex
                }
            }
            obj[i] = res
            maxLen = res.length > maxLen ? res.length : maxLen
            // console.log('running for ', i, res)
        }
        return {maxLen, obj}
    };
    // console.log(arrayNesting([5, 4, 0, 3, 1, 6, 2])) //4
    console.log(arrayNesting([0, 2, 1])) //2
}

arrayNestingMain()
