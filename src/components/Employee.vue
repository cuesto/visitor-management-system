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
                <v-btn color="green" dark v-on="on">
                  <v-icon left dark>person_add</v-icon>Nuevo Empleado
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
                          label="Tarjeta*"
                          :rules="[rules.required]"
                          v-model="employeeModel.employeeId"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="departments"
                          item-text="description"
                          item-value="departmentKey"
                          v-model="employeeModel.departmentKey"
                          label="Departamento*"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          label="Nombre*"
                          :rules="[rules.required]"
                          v-model="employeeModel.name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          label="Correo*"
                          v-model="employeeModel.email"
                          :rules="[rules.required,rules.email]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Telefono"
                          v-mask="mask"
                          v-model="employeeModel.officePhone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Extensión"
                          hint="Extensión de telefono"
                          v-mask="maskExt"
                          v-model="employeeModel.officePhoneExt"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Celular"
                          v-mask="mask"
                          v-model="employeeModel.mobilePhone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          label="Comentarios"
                          v-model="employeeModel.comments"
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
                  <v-btn color="blue darken-1" text @click="save">
                    <v-icon left>save</v-icon>Guardar
                  </v-btn>
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
          <v-btn color="primary" @click="getEmployees">
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
      maskExt: "####",
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
        required: value => !!value || "Requerido.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Correo Inválido.";
        }
      },
      search: "",
      editedIndex: -1,
      employeeModel: {
        employeeKey: 0,
        employeeId: "",
        name: "",
        departmentKey: 0,
        officePhone: "",
        officePhoneExt: "",
        email: "",
        mobilePhone: "",
        comments: ""
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Empleado" : "Actualizar Empleado";
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
    displayNotification(type, message) {
      this.$swal.fire({
        position: "top-end",
        type: type,
        title: message,
        showConfirmButton: false,
        timer: 3000
      });
    },
    async getEmployees() {
      let me = this;
      await axios
        .get("api/Employees/GetEmployees")
        .then(function(response) {
          me.employees = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },
    async getDepartments() {
      let me = this;
      await axios
        .get("api/Departments/GetDepartments")
        .then(function(response) {
          me.departments = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },
    editItem(item) {
      this.editedIndex = this.employees.indexOf(item);
      this.employeeModel = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.$swal
        .fire({
          title: "¿Está Seguro de Eliminar este empleado?",
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
              .delete("api/Employees/DeleteEmployee/" + item.employeeKey)
              .then(function(response) {
                if (response.data.result == "ERROR") {
                  me.displayNotification("error", response.data.message);
                } else {
                  me.close();
                  me.getEmployees();
                  me.clean();
                  me.displayNotification(
                    "success",
                    "Se eliminó el empleado correctamente."
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
        this.employeeModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    clean() {
      this.employeeModel = {
        employeeKey: 0,
        employeeId: "",
        name: "",
        departmentKey: 0,
        officePhone: "",
        officePhoneExt: "",
        email: "",
        mobilePhone: "",
        comments: ""
      };
    },

    save() {
      if (this.editedIndex > -1) {
        let me = this;
        axios
          .put("api/Employees/PutEmployee", me.employeeModel)
          .then(function(response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              me.close();
              me.getEmployees();
              me.clean();
              me.displayNotification(
                "success",
                "Se actualizó el empleado correctamente."
              );
            }
          })
          .catch(function(error) {
            me.displayNotification("error", error);
          });
      } else {
        let me = this;
        axios
          .post("api/Employees/PostEmployee", me.employeeModel)
          .then(function(response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              me.close();
              me.getEmployees();
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