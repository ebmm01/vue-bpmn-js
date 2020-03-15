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
                <slot name="left"/>
                <div class="d-flex">
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