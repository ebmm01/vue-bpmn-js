<template>
    <div id="workflow-editor">
        <v-card
            style="overflow:hidden;"
            class="ma-4 pa-4">
            <div 
                @click="contextMenu = false"
                @contextmenu.stop.prevent="showEvents"
                id="canvas"></div>
            <v-expand-x-transition mode="out-in">
                <workflow-properties-editor
                    v-if="selectedStep"/>
            </v-expand-x-transition>
            <v-slide-y-transition >
                <div
                    v-if="contextMenu"
                    class="contextMenu elevation-4"
                    :key="contextMenuPositionComputed"
                    :style="contextMenuPositionComputed">
                    <div
                        v-if="selectedElem">
                        <v-subheader>{{selectedElem.type.replace("bpmn:", "")}}</v-subheader>
                        <a 
                            v-ripple
                            v-if="selectedStep"
                            href="#"
                            @click="startConnect"
                            class="contextMenuItem">
                            <v-icon class="mr-3">mdi-arrow-top-right</v-icon> Conectar elemento
                        </a>
                        <a 
                            id="downloadWf"
                            v-ripple
                            href="#"
                            @click="removeSelectedElements(selectedElem)"
                            class="contextMenuItem">
                            <v-icon class="mr-3">mdi-delete</v-icon> Excluir
                        </a>

                        <hr>
                    </div>
                    <v-subheader>Workflow</v-subheader>
                    <a 
                        id="downloadWf"
                        v-ripple
                        href="#"
                        @click="generateJSON('downloadWf')"
                        class="contextMenuItem">
                        <v-icon class="mr-3">mdi-download</v-icon> Baixar workflow
                    </a>
                    <a 
                        v-ripple
                        href="#"
                        @click="handleEvent('editWf')"
                        class="contextMenuItem">
                        <v-icon class="mr-3">mdi-pencil</v-icon> Editar workflow
                    </a>
                    <a 
                        v-ripple
                        href="#"
                        @click="handleEvent('imageWf')"
                        class="contextMenuItem">
                        <v-icon class="mr-3">mdi-image-plus</v-icon> Gerar imagem
                    </a>
                    <a 
                        v-ripple
                        href="#"
                        @click="handleEvent('processWf')"
                        class="contextMenuItem">
                        <v-icon class="mr-3">mdi-crane</v-icon> Simular Processo
                    </a>
                    
                </div>
            </v-slide-y-transition>
        </v-card>
        <div
            id="canvas-actions">
            <v-btn
                icon
                title="Desfazer"
                @click="undoAction">
                <v-icon>mdi-undo</v-icon>
            </v-btn>
            <v-btn
                icon
                title="Refazer"
                @click="redoAction">
                <v-icon>mdi-redo</v-icon>
            </v-btn>
            <v-btn
                icon
                title="Excluir elemento(s)"
                @click="removeSelectedElements">
                <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
            <v-btn
                icon
                title="Limpar canvas"
                @click="emptyCanvas">
                <v-icon>mdi-layers-off</v-icon>
            </v-btn>
        </div>
            
    </div>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler';
import resizeTask from 'bpmn-js-task-resize/lib';
import convert from 'xml-js';
import { mapActions, mapState } from 'vuex'

export default {
    components: {
        "workflow-properties-editor": ()=> import("./WorkflowPropertiesEditor")
    },
    data: () => ({
        contextMenu: false,
        contextMenuPosition: {},
        selectedElem: undefined,
        webSocket: undefined
    }),
    computed: {
        ...mapState([
            'workflowName',
            'workflowData',
            'workflowDescription',
            'workflowId',
            'steps',
            'modeler',
            'selectedStep'
        ]),
        modeling() {
            return this.modeler.get('modeling');
        },
        elementRegistry() {
            return this.modeler.get('elementRegistry');
        },
        contextMenuPositionComputed() {
            return `top: ${this.contextMenuPosition.y}px; left: ${this.contextMenuPosition.x}px; `
        }
    },
    methods: {
        ...mapActions([
            'changeModeler',
            'selectStep',
            'setWorkflowData',
            'selectComponent',
        ]),
        showEvents(event) {
            const parent = document.getElementById("canvas").getBoundingClientRect()
            this.contextMenuPosition = {
                x: event.pageX - parent.x + 15,
                y: event.pageY - parent.y + 15
            }
            this.contextMenu = true
        },
        handleEvent(event) {
            this.contextMenu = false
            this.$emit(event)
        },
        startConnect(event) {
            this.contextMenu = false
            const connection = this.modeler.get('connect')
            const elem = this.elementRegistry.get(this.selectedStep.id);
            connection.start(event, elem)
        },
        getModelData(){
            let exportJSON = {};

            this.modeler.saveXML({ format: true }, (err, xml) => {
                exportJSON.modeler = convert.xml2json(xml, {compact: true, trim: true});
            });

            exportJSON.steps = this.steps;
            exportJSON.name = this.workflowName || "Workflow";
            exportJSON.description = this.workflowDescription || "Workflow";

            return exportJSON
        },
        generateJSON(id) {
            const model = this.getModelData()
            let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(model));
            let downloadWorkflowBtn = document.getElementById(id || 'downloadWorkflow');
            downloadWorkflowBtn.href = 'data:'+ data
            downloadWorkflowBtn.download = `${model.name.toLowerCase()}.json`
            setTimeout(() => downloadWorkflowBtn.href = "#", 300)
        },
        loadDiagram() {
            let loadDiagram = undefined
            if (!this.workflowData) {
                loadDiagram = require('../../plugins/emptyDiagram.json')
            } else {
                if (typeof this.workflowData === 'string') {
                    loadDiagram = JSON.parse(this.workflowData)
                } 
                else {
                    loadDiagram = this.workflowData
                }
            }
            let importedModel = convert.json2xml(loadDiagram, {compact: true})
            importedModel = importedModel.replace('<default>',"")
            importedModel = importedModel.replace('</default>',"")

            this.modeler.importXML(importedModel, err => {
                if (err) console.log(err)
            });
        },
        setHandlers() {
            const eventBus = this.modeler.get('eventBus');
            const _this = this

            document.addEventListener("keydown", function(event) {
                if (event.key == "Delete") {
                    _this.removeSelectedElements()
                }
                if (event.ctrlKey && event.key === 'z') {
                    _this.undoAction()
                }
            })

            eventBus.on('element.click', (e) =>{
                
                if (e.element.type === "bpmn:Process") {
                    _this.selectedElem = undefined
                    _this.selectStep(undefined);
                    _this.selectComponent(undefined);
                } 
                else {
                    _this.selectedElem = e.element
                    if (e.element.type === "bpmn:Task") {
                        _this.selectStep(e.element.businessObject);
                        _this.selectComponent({
                            c_name:e.element.businessObject.$attrs.c_name,
                            c_description:e.element.businessObject.$attrs.c_description,
                            c_relatedStep:e.element.businessObject.$attrs.c_relatedStep,
                            c_type:e.element.businessObject.$attrs.c_type,
                            c_alias:e.element.businessObject.$attrs.c_alias,
                            c_queueConfig:e.element.businessObject.$attrs.c_queueConfig,
                        });
                    }
                }
            });

            eventBus.on('element.changed', e => {

                if (e.element.type === "bpmn:Task") {
                    _this.notifyUpdateToServer()
                }
            })

            eventBus.on('commandStack.shape.create.postExecute', (e) =>{
                if (e.context.shape.type === "bpmn:Task") {
                    this.notifyUpdateToServer()
                    const selectedElem = this.elementRegistry.get(e.context.shape.id)
                    const component = {
                        c_name: selectedElem.id.replace("Activity", "Component"),
                        c_description: "",
                        c_relatedStep: selectedElem.id,
                        c_type: "",
                        c_alias: "",
                        c_queueConfig: ""
                    }
                    _this.modeling.updateProperties(selectedElem, {...component});
                    _this.selectStep(selectedElem.businessObject);
                    _this.selectComponent(component);
                } else {
                    _this.selectStep(undefined);
                    _this.selectComponent(undefined);
                }
            });

            eventBus.on("shape.remove", e => {
                if (e.element.type === "bpmn:Task") {
                    this.selectStep(undefined);
                    this.selectComponent(undefined);
                }
            })

            
        },
        undoAction() {
            this.modeler.get('commandStack').undo()
        },
        redoAction() {
            this.modeler.get('commandStack').redo()
        },
        removeSelectedElements(elem) {
            let selectedElements = undefined;
            if (elem) {
                selectedElements = [elem]
            } 
            else {
                const selection = this.modeler.get('selection')
                selectedElements = selection.get();
            }
            this.contextMenu = false

            this.modeling.removeElements(selectedElements)
        },
        emptyCanvas() {
            const elements = this.elementRegistry.getAll().slice(1)
            if (elements.length) {
                this.modeling.removeElements(elements)
            }
        },
        async configureWebsocketHandlers() {
            const _this = this
            this.webSocket.onmessage = async msg => {
                const data = JSON.parse(msg.data)

                if (data.type === 'updateWorkflow') {
                    _this.setWorkflowData(data.modelData)
                    await _this.loadDiagram()
                }
            }
        },
        notifyUpdateToServer() {
            const _this = this
            this.modeler.saveXML({ format: true }, (err, xml) => {
                if (err) {
                    console.log(err)
                    return
                }
                const data = convert.xml2json(xml, {compact: true, trim: true});
                _this.webSocket.send(JSON.stringify({
                    modelData: data,
                    type: 'updateWorkflow'
                }))
            });
        },
    },
    async mounted() {
        this.changeModeler(new Modeler({ 
            container: '#canvas',
            additionalModules: [
                resizeTask
            ],
            taskResizingEnabled: true    
        }))
        this.webSocket = new WebSocket('ws://'+process.env.VUE_APP_SERVER_URL+'ws');
        
        this.configureWebsocketHandlers()

        const _this = this
        setTimeout(() => {
            _this.webSocket.send(JSON.stringify({
                addToWorkflow: true,
                modelData: this.workflowData,
                workflowId: this.workflowId
            }))
        }, 500)
        this.loadDiagram()
        this.setHandlers()
    }
}
</script>

<style lang="scss">
#canvas {
    height: 650px;
    width: 100%;
    position: relative;
}

.bjs-powered-by {
    left: 15px !important;
    right: unset !important;
}

.djs-context-pad.open {
    display: none !important;
}

#workflow-editor {
    position: relative;
}

#canvas-actions {
    position: absolute;
    top: 10px;
    left: 52px;
    background: #FAFAFA;
    border: solid 1px #CCC;
    border-radius: 2px;
    height: 45px;
    display: flex;
    align-items: center;

    .v-btn {
        .v-icon {
            color: rgb(0, 0, 0);
        }
        &::before {
            content: unset;
        }
        &:hover {
            .v-icon {
                color: rgb(255, 116, 0);
            }
        }
    }
}

.contextMenu {
    position: absolute;
    width: 230px;
    background: white;

    .contextMenuItem {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 15px;
        text-decoration: none;
        transition: all 0.15s ease;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;

        &:hover {
            background: rgba(0, 0, 0, 0.2);

        }
    }

    .v-subheader {
        height: 40px !important;
    }
}
</style>