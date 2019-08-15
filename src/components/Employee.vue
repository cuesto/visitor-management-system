<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="employees"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Empleados</v-toolbar-title>
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
                  <v-icon left dark>person_add</v-icon>Nuevo Empleado
                </v-btn>
              </template>

              <v-card>
                <v-card-title>
                  <span class="headline">Empleado</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Tarjeta*" required v-model="editedItem.employeeId"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="departments"
                          item-text="description"
                          item-value="departmentKey"
                          v-model="editedItem.departmentKey"
                          label="Departamento*"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Nombre*" required v-model="editedItem.name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          label="Correo*"
                          required
                          v-model="editedItem.email"
                          :rules="[ rules.email]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Telefono"
                          v-mask="mask"
                          v-model="editedItem.officePhone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Extensión"
                          hint="Extensión de telefono"
                          v-model="editedItem.officePhoneExt"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Celular"
                          v-mask="mask"
                          v-model="editedItem.mobilePhone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          label="Comentarios"
                          v-model="editedItem.comments"
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
      mask: "(###)-###-####",
      employees: [],
      departments: [],
      dialog: false,
      headers: [
        { text: "Tarjeta", sortable: true, value: "employeeId" },
        { text: "Nombre", sortable: true, value: "name" },
        { text: "Departamento", sortable: true, value: "departmentName" },
        { text: "Extensión", sortable: true, value: "officePhoneExt" },
        { text: "Correo", sortable: true, value: "email" },
        { text: "Celular", sortable: true, value: "mobilePhone" },
        { text: "Opciones", value: "options", sortable: false }
      ],
      rules: {
          
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Correo Inválido.'
          },
        },
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
    this.getEmployees();
    this.getDepartments();
  },
  methods: {
    getEmployees() {
      let me = this;
      axios
        .get("api/Employees/GetEmployees")
        .then(function(response) {
          me.employees = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getDepartments() {
      let me = this;
      axios
        .get("api/Departments/GetDepartments")
        .then(function(response) {
          console.log(response);
          me.departments = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    editItem(item) {
      this.editedIndex = this.employees.indexOf(item);
      this.editedItem = Object.assign({}, item);
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