# siera_ai_fe_tech_challenge, deployed at https://siera-test-dp.herokuapp.com/

### the app is hosted on
    https://dpresume.com/siera.ai

#### to start the app on local, command is:
    npm run dev or yarn dev
#### port is 3004 and can be changed from package.json

#### command to run the test case in console, without coverage is 
    yarn test or npm run test

### antd vs material
    i have chosen antd as design component library for simple reason that i have used in past

#assumptions
#### event Id is unique
#### market Id is unique
#### selection Id is unique
#### api response will never be null or in error
#### hence have not written error boundary component here
#### have used Redux for central state management

### Updating Base Object from API
at market level, I am keeping 2 flags one to check, if its team 2 win and if it is, isTeamSelected for Betting already. so only one selection allowed. On betting removal, the isSelected flag is reset

#appologies:
###### due to short of time, I couldnt write enough test cases for the component and hence not checking coverage as part of this submission
###### I only have written the snapshot checks and api response checks






steps I took to deploy to heroku

brew tap heroku/brew && brew install heroku
curl https://cli-assets.heroku.com/install.sh | sh

heroku login
Create a new Git repository
Initialize a git repository in a new or existing directory

$ cd my-project/
$ git init
$ heroku git:remote -a siera-test-dp
Deploy your application
Commit your code to the repository and deploy it to Heroku using Git.

$ git add .
$ git commit -am "make it better"
$ git push heroku master
You can now change your main deploy branch from "master" to "main" for both manual and automatic deploys, please follow the instructions here.

Existing Git repository
For existing repositories, simply add the heroku remote
$ heroku git:remote -a siera-test-dp

deploy
$ git add .
$ git commit -am "final push on heroku"
$ git push heroku master



heroku create siera-test-dp --buildpack mars/create-react-app


