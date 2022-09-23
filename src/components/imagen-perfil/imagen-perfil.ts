import { Component, Input } from "@angular/core";
import { UserProvider } from "../../providers/user/user";
@Component({
  selector: "imagen-perfil",
  templateUrl: "imagen-perfil.html",
})
export class ImagenPerfilComponent {
  @Input() uidUserSesion: string = '';
  nombresUserss: any = {};
  userImage: any = "";

  constructor(private _providerUser: UserProvider) {
    this._providerUser
      .getUserData(this.uidUserSesion)
      .subscribe((user: any) => {
        this.nombresUserss = user[0];
        this.userImage = this.nombresUserss;
      });
  }
}
