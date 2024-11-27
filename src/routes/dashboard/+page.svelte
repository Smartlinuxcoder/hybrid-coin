<script lang="ts">
	import { goto } from '$app/navigation';
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

	// Helper function to get auth token from cookies
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

			showToast('Money sent successfully');
			receiver = '';
			amount = '';
		} catch (error) {
			showToast(error.message, 'error');
		} finally {
			sendingMoney = false;
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

			depositSuccess = true;
			data.user.balance += parseFloat(depositAmount);
			depositAmount = '';
			showToast('Deposit successful');
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
			<div class="grid md:grid-cols-2 gap-8">
				<!-- Account Summary -->
				<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
					<h1 class="text-2xl font-bold text-white mb-4">Welcome, {data.user.username}</h1>
					<div class="space-y-4">
						<p class="text-gray-400">Current Balance</p>
						<p class="text-5xl font-bold text-emerald-500">
							${data?.user?.balance?.toFixed(2) ?? '0.00'}
						</p>
					</div>
				</div>

				<div class="space-y-6">
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
								disabled={depositSuccess}
								class="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
							>
								{depositSuccess ? 'Deposit Successful' : 'Deposit'}
							</button>
						</div>
					</div>

					<!-- Generate PDF Section -->
					<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
						<h2 class="text-xl font-semibold text-white mb-4">Transaction PDF</h2>
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
			</div>
		</main>
	</div>
</div>