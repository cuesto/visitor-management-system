<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Sistema de Visitas</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  label="Usuario"
                  name="login"
                  prepend-icon="person"
                  type="text"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  v-on:keyup.enter="login"
                  v-model="password"
                  id="password"
                  label="Contraseña"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-flex class="red--text" v-if="error">{{error}}</v-flex>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="primary" @click="login">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    username: "",
    password: "",
    rules: {
      required: value => !!value || "Requerido."
    },
    error: null
  }),
  methods: {
    login() {
      this.error = null;
      axios
        .post("api/Login/Login", {
          userName: this.username,
          password: this.password
        })
        .then(response => {
          return response.data;
        })
        .then(data => {
          this.$store.dispatch("saveToken", data.token);
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          if (err.response.status == 400) {
            this.error = "No es un usuario válido";
          } else if (err.response.status == 404) {
            this.error = "No existe el usuario o sus datos son incorrectos";
          } else {
            this.error = "Ocurrió un error";
          }
        });
    }
  }
};
</script>