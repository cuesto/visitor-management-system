<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="blacklists"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Bloqueados</v-toolbar-title>
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
                  <v-icon left dark>add</v-icon>Nuevo Registro
                </v-btn>
              </template>

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
                          v-model="blackListModel.name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          label="Cédula*"
                          :rules="[rules.required]"
                          v-mask="mask"
                          v-model="blackListModel.taxNumber"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          v-model="menuStartDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="blackListModel.startDate"
                              label="Fecha Inicio*"
                              prepend-icon="event"
                              readonly
                              :rules="[rules.required]"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="blackListModel.startDate"
                            @input="menuStartDate = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          v-model="menuEndDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="blackListModel.endDate"
                              label="Fecha Fin*"
                              prepend-icon="event"
                              readonly
                              :rules="[rules.required]"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="blackListModel.endDate"
                            @input="menuEndDate = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          label="Comentarios"
                          v-model="blackListModel.comment"
                          hint="Puede digitar cualquier observación o comentario."
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indica campo requerido.</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">Cerrar</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                </v-card-actions>
              </v-card>
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
          <v-btn color="primary" @click="getBlacklists">
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
      rules: {
        required: value => !!value || "Requerido."
      },
      mask: "###-#######-#",
      menuStartDate: false,
      menuEndDate: false,
      blacklists: [],
      dialog: false,
      headers: [
        { text: "Nombre", sortable: true, value: "name" },
        { text: "Cédula", sortable: true, value: "taxNumber" },
        { text: "Fecha Inicio", sortable: true, value: "startDate" },
        { text: "Fecha Fin", sortable: true, value: "endDate" },
        { text: "Comentarios", sortable: false, value: "comment" },
        { text: "Opciones", value: "options", sortable: false }
      ],
      search: "",
      editedIndex: -1,
      blackListModel: {
        blackListKey: 0,
        name: "",
        taxNumber: "",
        startDate: "",
        endDate: "",
        comment: ""
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Actualizar Registro";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.getBlacklists();
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
    getBlacklists() {
      let me = this;
      axios
        .get("api/Blacklists/GetBlackLists")
        .then(function(response) {
          me.blacklists = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    editItem(item) {
      this.editedIndex = this.blacklists.indexOf(item);
      this.blackListModel = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.$swal
        .fire({
          title: "¿Está Seguro de Eliminar este registro?",
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
            axios
              .delete("api/BlackLists/DeleteBlackList/" + item.blackListKey)
              .then(function(response) {
                if (response.data.result == "ERROR") {
                  me.displayNotification("error", response.data.message);
                } else {
                  me.close();
                  me.getBlacklists();
                  me.clean();
                  me.displayNotification(
                    "success",
                    "Se eliminó el registro correctamente."
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
        this.blackListModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    clean() {
      this.blackListModel = {
        blackListKey: 0,
        name: "",
        taxNumber: "",
        startDate: "",
        endDate: "",
        comment: ""
      };
    },

    save() {
      if (this.editedIndex > -1) {
        let me = this;
        axios
          .put("api/BlackLists/PutBlackList", me.blackListModel)
          .then(function(response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              me.close();
              me.getBlacklists();
              me.clean();
              me.displayNotification(
                "success",
                "Se actualizó el registro correctamente."
              );
            }
          })
          .catch(function(error) {
            me.displayNotification("error", error);
          });
      } else {
        let me = this;
        axios
          .post("api/BlackLists/PostBlackList", me.blackListModel)
          .then(function(response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              me.close();
              me.getBlacklists();
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
};
</script>