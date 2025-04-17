# Build stage
FROM mcr.microsoft.com/playwright:v1.51.1-noble AS builder

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run tests stage
FROM mcr.microsoft.com/playwright:v1.51.1-noble

# Set the working directory
WORKDIR /app

# Install Java
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openjdk-11-jre-headless \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set Java environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# Copy from builder stage
COPY --from=builder /app /app

# Set non-root user for better security
RUN groupadd -r playwright && useradd -r -g playwright -G audio,video playwright \
    && chown -R playwright:playwright /app
USER playwright

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "process.exit(0)"

# Set environment variables
ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn

# Command to run tests
ENTRYPOINT ["npm", "run"]
CMD ["test"]