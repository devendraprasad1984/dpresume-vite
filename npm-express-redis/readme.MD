brew install mongodb-atlas
brew install mongoose
brew install mongodb/brew/mongodb-database-tools

atlas setup

mkdir -p ~/mongo/db
mkdir -p ~/mongo/log

sudo chown -R $(id -un) ~/mongo/db
sudo chown -R $(id -un) ~/mongo/log

mongod --dbpath ~/mongo/db --logpath ~/mongo/log/mongod.log


in .zshrc file
# =========MONGO==========
export MONGO_D="/Users/dpras01/dp/software/mongodb_8.2.3/bin"
export MONGO_SH="/Users/dpras01/dp/software/mongosh_2.6.0/bin"
alias runmongo="mongod --dbpath ~/mongo/db --logpath ~/mongo/log/mongod.log"
# ========================

show dbs;
use testdb;

mongoimport --db testdb --collection Products --file /Users/dpras01/dp/me/dpresume-vite/npm-express-redis/products.json


