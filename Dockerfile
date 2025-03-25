# Use official Node.js image as base
FROM node:18-alpine
ENV NEXT_PUBLIC_BACKEND_URL=https://store-visit-85801868683.us-central1.run.app


# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force
# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["npm", "run", "start"]
