<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Form\InscriptionType;
use App\Repository\RoleRepository;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class InscriptionController extends AbstractController
{
    #[Route('/inscription', name: 'app_inscription')]
    public function inscription(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher,
        RoleRepository $roleRepo,
        MailerService $mailer,
    ): Response {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        $utilisateur = new Utilisateur();
        $form = $this->createForm(InscriptionType::class, $utilisateur);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('plainPassword')->getData();
            $utilisateur->setPassword($hasher->hashPassword($utilisateur, $plainPassword));
            $utilisateur->setActif(true);
            $utilisateur->setRole($roleRepo->findOneBy(['libelle' => 'utilisateur']));

            $em->persist($utilisateur);
            $em->flush();

            try {
                $mailer->sendBienvenue($utilisateur);
            } catch (\Throwable) {}

            $this->addFlash('success', 'Compte créé ! Vous pouvez maintenant vous connecter.');
            return $this->redirectToRoute('app_login');
        }

        return $this->render('inscription/index.html.twig', ['form' => $form]);
    }
}
