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
                <v-btn color="primary" dark v-on="on">
                  <v-icon left dark>add</v-icon>Nuevo Registro
                </v-btn>
              </template>

              <v-card>
                <v-card-title>
                  <span class="headline">Bloqueados</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Nombre*" required v-model="editedItem.name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Cédula*" required v-model="editedItem.taxNumber"></v-text-field>
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
                          required
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.startDate"
                              label="Fecha Inicio*"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.startDate"
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
                          required
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.endDate"
                              label="Fecha Fin*"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.endDate" @input="menuEndDate = false"></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          label="Comentarios"
                          v-model="editedItem.comment"
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
                  <v-btn color="blue darken-1" text @click="dialog = false">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.options="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
          <v-icon small @click="deleteItem(item)">delete</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Resetear</v-btn>
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
      editedItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem );
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>