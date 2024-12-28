const colors = require('colors/safe');
const ConfigError = require('./config-error');
const clipboardy = require('clipboardy');
const config = require('./config.json');
const {waitForClipboardStartingWith} = require('./clipboard-utils');
const {
	retrieveAccessToken,
	createAccountAccessConsent,
	authoriseProgramatically,
	authoriseManually,
} = require('./api');
let authorisedAccessToken=undefined;
let authorisationCode=undefined;

const {startServer}=require('./exposeREST');

async function authoriseAndGetAccounts(manualAuthorisation = false) {
	try {
		console.log('Getting initial access token...');
		const accessToken = await retrieveAccessToken();
		//console.log('access token is',accessToken);

		console.log(`Access Token: ${format(accessToken)}. Creating consent...`);
		const consentId = await createAccountAccessConsent(accessToken);
		//console.log('consent id ',consentId);

		console.log(`Consent ID: ${format(consentId)}. Authorising...`);
		authorisationCode = manualAuthorisation
			? await startManualAuthorisation(consentId)
			: await authoriseProgramatically(consentId);

		console.log(`Authorisation code received: ${format(authorisationCode)}. Retrieving authorised access token...`);
		authorisedAccessToken = await retrieveAccessToken(authorisationCode);
		//console.log('authorisedAccessToken',authorisedAccessToken);
		startServer(authorisedAccessToken);

		// console.log(`Access Token: ${format(authorisedAccessToken)}. Retrieving users accounts...`);
		// const accounts = await getAccounts(authorisedAccessToken);
		// console.log(JSON.stringify(accounts, null, 4));

	} catch (error) {
		if (error instanceof ConfigError)
			console.log('Configuration error: ', error.message);
		else
			throw error;
	}
}

// async function getAccounts(){
// 	const accounts = await getAccounts(authorisedAccessToken);
// 	console.log('accounts are', accounts);
// }
//
// async function getTransactions(){
// 	const accountNumbers=['3d781807-fe4e-4832-9b79-5fea330c1d04','7ae8ec7e-b0be-4a3e-ab76-02d254027ad3']
// 	const accounts = await getTransactions(authorisedAccessToken,accountNumbers[0],0);
// 	console.log('accounts are', accounts);
// }


async function startManualAuthorisation(consentId) {
	return await authoriseManually(consentId, async userAuthorisationUrl => {
		await clipboardy.write(userAuthorisationUrl);

		console.log();
		console.log('Url for manual authorisation copied to clipboard, launch in a browser to proceed.');
		console.log('Once complete, copy the redirected URL to continue...');
		console.log();

		return await waitForClipboardStartingWith(`https://${config.teamDomain}/redirect`);
	});
}

function format(item) {
	return colors.magenta(item.length > 50
		? (item.substring(0, 50) + '…')
		: item);
}

authoriseAndGetAccounts(process.argv[2] === 'manual');
