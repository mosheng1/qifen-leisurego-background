<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    const elems = document.querySelectorAll('.laya-please');
    const layer2 = document.querySelector('.layer-2');
    const layer3 = document.querySelector('.layer-3');
    const layer4 = document.querySelector('.layer-4');
    const layer5 = document.querySelector('.layer-5');
    const layer6 = document.querySelector('.layer-6');
    const layer7 = document.querySelector('.layer-7');
    const layer8 = document.querySelector('.layer-8');


    setTimeout(function () {
        elems.forEach(function (elem, index) {
            elem.style.animation = "none";
        });
    }, 1500);



    document.body.addEventListener('mousemove', function (e) {
        if (!e.currentTarget.dataset.triggered) {
            elems.forEach(function (elem, index) {
                if (elem.getAttribute('style')) {
                    elem.style.transition = "all .5s";
                    elem.style.transform = "none";
                }
            });
        }
        e.currentTarget.dataset.triggered = true;

        let width = window.innerWidth / 2;
        let mouseMoved2 = ((width - e.pageX) / 50);
        let mouseMoved3 = ((width - e.pageX) / 40);
        let mouseMoved4 = ((width - e.pageX) / 30);
        let mouseMoved5 = ((width - e.pageX) / 20);
        let mouseMoved6 = ((width - e.pageX) / 10);
        let mouseMoved7 = ((width - e.pageX) / 5);

        layer3.style.transform = "translateX(" + mouseMoved2 + "px)";
        layer4.style.transform = "translateX(" + mouseMoved3 + "px)";
        layer5.style.transform = "translateX(" + mouseMoved4 + "px)";
        layer6.style.transform = "translateX(" + mouseMoved5 + "px)";
        layer7.style.transform = "translateX(" + mouseMoved6 + "px)";
        layer8.style.transform = "translateX(" + mouseMoved7 + "px)";
    });

    document.body.addEventListener('mouseleave', function (e) {
        elems.forEach(function (elem, index) {
            elem.style.transition = "all .5s";
            elem.style.transform = "none";
        });
    });

    document.body.addEventListener('mouseenter', function (e) {
        elems.forEach(function (elem, index) {
            setTimeout(function () {
                elem.style.transition = "none";
            }, 500);
        });
    });
});

</script>

<template>
    <div class="totalcontainer">
        <div class="laya-please layer-1">
        </div>
        <div class="laya-please layer-2">
        </div>
        <div class="container1">
            <div class="laya-please layer-3">
            </div>
            <div class="laya-please layer-4">
            </div>
            <div class="laya-please layer-5">
            </div>
            <div class="laya-please layer-6">
            </div>
        </div>
        <div class="container2">
            <div class="laya-please layer-7">
            </div>
            <div class="laya-please layer-8">
            </div>
        </div>
    </div>
</template>

<style scoped>


.totalcontainer {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.container1 {
    transform: scaleX(1.11);
}

.container2 {
    transform: scaleX(1.25);
}

.layer-1 {
    height: 100vh;
    width: 100%;
    background-color: #fed8c1;
}

.layer-2 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453880/codepen/lay2.svg") no-repeat center center fixed;
    animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.layer-3 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453880/codepen/lay3.svg") no-repeat center center fixed;
    animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

.layer-4 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453880/codepen/lay4.svg") no-repeat center center fixed;
    animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
}

.layer-5 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453880/codepen/lay5.svg") no-repeat center center fixed;
    animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.55s both;
}

.layer-6 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453881/codepen/lay6.svg") no-repeat center center fixed;
    animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.75s both;
}

.layer-7 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453881/codepen/lay7.svg") no-repeat center center fixed;
    animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.85s both;
}

.layer-8 {
    background: url("https://res.cloudinary.com/dkgrf00g1/image/upload/v1536453882/codepen/lay8.svg") no-repeat center center fixed;
    animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s both;
}

.laya-please {
    position: absolute;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0px;
}

@-webkit-keyframes slide-in-bottom {
    0% {
        -webkit-transform: translateY(1000px);
        transform: translateY(1000px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-in-bottom {
    0% {
        -webkit-transform: translateY(1000px);
        transform: translateY(1000px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-in-top {
    0% {
        -webkit-transform: translateY(-1000px);
        transform: translateY(-1000px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }
}
</style>