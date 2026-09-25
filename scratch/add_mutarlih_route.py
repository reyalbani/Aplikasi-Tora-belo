import re
with open('routes/web.php', 'r', encoding='utf-8') as f:
    content = f.read()

route_str = "Route::post('/layanan/mutarlih', [App\Http\Controllers\MutarlihController::class, 'store'])->name('mutarlih.store');"
if "mutarlih.store" not in content:
    content = content.replace("Route::post('/layanan/kerjasama', [App\Http\Controllers\KerjasamaController::class, 'store'])->name('kerjasama.store');", 
    "Route::post('/layanan/kerjasama', [App\Http\Controllers\KerjasamaController::class, 'store'])->name('kerjasama.store');\n" + route_str)
    
    with open('routes/web.php', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Route mutarlih.store added")
