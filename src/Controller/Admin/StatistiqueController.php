<?php

namespace App\Controller\Admin;

use App\Service\StatistiqueService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/statistiques', name: 'admin_statistique_')]
class StatistiqueController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(StatistiqueService $stats): Response
    {
        return $this->render('admin/statistique/index.html.twig', [
            'stats' => $stats->getStatsGlobales(),
        ]);
    }
}
