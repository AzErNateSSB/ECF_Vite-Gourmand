const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');
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
function pBold(text) {
    return new Paragraph({ children: [new TextRun({ text, size: 22, bold: true })], spacing: { after: 80 } });
}
function bullet(text) {
    return new Paragraph({
        children: [new TextRun({ text, size: 22 })],
        bullet: { level: 0 },
        spacing: { after: 80 },
    });
}
function colorSwatch(label, hex, usage) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: label, size: 22, bold: true })] })],
            }),
            new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: hex, font: 'Courier New', size: 22 })] })],
            }),
            new TableCell({
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: usage, size: 22 })] })],
            }),
        ],
    });
}

const doc = new Document({
    sections: [{
        children: [
            new Paragraph({
                children: [new TextRun({ text: 'Vite & Gourmand', bold: true, size: 48 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Charte Graphique', bold: true, size: 36, color: 'c8a96e' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'ECF â€” TP DÃ©veloppeur Web et Web Mobile â€” Studi 2024', size: 20, color: '888888' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
            }),

            h1('1. IdentitÃ© visuelle'),
            p('Vite & Gourmand est une sociÃ©tÃ© de traiteur haut de gamme basÃ©e Ã  Bordeaux. La charte graphique reflÃ¨te deux valeurs fondamentales : l\'Ã©lÃ©gance gastronomique et la modernitÃ© digitale. L\'identitÃ© visuelle s\'articule autour d\'un contraste fort entre des fonds sombres institutionnels et des accents dorÃ©s chaleureux, Ã©voquant la gastronomie et le raffinement.'),

            h1('2. Palette de couleurs'),

            h2('2.1 Couleurs principales'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Couleur', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Code hexadÃ©cimal', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Usage', bold: true })] })] }),
                    ]}),
                    colorSwatch('Or/DorÃ©', '#c8a96e', 'Couleur d\'accent principale â€” CTA, prix, bordures actives, titres secondaires'),
                    colorSwatch('Bleu nuit', '#1a1a2e', 'Fond navbar, fond hero, en-tÃªtes de blocs, footer'),
                    colorSwatch('Gris clair', '#f8f9fa', 'Fond de page, fond breadcrumb, fond filtres'),
                    colorSwatch('Blanc', '#ffffff', 'Fond des cartes, fond des formulaires, texte sur fonds sombres'),
                ]}),

            h2('2.2 Couleurs secondaires / Ã©tats'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Couleur', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Code', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Usage', bold: true })] })] }),
                    ]}),
                    colorSwatch('Vert succÃ¨s', '#198754', 'Confirmations, badges vÃ©gÃ©tarien, statut livrÃ©'),
                    colorSwatch('Rouge danger', '#dc3545', 'Erreurs, annulations, alertes critiques'),
                    colorSwatch('Jaune warning', '#ffc107 / #856404', 'Avertissements, statut en attente, badges Premium'),
                    colorSwatch('Bleu info', '#0d6efd', 'Liens, badges info, notifications'),
                    colorSwatch('Gris texte', '#6c757d', 'Textes secondaires, labels de formulaire, descriptions'),
                    colorSwatch('Gris bordure', '#dee2e6', 'Bordures de cartes, sÃ©parateurs, inputs'),
                ]}),

            h1('3. Typographie'),
            h2('3.1 Police principale'),
            p('L\'application utilise la pile systÃ¨me de Bootstrap 5 : system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif. Ce choix garantit une cohÃ©rence avec le systÃ¨me d\'exploitation de l\'utilisateur et des performances optimales (aucun chargement de police externe).'),

            h2('3.2 HiÃ©rarchie typographique'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Niveau', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Taille', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Poids', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Usage', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('Titre de page (h1)')] }),
                        new TableCell({ children: [new Paragraph('2rem')] }),
                        new TableCell({ children: [new Paragraph('700')] }),
                        new TableCell({ children: [new Paragraph('Titre principal de chaque section')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('Titre de carte (h2)')] }),
                        new TableCell({ children: [new Paragraph('1.25rem')] }),
                        new TableCell({ children: [new Paragraph('600')] }),
                        new TableCell({ children: [new Paragraph('Nom de menu, de section')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('Texte courant')] }),
                        new TableCell({ children: [new Paragraph('1rem')] }),
                        new TableCell({ children: [new Paragraph('400')] }),
                        new TableCell({ children: [new Paragraph('Corps de texte, labels')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('Texte secondaire')] }),
                        new TableCell({ children: [new Paragraph('0.875rem')] }),
                        new TableCell({ children: [new Paragraph('400')] }),
                        new TableCell({ children: [new Paragraph('Descriptions, mÃ©tadonnÃ©es, aides')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('Prix')] }),
                        new TableCell({ children: [new Paragraph('1.1rem')] }),
                        new TableCell({ children: [new Paragraph('700')] }),
                        new TableCell({ children: [new Paragraph('Prix en couleur #c8a96e')] }),
                    ]}),
                ]}),

            h2('3.3 Police monospace'),
            p('Courier New est utilisÃ©e pour les extraits de code dans la documentation technique et les numÃ©ros de commande (format CMD-xxxxxxxx).'),

            h1('4. Iconographie'),
            p('L\'application utilise Bootstrap Icons (CDN) pour la totalitÃ© des icÃ´nes. Ce choix garantit la cohÃ©rence visuelle avec Bootstrap 5 et Ã©vite toute dÃ©pendance Ã  un fichier de fonte supplÃ©mentaire.'),

            h2('IcÃ´nes principales utilisÃ©es'),
            bullet('bi-speedometer2 â€” Tableau de bord'),
            bullet('bi-card-list â€” Menus / Commandes'),
            bullet('bi-egg-fried â€” Plats'),
            bullet('bi-people â€” Utilisateurs'),
            bullet('bi-bar-chart â€” Statistiques'),
            bullet('bi-kanban â€” Vue Kanban employÃ©'),
            bullet('bi-check-circle â€” Statut confirmÃ© / succÃ¨s'),
            bullet('bi-x-circle â€” Annulation'),
            bullet('bi-geo-alt â€” Localisation / villes'),
            bullet('bi-trophy â€” Classement top menus'),

            h1('5. Composants UI'),

            h2('5.1 Boutons'),
            p('Les boutons primaires utilisent la couleur dorÃ©e #c8a96e avec du texte blanc et un border-radius de 50px (pill) pour les CTA principaux, ou un radius standard de 4px pour les actions secondaires dans les tableaux.'),
            bullet('CTA principal (Commander, Confirmer) : bg #c8a96e, texte blanc, pill'),
            bullet('Action secondaire (Modifier, Voir) : outline Bootstrap standard'),
            bullet('Danger (Supprimer, Annuler) : btn-danger Bootstrap'),

            h2('5.2 Cartes'),
            p('Les cartes utilisent un fond blanc, une bordure #dee2e6 d\'1px, un border-radius de 8px et une ombre lÃ©gÃ¨re (shadow-sm). L\'en-tÃªte de carte reprend la couleur #1a1a2e ou #c8a96e selon le contexte. Une barre colorÃ©e de 6-8px en haut de carte est utilisÃ©e pour les cartes d\'atouts sur la page d\'accueil.'),

            h2('5.3 Formulaires'),
            p('Les champs de formulaire suivent les standards Bootstrap 5 : fond blanc, bordure #ced4da, focus en bleu Bootstrap. Les labels sont en #495057. Les champs obligatoires sont marquÃ©s d\'un astÃ©risque *.'),

            h2('5.4 Navigation'),
            bullet('Navbar publique : fond #1a1a2e, texte #adb5bd, lien actif en blanc, CTA en #c8a96e'),
            bullet('Sidebar admin : fond #212529, icÃ´nes Bootstrap Icons, lien actif sur fond plus clair'),
            bullet('Sidebar employÃ© : fond #1a3c5e (bleu marine), mÃªme structure'),
            bullet('Navbar client : fond #1a1a2e, liens Bootstrap, badge utilisateur'),

            h2('5.5 Badges et statuts'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Statut', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Couleur Bootstrap', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('en_attente')] }), new TableCell({ children: [new Paragraph('bg-secondary')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('confirmee')] }), new TableCell({ children: [new Paragraph('bg-primary')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('en_preparation')] }), new TableCell({ children: [new Paragraph('bg-warning text-dark')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('prete')] }), new TableCell({ children: [new Paragraph('bg-info')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('livree')] }), new TableCell({ children: [new Paragraph('bg-success')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('annulee')] }), new TableCell({ children: [new Paragraph('bg-danger')] })]}),
                ]}),

            h1('6. Responsive design'),
            p('L\'application est dÃ©veloppÃ©e mobile-first via Bootstrap 5.3. Les breakpoints utilisÃ©s sont :'),
            bullet('< 576px (xs) : mise en page 1 colonne, hamburger menu, cartes empilÃ©es'),
            bullet('576pxâ€“768px (sm) : 2 colonnes pour les grilles de cartes'),
            bullet('768pxâ€“992px (md) : grille 2-3 colonnes, sidebar masquÃ©e'),
            bullet('â‰¥ 992px (lg) : layout 2 colonnes (formulaire + rÃ©cap), grille 3 colonnes'),
            p('Sur mobile, le formulaire de commande passe en une seule colonne et le rÃ©capitulatif s\'affiche sous le formulaire. Les sidebars admin/employÃ© se transforment en navigation hamburger.'),

            h1('7. CohÃ©rence ECF'),
            p('La charte graphique appliquÃ©e dans ce projet respecte les exigences de l\'ECF du TP DWWM :'),
            bullet('AccessibilitÃ© : contrastes suffisants (texte blanc sur fonds sombres, texte sombre sur fonds clairs)'),
            bullet('Responsive : testÃ© sur viewport 390px (mobile) et 1440px (desktop)'),
            bullet('CohÃ©rence : les 3 espaces (public, client, admin/employÃ©) partagent la mÃªme palette'),
            bullet('IdentitÃ© : la couleur dorÃ©e #c8a96e diffÃ©rencie visuellement la marque'),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../charte_graphique.docx', buffer);
    console.log('charte_graphique.docx gÃ©nÃ©rÃ©.');
});

