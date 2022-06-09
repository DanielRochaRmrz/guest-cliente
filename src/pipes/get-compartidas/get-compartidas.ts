import { Pipe, PipeTransform } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Pipe({
  name: "getCompartidas",
})
export class GetCompartidasPipe implements PipeTransform {
  constructor(public firestore: AngularFirestore) {}

  transform(idReservacion: string) {
    const collection = this.firestore.collection<any>("reservaciones", (ref) =>
      ref.where("idReservacion", "==", idReservacion)
    );
    const res$ = collection.valueChanges().pipe(
      map((reserva) => {
        const res = reserva[0];
        return res;
      })
    );
    return res$;
  }
}
