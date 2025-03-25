# Use official Node.js image
FROM node:18-alpine
ENV NEXT_PUBLIC_BACKEND_URL=https://store-visit-85801868683.us-central1.run.app

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy app source code
COPY . .

# Build the React Vite app
RUN npm run build

# Install a production HTTP server
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Run the built app with serve
CMD ["serve", "-s", "dist", "-l", "3000"]
