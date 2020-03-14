<template>
    <v-app>
        <v-app-bar
            app
            color="primary"
            dark>
            <div class="d-flex align-center">
                <v-img
                alt="Vuetify Logo"
                class="shrink mr-2"
                contain
                src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                transition="scale-transition"
                width="40"
                />

                <v-img
                alt="Vuetify Name"
                class="shrink mt-1 hidden-sm-and-down"
                contain
                min-width="100"
                src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                width="100"
                />
            </div>

            <v-spacer></v-spacer>

            <v-btn
                href="https://github.com/vuetifyjs/vuetify/releases/latest"
                target="_blank"
                text>
                <span class="mr-2">Latest Release</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

            <div id="canvas"></div>
        <v-content>

            <v-btn @click="getModdle">Acessar</v-btn>
        </v-content>
    </v-app>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler';
var convert = require('xml-js');

export default {
    name: 'App',

    data: () => ({
        modeler: undefined
    }),
    methods: {
        getModdle() {
            console.log(this.modeler)
            

            this.modeler.saveXML({ format: true }, (err, xml) => {
                if (err) {
                return console.error('could not export BPMN 2.0 diagram xml', err);
                }
                const xmlClone = xml;
                var result1 = convert.xml2json(xml, {compact: true, spaces: 4});
                var result2 = convert.xml2json(xml, {compact: false, spaces: 4});
                
                console.log(result1, '\n', result2);
                console.log(xmlClone);
            });
        }
    },
    mounted() {
        var stringS = `<bpmn:definitions id="Definitions_0717aml" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.3.1">
            <bpmn:process id="Process_14kdvgu" isExecutable="false"/>
            <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_14kdvgu"/>
            </bpmndi:BPMNDiagram>
        </bpmn:definitions>`

        let diagram = require("./plugins/diagram")
        let result3 = convert.json2xml(diagram, {compact: true, spaces: 2})
        result3 = result3.replace('<default>',"")
        result3 = result3.replace('</default>',"")

        console.log(result3)
        this.modeler = new Modeler({ container: '#canvas' });
        this.modeler.importXML(result3  , function(err) {

            if (err) {
            console.log('error rendering', err);
            } else {
            console.log('we are good!');
            }
        });
        
    }
};
</script>

<style lang="scss" scoped>
#canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>