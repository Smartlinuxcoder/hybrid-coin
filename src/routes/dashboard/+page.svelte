<script>
    let { data } = $props();

    let depositAmount = '';
    let sendAmount = '';
    let receiver = '';

    async function handleDeposit(event) {
        event.preventDefault();
        const response = await fetch('/api/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(depositAmount) }),
        });
        const result = await response.json();
        if (result.success) {
            alert('Deposit successful!');
            window.location.reload();
        } else {
            alert(`Error: ${result.message}`);
        }
    }

    async function handleSend(event) {
        event.preventDefault();
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(sendAmount), receiver }),
        });
        const result = await response.json();
        if (result.success) {
            alert('Money sent successfully!');
            window.location.reload(); // Reload to update balance
        } else {
            alert(`Error: ${result.message}`);
        }
    }
</script>

<div class="min-h-screen bg-gray-900 text-white">
    <!-- Navigation -->
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

    <!-- Main Section -->
    <main class="container mx-auto px-6 pt-10 space-y-12">
        <!-- User Info -->
        <div class="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
            <h1 class="text-3xl font-bold mb-6">Welcome, {data.user.username}</h1>
            <div class="text-center">
                <p class="text-xl text-gray-400">Current Balance</p>
                <p class="text-4xl font-bold text-green-500 mt-2">
                    ${data.user.balance.toFixed(2)}
                </p>
            </div>
        </div>

        <!-- Deposit Form -->
        <div class="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 class="text-2xl font-bold mb-4">Deposit Money</h2>
            <form on:submit|preventDefault={handleDeposit}>
                <div class="mb-4">
                    <label for="depositAmount" class="block text-gray-400 mb-2">Amount</label>
                    <input 
                        type="number"
                        id="depositAmount"
                        bind:value={depositAmount}
                        required
                        min="0.01"
                        step="0.01"
                        class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    />
                </div>
                <button 
                    type="submit"
                    class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Deposit
                </button>
            </form>
        </div>

        <!-- Send Money Form -->
        <div class="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 class="text-2xl font-bold mb-4">Send Money</h2>
            <form on:submit|preventDefault={handleSend}>
                <div class="mb-4">
                    <label for="receiver" class="block text-gray-400 mb-2">Receiver</label>
                    <input 
                        type="text"
                        id="receiver"
                        bind:value={receiver}
                        required
                        class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    />
                </div>
                <div class="mb-4">
                    <label for="sendAmount" class="block text-gray-400 mb-2">Amount</label>
                    <input 
                        type="number"
                        id="sendAmount"
                        bind:value={sendAmount}
                        required
                        min="0.01"
                        step="0.01"
                        class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    />
                </div>
                <button 
                    type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Send
                </button>
            </form>
        </div>

        <!-- Transaction History -->
        <div class="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 class="text-2xl font-bold mb-4">Transaction History</h2>
            {#if data.transactions.length > 0}
                <table class="w-full text-left text-gray-300">
                    <thead>
                        <tr>
                            <th class="py-2 px-4">Date</th>
                            <th class="py-2 px-4">Sender</th>
                            <th class="py-2 px-4">Receiver</th>
                            <th class="py-2 px-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.transactions as txn}
                            <tr>
                                <td class="py-2 px-4">{new Date(txn.timestamp).toLocaleString()}</td>
                                <td class="py-2 px-4">{txn.sender}</td>
                                <td class="py-2 px-4">{txn.receiver}</td>
                                <td class="py-2 px-4 text-green-500">${txn.amount.toFixed(2)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
                <p class="text-gray-400">No transactions yet.</p>
            {/if}
        </div>
    </main>
</div>
