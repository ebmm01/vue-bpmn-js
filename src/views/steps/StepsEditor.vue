<template>
    <v-card
        class="ma-4 px-4 py-1">
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
                <!-- 
                <template v-slot:item.existenceConditions="{item}">
                    {{showExistenceConditions(item.childrenSteps)}}
                </template> -->
            </v-data-table>
        </div>
    </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import convert from 'xml-js';

export default {
    data() {
        return {
            stepDialogEdit: false,
            headers: [
                { text: 'Id', value: 'id' },
                { text: 'Nome', value: 'name' },
                { text: 'Descrição', value: 'description' },
                { text: 'Componente', value: 'component.name' },
                { text: 'Condição de avanço:', value: 'advanceConditions'},
                { text: 'ParentSteps', value: 'parentSteps' },
                { text: 'ChildrenSteps', value: 'childrenSteps' },
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
            
            const elementRegistry = this.modeler.get('elementRegistry');
            const elementList = elementRegistry.getAll();	
            const taskList = elementList.filter(elem => elem.type === "bpmn:Task");
            
            taskList.map((item, index) => {
                processSteps.push(this.setStepItem(item, index))
            })
            this.setSteps(processSteps)
        },
        setStepItem(item, index = 1) {
            return {
                id: item.businessObject.id,
                name: item.businessObject.name,
                description: item.businessObject.description,
                advanceConditions: this.getAdvanceConditions(item),
                parentSteps: this.getFamilySteps(item, {source:"sourceRef", target: "targetRef", direction:"incoming"}),
                childrenSteps: this.getFamilySteps(item, {source:"targetRef", target: "sourceRef", direction:"outgoing"}),
                component: this.getStepComponent(item.id, index),
            }
        },
        getFamilySteps(item, {source, target, direction}) {
            if (item.businessObject[direction]) {
                return  item.businessObject[direction].map(item => {
                    if (item[target].$type === "bpmn:Task") {
                        return item[source].id
                    }
                })
            }
        },
        getAdvanceConditions(item) {
            if (item.outgoing && item.outgoing.length > 1) {
                return item.outgoing.map(condition => {
                    return condition.businessObject.name
                })
            }
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
        }
    }
}
</script>