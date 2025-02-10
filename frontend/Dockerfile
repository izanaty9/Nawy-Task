FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy configuration files
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]