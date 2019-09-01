<template>
  <v-layout align-start>
    <v-flex>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row cols="6">
              <v-col>
                <v-card>
                  <template>
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
                  </template>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card>
                  <div>
                    <v-data-table
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
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row cols="6">
              <v-col>
                <v-card>
                  <v-data-table
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
      // { text: "Fecha Entrada", sortable: true, value: "startDate" },
      { text: "Hora Entrada", sortable: true, value: "startTime" },
      {
        text: "Empleado(Quién lo recibió)",
        sortable: true,
        value: "employeeName"
      },
      { text: "Opciones", value: "options", sortable: false }
    ],

    value: [423, 446, 675, 510, 590, 610, 760]
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
    }
  }
};
</script>
