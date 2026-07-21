<?php

namespace App\DataFixtures;

use App\Entity\Allergene;
use App\Entity\Commande;
use App\Entity\Horaire;
use App\Entity\Menu;
use App\Entity\MenuImage;
use App\Entity\Plat;
use App\Entity\Regime;
use App\Entity\Role;
use App\Entity\Theme;
use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $hasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        $roleAdmin = new Role();
        $roleAdmin->setLibelle('administrateur');
        $manager->persist($roleAdmin);

        $roleEmploye = new Role();
        $roleEmploye->setLibelle('employe');
        $manager->persist($roleEmploye);

        $roleUser = new Role();
        $roleUser->setLibelle('utilisateur');
        $manager->persist($roleUser);

        $themes = [];
        foreach (['Noël', 'Pâques', 'Classique', 'Événement'] as $libelle) {
            $theme = new Theme();
            $theme->setLibelle($libelle);
            $manager->persist($theme);
            $themes[$libelle] = $theme;
        }

        $regimes = [];
        foreach (['Classique', 'Végétarien', 'Vegan', 'Sans gluten', 'Sans lactose', 'Halal'] as $libelle) {
            $regime = new Regime();
            $regime->setLibelle($libelle);
            $manager->persist($regime);
            $regimes[$libelle] = $regime;
        }

        $allergenes = [];
        foreach ([
            'Gluten', 'Crustacés', 'Œufs', 'Poissons', 'Arachides',
            'Soja', 'Lait', 'Fruits à coque', 'Céleri', 'Moutarde',
            'Graines de sésame', 'Anhydride sulfureux et sulfites', 'Lupin', 'Mollusques'
        ] as $libelle) {
            $allergene = new Allergene();
            $allergene->setLibelle($libelle);
            $manager->persist($allergene);
            $allergenes[$libelle] = $allergene;
        }

        foreach ([
            1 => ['09:00', '18:00', false],
            2 => ['09:00', '18:00', false],
            3 => ['09:00', '18:00', false],
            4 => ['09:00', '18:00', false],
            5 => ['09:00', '19:00', false],
            6 => ['10:00', '17:00', false],
            7 => ['00:00', '00:00', true],
        ] as $jour => [$ouverture, $fermeture, $ferme]) {
            $horaire = new Horaire();
            $horaire->setJour($jour);
            $horaire->setHeureOuverture($ouverture);
            $horaire->setHeureFermeture($fermeture);
            $horaire->setFerme($ferme);
            $manager->persist($horaire);
        }

        $admin = new Utilisateur();
        $admin->setEmail('jose@vitegourmand.fr');
        $admin->setPassword($this->hasher->hashPassword($admin, 'Admin@2024!'));
        $admin->setNom('Dupont');
        $admin->setPrenom('José');
        $admin->setTelephone('0612345678');
        $admin->setAdresse('1 rue de la Paix');
        $admin->setAdressePostale('33000');
        $admin->setVille('Bordeaux');
        $admin->setActif(true);
        $admin->setRole($roleAdmin);
        $manager->persist($admin);

        $employe = new Utilisateur();
        $employe->setEmail('julie@vitegourmand.fr');
        $employe->setPassword($this->hasher->hashPassword($employe, 'Employe@2024!'));
        $employe->setNom('Martin');
        $employe->setPrenom('Julie');
        $employe->setTelephone('0698765432');
        $employe->setAdresse('5 allée des Roses');
        $employe->setAdressePostale('33000');
        $employe->setVille('Bordeaux');
        $employe->setActif(true);
        $employe->setRole($roleEmploye);
        $manager->persist($employe);

        $user = new Utilisateur();
        $user->setEmail('client@test.fr');
        $user->setPassword($this->hasher->hashPassword($user, 'Client@2024!'));
        $user->setNom('Testeur');
        $user->setPrenom('Alice');
        $user->setTelephone('0611223344');
        $user->setAdresse('10 avenue des Tests');
        $user->setAdressePostale('33100');
        $user->setVille('Bordeaux');
        $user->setActif(true);
        $user->setRole($roleUser);
        $manager->persist($user);

        $plats = [];
        foreach ([
            ['Foie gras maison sur toast brioché',     'entree',  ['Gluten', 'Œufs', 'Lait']],
            ['Velouté de butternut et châtaignes',     'entree',  ['Lait']],
            ['Carpaccio de saint-jacques',              'entree',  ['Poissons']],
            ['Chapon rôti aux marrons',                 'plat',    ['Fruits à coque']],
            ['Filet de bœuf Wellington',                'plat',    ['Gluten', 'Œufs']],
            ['Pavé de saumon en croûte d\'herbes',     'plat',    ['Poissons']],
            ['Bûche de Noël chocolat-praliné',          'dessert', ['Gluten', 'Lait', 'Fruits à coque']],
            ['Tarte aux fraises et crème pâtissière',  'dessert', ['Gluten', 'Œufs', 'Lait']],
            ['Mille-feuille vanille maison',            'dessert', ['Gluten', 'Œufs', 'Lait']],
        ] as [$titre, $type, $allergenesPlat]) {
            $plat = new Plat();
            $plat->setTitre($titre);
            $plat->setTypePlat($type);
            foreach ($allergenesPlat as $libelle) {
                $plat->addAllergene($allergenes[$libelle]);
            }
            $manager->persist($plat);
            $plats[] = $plat;
        }

        $menu1 = new Menu();
        $menu1->setTitre('Menu Festif de Noël');
        $menu1->setDescription('Un repas chaleureux pour célébrer les fêtes en famille avec des produits de saison.');
        $menu1->setNombrePersonneMinimum(6);
        $menu1->setPrixParPersonne('45.00');
        $menu1->setConditions('À commander au minimum 7 jours avant la prestation. Conservation au réfrigérateur entre 0°C et 4°C.');
        $menu1->setQuantiteRestante(10);
        $menu1->setActif(true);
        $menu1->setTheme($themes['Noël']);
        $menu1->addRegime($regimes['Classique']);
        $menu1->addPlat($plats[0]);
        $menu1->addPlat($plats[1]);
        $menu1->addPlat($plats[3]);
        $menu1->addPlat($plats[6]);
        $manager->persist($menu1);

        $image1 = new MenuImage();
        $image1->setChemin('uploads/menus/noel.jpg');
        $image1->setOrdre(1);
        $image1->setMenu($menu1);
        $manager->persist($image1);

        $menu2 = new Menu();
        $menu2->setTitre('Menu Pâques Gourmand');
        $menu2->setDescription('Découvrez notre sélection printanière avec des saveurs légères et fraîches.');
        $menu2->setNombrePersonneMinimum(4);
        $menu2->setPrixParPersonne('35.00');
        $menu2->setConditions('À commander au minimum 5 jours avant la prestation.');
        $menu2->setQuantiteRestante(8);
        $menu2->setActif(true);
        $menu2->setTheme($themes['Pâques']);
        $menu2->addRegime($regimes['Classique']);
        $menu2->addRegime($regimes['Végétarien']);
        $menu2->addPlat($plats[2]);
        $menu2->addPlat($plats[5]);
        $menu2->addPlat($plats[7]);
        $manager->persist($menu2);

        $image2 = new MenuImage();
        $image2->setChemin('uploads/menus/paques.jpg');
        $image2->setOrdre(1);
        $image2->setMenu($menu2);
        $manager->persist($image2);

        $menu3 = new Menu();
        $menu3->setTitre('Menu Classique');
        $menu3->setDescription('Notre incontournable pour tous vos événements, des entrées raffinées aux desserts maison.');
        $menu3->setNombrePersonneMinimum(2);
        $menu3->setPrixParPersonne('28.00');
        $menu3->setConditions('À commander au minimum 48h avant la prestation.');
        $menu3->setQuantiteRestante(15);
        $menu3->setActif(true);
        $menu3->setTheme($themes['Classique']);
        $menu3->addRegime($regimes['Classique']);
        $menu3->addPlat($plats[1]);
        $menu3->addPlat($plats[4]);
        $menu3->addPlat($plats[8]);
        $manager->persist($menu3);

        $image3 = new MenuImage();
        $image3->setChemin('uploads/menus/classique.jpg');
        $image3->setOrdre(1);
        $image3->setMenu($menu3);
        $manager->persist($image3);

        $commandeData = [
            ['CMD-001', $menu1, 20, '2026-07-26', '503.15', 'en_attente'],
            ['CMD-002', $menu2, 25, '2026-07-30', '563.00', 'confirmee'],
            ['CMD-003', $menu3, 10, '2026-07-20', '157.10', 'en_preparation'],
            ['CMD-004', $menu1, 15, '2026-07-22', '401.00', 'prete'],
            ['CMD-005', $menu2, 30, '2026-08-20', '1003.00', 'livree'],
        ];

        foreach ($commandeData as [$num, $menu, $pers, $dateStr, $total, $statut]) {
            $cmd = new Commande();
            $cmd->setNumeroCommande($num);
            $cmd->setDateCommande(new \DateTime());
            $cmd->setDatePrestation(new \DateTime($dateStr));
            $cmd->setHeureLivraison('12:00');
            $cmd->setAdresseLivraison('10 avenue des Tests');
            $cmd->setVilleLivraison('Bordeaux');
            $cmd->setNombrePersonne($pers);
            $cmd->setPrixMenu($total);
            $cmd->setPrixLivraison('0.00');
            $cmd->setPrixReduction('0.00');
            $cmd->setPrixTotal($total);
            $cmd->setStatut($statut);
            $cmd->setPretMateriel(false);
            $cmd->setUtilisateur($user);
            $cmd->setMenu($menu);
            $manager->persist($cmd);
        }

        $manager->flush();
    }
}
