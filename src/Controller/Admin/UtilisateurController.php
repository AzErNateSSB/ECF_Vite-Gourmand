<?php

namespace App\Controller\Admin;

use App\Entity\Utilisateur;
use App\Repository\RoleRepository;
use App\Repository\UtilisateurRepository;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\ByteString;

#[Route('/admin/utilisateurs', name: 'admin_utilisateur_')]
class UtilisateurController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(UtilisateurRepository $repo): Response
    {
        return $this->render('admin/utilisateur/index.html.twig', [
            'utilisateurs' => $repo->findBy([], ['nom' => 'ASC']),
        ]);
    }

    #[Route('/creer-employe', name: 'creer_employe', methods: ['POST'])]
    public function creerEmploye(
        Request $request,
        EntityManagerInterface $em,
        RoleRepository $roleRepo,
        UserPasswordHasherInterface $hasher,
        MailerService $mailer,
    ): Response {
        if (!$this->isCsrfTokenValid('creer_employe', $request->request->get('_token'))) {
            $this->addFlash('error', 'Token de sécurité invalide.');
            return $this->redirectToRoute('admin_utilisateur_index');
        }

        $plainPassword = ByteString::fromRandom(12)->toString();

        $employe = new Utilisateur();
        $employe->setPrenom(trim($request->request->get('prenom', '')));
        $employe->setNom(trim($request->request->get('nom', '')));
        $employe->setEmail(trim($request->request->get('email', '')));
        $employe->setTelephone(trim($request->request->get('telephone', '')));
        $employe->setAdresse('');
        $employe->setAdressePostale('');
        $employe->setVille('');
        $employe->setActif(true);
        $employe->setPassword($hasher->hashPassword($employe, $plainPassword));
        $employe->setRole($roleRepo->findOneBy(['libelle' => 'employe']));

        $em->persist($employe);
        $em->flush();

        try {
            $mailer->sendNouveauCompteEmploye($employe, $plainPassword);
        } catch (\Throwable) {}

        $this->addFlash('success', "Compte employé créé pour {$employe->getPrenom()} {$employe->getNom()}. Un email avec les identifiants a été envoyé.");
        return $this->redirectToRoute('admin_utilisateur_index');
    }

    #[Route('/{id}/toggle', name: 'toggle', methods: ['POST'])]
    public function toggle(Utilisateur $utilisateur, EntityManagerInterface $em): Response
    {
        $utilisateur->setActif(!$utilisateur->isActif());
        $em->flush();

        $etat = $utilisateur->isActif() ? 'activé' : 'désactivé';
        $this->addFlash('success', "Compte de {$utilisateur->getPrenom()} {$etat}.");

        return $this->redirectToRoute('admin_utilisateur_index');
    }
}
