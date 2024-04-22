# Use an official Node.js runtime as the base image
FROM node:18.20.2-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install NestJS dependencies
RUN npm install

# Copy the rest of your application's source code to the working directory
COPY . .

# Build your NestJS application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose the port that your NestJS application runs on
EXPOSE 3080

# Specify the command to run your application
CMD ["node", "dist/main"]
