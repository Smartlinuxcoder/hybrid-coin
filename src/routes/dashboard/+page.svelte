<script>

    let { data } = $props();
</script>

<div class="min-h-screen bg-gray-900 text-white">
    <nav class="container mx-auto px-6 py-8">
        <div class="flex items-center justify-between">
            <div class="text-white text-2xl font-bold">FusionBank</div>
            <form method="POST" action="?/logout">
                <button 
                    type="submit"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </form>
        </div>
    </nav>

    <main class="container mx-auto px-6 pt-20">
        <div class="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
            <h1 class="text-3xl font-bold mb-6">Welcome, {data.user.username}</h1>
            <div class="text-center">
                <p class="text-xl text-gray-400">Current Balance</p>
                <p class="text-4xl font-bold text-green-500 mt-2">
                    ${data.user.balance.toFixed(2)}
                </p>
            </div>
        </div>
    </main>
</div>