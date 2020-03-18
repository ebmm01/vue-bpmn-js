<template>
    <v-card
        class="ma-4 pa-4 mr-0">
        <div id="canvas"></div>
        <div class="properties-panel-parent"  id="properties"></div>
    </v-card>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler';
import resizeTask from 'bpmn-js-task-resize/lib';
import propertiesPanelModule  from 'bpmn-js-properties-panel'
import propertiesProviderModule  from 'bpmn-js-properties-panel/lib/provider/bpmn'
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
    data: () => ({
        
    }),
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
        ...mapActions(['changeModeler']),
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
        }
    },
    mounted() {
        this.changeModeler(new Modeler({ 
            container: '#canvas',
            additionalModules: [
                resizeTask,
                propertiesPanelModule,
                propertiesProviderModule
            ],
            propertiesPanel: {
                parent: '#properties'
            },
            taskResizingEnabled: true    
        }))
        this.loadDiagram()
    }
}
</script>

<style lang="scss">
#canvas {
    height: 650px;
}
</style>