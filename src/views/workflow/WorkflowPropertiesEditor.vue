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
                        <p class="primary--text"><b>Dados básicos</b></p>
                        <v-text-field
                            class="mr-3"
                            label="Id"
                             @input="updateProperty(selectedStep.id, 'id')"
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
                             @input="updateProperty(selectedStep.description, 'description')"
                            v-model="selectedStep.description"
                            placeholder="Insira a descrição do step">
                        </v-text-field>

                        <v-text-field 
                            class="mr-3"
                            :value="colorBg === '#fff'? selectedStep.di.fill: colorBg"
                            placeholder="Insira a cor de fundo do step"
                            @click="openColorPickerBg"
                            label="Cor de fundo do step">
                            <template v-slot:append>
                                <v-btn 
                                    v-if="colorPickerBg"
                                    icon
                                    style="height: 30px; width: 30px"
                                    @click="colorPickerBg = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                        </v-text-field>
                        
                        <div id="colorPickerBg" />

                        <v-text-field 
                            class="mr-3"
                            :value="colorStroke === '#fff'? selectedStep.di.stroke: colorStroke"
                            @click="openColorPickerStroke"
                            label="Borda"
                            placeholder="Insira a borda">
                            <template v-slot:append>
                                <v-btn 
                                    v-if="colorPickerStroke"
                                    icon
                                    style="height: 30px; width: 30px"
                                    @click="colorPickerStroke = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                        </v-text-field>

                        <div id="colorPickerStroke" />

                        <v-expand-transition mode="out-in">
                            <div v-if="selectedStep.outgoing && selectedStep.outgoing.length > 1">
                                <p class="primary--text"><b>Regras de negócio</b></p>
                                <v-text-field
                                    v-for="item in selectedStep.outgoing"
                                    :key="item.id"
                                    class="mr-3"
                                    @input="updateProperty(item, 'childrenStep')"
                                    :label="`${item.targetRef.name} (${item.targetRef.id})`"
                                    v-model="item.name"
                                    placeholder="Insira o id do step"
                                ></v-text-field>
                            </div>
                        </v-expand-transition>
                        
                        <v-menu 
                            v-model="colorPickerBg" 
                            bottom=""
                            nudge-bottom="-24"
                            attach="#colorPickerBg"
                            activator="#colorPickerBg"
                            :close-on-content-click="true">
                            <v-card>
                                <v-card-text class="pa-0">
                                    <v-color-picker 
                                        mode="hexa"
                                        hide-inputs
                                        @update:color="updateProperty(colorBg, 'background')"
                                        v-model="colorBg"
                                        flat />
                                </v-card-text>
                            </v-card>
                        </v-menu>

                        <v-menu 
                            v-model="colorPickerStroke" 
                            bottom=""
                            nudge-bottom="-24"
                            attach="#colorPickerStroke"
                            activator="#colorPickerStroke"
                            :close-on-content-click="true">
                            <v-card>
                                <v-card-text class="pa-0">
                                    <v-color-picker 
                                        mode="hexa"
                                        hide-inputs
                                        @update:color="updateProperty(colorStroke, 'border')"
                                        v-model="colorStroke"
                                        flat />
                                </v-card-text>
                            </v-card>
                        </v-menu>

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
        colorPickerBg: false,
        colorPickerStroke: false,
        colorBg: "#fff",
        colorStroke: "#fff"
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
        targetElementBusinessObject() {
            return this.elementRegistry.get(this.selectedStep.id).businessObject
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
            if (property === 'background' || property === 'border') {
                this.modeling.setColor(this.targetElement, {
                    ...(property === 'background' && {fill: value.hexa || value}),
                    ...(property === 'border' && {stroke: value.hexa || value})
                })
                property === 'background'? this.colorBg = value.hexa || value :  this.colorStroke = value.hexa || value;
                this.selectStep(this.targetElementBusinessObject)
            } 
            else if (property === 'childrenStep'){
                const flowSequence = this.elementRegistry.get(value.id);

                this.modeling.updateProperties(flowSequence, { "name": value.name });
            } 
            else {
                this.modeling.updateProperties(this.targetElement, { [property]: value });              
            }
            
        },
        openColorPickerBg() {
            this.colorBg = this.selectedStep.di.fill || this.colorBg
            this.colorPickerBg = true
        },
        openColorPickerStroke() {
            this.colorStroke = this.selectedStep.di.stroke || this.colorStroke
            this.colorPickerStroke = true
        }
    }
}
</script>

<style lang="scss">

#colorPicker {
    width: 100%;
    height: 1px;
}
</style>