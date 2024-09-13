<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <v-card title="Edit Profile" text="Complete your profile">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md5>
                  <v-text-field ref="taxNumberField" :loading="loadingCedulaButton" label="Cédula*"
                    :rules="[rules.required]" v-model="visitorModel.taxNumberVisitor" v-mask="maskCedula"
                    hint="Cédula del visitante"
                    @keyup.enter="verifyCedula(visitorModel.taxNumberVisitor)"></v-text-field>
                </v-flex>
                <v-flex xs1 md1>
                  <v-tooltip v-model="showTooltip" top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="verifyCedula(visitorModel.taxNumberVisitor)">
                        <v-icon color="green lighten-1">search</v-icon>
                      </v-btn>
                    </template>
                    <span>Verificar en base de datos</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field hint="Nombre del Visitante" label="Nombre*" :rules="[rules.required]"
                    v-model="visitorModel.name"></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field label="Correo" v-model="visitorModel.email"></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field label="Celular" v-mask="mask" v-model="visitorModel.phone"></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-select :items="gender" item-text="text" item-value="value" v-model="visitorModel.gender"
                    label="Género*" :rules="[rules.required]"></v-select>
                </v-flex>
                <v-flex xs12 md5>
                  <v-text-field v-mask="maskCedula" :loading="loadingRNCButton" label="RNC"
                    v-model="visitorModel.taxNumber" hint="RNC de la Compañía del visitante"></v-text-field>
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
                  <v-text-field disabled label="Compañía" v-model="visitorModel.company"></v-text-field>
                </v-flex>
                <v-flex xs12 md8>
                  <v-autocomplete v-model="visitorModel.employeeKey" :items="employees" :rules="[rules.required]"
                    color="blue-grey lighten-2" label="Empleado*" item-text="displayAutoComplete"
                    item-value="employeeKey" hint="Tarjeta - Empleado - Departamento"></v-autocomplete>
                </v-flex>
                <v-flex xs12 md4>
                  <v-select :items="purposes" item-text="description" item-value="purposeKey"
                    v-model="visitorModel.purposeKey" label="Propósito*" :rules="[rules.required]"></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Comentarios" v-model="visitorModel.comment"
                    hint="Puede digitar cualquier observación o comentario."></v-textarea>
                </v-flex>
                <v-flex xs12 md4 text-xs-right>
                  <div style="display: flex; gap: 10px;">
                    <v-btn class="mx-0 font-weight-light" color="success" @click="save">
                      <v-icon left>save</v-icon>Guardar
                    </v-btn>
                    <v-btn class="mx-0 font-weight-light" color="primary" @click="saveAndContinue">
                      <v-icon left>save</v-icon>Guardar y Continuar Agregando
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
      </v-flex>
      <v-flex xs12 md4></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import router from "../router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import VisitorModel from "../models/VisitorModel";

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
      visitorModel: new VisitorModel(),
      employees: [],
      purposes: [],
      gender: [
        { text: "Masculino", value: 1 },
        { text: "Femenino", value: 2 },
        { text: "Otro", value: 3 }
      ],
      employeesrequest: null,
      continueAdding: false,
    };
  },
  created() {
    this.getEmployees();
    this.getPurposes();
    this.loadEmployeeRequest();
  },
  mounted() {
    this.$refs.taxNumberField.focus();
  },
  watch: {
    value: {
      handler: function (newValue) {
        if (newValue) {
          if (newValue) this.$refs.form.resetValidation();
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
        .then(function (response) {
          me.employeesrequest = response.data;
          me.setVisitorFromRequest();
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
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
        .then(function (response) {
          me.employees = response.data;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },
    async getPurposes() {
      let me = this;
      await axios
        .get("api/Purposes/GetPurposes")
        .then(function (response) {
          me.purposes = response.data;
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },

    async verifyCedula(cedula) {
      let me = this;
      me.loadingCedulaButton = true;
      await axios
        .get("api/Visitors/GetVisitorByCedula/" + cedula)
        .then(function (response) {
          me.loadingCedulaButton = false;
          if (response == null || response == undefined) {
            me.displayNotification("error", "Cédula/RNC no es válida.");
            return;
          }
          me.visitorModel.name = response.data.name;
          me.visitorModel.email = response.data.email;
          me.visitorModel.phone = response.data.phone;
          me.visitorModel.gender = response.data.gender;
          me.visitorModel.taxNumber = response.data.taxNumber;
          me.visitorModel.company = response.data.company;
          me.visitorModel.employeeKey = response.data.employeeKey;
          me.visitorModel.purposeKey = response.data.purposeKey;
        })
        .catch(function (error) {
          if (error.message == "Request failed with status code 404") {
            me.displayNotification("warning", "Cédula no encontrada en la base de datos.");
          } else {

            me.displayNotification("error", error.message);
          }
          me.loadingCedulaButton = false;
        });
    },

    async verifyRNC(rnc) {
      let me = this;
      me.loadingRNCButton = true;
      await axios
        .get("api/Services/VerifyRNC/" + rnc)
        .then(function (response) {
          me.visitorModel.company = response.data.nombre;
          me.loadingRNCButton = false;
          if (response.data.nombre == null)
            me.displayNotification("error", "Cédula/RNC no es válida.");
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },

    saveAndContinue() {
      this.continueAdding = true;
      this.save();
    },

    async save() {
      if (this.$refs.form.validate()) {
        let me = this;
        me.visitorModel.CreatedBy = this.$store.state.user.name;
        me.visitorModel.Created = new Date();
        await axios
          .post("api/Visitors/PostVisitor", me.visitorModel)
          .then(function (response) {
            if (response.data.result == "ERROR") {
              me.displayNotification("error", response.data.message);
            } else {
              if (me.visitorModel.employeeRequestKey > 0) {
                me.updateEmployeeRequest();
              }
              //me.sendSMS(response.data.visitorKey);
              if (me.continueAdding) {
                me.visitorModel.taxNumberVisitor = "";
                me.visitorModel.name = "";
              } else {
                me.clean();
                router.push({ name: "home" });
              }
              me.displayNotification(
                "success",
                "Se creó la visita correctamente."
              );
            }
          })
          .catch(function (error) {
            me.displayNotification("error", error.message);
            me.continueAdding = false;
          });
      }
    },

    sendSMS(visitorKey) {
      let me = this;
      console.log(visitorKey)
      axios
        .post("api/Visitors/SendSMS/" + visitorKey)
        .then(function (response) {
          if (response.data.result == "ERROR") {
            me.displayNotification("error", response.data.message);
          } else {
            console.log("SMS Sent");
          }
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },

    updateEmployeeRequest() {
      let me = this;
      me.employeesrequest.status = 1;
      me.employeesrequest.ModifiedBy = this.$store.state.user.name;
      axios
        .put("api/EmployeeRequests/PutEmployeeRequest", me.employeesrequest)
        .then(function (response) {
          if (response.data.result == "ERROR") {
            me.displayNotification("error", response.data.message);
          } else {
            console.log("update register");
          }
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
    },

    clean() {
      this.visitorModel = new VisitorModel();
    }
  }
};
</script>
