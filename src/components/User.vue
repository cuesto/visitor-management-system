<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="users"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Usuarios</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn color="green" dark v-on="on">
                  <v-icon left dark>person_add</v-icon>Nuevo Usuario
                </v-btn>
              </template>
              <v-form ref="form">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Nombre*"
                            :rules="[rules.required]"
                            v-model="userModel.name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            :items="roles"
                            item-text="description"
                            item-value="roleKey"
                            v-model="userModel.roleKey"
                            label="Rol*"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Correo*"
                            v-model="userModel.email"
                            :rules="[rules.required,rules.email]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Contraseña*"
                            v-model="userModel.password"
                            :type="'password'"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*indica campo requerido.</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Cerrar</v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      <v-icon left>save</v-icon>Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.options="{ item }">
          <v-icon
            size="sm"
            variant="outline-info"
            color="blue"
            class="mr-1"
            @click="editItem(item)"
          >edit</v-icon>
          <v-icon size="sm" color="red" class="mr-1" @click="deleteItem(item)">delete</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="getUsers">
            <v-icon left dark>autorenew</v-icon>Refrescar
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";

export default {
  directives: {
    mask
  },
  data() {
    return {
      mask: "(###)-###-####",
      users: [],
      roles: [],
      dialog: false,
      headers: [
        { text: "Nombre", sortable: true, value: "name" },
        { text: "Role", sortable: true, value: "roleName" },
        { text: "Correo", sortable: false, value: "email" },
        { text: "Opciones", value: "options", sortable: false }
      ],
      rules: {
        required: value => !!value || "Requerido.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Correo Inválido.";
        }
      },
      search: "",
      editedIndex: -1,
      userModel: {
        userKey: 0,
        name: "",
        roleKey: 0,
        email: "",
        password: "",
        isNewPassword: false,
        password_hash: "",
        password_salt: ""
      },
      passwordAnt: ""
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Actualizar Usuario";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.getUsers();
    this.getRoles();
  },
  methods: {
    displayNotification(type, message) {
      this.$swal.fire({
        position: "top-end",
        type: type,
        title: message,
        showConfirmButton: false,
        timer: 3000
      });
    },
    async getUsers() {
      let me = this;
      axios
        .get("api/Users/GetUsers")
        .then(function(response) {
          me.users = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    async getRoles() {
      let me = this;
      axios
        .get("api/Roles/GetRoles")
        .then(function(response) {
          me.roles = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.userModel = Object.assign({}, item);
      this.userModel.password = this.userModel.password_hash;
      this.passwordAnt = this.userModel.password_hash;
      this.dialog = true;
    },

    deleteItem(item) {
      this.$swal
        .fire({
          title: "¿Está Seguro de Eliminar este usuario?",
          text: "¡No será posible revertir el cambio!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "¡Borrar!",
          cancelButtonText: "Cancelar"
        })
        .then(result => {
          if (result.value) {
            let me = this;
            console.log(item);
            axios
              .delete("api/Users/DeleteUser/" + item.userKey)
              .then(function(response) {
                if (response.data.result == "ERROR") {
                  me.displayNotification("error", response.data.message);
                } else {
                  me.close();
                  me.getUsers();
                  me.clean();
                  me.displayNotification(
                    "success",
                    "Se eliminó el usuario correctamente."
                  );
                }
              })
              .catch(function(error) {
                me.displayNotification("error", error);
              });
          }
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.userModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    clean() {
      this.userModel = {
        userKey: 0,
        name: "",
        roleKey: 0,
        email: "",
        password: "",
        isNewPassword: false,
        password_hash: "",
        password_salt: ""
      };
      this.passwordAnt = "";
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          let me = this;
          if (me.userModel.password != me.passwordAnt) {
            me.userModel.isNewPassword = true;
          }

          axios
            .put("api/Users/PutUser", me.userModel)
            .then(function(response) {
              if (response.data.result == "ERROR") {
                me.displayNotification("error", response.data.message);
              } else {
                me.close();
                me.getUsers();
                me.clean();
                me.displayNotification(
                  "success",
                  "Se actualizó el usuario correctamente."
                );
              }
            })
            .catch(function(error) {
              me.displayNotification("error", error);
            });
        } else {
          let me = this;
          me.userModel.isNewPassword = true;
          me.userModel.password_hash = "";
          me.userModel.password_salt = "";
          axios
            .post("api/Users/PostUser", me.userModel)
            .then(function(response) {
              if (response.data.result == "ERROR") {
                me.displayNotification("error", response.data.message);
              } else {
                me.close();
                me.getUsers();
                me.clean();
                me.displayNotification(
                  "success",
                  "Se creó el registro correctamente."
                );
              }
            })
            .catch(function(error) {
              me.displayNotification("error", error);
            });
        }
      }
    }
  }
};
</script>