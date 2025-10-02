# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and install dependencies
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm install

# Copy the rest of the application
COPY . .

# Verify client directory contents
RUN ls -la /app/client

# Build the React frontend
RUN npm run --workspace=client tsc
RUN npm run --workspace=client vite build

# Verify build output
RUN ls -la /app/server/public
RUN cat /app/server/public/index.html || echo "index.html not found or empty"

# Expose the server port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]