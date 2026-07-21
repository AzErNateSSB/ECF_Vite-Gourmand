<?php

namespace App\Repository;

use App\Entity\Allergene;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Allergene>
 */
class AllergeneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Allergene::class);
    }

//    /**
//     * @return Allergene[] Returns an array of Allergene objects
//     */
//    public function findOneBySomeField($value): ?Allergene
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
