<script lang="ts">
    import { onMount } from "svelte";
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
            isDrawing = true;
            ctx.moveTo(ev.offsetX, ev.offsetY);
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
</script>

<div bind:clientHeight={height} bind:clientWidth={width}>
    <canvas
        on:mousemove={handleDraw}
        on:mouseup={() => (isDrawing = false)}
        on:mousedown={startDraw}
        {width}
        {height}
        bind:this={canvas}
    />
</div>
