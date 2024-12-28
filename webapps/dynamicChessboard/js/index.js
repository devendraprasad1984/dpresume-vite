const drawChessBoard = (elem, rows = 8, columns = 8) => {
    const myChessBoardDom = document.getElementById(elem)
    let board = []
    for (let row = 0; row < rows; row++) {
        let line = []
        for (let col = 0; col < columns; col++) {
            let odd_even = (row + col) % 2
            let cellColor = odd_even === 0 ? 'black' : 'white'
            line.push(`<span class="cell center ${cellColor}" id="cell_${col}">(${row + 1} - ${col + 1})</span>`)
        }
        board.push(`<div class="line" id="row_${row + 1}">${line.join('')}</div>`)
    }
    myChessBoardDom.innerHTML = board.join('')
}

(function () {
    drawChessBoard('chessboard', 8, 8)
})()
