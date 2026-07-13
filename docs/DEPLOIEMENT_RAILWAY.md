# Déploiement sur Railway

## Prérequis
- Compte Railway : https://railway.app
- Projet sur GitHub (ou GitLab)
- CLI Railway (optionnel) : `npm install -g @railway/cli`

---

## Étapes de déploiement

### 1. Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TON_USER/TON_REPO.git
git push -u origin main
```

### 2. Créer le projet Railway

1. Aller sur **railway.app → New Project**
2. Choisir **Deploy from GitHub repo**
3. Sélectionner ton dépôt
4. Railway détecte le `nixpacks.toml` automatiquement

### 3. Ajouter le plugin MySQL

1. Dans le projet Railway → **+ New** → **Database** → **MySQL**
2. Les variables `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE` sont injectées automatiquement

### 4. Ajouter le plugin MongoDB

1. **+ New** → **Database** → **MongoDB**
2. La variable `MONGO_URL` est injectée automatiquement

### 5. Configurer les variables d'environnement

Dans **Settings → Variables** de ton service PHP, ajouter :

| Variable | Valeur |
|---|---|
| `APP_ENV` | `prod` |
| `APP_SECRET` | *(générer 32 chars aléatoires)* |
| `DATABASE_URL` | `mysql://${MYSQLUSER}:${MYSQLPASSWORD}@${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?serverVersion=8.0&charset=utf8mb4` |
| `MONGODB_URI` | `${MONGO_URL}` |
| `MONGODB_DB` | `vite_et_gourmand_stats` |
| `MESSENGER_TRANSPORT_DSN` | `sync://` |
| `MAILER_DSN` | `smtp://email%40gmail.com:MOT_DE_PASSE_APP@smtp.gmail.com:587?encryption=tls` |
| `MAILER_FROM_ADDRESS` | `noreply@vitegourmand.fr` |
| `MAILER_FROM_NAME` | `Vite & Gourmand` |
| `DEFAULT_URI` | `https://TON_APP.railway.app` |

> **APP_SECRET** : générer avec `php -r "echo bin2hex(random_bytes(16));"` en local

### 6. Déploiement automatique

Railway redéploie automatiquement à chaque `git push`.
Le script `railway-deploy.sh` :
1. Lance les migrations Doctrine
2. Charge les fixtures (données de test)
3. Démarre le serveur PHP

### 7. Obtenir l'URL publique

Dans **Settings → Domains** → **Generate Domain** → Railway génère une URL `*.railway.app`

---

## Commandes utiles après déploiement

Via la CLI Railway (`railway login` puis `railway run`) :

```bash
# Recréer la base depuis zéro
railway run php bin/console doctrine:schema:drop --force
railway run php bin/console doctrine:migrations:migrate --no-interaction
railway run php bin/console doctrine:fixtures:load --no-interaction

# Vider le cache
railway run php bin/console cache:clear --env=prod
```

---

## Notes

- Les **uploads d'images** (plats) ne persistent pas entre redéploiements sur Railway
  → Pour la prod, utiliser un service de stockage (S3, Cloudflare R2, etc.)
- Le **serveur PHP built-in** est suffisant pour la démo ECF mais pas pour la production réelle
- Les **fixtures** ne doivent être chargées qu'une seule fois (le script utilise `--append`)
