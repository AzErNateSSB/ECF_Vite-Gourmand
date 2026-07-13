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
                children: [new TextRun({ text: 'Vite & Gourmand â€” Espace EmployÃ©', bold: true, size: 40 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Documentation technique â€” Controller, routes & templates', size: 24, color: '666666' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
            }),

            h1('1. Vue d\'ensemble'),
            p('L\'espace employÃ© est accessible uniquement aux utilisateurs ayant le rÃ´le ROLE_EMPLOYE. Son unique responsabilitÃ© est la gestion opÃ©rationnelle des commandes : voir les commandes en cours et faire avancer leur statut.'),
            p('Il est intentionnellement limitÃ© par rapport Ã  l\'espace admin : un employÃ© ne peut pas crÃ©er ou supprimer des menus, ni accÃ©der aux donnÃ©es des utilisateurs.'),

            h1('2. Structure des fichiers'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fichier', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RÃ´le', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('src/Controller/Employe/CommandeController.php')] }),
                        new TableCell({ children: [new Paragraph('Toute la logique employÃ© : dashboard, liste, dÃ©tail, changement de statut')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/employe/layout.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Layout HTML autonome avec sidebar bleue marine')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/employe/dashboard.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Vue Kanban 3 colonnes')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/employe/commande/index.html.twig')] }),
                        new TableCell({ children: [new Paragraph('Liste tabulaire des commandes actives')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('templates/employe/commande/show.html.twig')] }),
                        new TableCell({ children: [new Paragraph('DÃ©tail d\'une commande avec boutons de transition')] }),
                    ]}),
                ],
            }),

            h1('3. Les routes'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nom', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'URL', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('employe_dashboard')] }),
                        new TableCell({ children: [new Paragraph('/employe')] }),
                        new TableCell({ children: [new Paragraph('Tableau de bord Kanban')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('employe_commande_index')] }),
                        new TableCell({ children: [new Paragraph('/employe/commandes')] }),
                        new TableCell({ children: [new Paragraph('Liste des commandes actives (tableau)')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('employe_commande_show')] }),
                        new TableCell({ children: [new Paragraph('/employe/commandes/{id}')] }),
                        new TableCell({ children: [new Paragraph('DÃ©tail d\'une commande')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('employe_commande_statut')] }),
                        new TableCell({ children: [new Paragraph('/employe/commandes/{id}/statut (POST)')] }),
                        new TableCell({ children: [new Paragraph('Mise Ã  jour du statut')] }),
                    ]}),
                ],
            }),

            h1('4. Le tableau de bord Kanban'),
            p('Le dashboard charge trois listes de commandes sÃ©parÃ©es selon leur statut :'),
            bullet('a_traiter : statut "confirmee" â€” commandes confirmÃ©es par le client, en attente de prÃ©paration'),
            bullet('en_cours : statut "en_preparation" â€” commandes actuellement en cuisine'),
            bullet('pretes : statut "prete" â€” commandes terminÃ©es, prÃªtes Ã  Ãªtre livrÃ©es'),
            p('Chaque carte de commande affiche le numÃ©ro, le client, le nombre de personnes, le menu, et un bouton d\'action rapide pour avancer au statut suivant sans quitter le dashboard.'),

            h2('4.1 Transitions depuis le Kanban'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Colonne', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Bouton', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nouveau statut', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('Ã€ prÃ©parer (confirmee)')] }),
                        new TableCell({ children: [new Paragraph('DÃ©marrer')] }),
                        new TableCell({ children: [new Paragraph('en_preparation')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('En prÃ©paration')] }),
                        new TableCell({ children: [new Paragraph('PrÃªte')] }),
                        new TableCell({ children: [new Paragraph('prete')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('PrÃªtes Ã  livrer')] }),
                        new TableCell({ children: [new Paragraph('LivrÃ©e')] }),
                        new TableCell({ children: [new Paragraph('livree')] }),
                    ]}),
                ],
            }),

            h1('5. SÃ©curitÃ© des transitions'),
            p('La route de changement de statut valide le nouveau statut contre une liste blanche avant tout enregistrement :'),
            code('$statuts = [\'en_attente\', \'confirmee\', \'en_preparation\', \'prete\', \'livree\', \'annulee\'];'),
            code('if (in_array($nouveau, $statuts, true)) {'),
            code('    $commande->setStatut($nouveau);'),
            code('    $em->flush();'),
            code('}'),
            p('Cela empÃªche d\'injecter une valeur arbitraire via un formulaire HTML modifiÃ©. Le paramÃ¨tre true dans in_array() active la vÃ©rification de type stricte.'),
            p('La route elle-mÃªme est protÃ©gÃ©e par le firewall Symfony (ROLE_EMPLOYE requis via access_control dans security.yaml). Un utilisateur non connectÃ© ou sans le bon rÃ´le est redirigÃ© vers /connexion.'),

            h1('6. Vue dÃ©tail d\'une commande'),
            p('La page de dÃ©tail affiche toutes les informations de la commande et propose les boutons de transition adaptÃ©s au statut courant.'),
            p('Les transitions disponibles sont dÃ©finies dans un objet Twig pour Ã©viter la rÃ©pÃ©tition :'),
            code('{% set transitions = {'),
            code('    \'en_attente\':     {\'label\': \'Confirmer\',      \'statut\': \'confirmee\', ...},'),
            code('    \'confirmee\':      {\'label\': \'DÃ©marrer\',       \'statut\': \'en_preparation\', ...},'),
            code('    \'en_preparation\': {\'label\': \'Marquer prÃªte\',  \'statut\': \'prete\', ...},'),
            code('    \'prete\':          {\'label\': \'Marquer livrÃ©e\', \'statut\': \'livree\', ...},'),
            code('} %}'),
            p('Si le statut de la commande est prÃ©sent dans les clÃ©s du tableau, le bouton correspondant s\'affiche. Cela Ã©vite les conditions if/elseif rÃ©pÃ©tÃ©es.'),
            p('Le bouton "Annuler" est disponible pour tous les statuts sauf livree et annulee, avec une confirmation JavaScript avant soumission.'),

            h1('7. Cycle de vie complet d\'une commande'),
            p('1. en_attente â€” commande passÃ©e par le client, pas encore traitÃ©e'),
            p('2. confirmee â€” admin ou employÃ© a confirmÃ© la commande'),
            p('3. en_preparation â€” la cuisine a commencÃ©'),
            p('4. prete â€” la commande est prÃªte Ã  Ãªtre livrÃ©e'),
            p('5. livree â€” commande remise au client'),
            p('6. annulee â€” commande annulÃ©e Ã  n\'importe quelle Ã©tape'),
            p('Les statuts livree et annulee sont terminaux : aucun bouton de transition n\'est proposÃ© une fois dans ces Ã©tats.'),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../explain_employe.docx', buffer);
    console.log('explain_employe.docx gÃ©nÃ©rÃ©.');
});

