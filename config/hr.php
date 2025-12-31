<?php

return [
    // Koordinat kantor utama (default Jakarta Pusat). Set via env
    'office_lat' => env('HR_OFFICE_LAT', -6.200000),
    'office_lng' => env('HR_OFFICE_LNG', 106.816666),

    // Radius geofence maksimum dalam meter untuk validasi check-in/out
    'max_radius_m' => env('HR_MAX_RADIUS_M', 200),

    // Ambang akurasi maksimum (meter). Jika > nilai ini, tolak
    'max_accuracy_m' => env('HR_MAX_ACCURACY_M', 100),
];