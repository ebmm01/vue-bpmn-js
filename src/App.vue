<template>
    <v-app>
        <v-app-bar
            app
            color="primary"
            dark>
            <div class="d-flex align-center">
                <v-img
                alt="Vuetify Logo"
                class="shrink mr-2"
                contain
                src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                transition="scale-transition"
                width="40"
                />

                <v-img
                alt="Vuetify Name"
                class="shrink mt-1 hidden-sm-and-down"
                contain
                min-width="100"
                src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                width="100"
                />
            </div>

            <v-spacer></v-spacer>

            <v-btn
                href="https://github.com/vuetifyjs/vuetify/releases/latest"
                target="_blank"
                text>
                <span class="mr-2">Latest Release</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

            <!-- <div id="canvas"></div> -->
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
    top: 100px !important;
    right: 20px !important;
    left: unset !important;
}
</style>