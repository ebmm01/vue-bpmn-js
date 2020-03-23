import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        workflowName: "",
        workflowData: undefined,
        workflowId: "",
        workflowDescription: "",
        steps: [],
        components: [],
        modeler: undefined,
        selectedStep: undefined,
        selectedComponent: undefined,
        propertiesAccordion: 0,
    },
    mutations: {
        changeWorkflowName(state, name) {
            state.workflowName = name
        },
        changeWorkflowDescription(state, description) {
            state.workflowDescription = description
        },
        changeModeler(state, modeler) {
            state.modeler = modeler
        },
        setWorkflowData(state, workflowData) {
            state.workflowData = workflowData
        },
        setWorkflowId(state, workflowId) {
            state.workflowId = workflowId
        },
        setSteps(state, steps) {
            state.steps = steps
        },
        setComponents(state, components) {
            state.components = components
        },
        setPropertiesAcordion(state, propertiesAccordion) {
            state.propertiesAccordion = propertiesAccordion
        },
        selectStep(state, selectedStep) {
            state.selectedStep = selectedStep
        },
        selectComponent(state, selectedComponent) {
            state.selectedComponent = selectedComponent
        },
        updateStepComponent(state, {index, component}) {
            const localStep = state.steps[index];
            localStep.component = component
            state.steps.splice(index, 1, localStep)
        }
    },
    actions: {
        changeWorkflowName: ({commit}, name) => {
            commit('changeWorkflowName', name)
        },
        changeWorkflowDescription: ({commit}, description) => {
            commit('changeWorkflowDescription', description)
        },
        changeModeler: ({commit}, modeler) => {
            commit('changeModeler', modeler)
        },
        setWorkflowData: ({commit}, workflowData) => {
            commit('setWorkflowData', workflowData)
        },
        setWorkflowId: ({commit}, workflowId) => {
            commit('setWorkflowId', workflowId)
        },
        setSteps: ({commit}, steps) => {
            commit('setSteps', steps)
        },
        setComponents: ({commit}, components) => {
            commit('setComponents', components)
        },
        setPropertiesAcordion: ({commit}, propertiesAccordion) => {
            commit('setPropertiesAcordion', propertiesAccordion)
        },
        selectStep: ({commit}, selectStep) => {
            commit('selectStep', selectStep)
        },
        selectComponent: ({commit}, selectComponent) => {
            commit('selectComponent', selectComponent)
        },
        updateStepComponent: ({commit}, {index, component}) => {
            commit('updateStepComponent', {index, component})
        }
    },
})
