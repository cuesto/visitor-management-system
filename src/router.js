import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Visitor from './components/Visitor'
import Employee from './components/Employee'
import BlackList from './components/BlackList'
import User from './components/User'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/visitors',
      name: 'visitors',
      component: Visitor
    },
    {
      path: '/employees',
      name: 'employees',
      component: Employee
    },
    {
      path: '/blacklists',
      name: 'blacklists',
      component: BlackList
    },
    {
      path: '/users',
      name: 'users',
      component: User
    }
  ]
})
