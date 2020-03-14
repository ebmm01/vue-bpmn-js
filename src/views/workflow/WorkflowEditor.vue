<template>
    <v-card
        class="ma-4 pa-4 mr-0">
        <div id="canvas"></div>
    </v-card>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler';
import convert from 'xml-js';
import { mapActions, mapState } from 'vuex'

export default {
    props: {
        downloadWorkflow: {
            default: false
        }
    },
    data: () => ({
        processSteps: []
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

            exportJSON.steps = this.processSteps;
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
        },
        loadDiagram() {

            let result3 = convert.json2xml(this.workflowData, {compact: true})
            result3 = result3.replace('<default>',"")
            result3 = result3.replace('</default>',"")
            this.modeler.importXML(result3  , function(err) {
                if (err) {
                    console.log('error rendering', err);
                } 
            });
        }
    },
    watch: {
        downloadWorkflow: function() {
            if (this.downloadWorkflow) {
                console.log('valor alterado')
                this.generateJSON()
            }
        }
    },
    mounted() {
        this.changeModeler(new Modeler({ container: '#canvas' }))
        this.loadDiagram()
    }
}
</script>

<style lang="scss">
#canvas {
    height: 650px;
}
</style>