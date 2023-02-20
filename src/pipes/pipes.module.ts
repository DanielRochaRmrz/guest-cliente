import { NgModule } from "@angular/core";
import { PlaceHolderPipe } from "./place-holder/place-holder";
import { PipesCategoriaPipe } from "./pipes-categoria/pipes-categoria";
import { PipesFilterEventoPipe } from "./pipes-filter-evento/pipes-filter-evento";
import { PipesFilterCiudadPipe } from './pipes-filter-ciudad/pipes-filter-ciudad';
import { PipesFilterCiudad2Pipe } from "./pipes-filter-ciudad2/pipes-filter-ciudad2";
import { GetSucursalPipe } from './get-sucursal/get-sucursal';
import { GetZonaPipe } from './get-zona/get-zona';
import { GetCompartidasPipe } from './get-compartidas/get-compartidas';
import { GetCompartidaTelUsPipe } from './get-compartida-tel-us/get-compartida-tel-us';
import { GetTimePipe } from './get-time/get-time';
import { GetCompartidasUserPipe } from './get-compartidas-user/get-compartidas-user';

@NgModule({
  declarations: [
    PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
    PipesFilterCiudadPipe,
    PipesFilterCiudad2Pipe,
    GetSucursalPipe,
    GetZonaPipe,
    GetCompartidasPipe,
    GetCompartidaTelUsPipe,
    GetTimePipe,
    GetCompartidasUserPipe,
  ],
  imports: [],
  exports: [
    PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
    PipesFilterCiudadPipe,
    PipesFilterCiudad2Pipe,
    GetSucursalPipe,
    GetZonaPipe,
    GetCompartidasPipe,
    GetCompartidaTelUsPipe,
    GetTimePipe,
    GetCompartidasUserPipe,
  ],
})
export class PipesModule {}
