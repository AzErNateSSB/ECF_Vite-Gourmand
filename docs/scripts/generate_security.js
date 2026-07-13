const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } = require('docx');
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
            // Titre
            new Paragraph({
                children: [new TextRun({ text: 'Vite & Gourmand â€” Authentification & SÃ©curitÃ©', bold: true, size: 40 })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Documentation technique â€” Symfony Security', size: 24, color: '666666' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
            }),

            h1('1. Vue d\'ensemble'),
            p('La sÃ©curitÃ© de l\'application repose sur le composant Symfony Security. Il gÃ¨re l\'authentification (qui Ãªtes-vous ?), l\'autorisation (avez-vous le droit ?) et la protection CSRF des formulaires.'),
            p('Les trois fichiers principaux sont :'),
            bullet('config/packages/security.yaml â€” configuration centrale'),
            bullet('src/Entity/Utilisateur.php â€” entitÃ© utilisateur avec interfaces Symfony'),
            bullet('src/Controller/SecurityController.php â€” contrÃ´leur de connexion/dÃ©connexion'),

            h1('2. L\'entitÃ© Utilisateur'),
            h2('2.1 Interfaces implÃ©mentÃ©es'),
            p('L\'entitÃ© Utilisateur implÃ©mente deux interfaces Symfony :'),

            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Interface', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RÃ´le', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('UserInterface')] }),
                        new TableCell({ children: [new Paragraph('Oblige Ã  implÃ©menter getUserIdentifier(), getRoles(), eraseCredentials()')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('PasswordAuthenticatedUserInterface')] }),
                        new TableCell({ children: [new Paragraph('Oblige Ã  implÃ©menter getPassword() â€” nÃ©cessaire pour le hachage automatique')] }),
                    ]}),
                ],
            }),

            h2('2.2 getUserIdentifier()'),
            p('Retourne le champ utilisÃ© comme identifiant unique pour l\'authentification. Ici, l\'email :'),
            code('public function getUserIdentifier(): string'),
            code('{'),
            code('    return (string) $this->email;'),
            code('}'),
            p('Pourquoi l\'email et pas le nom d\'utilisateur ? L\'email est naturellement unique, dÃ©jÃ  prÃ©sent dans la table, et Ã©vite d\'avoir un champ username supplÃ©mentaire.'),

            h2('2.3 getRoles()'),
            p('Retourne un tableau de rÃ´les au format attendu par Symfony (prÃ©fixe ROLE_ obligatoire) :'),
            code('public function getRoles(): array'),
            code('{'),
            code('    $libelle = $this->role?->getLibelle() ?? \'utilisateur\';'),
            code('    return [\'ROLE_\' . strtoupper($libelle)];'),
            code('}'),
            p('Les trois rÃ´les possibles dans la base de donnÃ©es sont :'),
            bullet('administrateur â†’ ROLE_ADMINISTRATEUR'),
            bullet('employe â†’ ROLE_EMPLOYE'),
            bullet('utilisateur â†’ ROLE_UTILISATEUR'),
            p('Le prÃ©fixe ROLE_ est exigÃ© par Symfony Security. Sans lui, les rÃ¨gles access_control et is_granted() ne fonctionnent pas.'),

            h2('2.4 eraseCredentials()'),
            p('MÃ©thode vide â€” elle est appelÃ©e par Symfony aprÃ¨s l\'authentification pour effacer d\'Ã©ventuelles donnÃ©es sensibles temporaires (comme un mot de passe en clair stockÃ© temporairement). Ici, on ne stocke rien de tel, donc la mÃ©thode reste vide.'),

            h1('3. Configuration security.yaml'),
            h2('3.1 Password hasher'),
            code('password_hashers:'),
            code('    Symfony\\Component\\Security\\Core\\User\\PasswordAuthenticatedUserInterface: \'auto\''),
            p('La valeur "auto" laisse Symfony choisir le meilleur algorithme disponible sur le serveur. En PHP 8.x, c\'est bcrypt (cost 13) ou argon2id selon les extensions compilÃ©es. Les hachages existants sont automatiquement mis Ã  jour vers le meilleur algorithme lors de la prochaine connexion.'),

            h2('3.2 Provider'),
            code('providers:'),
            code('    app_user_provider:'),
            code('        entity:'),
            code('            class: App\\Entity\\Utilisateur'),
            code('            property: email'),
            p('Le provider indique Ã  Symfony comment charger un utilisateur depuis la base de donnÃ©es. On utilise le provider "entity" de Doctrine : lors d\'une connexion, Symfony exÃ©cute automatiquement SELECT * FROM utilisateur WHERE email = ?'),

            h2('3.3 Firewall'),
            p('Le firewall "main" protÃ¨ge toutes les routes de l\'application :'),
            bullet('form_login : active l\'authentification par formulaire. login_path et check_path pointent vers la route app_login. enable_csrf protÃ¨ge contre les attaques CSRF.'),
            bullet('default_target_path : aprÃ¨s connexion rÃ©ussie, redirige vers app_home.'),
            bullet('logout : la route /deconnexion invalide la session et redirige vers /connexion.'),
            bullet('remember_me : cookie de 7 jours signÃ© avec kernel.secret.'),

            h2('3.4 Access control'),
            p('Les rÃ¨gles sont Ã©valuÃ©es dans l\'ordre â€” la premiÃ¨re qui correspond s\'applique :'),

            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chemin', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RÃ´le requis', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Usage', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('^/admin')] }),
                        new TableCell({ children: [new Paragraph('ROLE_ADMINISTRATEUR')] }),
                        new TableCell({ children: [new Paragraph('Espace administration')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('^/employe')] }),
                        new TableCell({ children: [new Paragraph('ROLE_EMPLOYE')] }),
                        new TableCell({ children: [new Paragraph('Espace employÃ©')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('^/compte')] }),
                        new TableCell({ children: [new Paragraph('ROLE_UTILISATEUR')] }),
                        new TableCell({ children: [new Paragraph('Espace client')] }),
                    ]}),
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph('^/commande')] }),
                        new TableCell({ children: [new Paragraph('ROLE_UTILISATEUR')] }),
                        new TableCell({ children: [new Paragraph('Passage de commande')] }),
                    ]}),
                ],
            }),

            h1('4. Le SecurityController'),
            h2('4.1 Route /connexion (app_login)'),
            p('La mÃ©thode login() utilise AuthenticationUtils pour rÃ©cupÃ©rer deux informations :'),
            bullet('getLastAuthenticationError() : l\'erreur de la tentative prÃ©cÃ©dente (mauvais mot de passe, compte inexistantâ€¦)'),
            bullet('getLastUsername() : le dernier email saisi, pour le rÃ©afficher dans le formulaire aprÃ¨s une erreur.'),
            p('Symfony intercepte le POST du formulaire avant mÃªme d\'appeler cette mÃ©thode â€” le contrÃ´leur ne gÃ¨re que l\'affichage de la page GET.'),

            h2('4.2 Route /deconnexion (app_logout)'),
            p('Le corps de la mÃ©thode logout() ne s\'exÃ©cute jamais. Symfony intercepte cette route au niveau du firewall, invalide la session, supprime le cookie remember_me, et redirige vers la cible configurÃ©e. La mÃ©thode doit exister pour dÃ©finir la route, mais son contenu est ignorÃ©.'),

            h1('5. Le formulaire de connexion'),
            h2('5.1 Champs importants'),
            bullet('name="email" â€” correspond au username_parameter configurÃ© dans security.yaml'),
            bullet('name="password" â€” correspond au password_parameter'),
            bullet('name="_csrf_token" value="{{ csrf_token(\'authenticate\') }}" â€” token CSRF gÃ©nÃ©rÃ© par Symfony, vÃ©rifiÃ© automatiquement'),
            bullet('name="_remember_me" â€” active le cookie persistant si cochÃ©'),

            h2('5.2 Protection CSRF'),
            p('La protection CSRF (Cross-Site Request Forgery) empÃªche un site malveillant de soumettre le formulaire de connexion Ã  la place de l\'utilisateur. Symfony gÃ©nÃ¨re un token unique par session, l\'injecte dans le formulaire, et le vÃ©rifie Ã  la soumission. Si le token est absent ou invalide, la connexion est refusÃ©e.'),

            h1('6. Flux d\'authentification complet'),
            p('1. L\'utilisateur soumet le formulaire POST /connexion'),
            p('2. Symfony intercepte la requÃªte via le firewall form_login'),
            p('3. Le provider charge l\'utilisateur depuis la BDD : SELECT ... WHERE email = ?'),
            p('4. Le password hasher vÃ©rifie le mot de passe hachÃ©'),
            p('5. Si OK : session crÃ©Ã©e, redirection vers app_home'),
            p('6. Si KO : redirection vers /connexion avec erreur en session'),
            p('7. Ã€ chaque requÃªte suivante : Symfony recharge l\'utilisateur depuis la BDD via le provider'),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../explain_security.docx', buffer);
    console.log('explain_security.docx gÃ©nÃ©rÃ©.');
});

