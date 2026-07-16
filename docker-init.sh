#!/bin/bash
# Initialisation de la base de données dans le conteneur PHP
# Usage : docker compose exec php bash docker-init.sh

set -e

echo "==> Migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

echo "==> Fixtures (données de test)..."
php bin/console doctrine:fixtures:load --no-interaction

echo "==> Cache..."
php bin/console cache:clear

echo ""
echo "✓ Application prête sur http://localhost:8081"
