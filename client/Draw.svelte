<script lang="ts">
    import { onMount } from "svelte";
    export let className = "";
    export let color = "red";
    let canvas: HTMLCanvasElement;
    let height: number | undefined;
    let width: number | undefined;
    let ctx: CanvasRenderingContext2D | undefined = undefined;
    let isDrawing = false;

    export const getImageData = () => {
        return canvas!.toDataURL();
    };

    onMount(() => {
        ctx = canvas.getContext("2d")!;
        ctx.lineWidth = 10;
    });

    const startDraw: svelte.JSX.EventHandler<MouseEvent, HTMLCanvasElement> = (
        ev
    ) => {
        if (ctx) {
            ctx.beginPath();
            isDrawing = true;
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(ev.offsetX, ev.offsetY);
        }
    };

    const stopDraw: svelte.JSX.EventHandler<MouseEvent, HTMLCanvasElement> = (
        ev
    ) => {
        if (ctx) {
            ctx.closePath();
            isDrawing = false;
        }
    };

    const handleDraw: svelte.JSX.EventHandler<MouseEvent, HTMLCanvasElement> = (
        ev
    ) => {
        if (ctx && isDrawing) {
            ctx.lineTo(ev.offsetX, ev.offsetY);
            ctx.stroke();
        }
    };

    const clearDrawing = () => {
        if (ctx && width && height) {
            ctx.clearRect(0, 0, width, height);
        }
    };
</script>

<div class={className} bind:offsetHeight={height} bind:offsetWidth={width}>
    <canvas
        on:mousemove={handleDraw}
        on:mouseup={stopDraw}
        on:mousedown={startDraw}
        {width}
        {height}
        bind:this={canvas}
    />
    <button class="button is-danger" on:click={clearDrawing}>
        <span class="icon is-small">
            <i class="fas fa-trash" />
        </span>
    </button>
</div>

<style lang="scss">
    div {
        border: 1px solid black;
        position: relative;
    }

    canvas {
        width: 100%;
        height: 100%;
    }

    button {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
