<?php

namespace App\Controller\Admin;

use App\Entity\Plat;
use App\Form\PlatType;
use App\Repository\PlatRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/admin/plats', name: 'admin_plat_')]
class PlatController extends AbstractController
{
    #[Route('', name: 'index')]
    public function index(PlatRepository $repo): Response
    {
        return $this->render('admin/plat/index.html.twig', [
            'plats' => $repo->findAll(),
        ]);
    }

    #[Route('/nouveau', name: 'new')]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $plat = new Plat();
        $form = $this->createForm(PlatType::class, $plat);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($plat);
            $em->flush();
            $this->addFlash('success', 'Plat créé avec succès.');
            return $this->redirectToRoute('admin_plat_index');
        }

        return $this->render('admin/plat/form.html.twig', [
            'form'  => $form,
            'titre' => 'Nouveau plat',
        ]);
    }

    #[Route('/{id}/modifier', name: 'edit')]
    public function edit(Plat $plat, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(PlatType::class, $plat);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Plat modifié avec succès.');
            return $this->redirectToRoute('admin_plat_index');
        }

        return $this->render('admin/plat/form.html.twig', [
            'form'  => $form,
            'titre' => 'Modifier : ' . $plat->getTitre(),
        ]);
    }

    #[Route('/{id}/modal', name: 'modal')]
    public function modal(Plat $plat, Request $request, EntityManagerInterface $em, SluggerInterface $slugger): Response
    {
        $form = $this->createForm(PlatType::class, $plat);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                $originalName = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeName = $slugger->slug($originalName);
                $newName  = $safeName . '-' . uniqid() . '.' . $imageFile->guessExtension();
                $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/plats';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                $imageFile->move($uploadDir, $newName);
                $plat->setImageChemin('uploads/plats/' . $newName);
            }
            $em->flush();
            $this->addFlash('success', 'Plat modifié avec succès.');
            return $this->redirectToRoute('employe_dashboard');
        }

        return $this->render('admin/plat/modal.html.twig', [
            'form' => $form,
            'plat' => $plat,
        ]);
    }

    #[Route('/{id}/supprimer', name: 'delete', methods: ['POST'])]
    public function delete(Plat $plat, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete_plat_' . $plat->getId(), $request->request->get('_token'))) {
            $em->remove($plat);
            $em->flush();
            $this->addFlash('success', 'Plat supprimé.');
        }

        return $this->redirectToRoute('employe_dashboard');
    }
}
