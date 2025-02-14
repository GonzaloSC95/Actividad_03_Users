import { Component, inject, Input } from '@angular/core';
import { User } from '../../interfaces/user';
import { RouterModule } from '@angular/router';
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
