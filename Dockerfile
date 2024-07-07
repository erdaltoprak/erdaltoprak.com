# Dockerfile
# Use the official Node.js 18.20.3 image.
FROM node:18.20.3

# Create and change to the app directory.
WORKDIR /app

# Install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application.
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the project in development mode.
CMD ["npm", "run", "dev"]
