<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" v-if="logged" app>
      <template>
        <v-list dense>
          <template v-if="isAdmin || isRecep">
            <v-list-item :to="{name:'home'}">
              <v-list-item-action>
                <v-icon>home</v-icon>
              </v-list-item-action>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="isAdmin || isRecep">
            <v-list-item :to="{name:'visitors'}">
              <v-list-item-action>
                <v-icon>person_add</v-icon>
              </v-list-item-action>
              <v-list-item-title>Visitantes</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="isAdmin">
            <v-list-item :to="{name:'employeerequests'}">
              <v-list-item-action>
                <v-icon>today</v-icon>
              </v-list-item-action>
              <v-list-item-title>Solicitudes</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="isAdmin">
            <v-list-item :to="{name:'employees'}">
              <v-list-item-action>
                <v-icon>people</v-icon>
              </v-list-item-action>
              <v-list-item-title>Empleados</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="isAdmin">
            <v-list-item :to="{name:'blacklists'}">
              <v-list-item-action>
                <v-icon>block</v-icon>
              </v-list-item-action>
              <v-list-item-title>Bloqueados</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="isAdmin">
            <v-list-item :to="{name:'users'}">
              <v-list-item-action>
                <v-icon>security</v-icon>
              </v-list-item-action>
              <v-list-item-title>Usuarios</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema de Visitas</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" v-if="logged" text>
        <v-icon>logout</v-icon>Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" v-else text> 
        <v-icon>apps</v-icon>Login
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-footer blue height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0">InfoSocial &copy;2019</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
}
</style>


<script>
export default {
  name: "App",
  data: () => ({
    //
    drawer: null
  }),
  computed: {
    logged() {
      return this.$store.state.user;
    },
    isAdmin() {
      return (
        this.$store.state.user && this.$store.state.user.role == "administrator"
      );
    },
    isRecep() {
      return (
        this.$store.state.user && this.$store.state.user.role == "recepionist"
      );
    }
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {
    logout() {
      this.$store.dispatch("logOut");
    }
  }
};
</script>
