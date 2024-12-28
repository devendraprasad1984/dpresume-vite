#!/bin/bash

# SERVICE METHODS
function serviceSetup(){

    cd artifact
    
    # create service directory
    echo "creating service directory ..."
    mkdir service
    cd service
}

function createService(){
    # copy service files
    echo "copying service files ..."
    cp -R ../../dist/service/$1 $1

    # compress artifact
    compress $1

    # clean up
    echo "cleaning up service files ..."
    cd service
    rm -rf $1
}

function compress() {
     # compress
    echo "compressing service ..."

    # go one level up
    cd ..

    # compress
    zip -r "service_$1.zip" ./ -x "*.zip"
    echo "compressed!"

    # list content
    ls
}

function serviceCleanup(){
    # clean up service files
    echo "cleaning up proprietary files ..."
    cd ..
    rm -rf service
    ls
}


if [[ $# -eq 0 ]] 
then
    echo "arguments must be supplied [argument-type list of services]"
    exit
else

    echo "------------------------- SERVICES -------------------------"

    # service setup
    serviceSetup

    # create service artifact
    # check for number of arguments, run loop
    if [[ ( $# -gt 0) ]]
    then
        for service in ${@:1};
        do
            echo "creating service artifact ... ( $service )"
            createService $service
        done       
    fi

    # service cleanup
    serviceCleanup

fi