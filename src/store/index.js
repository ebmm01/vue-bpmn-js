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
        modeler: undefined
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
        updateStepComponent: ({commit}, {index, component}) => {
            commit('updateStepComponent', {index, component})
        }
    },
})
