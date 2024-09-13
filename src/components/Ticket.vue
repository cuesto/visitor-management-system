<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" dark @click="printTicket">
        <v-icon left dark>print</v-icon>Imprimir
      </v-btn>
    </v-card-title>
    <v-card-text>

      <div id="ticket" ref="ticket">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr valign="top">
            <td width="0.861%"></td>
            <td width="0.014%"></td>
            <td width="0.806%"></td>
            <td width="13.458%"></td>
            <td width="20.472%"></td>
            <td width="0.250%"></td>
            <td width="0.014%"></td>
            <td width="64.125%"></td>
          </tr>
          <tr valign="top">
            <td colspan="3">&nbsp;</td>
            <td nowrap="true">
              <img src="../assets/agrifeed.jpeg" alt="Agrifeed"   height="48" />
            </td>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td height="15px" colspan="8">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="3">
              <table width="167px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="2">
                      <b>Nombre:</b>
                    </font>
                  </span>
                </td>
              </table>
            </td>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="5">
              <table width="168px" border="0" cellpadding="0" cellspacing="0">
                <tr valign="top">
                  <td align="left">
                    <span>
                      <font face="Arial" color="#000000" size="3">{{ name }}</font>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr v-if="lastname" valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="5">
              <table width="168px" border="0" cellpadding="0" cellspacing="0">
                <tr valign="top">
                  <td align="left">
                    <span>
                      <font face="Arial" color="#000000" size="3">{{
                        lastname
                        }}</font>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="3">
              <table width="167px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="2">
                      <b>Cédula:</b>
                    </font>
                  </span>
                </td>
              </table>
            </td>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td>&nbsp;</td>
            <td nowrap="true" colspan="5">
              <table width="168px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="3">{{
                      taxnumber
                      }}</font>
                  </span>
                </td>
              </table>
            </td>
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="3">
              <table width="167px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="2">
                      <b>Motivo&nbsp;Visita:</b>
                    </font>
                  </span>
                </td>
              </table>
            </td>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="5">
              <table width="168px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="3">{{ purpose }}</font>
                  </span>
                </td>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="3">
              <table width="167px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="2">
                      <b>A&nbsp;donde&nbsp;se&nbsp;dirige:</b>
                    </font>
                  </span>
                </td>
              </table>
            </td>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="5">
              <table width="168px" border="0" cellpadding="0" cellspacing="0">
                <tr valign="top">
                  <td align="left">
                    <span>
                      <font face="Arial" color="#000000" size="3">{{ employee }}&nbsp;-&nbsp;</font>
                    </span>
                  </td>
                </tr>
                <tr valign="top">
                  <td align="left">
                    <span>
                      <font face="Arial" color="#000000" size="3">{{
                        department
                        }}</font>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="3">
              <table width="167px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="2">
                      <b>Fecha&nbsp;de&nbsp;Registro:</b>
                    </font>
                  </span>
                </td>
              </table>
            </td>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr valign="top">
            <td colspan="2">&nbsp;</td>
            <td nowrap="true" colspan="5">
              <table width="168px" border="0" cellpadding="0" cellspacing="0">
                <td align="left">
                  <span>
                    <font face="Arial" color="#000000" size="2">{{
                      startdate
                      }}</font>
                  </span>
                </td>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr valign="top">
            <td height="12px" colspan="8">&nbsp;</td>
          </tr>
        </table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import TicketModel from "../models/TicketModel";

export default {
  props: [
    "name",
    "lastname",
    "taxnumber",
    "purpose",
    "employee",
    "department",
    "startdate",
  ],
  data() {
    return {
      ticketModal: true,
      ticketModel: new TicketModel(),
    };
  },
  methods: {
    printTicket() {
      console.log(this.ticketModel.imgSrc);

      const printContents = this.$refs.ticket.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Para asegurarse de que la página se recargue después de imprimir
    }
  },
};
</script>