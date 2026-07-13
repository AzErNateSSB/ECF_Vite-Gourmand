<?php

namespace App\Service;

use App\Entity\Commande;

/**
 * Service de statistiques MongoDB.
 * Utilise l'extension PHP mongodb directement (sans ODM).
 * En cas d'indisponibilité de l'extension ou du serveur,
 * toutes les méthodes dégradent gracieusement sans faire planter l'app.
 */
class StatistiqueService
{
    private mixed $collection = null;
    private bool $disponible = false;

    public function __construct(
        private string $mongoUri,
        private string $mongoDb,
    ) {
        $this->init();
    }

    private function init(): void
    {
        // L'extension mongodb 2.x n'est pas encore compatible PHP 8.5 sur Windows.
        // Ce bloc permet à l'application de fonctionner même sans MongoDB.
        if (!extension_loaded('mongodb')) {
            return;
        }

        try {
            $client = new \MongoDB\Driver\Manager($this->mongoUri);
            // Ping pour vérifier la connexion
            $command = new \MongoDB\Driver\Command(['ping' => 1]);
            $client->executeCommand('admin', $command);

            $this->collection = $client;
            $this->disponible = true;
        } catch (\Exception $e) {
            // MongoDB indisponible — mode dégradé silencieux
        }
    }

    public function estDisponible(): bool
    {
        return $this->disponible;
    }

    public function enregistrerCommande(Commande $commande, string $evenement = 'creation'): void
    {
        if (!$this->disponible) {
            return;
        }

        try {
            $bulk = new \MongoDB\Driver\BulkWrite();
            $bulk->insert([
                'evenement'       => $evenement,
                'commande_id'     => $commande->getId(),
                'numero_commande' => $commande->getNumeroCommande(),
                'menu_titre'      => $commande->getMenu()?->getTitre() ?? 'Inconnu',
                'nombre_personnes'=> $commande->getNombrePersonne(),
                'prix_total'      => (float) $commande->getPrixTotal(),
                'statut'          => $commande->getStatut(),
                'ville'           => $commande->getVilleLivraison() ?? '',
                'date_evenement'  => new \MongoDB\Driver\BSON\UTCDateTime(),
            ]);

            $this->collection->executeBulkWrite(
                $this->mongoDb . '.statistiques_commandes',
                $bulk
            );
        } catch (\Exception $e) {
            // Échec silencieux — ne pas bloquer la commande
        }
    }

    public function getStatsGlobales(): array
    {
        $vide = [
            'disponible'       => false,
            'total_commandes'  => 0,
            'chiffre_affaires' => 0,
            'moyenne_panier'   => 0,
            'total_personnes'  => 0,
            'top_menus'        => [],
            'top_villes'       => [],
            'par_mois'         => [],
        ];

        if (!$this->disponible) {
            return $vide;
        }

        try {
            $ns = $this->mongoDb . '.statistiques_commandes';

            // Total commandes
            $cmd = new \MongoDB\Driver\Command([
                'count' => 'statistiques_commandes',
                'query' => ['evenement' => 'creation'],
            ]);
            $res = $this->collection->executeCommand($this->mongoDb, $cmd);
            $total = $res->toArray()[0]->n ?? 0;

            // Agrégations financières
            $pipeline = [
                ['$match' => ['evenement' => 'creation']],
                ['$group' => [
                    '_id'             => null,
                    'chiffreAffaires' => ['$sum' => '$prix_total'],
                    'moyennePanier'   => ['$avg' => '$prix_total'],
                    'totalPersonnes'  => ['$sum' => '$nombre_personnes'],
                ]],
            ];
            $cmd = new \MongoDB\Driver\Command(['aggregate' => 'statistiques_commandes', 'pipeline' => $pipeline, 'cursor' => new \stdClass()]);
            $financier = $this->collection->executeCommand($this->mongoDb, $cmd)->toArray()[0] ?? null;

            // Top menus
            $pipelineMenus = [
                ['$match' => ['evenement' => 'creation']],
                ['$group' => ['_id' => '$menu_titre', 'count' => ['$sum' => 1]]],
                ['$sort' => ['count' => -1]],
                ['$limit' => 5],
            ];
            $cmd = new \MongoDB\Driver\Command(['aggregate' => 'statistiques_commandes', 'pipeline' => $pipelineMenus, 'cursor' => new \stdClass()]);
            $topMenus = $this->collection->executeCommand($this->mongoDb, $cmd)->toArray();

            // Top villes
            $pipelineVilles = [
                ['$match' => ['evenement' => 'creation', 'ville' => ['$ne' => '']]],
                ['$group' => ['_id' => '$ville', 'count' => ['$sum' => 1]]],
                ['$sort' => ['count' => -1]],
                ['$limit' => 5],
            ];
            $cmd = new \MongoDB\Driver\Command(['aggregate' => 'statistiques_commandes', 'pipeline' => $pipelineVilles, 'cursor' => new \stdClass()]);
            $topVilles = $this->collection->executeCommand($this->mongoDb, $cmd)->toArray();

            // Par mois
            $pipelineMois = [
                ['$match' => ['evenement' => 'creation']],
                ['$group' => [
                    '_id'    => ['$dateToString' => ['format' => '%Y-%m', 'date' => '$date_evenement']],
                    'count'  => ['$sum' => 1],
                    'revenu' => ['$sum' => '$prix_total'],
                ]],
                ['$sort' => ['_id' => -1]],
                ['$limit' => 6],
            ];
            $cmd = new \MongoDB\Driver\Command(['aggregate' => 'statistiques_commandes', 'pipeline' => $pipelineMois, 'cursor' => new \stdClass()]);
            $parMois = array_reverse($this->collection->executeCommand($this->mongoDb, $cmd)->toArray());

            return [
                'disponible'       => true,
                'total_commandes'  => $total,
                'chiffre_affaires' => $financier->chiffreAffaires ?? 0,
                'moyenne_panier'   => round($financier->moyennePanier ?? 0, 2),
                'total_personnes'  => $financier->totalPersonnes ?? 0,
                'top_menus'        => $topMenus,
                'top_villes'       => $topVilles,
                'par_mois'         => $parMois,
            ];
        } catch (\Exception $e) {
            return $vide;
        }
    }
}
