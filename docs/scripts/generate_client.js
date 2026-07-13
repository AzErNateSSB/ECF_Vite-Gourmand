const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } = require('docx');
const fs = require('fs');

function h1(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
}
function h2(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function p(text) {
    return new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 120 } });
}
function code(text) {
    return new Paragraph({
        children: [new TextRun({ text, font: 'Courier New', size: 20, color: '1a1a2e' })],
        spacing: { after: 80 },
        indent: { left: 400 },
    });
}
function bullet(text) {
    return new Paragraph({
        children: [new TextRun({ text, size: 22 })],
        bullet: { level: 0 },
        spacing: { after: 80 },
    });
}

const doc = new Document({
    sections: [{
        children: [
            new Paragraph({
                children: [new TextRun({ text: 'Vite & Gourmand â€” Espace Client & Inscription', bold: true, size: 40 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Documentation technique â€” Inscription, profil, commandes client', size: 24, color: '666666' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
            }),

            h1('1. Vue d\'ensemble'),
            p('L\'espace client regroupe deux fonctionnalitÃ©s principales : l\'inscription (crÃ©ation de compte) et l\'espace personnel du client connectÃ© (dashboard, historique, passage de commande).'),
            p('L\'inscription est accessible sans Ãªtre connectÃ©. L\'espace client (/compte) est protÃ©gÃ© par le rÃ´le ROLE_UTILISATEUR via l\'access_control de security.yaml.'),

            h1('2. Fichiers crÃ©Ã©s'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fichier', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RÃ´le', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('src/Controller/InscriptionController.php')] }),
                        new TableCell({ children: [new Paragraph('GÃ¨re le formulaire de crÃ©ation de compte')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('src/Controller/Client/CompteController.php')] }),
                        new TableCell({ children: [new Paragraph('Dashboard client, nouvelle commande, dÃ©tail commande')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('src/Form/InscriptionType.php')] }),
                        new TableCell({ children: [new Paragraph('Formulaire de crÃ©ation de compte (email, mdp, infos perso)')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('src/Form/CommandeType.php')] }),
                        new TableCell({ children: [new Paragraph('Formulaire de commande (menu, personnes, date, adresseâ€¦)')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/inscription/index.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Page d\'inscription')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/client/layout.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Layout client avec navbar (hÃ©rite de base.html.twig)')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/client/dashboard.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Dashboard : profil + historique commandes')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/client/commande/new.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Formulaire de passage de commande')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/client/commande/show.html.twig')] }),
                        new TableCell({ children: [new Paragraph('DÃ©tail d\'une commande avec suivi de statut')] }),
                    ]}),
                ],
            }),

            h1('3. L\'inscription'),
            h2('3.1 InscriptionType'),
            p('Le formulaire d\'inscription utilise un champ spÃ©cial plainPassword de type RepeatedType :'),
            bullet('RepeatedType crÃ©e deux champs identiques (mot de passe + confirmation)'),
            bullet('mapped: false â€” ce champ n\'est pas directement liÃ© Ã  une propriÃ©tÃ© de l\'entitÃ©'),
            bullet('Symfony vÃ©rifie automatiquement que les deux saisies sont identiques'),
            bullet('Une contrainte Length(min: 8) empÃªche les mots de passe trop courts'),

            h2('3.2 InscriptionController'),
            p('Ã‰tapes du traitement :'),
            bullet('1. Si l\'utilisateur est dÃ©jÃ  connectÃ©, redirection vers l\'accueil'),
            bullet('2. CrÃ©ation d\'une instance vide de Utilisateur'),
            bullet('3. RÃ©cupÃ©ration du mot de passe en clair depuis le champ non-mappÃ© plainPassword'),
            bullet('4. Hachage du mot de passe avec UserPasswordHasherInterface'),
            bullet('5. Attribution automatique du rÃ´le "utilisateur" (findOneBy)'),
            bullet('6. actif = true par dÃ©faut'),
            bullet('7. Persist + flush + flash message + redirection vers /connexion'),
            p('Le rÃ´le est rÃ©cupÃ©rÃ© via RoleRepository->findOneBy([\'libelle\' => \'utilisateur\']). Ainsi, un nouveau compte reÃ§oit toujours le rÃ´le le moins privilÃ©giÃ©.'),

            h1('4. L\'espace client'),
            h2('4.1 Dashboard'),
            p('La page /compte affiche deux blocs cÃ´te Ã  cÃ´te :'),
            bullet('Profil : informations de l\'utilisateur connectÃ© (app.user en Twig)'),
            bullet('Historique : toutes les commandes de l\'utilisateur triÃ©es par date dÃ©croissante'),
            p('Les commandes sont filtrÃ©es par utilisateur connectÃ© :'),
            code('$repo->findBy([\'utilisateur\' => $this->getUser()], [\'dateCommande\' => \'DESC\'])'),

            h2('4.2 Passer une commande'),
            p('Le formulaire CommandeType propose uniquement les menus actifs (actif = true) grÃ¢ce Ã  un query_builder :'),
            code('\'query_builder\' => fn($repo) => $repo->createQueryBuilder(\'m\')'),
            code('    ->where(\'m.actif = true\')'),
            code('    ->orderBy(\'m.titre\')'),
            p('Le calcul du prix est fait cÃ´tÃ© serveur dans le controller, jamais cÃ´tÃ© client :'),
            bullet('prixMenu = prixParPersonne Ã— nombrePersonnes'),
            bullet('prixLivraison = 50 â‚¬ fixe'),
            bullet('prixReduction = 0 â‚¬ (extensible pour des codes promo)'),
            bullet('prixTotal = prixMenu + prixLivraison - prixReduction'),
            p('Le numÃ©ro de commande est gÃ©nÃ©rÃ© automatiquement avec uniqid() prÃ©fixÃ© CMD- :'),
            code('$commande->setNumeroCommande(\'CMD-\' . strtoupper(uniqid()));'),
            p('Le statut initial est toujours "en_attente". La commande est ensuite traitÃ©e par un employÃ©.'),

            h2('4.3 SÃ©curitÃ© de la consultation'),
            p('La route de dÃ©tail /compte/commande/{id} vÃ©rifie que la commande appartient bien Ã  l\'utilisateur connectÃ© avant de l\'afficher :'),
            code('if ($commande->getUtilisateur() !== $this->getUser()) {'),
            code('    throw $this->createAccessDeniedException();'),
            code('}'),
            p('Sans cette vÃ©rification, un client pourrait accÃ©der aux commandes d\'autres clients en devinant les IDs (IDOR â€” Insecure Direct Object Reference).'),

            h1('5. Routes'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nom', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'URL', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Protection', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('app_inscription')] }),
                        new TableCell({ children: [new Paragraph('/inscription')] }),
                        new TableCell({ children: [new Paragraph('Publique (redirige si dÃ©jÃ  connectÃ©)')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('client_dashboard')] }),
                        new TableCell({ children: [new Paragraph('/compte')] }),
                        new TableCell({ children: [new Paragraph('ROLE_UTILISATEUR')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('client_commande_new')] }),
                        new TableCell({ children: [new Paragraph('/compte/commande/nouvelle')] }),
                        new TableCell({ children: [new Paragraph('ROLE_UTILISATEUR')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('client_commande_show')] }),
                        new TableCell({ children: [new Paragraph('/compte/commande/{id}')] }),
                        new TableCell({ children: [new Paragraph('ROLE_UTILISATEUR + vÃ©rification propriÃ©taire')] }),
                    ]}),
                ],
            }),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../explain_client.docx', buffer);
    console.log('explain_client.docx gÃ©nÃ©rÃ©.');
});

