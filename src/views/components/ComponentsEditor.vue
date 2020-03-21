<template>
    <v-card
        class="ma-4 px-4 py-1">
        <div v-if="!steps.length">
            <h2>
                Nenhum componente encontrado. Por favor adicione steps ao workflow na aba 'workflow' para que os componentes associados possam ser listados.
            </h2>
        </div>
        <div v-else>
            <v-data-table
                :headers="headers"
                :items="steps"
                :items-per-page="-1">
                <template v-slot:item.acoes="{ item }">
                    <v-tooltip 
                        transition="fade-transition"
                        bottom
                        color="secondary">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                @click="openComponentDialogEdit(item.component, item.id)"
                                class="mx-2"
                                color="primary"
                                icon
                                v-on="on"
                                depressed>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <span>Editar step</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </div>
        <component-dialog-edit 
            ref="componentEditDialog"
            @closeComponentDialog="componentDialogEdit = false"
            @saveComponentDialog="updateComponent"
            :show="componentDialogEdit" />
    </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
    components: {
        "component-dialog-edit": () => import('./ComponentDialogEdit')
    },
    data() {
        return {
            componentDialogItem: undefined,
            componentDialogEdit: false,
            headers: [
                { text: 'Nome', value: 'component.name' },
                { text: 'Descrição', value: 'component.description' },
                { text: 'Step associado', value: 'component.relatedStep' },
                { text: 'Tipo', value: 'component.type'},
                { text: 'Alias', value: 'component.alias'},
                { text: 'Ações', value: 'acoes' },
            ],
        }
    },
    computed: {
        ...mapState([
            'steps'
        ])
    }, 
    methods: {
        ...mapActions(['updateStepComponent']),
        openComponentDialogEdit(component, id) {
            component.id = id
            this.$refs.componentEditDialog.loadDefaultValues(component)
            this.componentDialogEdit = true
        },
        updateComponent(updatedComponent) {
            const stepIndex = this.steps.findIndex(item => item.id === updatedComponent.stepId)

            this.updateStepComponent({
                index: stepIndex,
                component: {
                    description: updatedComponent.description,
                    name: updatedComponent.name,
                    type: updatedComponent.type,
                    alias: updatedComponent.alias,
                    relatedStep: updatedComponent.relatedStep
                }
            })

            this.componentDialogEdit = false
        }
    }
}
</script>