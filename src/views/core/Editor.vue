<template>
    <section
        id="sample" 
        class="workflow-section"
        style="heigth:100%">

        <div class="workflow-details">
            <page-title 
                :title="workflowName"
                :description="workflowDescription"/>

            <v-tabs 
                @change="updateTabs"
                vertical>
                <v-tab>
                    <v-icon left>mdi-graph</v-icon>
                    Workflow
                </v-tab>
                <v-tab>
                    <v-icon left>mdi-cards-variant</v-icon>
                    Steps
                </v-tab>

                <v-tab>
                    <v-icon left>mdi-toy-brick-outline</v-icon>
                    Components
                </v-tab>
                
                <v-tab-item
                    eager>
                    <workflow-editor
                        :downloadWorkflow="generateJSON"
                        :forceUpdate="forceWorkflowUpdate"/>

                </v-tab-item>
                <v-tab-item
                    eager>
                    <steps 
                        :updateData="stepsDetails"/>

                </v-tab-item>

                <v-tab-item
                    eager>
                    <!-- <components /> -->

                </v-tab-item>
                
            </v-tabs>

            <v-card class="py-4 px-2 d-flex">
                
                <v-btn 
                    href="#"
                    depressed
                    color="primary"
                    class="mx-2"
                    @click="downloadWorkflow" 
                    id="downloadWorkflow">
                    Baixar JSON
                </v-btn>
            </v-card>
        </div>
        <div
            class="workflow-list">
            <!-- <page-title 
                :showBack="false"
                title="Workflow list"
                description=" "/>

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
            </ul> -->
        </div>
    </section>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import { mapState, mapActions} from 'vuex'

export default {
    components: {
        "page-title":PageTitle,
        "workflow-editor": () => import('../workflow/WorkflowEditor'),
        "steps": () => import("../steps/StepsEditor")
    },
    data() {
        return {
            generateJSON: false,
            stepsDetails: 0
        }
    },
    computed: {
        ...mapState([
            'workflowName',
            'workflowData',
            'workflowDescription',
            'steps'
        ])
    },
    methods: {
        downloadWorkflow() {
            this.generateJSON = true
            setTimeout(() => this.generateJSON = false, 200)
            
        },
        updateTabs(tab) {
            this.stepsDetails = tab
        },
        forceWorkflowUpdate() {
            return
        }
    }
}
</script>

<style lang="scss">
.v-tab {
    justify-content: flex-start !important;
}

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

    .workflow-details {
        width: 100%;
        margin-right: 10px;
    }

    .workflow-list {
        width: 350px;
        margin-bottom: 15px;
        border-radius: 5px;
    }
}
</style>