import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Visitor from "./components/Visitor";
import Employee from "./components/Employee";
import BlackList from "./components/BlackList";
import User from "./components/User";
import EmployeeRequest from "./components/EmployeeRequest";
import Login from "./components/Login";
import store from "./store";

Vue.use(Router);

var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        administrator: true,
        recepionist: true
      }
    },
    {
      path: "/visitors",
      name: "visitors",
      component: Visitor,
      meta: {
        administrator: true,
        recepionist: true
      }
    },
    {
      path: "/visitors/:id",
      name: "visitorId",
      component: Visitor,
      meta: {
        administrator: true,
        recepionist: true
      }
    },
    {
      path: "/employees",
      name: "employees",
      component: Employee,
      meta: {
        administrator: true
      }
    },
    {
      path: "/blacklists",
      name: "blacklists",
      component: BlackList,
      meta: {
        administrator: true
      }
    },
    {
      path: "/users",
      name: "users",
      component: User,
      meta: {
        administrator: true
      }
    },
    {
      path: "/employeerequests",
      name: "employeerequests",
      component: EmployeeRequest,
      meta: {
        administrator: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        free: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.free)) {
    next();
  } else if (store.state.user && store.state.user.role == "administrator") {
    if (to.matched.some(record => record.meta.administrator)) {
      next();
    }
  } else if (store.state.user && store.state.user.role == "recepionist") {
    if (to.matched.some(record => record.meta.recepionist)) {
      next();
    }
  } else {
    next({
      name: "login"
    });
  }
});

export default router;
