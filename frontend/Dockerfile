# Use official Nginx image to serve static files
FROM nginx:alpine

# Remove default Nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend files
COPY dist/ /usr/share/nginx/html

# Expose frontend port
EXPOSE 5000
