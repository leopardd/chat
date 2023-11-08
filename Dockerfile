# ---- Base Node ----
FROM node:20.9.0-alpine as base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
COPY package*.json ./
RUN npm install 

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npm run build.prod

# ---- Release ----
FROM node:20.9.0-alpine AS release
WORKDIR /app
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json
COPY --from=build /app/public/main.bundle.js /app/public/

RUN npm ci --only=production

# remove development dependencies
RUN npm prune --production

COPY . .

EXPOSE 6001

CMD [ "node", "server.js" ]
