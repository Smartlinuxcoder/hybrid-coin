<script>
    import { page } from '$app/stores';
    
    // Svelte 5 runes
    let { data, form } = $props();
</script>

<div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 class="text-2xl font-bold mb-4">Redeem Transaction</h1>
        
        {#if data.transaction}
            <div class="mb-4">
                <p class="text-gray-700">Transaction Amount:</p>
                <p class="text-3xl font-bold text-green-600">
                    {data.transaction.amount} $FUSION
                </p>
            </div>

            <form method="POST" class="mt-6">
                <button 
                    type="submit" 
                    class="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded"
                >
                    Redeem Transaction
                </button>
            </form>
        {/if}

        {#if form?.message}
            <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {form.message}
            </div>
        {/if}
    </div>
</div>