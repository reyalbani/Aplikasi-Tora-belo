<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    public function test_admin_login()
    {
        $user = User::where('email', 'admin@sipadu.com')->first();
        $this->assertNotNull($user, 'Admin user not found');

        $response = $this->post('/login', [
            'email' => 'admin@sipadu.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        
        // Follow redirect to dashboard
        $response = $this->get('/dashboard');
        $response->assertRedirect('/admin/area');
        
        $this->assertAuthenticatedAs($user);
    }

    public function test_petugas_login()
    {
        $user = User::where('email', 'petugas@sipadu.com')->first();
        
        $response = $this->post('/login', [
            'email' => 'petugas@sipadu.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        
        $response = $this->get('/dashboard');
        $response->assertRedirect('/petugas/area');
        
        $this->assertAuthenticatedAs($user);
    }

    public function test_pimpinan_login()
    {
        $user = User::where('email', 'pimpinan@sipadu.com')->first();
        
        $response = $this->post('/login', [
            'email' => 'pimpinan@sipadu.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        
        $response = $this->get('/dashboard');
        $response->assertRedirect('/pimpinan/area');
        
        $this->assertAuthenticatedAs($user);
    }

    public function test_masyarakat_login()
    {
        $user = User::where('email', 'masyarakat@sipadu.com')->first();
        
        $response = $this->post('/login', [
            'email' => 'masyarakat@sipadu.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        
        $response = $this->get('/dashboard');
        $response->assertRedirect('/masyarakat/area');
        
        $this->assertAuthenticatedAs($user);
    }
}
