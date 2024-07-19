<script setup>
import { ref, onMounted } from 'vue';

</script>

<template>
    <div class="violation">
        <div class='container'>
            <div class="gez">1</div>
            <div class="gez">2</div>
            <div class="gez">3</div>
            <div class="gez">4</div>
            <div class="gez">5</div>
            <div class="gez">6</div>
            <div class="gez">7</div>
            <div class="gez">8</div>
            <div class="gez">9</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 500px;
    height: 500px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 10px;
    margin: 0px auto;
    transition: all 0.3s ease;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 12px;

    .gez {
        // background: #f40;
        transition: all 0.3s ease;
        box-shadow: inset 1px 1px 10px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
    }
}

@for $i from 0 through 9 {
   
    .gez:nth-child(#{$i +1}) {
        background: hsl($i * 20%, 100%, 74%)
    };
    .container:has(.gez:nth-child(#{$i + 1}):hover) {
        $r: min(floor($i / 3) + 1, 3);
        $c: $i % 3 + 1;
        $arr: 1fr 1fr 1fr;
        $rows: set-nth($arr, $r, 2fr);
        $cols: set-nth($arr, $c, 2fr);
        grid-template-columns: $cols;
        grid-template-rows: $rows;
    }
}
</style>