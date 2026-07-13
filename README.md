# Vite & Gourmand — Application de traiteur événementiel

Application web développée dans le cadre de l'**ECF Développeur Web et Web Mobile (DWWM)**.

---

## Présentation du projet

**Vite & Gourmand** est une application de commande en ligne pour un traiteur événementiel bordelais.
Elle permet aux clients de découvrir les menus, passer commande, suivre leur prestation et laisser un avis.
L'espace employé et l'espace administrateur permettent de gérer l'ensemble du cycle de vie des commandes.

---

## Stack technique

| Élément | Technologie |
|---|---|
| Backend | Symfony 7 (PHP 8.3) |
| ORM | Doctrine ORM |
| Base de données | MySQL 8 |
| Stats | MongoDB 7 |
| Frontend | Twig + Bootstrap 5 + CSS custom |
| Emails | Symfony Mailer |
| Déploiement | Railway (nixpacks) |

---

## Installation locale

### Prérequis
- PHP 8.2+
- MySQL 8
- MongoDB (optionnel, pour les stats)
- Composer

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/TON_USER/vite-et-gourmand.git
cd vite-et-gourmand

# 2. Installer les dépendances PHP
composer install

# 3. Configurer l'environnement
cp .env .env.local
# Éditer .env.local : renseigner DATABASE_URL et MONGODB_URI

# 4. Créer la base de données et jouer les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate --no-interaction

# 5. Charger les données de test
php bin/console doctrine:fixtures:load --no-interaction

# 6. Lancer le serveur
php -S 127.0.0.1:8081 -t public
```

Accéder à l'application : **http://127.0.0.1:8081**

---

## Comptes de test

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Administrateur | jose@vitegourmand.fr | Admin@2024! |
| Employé | julie@vitegourmand.fr | Employe@2024! |
| Client | client@test.fr | Client@2024! |

---

## Fonctionnalités implémentées

### Espace public
- [x] Page d'accueil avec carousel d'avis clients (vrais avis validés)
- [x] Catalogue des menus avec filtres (thème, régime)
- [x] Page détail d'un menu
- [x] Formulaire de contact
- [x] Mentions légales + CGV
- [x] Inscription / Connexion

### Espace client
- [x] Tableau de bord : profil, commandes, avis
- [x] Passer une commande (menu pré-rempli si arrivée depuis la fiche menu)
- [x] Modification de commande (tant que statut = "En attente")
- [x] Annulation de commande avec motif
- [x] Calcul dynamique livraison (5 € + 0,59 €/km hors Bordeaux)
- [x] Réduction 10 % si +5 personnes au-delà du minimum du menu
- [x] Dépôt d'avis (après prestation)
- [x] Changement de mot de passe

### Espace employé
- [x] Tableau de bord avec onglets : Commandes, Plats, Menus, Avis
- [x] Gestion des statuts de commande (9 statuts)
- [x] Annulation avec motif + mode de contact + email client
- [x] Modification des plats (modal + upload photo)
- [x] Modification des menus (modal + 3 sélecteurs par type)
- [x] Validation / refus des avis clients

### Espace administrateur
- [x] Tableau de bord (stats commandes récentes)
- [x] Gestion complète des commandes
- [x] Gestion des utilisateurs (activation/désactivation)
- [x] Création de compte employé (+ email de bienvenue)
- [x] Statistiques MongoDB (commandes par menu)

### Emails automatiques
- [x] Bienvenue à l'inscription
- [x] Confirmation de commande
- [x] Commande terminée → invitation à laisser un avis
- [x] Alerte retour matériel (pénalité 600 €)
- [x] Annulation employé avec motif et mode de contact
- [x] Nouveau compte employé avec mot de passe temporaire

---

## Architecture du projet

```
vite-et-gourmand/
├── src/
│   ├── Controller/
│   │   ├── Admin/          # Dashboard, Commande, Plat, Menu, Utilisateur
│   │   ├── Client/         # CompteController (dashboard, commandes, avis)
│   │   ├── Employe/        # CommandeController (dashboard, avis)
│   │   ├── HomeController, InscriptionController, SecurityController
│   │   ├── MenuPublicController, ContactController
│   │   └── CgvController, MentionsLegalesController
│   ├── Entity/             # Utilisateur, Commande, Menu, Plat, Avis, Role, Regime...
│   ├── Form/               # CommandeType, PlatType, MenuType, InscriptionType
│   ├── Repository/         # Un repository par entité
│   └── Service/
│       ├── MailerService.php       # Tous les envois d'emails
│       ├── LivraisonService.php    # Calcul prix livraison (Nominatim + Haversine)
│       └── StatistiqueService.php  # Statistiques MongoDB
├── templates/
│   ├── home/, menus/, client/, employe/, admin/
│   ├── cgv/, emails/
│   └── _layout.html.twig, _navbar.html.twig, _footer.html.twig
├── migrations/             # Migrations Doctrine
├── docs/                   # Documentation (maquettes, UML, chartes, manuels...)
├── prototype/              # Prototype front-only (référence design)
├── nixpacks.toml           # Configuration Railway
└── railway-deploy.sh       # Script de démarrage Railway
```

---

## Calcul du prix

| Composante | Règle |
|---|---|
| Prix menu | `prixParPersonne × nombrePersonnes` |
| Livraison — Bordeaux | 5,00 € (ville de Bordeaux ou CP 33000–33800) |
| Livraison — hors Bordeaux | 5 € + 0,59 € × distance en km (géocodage Nominatim) |
| Réduction | 10 % du prix menu si `nombrePersonnes > minimumMenu + 5` |

---

## Statuts de commande

| Statut | Description |
|---|---|
| `en_attente` | Commande déposée, modifiable ou annulable par le client |
| `confirmee` | Prise en charge par l'équipe |
| `en_preparation` | Préparation en cours |
| `prete` | Prête pour la livraison / récupération |
| `en_cours_de_livraison` | En route |
| `livree` | Livrée, prestation en cours |
| `en_attente_retour_materiel` | En attente du retour du matériel |
| `terminee` | Terminée — invitation avis envoyée au client |
| `annulee` | Annulée (par client ou employé) |

---

## Déploiement Railway

Voir le guide complet : [`docs/DEPLOIEMENT_RAILWAY.md`](docs/DEPLOIEMENT_RAILWAY.md)

URL de production : *(à renseigner après déploiement)*

---

## Documentation

| Fichier | Description |
|---|---|
| `docs/database.sql` | Export SQL de la base de données |
| `docs/charte_graphique.docx` | Charte graphique (couleurs, typographies) |
| `docs/manuel_utilisateur.docx` | Manuel d'utilisation |
| `docs/copie_ecf_vite_et_gourmand.docx` | Cahier des charges ECF |
| `docs/uml/` | Diagrammes UML (use case, séquence) |
| `docs/maquettes/` | Maquettes desktop et mobile |
| `docs/explain_*.docx` | Explications techniques par module |
| `docs/DEPLOIEMENT_RAILWAY.md` | Guide de déploiement |

---

## Charte graphique

| Élément | Valeur |
|---|---|
| Couleur primaire | `#BE7D8D` |
| Couleur secondaire | `#E8D1D7` |
| Bordeaux foncé | `#800020` |
| Fond sombre | `#540015` |
| Police titres | Aclonica |
| Police corps | Calibri |

---

*Projet ECF DWWM — 2026*
