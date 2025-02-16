import { Component, inject, Input } from '@angular/core';
import { User } from '../../interfaces/user';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  //Atributos
  @Input() user!: User;
  userService = inject(UserService);
  router = inject(Router);

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
          this.router.navigateByUrl('/newuser').then(() => {
            this.router.navigate(['/home']);
          });
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
          this.router.navigateByUrl('/newuser').then(() => {
            this.router.navigate(['/home']);
          });
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
