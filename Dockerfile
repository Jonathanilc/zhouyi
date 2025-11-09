# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files needed for build
COPY mkdocs.yml .
COPY docs ./docs

# Build the MkDocs site
RUN mkdocs build

# Runtime stage
FROM python:3.11-slim

WORKDIR /app

# Copy only the built site from builder stage
COPY --from=builder /app/site ./site

# Expose port
EXPOSE 8080

# Serve the built site using Python's built-in HTTP server
CMD ["python", "-m", "http.server", "8080", "--directory", "site"]

