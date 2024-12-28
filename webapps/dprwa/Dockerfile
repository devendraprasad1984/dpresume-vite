# docker build -t dpresume_image .
## docker run -it --rm -p 6201:6201 dpresume_image
## docker build -f Dockerfile.prod -t dpresume_image
## docker-compose -f docker-compose.yml up -d --build

#docker volume create --name dpresume_node_modules
#docker run --name app --link mongodb -e MONGO_URL=mongodb -e PORT=4000 -p 4000:4000 -v `pwd`/nodejs-with-mongodb-api-example:/src -v nodemodules:/src/node_modules app npm run dev:watch
#docker run --name dpresume_image -p 4000:4000 -v `pwd`/.:/app -v dpresume_node_modules:./node_modules dpresume_image npm start

FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
#RUN npm install react-scripts@latest -g --silent

COPY . ./

#CMD ["npm", "start"]
CMD npm start

RUN npm run build
