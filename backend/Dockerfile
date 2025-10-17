# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /backend

# Copy backend files
COPY . .

# Install dependencies
RUN npm install

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
