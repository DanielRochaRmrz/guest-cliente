import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

import { ReservacionProvider } from "../../providers/reservacion/reservacion";

@Pipe({
  name: "getTime",
})
export class GetTimePipe implements PipeTransform {
  public infoReservaciones: any;

  constructor(public reservaProvider: ReservacionProvider) {}

  async transform(idReservacion: string) {
    this.infoReservaciones = await this.reservaProvider._getInfo(idReservacion);

    const date_acept = moment(this.infoReservaciones[0].date_acept.toDate());
    const date_rserva = moment(this.infoReservaciones[0].date_rserva.toDate());
    const diff_hours = date_rserva.diff(date_acept, "hours");

    if (diff_hours >= 24) {
      var timer = 24
    } else {
      var timer = diff_hours;
    }
    
    return timer;
  }
}
