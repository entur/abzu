FROM node:7.2.1
# https://hub.docker.com/_/node/

# https://github.com/Yelp/dumb-init
RUN wget --quiet https://github.com/Yelp/dumb-init/releases/download/v1.0.1/dumb-init_1.0.1_amd64.deb
RUN dpkg -i dumb-init_*.deb
RUN npm set progress=false

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

EXPOSE 8000
ENV port 8000

CMD [ "dumb-init", "npm", "run", "prod" ]
