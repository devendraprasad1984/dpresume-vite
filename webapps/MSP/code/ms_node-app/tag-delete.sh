#!/bin/bash

if [[ $# -eq 1 ]]
then
    # remove specific tag
    git tag
    git tag -d $1
    git fetch
    git push origin --delete $1
    git tag -d $1
    git tag
fi

if [[ $# -eq 0 ]]
then
    # remove all tags
    git tag
    git tag -d $(git tag -l)
    git fetch
    git push origin --delete $(git tag -l)
    git tag -d $(git tag -l)
    git tag
fi