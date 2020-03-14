<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="500">
        <v-card>
            <v-card-title
                color="primary"
                class="headline primary white--text"
                primary-title>
                Editar component
            </v-card-title>

            <v-card-text
                style="heigth: 100%;" 
                class="d-flex flex-column justify-center py-6">
                <v-text-field
                    label="Nome"
                    placeholder="Insira o nome do component"
                    v-model="name">
                </v-text-field>
                <v-text-field
                    label="Descrição"
                    placeholder="Insira a descrição do component"
                    v-model="description">
                </v-text-field>
                <v-select
                    :items="componentTypes"
                    item-value="id"
                    item-text="value"
                    v-model="type"
                    label="Tipo"
                ></v-select>
                <v-text-field   
                    label="Alias"
                    :disabled="type !== 'Manual'"
                    :value="type === 'Manual'? alias: alias = ''"
                    :placeholder="type === 'Manual' ? 'Insira o alias do component' : 'Componentes automáticos não possuem alias.'"
                    v-model="alias">
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
        component: {
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
            type: undefined,
            alias: undefined,
            name: undefined,
            componentTypes: [
                "Manual",
                "Server background adicionado por fila",
                "Worker",
                "Robô RPA",
            ],

            localStep: {}
        }
    },
    methods: {
        closeDialog() {
            this.dialog = false
            this.$emit('closeComponentDialog')
        },
        saveStep() {
            this.$emit('saveComponentDialog', {
                name: this.name,
                alias: this.alias,
                type: this.type,
                description: this.description,
                relatedStep: this.component.relatedStep,
                stepId: this.component.id
            })
        },
    },
    watch: {
        show: function() {
            if (this.show) {
                if (this.component) {
                    this.name = this.component.name
                    this.alias = this.component.alias
                    this.type = this.component.type
                    this.description = this.component.description
                } else {
                    this.name = ""
                    this.alias = ""
                    this.type = ""
                    this.description = ""
                }
                this.dialog = true
            } else {
                this.dialog = false
            }
        }
    }
}
</script>