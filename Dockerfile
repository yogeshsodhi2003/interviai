# Stage 1: Build React frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/.env .env
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend and serve frontend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend/.env ./backend/.env
RUN cd backend && npm install
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/build ./backend/public
ENV NODE_ENV=production
WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "server.js"]
