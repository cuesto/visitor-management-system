<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="employeerequest"
        sort-by="employeeRequestKey"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Solicitudes de Visitas</v-toolbar-title>
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
            <v-btn style="margin-right: 10px" @click="showUploadModal" color="blue" dark>
              <v-icon left dark>cloud_upload</v-icon>Cargar
            </v-btn>
            <v-dialog v-model="dialog" persistent max-width="auto">
              <template v-slot:activator="{ on }">
                <v-btn color="green" dark v-on="on">
                  <v-icon left dark>add</v-icon>Nueva Solicitud
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
                        <v-col cols="7">
                          <v-autocomplete
                            v-model="employeeRequestModel.employeeKey"
                            :items="employees"
                            :rules="[rules.required]"
                            color="blue-grey lighten-2"
                            label="Empleado*"
                            item-text="displayAutoComplete"
                            item-value="employeeKey"
                            hint="Tarjeta - Empleado - Departamento"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="2">
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
                                v-model="employeeRequestModel.startDate"
                                label="Fecha Inicio*"
                                prepend-icon="event"
                                readonly
                                :rules="[rules.required]"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="employeeRequestModel.startDate"
                              @input="menuStartDate = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="2">
                          <v-menu
                            ref="starttimemenu"
                            v-model="menuStartTime"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="employeeRequestModel.startTime"
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="employeeRequestModel.startTime"
                                label="Hora Inicio*"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                                v-mask="maskDate"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="menuStartTime"
                              v-model="employeeRequestModel.startTime"
                              full-width
                              @click:minute="$refs.starttimemenu.save(employeeRequestModel.startTime)"
                            ></v-time-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            hint="Nombre del Visitante"
                            label="Nombre*"
                            :rules="[rules.required]"
                            v-model="employeeRequestModel.visitorName"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field label="Correo" v-model="employeeRequestModel.visitorEmail"></v-text-field>
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="2">
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
                                v-model="employeeRequestModel.endDate"
                                label="Fecha Fin*"
                                prepend-icon="event"
                                readonly
                                :rules="[rules.required]"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="employeeRequestModel.endDate"
                              @input="menuEndDate = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="2">
                          <v-menu
                            ref="endtimemenu"
                            v-model="menuEndTime"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="employeeRequestModel.endTime"
                            transition="scale-transition"
                            offset-y
                            full-width
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="employeeRequestModel.endTime"
                                label="Hora Fin*"
                                prepend-icon="access_time"
                                readonly
                                v-on="on"
                                v-mask="maskDate"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="menuEndTime"
                              v-model="employeeRequestModel.endTime"
                              full-width
                              @click:minute="$refs.endtimemenu.save(employeeRequestModel.endTime)"
                            ></v-time-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            label="Telefono"
                            v-mask="mask"
                            v-model="employeeRequestModel.visitorPhone"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-select
                            :items="purposes"
                            item-text="description"
                            item-value="purposeKey"
                            v-model="employeeRequestModel.purposeKey"
                            label="Propósito*"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="4" v-if="!displayRepeat" />
                        <v-col cols="4" v-if="displayRepeat">
                          <v-switch v-model="repeat" :label="`Visita Recurrente`"></v-switch>
                          <template v-if="repeat">
                            <v-row justify="space-around">
                              <v-checkbox v-model="days.mon" class="mx-2" label="L"></v-checkbox>
                              <v-checkbox v-model="days.tue" class="mx-2" label="M"></v-checkbox>
                              <v-checkbox v-model="days.wed" class="mx-2" label="X"></v-checkbox>
                              <v-checkbox v-model="days.thu" class="mx-2" label="J"></v-checkbox>
                              <v-checkbox v-model="days.fri" class="mx-2" label="V"></v-checkbox>
                              <v-checkbox v-model="days.sat" class="mx-2" label="S"></v-checkbox>
                              <v-checkbox v-model="days.sun" class="mx-2" label="D"></v-checkbox>
                            </v-row>
                          </template>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            :loading="loadingRNCButton"
                            label="RNC*"
                            :rules="[rules.required]"
                            v-model="employeeRequestModel.taxNumber"
                            hint="RNC de la Compañía del visitante"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="1">
                          <v-tooltip v-model="showTooltip" top>
                            <template v-slot:activator="{ on }">
                              <v-btn icon v-on="on" @click="verifyRNC">
                                <v-icon color="green lighten-1">search</v-icon>
                              </v-btn>
                            </template>
                            <span>Verificar en DGII</span>
                          </v-tooltip>
                        </v-col>
                        <v-col cols="3">
                          <v-textarea
                            :rows="2"
                            disabled
                            label="Compañía"
                            v-model="employeeRequestModel.company"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="7">
                          <v-textarea
                            label="Comentarios"
                            v-model="employeeRequestModel.comments"
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
          <v-btn color="primary" @click="getEmployeeRequests">
            <v-icon left dark>autorenew</v-icon>Refrescar
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="uploadModal" max-width="500px">
      <v-card>
        <v-card-text>
          <template>
            <v-file-input v-model="file" accept="file/*.csv" label="Cargar Plantilla"></v-file-input>
            <v-btn @click="UploadEmployeeRequest()" color="blue" dark>
              <v-icon left>cloud_upload</v-icon>Cargar
            </v-btn>
            <v-btn @click="hideUploadModal()" color="blue darken-1" text>Cancelar</v-btn>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import Papa from "papaparse";

export default {
  directives: {
    mask
  },
  data() {
    return {
      fileProcessed: null,
      file: null,
      uploadModal: false,
      loadingRNCButton: false,
      showTooltip: false,
      days: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
      },
      displayRepeat: true,
      repeat: false,
      mask: "(###)-###-####",
      maskDate: "##:##",
      menuStartDate: false,
      menuEndDate: false,
      menuStartTime: false,
      menuEndTime: false,
      employeerequest: [],
      employees: [],
      purposes: [],
      dialog: false,
      headers: [
        { text: "Nombre", sortable: true, value: "visitorName" },
        { text: "Compañía", sortable: true, value: "company" },
        { text: "Teléfono", sortable: true, value: "visitorPhone" },
        { text: "Fecha Esperada", sortable: true, value: "startDate" },
        { text: "Fecha Salida", sortable: true, value: "endDate" },
        { text: "Propósito", sortable: true, value: "purposeDescription" },
        {
          text: "Empleado(Quién lo recibirá)",
          sortable: true,
          value: "employeeName"
        },
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
      employeeRequestModel: {
        employeeRequestKey: 0,
        employeeKey: 0,
        visitorName: "",
        visitorEmail: "",
        visitorPhone: "",
        taxNumber: "",
        company: "",
        purposeKey: 0,
        startDate: "",
        startTime: null,
        endDate: "",
        endTime: null,
        comments: "",
        status: 0,
        employeeName: "",
        purposeDescription: "",
        daysList: ""
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva Solicitud"
        : "Actualizar Solicitud";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
      if (this.$refs.form != undefined) this.$refs.form.resetValidation();
    },
    repeat(val) {
      if (!val) this.cleanDays();
    }
  },

  created() {
    this.getEmployeeRequests();
    this.getEmployees();
    this.getPurposes();
  },
  methods: {
    UploadEmployeeRequest() {
      if (this.file == null) {
        this.displayNotification(
          "error",
          "El archivo es de un formato incorrecto o no se ha cargado."
        );
        return;
      }

      let me = this;

      Papa.parse(this.file, {
        header: true,
        complete: function(results) {
          me.fileProcessed = results.data;
          var employeeRequestList = results.data.map(a => {
            return {
              employeeRequestKey: 0,
              employeeKey: me.findEmployeeKey(
                me.employees.find(b => {
                  if (b.employeeId == a.TarjetaEmpleado) {
                    return b.employeeKey;
                  }
                })
              ),
              visitorName: a.Visitante,
              visitorEmail: a.Email,
              visitorPhone: a.Telefono,
              taxNumber: a.RNCVisitante,
              company: a.Empresa,
              purposeKey: me.findPurposeKey(
                me.purposes.find(b => {
                  if (b.description == a.Proposito) {
                    return b.purposeKey;
                  }
                })
              ),
              startDate: a.FechaInicio,
              startTime: a.HoraInicio,
              endDate: a.FechaFin,
              endTime: a.HoraFin,
              comments: a.Comentarios,
              status: 0,
              employeeName: "",
              purposeDescription: "",
              daysList: ""
            };
          });

          employeeRequestList = employeeRequestList.filter(
            x => x.employeeKey != undefined
          );

          console.log(employeeRequestList);

          let header = { Authorization: "Bearer " + me.$store.state.token };
          let conf = { headers: header };
          axios
            .post(
              "api/EmployeeRequests/PostEmployeeRequests",
              employeeRequestList,
              conf
            )
            .then(function(response) {
              if (response.data.result == "ERROR") {
                me.displayNotification("error", response.data.message);
              } else {
                me.uploadModal = false;
                me.getEmployeeRequests();
                me.clean();
                me.displayNotification(
                  "success",
                  "Se cargaron los registros correctamente."
                );
              }
            })
            .catch(function(error) {
              me.displayNotification("error", error);
            });
        }
      });
    },

    findEmployeeKey(employee) {
      if (employee != undefined) return employee.employeeKey;
    },

    findPurposeKey(purpose) {
      if (purpose != undefined) return purpose.purposeKey;
    },

    showUploadModal() {
      this.uploadModal = true;
    },
    hideUploadModal() {
      this.uploadModal = false;
      this.file = null;
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
    async getEmployeeRequests() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let conf = { headers: header };
      await axios
        .get("api/EmployeeRequests/GetEmployeeRequests", conf)
        .then(function(response) {
          me.employeerequest = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },
    async getEmployees() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let conf = { headers: header };
      await axios
        .get("api/Employees/GetEmployees", conf)
        .then(function(response) {
          me.employees = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },
    async getPurposes() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let conf = { headers: header };
      await axios
        .get("api/Purposes/GetPurposes", conf)
        .then(function(response) {
          me.purposes = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    async verifyRNC() {
      let me = this;
      me.loadingRNCButton = true;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let conf = { headers: header };
      await axios
        .get(
          "api/Services/VerifyRNC/" + me.employeeRequestModel.taxNumber,
          conf
        )
        .then(function(response) {
          me.employeeRequestModel.company = response.data.nombre;
          me.loadingRNCButton = false;
          if (response.data.nombre == null)
            me.displayNotification("error", "El RNC/Cédula es inválido.");
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    editItem(item) {
      this.editedIndex = this.employeerequest.indexOf(item);
      this.employeeRequestModel = Object.assign({}, item);
      this.editedIndex > -1
        ? (this.displayRepeat = false)
        : (this.displayRepeat = true);
      this.dialog = true;
    },

    deleteItem(item) {
      this.$swal
        .fire({
          title: "¿Está Seguro de Eliminar esta solicitud?",
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
            let header = { Authorization: "Bearer " + this.$store.state.token };
            let conf = { headers: header };
            axios
              .delete(
                "api/EmployeeRequests/DeleteEmployeeRequest/" +
                  item.employeeRequestKey,
                conf
              )
              .then(function(response) {
                if (response.data.result == "ERROR") {
                  me.displayNotification("error", response.data.message);
                } else {
                  me.close();
                  me.getEmployeeRequests();
                  me.clean();
                  me.displayNotification(
                    "success",
                    "Se eliminó la solicitud correctamente."
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
      this.clean();
      this.cleanDays();
      setTimeout(() => {
        this.employeeRequestModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    clean() {
      this.employeeRequestModel = {
        employeeRequestKey: 0,
        employeeKey: 0,
        visitorName: "",
        visitorEmail: "",
        visitorPhone: "",
        taxNumber: "",
        company: "",
        purposeKey: 0,
        startDate: "",
        startTime: null,
        endDate: "",
        endTime: null,
        comments: "",
        status: 0,
        employeeName: "",
        purposeDescription: "",
        daysList: ""
      };
    },

    cleanDays() {
      this.days = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
      };
      this.repeat = false;
    },

    setRepeatedDays() {
      let dayslist = [];
      if (this.days.mon) dayslist.push("mon");
      if (this.days.tue) dayslist.push("tue");
      if (this.days.wed) dayslist.push("wed");
      if (this.days.thu) dayslist.push("thu");
      if (this.days.fri) dayslist.push("fri");
      if (this.days.sat) dayslist.push("sat");
      if (this.days.sun) dayslist.push("sun");
      this.employeeRequestModel.daysList = dayslist.join();
    },

    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          let me = this;
          let header = { Authorization: "Bearer " + this.$store.state.token };
          let conf = { headers: header };
          await axios
            .put(
              "api/EmployeeRequests/PutEmployeeRequest",
              me.employeeRequestModel,
              conf
            )
            .then(function(response) {
              if (response.data.result == "ERROR") {
                me.displayNotification("error", response.data.message);
              } else {
                me.close();
                me.getEmployeeRequests();
                me.clean();
                me.cleanDays();
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
          let header = { Authorization: "Bearer " + this.$store.state.token };
          let conf = { headers: header };
          if (me.repeat) {
            me.setRepeatedDays();
          }
          await axios
            .post(
              "api/EmployeeRequests/PostEmployeeRequest",
              me.employeeRequestModel,
              conf
            )
            .then(function(response) {
              if (response.data.result == "ERROR") {
                me.displayNotification("error", response.data.message);
              } else {
                me.close();
                me.getEmployeeRequests();
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