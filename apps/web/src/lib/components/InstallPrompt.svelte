<script lang="ts">
  import { onMount } from 'svelte';

  let { language = 'en' } = $props();

  const strings = {
    en: {
      heading: 'Make Ilya yours',
      body: 'Install Ilya on this device for your own persistent workspace — it works offline too.',
      install: 'Install',
      dismiss: 'Not now'
    },
    fr: {
      heading: "Faites d'Ilya le vôtre",
      body: "Installez Ilya sur cet appareil pour disposer de votre propre espace de travail persistant — fonctionne aussi hors ligne.",
      install: 'Installer',
      dismiss: 'Plus tard'
    }
  };

  let deferredPrompt = $state(null);
  let visible = $state(false);

  onMount(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => { visible = true; }, 8000);
    });
  });

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    visible = false;
  }

  function dismiss() {
    visible = false;
    deferredPrompt = null;
  }

  let t = $derived(strings[language] ?? strings.en);
</script>

{#if visible}
  <div class="install-prompt" role="dialog" aria-label={t.heading}>
    <div class="install-prompt-inner">
      <p class="install-heading">{t.heading}</p>
      <p class="install-body">{t.body}</p>
      <div class="install-actions">
        <button class="install-btn-primary" onclick={install}>{t.install}</button>
        <button class="install-btn-ghost" onclick={dismiss}>{t.dismiss}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .install-prompt {
    position: fixed;
    bottom: 56px;
    left: 50%;
    transform: translateX(-50%);
    width: min(480px, calc(100vw - 32px));
    background: var(--paper, #f5f0e8);
    border: 1px solid var(--sage, #8B9A7D);
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    padding: 20px 24px;
    z-index: 9000;
    animation: slide-up 0.3s ease;
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .install-prompt-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .install-heading {
    font-family: 'Source Serif 4', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--ink, #1a1612);
    margin: 0;
  }

  .install-body {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 13px;
    color: var(--ink-secondary, #5a5248);
    margin: 0;
    line-height: 1.5;
  }

  .install-actions {
    display: flex;
    gap: 10px;
    margin-top: 4px;
  }

  .install-btn-primary {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 13px;
    font-weight: 600;
    background: var(--sage, #8B9A7D);
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 7px 18px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .install-btn-primary:hover {
    background: var(--deeper-sage, #7A8A6C);
  }

  .install-btn-ghost {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 13px;
    color: var(--ink-secondary, #5a5248);
    background: transparent;
    border: 1px solid var(--border, #d4cec8);
    border-radius: 4px;
    padding: 7px 14px;
    cursor: pointer;
  }

  .install-btn-ghost:hover {
    background: var(--surface-subtle, #ede8e0);
  }

  @media print {
    .install-prompt { display: none; }
  }
</style>
