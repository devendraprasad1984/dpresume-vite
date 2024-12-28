######################

## MSPAPI #

######################

_A main web api repository for MSP_

########################

## Setup Linting on Save

#########################

* Navigate from the top menu to `File > Preferences > Settings`
* Select the `Workspace` tab
* In the search bar type `Code Actions On Save`
* From the results, click the link `Edit in settings.json`
* under the `settings` copy/paste following (without *):
* --------------------------------------------------------------------------------------------------
* "editor.codeActionsOnSave": {
*    	"source.fixAll.eslint": true
* },
* "eslint.validate": ["typescript"]
* --------------------------------------------------------------------------------------------------
* Save

###################

## To run locally #

###################

* YOU NEED 2 TERMINALS TO RUN API LOCALLY!
* In Terminal 1 (Bash) run command to connect to the jump-server through SSH
* $ `npm run connect`
* When prompted for password, type in your ssh key password and hit Enter
*
* In a terminal 2 run setup (this will run install pull latest packages and retrieve db info/schema then generate db
  client for you)
* $ `npm run setup`
* Optionally, you can run build to ensure that your code is building correctly / no issues running it
* OPTIONAL: `npm run build`
* Run the API locally on ports 5000-500x
* $ `npm run start`
* this command starts `nodemon` and `ts-node` watching over `*.ts` files for any changes and restarting server
  automatically

########################

## Feature development #

########################

* There are three main branches:
    * master - Will be deployed to production
    * release - used for pre-production testing and review
    * dev - Can be deployed to the dev environment for testing and review. Will always contain the most up-to-date and
      unstable versions
* Branch off of the `dev` branch to create
* new features with the `feature` prefix
* new bugs with the `bug` prefix
* Create PRs that merge back into dev.

#################################

## Pull latest from repo branch #

#################################

* MUST BE CONNECTED TO THE JUMP-SERVER (see running it locally on line 24)
* $ `git pull origin [branch]`
* Resolve any merging issues and commit (`git commit -am "[message]"`)
* $ `npm run setup`
* RECOMMENDED BUT OPTIONAL: $ `npm run build`

########################################################

## Updating feature branch with latest from dev Branch #

########################################################

* $ `git checkout dev` * switch to dev branch
* $ `git pull origin dev` * pull latest
* Resolve any merging issues and commit (`git commit -am "[message]"`)
* $ `npm run setup`
* RECOMMENDED BUT OPTIONAL: $ `npm run build`
*
* $ `git checkout feature/MSM-[xxx]/[desc]` * switch back to your feature branch
* $ `git merge dev` * merge with latest from dev
* Resolve any merging issues and commit (`git commit -am "[message]"`)
* $ `npm run setup`
* RECOMMENDED BUT OPTIONAL: $ `npm run build`

########################

## Repo Workflow Steps #

########################

* $ `git pull origin dev` * pull latest from dev branch
* $ `npm run setup` * run setup
* $ `git checkout -b feature/MSM-[xxx]/[desc]` * create new branch
*
* work on code
* when ready to commit
*
* $ `git status -s` * check status
* $ `git add .` * add new files (*if applicable)
* $ `git commit -am "git message"` * commit changes
* $ `git push origin feature/MSM-[xxx]/[desc]` * push changes
*
* login to bitbucket and go to pull requests for this repository
* https://bitbucket.org/FCP/bwi-MSP-node-app/pull-requests/
* create PR to merge your feature branch into dev branch using console/web
* check to delete feature branch when merge occurs

############

## Testing #

############

* $ `npm run test` * run all tests with report
* $ `npm run test -- --grep [tag]` * run tests with specific tag only

#################################

## Remove all / specific tag(s) #

#################################

* $ `npm run tag-delete` * delete all tags from remote and local
* $ `npm run tag-delete [tag]` * delete specific tag from remote and local

############################################

## Deploy specific service DEV ENVIRONMENT #

############################################

* Pull latest, merge, run setup, build and then deploy
* $ `git checkout dev` * switch to dev branch
* $ `git pull origin dev` * pull latest
* Resolve any merging issues and commit (`git commit -am "[message]"`)
* $ `npm run setup`
* RECOMMENDED BUT OPTIONAL: $ `npm run build`
* Optionally you can run start and/or test to verify before deployment
* OPTIONAL: $ `npm run test`
* OPTIONAL: $ `npm run start` (close it by hitting Ctrl+C keys on WinOS)
*
* Deploy single service or layer command format is:
* $ `npm run deploy [service name | layer name] [service | layer] [branch] [patch | minor | major]` # last param is
  version update and applicable only to service deployment
* You will be prompted (if applicable) to commit changes (typically local package.json)
* NOTE: The process is automated in updating package.json local to the service and switching to branch / committing and
  generating tag that will trigger the pipeline to deploy either a service or a layer
* NOTE: The only thing you MUST do before deployment is ADD (if you added new files $ `git add .`)
* SERVICE EXAMPLE: $ `npm run deploy auth service dev patch`
* LAYER EXAMPLE: $ `npm run deploy config layer dev`
* SERVICES:  name of a directory under `/src/service/[service name]` ~ `admin` `auth` `company` `meet` `message`
  `notification` `schedule` `user`
* LAYERS: name of a directory under `/src/common/[layer name]` ~ `auth` `config` `db` `npm` (npm for node_modules)

###################################

## CI to DEV/STAGING environments #

###################################

* PRs merged into `dev` or `staging` branch will automatically deploy all services/layers to proprietary environments

