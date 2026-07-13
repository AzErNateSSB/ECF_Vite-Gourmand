<?php

namespace App\Form;

use App\Entity\Commande;
use App\Entity\Menu;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\NotBlank;

class CommandeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('menu', EntityType::class, [
                'class'        => Menu::class,
                'choice_label' => fn(Menu $m) => $m->getTitre() . ' — ' . number_format((float)$m->getPrixParPersonne(), 2, ',', ' ') . ' €/pers.',
                'label'        => 'Menu choisi',
                'query_builder' => fn($repo) => $repo->createQueryBuilder('m')->where('m.actif = true')->orderBy('m.titre'),
            ])
            ->add('nombrePersonne', IntegerType::class, [
                'label'       => 'Nombre de personnes',
                'constraints' => [new NotBlank(), new GreaterThanOrEqual(['value' => 1])],
            ])
            ->add('datePrestation', DateType::class, [
                'label'  => 'Date de l\'événement',
                'widget' => 'single_text',
            ])
            ->add('heureLivraison', TextType::class, [
                'label' => 'Heure de livraison (ex: 12:00)',
            ])
            ->add('adresseLivraison', TextType::class, ['label' => 'Adresse de livraison'])
            ->add('villeLivraison', TextType::class, ['label' => 'Ville de livraison'])
            ->add('pretMateriel', CheckboxType::class, [
                'label'    => 'Je souhaite la mise à disposition du matériel (couverts, tables…)',
                'required' => false,
            ])
            ->add('modeContact', ChoiceType::class, [
                'label'   => 'Mode de contact préféré',
                'choices' => ['Email' => 'email', 'Téléphone' => 'telephone'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Commande::class]);
    }
}
