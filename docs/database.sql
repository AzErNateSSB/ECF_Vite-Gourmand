-- =============================================================
-- Vite & Gourmand — Script SQL natif
-- Base de données : MySQL 8 / utf8mb4
-- Auteur : Victor Pouillon
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS suivi_commande;
DROP TABLE IF EXISTS avis;
DROP TABLE IF EXISTS commande;
DROP TABLE IF EXISTS menu_plat;
DROP TABLE IF EXISTS menu_regime;
DROP TABLE IF EXISTS menu_image;
DROP TABLE IF EXISTS plat_allergene;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS plat;
DROP TABLE IF EXISTS allergene;
DROP TABLE IF EXISTS regime;
DROP TABLE IF EXISTS theme;
DROP TABLE IF EXISTS horaire;
DROP TABLE IF EXISTS utilisateur;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS messenger_messages;

SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------
-- Table : role
-- -------------------------------------------------------------
CREATE TABLE role (
    id      INT          AUTO_INCREMENT NOT NULL,
    libelle VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : utilisateur
-- -------------------------------------------------------------
CREATE TABLE utilisateur (
    id              INT          AUTO_INCREMENT NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    nom             VARCHAR(128) NOT NULL,
    prenom          VARCHAR(128) NOT NULL,
    telephone       VARCHAR(32)  NOT NULL,
    adresse         VARCHAR(255) NOT NULL,
    adresse_postale VARCHAR(16)  NOT NULL,
    ville           VARCHAR(128) NOT NULL,
    actif           TINYINT      NOT NULL DEFAULT 1,
    role_id         INT          DEFAULT NULL,
    INDEX IDX_1D1C63B3D60322AC (role_id),
    PRIMARY KEY (id),
    CONSTRAINT FK_1D1C63B3D60322AC FOREIGN KEY (role_id) REFERENCES role (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : theme
-- -------------------------------------------------------------
CREATE TABLE theme (
    id      INT         AUTO_INCREMENT NOT NULL,
    libelle VARCHAR(64) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : regime
-- -------------------------------------------------------------
CREATE TABLE regime (
    id      INT         AUTO_INCREMENT NOT NULL,
    libelle VARCHAR(64) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : allergene
-- -------------------------------------------------------------
CREATE TABLE allergene (
    id      INT          AUTO_INCREMENT NOT NULL,
    libelle VARCHAR(128) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : plat
-- -------------------------------------------------------------
CREATE TABLE plat (
    id           INT          AUTO_INCREMENT NOT NULL,
    titre        VARCHAR(128) NOT NULL,
    type_plat    VARCHAR(20)  NOT NULL,
    image_chemin VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : plat_allergene (pivot)
-- -------------------------------------------------------------
CREATE TABLE plat_allergene (
    plat_id      INT NOT NULL,
    allergene_id INT NOT NULL,
    INDEX IDX_6FA44BBFD73DB560 (plat_id),
    INDEX IDX_6FA44BBF4646AB2  (allergene_id),
    PRIMARY KEY (plat_id, allergene_id),
    CONSTRAINT FK_plat_allergene_plat      FOREIGN KEY (plat_id)      REFERENCES plat      (id) ON DELETE CASCADE,
    CONSTRAINT FK_plat_allergene_allergene FOREIGN KEY (allergene_id) REFERENCES allergene (id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : menu
-- -------------------------------------------------------------
CREATE TABLE menu (
    id                      INT            AUTO_INCREMENT NOT NULL,
    titre                   VARCHAR(128)   NOT NULL,
    description             LONGTEXT       NOT NULL,
    nombre_personne_minimum INT            NOT NULL,
    prix_par_personne       NUMERIC(8, 2)  NOT NULL,
    conditions              LONGTEXT       DEFAULT NULL,
    quantite_restante       INT            NOT NULL DEFAULT 0,
    actif                   TINYINT        NOT NULL DEFAULT 1,
    theme_id                INT            DEFAULT NULL,
    INDEX IDX_7D053A9359027487 (theme_id),
    PRIMARY KEY (id),
    CONSTRAINT FK_7D053A9359027487 FOREIGN KEY (theme_id) REFERENCES theme (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : menu_regime (pivot)
-- -------------------------------------------------------------
CREATE TABLE menu_regime (
    menu_id   INT NOT NULL,
    regime_id INT NOT NULL,
    INDEX IDX_79C112A4CCD7E912 (menu_id),
    INDEX IDX_79C112A435E7D534 (regime_id),
    PRIMARY KEY (menu_id, regime_id),
    CONSTRAINT FK_menu_regime_menu   FOREIGN KEY (menu_id)   REFERENCES menu   (id) ON DELETE CASCADE,
    CONSTRAINT FK_menu_regime_regime FOREIGN KEY (regime_id) REFERENCES regime (id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : menu_plat (pivot)
-- -------------------------------------------------------------
CREATE TABLE menu_plat (
    menu_id INT NOT NULL,
    plat_id INT NOT NULL,
    INDEX IDX_E8775249CCD7E912 (menu_id),
    INDEX IDX_E8775249D73DB560 (plat_id),
    PRIMARY KEY (menu_id, plat_id),
    CONSTRAINT FK_menu_plat_menu FOREIGN KEY (menu_id) REFERENCES menu (id) ON DELETE CASCADE,
    CONSTRAINT FK_menu_plat_plat FOREIGN KEY (plat_id) REFERENCES plat (id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : menu_image
-- -------------------------------------------------------------
CREATE TABLE menu_image (
    id      INT          AUTO_INCREMENT NOT NULL,
    chemin  VARCHAR(255) NOT NULL,
    ordre   INT          NOT NULL DEFAULT 1,
    menu_id INT          DEFAULT NULL,
    INDEX IDX_54912738CCD7E912 (menu_id),
    PRIMARY KEY (id),
    CONSTRAINT FK_54912738CCD7E912 FOREIGN KEY (menu_id) REFERENCES menu (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : horaire
-- -------------------------------------------------------------
CREATE TABLE horaire (
    id              INT        AUTO_INCREMENT NOT NULL,
    jour            SMALLINT   NOT NULL,
    heure_ouverture VARCHAR(5) NOT NULL,
    heure_fermeture VARCHAR(5) NOT NULL,
    ferme           TINYINT    NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : commande
-- -------------------------------------------------------------
CREATE TABLE commande (
    id                INT            AUTO_INCREMENT NOT NULL,
    numero_commande   VARCHAR(50)    NOT NULL,
    date_commande     DATETIME       NOT NULL,
    date_prestation   DATE           NOT NULL,
    heure_livraison   VARCHAR(5)     NOT NULL,
    adresse_livraison VARCHAR(255)   NOT NULL,
    ville_livraison   VARCHAR(128)   NOT NULL,
    nombre_personne   INT            NOT NULL,
    prix_menu         NUMERIC(8, 2)  NOT NULL,
    prix_livraison    NUMERIC(8, 2)  NOT NULL,
    prix_reduction    NUMERIC(8, 2)  NOT NULL,
    prix_total        NUMERIC(8, 2)  NOT NULL,
    statut            VARCHAR(64)    NOT NULL,
    pret_materiel     TINYINT        NOT NULL DEFAULT 0,
    motif_annulation  LONGTEXT       DEFAULT NULL,
    mode_contact      VARCHAR(64)    DEFAULT NULL,
    utilisateur_id    INT            DEFAULT NULL,
    menu_id           INT            DEFAULT NULL,
    INDEX IDX_6EEAA67DFB88E14F (utilisateur_id),
    INDEX IDX_6EEAA67DCCD7E912 (menu_id),
    PRIMARY KEY (id),
    CONSTRAINT FK_6EEAA67DFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id),
    CONSTRAINT FK_6EEAA67DCCD7E912 FOREIGN KEY (menu_id)        REFERENCES menu        (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : avis
-- -------------------------------------------------------------
CREATE TABLE avis (
    id          INT          AUTO_INCREMENT NOT NULL,
    note        SMALLINT     NOT NULL,
    description LONGTEXT     NOT NULL,
    statut      VARCHAR(32)  NOT NULL,
    created_at  DATETIME     NOT NULL,
    commande_id INT          DEFAULT NULL,
    UNIQUE INDEX UNIQ_8F91ABF082EA2E54 (commande_id),
    PRIMARY KEY (id),
    CONSTRAINT FK_8F91ABF082EA2E54 FOREIGN KEY (commande_id) REFERENCES commande (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : suivi_commande
-- -------------------------------------------------------------
CREATE TABLE suivi_commande (
    id          INT         AUTO_INCREMENT NOT NULL,
    statut      VARCHAR(64) NOT NULL,
    commentaire LONGTEXT    DEFAULT NULL,
    created_at  DATETIME    NOT NULL,
    commande_id INT         DEFAULT NULL,
    INDEX IDX_C8D336EE82EA2E54 (commande_id),
    PRIMARY KEY (id),
    CONSTRAINT FK_C8D336EE82EA2E54 FOREIGN KEY (commande_id) REFERENCES commande (id)
) DEFAULT CHARACTER SET utf8mb4;

-- -------------------------------------------------------------
-- Table : messenger_messages (Symfony Messenger)
-- -------------------------------------------------------------
CREATE TABLE messenger_messages (
    id           BIGINT   AUTO_INCREMENT NOT NULL,
    body         LONGTEXT NOT NULL,
    headers      LONGTEXT NOT NULL,
    queue_name   VARCHAR(190) NOT NULL,
    created_at   DATETIME NOT NULL,
    available_at DATETIME NOT NULL,
    delivered_at DATETIME DEFAULT NULL,
    INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4;


-- =============================================================
-- Données initiales (fixtures)
-- =============================================================

-- Rôles
INSERT INTO role (id, libelle) VALUES
    (1, 'administrateur'),
    (2, 'employe'),
    (3, 'utilisateur');

-- Thèmes
INSERT INTO theme (id, libelle) VALUES
    (1, 'Noël'),
    (2, 'Pâques'),
    (3, 'Classique'),
    (4, 'Événement');

-- Régimes alimentaires
INSERT INTO regime (id, libelle) VALUES
    (1, 'Classique'),
    (2, 'Végétarien'),
    (3, 'Vegan'),
    (4, 'Sans gluten'),
    (5, 'Sans lactose'),
    (6, 'Halal');

-- Allergènes (14 allergènes majeurs réglementaires)
INSERT INTO allergene (id, libelle) VALUES
    (1,  'Gluten'),
    (2,  'Crustacés'),
    (3,  'Œufs'),
    (4,  'Poissons'),
    (5,  'Arachides'),
    (6,  'Soja'),
    (7,  'Lait'),
    (8,  'Fruits à coque'),
    (9,  'Céleri'),
    (10, 'Moutarde'),
    (11, 'Graines de sésame'),
    (12, 'Anhydride sulfureux et sulfites'),
    (13, 'Lupin'),
    (14, 'Mollusques');

-- Horaires d'ouverture (1=Lundi … 7=Dimanche)
INSERT INTO horaire (id, jour, heure_ouverture, heure_fermeture, ferme) VALUES
    (1, 1, '09:00', '18:00', 0),
    (2, 2, '09:00', '18:00', 0),
    (3, 3, '09:00', '18:00', 0),
    (4, 4, '09:00', '18:00', 0),
    (5, 5, '09:00', '19:00', 0),
    (6, 6, '10:00', '17:00', 0),
    (7, 7, '00:00', '00:00', 1);

-- Utilisateurs (mots de passe : hashés bcrypt — valeur d'exemple)
-- Comptes de test : Admin@2024! / Employe@2024! / Client@2024!
INSERT INTO utilisateur (id, email, password, nom, prenom, telephone, adresse, adresse_postale, ville, actif, role_id) VALUES
    (1, 'jose@vitegourmand.fr',  '$2y$13$placeholder_admin_hash',   'Dupont',  'José',  '0612345678', '1 rue de la Paix',      '33000', 'Bordeaux', 1, 1),
    (2, 'julie@vitegourmand.fr', '$2y$13$placeholder_employe_hash', 'Martin',  'Julie', '0698765432', '5 allée des Roses',     '33000', 'Bordeaux', 1, 2),
    (3, 'client@test.fr',        '$2y$13$placeholder_client_hash',  'Testeur', 'Alice', '0611223344', '10 avenue des Tests',   '33100', 'Bordeaux', 1, 3);

-- Plats
INSERT INTO plat (id, titre, type_plat) VALUES
    (1, 'Foie gras maison sur toast brioché',    'entree'),
    (2, 'Velouté de butternut et châtaignes',    'entree'),
    (3, 'Carpaccio de saint-jacques',             'entree'),
    (4, 'Chapon rôti aux marrons',                'plat'),
    (5, 'Filet de bœuf Wellington',               'plat'),
    (6, 'Pavé de saumon en croûte d''herbes',    'plat'),
    (7, 'Bûche de Noël chocolat-praliné',         'dessert'),
    (8, 'Tarte aux fraises et crème pâtissière', 'dessert'),
    (9, 'Mille-feuille vanille maison',           'dessert');

-- Allergènes des plats
INSERT INTO plat_allergene (plat_id, allergene_id) VALUES
    (1, 1), (1, 3), (1, 7),  -- Foie gras : Gluten, Œufs, Lait
    (2, 7),                   -- Velouté : Lait
    (3, 4),                   -- Carpaccio : Poissons
    (4, 8),                   -- Chapon : Fruits à coque
    (5, 1), (5, 3),           -- Wellington : Gluten, Œufs
    (6, 4),                   -- Saumon : Poissons
    (7, 1), (7, 7), (7, 8),  -- Bûche : Gluten, Lait, Fruits à coque
    (8, 1), (8, 3), (8, 7),  -- Tarte fraises : Gluten, Œufs, Lait
    (9, 1), (9, 3), (9, 7);  -- Mille-feuille : Gluten, Œufs, Lait

-- Menus
INSERT INTO menu (id, titre, description, nombre_personne_minimum, prix_par_personne, conditions, quantite_restante, actif, theme_id) VALUES
    (1, 'Menu Festif de Noël',
        'Un repas chaleureux pour célébrer les fêtes en famille avec des produits de saison.',
        6, 45.00,
        'À commander au minimum 7 jours avant la prestation. Conservation au réfrigérateur entre 0°C et 4°C.',
        10, 1, 1),
    (2, 'Menu Pâques Gourmand',
        'Découvrez notre sélection printanière avec des saveurs légères et fraîches.',
        4, 35.00,
        'À commander au minimum 5 jours avant la prestation.',
        8, 1, 2),
    (3, 'Menu Classique',
        'Notre incontournable pour tous vos événements, des entrées raffinées aux desserts maison.',
        2, 28.00,
        'À commander au minimum 48h avant la prestation.',
        15, 1, 3);

-- Associations menu ↔ régime
INSERT INTO menu_regime (menu_id, regime_id) VALUES
    (1, 1),        -- Noël : Classique
    (2, 1), (2, 2), -- Pâques : Classique + Végétarien
    (3, 1);        -- Classique : Classique

-- Associations menu ↔ plat
INSERT INTO menu_plat (menu_id, plat_id) VALUES
    (1, 1), (1, 2), (1, 4), (1, 7),  -- Noël
    (2, 3), (2, 6), (2, 8),           -- Pâques
    (3, 2), (3, 5), (3, 9);           -- Classique

-- Images des menus
INSERT INTO menu_image (id, chemin, ordre, menu_id) VALUES
    (1, 'uploads/menus/noel.jpg',     1, 1),
    (2, 'uploads/menus/paques.jpg',   1, 2),
    (3, 'uploads/menus/classique.jpg',1, 3);

-- Commandes de démonstration
INSERT INTO commande (id, numero_commande, date_commande, date_prestation, heure_livraison,
    adresse_livraison, ville_livraison, nombre_personne,
    prix_menu, prix_livraison, prix_reduction, prix_total,
    statut, pret_materiel, utilisateur_id, menu_id) VALUES
    (1, 'CMD-001', '2026-07-01 10:00:00', '2026-07-26', '12:00', '10 avenue des Tests', 'Bordeaux', 20, 900.00,  5.00, 0.00, 905.00,  'en_attente',  0, 3, 1),
    (2, 'CMD-002', '2026-07-05 14:00:00', '2026-07-30', '12:00', '10 avenue des Tests', 'Bordeaux', 25, 875.00,  5.00, 0.00, 880.00,  'confirmee',   0, 3, 2),
    (3, 'CMD-003', '2026-07-10 09:00:00', '2026-07-20', '12:00', '10 avenue des Tests', 'Bordeaux', 10, 280.00,  5.00, 0.00, 285.00,  'en_preparation', 0, 3, 3),
    (4, 'CMD-004', '2026-07-12 11:00:00', '2026-07-22', '12:00', '10 avenue des Tests', 'Bordeaux', 15, 675.00,  5.00, 0.00, 680.00,  'prete',       0, 3, 1),
    (5, 'CMD-005', '2026-07-15 16:00:00', '2026-08-20', '12:00', '10 avenue des Tests', 'Bordeaux', 30, 1050.00, 5.00, 0.00, 1055.00, 'livree',      0, 3, 2);
