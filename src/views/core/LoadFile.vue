<template>
    <section 
        id="loadFile"
        class="d-flex flex-column align-center justify-center">
        <div class="mb-12 mt-n12 text-center">
            <h2>POC - Workflow em JS</h2>
            <h4 class="font-weight-light">Uma poc simples demonstrando o carregamento & criação de um workflow, steps e componentes de maneira gráfica e simples.</h4>
        </div>

        <div class="mt-5 mx-auto">

            <v-dialog
                v-model="dialogLoadAPI"
                scrollable=""
                overflow
                width="500">
                <template v-slot:activator="{ on }">
                    <v-btn
                        color="primary"
                        class="mx-2 my-3"
                        v-on="on">
                        Carregar workflow
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title
                        color="primary"
                        class="headline primary white--text"
                        primary-title>
                        Carregar workflow
                    </v-card-title>

                    <v-card-text
                        style="heigth: 100%;" 
                        class="d-flex flex-column justify-center py-6">
                        <div
                            class="d-flex wfModel-item"
                            v-for="wfModel in wfModelsAPI"
                            :key="wfModel._id">
                            <div>
                                <h4 class="font-weight-regular"><b class="font-weight-bold">Nome:</b> {{wfModel.name}}</h4>
                                <h4 class="font-weight-regular"><b class="font-weight-bold">Id:</b> {{wfModel._id}}</h4>
                            </div>
                            <v-btn
                                color="primary"
                                class="ml-auto"
                                @click="loadWfModelItem(wfModel)">
                                Carregar workflow
                            </v-btn>
                        </div>
                        
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                            color="error"
                            text
                            @click="dialogLoadAPI = false">
                            Cancelar
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog
                v-model="dialogLoad"
                width="500">
                <template v-slot:activator="{ on }">
                    <v-btn
                        color="primary"
                        class="mx-2 my-3"
                        v-on="on">
                        Carregar JSON
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title
                        color="primary"
                        class="headline primary white--text"
                        primary-title>
                        Carregar JSON
                    </v-card-title>

                    <v-card-text
                        style="heigth: 100%;" 
                        class="d-flex flex-column justify-center py-6">
                        <v-file-input 
                            id="loadWorklow"
                            @input="workflowModelInputError = false"
                            @change="loadWorkflowValues"
                            @click:clear="emptyWorkflowValues"
                            label="Insira o modelo do workflow (json)"/>

                        <v-expand-transition>
                            <div v-show="workflowModel">
                                <p class="font-weight-bold">Dados do workflow:</p>
                                <p class="mb-0 "> <span class="font-weight-bold">Nome:</span> {{workflowModel.name}} </p>
                                <p class="mb-0 "> <span class="font-weight-bold">Descrição:</span> {{workflowModel.description || "Nenhuma descrição fornecida"}}</p>
                            </div>
                        </v-expand-transition>
                        
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                            color="error"
                            text
                            @click="dialogLoad = false">
                            Cancelar
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="primary"
                            @click="loadWorkflowData">
                            Continuar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
                
            <v-dialog
                v-model="dialog"
                width="500">
                <template v-slot:activator="{ on }">
                    <v-btn
                        color="primary"
                        class="mx-2 my-3"
                        v-on="on">
                        Criar novo workflow
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title
                        color="primary"
                        class="headline primary white--text"
                        primary-title>
                        Novo workflow
                    </v-card-title>

                    <v-card-text
                        style="heigth: 100%;" 
                        class="d-flex flex-column justify-center py-6">
                        <v-text-field
                            label="Nome do workflow"
                            :error="invalidName"
                            @input="invalidName = wfName.length === 0"
                            placeholder="Insira o nome do workflow"
                            v-model="wfName">
                        </v-text-field>

                        <v-text-field
                            label="Descrição do workflow"
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
                            @click="dialog = false">
                            Cancelar
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="primary"
                            @click="goToWorkflow">
                            Continuar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </section>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import axios from "../../plugins/axios"

export default {
    data() {
        return {
            dialog: false,
            dialogLoad: false,
            dialogLoadAPI: false,
            wfModelsAPI: [],
            wfName: "",
            wfDescription: "",
            invalidName: false,
            invalidDescription: false,
            workflowModel: "",
            workflowModelInputError: false
        }
    },
    computed: {
        ...mapState(['workflowData'])
    },
    methods: {
        ...mapActions([
            'changeWorkflowName', 
            'changeWorkflowDescription',
            'setWorkflowData',
            'setWorkflowId',
            'setSteps'
        ]),
        goToWorkflow() {
            if (this.wfName && this.wfDescription) {
                this.changeWorkflowName(this.wfName)
                this.changeWorkflowDescription(this.wfDescription)
                this.setWorkflowData(undefined);
                this.setSteps([]);
                this.$router.push({path: '/workflow'})
            } else {
                this.invalidName = true
                this.invalidDescription = true
            }
        },
        async loadWorkflowValues() {
            let model = document.getElementById("loadWorklow");
            if (model.files[0]) {
                this.workflowModel = await model.files[0].text()
                this.workflowModel = JSON.parse(this.workflowModel)
            } else {
                this.workflowModel = ""
            }
        },
        emptyWorkflowValues() {
            this.workflowModel = ""
            let model = document.getElementById("loadWorklow");
            model.value = ""
        },
        loadWorkflowData() {
            if (this.workflowModel) {
                this.changeWorkflowName(this.workflowModel.name)
                this.changeWorkflowDescription(this.workflowModel.description)
                this.setWorkflowData(this.workflowModel.modeler);
                this.setSteps(this.workflowModel.steps)
                this.$router.push({path: '/workflow'});
            } else {
                this.workflowModelInputError = true
            }
        },
        loadWfModelItem(wfModel) {
            this.setWorkflowId(wfModel._id);
            this.$router.push({path: '/workflow'});
        },
        async getWfModelsAPI() {
            let response = undefined

            try {
                response = await axios.get('wfmodels')
            } catch(error) {
                response = false
            }

            return  response
        }
    },
    async created() {
        this.changeWorkflowName("")
        this.changeWorkflowDescription("")
        this.setWorkflowData({});
        this.setWorkflowId("");
        this.setSteps({})
        const response = await this.getWfModelsAPI()
        this.wfModelsAPI = response.data;
    }
}
</script>

<style lang="scss">
#loadFile {
    height: 100%;
    justify-content: center;
}
.wfModel-item {
    align-items: center;
    padding: 5px 10px;
    border: 1px solid darkgrey;
    border-radius: 5px;
    margin: 10px -5px;
}
</style>