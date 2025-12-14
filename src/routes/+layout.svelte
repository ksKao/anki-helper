<script lang="ts">
	import './layout.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

	let { children } = $props();
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: {
				onError: (e) => {
					toast.error(e.message);
				}
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<QueryClientProvider client={queryClient}>
	<Toaster richColors position="top-center" />
	{@render children()}
</QueryClientProvider>
