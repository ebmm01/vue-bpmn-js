<template>
    <v-dialog
        v-model="dialog"
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
        step: {
            required: true
        },
        show: {
            default: false
        }
    },
    data() {
        return {
            dialog: false,
            description: undefined,
            name: undefined,
            localStep: {}
        }
    },
    methods: {
        closeDialog() {
            this.dialog = false
            this.$emit('closeStepDialog')
        },
        saveStep() {
            this.$emit('saveStepDialog', {description: this.description, id: this.step.id})
        },
    },
    watch: {
        show: function() {
            if (this.show) {
                if (this.step) {
                    this.name = this.step.name || "{ Step ainda não nomeado }"
                    this.description = this.step.description === "--" ? "" : this.step.description
                } else {
                    this.description  = ""
                    this.name = ""
                }
                this.dialog = true
            } else {
                this.dialog = false
            }
        }
    }
}
</script>