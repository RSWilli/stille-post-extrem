<script lang="ts">
    import { currentRoom, isMaster, userList } from "./store/main";
</script>

<span>Started Game</span>

<span>{$currentRoom}</span>
<span>{$isMaster}</span>

<span>{$userList}</span>
