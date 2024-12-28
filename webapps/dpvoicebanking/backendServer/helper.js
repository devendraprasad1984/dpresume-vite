function getMinMaxObject(transactionObject) {
    let initObj = {indicator: 'NA', info: 'not available', amt: 0, date: ''};
    if (typeof transactionObject === "undefined" || Object.keys(transactionObject).length === 0)
        return {min: initObj, max: initObj};

    let min = transactionObject[0].amt;
    let max = transactionObject[0].amt;
    let minObj = transactionObject[0];
    let maxObj = transactionObject[0];

    for (let line of transactionObject) {
        if (line.amt < min) {
            min = line.amt;
            minObj = line;
        }
        if (line.amt > max) {
            max = line.amt;
            maxObj = line;
        }
    }
    return {min: minObj, max: maxObj};
}

module.exports={
    getMinMaxObject
}