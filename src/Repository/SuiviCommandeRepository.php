<?php

namespace App\Repository;

use App\Entity\SuiviCommande;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SuiviCommande>
 */
class SuiviCommandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SuiviCommande::class);
    }

//    /**
//     * @return SuiviCommande[] Returns an array of SuiviCommande objects
//     */
//    public function findOneBySomeField($value): ?SuiviCommande
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
