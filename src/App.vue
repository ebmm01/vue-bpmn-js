<template>
    <v-app>
        <v-content>
            <v-slide-x-transition mode="out-in">
                <router-view></router-view>
            </v-slide-x-transition>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: 'App'
};
</script>

<style lang="scss">
#canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.bpmn-icon-intermediate-event-none,
.bpmn-icon-subprocess-expanded,
.bpmn-icon-data-store,
.bpmn-icon-participant,
.bpmn-icon-group {
    display: none !important;
}

.djs-palette {
    top: 50px !important;
    right: 20px !important;
    left: unset !important;

    &.two-column {
        width: 48px !important;
    }
}
</style>