<script lang="ts">
 import {onMount} from 'svelte';
 import ContextShell from '$lib/components/harness/ContextShell.svelte';
 import HarnessCard from '$lib/components/harness/HarnessCard.svelte';
 import Icon from '$lib/components/harness/Icon.svelte';
 import {createCollection} from '$lib/harness/social.svelte';
 import type {PageData} from './$types';
 let {data}:{data:PageData}=$props();const collection=createCollection();onMount(()=>{collection.load();});
</script>
<svelte:head><title>@{data.owner}'s harness — Loooom</title></svelte:head>
<ContextShell><div class="page-intro"><a class="back-link" href="/#discover">Browse harnesses</a><h1>@{data.owner}<span>'s<br/>harness.</span></h1><p>Read their files. Try what fits.</p></div><div class="profile-actions"><button class="button primary" disabled={!!collection.busy} onclick={()=>collection.toggle('follow',data.owner.toLowerCase())}><Icon name={collection.following.includes(data.owner.toLowerCase())?'check':'plus'} size={16}/>{collection.following.includes(data.owner.toLowerCase())?'Following':'Follow'} @{data.owner}</button><a href={`https://github.com/${data.owner}`} class="button secondary" target="_blank" rel="noreferrer">GitHub profile<Icon name="external" size={15}/></a></div>{#if collection.message}<div class="notice" role="status">{collection.message} {#if collection.message.startsWith('Sign in')}<a href={`/login?next=/people/${data.owner}`}>Sign in</a>{/if}</div>{/if}<div class="profile-files">{#each data.harnesses as harness}<HarnessCard {harness} saved={collection.saved.includes(harness.id)} busy={!!collection.busy} onsave={(id)=>collection.toggle('save',id)}/>{/each}</div><p class="profile-note">Files are credited to their GitHub owner. This profile does not imply a Loooom account.</p></ContextShell>
<style>.page-intro h1 span{color:var(--lime)}.profile-actions{display:flex;gap:12px;flex-wrap:wrap}.profile-files{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-top:35px;max-width:850px}.profile-note{font-size:12px;color:var(--quiet);margin-top:24px!important;max-width:70ch}@media(max-width:900px){.profile-files{grid-template-columns:1fr}}</style>
