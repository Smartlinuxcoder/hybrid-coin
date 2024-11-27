<!-- src/routes/+page.svelte -->
<script>
    import { fade } from 'svelte/transition';
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
          <div class="text-white text-2xl font-bold">SigmaCreeper</div>
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
        <div class="max-w-3xl mx-auto text-center">
          <h1
            class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Banking Made Simple and Secure
          </h1>
          <p class="text-xl text-gray-300 mb-12">
            Experience the next generation of digital banking with advanced security
            and seamless transactions.
          </p>
          <div class="space-x-4">
            <a
              href="/register"
              class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started
            </a>
            <a
              href="/learn-more"
              class="inline-block text-white hover:text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold border border-white/20 hover:border-white/40 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
  
        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-8 mt-32">
          {#each [
            {
              title: 'Secure Transactions',
              description:
                'Bank with confidence using our state-of-the-art security systems'
            },
            {
              title: '24/104 Support',
              description:
                'Access customer support anytime, anywhere with our dedicated yappers'
            },
            {
              title: 'Mobile Banking',
              description:
                'Manage your finances on the go with our powerful web app'
            }
          ] as feature}
            <div class="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <h3 class="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p class="text-gray-400">{feature.description}</p>
            </div>
          {/each}
        </div>
      </main>
    </div>
  </div>
  
  <style>
    /* Sigma sigma on the wall who's the skibidiest of them all */
  </style>
  