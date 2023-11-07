FROM node:20.9.0-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# build
RUN npm run build.prod

# Start the second stage
FROM node:20.9.0-alpine

COPY . .

# Copy the generated file from the previous stage
COPY --from=build-stage /app/public/main.bundle.js /app/public/

RUN npm ci --only=production

# remove development dependencies
RUN npm prune --production

EXPOSE 6001

CMD [ "node", "server.js" ]
