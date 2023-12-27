<script lang="ts">
    export let message: string;
    export let username: string;

    let direction = message.startsWith(username) ? "left" : "right"
</script>

<p style="text-align: {direction}">
    {message}
</p>
