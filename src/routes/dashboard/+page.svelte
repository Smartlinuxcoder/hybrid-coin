<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	

	let { data } = $props();
	let amount = $state('');
	let receiver = $state('');
	let depositAmount = $state('');
	let sendingMoney = $state(false);
	let generatingPdf = $state(false);
	let depositSuccess = $state(false);
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error'>('success');

	const getAuthToken = () => {
		if (!browser) return '';
		const cookies = document.cookie.split('; ');
		const tokenCookie = cookies.find(row => row.startsWith('token='));
		return tokenCookie ? tokenCookie.split('=')[1] : '';
	};

	const showToast = (message: string, type: 'success' | 'error' = 'success') => {
		toastMessage = message;
		toastType = type;
		setTimeout(() => {
			toastMessage = '';
		}, 3000);
	};

	const handleSendMoney = async () => {
		if (sendingMoney) return;

		sendingMoney = true;
		try {
			const res = await fetch('/api/send', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${getAuthToken()}`
				},
				body: JSON.stringify({ receiver, amount }),
			});

			if (!res.ok) throw new Error(await res.text());

			data.transactions.unshift({
				sender: data.user.username,
				receiver,
				amount: parseFloat(amount),
				timestamp: new Date().toISOString()
			});
			data.user.balance -= parseFloat(amount);

			showToast('Money sent successfully');
			receiver = '';
			amount = '';
			
		} catch (error) {
			showToast(error.message, 'error');
		} finally {
			sendingMoney = false;
			invalidateAll();
		}
	};

	const handleDeposit = async () => {
		try {
			const res = await fetch('/api/deposit', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${getAuthToken()}`
				},
				body: JSON.stringify({ amount: depositAmount }),
			});

			if (!res.ok) throw new Error(await res.text());

			data.transactions.unshift({
				sender: 'Deposit',
				receiver: data.user.username,
				amount: parseFloat(depositAmount),
				timestamp: new Date().toISOString()
			});
			data.user.balance += parseFloat(depositAmount);

			depositSuccess = true;
			depositAmount = '';
			showToast('Deposit successful');
			invalidateAll();
		} catch (error) {
			showToast(error.message, 'error');
		}
	};

	const handleGeneratePdf = async () => {
		if (generatingPdf) return;

		generatingPdf = true;
		try {
			const res = await fetch('/api/printMoney', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${getAuthToken()}`
				},
				body: JSON.stringify({ amount }),
			});

			if (!res.ok) throw new Error(await res.text());

			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `transaction-${Date.now()}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			showToast('PDF generated successfully');
		} catch (error) {
			showToast(error.message, 'error');
		} finally {
			generatingPdf = false;
			invalidateAll();
		}
	};

	const handleLogout = async () => {
		try {
			await fetch('/api/logout', { 
				method: 'POST',
				headers: { 
					'Authorization': `Bearer ${getAuthToken()}`
				}
			});
		} catch (error) {
			console.error('Logout failed', error);
		} finally {
			// Always attempt to remove token and redirect
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			goto('/login');
		}
	};

	// Format date for transaction display
	const formatDate = (timestamp: string) => {
		return new Date(timestamp).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<div class="relative min-h-screen bg-gray-900 overflow-hidden">
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

	{#if toastMessage}
		<div 
			transition:fade
			class="fixed top-4 right-4 z-50 {toastType === 'success' 
				? 'bg-green-600' 
				: 'bg-red-600'} text-white px-4 py-2 rounded-lg shadow-lg"
		>
			{toastMessage}
		</div>
	{/if}

	<div class="relative z-10">
		<nav class="container mx-auto px-6 py-8">
			<div class="flex items-center justify-between">
				<div class="text-white text-2xl font-bold">FusionBank</div>
				<button
					on:click={handleLogout}
					class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
				>
					Logout
				</button>
			</div>
		</nav>

		<main class="container mx-auto px-6 pt-12">
			<div class="grid md:grid-cols-3 gap-8">
				<!-- Account Summary -->
				<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center md:col-span-1">
					<h1 class="text-2xl font-bold text-white mb-4">Welcome, {data.user.username}</h1>
					<div class="space-y-4">
						<p class="text-gray-400">Current Balance</p>
						<p class="text-5xl font-bold text-emerald-500">
							${data?.user?.balance?.toFixed(2) ?? '0.00'}
						</p>
					</div>
				</div>

				<div class="space-y-6 md:col-span-2">
					<!-- Send Money Section -->
					<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
						<h2 class="text-xl font-semibold text-white mb-4">Send Money</h2>
						<div class="space-y-4">
							<input
								type="text"
								placeholder="Receiver Username"
								bind:value={receiver}
								class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<input
								type="number"
								placeholder="Amount"
								bind:value={amount}
								min="0.01"
								class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<button
								on:click={handleSendMoney}
								disabled={sendingMoney}
								class="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
							>
								{sendingMoney ? 'Sending...' : 'Send Money'}
							</button>
						</div>
					</div>

					<!-- Deposit Section -->
					<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
						<h2 class="text-xl font-semibold text-white mb-4">Deposit Money</h2>
						<div class="space-y-4">
							<input
								type="number"
								placeholder="Deposit Amount"
								bind:value={depositAmount}
								min="0.01"
								class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<button
								on:click={handleDeposit}
								class="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg transition-colors"
							>
								Deposit
							</button>
						</div>
					</div>

					<!-- Generate PDF Section -->
					<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
						<h2 class="text-xl font-semibold text-white mb-4">Print money</h2>
						<div class="space-y-4">
							<input
								type="number"
								placeholder="Amount"
								bind:value={amount}
								min="0.01"
								class="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<button
								on:click={handleGeneratePdf}
								disabled={generatingPdf}
								class="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
							>
								{generatingPdf ? 'Generating PDF...' : 'Generate PDF'}
							</button>
						</div>
					</div>
				</div>

				<!-- Transaction History -->
				<div class="md:col-span-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
					<h2 class="text-xl font-semibold text-white mb-4">Transaction History</h2>
					{#if data.transactions.length === 0}
						<p class="text-gray-400 text-center">No transactions yet</p>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left">
								<thead class="border-b border-gray-700">
									<tr>
										<th class="py-3 text-gray-400">Date</th>
										<th class="py-3 text-gray-400">Type</th>
										<th class="py-3 text-gray-400">Details</th>
										<th class="py-3 text-gray-400 text-right">Amount</th>
									</tr>
								</thead>
								<tbody>
									{#each data.transactions as transaction}
										<tr class="border-b border-gray-700 last:border-b-0">
											<td class="py-3 text-white">
												{formatDate(transaction.timestamp)}
											</td>
											<td class="py-3 text-white">
												{transaction.sender === data.user.username ? 'Sent' : 'Received'}
											</td>
											<td class="py-3 text-gray-400">
												{transaction.sender === data.user.username 
													? `To: ${transaction.receiver}` 
													: `From: ${transaction.sender}`}
											</td>
											<td class="py-3 text-right font-semibold {
												transaction.sender === data.user.username 
													? 'text-red-500' 
													: 'text-green-500'
											}">
												{transaction.sender === data.user.username ? '-' : '+'}
												${transaction.amount.toFixed(2)}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			</div>
		</main>
	</div>
</div>