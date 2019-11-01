FROM node:lts-jessie

RUN mkdir -p /server/prod/app
WORKDIR /server/prod/app

ADD package.json ./
RUN npm install
RUN npm build
COPY . .

EXPOSE 8080

CMD ["npm", "start"]