<template>
    <v-card
        class="ma-4 px-4 py-1 mr-0">
        <div v-if="!steps.length">
            <h2>
                Nenhum step encontrado. Por favor adicione steps ao workflow na aba 'workflow'.
            </h2>
        </div>
        <div v-else>
            <v-data-table
                :headers="headers"
                :items="steps"
                :items-per-page="-1">
                <template v-slot:item.parentSteps="{item}">
                    {{showParentStepsId(item.parentSteps)}}
                </template>
                <!-- <template v-slot:item.acoes="{ item }">
                   <div class="step-item-actions">
                        <v-tooltip 
                            transition="fade-transition"
                            bottom
                            color="secondary">
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="openStepDialogEdit(item)"
                                    class="mx-2"
                                    color="primary"
                                    v-on="on"
                                    icon
                                    depressed>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar step</span>
                        </v-tooltip>
                    </div>
                </template> -->
            </v-data-table>
        </div>
        <!-- <step-dialog-edit 
            @closeStepDialog="stepDialogEdit = false"
            @saveStepDialog="updateStepDescription"
            :step="stepDialogItem"
            :show="stepDialogEdit" /> -->
    </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import convert from 'xml-js';

export default {
    data() {
        return {
            headers: [
                { text: 'Nome', value: 'name' },
                { text: 'Descrição', value: 'description' },
                { text: 'Componente', value: 'component.name' },
                { text: 'Condição de existência:', value: 'childrenSteps.conditions'},
                { text: 'ParentSteps', value: 'parentSteps' },
                { text: 'ChildrenSteps', value: 'childrenSteps.id' },
                { text: 'Ações', value: 'acoes' },
            ],
        }
    },
    props: {
        updateData:  {
            default: false
        }
    },
    computed: {
        ...mapState([
            'workflowName',
            'workflowData',
            'workflowDescription',
            'steps',
            'modeler'
        ])
    },
    methods: {
        ...mapActions(['setSteps']),
        getSteps() {
            let steps = undefined
            let processSteps = []
            this.modeler.saveXML({ format: true }, (err, xml) => {
                var result1 = convert.xml2json(xml, {compact: true, spaces: 4});
                steps = JSON.parse(result1)
                steps = steps["bpmn:definitions"]["bpmn:process"]
            });
            
            steps["bpmn:task"].map((item, index) => {
                processSteps.push({
                    id: item._attributes.id,
                    name: item._attributes.name,
                    description: this.getStepDescription(item._attributes.id),
                    parentSteps: this.getParentSteps(item._attributes.id, steps["bpmn:sequenceFlow"]),
                    component: this.getStepComponent(item._attributes.id, index),
                    childrenSteps: this.getChildrenSteps(item._attributes.id, steps["bpmn:sequenceFlow"]),
                })
            })

            this.setSteps(processSteps)
        },
        getStepComponent(id, index) {
            const defaultComponent = {
                name: `Component_${index +1}`,
                description: undefined,
                relatedStep: id,
                type: undefined,
                alias: undefined
            }

            if (this.steps) {
                const stepIndex = this.steps.findIndex(item => item.id === id)
                if (stepIndex !== -1 && this.steps[stepIndex].component) {
                    this.steps[stepIndex].component.relatedStep = id
                    return this.steps[stepIndex].component
                }
            }
            return defaultComponent
        },
        getStepDescription(id) {
            if (this.steps) {
                const stepIndex = this.steps.findIndex(item => item.id === id)
                if (stepIndex !== -1) {
                    return this.steps[stepIndex].description
                }
                return 
            }
            return 
        },
        getParentSteps(id, sequenceFlow) {
            let result = []
            sequenceFlow.map(item => {
                if (item._attributes.targetRef === id) {
                    result.push({
                        id: item._attributes.sourceRef
                    })
                }
            })
            return result
        },
        getChildrenSteps(id, sequenceFlow) {
            let result = []
            let count = sequenceFlow.filter(item => item._attributes.sourceRef === id)
            sequenceFlow.map(item => {
                if (item._attributes.sourceRef === id) {
                    result.push({
                        id: item._attributes.targetRef,
                        ...(count.length > 1? {
                            conditions: item._attributes.name
                        }:{})
                    })
                }
            })
            return result
        },
        showParentStepsId(parentSteps) {
            if (parentSteps[0]) {
                return parentSteps[0].id
            } 
            return
        }
    },
    watch: {
        updateData: function(val) {
            console.log(val)
            if (this.updateData) {
                this.getSteps()
            }
        }
    }
}
</script>