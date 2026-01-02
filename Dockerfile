# Build vendor dependencies
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress

# Runtime: Nginx + PHP-FPM image
FROM webdevops/php-nginx:8.2-alpine
ENV WEB_DOCUMENT_ROOT=/app/public
WORKDIR /app
COPY . /app
COPY --from=vendor /app/vendor /app/vendor

# Note:
# - Jika menggunakan SQLite: pastikan file database tersedia di /app/database/database.sqlite
# - Jika image tidak menyertakan pdo_sqlite, gunakan Postgres/MySQL atau modifikasi image untuk mengaktifkan ekstensi tersebut.
# - Atur env di platform deploy: APP_ENV, APP_KEY, APP_URL, DB_CONNECTION, dll.