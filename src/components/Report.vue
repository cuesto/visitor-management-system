<template>
  <v-layout align-start>
    <v-flex>
        <div ref="chartdivpie" style="width: 100%; height: 400px;"></div>
      <h1>Cantidad de Visitas en un Rango de Fechas</h1>
      <div class="hello" ref="chartdivxychart"></div>
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
    return {};
  },
  mounted() {
    this.displayChart();
    this.getVisitorsByPurpose();
  },
  methods: {
    getVisitorsByPurpose() {
      let me = this;
      axios
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
    //   pieSeries.labels.template.disabled = true;
    //   pieSeries.ticks.template.disabled = true;

    //   chart.legend = new am4charts.Legend();
    //   chart.legend.position = "botton";
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
  //   beforeDestroy() {
  //     if (this.chart) {
  //       this.chart.dispose();
  //     }
  //   }
};
</script>

<style scoped>
.hello {
  width: 100%;
  height: 500px;
}
</style>