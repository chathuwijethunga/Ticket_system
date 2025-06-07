# Use a lean base image for PHP (with FPM, which includes CLI and common PHP environment)
FROM php:8.3-fpm

# Set environment variables for non-interactive commands during apt operations
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory inside the container to the project root
WORKDIR /var/www/html

# --- Install PHP Extensions and System Dependencies ---
# Update apt, install git, unzip, and necessary libraries for PHP extensions.
# Also install prerequisites for Node.js (dirmngr, gnupg).
RUN apt update && apt install -y \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    dirmngr \
    gnupg \
    --no-install-recommends \
    # Clean up apt caches to keep image size small
    && rm -rf /var/lib/apt/lists/*

# Install core PHP extensions for Laravel (MySQL support, image handling, etc.)
RUN docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip gd mbstring exif pcntl bcmath curl xml \
    # Clean up any build artifacts
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# --- Install Composer (PHP Dependency Manager) ---
# Copy Composer executable from its official Docker image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# --- Install Node.js and npm (for Vite/React) ---
# Add NodeSource GPG key and repository for Node.js 20.x LTS
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list > /dev/null \
    && apt update \
    && apt install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# --- Copy Project Files ---
# Copy composer.json and package.json first to leverage Docker layer caching for dependencies
COPY composer.json composer.lock ./
#COPY package.json ./ # Assuming no yarn.lock based on previous error

# Copy the rest of the application code
COPY . .

# --- Execute README Setup Instructions During Build ---

# 2. Install PHP Dependencies
RUN composer install

# 3. Configure Environment File (partial - .env copy and key generation)
# Copying .env.example to .env is done if .env doesn't exist, which it might not yet.
# Note: If you're building frequently, and .env already exists on host, it'll be copied.
# Make sure your local .env is set for sqlite.
RUN cp .env.example .env || true # Use || true to prevent build failure if .env already exists
RUN php artisan key:generate

# 4. Run Database Migrations
RUN php artisan migrate --force # --force is needed in non-interactive environments

# You can seed the database with test data (optional, uncomment if needed)
# RUN php artisan db:seed --force # --force is needed in non-interactive environments
RUN php artisan db:seed
# 5. Install Node.js Dependencies
RUN npm install

# 6. Bundle React Assets (Production build)
# This command runs `npm run build` automatically.
# For development, you'd typically run `npm run dev` separately later.
RUN npm run build

# --- Set Permissions for Laravel ---
# Set appropriate permissions for Laravel's storage and bootstrap/cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 8000 for `php artisan serve` (though it won't be run by CMD)
EXPOSE 8000

# --- Default Command to Run Laravel Development Server ---
# This command will automatically start when the container launches.
# It uses `php artisan serve` as specified in your README.
# `npm run dev` will still need to be run in a separate session if you want hot-reloading.
CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "8000"]
