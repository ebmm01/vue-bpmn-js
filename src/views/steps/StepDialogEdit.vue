<template>
    <v-dialog
        v-model="show"
        persistent=""
        width="500">
        <v-card>
            <v-card-title
                color="primary"
                class="headline primary white--text"
                primary-title>
                {{ name }}
            </v-card-title>

            <v-card-text
                style="heigth: 100%;" 
                class="d-flex flex-column justify-center py-6">
                <v-text-field
                    label="Descrição do step"
                    placeholder="Insira a descrição do step"
                    v-model="description">
                </v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                    color="error"
                    text
                    @click="closeDialog">
                    Cancelar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    depressed
                    color="primary"
                    @click="saveStep">
                    Salvar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        show: {
            default: false
        }
    },
    data() {
        return {
            dialog: false,
            description: "",
            id: undefined,
            name: "",
            localStep: {}
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeStepDialog')
        },
        saveStep() {
            this.$emit('saveStepDialog', {description: this.description, id: this.id})
        },
        loadDefaultValues(item) {
            this.id = item.id
            this.name = item.name || "{ Step ainda não nomeado }"
            this.description = item.description === "--" ? "" : item.description
        }
    }
}
</script>