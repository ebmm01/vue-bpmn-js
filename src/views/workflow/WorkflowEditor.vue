<template>
    <v-card
        class="ma-4 pa-4">
        <div id="canvas"></div>
        <v-expand-x-transition mode="out-in">
            <workflow-properties-editor
                v-if="selectedStep"/>
        </v-expand-x-transition>
    </v-card>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler';
import resizeTask from 'bpmn-js-task-resize/lib';
import convert from 'xml-js';
import { mapActions, mapState } from 'vuex'

export default {
    props: {
        downloadWorkflow: {
            default: false
        },
        forceUpdate: {
            default: false
        }
    },
    components: {
        "workflow-properties-editor": ()=> import("./WorkflowPropertiesEditor")
    },
    data: () => ({}),
    computed: {
        ...mapState([
            'workflowName',
            'workflowData',
            'workflowDescription',
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
    },
    methods: {
        ...mapActions([
            'changeModeler',
            'selectStep',
            'setWorkflowData',
            'selectComponent',
        ]),
        getModelData(){
            let exportJSON = {};

            this.modeler.saveXML({ format: true }, (err, xml) => {
                const xmlClone = xml;
                exportJSON.modeler = convert.xml2json(xml, {compact: true, trim: true});
            });

            exportJSON.steps = this.steps;
            exportJSON.name = this.workflowName || "Workflow";
            exportJSON.description = this.workflowDescription || "Workflow";

            return exportJSON
        },
        generateJSON() {
            const model = this.getModelData()
            let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(model));
            let downloadWorkflowBtn = document.getElementById('downloadWorkflow');
            downloadWorkflowBtn.href = 'data:'+ data
            downloadWorkflowBtn.download = `${model.name.toLowerCase()}.json`
            setTimeout(() => downloadWorkflowBtn.href = "#", 300)
        },
        loadDiagram() {
            let loadDiagram = undefined
            if (!this.workflowData) {
                loadDiagram = require('../../plugins/emptyDiagram.json')
            } else {
                loadDiagram = this.workflowData
            }

            let importedModel = convert.json2xml(loadDiagram, {compact: true})
            importedModel = importedModel.replace('<default>',"")
            importedModel = importedModel.replace('</default>',"")

            this.modeler.importXML(importedModel);
            
            this.setWorkflowData(undefined)
        },
        setHandlers() {
            const eventBus = this.modeler.get('eventBus');
            const _this = this

            eventBus.on('element.click', (e) =>{
                if (e.element.type === "bpmn:Task") {
                    this.selectStep(e.element.businessObject);
                    this.selectComponent({
                        c_name:e.element.businessObject.$attrs.c_name,
                        c_description:e.element.businessObject.$attrs.c_description,
                        c_relatedStep:e.element.businessObject.$attrs.c_relatedStep,
                        c_type:e.element.businessObject.$attrs.c_type,
                        c_alias:e.element.businessObject.$attrs.c_alias,
                        c_queueConfig:e.element.businessObject.$attrs.c_queueConfig,
                    });
                } else {
                    this.selectStep(undefined);
                    this.selectComponent(undefined);
                }
            });

            eventBus.on('commandStack.shape.create.postExecute', (e) =>{
                if (e.context.shape.type === "bpmn:Task") {
                    const selectedElem = this.elementRegistry.get(e.context.shape.id)
                    const component = {
                        c_name: selectedElem.id.replace("Activity", "Component"),
                        c_description: "",
                        c_relatedStep: selectedElem.id,
                        c_type: "",
                        c_alias: "",
                        c_queueConfig: ""
                    }
                    this.modeling.updateProperties(selectedElem, {...component});
                    this.selectStep(selectedElem.businessObject);
                    this.selectComponent(component);
                } else {
                    this.selectStep(undefined);
                    this.selectComponent(undefined);
                }
            });
            eventBus.on(["shape.remove","shape.delete" ], e => {
                if (e.element.type === "bpmn:Task") {
                    this.selectStep(undefined);
                    this.selectComponent(undefined);
                }
            })
        }
    },
    async mounted() {
        this.changeModeler(new Modeler({ 
            container: '#canvas',
            additionalModules: [
                resizeTask
            ],
            taskResizingEnabled: true    
        }))
        this.loadDiagram()
        this.setHandlers()
    }
}
</script>

<style lang="scss">
#canvas {
    height: 650px;
    width: 100%;
}
#canvas-details {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 350px;
    background: white;
    border-left: 1px solid black;
    border-radius: 0;
    padding: 0 5px;
    overflow-y: auto;
}
.bjs-powered-by {
    left: 15px !important;
    right: unset !important;
}
</style>