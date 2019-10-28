FROM node:lts-jessie

RUN mkdir -p /server/prod/app
WORKDIR /server/prod/app

ADD package.json ./
RUN yarn install
COPY . .

EXPOSE 4000

CMD ["yarn", "start"]