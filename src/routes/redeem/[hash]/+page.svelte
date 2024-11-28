<script lang="ts">
	import { page } from '$app/stores';
	
	let { data, form } = $props();
	let isRedeming = $state(false);
</script>

<div class="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
	{#each Array(5) as _, i}
		<div
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

	<div class="relative z-10 container mx-auto px-4 py-8 max-w-md">
		<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center shadow-2xl">
			<h1 class="text-3xl font-bold mb-6 text-white">Redeem Transaction</h1>
			
			{#if data.transaction}
				<div class="mb-8">
					<p class="text-gray-400 mb-2">Transaction Amount:</p>
					<p class="text-5xl font-bold text-emerald-500">
						{data.transaction.amount} $FUSION
					</p>
					
					<div class="mt-6 space-y-4">
						<div class="bg-gray-700/50 p-4 rounded-lg">
							<p class="text-gray-300">Sender</p>
							<p class="text-white font-semibold">{data.transaction.sender}</p>
						</div>
						
						<div class="bg-gray-700/50 p-4 rounded-lg">
							<p class="text-gray-300">Timestamp</p>
							<p class="text-white font-semibold">
								{new Date(data.transaction.timestamp).toLocaleString()}
							</p>
						</div>
					</div>
				</div>

				<form method="POST" 
					on:submit={() => isRedeming = true}
					class="mt-6"
				>
					<button
						type="submit"
						disabled={isRedeming}
						class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
					>
						{isRedeming ? 'Redeeming...' : 'Redeem Transaction'}
					</button>
				</form>
			{/if}
			
			{#if form?.message}
				<div 
					class="mt-6 bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg"
				>
					{form.message}
				</div>
			{/if}
		</div>
	</div>
</div>