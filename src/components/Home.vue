<template>
  <v-layout align-start>
    <v-flex>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row cols="6">
              <v-col cols="5">
                <v-card>
                  <v-data-table
                    dense
                    hide-default-footer
                    :items-per-page="5"
                    :footer-props="{'items-per-page-options': [5, 10, 15, 20, 25]  }"
                    :headers="headersVisitorsByPurpose"
                    :items="visitorsByPurpose"
                    sort-by="PurposeKey"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Propósio de Visitas</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:no-data>
                      <v-btn color="primary" @click="getVisitorsByPurpose">
                        <v-icon left dark>autorenew</v-icon>Refrescar
                      </v-btn>
                    </template>
                  </v-data-table>
                  <!-- <template>
                    <v-card class="mx-auto text-center" color="green" dark max-width="600">
                      <v-card-text>
                        <v-sheet color="rgba(0, 0, 0, .12)">
                          <v-sparkline
                            :value="value"
                            color="rgba(255, 255, 255, .7)"
                            height="100"
                            padding="24"
                            stroke-linecap="round"
                            smooth
                          >
                            <template v-slot:label="item">${{ item.value }}</template>
                          </v-sparkline>
                        </v-sheet>
                      </v-card-text>
                      <v-card-text>
                        <div class="display-1 font-weight-thin">Visitas Histórico</div>
                      </v-card-text>
                    </v-card>
                  </template>-->
                </v-card>
              </v-col>
              <v-col cols="7">
                <v-card>
                  <v-data-table
                    :items-per-page="5"
                    :footer-props="{'items-per-page-options': [5, 10, 15, 20, 25]  }"
                    :headers="headersVisitors"
                    :search="searchVisitors"
                    :items="visitors"
                    sort-by="visitorKey"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Visitantes - Dentro</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field
                          class="text-xs-center"
                          v-model="searchVisitors"
                          append-icon="search"
                          label="Búsqueda"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.options="{ item }">
                      <v-icon
                        size="sm"
                        variant="outline-info"
                        color="red"
                        class="mr-1"
                        @click="checkOut(item)"
                      >call_made</v-icon>
                    </template>
                    <template v-slot:no-data>
                      <v-btn color="primary" @click="getVisitors">
                        <v-icon left dark>autorenew</v-icon>Refrescar
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>

            <v-row cols="6">
              <v-col>
                <v-card>
                  <v-data-table
                    :items-per-page="5"
                    :footer-props="{'items-per-page-options': [5, 10, 15, 20, 25]  }"
                    :headers="headersEmployeeRequest"
                    :search="searchEmployeesRequest"
                    :items="employeesrequest"
                    sort-by="employeeRequestKey"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Visitas Esperadas</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field
                          class="text-xs-center"
                          v-model="searchEmployeesRequest"
                          append-icon="search"
                          label="Búsqueda"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.options="{ item }">
                      <v-icon
                        size="sm"
                        variant="outline-info"
                        color="blue"
                        class="mr-1"
                        @click="checkIn(item)"
                      >done_outline</v-icon>
                    </template>
                    <template v-slot:no-data>
                      <v-btn color="primary" @click="getEmployeesRequest">
                        <v-icon left dark>autorenew</v-icon>Refrescar
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";

export default {
  data: () => ({
    maskDate: "##:##",
    searchEmployeesRequest: "",
    employeesrequest: [],
    headersEmployeeRequest: [
      { text: "Nombre", sortable: true, value: "visitorName" },
      { text: "Compañía", sortable: true, value: "company" },
      { text: "Teléfono", sortable: true, value: "visitorPhone" },
      { text: "Fecha Esperada", sortable: true, value: "startDate" },
      { text: "Hora Esperada", sortable: true, value: "endTime" },
      { text: "Propósito", sortable: true, value: "purposeDescription" },
      {
        text: "Empleado(Quién lo recibirá)",
        sortable: true,
        value: "employeeName"
      },
      { text: "Opciones", value: "options", sortable: false }
    ],
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
    },
    searchVisitors: "",
    visitors: [],
    headersVisitors: [
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Celular", sortable: true, value: "phone" },
      { text: "Hora Entrada", sortable: true, value: "startTime" },
      {
        text: "Empleado(Quién lo recibió)",
        sortable: true,
        value: "employeeName"
      },
      { text: "Opciones", value: "options", sortable: false }
    ],

    visitorsByPurpose: [],
    headersVisitorsByPurpose: [
      { text: "Tipo visita", sortable: false, value: "name" },
      { text: "Cantidad", sortable: false, value: "phone" },
      { text: "Hora Entrada", sortable: true, value: "startTime" },
      {
        text: "Empleado(Quién lo recibió)",
        sortable: true,
        value: "employeeName"
      },
      { text: "Opciones", value: "options", sortable: false }
    ]
  }),
  created() {
    this.getEmployeesRequest();
    this.getVisitors();
  },
  methods: {
    displayNotification(type, message) {
      this.$swal.fire({
        position: "top-end",
        type: type,
        title: message,
        showConfirmButton: false,
        timer: 2500
      });
    },
    async getEmployeesRequest() {
      let me = this;
      await axios
        .get("api/EmployeeRequests/GetEmployeeRequests")
        .then(function(response) {
          me.employeesrequest = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },
    async getVisitors() {
      let me = this;
      await axios
        .get("api/Visitors/GetVisitors")
        .then(function(response) {
          me.visitors = response.data;
        })
        .catch(function(error) {
          me.displayNotification("error", error);
        });
    },

    checkOut(item) {
      this.$swal
        .fire({
          title: "¿Está Seguro de dar salida a esta persona?",
          text: "¡No será posible revertir el cambio!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "¡Si!",
          cancelButtonText: "Cancelar"
        })
        .then(result => {
          if (result.value) {
            let me = this;
            console.log(item);
            item.status = 2;
            axios
              .put("api/Visitors/PutVisitor", item)
              .then(function(response) {
                if (response.data.result == "ERROR") {
                  me.displayNotification("error", response.data.message);
                } else {
                  //me.close();
                  me.getVisitors();

                  me.displayNotification(
                    "success",
                    "Se dio salida a la persona correctamente."
                  );
                }
              })
              .catch(function(error) {
                me.displayNotification("error", error);
              });
          }
        });
    },

    getVisitorsByPurpose() {}
  }
};
</script>
