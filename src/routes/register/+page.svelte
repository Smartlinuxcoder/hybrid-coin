<script>
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    
    let username = '';
    let fullName = '';
    let password = '';
    let confirmPassword = '';
    
    async function handleRegister(event) {
      event.preventDefault();
      
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, fullName, password })
        });
    
        const data = await response.json();
    
        if (response.ok && browser) {
          goto('/login');
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
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
            Create Your Account
          </h2>
          
          <form on:submit={handleRegister}>
            <div class="mb-4">
              <label for="username" class="block text-gray-300 mb-2">Username</label>
              <input 
                type="text" 
                id="username" 
                bind:value={username}
                class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Choose a username"
                required
              />
            </div>
            
            <div class="mb-4">
              <label for="fullName" class="block text-gray-300 mb-2">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                bind:value={fullName}
                class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div class="mb-4">
              <label for="password" class="block text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                bind:value={password}
                class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Create a password"
                required
                minlength="8"
              />
            </div>
            
            <div class="mb-6">
              <label for="confirm-password" class="block text-gray-300 mb-2">Confirm Password</label>
              <input 
                type="password" 
                id="confirm-password" 
                bind:value={confirmPassword}
                class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm your password"
                required
                minlength="8"
              />
            </div>
            
            <button 
              type="submit" 
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Create Account
            </button>
          </form>
          
          <div class="text-center mt-6">
            <p class="text-gray-400">
              Already have an account? 
              <a 
                href="/login" 
                class="text-indigo-400 hover:text-indigo-300"
              >
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>