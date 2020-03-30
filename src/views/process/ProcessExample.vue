<template>
    <div class="process-example">
        <v-overlay
            absolute 
            :value="loading">
            <v-progress-circular
                indeterminate
                color="primary" />
        </v-overlay>
        <v-card
            class="process-example-canvas ma-4 pa-4">
            <v-expand-transition>
                <div v-if="errorList.length"> 
                    <v-alert 
                        v-for="error in errorList"
                        :key="error.text"
                        type="error">
                        {{error.title}} - {{error.text}}
                    </v-alert>
                </div>
            </v-expand-transition>
            <div class="process-example-canvas-steps"></div>
            <div id="overlay"></div>
        </v-card>
        <v-card
            class="process-example-advance ma-4 pa-4">
            <v-overlay
                absolute 
                class="pa-4"
                :value="errorList.length">
                Não é possível iniciar a simulação. Por favor resolva os erros listados e tente novamente.
            </v-overlay>

            <v-expand-transition>
                <v-text-field
                    v-if="showStepTextField"
                    label="Condição de avanço"
                    v-model="advanceProcessText"
                    placeholder="Insira a condição de avanço para o step atual" />
            </v-expand-transition>
            <v-btn
                block
                color="primary"
                @click="advanceProcess">
                Avançar processo
            </v-btn>

            <v-btn
                block
                class="my-3"
                color="primary"
                @click="initProcessExample">
                Resetar simulação
            </v-btn>

            <h6 class="mt-4">*O simulador de processos está em fase experimental e pode não funcionar corretamente. Alguns ajustes ainda estão sendo feitos.</h6>
        </v-card>
    </div>
    
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler';
import { mapState, mapActions} from 'vuex'

export default {
    data() {
        return {
            viewer: undefined,
            xmlData: undefined,
            loading: false,
            advanceProcessText: undefined,
            stepsExamples: [],
            currentStep: [],
            errorList: [],
            advanceConditions: [],
            showStepTextField: false,
            finished: false
        }
    },
    computed: {
        ...mapState([
            'modeler'
        ]),
        modeling() {
            return this.viewer.get('modeling');
        },
    },
    methods: {
        async initProcessExample() {
            this.loading = true
            this.modeler.saveXML({ format: true }, (err, xml) => {
                this.xmlData = xml;
            });
            this.viewer.importXML(this.xmlData);
            setTimeout(() => {
                this.getStepsElements();
                this.xmlData = undefined;
                this.loading = false
            },20)

        },
        getStepsElements() {
            this.initializeVariables();
            const elementRegistry = this.viewer.get('elementRegistry');
            const elementList = elementRegistry.getAll();	
            const taskList = elementList.filter(elem => elem.type === "bpmn:Task");
            taskList.map(item => {
                this.getAdvanceConditions(item);

                if (!item.businessObject.incoming) {
                    this.currentStep.push(item)
                }
                this.modeling.setColor(item, {
                    fill: 'white',
                    stroke: 'black' 
                })
                this.stepsExamples.push(item)
            }, this)

            this.validateMultipleStarts();
            this.validadeAdvanceConditions();
            
        },
        validadeAdvanceConditions() {
            const necessaryConditions = this.advanceConditions.length
            const actualConditions = this.advanceConditions.filter(item => !!item).length

            if (necessaryConditions !== actualConditions) {
                this.errorList.push({
                    title: 'Erro ao simular processo!',
                    text: 'Nem todas as condições de avanço necessárias foram fornecidas'
                })
                this.$notify({
                    group: 'foo',
                    type: 'error',
                    title: this.errorList[this.errorList.length-1].title,
                    text: this.errorList[this.errorList.length-1].text
                });
            }
        },
        validateMultipleStarts() {
            if (this.currentStep.length > 1) {
                this.errorList.push({
                    title: 'Erro ao simular processo!',
                    text: 'Multiplas condições de inicio foram encontradas'
                })
                this.$notify({
                    group: 'foo',
                    type: 'error',
                    title: this.errorList[this.errorList.length-1].title,
                    text: this.errorList[this.errorList.length-1].text
                });
            } 
            else if (this.currentStep.length === 1) {
                this.currentStep = this.currentStep[0]
                this.modeling.setColor(this.currentStep, {
                    fill: '#0076FD9D',
                    stroke: 'black' 
                })
            }
        },
        initializeVariables() {
            this.error = {}
            this.stepsExamples = [];
            this.currentStep = [];
            this.errorList = [];
            this.advanceConditions = [];
            this.advanceProcessText = undefined;
            this.showStepTextField = false
            this.finished = false
        },
        getAdvanceConditions(item) {
            if (item.outgoing && item.outgoing.length > 1) {
                return item.outgoing.map(condition => {
                    this.advanceConditions.push(condition.businessObject.name)
                })
            }
        },
        advanceProcess() {
            let nextStepId = []
            if (this.currentStep.businessObject.outgoing) {
                nextStepId = this.currentStep.businessObject.outgoing.map(item => {
                    return item.targetRef.id
                })
            }

            this.showStepTextField = nextStepId.length > 1

            if (nextStepId.length === 1) {
                this.advanceProcessUpdateColor(nextStepId[0])
            } 
            else if (nextStepId.length > 1 ) {
                if (!this.advanceProcessText) {
                    this.$notify({
                        group: 'foo',
                        type: 'error',
                        title: "Condição de avanço não informada",
                        text: "Por favor insira uma condição de avanço válida"
                    });
                    return
                }

                const advanceConditions = this.currentStep.businessObject.outgoing.map(item => {
                    return item.name
                })
                
                if (!advanceConditions.includes(this.advanceProcessText)) {
                    this.$notify({
                        group: 'foo',
                        type: 'error',
                        title: "Condição de avanço inválida",
                        text: "A condição de avanço informada é inválida  para o step atual"
                    });
                    return
                } 
                else {
                    const advanceStepId = this.currentStep.businessObject.outgoing.filter(item => item.name === this.advanceProcessText)
                    this.advanceProcessUpdateColor(advanceStepId[0].targetRef.id)

                }
            } 
            else if (!nextStepId.length ) {
                if (!this.finished) {
                    this.modeling.setColor(this.currentStep, {
                        fill: '#00FF1EB2',
                        stroke: 'black' 
                    })
                    this.finished = true
                    this.$notify({
                        group: 'foo',
                        type: 'success',
                        title: "Processo finalizado",
                        text: "Caso queira você pode reiniciar a simulação."
                    });
                } 
                else {
                    this.$notify({
                        group: 'foo',
                        type: 'error',
                        title: "Processo finalizado",
                        text: "Nao é possível avançar esse processo pois ele já está finalizado."
                    });
                }
            }
        },
        advanceProcessUpdateColor(id) {
            const elementRegistry = this.modeler.get('elementRegistry');
            this.modeling.setColor(this.currentStep, {
                fill: '#00FF1EB2',
                stroke: 'black' 
            })
            this.currentStep = elementRegistry.get(id)
            this.modeling.setColor(this.currentStep, {
                fill: '#0076FD9D',
                stroke: 'black' 
            })
            const nextStepId = this.currentStep.businessObject.outgoing.map(item => {
                return item.targetRef.id
            })

            this.showStepTextField = nextStepId.length > 1
        }
    },
    async mounted() {
        this.viewer = new Modeler({ container: '.process-example-canvas-steps' });
    }
}
</script>

<style lang="scss">
.process-example {
    display: flex;
    width: 100%;

    .process-example-advance {
        width: 350px;
    }

    .process-example-canvas {
        width: 100%;

        #overlay {
            height: 100%;
            width: 100%;
            position: absolute;
            z-index: 1;
            top:0;
            left: 0;
        }

        .process-example-canvas-steps {
            height: 650px;
            
            position: relative;

            .djs-container {
                > svg {
                    transform: matrix(1,0,0,1,0,0.5);
                }
            }
            .djs-palette {
                display: none !important;
            }
            .djs-element.hover .djs-outline,
            .djs-element.selected .djs-outline {
                display: none !important;
                fill: none !important;
                stroke: none !important;
                visibility: hidden !important;
            }
            svg {
                pointer-events: none !important; 
                cursor: default !important;
            }
        }
    }

    
}

</style>