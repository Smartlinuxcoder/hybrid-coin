<!-- src/routes/login/+page.svelte -->
<script>
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    
    let username = '';
    let password = '';
    
    async function handleLogin(event) {
      event.preventDefault();
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });
    
        const data = await response.json();
    
        if (response.ok && browser) {
          document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
          goto('/dashboard');
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred');
      }
    }
    </script>
    
    
    <div class="relative min-h-screen bg-gray-900 overflow-hidden">
      <!-- Blurry blobs -->
      {#each Array(5) as _, i}
        <div
          in:fade
          class="absolute blur-[100px] opacity-50"
          style="
            background: {['#4F46E5', '#7C3AED', '#2563EB', '#3B82F6', '#6366F1'][i]};
            width: {Math.random() * 400 + 200}px;
            height: {Math.random() * 400 + 200}px;
            left: {Math.random() * 100}%;
            top: {Math.random() * 100}%;
            transform: translate(-50%, -50%);
          "
        />
      {/each}
    
      <!-- Content -->
      <div class="relative z-10">
        <nav class="container mx-auto px-6 py-8">
          <div class="flex items-center justify-between">
            <div class="text-white text-2xl font-bold">FusionBank</div>
            <div class="space-x-4">
              <a
                href="/login"
                class="text-white hover:text-gray-300 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
              >
                Login
              </a>
              <a
                href="/register"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </a>
            </div>
          </div>
        </nav>
    
        <main class="container mx-auto px-6 pt-20 pb-32">
          <div class="max-w-md mx-auto">
            <div class="p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <h2 class="text-3xl font-bold text-white mb-6 text-center">
                Login to FusionBank
              </h2>
              
              <form on:submit={handleLogin}>
                <div class="mb-4">
                  <label for="username" class="block text-gray-300 mb-2">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    bind:value={username}
                    class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                <div class="mb-6">
                  <label for="password" class="block text-gray-300 mb-2">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    bind:value={password}
                    class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your password"
                    required
                  />
                  <a 
                    href="/forgot-password" 
                    class="text-sm text-indigo-400 hover:text-indigo-300 mt-2 inline-block"
                  >
                    Forgot Password?
                  </a>
                </div>
                
                <button 
                  type="submit" 
                  class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  Sign In
                </button>
              </form>
              
              <div class="text-center mt-6">
                <p class="text-gray-400">
                  Don't have an account? 
                  <a 
                    href="/register" 
                    class="text-indigo-400 hover:text-indigo-300"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>