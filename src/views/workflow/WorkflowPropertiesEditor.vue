<template>
    <div 
        id="canvas-details">
        <v-fade-transition mode="out-in">
            <v-expansion-panels
                v-model="panel"
                hover>
                <v-expansion-panel>
                    <v-expansion-panel-header>Step</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p><b>Dados básicos</b></p>
                        <v-text-field
                            class="mr-3"
                            label="Id"
                            v-model="selectedStep.id"
                            placeholder="Insira o id do step">
                        </v-text-field>
                        <v-text-field
                            class="mr-3"
                            label="Nome"
                            @input="updateProperty(selectedStep.name, 'name')"
                            v-model="selectedStep.name"
                            placeholder="Insira o nome do step">
                        </v-text-field>
                        <v-text-field
                            class="mr-3"
                            label="Descrição"
                            v-model="selectedStep.description"
                            placeholder="Insira a descrição do step">
                        </v-text-field>

                        <v-text-field
                            class="mr-3"
                            label="Background"
                            @input="updateProperty(selectedStep.di.fill, 'background')"
                            v-model="selectedStep.di.fill"
                            placeholder="Insira o background">
                        </v-text-field>

                        <v-text-field
                            class="mr-3"
                            label="Borda"
                            v-model="selectedStep.di.stroke"
                            placeholder="Insira a borda">
                        </v-text-field>
                        <v-expand-transition mode="out-in">
                            <div v-if="selectedStep.outgoing && selectedStep.outgoing.length > 1">
                                <p><b>Regras de negócio</b></p>
                                <v-text-field
                                    v-for="item in selectedStep.outgoing"
                                    :key="item.id"
                                    class="mr-3"
                                    :label="`${item.targetRef.name} (${item.targetRef.id})`"
                                    v-model="item.name"
                                    placeholder="Insira o id do step"
                                ></v-text-field>
                            </div>
                        </v-expand-transition>
                        
                        
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>Component</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-fade-transition>
    </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
export default {
    data: () => ({
        panel: 0,
    }),
    computed: {
        ...mapState([
            'modeler',
            'selectedStep'
        ]),
        elementRegistry() {
            return this.modeler.get('elementRegistry');
        },
        targetElement() {
            return this.elementRegistry.get(this.selectedStep.id)
        },
        modeling() {
            return this.modeler.get('modeling');
        }

    },
    methods: {
        ...mapActions([
            'changeModeler',
            'selectStep'
        ]),
        updateProperty(value, property) {
            if (property === 'background') {
                this.modeling.setColor(this.targetElement, {
                    fill: value
                })
            } else {
                this.modeling.updateProperties(this.targetElement, { property: value });
            }
        }
    }
}
</script>