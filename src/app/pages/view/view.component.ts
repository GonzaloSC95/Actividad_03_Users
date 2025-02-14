import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { User } from '../../interfaces/user';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {
  //Atributos
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  user!: User;

  //ngOnInit
  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      //Usuario
      this.user = await this.userService.getById(params.id);
    });
  }

  //Metodos
  async deleteUser(id: string) {
    const result = await Swal.fire({
      title: '¿Estas seguro de eliminar este usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      //Eliminar usuario
      const userToDelete = await this.userService.deleteById(this.user._id);
      if (userToDelete.id) {
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Aceptar',
          title: 'Atención',
          text: 'Usuario eliminado: ' + userToDelete.username,
        });
        return;
      } else {
        Swal.fire({
          icon: 'error',
          confirmButtonText: 'Aceptar',
          title: 'Error',
          text: 'Ocurrio un error al eliminar el usuario',
        });
        return;
      }
    }
  }
}
