<template>
    <section
        id="sample" 
        class="workflow-section"
        style="heigth:100%">

        <v-overlay
            absolute 
            :value="changingWorkflow">
            <v-progress-circular
                indeterminate
                color="primary" />
        </v-overlay>

        <div
            class="workflow-list">
             <page-title 
                :showBack="false"
                title="Lista de workflows"
                description=""> 
                <template v-slot:left>
                    <v-tooltip 
                        transition="fade-transition"
                        bottom
                        color="secondary">
                        <template v-slot:activator="{ on }">
                            <v-btn  
                                href="#"
                                small
                                text
                                class="pa-0 mr-auto"
                                v-on="on"
                                @click="$router.push({path: '/'})">
                                <v-icon color="white">mdi-chevron-left</v-icon>
                            </v-btn>
                        </template>
                        <span>Retornar</span>
                    </v-tooltip>
                </template>

                <v-tooltip 
                    transition="fade-transition"
                    bottom
                    color="secondary">
                    <template v-slot:activator="{ on }">
                        <v-btn  
                            href="#"
                            small
                            text
                            class="pa-0"
                            @click="openWorkflowDialog(true)"
                            v-on="on">
                            <v-icon color="white">mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Criar novo workflow</span>
                </v-tooltip>
             </page-title>
            
            <ul 
                style="list-style:none;"
                class="pl-0">
                <li
                    v-for="wf in workflowList"
                    :key="wf._id"
                    class="wf-list-item d-flex flex-column elevation-2 ma-2 pa-2"
                    :class="{'active': wf._id === workflowId}">
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
                                    @click=" selecWorkflow(wf._id)"
                                    class="mx-2"
                                    color="primary"
                                    v-on="on"
                                    icon
                                    depressed>
                                    <v-icon>{{ wf._id !== workflowId? 'mdi-check-bold' : 'mdi-restore'}}</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ wf._id !== workflowId? "Selecionar workflow": "Reverter alterções"}}</span>
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
                            @click="openWorkflowDialog(false)"
                            id="editWorkflow">
                            <v-icon color="white">mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>Editar workflow</span>
                </v-tooltip>
                <v-dialog
                    v-model="imageDialog">
                    <template v-slot:activator="{ on }">
                        <v-tooltip 
                            v-on="on"
                            transition="fade-transition"
                            bottom
                            color="secondary">
                            <template v-slot:activator="{ on }">
                                <v-btn 
                                    href="#"
                                    icon
                                    v-on="on"
                                    @click="generateImage" 
                                    id="imgWorkflow">
                                    <v-icon color="white">mdi-image-plus</v-icon>
                                </v-btn>
                            </template>
                            <span> Gerar imagem</span>
                        </v-tooltip>
                    </template>

                    <v-card>
                        <v-card-title
                            class="headline primary white--text">
                            Imagem - {{workflowName}}
                        </v-card-title>
                        <div
                            style="position:relative;">
                            <v-overlay
                                absolute 
                                :value="overlay">
                                <v-progress-circular
                                    indeterminate
                                    color="primary" />
                            </v-overlay>
                            <canvas id="canvasImg"></canvas>
                        </div>

                        <v-divider></v-divider>

                        <v-card-actions>    
                            <v-btn
                                color="primary"
                                text
                                @click="imageDialog = false">
                                Sair
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                href="#"
                                color="primary"
                                id="downloadSvg"
                                depressed="">
                                Baixar como SVG
                            </v-btn>
                            <v-btn
                                href="#"
                                color="primary"
                                depressed=""
                                id="downloadPng">
                                Baixar como PNG
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

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
                    <span>{{workflowId? "Salvar alterações": "Salvar workflow"}}</span>
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
                            @click="dialogAbout = true" 
                            id="aboutPoc">
                            <v-icon color="white">mdi-information</v-icon>
                        </v-btn>
                    </template>
                    <span> Sobre a poc</span>
                </v-tooltip>
            </page-title>

            <v-tabs 
                hide-slider 
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
                        @selectedElem="selSelectedElem"
                        ref='wfEditor'/>

                </v-tab-item>
                <v-tab-item
                    reverse-transition="none"
                    transition="none"
                    eager>
                    <steps 
                        ref='stepsEditor'/>

                </v-tab-item>

                <v-tab-item
                    reverse-transition="none"
                    transition="none"
                    eager>
                    <components />

                </v-tab-item>
                
            </v-tabs>
        </div>
        <workflow-dialog-edit 
            ref="workflowEditDialog"
            @newWorklow="newWorkflow"
            @closeWorkflowDialogEdit=" workflowDialogEdit = false"
            :show="workflowDialogEdit" />
        
        <v-dialog
            v-model="dialogAbout"
            width="500">

            <v-card>
                <v-card-title
                class="headline primary white--text">
                Sobre a poc
                </v-card-title>

                <v-card-text class="pt-5">
                    A poc é um exemplo de como facilitar a criação de workflows, steps e componentes.
                    <br/><br/>

                    <b>Pontos planejados:</b>

                    <br/><br/>
                    <span style="text-decoration: line-through;">- Cores nos steps;</span><br/>
                    <span style="text-decoration: line-through;">- Gerenciamento de cor no workflow</span><br/>
                    - Gerenciamento de step no workflow<br/>
                    - Gerenciamento de component no workflow<br/>
                    - Geração de exemplos de avanço de processo<br/>
                    - Melhoria na geração de imagens<br/>
                    - Tradução
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="dialogAbout = false">
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        "workflow-dialog-edit": () => import("../workflow/WorkflowDialogEdit"),
        "components": () => import("../components/ComponentsEditor")
    },
    data() {
        return {
            stepsDetails: 0,
            workflowList: [],
            overlay: false,
            dialogAbout: false,
            imageDialog: false,
            imgSrc: undefined,
            workflowDialogEdit: false,
            changingWorkflow: false,
            stepIdColor: undefined,
            stepColor: undefined,
            selectedElem: undefined
        }
    },
    computed: {
        ...mapState([
            'workflowName',
            'workflowData',
            'workflowDescription',
            'steps',
            'workflowId',
            'modeler'
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
        selSelectedElem(elem) {
            this.stepIdColor = elem.id;
            this.stepColor = elem.businessObject.di.fill;
        },
        updateTabs(tab) {
            if (tab) {
                this.$refs.stepsEditor.getSteps()
            }
        },
        openWorkflowDialog(newWf) {
            this.workflowDialogEdit = true
            this.$refs.workflowEditDialog.setDefaultValues({
                name: newWf? "": this.workflowName,
                wfDescription: newWf? "" : this.workflowDescription
            }, newWf)
        },
        newWorkflow(payload) {
            this.changingWorkflow = true
            setTimeout(() => {
                this.changeWorkflowName(payload.name)
                this.changeWorkflowDescription(payload.description)
                this.setWorkflowId("")
                this.setWorkflowData(undefined);
                this.setSteps([]);
                this.$refs.wfEditor.loadDiagram()
                this.$refs.stepsEditor.getSteps()
                this.changingWorkflow = false
            }, 600)
        },
        async selecWorkflow(id) {
            this.changingWorkflow = true
            await this.updateWorkflowData(id);
            this.changingWorkflow = false
        },
        async deleteWorkflow(id) {
            let response = undefined
            let wfId = id? id : this.workflowId
            try {
                response = await axios.delete(`/wfModel/${wfId}`);

                await this.getWfModelsAPI()

            } catch {
                return
            }
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
        },
        generateImage() {
            this.overlay = true
            this.imageDialog = true
            setTimeout(() => {
                // Gerando imagem
                const canvg = require('canvg-browser'),
                    canvas = document.getElementById('canvasImg');

                const svg = document.querySelector('.djs-container > svg').outerHTML;

                const options = {
                    log: false,
                    ignoreDimensions: false,
                    ignoreMouse: true
                };

                canvg(canvas, svg, options);

                const img = canvas.toDataURL("image/png");
                
                const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
                const svgUrl = URL.createObjectURL(svgBlob);

                const downloadSVGLink = document.getElementById("downloadSvg");
                downloadSVGLink.href = svgUrl;
                downloadSVGLink.download = `${this.workflowName}.svg`
                
                const downloadPNGLink = document.getElementById("downloadPng");
                downloadPNGLink.href = img;
                downloadPNGLink.download = `${this.workflowName}.png`

                this.overlay = false
            }, 500)
        },
        closeImgDialog() {
            this.imageDialog = false
            const downloadSVGLink = document.getElementById("downloadSvg");
            downloadSVGLink.href = "#";
            downloadSVGLink.download = ""
            
            const downloadPNGLink = document.getElementById("downloadPng");
            downloadPNGLink.href = "#";
            downloadPNGLink.download = ""   

            const canvas = document.getElementById("canvasImg");

            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    },
    async created() {
        this.changingWorkflow = true
        await this.getWfModelsAPI()
        if (this.workflowId) {
            await this.updateWorkflowData()
        }
        this.changingWorkflow = false
    }
}
</script>

<style lang="scss">
#canvasImg {
    width: 100%;
    height: 650px;
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
        border-left: 1px solid #1976d2;

        .v-tabs-bar__content {
            background: rgba(0,0,0, 0.1);
            box-shadow: inset 0px 0px 5px darkgrey;

            .v-tab {
                margin-bottom: -1px;
                border-bottom: 1px solid #1976d2;
                transition: 0s;

                &.v-tab--active {
                    background: white;
                    border-radius: 5px 5px 0 0;
                    border-bottom: 1px solid transparent;
                    box-shadow: 0px 0px 5px darkgrey;
                    transition: 0s;
                }
            }
        }
    }

    .workflow-list {
        width: 400px;
        box-shadow: 1px 1px 4px 1px darkgrey;

        .wf-list-item {
            border-radius:  5px;
            border: 2px solid transparent;

            &.active {
                border: 2px solid #1976d2
            }
        }

        .v-toolbar__content {
            padding: 0 !important;
        }
    }
}
</style>