<script lang="ts">
    import Message from "$lib/components/message.svelte";
    import store from "$lib/stores/message.ts";
    let message: string;
    let messages: string[] = [];

    let username = "";

    function updateUsername(e: Event) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        username = target.username.value;
        if (!username) {
            return;
        }

        document.cookie = `username=${username};`;

        store.setup();
        store.subscribe((currentMessage) => {
            messages = [...messages, currentMessage];
        });
    }

    function onSendMessage() {
        if (message.length > 0) {
            store.sendMessage(username, message);
            message = "";
        }
    }
</script>

<h1>Chat app</h1>
{#if username === ""}
    <form method="POST" on:submit={updateUsername}>
        <label for="username">Username </label>
        <input name="username" id="username" />
        <button type="submit">Confirm</button>
    </form>
{:else}
    <p>Connected as {username}</p>
    <label for="message">Message</label>
    <input type="text" id="message" bind:value={message} />
    <button on:click={onSendMessage}> Send Message </button>
    {#each messages as message}
        <Message {message} {username} />
    {/each}
{/if}
