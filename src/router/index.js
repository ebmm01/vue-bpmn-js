import Vue from 'vue'
import VueRouter from 'vue-router'
import Loadfile from '../views/core/LoadFile'
import store from "../store"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'loadfile',
        component: Loadfile
    },
    {
        path: '/workflow',
        name: 'workflow',
        component: () => import("@/views/core/Editor")
    }
]

const router = new VueRouter({
    routes
})

export default router
