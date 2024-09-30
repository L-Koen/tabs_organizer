# compose/front-end/Dockerfile

# Use the latest Node.js image as the base image
FROM node:current-alpine

# Set working directory
WORKDIR /app

# Install curl and bash (optional but useful)
RUN apk add --no-cache bash curl

# Set build arguments for UID and GID
ARG UID
ARG GID

# Check if GID and UID are 1000 or use provided ones, then create group and user
RUN if [ "$GID" -eq "1000" ] && [ "$UID" -eq "1000" ]; then \
      echo "Using default UID and GID"; \
    else \
      addgroup -g $GID nodegroup && \
      adduser -D -u $UID -G nodegroup node; \
    fi
# Switch to the non-root user
USER node


# Install dependencies if package.json exists
#RUN if [ -f "package.json" ]; then npm install; fi



# Expose the default port for React development server
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
