<script lang="ts">
 import {page} from '$app/state';
 import {onMount} from 'svelte';
 import type {Snippet} from 'svelte';
 import Icon from './Icon.svelte';
 import '$lib/harness/context.css';
 let {children}: {children:Snippet}=$props();
 let theme=$state<'light'|'dark'>('dark');
 function setTheme(value:'light'|'dark') {
  theme=value;
  document.documentElement.dataset.theme=value;
  try {localStorage.setItem('theme',value);} catch { /* The theme still works when storage is unavailable. */ }
 }
 onMount(()=>{
  theme=document.documentElement.dataset.theme==='light'?'light':'dark';
  function syncTheme(event:StorageEvent) {
   if(event.key==='theme'&&(event.newValue==='light'||event.newValue==='dark')) {
    theme=event.newValue;
    document.documentElement.dataset.theme=theme;
   }
  }
  window.addEventListener('storage',syncTheme);
  return ()=>window.removeEventListener('storage',syncTheme);
 });
</script>
<div class="context-app">
 <a class="skip" href="#main-content">Skip to content</a>
 <aside class="site-rail">
  <a href="/" class="wordmark" aria-label="Loooom home"><svg class="loom-mark" aria-hidden="true" viewBox="0 0 50 34" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="11" cy="17" rx="8" ry="14"/><ellipse cx="20" cy="17" rx="8" ry="14"/><ellipse cx="29" cy="17" rx="8" ry="14"/><ellipse cx="38" cy="17" rx="8" ry="14"/></svg>loooom<span class="brand-period">.</span></a>
  <nav aria-label="Primary navigation">
   <a class:active={page.url.pathname==='/'&&!page.url.searchParams.has('view')} href="/"><Icon name="discover"/>Discover<span class="nav-dot"></span></a>
   <a class:active={page.url.searchParams.get('view')==='following'} href="/?view=following#discover"><Icon name="people"/>Following</a>
   <a class:active={page.url.searchParams.get('view')==='saved'} href="/?view=saved#discover"><Icon name="bookmark"/>Your collection</a>
   <div class="rail-divider"></div>
   <a class:active={page.url.pathname==='/evals'} href="/evals"><Icon name="flask"/>Personal evals<span class="small-new">New</span></a>
   <a href="/browse"><Icon name="layers"/>Skills</a>
   <a href="/gym"><Icon name="code"/>The Gym</a>
  </nav>
  <div class="rail-bottom"><a href="https://github.com/mager/loooom.xyz" target="_blank" rel="noreferrer"><Icon name="github" size={16}/> Source code <Icon name="external" size={12}/></a></div>
 </aside>
 <div class="site-body">
  <header class="topbar"><span class="topbar-copy">Let anyone <strong>try on your harness</strong></span><div><a class="sign-in" href={page.data.user?'/dashboard':'/login?next=/'}>{page.data.user?`@${page.data.user.username}`:'Sign in'}</a>{#if page.url.pathname!=='/share'}<a class="button primary compact" href="/share"><Icon name="plus" size={16}/><span>Share AGENTS.md</span></a>{/if}</div></header>
  <main id="main-content">{@render children()}</main>
 </div>
 <footer class="utility-footer" aria-label="Site information and appearance">
  <div class="footer-links"><a href="/about" aria-current={page.url.pathname==='/about'?'page':undefined}>About</a><span class="site-version" title="Website version">v{page.data.siteVersion}</span></div>
  <span class="footer-credit">A side project by <a href="https://x.com/mager" target="_blank" rel="noreferrer">@mager</a></span>
  <div class="theme-control" role="group" aria-label="Color theme">
   <button type="button" data-theme-choice="light" aria-pressed={theme==='light'} onclick={()=>setTheme('light')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><span class="theme-label">Light</span></button>
   <button type="button" data-theme-choice="dark" aria-pressed={theme==='dark'} onclick={()=>setTheme('dark')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A9 9 0 0 1 9.8 3.5a9 9 0 1 0 10.7 10.7Z"/></svg><span class="theme-label">Dark</span></button>
  </div>
 </footer>
</div>
