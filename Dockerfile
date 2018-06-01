FROM node:6.14.2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm run build

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]