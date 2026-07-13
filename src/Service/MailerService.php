<?php

namespace App\Service;

use App\Entity\Commande;
use App\Entity\Utilisateur;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class MailerService
{
    public function __construct(
        private MailerInterface $mailer,
        private string $fromAddress,
        private string $fromName,
    ) {}

    private function createEmail(string $to, string $subject): TemplatedEmail
    {
        return (new TemplatedEmail())
            ->from(new Address($this->fromAddress, $this->fromName))
            ->to($to)
            ->subject($subject);
    }

    public function sendBienvenue(Utilisateur $user): void
    {
        $email = $this->createEmail($user->getEmail(), 'Bienvenue chez Vite & Gourmand !')
            ->htmlTemplate('emails/bienvenue.html.twig')
            ->context(['user' => $user]);

        $this->mailer->send($email);
    }

    public function sendConfirmationCommande(Commande $commande): void
    {
        $user = $commande->getUtilisateur();
        $email = $this->createEmail($user->getEmail(), 'Confirmation de votre commande ' . $commande->getNumeroCommande())
            ->htmlTemplate('emails/confirmation_commande.html.twig')
            ->context(['commande' => $commande, 'user' => $user]);

        $this->mailer->send($email);
    }

    public function sendCommandeTerminee(Commande $commande): void
    {
        $user = $commande->getUtilisateur();
        $email = $this->createEmail($user->getEmail(), 'Votre prestation est terminée — donnez votre avis !')
            ->htmlTemplate('emails/commande_terminee.html.twig')
            ->context(['commande' => $commande, 'user' => $user]);

        $this->mailer->send($email);
    }

    public function sendAlerteMateriel(Commande $commande): void
    {
        $user = $commande->getUtilisateur();
        $email = $this->createEmail($user->getEmail(), 'Retour du matériel — action requise')
            ->htmlTemplate('emails/alerte_materiel.html.twig')
            ->context(['commande' => $commande, 'user' => $user]);

        $this->mailer->send($email);
    }

    public function sendAnnulationEmploye(Commande $commande, string $motif, string $modeContact): void
    {
        $user = $commande->getUtilisateur();
        $email = $this->createEmail($user->getEmail(), 'Votre commande ' . $commande->getNumeroCommande() . ' a été annulée')
            ->htmlTemplate('emails/annulation_employe.html.twig')
            ->context([
                'commande'    => $commande,
                'user'        => $user,
                'motif'       => $motif,
                'modeContact' => $modeContact,
            ]);

        $this->mailer->send($email);
    }

    public function sendNouveauCompteEmploye(Utilisateur $employe, string $plainPassword): void
    {
        $email = $this->createEmail($employe->getEmail(), 'Votre compte employé Vite & Gourmand')
            ->htmlTemplate('emails/nouveau_employe.html.twig')
            ->context(['employe' => $employe, 'password' => $plainPassword]);

        $this->mailer->send($email);
    }
}
