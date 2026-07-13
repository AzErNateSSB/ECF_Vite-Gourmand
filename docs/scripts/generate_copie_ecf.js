const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak,
    NumberFormat, LevelFormat, convertInchesToTwip,
} = require('docx');
const fs = require('fs');

// â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function pageBreak() {
    return new Paragraph({ children: [new PageBreak()] });
}
function h1(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 500, after: 200 } });
}
function h2(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function h3(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } });
}
function p(text) {
    return new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 140 } });
}
function pBold(text) {
    return new Paragraph({ children: [new TextRun({ text, size: 22, bold: true })], spacing: { after: 100 } });
}
function bullet(text) {
    return new Paragraph({ children: [new TextRun({ text, size: 22 })], bullet: { level: 0 }, spacing: { after: 80 } });
}
function bullet2(text) {
    return new Paragraph({ children: [new TextRun({ text, size: 22 })], bullet: { level: 1 }, spacing: { after: 60 } });
}
function code(text) {
    return new Paragraph({
        children: [new TextRun({ text, font: 'Courier New', size: 20, color: '1a1a2e' })],
        spacing: { after: 60 },
        indent: { left: 400 },
    });
}
function note(text) {
    return new Paragraph({
        children: [new TextRun({ text: 'â„¹  ' + text, size: 21, color: '0d5dab', italics: true })],
        spacing: { after: 120 },
        indent: { left: 300 },
    });
}
function warning(text) {
    return new Paragraph({
        children: [new TextRun({ text: 'âš   ' + text, size: 21, color: 'b45309' })],
        spacing: { after: 120 },
        indent: { left: 300 },
    });
}
function tableHeader(cells) {
    return new TableRow({
        tableHeader: true,
        children: cells.map(t => new TableCell({
            shading: { fill: '1a1a2e' },
            children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: 'ffffff', size: 20 })] })],
        })),
    });
}
function tableRow(cells) {
    return new TableRow({
        children: cells.map(t => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: t, size: 20 })] })],
        })),
    });
}
function simpleTable(headers, rows) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [tableHeader(headers), ...rows.map(r => tableRow(r))],
    });
}
function spacer() {
    return new Paragraph({ text: '', spacing: { after: 200 } });
}

// â”€â”€ document â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const doc = new Document({
    sections: [{
        children: [

            // â”€â”€ PAGE DE GARDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            spacer(), spacer(), spacer(),
            new Paragraph({
                children: [new TextRun({ text: 'VITE & GOURMAND', bold: true, size: 56, color: '1a1a2e' })],
                alignment: AlignmentType.CENTER, spacing: { after: 120 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Application web de commande de traiteur', size: 28, color: 'c8a96e' })],
                alignment: AlignmentType.CENTER, spacing: { after: 80 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Bordeaux', size: 24, color: '888888' })],
                alignment: AlignmentType.CENTER, spacing: { after: 600 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Copie Ã  rendre â€” ECF', bold: true, size: 36, color: '1a1a2e' })],
                alignment: AlignmentType.CENTER, spacing: { after: 120 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'TP DÃ©veloppeur Web et Web Mobile', size: 26, color: '555555' })],
                alignment: AlignmentType.CENTER, spacing: { after: 80 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Studi â€” Session 2024', size: 24, color: '888888' })],
                alignment: AlignmentType.CENTER, spacing: { after: 600 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Candidat : Victor P.', size: 22 })],
                alignment: AlignmentType.CENTER, spacing: { after: 80 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Date : juin 2024', size: 22 })],
                alignment: AlignmentType.CENTER, spacing: { after: 80 },
            }),
            pageBreak(),

            // â”€â”€ SOMMAIRE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('Sommaire'),
            bullet('1. PrÃ©sentation du projet'),
            bullet('2. Analyse des besoins'),
            bullet2('2.1 Contexte et objectifs'),
            bullet2('2.2 Acteurs et rÃ´les'),
            bullet2('2.3 User stories'),
            bullet('3. Conception'),
            bullet2('3.1 ModÃ¨le Conceptuel de DonnÃ©es (MCD)'),
            bullet2('3.2 Diagramme de cas d\'utilisation UML'),
            bullet2('3.3 Diagramme de sÃ©quence UML'),
            bullet2('3.4 Maquettes'),
            bullet('4. Architecture technique'),
            bullet2('4.1 Stack et choix technologiques'),
            bullet2('4.2 Structure du projet Symfony'),
            bullet2('4.3 Base de donnÃ©es relationnelle'),
            bullet2('4.4 Base de donnÃ©es NoSQL â€” MongoDB'),
            bullet('5. RÃ©alisation'),
            bullet2('5.1 Authentification et sÃ©curitÃ©'),
            bullet2('5.2 Espace Admin'),
            bullet2('5.3 Espace EmployÃ© â€” Kanban'),
            bullet2('5.4 Espace Client'),
            bullet2('5.5 IntÃ©gration MongoDB'),
            bullet('6. SÃ©curitÃ© applicative'),
            bullet('7. DifficultÃ©s rencontrÃ©es et solutions'),
            bullet('8. Bilan et perspectives'),
            pageBreak(),

            // â”€â”€ 1. PRÃ‰SENTATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('1. PrÃ©sentation du projet'),
            p('Vite & Gourmand est une sociÃ©tÃ© de traiteur haut de gamme basÃ©e Ã  Bordeaux. Elle propose des prestations pour des Ã©vÃ©nements professionnels et privÃ©s : mariages, sÃ©minaires, cocktails, repas d\'entreprise.'),
            p('L\'entreprise disposait jusqu\'Ã  prÃ©sent d\'un processus de commande entiÃ¨rement manuel (tÃ©lÃ©phone, e-mail). L\'objectif de ce projet est de moderniser cette dÃ©marche en dÃ©veloppant une application web permettant :'),
            bullet('Aux clients de consulter les menus disponibles et de passer commande en ligne'),
            bullet('Aux employÃ©s de gÃ©rer les commandes en cours via un tableau Kanban'),
            bullet('Aux administrateurs de gÃ©rer le catalogue (menus, plats), les comptes clients et de consulter des statistiques'),
            spacer(),
            simpleTable(
                ['CritÃ¨re', 'DÃ©tail'],
                [
                    ['Nom du projet', 'Vite & Gourmand â€” Application web traiteur'],
                    ['Localisation', 'Bordeaux (33)'],
                    ['Type de projet', 'Application web fullstack â€” Backend Symfony + Frontend Twig'],
                    ['DurÃ©e de dÃ©veloppement', 'ECF â€” PÃ©riode de formation Studi'],
                    ['Technologies principales', 'PHP 8.5 / Symfony 7 / MySQL / MongoDB / Bootstrap 5.3'],
                ]
            ),
            pageBreak(),

            // â”€â”€ 2. ANALYSE DES BESOINS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('2. Analyse des besoins'),

            h2('2.1 Contexte et objectifs'),
            p('Le client souhaite remplacer son processus manuel par une application web accessible depuis n\'importe quel navigateur (desktop et mobile). Les objectifs fonctionnels sont :'),
            bullet('Permettre l\'inscription et la connexion des clients'),
            bullet('Permettre aux clients de consulter les menus avec leurs allergÃ¨nes et rÃ©gimes'),
            bullet('Permettre aux clients de passer une commande (menu, nombre de personnes, date, adresse)'),
            bullet('Permettre aux employÃ©s de suivre et mettre Ã  jour le statut des commandes'),
            bullet('Permettre Ã  l\'administration de gÃ©rer le catalogue et les utilisateurs'),
            bullet('GÃ©nÃ©rer des statistiques analytiques (chiffre d\'affaires, menus populaires, Ã©volution mensuelle)'),

            h2('2.2 Acteurs et rÃ´les'),
            simpleTable(
                ['Acteur', 'RÃ´le Symfony', 'PÃ©rimÃ¨tre'],
                [
                    ['Visiteur', '(anonyme)', 'Consultation des menus publics, inscription'],
                    ['Client', 'ROLE_UTILISATEUR', 'Commande, suivi, historique, profil'],
                    ['EmployÃ©', 'ROLE_EMPLOYE', 'Kanban des commandes, changement de statut'],
                    ['Administrateur', 'ROLE_ADMINISTRATEUR', 'CRUD catalogue, gestion utilisateurs, statistiques'],
                ]
            ),

            h2('2.3 User stories'),
            pBold('Visiteur :'),
            bullet('"En tant que visiteur, je veux consulter les menus disponibles pour dÃ©cider si l\'offre correspond Ã  mes besoins."'),
            bullet('"En tant que visiteur, je veux crÃ©er un compte pour pouvoir passer commande."'),
            pBold('Client :'),
            bullet('"En tant que client connectÃ©, je veux sÃ©lectionner un menu, indiquer le nombre de personnes et la date de livraison pour passer commande."'),
            bullet('"En tant que client, je veux voir le prix total calculÃ© automatiquement pour ne pas avoir Ã  le calculer moi-mÃªme."'),
            bullet('"En tant que client, je veux suivre l\'avancement de ma commande pour savoir oÃ¹ en est sa prÃ©paration."'),
            pBold('EmployÃ© :'),
            bullet('"En tant qu\'employÃ©, je veux voir les commandes confirmÃ©es, en prÃ©paration et prÃªtes dans un tableau Kanban pour organiser mon travail."'),
            bullet('"En tant qu\'employÃ©, je veux changer le statut d\'une commande pour informer le client de l\'avancement."'),
            pBold('Administrateur :'),
            bullet('"En tant qu\'admin, je veux crÃ©er, modifier et dÃ©sactiver des menus sans les supprimer pour maintenir l\'historique."'),
            bullet('"En tant qu\'admin, je veux consulter les statistiques de ventes pour piloter l\'activitÃ©."'),
            pageBreak(),

            // â”€â”€ 3. CONCEPTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('3. Conception'),

            h2('3.1 ModÃ¨le Conceptuel de DonnÃ©es'),
            p('Les entitÃ©s principales de l\'application et leurs relations :'),
            simpleTable(
                ['EntitÃ©', 'Attributs principaux', 'Relations'],
                [
                    ['Utilisateur', 'id, prenom, nom, email, password, actif', 'ManyToOne Role ; OneToMany Commande'],
                    ['Role', 'id, libelle (utilisateur/employe/administrateur)', 'OneToMany Utilisateur'],
                    ['Menu', 'id, titre, description, prixParPersonne, actif', 'ManyToMany Plat ; ManyToMany Regime'],
                    ['Plat', 'id, nom, description, typePlat', 'ManyToMany Menu ; ManyToMany Allergene'],
                    ['Allergene', 'id, nom', 'ManyToMany Plat'],
                    ['Regime', 'id, libelle (vegetarien/vegan/sans_gluten...)', 'ManyToMany Menu'],
                    ['Commande', 'id, numero, nombrePersonnes, dateEvenement, adresse, ville, codePostal, prixMenu, prixLivraison, statut, note', 'ManyToOne Utilisateur ; ManyToOne Menu'],
                ]
            ),
            spacer(),
            p('La relation entre Commande et Menu est de type ManyToOne : une commande porte un seul menu, mais un menu peut Ãªtre commandÃ© plusieurs fois. La relation entre Menu et Plat est ManyToMany car un menu contient plusieurs plats, et un plat peut figurer dans plusieurs menus.'),

            h2('3.2 Diagramme de cas d\'utilisation UML'),
            p('Le diagramme de cas d\'utilisation (fichier docs/uml/use_case.svg) reprÃ©sente les 4 acteurs du systÃ¨me et leurs cas d\'utilisation respectifs :'),
            bullet('Visiteur : Consulter les menus, S\'inscrire, Se connecter'),
            bullet('Client : Passer une commande, Suivre sa commande, Voir son historique, GÃ©rer son profil'),
            bullet('EmployÃ© : Voir les commandes actives, Changer le statut d\'une commande'),
            bullet('Administrateur : GÃ©rer les menus, GÃ©rer les plats, GÃ©rer les utilisateurs, Voir les statistiques'),
            p('Une relation <<include>> relie "Passer une commande" Ã  "Se connecter" : la connexion est un prÃ©requis Ã  la commande.'),

            h2('3.3 Diagramme de sÃ©quence UML'),
            p('Le diagramme de sÃ©quence (fichier docs/uml/sequence_commande.svg) dÃ©crit le scÃ©nario nominal "Passer une commande" de bout en bout :'),
            bullet('GET /connexion â†’ formulaire de connexion'),
            bullet('POST email + password â†’ vÃ©rification CSRF, requÃªte SELECT en base, session crÃ©Ã©e'),
            bullet('GET /compte/commande/nouvelle â†’ SELECT menus actifs â†’ formulaire affichÃ©'),
            bullet('POST donnÃ©es commande â†’ calcul prix cÃ´tÃ© serveur, INSERT Commande, INSERT statistique MongoDB (si disponible)'),
            bullet('302 redirect â†’ dashboard client avec message flash de confirmation'),

            h2('3.4 Maquettes'),
            p('Six maquettes wireframes ont Ã©tÃ© rÃ©alisÃ©es en format SVG (dossier docs/maquettes/) :'),
            simpleTable(
                ['Maquette', 'Fichier'],
                [
                    ['Accueil â€” desktop 1440px', 'desktop_accueil.svg'],
                    ['Catalogue des menus â€” desktop', 'desktop_catalogue.svg'],
                    ['Formulaire de commande â€” desktop', 'desktop_commande.svg'],
                    ['Accueil â€” mobile 390px', 'mobile_accueil.svg'],
                    ['Catalogue des menus â€” mobile', 'mobile_catalogue.svg'],
                    ['Formulaire de commande â€” mobile', 'mobile_commande.svg'],
                ]
            ),
            p('Les maquettes desktop utilisent une mise en page 2-3 colonnes (grid Bootstrap). Les maquettes mobiles utilisent une disposition 1 colonne avec navigation hamburger.'),
            pageBreak(),

            // â”€â”€ 4. ARCHITECTURE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('4. Architecture technique'),

            h2('4.1 Stack et choix technologiques'),
            simpleTable(
                ['Couche', 'Technologie', 'Justification'],
                [
                    ['Langage backend', 'PHP 8.5', 'Langage imposÃ© par le cursus, LTS, performances amÃ©liorÃ©es'],
                    ['Framework backend', 'Symfony 7', 'Framework MVC robuste, sÃ©curitÃ© intÃ©grÃ©e, convention over configuration'],
                    ['ORM', 'Doctrine ORM', 'IntÃ©grÃ© Ã  Symfony, abstraction BDD, migrations versionnÃ©es'],
                    ['BDD relationnelle', 'MySQL 8', 'SGBD relationnel stable, compatible Doctrine'],
                    ['BDD NoSQL', 'MongoDB', 'Exigence ECF, stockage analytique flexible, agrÃ©gations puissantes'],
                    ['Templating', 'Twig', 'Moteur de template intÃ©grÃ© Symfony, XSS automatique'],
                    ['CSS Framework', 'Bootstrap 5.3', 'Grid responsive, composants prÃªts, Icons CDN'],
                    ['IcÃ´nes', 'Bootstrap Icons', 'CohÃ©rence avec Bootstrap, pas de dÃ©pendance supplÃ©mentaire'],
                ]
            ),

            h2('4.2 Structure du projet Symfony'),
            p('L\'application suit l\'architecture MVC de Symfony :'),
            bullet('src/Controller/ : 3 namespaces (Admin/, Employe/, Client/) + SecurityController + InscriptionController'),
            bullet('src/Entity/ : 8 entitÃ©s Doctrine (Utilisateur, Role, Menu, Plat, Commande, Allergene, Regime, TypePlat)'),
            bullet('src/Form/ : 4 FormType (InscriptionType, CommandeType, MenuType, PlatType)'),
            bullet('src/Service/ : StatistiqueService (intÃ©gration MongoDB avec graceful degradation)'),
            bullet('templates/ : layouts sÃ©parÃ©s par espace (admin/, employe/, client/, security/)'),
            bullet('config/ : security.yaml (firewalls, access_control, password_hashers), services.yaml'),

            h2('4.3 Base de donnÃ©es relationnelle'),
            p('La base de donnÃ©es MySQL est gÃ©rÃ©e via Doctrine ORM avec les migrations. Le schÃ©ma comprend 7 tables principales + 2 tables de jointure (menu_plat, menu_regime) et 1 pour les allergÃ¨nes (plat_allergene).'),
            p('Les migrations Doctrine permettent d\'appliquer les Ã©volutions de schÃ©ma de maniÃ¨re versionnÃ©e et reproductible, en Ã©vitant toute manipulation SQL manuelle.'),

            h2('4.4 Base de donnÃ©es NoSQL â€” MongoDB'),
            p('MongoDB est utilisÃ© pour stocker des Ã©vÃ©nements statistiques Ã  chaque crÃ©ation de commande. Chaque document contient :'),
            code('{ evenement, commande_id, numero_commande, menu_titre,'),
            code('  nombre_personnes, prix_total, statut, ville, date_evenement }'),
            p('Ce choix permet d\'effectuer des agrÃ©gations complexes ($group, $sum, $avg, $sort) directement en base sans charger les donnÃ©es en PHP.'),
            warning('Contrainte technique : l\'extension PHP mongodb n\'est pas compatible avec PHP 8.5 sur Windows au moment du dÃ©veloppement (module API 20240924 vs 20250925 â€” voir section 7). L\'application fonctionne en mode dÃ©gradÃ©.'),
            pageBreak(),

            // â”€â”€ 5. RÃ‰ALISATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('5. RÃ©alisation'),

            h2('5.1 Authentification et sÃ©curitÃ©'),
            p('L\'authentification est assurÃ©e par le composant Security de Symfony 7. La configuration dans security.yaml dÃ©finit :'),
            bullet('Un provider basÃ© sur l\'entitÃ© Utilisateur (property: email)'),
            bullet('Un firewall main avec form_login (CSRF activÃ©), logout et remember_me (7 jours)'),
            bullet('Un access_control par prÃ©fixe de route et rÃ´le ROLE_'),
            p('Les rÃ´les sont stockÃ©s en base dans une entitÃ© Role liÃ©e Ã  Utilisateur. La mÃ©thode getRoles() retourne [\'ROLE_\' . strtoupper($libelle)] pour respecter la convention Symfony.'),
            p('Le hashage des mots de passe utilise l\'algorithme auto de Symfony (bcrypt/argon2id selon la configuration), via UserPasswordHasherInterface.'),

            h2('5.2 Espace Admin'),
            p('L\'espace admin est accessible sous /admin et protÃ©gÃ© par ROLE_ADMINISTRATEUR. Il comprend :'),
            bullet('DashboardController : compteurs KPIs + 5 derniÃ¨res commandes'),
            bullet('MenuController : CRUD complet avec protection CSRF sur la suppression'),
            bullet('PlatController : CRUD complet'),
            bullet('CommandeController : liste + dÃ©tail + changement de statut (whitelist validation)'),
            bullet('UtilisateurController : liste + toggle actif/inactif'),
            bullet('StatistiqueController : tableau de bord MongoDB via StatistiqueService'),
            p('Le layout admin (templates/admin/layout.html.twig) est autonome (n\'Ã©tend pas base.html.twig) avec une sidebar sombre (#212529) et Bootstrap Icons.'),

            h2('5.3 Espace EmployÃ© â€” Kanban'),
            p('L\'espace employÃ© (/employe, ROLE_EMPLOYE) prÃ©sente un tableau Kanban avec 3 colonnes :'),
            bullet('ConfirmÃ©e : findBy([\'statut\' => \'confirmee\'])'),
            bullet('En prÃ©paration : findBy([\'statut\' => \'en_preparation\'])'),
            bullet('PrÃªte : findBy([\'statut\' => \'prete\'])'),
            p('Chaque carte affiche le numÃ©ro de commande, le menu, le nombre de personnes et la date. Un lien "Voir dÃ©tail" permet d\'accÃ©der au dÃ©tail et de changer le statut.'),

            h2('5.4 Espace Client'),
            p('L\'espace client (/compte, ROLE_UTILISATEUR) comprend :'),
            bullet('Dashboard : liste des commandes de l\'utilisateur connectÃ©'),
            bullet('Nouvelle commande : formulaire CommandeType avec EntityType (menus actifs uniquement via query_builder)'),
            bullet('Calcul du prix cÃ´tÃ© serveur : prixMenu = prixParPersonne Ã— nombrePersonnes, prixLivraison = 50 â‚¬ fixe'),
            bullet('NumÃ©ro de commande gÃ©nÃ©rÃ© : CMD-{uniqid()}'),
            bullet('Protection IDOR : vÃ©rification $commande->getUtilisateur() === $this->getUser() avant affichage du dÃ©tail'),
            bullet('Inscription : InscriptionType avec RepeatedType (confirmation mot de passe) et contrainte Length(min:8)'),

            h2('5.5 IntÃ©gration MongoDB'),
            p('Le StatistiqueService est injectÃ© automatiquement par Symfony. Il expose 3 mÃ©thodes :'),
            bullet('init() : vÃ©rifie extension_loaded(\'mongodb\') + ping MongoDB. Met $disponible = true si OK.'),
            bullet('enregistrerCommande() : BulkWrite INSERT document statistique. Silencieux si indisponible.'),
            bullet('getStatsGlobales() : 4 pipelines d\'agrÃ©gation â†’ chiffre d\'affaires, top menus, top villes, Ã©volution mensuelle.'),
            p('Toutes les opÃ©rations MongoDB sont enveloppÃ©es dans try/catch. L\'application fonctionne intÃ©gralement mÃªme si MongoDB est absent.'),
            pageBreak(),

            // â”€â”€ 6. SÃ‰CURITÃ‰ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('6. SÃ©curitÃ© applicative'),
            simpleTable(
                ['VulnÃ©rabilitÃ©', 'Mesure mise en place'],
                [
                    ['Injection SQL', 'Doctrine ORM avec requÃªtes prÃ©parÃ©es â€” aucune requÃªte SQL brute'],
                    ['XSS', 'Twig Ã©chappe automatiquement toutes les variables ({{ var }})'],
                    ['CSRF', 'Tokens CSRF activÃ©s sur form_login et sur tous les formulaires de suppression (POST)'],
                    ['AccÃ¨s non autorisÃ©', 'access_control Symfony par prÃ©fixe de route et rÃ´le ROLE_'],
                    ['IDOR (Insecure Direct Object Reference)', 'VÃ©rification owner sur les commandes client : $commande->getUtilisateur() === $this->getUser()'],
                    ['Injection de statut', 'Whitelist de statuts autorisÃ©s dans CommandeController (Admin et EmployÃ©)'],
                    ['Mots de passe faibles', 'Contrainte Length(min:8) sur l\'inscription + hashage auto Symfony'],
                    ['DonnÃ©es de prix manipulÃ©es', 'Prix calculÃ© exclusivement cÃ´tÃ© serveur â€” non mappÃ© depuis le formulaire'],
                    ['Brute force', 'remember_me avec secret APP_SECRET + CSRF sur le formulaire de connexion'],
                ]
            ),
            pageBreak(),

            // â”€â”€ 7. DIFFICULTÃ‰S â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('7. DifficultÃ©s rencontrÃ©es et solutions'),

            h2('7.1 IncompatibilitÃ© de l\'extension PHP mongodb sur Windows'),
            pBold('ProblÃ¨me :'),
            p('Toutes les DLL mongodb disponibles sur PECL retournent l\'erreur "Module compiled with module API=20240924 / PHP compiled with module API=20250925". L\'API module de PHP 8.5.7 (20250925) est incompatible avec les DLL compilÃ©es pour PHP 8.4 (20240924). MÃªme la DLL nommÃ©e "8.5" sur PECL a Ã©tÃ© compilÃ©e contre une Release Candidate de PHP 8.5 qui utilisait encore l\'API 8.4.'),
            pBold('Solution retenue : mode dÃ©gradÃ© gracieux'),
            p('PlutÃ´t que de rÃ©trograder PHP, le StatistiqueService dÃ©tecte la disponibilitÃ© de l\'extension Ã  l\'initialisation. S\'il est absent ou inaccessible, toutes les mÃ©thodes retournent silencieusement. L\'application fonctionne normalement. DÃ¨s qu\'une DLL compatible PHP 8.5 sera publiÃ©e, il suffira de la copier dans le dossier ext/ sans modifier une ligne de code.'),
            note('Ce problÃ¨me illustre la rÃ©silience applicative : une fonctionnalitÃ© optionnelle ne doit jamais bloquer l\'application principale.'),

            h2('7.2 IncompatibilitÃ© doctrine/mongodb-odm-bundle avec mongodb 2.x'),
            pBold('ProblÃ¨me :'),
            p('Le bundle Doctrine ODM pour MongoDB a Ã©tÃ© installÃ© en premiÃ¨re approche. Il levait immÃ©diatement une erreur "Class MongoDB\\Driver\\Monitoring\\CommandSubscriber not found". Cette interface a Ã©tÃ© supprimÃ©e dans la version 2.x de l\'extension mongodb.'),
            pBold('Solution :'),
            p('DÃ©sinstallation du bundle ODM. Utilisation directe de l\'API bas niveau PHP : MongoDB\\Driver\\Manager, MongoDB\\Driver\\BulkWrite, MongoDB\\Driver\\Command. Cette approche ne dÃ©pend d\'aucun bundle tiers et est compatible avec toutes les versions de l\'extension.'),

            h2('7.3 BOM dans le fichier gÃ©nÃ©rÃ© par make:security:form-login'),
            pBold('ProblÃ¨me :'),
            p('La commande php bin/console make:security:form-login, exÃ©cutÃ©e de maniÃ¨re non interactive sous PowerShell, a gÃ©nÃ©rÃ© le fichier SecurityController.php avec un caractÃ¨re BOM (Byte Order Mark) en dÃ©but de fichier. Ce BOM corrompait le nom de classe PHP et causait une erreur Ã  l\'exÃ©cution.'),
            pBold('Solution :'),
            p('Suppression du fichier gÃ©nÃ©rÃ© et recrÃ©ation manuelle. Utilisation de la syntaxe pipe PowerShell pour transmettre les rÃ©ponses interactives Ã  la commande make.'),

            h2('7.4 getRoles() sans prÃ©fixe ROLE_'),
            pBold('ProblÃ¨me :'),
            p('La mÃ©thode getRoles() de l\'entitÃ© Utilisateur retournait le libelle brut du rÃ´le ("administrateur") sans le prÃ©fixe ROLE_ requis par Symfony. L\'access_control ne fonctionnait pas et tous les utilisateurs Ã©taient refusÃ©s.'),
            pBold('Solution :'),
            p('Modification de getRoles() pour retourner [\'ROLE_\' . strtoupper($libelle)]. Mise Ã  jour corrÃ©lative du security.yaml pour utiliser ROLE_ADMINISTRATEUR, ROLE_EMPLOYE, ROLE_UTILISATEUR.'),
            pageBreak(),

            // â”€â”€ 8. BILAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            h1('8. Bilan et perspectives'),

            h2('8.1 FonctionnalitÃ©s rÃ©alisÃ©es'),
            simpleTable(
                ['FonctionnalitÃ©', 'Statut'],
                [
                    ['Authentification Symfony (form_login, CSRF, remember_me)', 'RÃ©alisÃ©'],
                    ['Inscription client', 'RÃ©alisÃ©'],
                    ['CRUD Menus (admin)', 'RÃ©alisÃ©'],
                    ['CRUD Plats avec allergÃ¨nes (admin)', 'RÃ©alisÃ©'],
                    ['Gestion des commandes â€” admin', 'RÃ©alisÃ©'],
                    ['Gestion des utilisateurs (toggle actif)', 'RÃ©alisÃ©'],
                    ['Tableau Kanban employÃ©', 'RÃ©alisÃ©'],
                    ['Passage de commande client (calcul prix serveur)', 'RÃ©alisÃ©'],
                    ['Suivi et historique des commandes client', 'RÃ©alisÃ©'],
                    ['IntÃ©gration MongoDB + graceful degradation', 'RÃ©alisÃ© (dÃ©gradÃ©, DLL incompatible PHP 8.5)'],
                    ['Tableau de bord statistiques', 'RÃ©alisÃ© (activÃ© dÃ¨s DLL compatible disponible)'],
                    ['Diagrammes UML (use case + sÃ©quence)', 'RÃ©alisÃ©'],
                    ['Maquettes wireframes (6 SVG desktop + mobile)', 'RÃ©alisÃ©'],
                    ['Charte graphique', 'RÃ©alisÃ©'],
                    ['Manuel utilisateur', 'RÃ©alisÃ©'],
                ]
            ),

            h2('8.2 Axes d\'amÃ©lioration'),
            bullet('Front-end dÃ©diÃ© : dÃ©veloppement d\'une interface React ou Vue.js consommant une API REST Symfony'),
            bullet('Notifications : envoi d\'e-mails automatiques lors des changements de statut (Symfony Mailer)'),
            bullet('Gestion des images : upload de photos pour les menus et plats (VichUploaderBundle)'),
            bullet('Paiement en ligne : intÃ©gration Stripe pour le rÃ¨glement des commandes'),
            bullet('Tests automatisÃ©s : tests fonctionnels Symfony (WebTestCase) et tests unitaires PHPUnit'),
            bullet('DÃ©ploiement : mise en production sur un serveur Linux (Apache/Nginx) avec pipeline CI/CD'),
            bullet('MongoDB : activation complÃ¨te dÃ¨s publication d\'une DLL compatible PHP 8.5 sur PECL'),

            h2('8.3 CompÃ©tences mises en Å“uvre'),
            pBold('CompÃ©tences du TP DWWM couvertes par ce projet :'),
            bullet('DÃ©velopper la partie front-end d\'une application web : Twig, Bootstrap 5.3, responsive design'),
            bullet('DÃ©velopper la partie back-end d\'une application web : Symfony 7, Doctrine ORM, FormType, Service'),
            bullet('Concevoir et dÃ©velopper une application multi-couches : MVC + service layer + base de donnÃ©es'),
            bullet('Mettre en place une base de donnÃ©es : MySQL (relationnel) + MongoDB (NoSQL)'),
            bullet('DÃ©velopper des composants d\'accÃ¨s aux donnÃ©es : Doctrine repositories, requÃªtes personnalisÃ©es'),
            bullet('RÃ©aliser les tests d\'une application : tests manuels, validation formulaires, CSRF'),
            bullet('RÃ©diger des documents techniques : UML, maquettes, charte, manuel utilisateur'),

            spacer(), spacer(),
            new Paragraph({
                children: [new TextRun({ text: 'Fin du document', size: 20, color: '888888', italics: true })],
                alignment: AlignmentType.CENTER,
            }),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../copie_ecf_vite_et_gourmand.docx', buffer);
    console.log('copie_ecf_vite_et_gourmand.docx gÃ©nÃ©rÃ©.');
});

