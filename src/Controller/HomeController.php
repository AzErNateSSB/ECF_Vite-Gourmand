<?php

namespace App\Controller;

use App\Repository\AvisRepository;
use App\Repository\MenuRepository;
use App\Service\LivraisonService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(AvisRepository $avisRepo): Response
    {
        $avisPublies = $avisRepo->findBy(['statut' => 'publie'], ['createdAt' => 'DESC'], 10);

        return $this->render('home/index.html.twig', [
            'avisPublies' => $avisPublies,
        ]);
    }

    #[Route('/api/livraison-prix', name: 'api_livraison_prix', methods: ['GET'])]
    public function livraisonPrix(Request $request, LivraisonService $livraison, MenuRepository $menuRepo): JsonResponse
    {
        $adresse     = $request->query->get('adresse', '');
        $ville       = $request->query->get('ville', '');
        $menuId      = (int) $request->query->get('menuId', 0);
        $nbPersonnes = (int) $request->query->get('nbPersonnes', 0);

        if (!$ville) {
            return new JsonResponse(['prixLivraison' => null]);
        }

        $prixLivraison = $livraison->calculerPrix($adresse, $ville);
        $prixReduction = 0.0;
        $prixMenu      = null;

        if ($menuId && $nbPersonnes > 0) {
            $menu = $menuRepo->find($menuId);
            if ($menu) {
                $prixMenu = (float) $menu->getPrixParPersonne() * $nbPersonnes;
                if ($nbPersonnes > $menu->getNombrePersonneMinimum() + 5) {
                    $prixReduction = round($prixMenu * 0.10, 2);
                }
            }
        }

        return new JsonResponse([
            'prixLivraison' => $prixLivraison,
            'prixReduction' => $prixReduction,
            'prixMenu'      => $prixMenu,
            'total'         => $prixMenu !== null ? round($prixMenu + $prixLivraison - $prixReduction, 2) : null,
        ]);
    }
}
