import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { User } from '../../interfaces/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  router = inject(Router);
  user: User;

  //Constructor
  constructor() {
    this.user = {
      _id: '',
      id: 0,
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      image: '',
      error: '',
    };
  }

  //ngOnInit
  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      try {
        //Usuario
        this.user = await this.userService.getById(params.id);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
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
      //Eliminar usuario via api
      const userToDelete = await this.userService.deleteById(this.user._id);
      if (userToDelete.id) {
        //Eliminar usuario en memoria
        this.userService.deleteArrayUsersInMemory(this.user._id);
        //Mensaje
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Aceptar',
          title: 'Atención',
          text: 'Usuario eliminado: ' + userToDelete.username,
        }).then(() => {
          this.router.navigate(['/home']);
        });
        return;
      } else if (userToDelete.error) {
        Swal.fire({
          icon: 'error',
          confirmButtonText: 'Aceptar',
          title: 'Error',
          text: `Ocurrio un error al intentar eliminar el usuario via api:
                            \"${userToDelete.error}\".
                            Esto puede deberse a que es un usuario nuevo que solo esta creado en memoria. Pulse aceptar para eliminarlo en memoria.`,
        }).then(() => {
          this.userService.deleteArrayUsersInMemory(this.user._id);
          //Volvemos a home
          this.router.navigate(['/home']);
        });
        return;
      } else {
        //Mensaje de error
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
