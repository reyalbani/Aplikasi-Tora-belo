<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/layanan/ppid', 'POST', [
    'id_layanan' => 5,
    'nik' => '1234567890123456',
    'nama' => 'Test User',
    'email' => 'test@example.com',
    'no_hp' => '08123456789',
    'alamat' => 'Test Alamat',
    'rincian_informasi' => 'Test Info',
    'tujuan_penggunaan' => 'Test Tujuan',
    'cara_memperoleh' => 'Melihat',
    'cara_mendapatkan_salinan' => 'Mengambil Langsung',
]);
$request->headers->set('Accept', 'application/json');

$pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 <<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\n>>\n>>\n>>\nendobj\n4 0 obj\n<<\n/Length 55\n>>\nstream\nBT\n/F1 12 Tf\n72 712 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000015 00000 n \n0000000064 00000 n \n0000000121 00000 n \n0000000259 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n364\n%%EOF";
file_put_contents('dummy.pdf', $pdf);
$file = new Illuminate\Http\UploadedFile('dummy.pdf', 'dummy.pdf', 'application/pdf', null, true);
$request->files->set('dokumen_ktp', $file);

$response = $kernel->handle($request);
if (isset($response->exception) && $response->exception) {
    echo get_class($response->exception) . "\n";
    echo $response->exception->getMessage();
} else {
    echo $response->getStatusCode() . "\n";
    echo $response->getContent();
}
