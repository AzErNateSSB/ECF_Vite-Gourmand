<?php

namespace App\Form;

use App\Entity\Allergene;
use App\Entity\Plat;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PlatType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titre', TextType::class, ['label' => 'Titre'])
            ->add('typePlat', ChoiceType::class, [
                'label' => 'Type de plat',
                'choices' => [
                    'Entrée'  => 'entree',
                    'Plat'    => 'plat',
                    'Dessert' => 'dessert',
                    'Boisson' => 'boisson',
                    'Autre'   => 'autre',
                ],
            ])
            ->add('imageFile', FileType::class, [
                'label'    => 'Photo du plat',
                'mapped'   => false,
                'required' => false,
                'attr'     => ['accept' => 'image/*'],
            ])
            ->add('allergenes', EntityType::class, [
                'class' => Allergene::class,
                'choice_label' => 'libelle',
                'label' => 'Allergènes',
                'multiple' => true,
                'expanded' => true,
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Plat::class]);
    }
}
