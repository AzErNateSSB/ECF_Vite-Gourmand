<?php

namespace App\Controller\Admin;

use App\Entity\Commande;
use App\Repository\CommandeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/commandes', name: 'admin_commande_')]
class CommandeController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(CommandeRepository $repo): Response
    {
        return $this->render('admin/commande/index.html.twig', [
            'commandes' => $repo->findBy([], ['dateCommande' => 'DESC']),
        ]);
    }

    #[Route('/{id}', name: 'show')]
    public function show(Commande $commande): Response
    {
        return $this->render('admin/commande/show.html.twig', [
            'commande' => $commande,
        ]);
    }

    #[Route('/{id}/statut', name: 'statut', methods: ['POST'])]
    public function updateStatut(Commande $commande, Request $request, EntityManagerInterface $em): Response
    {
        $statuts = ['en_attente', 'confirmee', 'en_preparation', 'prete', 'livree', 'annulee'];
        $nouveau = $request->request->get('statut');

        if (in_array($nouveau, $statuts, true)) {
            $commande->setStatut($nouveau);
            $em->flush();
            $this->addFlash('success', 'Statut mis à jour.');
        }

        return $this->redirectToRoute('admin_commande_show', ['id' => $commande->getId()]);
    }
}
