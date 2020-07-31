FROM node:12

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin 
# optionally if you want to run npm global bin without specifying path

EXPOSE 3002 3002

WORKDIR /home/app

RUN npm install nodemon -g
RUN npm config set puppeteer_skip_chromium_download true
RUN npm install puppeteer -g --unsafe-perm=true
COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm install

COPY . /home/app