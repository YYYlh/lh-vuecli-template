import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'helloworld',
    component: () => import('../views/helloworld.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
