<?php

namespace App\Controller\Client;

use App\Entity\Avis;
use App\Entity\Commande;
use App\Form\CommandeType;
use App\Repository\AvisRepository;
use App\Repository\CommandeRepository;
use App\Repository\MenuRepository;
use App\Service\LivraisonService;
use App\Service\MailerService;
use App\Service\StatistiqueService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/compte', name: 'client_')]
class CompteController extends AbstractController
{
    #[Route('', name: 'dashboard')]
    public function dashboard(CommandeRepository $commandeRepo, AvisRepository $avisRepo): Response
    {
        $commandes = $commandeRepo->findBy(
            ['utilisateur' => $this->getUser()],
            ['dateCommande' => 'DESC']
        );

        $avis = $avisRepo->findAvisByUtilisateur($this->getUser());

        return $this->render('client/dashboard.html.twig', [
            'commandes' => $commandes,
            'avis'      => $avis,
        ]);
    }

    #[Route('/profil/modifier', name: 'profil_update', methods: ['POST'])]
    public function updateProfil(Request $request, EntityManagerInterface $em): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        if (!$this->isCsrfTokenValid('profil_update', $request->request->get('_token'))) {
            $this->addFlash('error', 'Token de sécurité invalide.');
            return $this->redirectToRoute('client_dashboard');
        }

        $user = $this->getUser();
        $user->setPrenom($request->request->get('prenom', $user->getPrenom()));
        $user->setNom($request->request->get('nom', $user->getNom()));
        $user->setEmail($request->request->get('email', $user->getEmail()));
        $user->setTelephone($request->request->get('telephone', $user->getTelephone()));
        $user->setAdresse($request->request->get('adresse', $user->getAdresse()));
        $user->setAdressePostale($request->request->get('adressePostale', $user->getAdressePostale()));
        $user->setVille($request->request->get('ville', $user->getVille()));

        $em->flush();

        $this->addFlash('success', 'Profil mis à jour.');
        return $this->redirectToRoute('client_dashboard');
    }

    #[Route('/profil/mot-de-passe', name: 'password_update', methods: ['POST'])]
    public function updatePassword(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): Response {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        if (!$this->isCsrfTokenValid('password_update', $request->request->get('_token'))) {
            $this->addFlash('error', 'Token de sécurité invalide.');
            return $this->redirectToRoute('client_dashboard');
        }

        $user = $this->getUser();
        $current = $request->request->get('currentPassword', '');
        $new     = $request->request->get('newPassword', '');
        $confirm = $request->request->get('confirmPassword', '');

        if (!$hasher->isPasswordValid($user, $current)) {
            $this->addFlash('error', 'Mot de passe actuel incorrect.');
            return $this->redirectToRoute('client_dashboard');
        }

        if ($new !== $confirm || strlen($new) < 8) {
            $this->addFlash('error', 'Les mots de passe ne correspondent pas ou sont trop courts (min. 8 caractères).');
            return $this->redirectToRoute('client_dashboard');
        }

        $user->setPassword($hasher->hashPassword($user, $new));
        $em->flush();

        $this->addFlash('success', 'Mot de passe modifié.');
        return $this->redirectToRoute('client_dashboard');
    }

    #[Route('/avis/nouveau', name: 'avis_new', methods: ['POST'])]
    public function newAvis(Request $request, EntityManagerInterface $em, CommandeRepository $commandeRepo): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        if (!$this->isCsrfTokenValid('avis_new', $request->request->get('_token'))) {
            $this->addFlash('error', 'Token de sécurité invalide.');
            return $this->redirectToRoute('client_dashboard');
        }

        $commandeId = $request->request->get('commandeId');
        $note       = (int) $request->request->get('note', 0);
        $commentaire = trim($request->request->get('description', ''));

        $commande = $commandeRepo->find($commandeId);

        if (!$commande || $commande->getUtilisateur() !== $this->getUser()) {
            $this->addFlash('error', 'Commande introuvable.');
            return $this->redirectToRoute('client_dashboard');
        }

        if ($note < 1 || $note > 5) {
            $this->addFlash('error', 'Veuillez sélectionner une note entre 1 et 5.');
            return $this->redirectToRoute('client_dashboard');
        }

        $avis = new Avis();
        $avis->setCommande($commande);
        $avis->setNote($note);
        $avis->setDescription($commentaire);
        $avis->setCreatedAt(new \DateTime());
        $avis->setStatut('en_attente');

        $em->persist($avis);
        $em->flush();

        $this->addFlash('success', 'Avis soumis, en attente de modération.');
        return $this->redirectToRoute('client_dashboard');
    }

    #[Route('/commande/nouvelle', name: 'commande_new')]
    public function newCommande(Request $request, EntityManagerInterface $em, StatistiqueService $stats, MailerService $mailer, LivraisonService $livraison, MenuRepository $menuRepo): Response
    {
        $commande = new Commande();

        $menuId = $request->query->getInt('menu');
        if ($menuId && $menu = $menuRepo->find($menuId)) {
            $commande->setMenu($menu);
            $commande->setNombrePersonne($menu->getNombrePersonneMinimum());
        }

        /** @var \App\Entity\Utilisateur $user */
        $user = $this->getUser();
        if ($user->getAdresse()) {
            $commande->setAdresseLivraison($user->getAdresse());
        }
        if ($user->getVille()) {
            $commande->setVilleLivraison($user->getVille());
        }

        $form = $this->createForm(CommandeType::class, $commande);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $menu        = $commande->getMenu();
            $nbPersonnes = $commande->getNombrePersonne();

            $prixMenu      = (float) $menu->getPrixParPersonne() * $nbPersonnes;
            $prixLivraison = $livraison->calculerPrix(
                $commande->getAdresseLivraison(),
                $commande->getVilleLivraison()
            );
            $prixReduction = 0.00;
            if ($nbPersonnes > $menu->getNombrePersonneMinimum() + 5) {
                $prixReduction = round($prixMenu * 0.10, 2);
            }
            $total = $prixMenu + $prixLivraison - $prixReduction;

            $commande->setUtilisateur($this->getUser());
            $commande->setDateCommande(new \DateTime());
            $commande->setStatut('en_attente');
            $commande->setPrixMenu((string) $prixMenu);
            $commande->setPrixLivraison((string) $prixLivraison);
            $commande->setPrixReduction((string) $prixReduction);
            $commande->setPrixTotal((string) $total);
            $commande->setNumeroCommande('CMD-' . strtoupper(uniqid()));

            $em->persist($commande);
            $em->flush();

            $stats->enregistrerCommande($commande, 'creation');

            try {
                $mailer->sendConfirmationCommande($commande);
            } catch (\Throwable) {}

            $msg = 'Commande ' . $commande->getNumeroCommande() . ' enregistrée.';
            if ($prixReduction > 0) {
                $msg .= ' Réduction 10 % appliquée (' . number_format($prixReduction, 2, ',', ' ') . ' €).';
            }
            $this->addFlash('success', $msg);
            return $this->redirectToRoute('client_dashboard');
        }

        return $this->render('client/commande/new.html.twig', [
            'form'   => $form,
            'menuId' => $menuId,
        ]);
    }

    #[Route('/commande/{id}', name: 'commande_show')]
    public function showCommande(Commande $commande): Response
    {
        if ($commande->getUtilisateur() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        return $this->render('client/commande/show.html.twig', ['commande' => $commande]);
    }

    #[Route('/commande/{id}/annuler', name: 'commande_annuler', methods: ['POST'])]
    public function annulerCommande(Commande $commande, Request $request, EntityManagerInterface $em): Response
    {
        if ($commande->getUtilisateur() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('annuler_commande_' . $commande->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Token de sécurité invalide.');
            return $this->redirectToRoute('client_dashboard');
        }

        if (!in_array($commande->getStatut(), ['en_attente'], true)) {
            $this->addFlash('error', 'Cette commande ne peut plus être annulée (statut : ' . $commande->getStatut() . ').');
            return $this->redirectToRoute('client_dashboard');
        }

        $motif = trim($request->request->get('motif', ''));
        $commande->setStatut('annulee');
        $commande->setMotifAnnulation($motif ?: null);
        $em->flush();

        $this->addFlash('success', 'Votre commande ' . $commande->getNumeroCommande() . ' a été annulée.');
        return $this->redirectToRoute('client_dashboard');
    }

    #[Route('/commande/{id}/modifier', name: 'commande_modifier')]
    public function modifierCommande(Commande $commande, Request $request, EntityManagerInterface $em, StatistiqueService $stats, LivraisonService $livraison): Response
    {
        if ($commande->getUtilisateur() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        if (!in_array($commande->getStatut(), ['en_attente'], true)) {
            $this->addFlash('error', 'Cette commande ne peut plus être modifiée.');
            return $this->redirectToRoute('client_dashboard');
        }

        $form = $this->createForm(CommandeType::class, $commande);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $menu        = $commande->getMenu();
            $nbPersonnes = $commande->getNombrePersonne();

            $prixMenu      = (float) $menu->getPrixParPersonne() * $nbPersonnes;
            $prixLivraison = $livraison->calculerPrix(
                $commande->getAdresseLivraison(),
                $commande->getVilleLivraison()
            );
            $prixReduction = 0.00;
            if ($nbPersonnes > $menu->getNombrePersonneMinimum() + 5) {
                $prixReduction = round($prixMenu * 0.10, 2);
            }
            $total = $prixMenu + $prixLivraison - $prixReduction;

            $commande->setPrixMenu((string) $prixMenu);
            $commande->setPrixLivraison((string) $prixLivraison);
            $commande->setPrixReduction((string) $prixReduction);
            $commande->setPrixTotal((string) $total);

            $em->flush();

            $this->addFlash('success', 'Votre commande ' . $commande->getNumeroCommande() . ' a été mise à jour.');
            return $this->redirectToRoute('client_dashboard');
        }

        return $this->render('client/commande/modifier.html.twig', [
            'form'     => $form,
            'commande' => $commande,
        ]);
    }
}
