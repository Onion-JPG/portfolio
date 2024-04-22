<script setup>
    import about from "./components/about.vue";
</script>

<template>
    <about></about>
  
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                displayIntro: true,
            };
        },
        components: {
            about, 
        },
    };
</script>

