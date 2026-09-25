<?php
$kernel = app(Illuminate\Contracts\Http\Kernel::class);
app('router')->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

$user = App\Models\User::where('email', 'admin@sipadu.com')->first();
auth()->login($user);

$req = Illuminate\Http\Request::create('/logout', 'POST');
$res = $kernel->handle($req);
echo "Logout Status: " . $res->getStatusCode() . "\n";
echo "Logout Redirect: " . $res->headers->get('Location') . "\n";
