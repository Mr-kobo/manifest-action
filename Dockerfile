# Base image
FROM node:20-alpine

# Install netcat for wait script
RUN apk add --no-cache netcat-openbsd

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install

# Copy source code to container
COPY . .

# retrieve the STAGING build arg
ARG STAGING

# Set it as an environment variable
ENV STAGING=$STAGING

# Build the Nuxt.js app for production
RUN npm run build

# Expose port 3000
EXPOSE 3000

RUN chown -R 1000:1000 /app/server/assets
RUN chown -R 1000:1000 /app/wait-for-mongo.sh

USER 1000

# Start the app
CMD ["sh", "/app/wait-for-mongo.sh", "mongo", "27017", "node", ".output/server/index.mjs"]