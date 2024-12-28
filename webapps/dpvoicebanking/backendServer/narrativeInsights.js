const {getMinMaxObject} = require('./helper');


const symbols = {
    inr: '₹'
    , pound: '£'
}

function generateSummary() {
    let mainStr = []
    mainStr.push('<div>Welcome Mr Prasad,</div>');
    mainStr.push('<div>Bank Loan in your account ending 8 7 8 7 has decreased by 10 percent since you taken it in 2018 due to interest rate being changed by 1 basis points and your principal repayment of <span class="red">1200000</span>. You have a total deposit of <span class="green">' + symbols.inr + '5000000</span> and you regularly receive <span class="green">' + symbols.inr + '500000</span> as part of your salary. Your majors spends are in clothing, for example, <span class="red">' + symbols.inr + '30000</span> and leisure, for example, <span class="red">' + symbols.inr + '200000</span> but  not too worry, we are with you to maintain funds. We have some savings offers for you, would you want to proceed?</div>');
    console.log(mainStr.join(''));
    return mainStr.join('');
}

function generateMoratorium() {
    let mainStr = []
    mainStr.push('<div>You have moratorium activated on acount ending 8 7 8 7, Your next due is in 10 september 2020. There is not request being submitted on account ending 9 8 9 8, would you want to generate a request</div>');
    mainStr.push('<div>We have created one for you and sent consent link to your registered email</div>');
    console.log(mainStr.join(''));
    return mainStr.join('');
}

function generateTop5() {
    let mainStr = []
    mainStr.push('<div>Welcome, Your total Debit and Credits are <span class="red">' + symbols.pound + '1600000</span> and <span class="green">' + symbols.pound + '2200000</span> respectively</div>');
    mainStr.push('<div><li>your current balances is  <span class="purple">' + symbols.pound + '9889098</span> and home loan outstanding is  <span class="red">' + symbols.pound + '12000000</span> running at current rate of 6 point 95 which is 45 basis points down from original rate,</li></div>');
    mainStr.push('<div><li>you need to redo KYC as soon as possible,</li></div>');
    mainStr.push('<div><li>you have recent debits of <span class="orange">100, 145, 10</span> pounds for insurance premium, upi to account ending 7 6 3 5 and lower monthly average balance,</li></div>');
    mainStr.push('<div><li>you have received your salary of amount <span class="green">548754</span> 2 days back. Enjoy Spending,</li></div>');
    mainStr.push('<div><li>3 of your deposits totalling <span class="green">300000</span> are going to mature within 2 months. Congrats</li></div>');
    console.log(mainStr.join(''));
    return mainStr.join('');
}

function generateOffers() {
    let mainStr = []
    mainStr.push('<div>avail a personal loan of upto 1000000 at rate of 9.75 per Annum reducing,</div>');
    mainStr.push('<div>we can drop cash to your registered home, just say alexa i need cash on 7 aug 2020 by 5 pm,</div>');
    mainStr.push('<div>we have special previledged credit cards for your spouse, Aishwarya , whose your nominee also</div>');
    console.log(mainStr.join(''));
    return mainStr.join('');
}

function generateInsight(transactions,balances,accTransId){
    let transactionsOnly = transactions['Data']['Transaction'];
    let transSubset = [];
    for (let trow in transactionsOnly) {
        let row = transactionsOnly[trow];
        if (row.AccountId !== accTransId) continue;
        transSubset.push({
            indicator: row.CreditDebitIndicator,
            info: row.TransactionInformation,
            amt: parseFloat(row.Amount.Amount || 0),
            date: row.BookingDateTime.substring(0, 10)
        });
    }
    let allCredits = transSubset.filter(x => x.indicator === 'Credit');
    let allDebits = transSubset.filter(x => x.indicator === 'Debit');
    // console.log(transSubset, allCredits, allDebits);
    let maxCredit = getMinMaxObject(allCredits).max;
    let maxDebit = getMinMaxObject(allDebits).max;
    console.log('MAX', maxCredit, maxDebit)
    let balanceAmt=balances.Data.Balance[0].Amount.Amount;
    let balanceCurrency=balances.Data.Balance[0].Amount.Currency;
    let mainStr = [];
    mainStr.push('<div>Welcome Mr Prasad,</div>');
    if(typeof balances!=='undefined')
        mainStr.push('<div>Your current account balance is '+balanceCurrency+' <span class="bgpurple">'+balanceAmt+'</span></div>');
    mainStr.push('<div>You have received ' + maxCredit.info + ' on ' + maxCredit.date + ' as sum of <span class="bggreen"> ' + symbols.inr + maxCredit.amt + '</span> and spent <span class="bgred"> ' + symbols.inr + maxDebit.amt + '</span> on ' + maxDebit.info + ' dated ' + maxDebit.date + '</div>');
    console.log(mainStr.join(''));
    return mainStr.join('');
}


module.exports={
    generateSummary
    ,generateOffers
    ,generateMoratorium
    ,generateTop5
    ,generateInsight
}