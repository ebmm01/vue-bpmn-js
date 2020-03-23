<template>
    <div 
        id="canvas-details">
        <v-fade-transition mode="out-in">
            <v-expansion-panels
                flat
                v-model="propertiesAccordion"
                hover>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        Step
                    </v-expansion-panel-header>
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
                            label="Cor da borda & fonte"
                            placeholder="Insira cor da borda">
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
                        <p class="primary--text"><b>Dados básicos</b></p>

                        <v-text-field
                            label="Nome"
                            placeholder="Insira o nome do component"
                            @input="updateProperty(selectedComponent.c_name, 'c_name')"
                            v-model="selectedComponent.c_name">
                        </v-text-field>
                        <v-text-field
                            label="Descrição"
                            placeholder="Insira a descrição do component"
                            @input="updateProperty(selectedComponent.c_description, 'c_description')"
                            v-model="selectedComponent.c_description">
                        </v-text-field>
                        <v-select
                            :items="componentTypes"
                            item-value="id"
                            item-text="value"
                            @input="updateProperty(selectedComponent.c_type, 'c_type')"
                            v-model="selectedComponent.c_type"
                            label="Tipo"
                        ></v-select>
                        <v-text-field   
                            label="Alias"
                            :disabled="selectedComponent.c_type !== 'Manual'"
                            :value="selectedComponent.c_type === 'Manual'? selectedComponent.c_alias: selectedComponent.c_alias = ''"
                            :placeholder="selectedComponent.c_type === 'Manual' ? 'Insira o alias do component' : 'Componentes automáticos não possuem alias.'"
                            @input="updateProperty(selectedComponent.c_alias, 'c_alias')"
                            v-model="selectedComponent.c_alias">
                        </v-text-field>
                        <v-text-field
                            label="QueueConfig"
                            placeholder="Insira a a configuração de fila do componente"
                            @input="updateProperty(selectedComponent.c_queueConfig, 'c_queueConfig')"
                            v-model="selectedComponent.c_queueConfig">
                        </v-text-field>
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
        colorStroke: "#fff",
        componentTypes: [
            "Manual",
            "Server background adicionado por fila",
            "Worker",
            "Robô RPA",
        ],
    }),
    computed: {
        ...mapState([
            'modeler',
            'selectedStep',
            'selectedComponent',
        ]),
        elementRegistry() {
            return this.modeler.get('elementRegistry');
        },
        targetElement() {
            if (this.selectedStep && this.selectedStep.id) {
                return this.elementRegistry.get(this.selectedStep.id)
            }
            return undefined
        },
        targetElementBusinessObject() {
            if (this.selectedStep && this.selectedStep.id) {
                return this.elementRegistry.get(this.selectedStep.id).businessObject
            }
            return undefined
        },
        modeling() {
            return this.modeler.get('modeling');
        },
        propertiesAccordion: {
            get() {
                return this.$store.state.propertiesAccordion
            },
            set(value) {
                this.$store.dispatch('setPropertiesAcordion', value)
            }
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
            else if (property.includes("c_")) {
                this.modeling.updateProperties(this.targetElement, { [property]: value });
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

#canvas-details {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 350px;
    background: white;
    box-shadow: 4px 0px 9px 1px darkgrey;
    border-radius: 0;
    overflow-y: auto;

}
</style>