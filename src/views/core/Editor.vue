<template>
    <section
        id="sample" 
        class="workflow-section"
        style="heigth:100%">
        <div
            class="workflow-list">
             <page-title 
                :showBack="false"
                title="Workflow list"
                description="ss ">                
             </page-title>
            
            <ul 
                style="list-style:none;"
                class="pl-0">
                <li
                    class="d-flex flex-column elevation-2 ma-2 pa-2"
                    style="border-radius:5px;"
                    v-for="wf in workflowList"
                    :key="wf.id">
                    <div>
                        <p style="font-size:12px" class="mb-0"><b>Nome:</b>  {{wf.name}}</p>
                        <p style="font-size:12px" class="mb-0"><b>Id:</b>  {{wf._id}}</p>
                        <p style="font-size:12px" class="mb-0"><b>Atualizado em:</b>{{toLocaleDate(wf.lastUpdatedAt) }}</p>
                    </div>
                    <div>
                        <v-tooltip 
                            transition="fade-transition"
                            bottom
                            color="secondary">
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="selecWorkflow(wf._id)"
                                    class="mx-2"
                                    color="primary"
                                    v-on="on"
                                    icon
                                    depressed>
                                    <v-icon>mdi-check-bold</v-icon>
                                </v-btn>
                            </template>
                            <span>Selecionar workflow</span>
                        </v-tooltip>
                        
                        <v-tooltip 
                            transition="fade-transition"
                            bottom
                            color="secondary">
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="deleteWorkflow(wf._id)"
                                    class="mx-2"
                                    color="primary"
                                    v-on="on"
                                    icon
                                    depressed>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Remover workflow</span>
                        </v-tooltip>
                    </div>
                </li>
            </ul>
        </div>
        
        <div class="workflow-details">
            <page-title 
                :title="workflowName"
                :description="workflowDescription">
                <v-tooltip 
                    transition="fade-transition"
                    bottom
                    color="secondary">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            href="#"
                            icon
                            v-on="on"
                            @click="downloadWorkflow" 
                            id="downloadWorkflow">
                            <v-icon color="white">mdi-download</v-icon>
                        </v-btn>
                    </template>
                    <span> Baixar workflow</span>
                </v-tooltip>
                <v-tooltip 
                    transition="fade-transition"
                    bottom
                    color="secondary">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            href="#"
                            icon
                            v-on="on"
                            @click="handleWfModelState" 
                            id="saveUpdateWorkflow">
                            <v-icon color="white">{{workflowId? "mdi-content-save-edit": "mdi-content-save"}}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{workflowId? "Atualizar workflow": "Salvar workflow"}}</span>
                </v-tooltip>
            </page-title>

            <v-tabs 
                icons-and-text
                @change="updateTabs">
                <v-tab>
                    Workflow
                    <v-icon left>mdi-google-circles-extended</v-icon>
                </v-tab>
                <v-tab>
                    Steps
                    <v-icon left>mdi-sitemap</v-icon>
                </v-tab>

                <v-tab>
                    Components
                    <v-icon left>mdi-cogs</v-icon>
                </v-tab>
                
                <v-tab-item
                    reverse-transition="none"
                    transition="none"
                    eager>
                    <workflow-editor
                        ref='wfEditor'/>

                </v-tab-item>
                <v-tab-item
                    reverse-transition="none"
                    transition="none"
                    eager>
                    <steps 
                        ref='stepsEditor'
                        :updateData="stepsDetails"/>

                </v-tab-item>

                <v-tab-item
                    reverse-transition="none"
                    transition="none"
                    eager>
                    <components />

                </v-tab-item>
                
            </v-tabs>
        </div>
    </section>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import { mapState, mapActions} from 'vuex'
import axios from "../../plugins/axios"

export default {
    components: {
        "page-title":PageTitle,
        "workflow-editor": () => import('../workflow/WorkflowEditor'),
        "steps": () => import("../steps/StepsEditor"),
        "components": () => import("../components/ComponentsEditor")
    },
    data() {
        return {
            stepsDetails: 0,
            workflowList: []
        }
    },
    computed: {
        ...mapState([
            'workflowName',
            'workflowData',
            'workflowDescription',
            'steps',
            'workflowId'
        ])
    },
    methods: {
        ...mapActions([
            'changeWorkflowName', 
            'changeWorkflowDescription',
            'setWorkflowData',
            'setWorkflowId',
            'setSteps'
        ]),
        downloadWorkflow() {
            this.$refs.wfEditor.generateJSON();
        },
        updateTabs(tab) {
            this.stepsDetails = tab
        },
        selecWorkflow(id) {
            return
        },
        deleteWorkflow(id) {
            return
        },
        toLocaleDate(date) {
            return new Date(date).toLocaleString()
        },
        async handleWfModelState() {
            let response = undefined
            const wfModel = this.$refs.wfEditor.getModelData();
            let wfId = this.workflowId
            // Update
            if (this.workflowId) {
                try {
                    response = await axios.put(`/wfModel/${wfId}`, wfModel)

                    this.$notify({
                        group: 'foo',
                        type: 'success',
                        title: 'Workflow atualizado com sucesso'
                    });
                } catch(error) {
                    this.$notify({
                        group: 'foo',
                        type: 'error',
                        title: 'Ocorreu um erro ao atualizar o workflow',
                        text: error
                    });
                }
            } 
            // create
            else {
                try {
                    response = await axios.post(`/wfModel`, wfModel)
                    this.setWorkflowId(response.data._id)
                    
                    this.$notify({
                        group: 'foo',
                        type: 'success',
                        title: 'Workflow criado com sucesso',
                        text: `Id: ${response._id}`
                    });
                } catch(error) {
                    this.$notify({
                        group: 'foo',
                        type: 'error',
                        title: 'Ocorreu um erro ao atualizar o workflow',
                        text: error
                    });
                }
            }

            await this.getWfModelsAPI()
        },
        async updateWorkflowData(id) {
            let response = undefined
            let wfId = id? id : this.workflowId
            try {
                response = await axios.get(`/wfModel/${wfId}`);
                this.changeWorkflowName(response.data.name)
                this.changeWorkflowDescription(response.data.description)
                this.setWorkflowData(response.data.modeler);
                this.setSteps(response.data.steps)
                this.setWorkflowId(response.data._id)
                this.$refs.wfEditor.loadDiagram()

            } catch {
                return
            }
        },
        async getWfModelsAPI() {
            let response = undefined

            try {
                response = await axios.get('wfmodels')
                this.workflowList = response.data;
            } catch(error) {
                response = false
            }
        }
    },
    async created() {
        await this.getWfModelsAPI()
        if (this.workflowId) {
            await this.updateWorkflowData()
        }
    }
}
</script>

<style lang="scss">
#wfImage {
    object-fit: contain;
    width: 100%;
    max-height: 650px;
}

#SVGArea {
    width: 0px; 
    height: 0px; 
    opacity: 0;

    > svg {
        width: 0px; 
        height: 0px; 
        position: absolute;
        opacity: 0;
        
    }
}

.workflow-section {
    display: flex;
    flex-grow: 1;
    height: 100%;

    .workflow-details {
        width: 100%;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
    }

    .workflow-list {
        width: 400px;
        box-shadow: 1px 1px 4px 1px darkgrey;
    }
}
</style>