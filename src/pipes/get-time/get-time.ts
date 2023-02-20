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

    const date_create = moment(this.infoReservaciones[0].date_create.toDate());
    const date_current = moment(new Date());
    const diff_hours = date_current.diff(date_create, "hours");
    const timer = 24 - diff_hours;

    console.log(timer);
    

    return timer;
  }
}
