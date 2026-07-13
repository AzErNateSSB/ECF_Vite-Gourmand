const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } = require('docx');
const fs = require('fs');

function h1(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
}
function h2(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function h3(text) {
    return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } });
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
                children: [new TextRun({ text: 'Vite & Gourmand â€” Espace Administration', bold: true, size: 40 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Documentation technique â€” Controllers, Forms & Templates', size: 24, color: '666666' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
            }),

            h1('1. Structure de l\'espace admin'),
            p('L\'espace admin est accessible uniquement aux utilisateurs ayant le rÃ´le ROLE_ADMINISTRATEUR. Il est organisÃ© en controllers distincts rangÃ©s dans src/Controller/Admin/ :'),

            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fichier', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PrÃ©fixe route', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RÃ´le', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('DashboardController.php')] }),
                        new TableCell({ children: [new Paragraph('/admin')] }),
                        new TableCell({ children: [new Paragraph('Tableau de bord avec compteurs et derniÃ¨res commandes')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('MenuController.php')] }),
                        new TableCell({ children: [new Paragraph('/admin/menus')] }),
                        new TableCell({ children: [new Paragraph('CRUD complet des menus')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('PlatController.php')] }),
                        new TableCell({ children: [new Paragraph('/admin/plats')] }),
                        new TableCell({ children: [new Paragraph('CRUD complet des plats')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('CommandeController.php')] }),
                        new TableCell({ children: [new Paragraph('/admin/commandes')] }),
                        new TableCell({ children: [new Paragraph('Consultation et changement de statut des commandes')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('UtilisateurController.php')] }),
                        new TableCell({ children: [new Paragraph('/admin/utilisateurs')] }),
                        new TableCell({ children: [new Paragraph('Liste des utilisateurs, activation/dÃ©sactivation')] }),
                    ]}),
                ],
            }),

            h1('2. Le layout admin'),
            p('Tous les templates admin hÃ©ritent de templates/admin/layout.html.twig. Ce layout est autonome (pas d\'extends base.html.twig) pour avoir un design complÃ¨tement sÃ©parÃ© du site public.'),
            p('Il comprend :'),
            bullet('Une sidebar fixe sombre (Bootstrap dark) avec navigation et liens contextuels'),
            bullet('Un systÃ¨me de flash messages automatique (success, error, warning, info)'),
            bullet('Bootstrap 5.3 + Bootstrap Icons chargÃ©s depuis CDN'),
            bullet('DÃ©tection de la route active pour surligner le lien courant dans la sidebar'),

            h1('3. Le tableau de bord'),
            h2('3.1 Compteurs'),
            p('DashboardController injecte 4 repositories et appelle count([]) sur chacun. Doctrine traduit cela en SELECT COUNT(*) â€” une requÃªte lÃ©gÃ¨re sans charger d\'entitÃ©s.'),
            h2('3.2 DerniÃ¨res commandes'),
            p('findBy([], [\'dateCommande\' => \'DESC\'], 5) charge les 5 commandes les plus rÃ©centes via Doctrine. Le troisiÃ¨me paramÃ¨tre (5) est le LIMIT SQL.'),

            h1('4. Les Form Types'),
            p('Symfony Forms permet de dÃ©finir les formulaires comme des classes PHP rÃ©utilisables, sÃ©parÃ©es des controllers et des templates.'),

            h2('4.1 MenuType'),
            p('Champs du formulaire menu :'),
            bullet('titre, description, conditions : champs texte simples'),
            bullet('prixParPersonne : MoneyType â€” affiche le symbole â‚¬ et gÃ¨re la conversion string/float pour les colonnes DECIMAL'),
            bullet('nombrePersonneMinimum, quantiteRestante : IntegerType'),
            bullet('actif : CheckboxType â€” boolÃ©en'),
            bullet('theme : EntityType â€” liste dÃ©roulante des thÃ¨mes en base'),
            bullet('plats : EntityType multiple expanded â€” cases Ã  cocher pour chaque plat'),
            bullet('regimes : EntityType multiple expanded â€” cases Ã  cocher pour chaque rÃ©gime alimentaire'),

            h2('4.2 PlatType'),
            p('Champs du formulaire plat :'),
            bullet('titre : TextType'),
            bullet('typePlat : ChoiceType â€” liste fixe (entrÃ©e, plat, dessert, boisson, autre)'),
            bullet('imageChemin : TextType nullable â€” chemin relatif vers l\'image'),
            bullet('allergenes : EntityType multiple expanded â€” cases Ã  cocher pour chaque allergÃ¨ne'),

            h1('5. Pattern CRUD'),
            p('Les quatre controllers admin (Menu, Plat, Commande, Utilisateur) suivent tous le mÃªme pattern :'),

            h2('5.1 Liste (index)'),
            code('#[Route(\'\', name: \'index\')]'),
            code('public function index(Repository $repo): Response'),
            code('{'),
            code('    return $this->render(\'template/index.html.twig\', [\'items\' => $repo->findAll()]);'),
            code('}'),
            p('Charge toutes les entitÃ©s et les passe au template. Pour les commandes, un tri par date dÃ©croissante est ajoutÃ©.'),

            h2('5.2 CrÃ©ation (new)'),
            p('1. CrÃ©e une instance vide de l\'entitÃ©'),
            p('2. CrÃ©e le formulaire avec createForm()'),
            p('3. handleRequest() injecte les donnÃ©es POST dans le formulaire'),
            p('4. Si soumis et valide : persist() + flush() + addFlash() + redirect()'),
            p('5. Sinon : affiche le formulaire (avec les erreurs Ã©ventuelles)'),

            h2('5.3 Modification (edit)'),
            p('Identique Ã  la crÃ©ation, sauf que l\'entitÃ© est dÃ©jÃ  chargÃ©e par le ParamConverter Symfony (il convertit automatiquement l\'id de l\'URL en entitÃ© via Doctrine).'),

            h2('5.4 Suppression (delete)'),
            p('La route n\'accepte que les requÃªtes POST (methods: [\'POST\']) pour Ã©viter la suppression accidentelle par un simple lien GET. Un token CSRF est vÃ©rifiÃ© avant la suppression.'),
            code('if ($this->isCsrfTokenValid(\'delete_menu_\' . $menu->getId(), $request->request->get(\'_token\'))) {'),
            code('    $em->remove($menu);'),
            code('    $em->flush();'),
            code('}'),
            p('La vÃ©rification CSRF empÃªche les attaques oÃ¹ un site tiers ferait supprimer une ressource Ã  l\'insu de l\'administrateur.'),

            h1('6. Gestion des commandes'),
            h2('6.1 Affichage'),
            p('La liste des commandes affiche toutes les commandes triÃ©es par date dÃ©croissante. Un code couleur par statut aide Ã  identifier rapidement l\'Ã©tat de chaque commande :'),
            bullet('en_attente â†’ badge jaune'),
            bullet('confirmee â†’ badge bleu clair'),
            bullet('en_preparation â†’ badge bleu'),
            bullet('prete â†’ badge vert'),
            bullet('livree â†’ badge gris'),
            bullet('annulee â†’ badge rouge'),

            h2('6.2 Changement de statut'),
            p('La route POST /admin/commandes/{id}/statut reÃ§oit le nouveau statut en paramÃ¨tre POST. Une liste blanche des statuts autorisÃ©s est vÃ©rifiÃ©e avant toute modification â€” on ne peut pas injecter un statut arbitraire :'),
            code('$statuts = [\'en_attente\', \'confirmee\', \'en_preparation\', \'prete\', \'livree\', \'annulee\'];'),
            code('if (in_array($nouveau, $statuts, true)) { ... }'),

            h1('7. Gestion des utilisateurs'),
            p('L\'administrateur peut activer ou dÃ©sactiver un compte utilisateur. La route toggle() bascule simplement le boolÃ©en actif :'),
            code('$utilisateur->setActif(!$utilisateur->isActif());'),
            p('Un utilisateur dÃ©sactivÃ© (actif = false) peut toujours se connecter au niveau de Symfony Security â€” la vÃ©rification du champ actif nÃ©cessiterait d\'implÃ©menter UserCheckerInterface, ce qui sera ajoutÃ© Ã  une prochaine Ã©tape.'),

            h1('8. Templates admin'),
            p('Tous les templates admin suivent la mÃªme structure :'),
            bullet('HÃ©ritage de admin/layout.html.twig via extends'),
            bullet('Bloc title pour le titre de l\'onglet'),
            bullet('Bloc content pour le contenu principal'),
            bullet('Tables Bootstrap responsive avec thead dark'),
            bullet('Boutons d\'action avec icÃ´nes Bootstrap Icons'),
            bullet('Confirmation JavaScript avant suppression (onsubmit="return confirm(...)")'),
            bullet('Tokens CSRF dans les formulaires de suppression'),

            h1('9. Routes gÃ©nÃ©rÃ©es'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nom', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'MÃ©thode', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'URL', bold: true })] })] }),
                    ]}),
                    ...([
                        ['admin_dashboard', 'ANY', '/admin'],
                        ['admin_menu_index', 'ANY', '/admin/menus'],
                        ['admin_menu_new', 'ANY', '/admin/menus/nouveau'],
                        ['admin_menu_edit', 'ANY', '/admin/menus/{id}/modifier'],
                        ['admin_menu_delete', 'POST', '/admin/menus/{id}/supprimer'],
                        ['admin_plat_index', 'ANY', '/admin/plats'],
                        ['admin_plat_new', 'ANY', '/admin/plats/nouveau'],
                        ['admin_plat_edit', 'ANY', '/admin/plats/{id}/modifier'],
                        ['admin_plat_delete', 'POST', '/admin/plats/{id}/supprimer'],
                        ['admin_commande_index', 'ANY', '/admin/commandes'],
                        ['admin_commande_show', 'ANY', '/admin/commandes/{id}'],
                        ['admin_commande_statut', 'POST', '/admin/commandes/{id}/statut'],
                        ['admin_utilisateur_index', 'ANY', '/admin/utilisateurs'],
                        ['admin_utilisateur_toggle', 'POST', '/admin/utilisateurs/{id}/toggle'],
                    ].map(([nom, methode, url]) => new TableRow({ children: [
                        new TableCell({ children: [new Paragraph(nom)] }),
                        new TableCell({ children: [new Paragraph(methode)] }),
                        new TableCell({ children: [new Paragraph(url)] }),
                    ]}))),
                ],
            }),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../explain_admin.docx', buffer);
    console.log('explain_admin.docx gÃ©nÃ©rÃ©.');
});

