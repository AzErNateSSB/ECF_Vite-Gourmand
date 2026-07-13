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
function note(text) {
    return new Paragraph({
        children: [new TextRun({ text: 'â„¹ ' + text, size: 22, color: '0d6efd' })],
        spacing: { after: 120 },
        indent: { left: 200 },
    });
}
function warning(text) {
    return new Paragraph({
        children: [new TextRun({ text: 'âš  ' + text, size: 22, color: 'b45309' })],
        spacing: { after: 120 },
        indent: { left: 200 },
    });
}
function step(n, text) {
    return new Paragraph({
        children: [
            new TextRun({ text: `Ã‰tape ${n} â€” `, size: 22, bold: true }),
            new TextRun({ text, size: 22 }),
        ],
        spacing: { after: 100 },
        indent: { left: 200 },
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
                children: [new TextRun({ text: 'Manuel Utilisateur', bold: true, size: 36, color: 'c8a96e' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
            }),
            new Paragraph({
                children: [new TextRun({ text: 'Guide d\'utilisation de l\'application web', size: 22, color: '888888' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
            }),

            h1('Introduction'),
            p('Vite & Gourmand est une application web permettant Ã  des clients de commander des prestations de traiteur en ligne. Ce manuel dÃ©crit les fonctionnalitÃ©s disponibles selon trois profils : client (particulier ou professionnel), employÃ© de l\'entreprise, et administrateur.'),
            p('L\'application est accessible depuis un navigateur web Ã  l\'adresse fournie par votre administrateur systÃ¨me.'),

            // ====================
            // PARTIE 1 : CLIENT
            // ====================
            h1('1. Espace Client'),

            h2('1.1 CrÃ©er un compte'),
            p('Si vous n\'avez pas encore de compte, vous pouvez vous inscrire gratuitement.'),
            step(1, 'Cliquez sur le bouton "Connexion" dans la barre de navigation en haut de page.'),
            step(2, 'Sur la page de connexion, cliquez sur le lien "Pas encore de compte ? S\'inscrire".'),
            step(3, 'Remplissez le formulaire d\'inscription :'),
            bullet('PrÃ©nom et nom'),
            bullet('Adresse e-mail (sera votre identifiant de connexion)'),
            bullet('Mot de passe (minimum 8 caractÃ¨res) â€” Ã  saisir deux fois pour confirmation'),
            step(4, 'Cliquez sur "CrÃ©er mon compte". Vous Ãªtes automatiquement connectÃ© et redirigÃ© vers votre espace.'),
            note('Votre adresse e-mail doit Ãªtre unique. Si elle est dÃ©jÃ  utilisÃ©e, un message d\'erreur s\'affichera.'),

            h2('1.2 Se connecter'),
            step(1, 'Cliquez sur "Connexion" dans la barre de navigation.'),
            step(2, 'Saisissez votre adresse e-mail et votre mot de passe.'),
            step(3, 'Cochez "Se souvenir de moi" pour rester connectÃ© 7 jours sur cet appareil.'),
            step(4, 'Cliquez sur "Se connecter".'),
            warning('En cas d\'erreur rÃ©pÃ©tÃ©e, vÃ©rifiez que votre compte n\'a pas Ã©tÃ© dÃ©sactivÃ© par l\'administrateur.'),

            h2('1.3 Passer une commande'),
            p('Une fois connectÃ©, vous pouvez passer une commande depuis votre espace personnel.'),
            step(1, 'Cliquez sur "Passer une commande" dans la barre de navigation.'),
            step(2, 'SÃ©lectionnez un menu dans la liste dÃ©roulante. Seuls les menus actifs sont proposÃ©s.'),
            step(3, 'Renseignez le nombre de personnes. Le minimum varie selon le menu (gÃ©nÃ©ralement 15 Ã  30 personnes).'),
            step(4, 'Indiquez la date et l\'heure souhaitÃ©es pour la livraison.'),
            step(5, 'Saisissez l\'adresse complÃ¨te de livraison : rue, ville, code postal.'),
            step(6, 'Ajoutez Ã©ventuellement une note (allergies particuliÃ¨res, accÃ¨s spÃ©cifique, instructions de livraison).'),
            step(7, 'VÃ©rifiez le rÃ©capitulatif Ã  droite du formulaire. Le prix total est calculÃ© automatiquement.'),
            step(8, 'Cliquez sur "Confirmer la commande".'),
            note('Le prix total = (prix par personne Ã— nombre de personnes) + 50 â‚¬ de forfait livraison. Ce calcul est effectuÃ© automatiquement par l\'application â€” vous n\'avez rien Ã  saisir.'),

            h2('1.4 Suivre ses commandes'),
            p('Toutes vos commandes sont visibles dans votre espace personnel.'),
            step(1, 'Cliquez sur "Mon espace" dans la barre de navigation.'),
            step(2, 'Votre tableau de bord affiche la liste de vos commandes avec leur statut actuel.'),
            step(3, 'Cliquez sur "Voir le dÃ©tail" pour consulter les informations complÃ¨tes d\'une commande.'),

            h2('1.5 Comprendre les statuts de commande'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Statut', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Signification', bold: true })] })] }),
                    ]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('En attente')] }), new TableCell({ children: [new Paragraph('Votre commande a Ã©tÃ© reÃ§ue et est en cours de vÃ©rification.')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('ConfirmÃ©e')] }), new TableCell({ children: [new Paragraph('L\'Ã©quipe a validÃ© votre commande. La prÃ©paration va dÃ©marrer.')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('En prÃ©paration')] }), new TableCell({ children: [new Paragraph('Vos plats sont en cours de prÃ©paration.')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('PrÃªte')] }), new TableCell({ children: [new Paragraph('Votre commande est prÃªte, la livraison va avoir lieu.')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('LivrÃ©e')] }), new TableCell({ children: [new Paragraph('Votre commande a Ã©tÃ© livrÃ©e.')] })]}),
                    new TableRow({ children: [new TableCell({ children: [new Paragraph('AnnulÃ©e')] }), new TableCell({ children: [new Paragraph('Votre commande a Ã©tÃ© annulÃ©e. Contactez-nous pour plus d\'informations.')] })]}),
                ]}),

            h2('1.6 Se dÃ©connecter'),
            p('Cliquez sur "DÃ©connexion" dans la barre de navigation. Vous Ãªtes redirigÃ© vers la page de connexion.'),

            // ====================
            // PARTIE 2 : EMPLOYÃ‰
            // ====================
            h1('2. Espace EmployÃ©'),
            p('L\'espace employÃ© est accessible Ã  l\'adresse /employe aprÃ¨s connexion avec un compte de rÃ´le EmployÃ©.'),

            h2('2.1 Tableau de bord Kanban'),
            p('La page principale de l\'espace employÃ© prÃ©sente un tableau Kanban avec trois colonnes reprÃ©sentant les Ã©tapes de traitement des commandes :'),
            bullet('Colonne "ConfirmÃ©e" : commandes validÃ©es par l\'admin, Ã  prendre en charge'),
            bullet('Colonne "En prÃ©paration" : commandes en cours de prÃ©paration'),
            bullet('Colonne "PrÃªte" : commandes prÃªtes Ã  Ãªtre livrÃ©es'),
            note('Les commandes en attente, livrÃ©es et annulÃ©es n\'apparaissent pas dans le Kanban â€” elles relÃ¨vent de la responsabilitÃ© de l\'administrateur.'),

            h2('2.2 Changer le statut d\'une commande'),
            step(1, 'RepÃ©rez la commande dans la colonne correspondante.'),
            step(2, 'Cliquez sur "Voir dÃ©tail" pour consulter les informations (menu, nombre de personnes, adresse, date).'),
            step(3, 'Dans la page de dÃ©tail, utilisez le formulaire de changement de statut.'),
            step(4, 'SÃ©lectionnez le nouveau statut dans la liste dÃ©roulante.'),
            step(5, 'Cliquez sur "Mettre Ã  jour". Le statut est enregistrÃ© immÃ©diatement.'),
            warning('Seuls les statuts autorisÃ©s sont disponibles. Il n\'est pas possible de revenir en arriÃ¨re sur un statut (ex : d\'AnnulÃ©e Ã  En attente).'),

            h2('2.3 Consulter la liste complÃ¨te'),
            p('Le lien "Toutes les commandes" dans le menu latÃ©ral affiche la liste paginÃ©e de toutes les commandes actives avec leur statut.'),

            // ====================
            // PARTIE 3 : ADMIN
            // ====================
            h1('3. Espace Administrateur'),
            p('L\'espace administrateur est accessible Ã  l\'adresse /admin aprÃ¨s connexion avec un compte de rÃ´le Administrateur.'),

            h2('3.1 Tableau de bord'),
            p('La page d\'accueil de l\'espace admin prÃ©sente :'),
            bullet('Le nombre total de menus, plats, commandes et utilisateurs'),
            bullet('Les 5 derniÃ¨res commandes passÃ©es'),

            h2('3.2 GÃ©rer les menus'),
            p('Le menu "Menus" de la sidebar donne accÃ¨s Ã  la liste de tous les menus.'),
            pBold('CrÃ©er un menu :'),
            step(1, 'Cliquez sur "+ Nouveau menu".'),
            step(2, 'Renseignez le titre, la description et le prix par personne.'),
            step(3, 'SÃ©lectionnez les plats associÃ©s (plusieurs sÃ©lectionnables).'),
            step(4, 'Cochez les rÃ©gimes alimentaires compatibles (vÃ©gÃ©tarien, vegan, sans gluten...).'),
            step(5, 'Laissez "Actif" cochÃ© pour rendre le menu visible cÃ´tÃ© client.'),
            step(6, 'Cliquez sur "Enregistrer".'),
            pBold('Modifier un menu :'),
            p('Cliquez sur le bouton "Modifier" sur la ligne du menu. MÃªme formulaire que la crÃ©ation.'),
            pBold('DÃ©sactiver un menu :'),
            p('DÃ©cochez la case "Actif" lors de la modification. Le menu disparaÃ®t du catalogue client sans Ãªtre supprimÃ©.'),
            pBold('Supprimer un menu :'),
            p('Cliquez sur "Supprimer" sur la ligne du menu. Une confirmation est demandÃ©e.'),
            warning('La suppression est dÃ©finitive. PrÃ©fÃ©rez la dÃ©sactivation pour conserver l\'historique.'),

            h2('3.3 GÃ©rer les plats'),
            p('Le menu "Plats" de la sidebar donne accÃ¨s Ã  la liste de tous les plats.'),
            bullet('Chaque plat possÃ¨de un nom, une description, un type (entrÃ©e/plat/dessert/boisson/autre) et une liste d\'allergÃ¨nes.'),
            bullet('Les plats sont associÃ©s aux menus. Un plat peut apparaÃ®tre dans plusieurs menus.'),
            bullet('MÃªme logique de crÃ©ation/modification/suppression que les menus.'),

            h2('3.4 GÃ©rer les commandes'),
            p('Le menu "Commandes" affiche toutes les commandes avec leur statut.'),
            step(1, 'Cliquez sur "Voir" pour accÃ©der au dÃ©tail complet d\'une commande.'),
            step(2, 'Utilisez le formulaire de changement de statut pour faire Ã©voluer une commande.'),
            note('L\'administrateur peut accÃ©der Ã  tous les statuts, y compris AnnulÃ©e. L\'employÃ© ne voit que les colonnes ConfirmÃ©e, En prÃ©paration et PrÃªte.'),

            h2('3.5 GÃ©rer les utilisateurs'),
            p('Le menu "Utilisateurs" affiche la liste de tous les comptes clients.'),
            pBold('Activer / dÃ©sactiver un compte :'),
            step(1, 'RepÃ©rez l\'utilisateur dans la liste.'),
            step(2, 'Cliquez sur "Activer" ou "DÃ©sactiver" selon l\'Ã©tat actuel du compte.'),
            step(3, 'La modification est immÃ©diate. Un compte dÃ©sactivÃ© ne peut plus se connecter.'),
            note('Les comptes employÃ©s et administrateurs ne sont pas listÃ©s ici â€” ils sont crÃ©Ã©s directement en base de donnÃ©es.'),

            h2('3.6 Statistiques'),
            p('Le menu "Statistiques" affiche le tableau de bord analytique alimentÃ© par MongoDB.'),
            bullet('Chiffre d\'affaires total'),
            bullet('Panier moyen'),
            bullet('Nombre de personnes servies'),
            bullet('Top 5 des menus les plus commandÃ©s'),
            bullet('Top 5 des villes de livraison'),
            bullet('Ã‰volution du nombre de commandes sur les 6 derniers mois'),
            note('Si l\'extension PHP mongodb n\'est pas disponible sur le serveur, un message d\'information s\'affiche Ã  la place des donnÃ©es. L\'application continue de fonctionner normalement.'),

            h1('4. FAQ'),

            h2('Je ne peux plus me connecter'),
            p('VÃ©rifiez que vous utilisez la bonne adresse e-mail. Si vous avez oubliÃ© votre mot de passe, contactez l\'administrateur pour rÃ©initialisation. Si votre compte a Ã©tÃ© dÃ©sactivÃ©, contactez l\'Ã©quipe Vite & Gourmand.'),

            h2('Le prix de ma commande est incorrect'),
            p('Le prix est calculÃ© automatiquement par l\'application selon la formule : (prix par personne du menu Ã— nombre de personnes) + 50 â‚¬ de forfait livraison. VÃ©rifiez le menu sÃ©lectionnÃ© et le nombre de personnes saisi.'),

            h2('Je ne vois pas le menu que je cherche'),
            p('Les menus peuvent Ãªtre temporairement dÃ©sactivÃ©s par l\'administrateur (saisonnalitÃ©, indisponibilitÃ©). Contactez l\'Ã©quipe pour plus d\'informations.'),

            h2('Comment connaÃ®tre les allergÃ¨nes d\'un menu ?'),
            p('Les allergÃ¨nes de chaque plat sont listÃ©s dans la page de dÃ©tail du menu. L\'application rÃ©pertorie les 14 allergÃ¨nes rÃ©glementaires. En cas de doute, contactez l\'Ã©quipe avant de passer commande.'),
        ],
    }],
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('../manuel_utilisateur.docx', buffer);
    console.log('manuel_utilisateur.docx gÃ©nÃ©rÃ©.');
});

