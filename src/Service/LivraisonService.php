<?php

namespace App\Service;

class LivraisonService
{
    private const BORDEAUX_LAT  = 44.8378;
    private const BORDEAUX_LON  = -0.5792;
    private const PRIX_BASE     = 5.00;
    private const PRIX_KM       = 0.59;
    private const BORDEAUX_VILLES = ['bordeaux', '33000', '33100', '33200', '33300', '33800'];

    public function calculerPrix(string $adresse, string $ville, string $codePostal = ''): float
    {
        $villeNorm = mb_strtolower(trim($ville));
        $cpNorm    = trim($codePostal);

        if (in_array($villeNorm, self::BORDEAUX_VILLES, true) || in_array($cpNorm, self::BORDEAUX_VILLES, true)) {
            return self::PRIX_BASE;
        }

        $coords = $this->geocoder($adresse . ', ' . $ville . ', France');

        if ($coords === null) {
            return self::PRIX_BASE + 10 * self::PRIX_KM;
        }

        $distance = $this->haversine(self::BORDEAUX_LAT, self::BORDEAUX_LON, $coords[0], $coords[1]);

        return round(self::PRIX_BASE + $distance * self::PRIX_KM, 2);
    }

    private function geocoder(string $query): ?array
    {
        $url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' . urlencode($query);

        $ctx = stream_context_create(['http' => [
            'header'  => "User-Agent: ViteEtGourmand/1.0\r\n",
            'timeout' => 3,
        ]]);

        $json = @file_get_contents($url, false, $ctx);

        if ($json === false) {
            return null;
        }

        $data = json_decode($json, true);

        if (empty($data)) {
            return null;
        }

        return [(float) $data[0]['lat'], (float) $data[0]['lon']];
    }

    private function haversine(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $R    = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a    = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        return $R * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
