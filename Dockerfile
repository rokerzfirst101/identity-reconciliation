FROM node:18

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

COPY . .
RUN npm run build

EXPOSE 8080
