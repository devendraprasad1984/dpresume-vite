#!/bin/bash
echo "starting mongo server"
chown -R $USER /Users/dpresume/deven/mongodata/
/Users/dpresume/deven/software/mongodb-macos-x86_64-5.0.3/bin/mongod -f /Users/dpresume/deven/mongodata/mongod.conf
echo "server started"

