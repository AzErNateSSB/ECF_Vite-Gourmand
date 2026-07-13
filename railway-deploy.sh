#!/bin/bash
# Script exécuté automatiquement par Railway après le build
set -e

echo "==> Migration base de données..."
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

echo "==> Chargement des fixtures (première fois uniquement)..."
php bin/console doctrine:fixtures:load --no-interaction --append || true

echo "==> Démarrage du serveur PHP..."
exec php -S 0.0.0.0:$PORT -t public public/index.php
