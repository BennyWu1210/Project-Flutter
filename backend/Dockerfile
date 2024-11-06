# backend/Dockerfile
# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the backend port
EXPOSE 8080

# Start the backend server
CMD ["nodemon", "app.js"]
