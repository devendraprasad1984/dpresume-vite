const arr1 = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen' +
' ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
const arr2 = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    numReg = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!numReg) return;
    var str = '';
    str += (numReg[1] != 0) ? (arr1[Number(numReg[1])] || arr2[numReg[1][0]] + ' ' + arr1[numReg[1][1]]) + 'crore ' : '';
    str += (numReg[2] != 0) ? (arr1[Number(numReg[2])] || arr2[numReg[2][0]] + ' ' + arr1[numReg[2][1]]) + 'lakh ' : '';
    str += (numReg[3] != 0) ? (arr1[Number(numReg[3])] || arr2[numReg[3][0]] + ' ' + arr1[numReg[3][1]]) + 'thousand ' : '';
    str += (numReg[4] != 0) ? (arr1[Number(numReg[4])] || arr2[numReg[4][0]] + ' ' + arr1[numReg[4][1]]) + 'hundred ' : '';
    str += (numReg[5] != 0) ? ((str != '') ? 'and ' : '') + (arr1[Number(numReg[5])] || arr2[numReg[5][0]] + ' ' + arr1[numReg[5][1]]) + 'only ' : '';
    return str;
}

function currencyFormat(number) {
    return new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 3}).format(number)
}