<?php

namespace App\Controller\Employe;

use App\Entity\Avis;
use App\Entity\Commande;
use App\Repository\AvisRepository;
use App\Repository\CommandeRepository;
use App\Repository\MenuRepository;
use App\Repository\PlatRepository;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/employe', name: 'employe_')]
class CommandeController extends AbstractController
{
    #[Route('', name: 'dashboard')]
    public function dashboard(
        CommandeRepository $commandeRepo,
        PlatRepository $platRepo,
        MenuRepository $menuRepo,
        AvisRepository $avisRepo,
    ): Response {
        return $this->render('employe/dashboard.html.twig', [
            'commandes' => $commandeRepo->findBy([], ['dateCommande' => 'DESC']),
            'plats'     => $platRepo->findBy([], ['titre' => 'ASC']),
            'menus'     => $menuRepo->findBy([], ['titre' => 'ASC']),
            'avis'      => $avisRepo->findBy([], ['createdAt' => 'DESC']),
        ]);
    }

    #[Route('/commandes', name: 'commande_index')]
    public function index(CommandeRepository $repo): Response
    {
        return $this->redirectToRoute('employe_dashboard');
    }

    #[Route('/commandes/{id}', name: 'commande_show')]
    public function show(Commande $commande): Response
    {
        return $this->render('employe/commande/show.html.twig', [
            'commande' => $commande,
        ]);
    }

    #[Route('/commandes/{id}/statut', name: 'commande_statut', methods: ['POST'])]
    public function updateStatut(Commande $commande, Request $request, EntityManagerInterface $em, MailerService $mailer): Response
    {
        $statuts = [
            'en_attente', 'confirmee', 'en_preparation', 'prete',
            'en_cours_de_livraison', 'livree',
            'en_attente_retour_materiel', 'terminee',
        ];
        $nouveau = $request->request->get('statut');

        if (in_array($nouveau, $statuts, true)) {
            $ancien = $commande->getStatut();
            $commande->setStatut($nouveau);
            $em->flush();

            if ($nouveau === 'terminee' && $ancien !== 'terminee') {
                try { $mailer->sendCommandeTerminee($commande); } catch (\Throwable) {}
            }

            if ($nouveau === 'en_attente_retour_materiel' && $ancien !== 'en_attente_retour_materiel') {
                try { $mailer->sendAlerteMateriel($commande); } catch (\Throwable) {}
            }

            $this->addFlash('success', 'Statut mis à jour.');
        }

        return $this->redirectToRoute('employe_dashboard');
    }

    #[Route('/commandes/{id}/annuler', name: 'commande_annuler', methods: ['POST'])]
    public function annulerCommande(Commande $commande, Request $request, EntityManagerInterface $em, MailerService $mailer): Response
    {
        if (!$this->isCsrfTokenValid('employe_annuler_' . $commande->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Token de sécurité invalide.');
            return $this->redirectToRoute('employe_dashboard');
        }

        $motif       = trim($request->request->get('motif', ''));
        $modeContact = $request->request->get('modeContact', 'email');

        $commande->setStatut('annulee');
        $commande->setMotifAnnulation($motif ?: null);
        $commande->setModeContact($modeContact);
        $em->flush();

        try { $mailer->sendAnnulationEmploye($commande, $motif, $modeContact); } catch (\Throwable) {}

        $this->addFlash('success', 'Commande ' . $commande->getNumeroCommande() . ' annulée. Le client a été notifié.');
        return $this->redirectToRoute('employe_dashboard');
    }

    #[Route('/avis/{id}/valider', name: 'avis_valider', methods: ['POST'])]
    public function validerAvis(Avis $avis, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('avis_action_' . $avis->getId(), $request->request->get('_token'))) {
            $avis->setStatut('publie');
            $em->flush();
            $this->addFlash('success', 'Avis publié.');
        }

        return $this->redirectToRoute('employe_dashboard');
    }

    #[Route('/avis/{id}/refuser', name: 'avis_refuser', methods: ['POST'])]
    public function refuserAvis(Avis $avis, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('avis_action_' . $avis->getId(), $request->request->get('_token'))) {
            $avis->setStatut('refuse');
            $em->flush();
            $this->addFlash('success', 'Avis refusé.');
        }

        return $this->redirectToRoute('employe_dashboard');
    }
}
