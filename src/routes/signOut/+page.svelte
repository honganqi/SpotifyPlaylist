<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { goto } from '$app/navigation';
  
    const { data } = $props();
    export const toast: ToastContext = getContext('toast');
  
    onMount(() => {
        if (data.signedOut) {
            toast.create({
                title: 'Success',
                description: 'Logged out successfully!',
                type: 'success'
            });
            goto('/');
        }
    });

</script>
