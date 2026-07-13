<?php

namespace App\Controller\Admin;

use App\Repository\CommandeRepository;
use App\Repository\MenuRepository;
use App\Repository\PlatRepository;
use App\Repository\UtilisateurRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin', name: 'admin_')]
class DashboardController extends AbstractController
{
    #[Route('', name: 'dashboard')]
    public function index(
        MenuRepository $menuRepo,
        PlatRepository $platRepo,
        CommandeRepository $commandeRepo,
        UtilisateurRepository $utilisateurRepo,
    ): Response {
        return $this->render('admin/dashboard.html.twig', [
            'nb_menus'       => $menuRepo->count([]),
            'nb_plats'       => $platRepo->count([]),
            'nb_commandes'   => $commandeRepo->count([]),
            'nb_utilisateurs'=> $utilisateurRepo->count([]),
            'commandes_recentes' => $commandeRepo->findBy([], ['dateCommande' => 'DESC'], 5),
        ]);
    }
}
