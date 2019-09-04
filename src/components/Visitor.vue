<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <v-card title="Edit Profile" text="Complete your profile">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md5>
                  <v-text-field
                    :loading="loadingCedulaButton"
                    label="Cédula*"
                    :rules="[rules.required]"
                    v-model="visitorModel.taxNumberVisitor"
                    v-mask="maskCedula"
                    hint="Cédula del visitante"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 md1>
                  <v-tooltip v-model="showTooltip" top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="verifyRNC(visitorModel.taxNumberVisitor)">
                        <v-icon color="green lighten-1">search</v-icon>
                      </v-btn>
                    </template>
                    <span>Verificar en DGII</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    hint="Nombre del Visitante"
                    label="Nombre*"
                    :rules="[rules.required]"
                    v-model="visitorModel.name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    label="Correo*"
                    v-model="visitorModel.email"
                    :rules="[rules.required,rules.email]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field label="Celular" v-mask="mask" v-model="visitorModel.phone"></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-select
                    :items="gender"
                    item-text="text"
                    item-value="value"
                    v-model="visitorModel.gender"
                    label="Género*"
                    :rules="[rules.required]"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md5>
                  <v-text-field
                    v-mask="maskCedula"
                    :loading="loadingRNCButton"
                    label="RNC*"
                    :rules="[rules.required]"
                    v-model="visitorModel.taxNumber"
                    hint="RNC de la Compañía del visitante"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 md1>
                  <v-tooltip v-model="showTooltipRNC" top>
                    <template v-slot:activator="{ ons }">
                      <v-btn icon v-on="ons" @click="verifyRNC(visitorModel.taxNumber)">
                        <v-icon color="green lighten-1">search</v-icon>
                      </v-btn>
                    </template>
                    <span>Verificar en DGII</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    disabled
                    label="Compañía"
                    :rules="[rules.required]"
                    v-model="visitorModel.company"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md8>
                  <v-autocomplete
                    v-model="visitorModel.employeeKey"
                    :items="employees"
                    :rules="[rules.required]"
                    color="blue-grey lighten-2"
                    label="Empleado"
                    item-text="displayAutoComplete"
                    item-value="employeeKey"
                    hint="Tarjeta - Empleado - Departamento"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 md4>
                  <v-select
                    :items="purposes"
                    item-text="description"
                    item-value="purposeKey"
                    v-model="visitorModel.purposeKey"
                    label="Propósito*"
                    :rules="[rules.required]"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    label="Comentarios"
                    v-model="visitorModel.comment"
                    hint="Puede digitar cualquier observación o comentario."
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 text-xs-right>
                  <v-btn class="mx-0 font-weight-light" color="success" @click="save">
                    <v-icon left>save</v-icon>Guardar
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <div class="text-center">
          <v-avatar slot="offset" class="mx-auto d-block" size="130">
            <img src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg" />
          </v-avatar>
          <v-card-text class="text-xs-center">
            <br />
            <v-btn color="success" class="mx-auto d-block">
              <v-icon left>cloud_upload</v-icon>Cargar Foto
            </v-btn>
          </v-card-text>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import router from "../router";

export default {
  directives: {
    mask
  },
  data() {
    return {
      showTooltip: false,
      showTooltipRNC: false,
      loadingRNCButton: false,
      loadingCedulaButton: false,
      maskCedula: "###########",
      mask: "(###)-###-####",
      rules: {
        required: value => !!value || "Requerido.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Correo Inválido.";
        }
      },
      visitorModel: {
        visitorKey: 0,
        name: "",
        taxNumberVisitor: "",
        phone: "",
        email: "",
        company: "",
        taxNumber: "",
        gender: 0,
        image: "",
        purposeKey: 0,
        comment: "",
        employeeKey: 0,
        startDate: new Date(),
        endDate: new Date(),
        employeeRequestKey: 0,
        status: 1
      },
      employees: [],
      purposes: [],
      gender: [
        { text: "Masculino", value: 1 },
        { text: "Femenino", value: 2 },
        { text: "Otro", value: 3 }
      ],
      employeesrequest: []
    };
  },
  created() {
    this.getEmployees();
    this.getPurposes();
    this.loadEmployeeRequest();
  },
  watch: {
    value: {
      handler: function(newValue) {
        if (newValue) {
          console.log(newValue);
          // Utils.mapToObject(newValue, this.visitorModel);
        }
      }
    }
  },
  methods: {
    loadEmployeeRequest() {
      this.id = this.$route.params.id;
      if (this.id != undefined) {
        this.getEmployeesRequest();
      }
    },
    async getEmployeesRequest() {
      let me = this;
      await axios
        .get("api/EmployeeRequests/GetEmployeeRequest/" + this.id)
        .then(function(response) {
          me.employeesrequest = response.data;
          me.setVisitorFromRequest();
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    setVisitorFromRequest() {
      this.visitorModel.name = this.employeesrequest.visitorName;
      this.visitorModel.email = this.employeesrequest.visitorEmail;
      this.visitorModel.phone = this.employeesrequest.visitorPhone;
      this.visitorModel.taxNumber = this.employeesrequest.taxNumber;
      this.visitorModel.company = this.employeesrequest.company;
      this.visitorModel.employeeKey = this.employeesrequest.employeeKey;
      this.visitorModel.purposeKey = this.employeesrequest.purposeKey;
      this.visitorModel.comment = this.employeesrequest.comments;
      this.visitorModel.employeeRequestKey = this.employeesrequest.employeeRequestKey;
    },

    displayNotification(type, message) {
      this.$swal.fire({
        position: "top-end",
        type: type,
        title: message,
        showConfirmButton: false,
        timer: 2500
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
    async getPurposes() {
      let me = this;
      await axios
        .get("api/Purposes/GetPurposes")
        .then(function(response) {
          me.purposes = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    async verifyRNC(rnc) {
      let me = this;
      if (rnc.length == 11) {
        me.loadingCedulaButton = true;
      } else {
        me.loadingRNCButton = true;
      }
      await axios
        .get("api/Services/VerifyRNC/" + rnc)
        .then(function(response) {
          if (rnc.length == 11) {
            me.visitorModel.name = response.data.nombre;
            me.loadingCedulaButton = false;
          } else {
            me.visitorModel.company = response.data.nombre;
            me.loadingRNCButton = false;
          }
          if (response.data.nombre == null)
            me.displayNotification("error", "Cédula/RNC no es válida.");
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    async save() {
      if (this.$refs.form.validate()) {
        let me = this;
        await axios
          .post("api/Visitors/PostVisitor", me.visitorModel)
          .then(function(response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              me.clean();
              me.displayNotification(
                "success",
                "Se actualizó el empleado correctamente."
              );

              if (me.employeesrequest != undefined) {
                me.updateEmployeeRequest();
              }
              router.push({ name: "home" });
            }
          })
          .catch(function(error) {
            me.displayNotification("error", error);
          });
      }
    },

    updateEmployeeRequest() {
      let me = this;
      me.employeesrequest.status = 1;
      axios
        .put("api/EmployeeRequests/PutEmployeeRequest", me.employeesrequest)
        .then(function(response) {
          if (response.data.result == "ERROR") {
            me.displayNotification("error", response.data.message);
          } else {
            console.log("update register");
          }
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    clean() {
      this.visitorModel = {
        visitorKey: 0,
        name: "",
        taxNumberVisitor: "",
        phone: "",
        email: "",
        company: "",
        taxNumber: "",
        gender: 0,
        image: "",
        purposeKey: 0,
        comment: "",
        employeeKey: 0,
        startDate: new Date(),
        endDate: new Date(),
        employeeRequestKey: 0,
        status: 1
      };
    }
  }
};
</script>  
