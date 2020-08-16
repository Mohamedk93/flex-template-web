FROM node:10.16.1
COPY . /var/www/
WORKDIR /var/www
RUN yarn install

EXPOSE 4000
CMD ["yarn","run","dev"]
