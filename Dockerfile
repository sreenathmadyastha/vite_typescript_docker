# Use Node.js 18 as the base image
FROM node:18-alpine3.19

# Update apk packages to reduce vulnerabilities
RUN apk update && apk upgrade

# Set working directory
WORKDIR /app

# Copy root package.json and install dependencies
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React frontend
RUN npm run build:client

# Expose the server port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]