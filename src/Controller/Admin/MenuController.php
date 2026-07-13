<?php

namespace App\Controller\Admin;

use App\Entity\Menu;
use App\Form\MenuType;
use App\Repository\MenuRepository;
use App\Repository\PlatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/menus', name: 'admin_menu_')]
class MenuController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(MenuRepository $repo): Response
    {
        return $this->render('admin/menu/index.html.twig', [
            'menus' => $repo->findAll(),
        ]);
    }

    #[Route('/nouveau', name: 'new')]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $menu = new Menu();
        $form = $this->createForm(MenuType::class, $menu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($menu);
            $em->flush();
            $this->addFlash('success', 'Menu créé avec succès.');
            return $this->redirectToRoute('admin_menu_index');
        }

        return $this->render('admin/menu/form.html.twig', [
            'form'  => $form,
            'titre' => 'Nouveau menu',
        ]);
    }

    #[Route('/{id}/modifier', name: 'edit')]
    public function edit(Menu $menu, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(MenuType::class, $menu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Menu modifié avec succès.');
            return $this->redirectToRoute('admin_menu_index');
        }

        return $this->render('admin/menu/form.html.twig', [
            'form'  => $form,
            'titre' => 'Modifier : ' . $menu->getTitre(),
        ]);
    }

    #[Route('/{id}/modal', name: 'modal')]
    public function modal(Menu $menu, Request $request, EntityManagerInterface $em, PlatRepository $platRepo): Response
    {
        $form = $this->createForm(MenuType::class, $menu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Menu modifié avec succès.');
            return $this->redirectToRoute('employe_dashboard');
        }

        $allPlats = $platRepo->findBy([], ['titre' => 'ASC']);
        $platsByType = ['entree' => [], 'plat' => [], 'dessert' => []];
        foreach ($allPlats as $p) {
            $t = $p->getTypePlat();
            if (isset($platsByType[$t])) $platsByType[$t][] = $p;
        }

        return $this->render('admin/menu/modal.html.twig', [
            'form'       => $form,
            'menu'       => $menu,
            'platsByType' => $platsByType,
        ]);
    }

    #[Route('/{id}/supprimer', name: 'delete', methods: ['POST'])]
    public function delete(Menu $menu, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete_menu_' . $menu->getId(), $request->request->get('_token'))) {
            $em->remove($menu);
            $em->flush();
            $this->addFlash('success', 'Menu supprimé.');
        }

        return $this->redirectToRoute('employe_dashboard');
    }
}
