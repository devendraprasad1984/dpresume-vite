#!/bin/bash

# LAYER METHODS
function layerSetup(){
    
    cd artifact

    # create lambda layer directories
    echo "creating nodejs/node14 runtime directory structure ..."
    mkdir nodejs
    cd nodejs
    mkdir node14
    cd node14
}

function createLayer(){

    # set layer name
    name=$1
    
    if [[ $name == npm ]]
    then
        # set remove dir name
        rfd="node_modules" 

        # copy files for installation
        echo "copying layer files ..."
        cp ../../../dist/package.json .
        cp ../../../dist/package-lock.json .

        # install npm packages
        echo "installing production npm packages ..."
        npm install --only=prod

        # remove package.json and package-lock.json before compression
        echo "removing unnecessary files for compression ..."
        rm package.json
        rm package-lock.json

    else
        # set remove dir name
        rfd=$name

        # create node_modules dir
        #mkdir node_modules
        #cd node_modules

        # copy files
        echo "copying layer files ... ( $1 )"
        cp -R ../../../dist/common/$1 ./$1    
    fi

    # creation
    echo "creating layer_$name layer"

    # compress artifact
    compress $name

    # clean up
    echo "cleaning up layer files ..."

    # go to nodejs/node14
    cd nodejs
    cd node14

    # remove artifact directory
    rm -rf $rfd
}

function compress(){

    echo "compressing lambda layer ..."

    # go two levels up
    cd ..
    cd ..

    # compress artifact
    zip -r "layer_$1.zip" ./ -x "*.zip"
    echo "compressed!"

    # list content
    ls
}

function layerCleanup(){
    
    echo "cleaning up proprietary files ..."
    cd ..
    cd ..
    rm -rf nodejs
    ls
}


if [[ $# -eq 0 ]] 
then
    echo "arguments must be supplied [argument-type list of layers]"
    exit
else
        
    echo "------------------------- LAMBDA LAYERS -------------------------"  

    # layer setup
    layerSetup  

    # create lambda layer artifact
    # check for number of arguments, run loop
    if [[ ($# -gt 0) ]]
    then
        for layer in ${@:1};
        do
            echo "creating layer artifact ... ( $layer )"
            createLayer $layer
        done
    fi

    # layer cleanup
    layerCleanup
  
fi