<template>
    <v-dialog
        v-model="show"
        persistent
        width="500">
        <v-card>
            <v-card-title
                color="primary"
                class="headline primary white--text"
                primary-title>
                {{newWf? "Criar workflow" : "Editar workflow"}}
            </v-card-title>

            <v-card-text
                style="heigth: 100%;" 
                class="d-flex flex-column justify-center py-6">
                <v-text-field
                    label="Nome do workflow"
                    v-model="wfName"
                    placeholder="Insira o nome do workflow"
                    :error="invalidName"
                    @input="invalidName = wfName.length === 0">
                </v-text-field>

                <v-text-field
                    label="Descrição do worflow"
                    :error="invalidDescription"
                    @input="invalidDescription = wfDescription.length === 0"
                    placeholder="Insira a descrição do workflow"
                    v-model="wfDescription">
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
                    @click="saveWorkflow">
                    Salvar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
    props: ['show'],
    data() {
        return {
            wfName: "",
            wfDescription: "",
            newWf: false,
            dialog: false,
            invalidName: false,
            invalidDescription: false,
        }
    },
    computed: {
        ...mapState([
            'workflowName',
            'workflowDescription'
        ])
    },
    methods: {
        ...mapActions([
            'changeWorkflowName',
            'changeWorkflowDescription'
        ]),
        closeDialog() {
            this.$emit('closeWorkflowDialogEdit')
        },
        saveWorkflow() {
            if (this.wfName && this.wfDescription) {
                if (this.newWf) {
                    this.$emit('newWorklow', {
                        name: this.wfName,
                        description: this.wfDescription
                    })
                } else {
                    this.changeWorkflowName(this.wfName)
                    this.changeWorkflowDescription(this.wfDescription)
                }
                this.closeDialog()
            } else {
                this.invalidName = true
                this.invalidDescription = true
            }
            
        },
        setDefaultValues({name, wfDescription}, newWf = false) {
            this.wfName = name
            this.wfDescription = wfDescription
            this.newWf = newWf
        }
    }
}
</script>