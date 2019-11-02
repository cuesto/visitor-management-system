<template>
  <v-layout align-start>
    <v-flex>
      <v-card>
        <v-container>
          <v-row cols="6">
            <v-col cols="5">
              <v-card>
                <v-data-table
                  :items-per-page="5"
                  :footer-props="{'items-per-page-options': [5, 10, 15, 20, 25]  }"
                  :headers="headersVisitorsByPurpose"
                  :items="visitorsByPurpose"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="#03a9f4">
                      <v-toolbar-title>Propósito de Visitas</v-toolbar-title>
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
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="#67daff">
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
                    <v-icon size="sm" class="mr-1" @click="showTicketModal(item)">print</v-icon>
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
                    <v-toolbar flat color="#0093c4">
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
          <v-dialog v-model="ticketModal" max-width="1000">
            <v-card>
              <v-card-text>
                <v-btn @click="printPDF()">
                  <v-icon>print</v-icon>
                </v-btn>
                <Ticket
                  :name="label.name"
                  :lastname="label.lastname"
                  :taxnumber="label.taxnumber"
                  :purpose="label.purpose"
                  :employee="label.employee"
                  :department="label.department"
                  :startdate="label.startdate"
                />
                <v-btn @click="hideTicketModal()" color="blue darken-1" text>Cancelar</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import router from "../router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import TicketModel from "../models/TicketModel";
import Ticket from "../components/Ticket";

export default {
  components: {
    Ticket
  },
  data: () => ({
    ticketModal: false,
    maskDate: "##:##",
    searchEmployeesRequest: "",
    employeesrequest: [],
    headersEmployeeRequest: [
      { text: "Nombre", sortable: true, value: "visitorName" },
      { text: "Compañía", sortable: true, value: "company" },
      { text: "Teléfono", sortable: true, value: "visitorPhone" },
      { text: "Fecha Esperada", sortable: true, value: "startDate" },
      { text: "Hora Esperada", sortable: true, value: "startTime" },
      { text: "Propósito", sortable: true, value: "purposeDescription" },
      {
        text: "Empleado(Quién lo recibirá)",
        sortable: true,
        value: "employeeName"
      },
      { text: "Opciones", value: "options", sortable: false }
    ],
    searchVisitors: "",
    visitors: [],
    headersVisitors: [
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Celular", sortable: true, value: "phone" },
      {
        text: "Empleado(Quién lo recibió)",
        sortable: true,
        value: "employeeName"
      },
      { text: "Opciones", value: "options", sortable: false }
    ],
    visitorsByPurpose: [],
    headersVisitorsByPurpose: [
      { text: "Tipo visita", sortable: false, value: "description" },
      { text: "Cantidad", sortable: false, value: "value" }
    ],
    label: {
      name: "",
      lastname: "",
      taxnumber: "",
      purpose: "",
      employee: "",
      department: "",
      startdate: ""
    },
    ticketModel: new TicketModel()
  }),
  created() {
    this.getEmployeesRequest();
    this.getVisitors();
    this.getVisitorsByPurpose();
  },
  methods: {
    showTicketModal(item) {
      this.label.name = item.name;
      if (item.name.length >= 14) {
        this.label.name = item.name.substring(0, 14);
        this.label.lastname = item.name.substring(14, item.name.length);
      }
      this.label.taxnumber = item.taxNumberVisitor;
      this.label.purpose = item.purposeDisplay;
      this.label.employee = item.employeeName;
      this.label.department = item.departmentDisplay;
      this.label.startdate = item.startDate + " " + item.startTime;
      console.log(this.label.name);
      this.ticketModal = true;
    },

    hideTicketModal() {
      this.ticketModal = false;
    },

    printPDF(item) {
      var quotes = document.getElementById("ticket");
      html2canvas(quotes).then(function(canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF();
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        doc.save("ticket.pdf");
      });
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
    async getEmployeesRequest() {
      let me = this;
      await axios
        .get("api/EmployeeRequests/GetEmployeeRequestsHome")
        .then(function(response) {
          me.employeesrequest = response.data;
        })
        .catch(function(error) {
          if (error.response.status == 401) {
            //me.displayNotification("error", "Su sesión ha expirado.");
          } else {
            me.displayNotification("error", error.message);
          }
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
          if (error.response.status == 401) {
            //me.displayNotification("error", "Su sesión ha expirado.");
          } else {
            me.displayNotification("error", error.message);
          }
        });
    },

    checkIn(item) {
      router.push({
        name: "visitorId",
        params: { id: item.employeeRequestKey }
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
            item.status = 2;
            item.ModifiedBy = this.$store.state.user.name;
            axios
              .put("api/Visitors/PutVisitor", item)
              .then(function(response) {
                if (response.data.result == "ERROR") {
                  me.displayNotification("error", response.data.message);
                } else {
                  me.getVisitors();
                  me.displayNotification(
                    "success",
                    "Se dio salida a la persona correctamente."
                  );
                }
              })
              .catch(function(error) {
                if (error.response.status == 401) {
                  //me.displayNotification("error", "Su sesión ha expirado.");
                } else {
                  me.displayNotification("error", error.message);
                }
              });
          }
        });
    },

    async getVisitorsByPurpose() {
      let me = this;
      await axios
        .get("api/Purposes/GetVisitorsPurpose")
        .then(function(response) {
          me.visitorsByPurpose = response.data;
        })
        .catch(function(error) {
          if (error.response.status == 401) {
            // me.displayNotification("error", "Su sesión ha expirado.");
          } else {
            me.displayNotification("error", error.message);
          }
        });
    }
  }
};
</script>
