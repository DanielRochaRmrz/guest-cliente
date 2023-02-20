import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Pipe({
  name: 'getCompartidasUser',
})
export class GetCompartidasUserPipe implements PipeTransform {
  constructor(public firestore: AngularFirestore) {}

  transform(telUser: string, idReserva: string) {
    
    const collection = this.firestore.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idReserva).where("telefono", "==", telUser)
    );
    const res$ = collection.valueChanges().pipe(
      map((reserva) => {
        const res = reserva[0];
        return res;
      })
    );
    console.log('getCompartidasUser -->', res$);
    
    return res$;
  }
}
