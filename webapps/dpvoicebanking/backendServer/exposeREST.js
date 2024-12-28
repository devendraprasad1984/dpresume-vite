const express = require('express');
const cors = require('cors');
const {getAccounts, getTransactions, getBalances, getProduct, getDirectDebits} = require('./api');
const ConfigError = require('./config-error');
const config = require('./config.json');
const {generateMoratorium, generateOffers, generateSummary, generateTop5, generateInsight} = require('./narrativeInsights');
let authToken = undefined;

var corsOptions = {
    origin: config.localServer,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
app.use(express.json());

app.get('/', cors(corsOptions), (req, res) => {
    res.send('<h1>Welcome to VB-VoiceBanking, By Devendra Prasad, +91 9582797772, devendraprasad1984@gmail.com, dpresume.com</h1>');
});

app.get('/api/cust', cors(corsOptions), async (req, res) => {
    res.send(config.customerNumber);
});

app.get('/api/accounts', cors(corsOptions), async (req, res) => {
    try {
        console.log('auth token from ob api', authToken);
        const accounts = await getAccounts(authToken);
        console.log('accounts are', accounts);
        res.send(accounts);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});
app.get('/api/summary', cors(corsOptions), async (req, res) => {
    res.send(generateSummary())
});
app.get('/api/moratorium', cors(corsOptions), async (req, res) => {
    res.send(generateMoratorium())
});
app.get('/api/top5', cors(corsOptions), async (req, res) => {
    res.send(generateTop5())
});
app.get('/api/offers', cors(corsOptions), async (req, res) => {
    res.send(generateOffers())
});

app.get('/api/transactions/:page/:accountId', cors(corsOptions), async (req, res) => {
    try {
        console.log('getting transactions', authToken, req.params);
        const transactions = await getTransactions(authToken, req.params.page, req.params.accountId);
        // console.log('accounts are', transactions);
        res.send(transactions);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});
app.get('/api/balances/:accountId', cors(corsOptions), async (req, res) => {
    try {
        console.log('getting balances', authToken, req.params);
        const transactions = await getBalances(authToken, req.params.accountId);
        // console.log('accounts are', transactions);
        res.send(transactions);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});

app.get('/api/product/:accountId', cors(corsOptions), async (req, res) => {
    try {
        console.log('getting product', authToken, req.params);
        const transactions = await getProduct(authToken, req.params.accountId);
        // console.log('accounts are', transactions);
        res.send(transactions);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});

app.get('/api/direct-debits/:accountId', cors(corsOptions), async (req, res) => {
    try {
        console.log('getting direct debits', authToken, req.params);
        const transactions = await getDirectDebits(authToken, req.params.accountId);
        // console.log('accounts are', transactions);
        res.send(transactions);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});

app.get('/api/insight/:accountId', cors(corsOptions), async (req, res) => {
    try {
        console.log('getting transaction insights', authToken, req.params);
        let accTransId = req.params.accountId;
        const transactions = await getTransactions(authToken, '*', accTransId);
        const balances = await getBalances(authToken, accTransId);
        res.send(generateInsight(transactions,balances, accTransId));
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});

const startServer = function (authorisedAccessToken) {
    authToken = authorisedAccessToken;
    const port = process.env.PORT || 6200;
    app.listen(port, () => console.log(`Listening on port ${port}..`));

}

module.exports = {
    startServer
}