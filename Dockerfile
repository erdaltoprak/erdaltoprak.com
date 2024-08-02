# Use the official Node.js image.
FROM node:20.16.0

# Create and change to the app directory.
WORKDIR /app

# Copy app directory content to /app.
COPY app/ ./

# Install dependencies.
RUN npm install

# Add ./node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Expose the port the app runs on.
EXPOSE 3000

# Start the project in development mode.
CMD ["npm", "run", "dev"]
