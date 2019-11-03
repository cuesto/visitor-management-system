<template>
  <v-layout align-start>
    <v-flex>
      <v-card>
        <v-container>
          <v-row cols="6">
            <v-col cols="12">
              <v-card>
                <v-toolbar floating>
                  <v-toolbar-title>Reporte de Visitas</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>

                  <v-layout align-center>
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
                          v-model="startDate"
                          label="Fecha Inicio*"
                          prepend-icon="event"
                          readonly
                          hide-details
                          single-line
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="startDate" @input="menuStartDate = false"></v-date-picker>
                    </v-menu>

                    <v-menu
                      class="pad"
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
                          v-model="endDate"
                          label="Fecha Fin*"
                          prepend-icon="event"
                          readonly
                          hide-details
                          single-line
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="endDate" @input="menuEndDate = false"></v-date-picker>
                    </v-menu>
                    <v-tooltip class="pad" v-model="showTooltipSearch" top>
                      <template v-slot:activator="{ on }">
                        <v-btn color="success" v-on="on" @click="console.log()">
                          <v-icon left>search</v-icon>Buscar
                        </v-btn>
                      </template>
                      <span>Buscar Registros</span>
                    </v-tooltip>
                  </v-layout>
                </v-toolbar>
              </v-card>
            </v-col>
          </v-row>
          <v-row cols="6">
            <v-col cols="12">
              <v-card>
                <v-data-table
                  :items-per-page="10"
                  :footer-props="{'items-per-page-options': [5, 10, 15, 20, 25]  }"
                  :headers="headersVisitors"
                  :search="searchVisitors"
                  :items="visitors"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="#67daff">
                      <v-toolbar-title>Visitantes</v-toolbar-title>
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
                      <v-tooltip class="pad" v-model="showTooltipExport" top>
                        <template v-slot:activator="{ on }">
                          <v-btn color="info" v-on="on" @click="console.log()">
                            <v-icon left>cloud_download</v-icon>Descargar
                          </v-btn>
                        </template>
                        <span>Descargar Registros en formato de Excel</span>
                      </v-tooltip>
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
            <v-col cols="12">
              <v-card>
                <div ref="chartdivpie" style="width: 100%; height: 400px;"></div>
              </v-card>
            </v-col>
          </v-row>
          <v-row cols="6">
            <v-col cols="12">
              <v-card>
                <div class="hello" ref="chartdivxychart"></div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
  data() {
    return {
      menuStartDate: false,
      startDate: "",
      menuEndDate: false,
      endDate: "",
      showTooltipSearch: false,
      showTooltipExport: false,
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
      ]
    };
  },
  mounted() {
    this.displayChart();
    this.getVisitorsByPurpose();
    this.getVisitors();
  },
  methods: {
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
    async getVisitorsByPurpose() {
      let me = this;
      await axios
        .get("api/Purposes/GetVisitorsPurpose")
        .then(function(response) {
          me.visitorsByPurpose = response.data;
          me.displayPieChart();
        })
        .catch(function(error) {
          if (error.response.status == 401) {
            // me.displayNotification("error", "Su sesión ha expirado.");
          } else {
            me.displayNotification("error", error.message);
          }
        });
    },
    displayPieChart() {
      let chart = am4core.create(this.$refs.chartdivpie, am4charts.PieChart);
      chart.data = this.visitorsByPurpose;

      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());

      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "description";
      chart.innerRadius = am4core.percent(40);

      // Disable ticks and labels
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "left";
    },
    displayChart() {
      let chart = am4core.create(this.$refs.chartdivxychart, am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits = i;
        data.push({
          date: new Date(2019, 0, i),
          name: "name" + i,
          value: visits
        });
      }

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    }
  }
};
</script>

<style scoped>
.hello {
  width: 100%;
  height: 500px;
}

.pad {
  padding-left: 1rem;
}
</style>