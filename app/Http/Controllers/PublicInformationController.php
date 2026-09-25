<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Informasi;
use Inertia\Inertia;

class PublicInformationController extends Controller
{
    public function show($slug)
    {
        $informasi = Informasi::where(function($q) use ($slug) {
                $q->where('slug', $slug)
                  ->orWhere('id_informasi', $slug);
            })
            ->whereIn('status', ['Publish', 'Published'])
            ->firstOrFail();

        return Inertia::render('public/Information/Detail', [
            'informasi' => $informasi
        ]);
    }
}
