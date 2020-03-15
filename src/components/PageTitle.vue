<template>
    <div class="page-title d-flex align-center">
        <v-toolbar 
            flat 
            dense=""
            class="px-0"
            color="primary">
            <v-toolbar-title 
                style="width: 100%;"
                class="d-flex align-center">
                <v-btn
                    v-if="showBack"
                    color="primary"
                    icon
                    @click="$router.push({path: '/'})">
                    <v-icon large color="white">mdi-chevron-left</v-icon>
                </v-btn>
                <div class="d-flex ml-3">
                    <h3 class="text-left white--text">
                        {{title}}  {{showBack? "-": ""}} <span class="font-weight-light">{{description}}</span>
                    </h3>
                </div>
                <div class="ml-auto">
                    <slot/>
                </div>
            </v-toolbar-title>
        </v-toolbar>
        
    </div>
</template>

<script>
export default {
    props: {
        title: {
            required: true,
            type: String
        },
        showBack: {
            default: true
        },
        description: {
            required: true,
            type: String
        }
    }
}
</script>