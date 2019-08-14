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
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Registro</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.employeeId" label="Tarjeta"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.departmentKey" label="Departamento"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.taxNumber" label="Cédula"></v-text-field>
                      </v-flex>
                       <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.email" label="Correo"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
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

export default {
  data() {
    return {
      employees: [],
      dialog: false,
      headers: [
        { text: "Tarjeta", sortable: true, value: "employeeId" },
        { text: "Nombre", sortable: true, value: "name" },
        { text: "Departamento", sortable: true, value: "departmentName" },
        { text: "Cédula", sortable: true, value: "taxNumber" },
        { text: "Correo", sortable: true, value: "email" },

        // { text: "Descripcion", value: "descripcion", sortable: false },
        // { text: "Estado", value: "condicion", sortable: false },
        { text: "Opciones", value: "options", sortable: false }

        //     "employeeKey": 1,
        // "employeeId": "1",
        // "departmentKey": 4,
        // "name": "Albert",
        // "taxNumber": null,
        // "officePhone": "1234",
        // "officePhoneExt": "123",
        // "email": "albert@company.com",
        // "mobilePhone": "8094893215",
        // "comments": "Empleado Seguridad",
        // "image": null,
        // "department": null,
        // "visitors": null,
        // "employeeRequests": null
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
    this.getEmployees();
  },
  methods: {
    getEmployees() {
      let me = this;
      axios
        .get("api/Employees/GetEmployees")
        .then(function(response) {
          console.log(response);
          me.employees = response.data;
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