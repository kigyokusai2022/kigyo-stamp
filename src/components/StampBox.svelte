<script lang="ts">
    import {claimingStamp, userdata} from "../main"

    export let stampId: string;
    export let stampName: string;

    let isClaimed:boolean;
    userdata.update((it) => {
        isClaimed = it.stamps.indexOf(stampId) > -1
        return it;
    })

    let isClaiming:boolean;
    claimingStamp.update((it) => {
        isClaiming = it == stampId;
        return it;
    })
</script>

<style>
    .wrapper {
        text-align: center;
    }
    .box {
        height: 90%;
        width: auto;

        aspect-ratio: 1;

        margin: 5%;

        border: 3px solid;
        box-sizing: border-box;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stamp-unclaimed {
        display: none;
    }
    .stamp-claimed {
        display: block;
        height: 95%;
        width: 95%;
    }

    .stamp-claim {
        scale: 0;
        animation-name: stamp-claim;
        animation-delay: 0.5s;
        animation-duration: 0.8s;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
    }

    p {
        color: gray;
    }

    @keyframes stamp-claim {
        0% {
            scale: 5;
            transform: rotate(20deg);
        }
        100% {
            scale: 1;
            transform: rotate(0);
        }
    }
</style>
<div class="wrapper">
    <div class="box" style="border-color: {(isClaimed || isClaiming) ? 'red' : 'gray'}">
        <img class="{(isClaimed || isClaiming) ? 'stamp-claimed' : 'stamp-unclaimed'} {isClaiming ? 'stamp-claim' : ''}" src="img/{stampId}.png" alt="">
    </div>
    <p>{stampName}</p>
</div>