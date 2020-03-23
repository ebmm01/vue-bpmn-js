<template>
    <v-card
        class="ma-4 px-4 py-1">
        <div v-if="!components.length">
            <h2>
                Nenhum componente encontrado. Por favor adicione steps ao workflow na aba 'workflow' para que os componentes associados possam ser listados.
            </h2>
        </div>
        <div v-else>
            <v-data-table
                :headers="headers"
                :items="components"
                :items-per-page="-1">
            </v-data-table>
        </div>
    </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
    data() {
        return {
            componentDialogItem: undefined,
            componentDialogEdit: false,
            headers: [
                { text: 'Nome', value: 'c_name' },
                { text: 'Descrição', value: 'c_description' },
                { text: 'Step associado', value: 'c_relatedStep' },
                { text: 'Tipo', value: 'c_type'},
                { text: 'Alias', value: 'c_alias'},
                { text: 'QueueConfig', value: 'c_queueConfig' },
            ],
        }
    },
    computed: {
        ...mapState([
            'components',
            'modeler'
        ])
    }, 
    methods: {
        ...mapActions(['setComponents']),
        getComponents() {
            let components = []
            
            const elementRegistry = this.modeler.get('elementRegistry');
            const elementList = elementRegistry.getAll();	
            const taskList = elementList.filter(elem => elem.type === "bpmn:Task");
            
            taskList.map((item, index) => {
                components.push({
                    c_name:item.businessObject.$attrs.c_name,
                    c_description:item.businessObject.$attrs.c_description,
                    c_relatedStep:item.businessObject.$attrs.c_relatedStep,
                    c_type:item.businessObject.$attrs.c_type,
                    c_alias:item.businessObject.$attrs.c_alias,
                    c_queueConfig:item.businessObject.$attrs.c_queueConfig,
                })
            })
            this.setComponents(components)
        }
    }
}
</script>