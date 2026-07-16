FROM php:8.3-cli

# Extensions système requises
RUN apt-get update && apt-get install -y \
    git curl unzip libicu-dev libxml2-dev libzip-dev libpng-dev libssl-dev \
    pkg-config \
    && docker-php-ext-install \
        pdo pdo_mysql intl xml zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Extension MongoDB via PECL
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Installer les dépendances en premier (layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --no-interaction

# Copier le reste du code
COPY . .

# Finaliser l'autoloader
RUN composer dump-autoload --optimize --no-interaction

EXPOSE 8081

CMD ["php", "-S", "0.0.0.0:8081", "-t", "public", "public/index.php"]
