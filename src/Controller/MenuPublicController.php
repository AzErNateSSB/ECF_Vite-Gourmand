<?php

namespace App\Controller;

use App\Repository\MenuRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MenuPublicController extends AbstractController
{
    #[Route('/menus', name: 'app_menus')]
    public function index(MenuRepository $menuRepository): Response
    {
        $menus = $menuRepository->findBy(['actif' => true]);

        return $this->render('menus/index.html.twig', [
            'menus' => $menus,
        ]);
    }

    #[Route('/menus/{id}', name: 'app_menu_show', requirements: ['id' => '\d+'])]
    public function show(int $id, MenuRepository $menuRepository): Response
    {
        $menu = $menuRepository->find($id);
        if (!$menu || !$menu->isActif()) {
            throw $this->createNotFoundException('Menu introuvable.');
        }

        return $this->render('menus/show.html.twig', [
            'menu' => $menu,
        ]);
    }
}
