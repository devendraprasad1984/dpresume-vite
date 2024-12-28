#!/bin/bash

if [[ $# -lt 3 ]]
then    
    echo "required arguments: [service-name|layer-name] [service|layer] [dev|feature/*]"
    exit
else
    # set root, option and branch
    root="$PWD"
    option=$2 
    branch=$3 
    message=""   

    if [[ $option == service ]]
    then

        if [[ $# -lt 4 ]]
        then
            echo "additional params required arguments: ... [major|minor|patch]"
            exit
        else        

            # set service name and version increment option
            service=$1           
            verIncr=$4

            #go to service path
            cd src/service/$service

            # update version in package.json
            npm version $verIncr

            # extract version
            version=$(node --eval="process.stdout.write(require('./package.json').version)")

            # create tag
            tag=$service-$version

            # set message for git commit
            message="deploying service: $tag" 
        fi
    else
        # set layer name
        layer=$1        

        # generate hash
        hash=$(cat /dev/urandom | tr -dc  'a-zA-Z0-9' | fold -w 32 | head -n 1)

        # cxreate tag
        tag="$layer-layer-$hash"

        # set message for git commit
        message="deploying layer: $tag"
    fi

    # display tag value
    echo $tag

    # navigate to root
    cd "$root"

    ################
    # git commands #
    ################

    # checkout
    git checkout $branch

    #status
    git status -s

    # commit
    git commit -am "$message"

    # tag
    git tag $tag

    # push
    git push origin $branch --atomic $tag
  
fi