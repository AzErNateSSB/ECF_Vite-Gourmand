<?php

namespace App\Form;

use App\Entity\Menu;
use App\Entity\Plat;
use App\Entity\Regime;
use App\Entity\Theme;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MenuType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titre', TextType::class, ['label' => 'Titre'])
            ->add('description', TextareaType::class, ['label' => 'Description', 'attr' => ['rows' => 4]])
            ->add('prixParPersonne', MoneyType::class, ['label' => 'Prix par personne', 'currency' => 'EUR'])
            ->add('nombrePersonneMinimum', IntegerType::class, ['label' => 'Nombre de personnes minimum'])
            ->add('quantiteRestante', IntegerType::class, ['label' => 'Quantité restante'])
            ->add('conditions', TextareaType::class, ['label' => 'Conditions', 'required' => false, 'attr' => ['rows' => 3]])
            ->add('actif', CheckboxType::class, ['label' => 'Actif', 'required' => false])
            ->add('theme', EntityType::class, [
                'class' => Theme::class,
                'choice_label' => 'libelle',
                'label' => 'Thème',
                'required' => false,
                'placeholder' => '— Aucun thème —',
            ])
            ->add('plats', EntityType::class, [
                'class' => Plat::class,
                'choice_label' => 'titre',
                'label' => 'Plats',
                'multiple' => true,
                'expanded' => true,
                'required' => false,
            ])
            ->add('regimes', EntityType::class, [
                'class' => Regime::class,
                'choice_label' => 'libelle',
                'label' => 'Régimes alimentaires',
                'multiple' => true,
                'expanded' => true,
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Menu::class]);
    }
}
