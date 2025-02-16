import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  //Atributos
  action!: string;
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);
  router = inject(Router);
  userForm!: FormGroup;
  oldUsername: string;

  //Constructor
  constructor() {
    //Accion
    this.action = 'Crear';
    this.oldUsername = '';
    //Formulario
    this.userForm = new FormGroup(
      {
        _id: new FormControl(this.generateId(), [Validators.required]),
        username: new FormControl(null, [Validators.required]),
        first_name: new FormControl(null, [Validators.required]),
        last_name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
        image: new FormControl(null, [Validators.required]),
      },
      [this.userNameExists.bind(this)]
    );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      //Usuario
      const user = await this.userService.getById(params.id);

      if (user && user._id) {
        //Accion
        this.action = 'Actualizar';
        this.oldUsername = user.username;
        //Formulario
        this.userForm = new FormGroup(
          {
            _id: new FormControl(user._id, [Validators.required]),
            username: new FormControl(user.username, [Validators.required]),
            first_name: new FormControl(user.first_name, [Validators.required]),
            last_name: new FormControl(user.last_name, [Validators.required]),
            email: new FormControl(user.email, [
              Validators.required,
              Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
            ]),
            image: new FormControl(user.image, [Validators.required]),
          },
          [this.userNameExists.bind(this)]
        );
      }
    });
  }
  //Metodos
  async onSubmit() {
    const user: User = this.userForm.value as User;
    if (this.action === 'Crear') {
      //Creamos el usuario via api
      const userCreated = await this.userService.createOne(user);
      if (userCreated.id) {
        //Insertamos el usuario en memoria
        userCreated._id = user._id;
        this.userService.addArrayUsersInMemory(userCreated);
        //Mensaje
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Aceptar',
          title: 'Atención',
          text: 'Usuario creado correctamente.',
        }).then(() => {
          this.userForm.reset();
          //Volvemos a home
          this.router.navigate(['/home']);
        });
        return;
      }
      //Mensaje de error
      Swal.fire({
        icon: 'error',
        confirmButtonText: 'Aceptar',
        title: 'Error',
        text: 'Ocurrio un error al crear el usuario.',
      });
      this.userForm.reset();
      return;
    } else if (this.action === 'Actualizar') {
      //Actualizamos el usuario via api
      const userUpdated = await this.userService.updateById(user);
      if (userUpdated.id) {
        //Actualizamos los usuarios en memoria
        userUpdated._id = user._id;
        this.userService.updateArrayUsersInMemory(userUpdated);
        //Mensaje
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Aceptar',
          title: 'Atención',
          text: 'Usuario actualizado correctamente.',
        }).then(() => {
          //Volvemos a home
          this.router.navigate(['/home']);
        });
        return;
      } else if (userUpdated.error) {
        Swal.fire({
          icon: 'error',
          confirmButtonText: 'Aceptar',
          title: 'Error',
          text: `Ocurrio un error al intentar actualizar el usuario via api:
                \"${userUpdated.error}\".
                Esto puede deberse a que es un usuario nuevo que solo esta creado en memoria. Pulse aceptar para actualizarlo en memoria.`,
        }).then(() => {
          this.userService.updateArrayUsersInMemory(user);
          //Volvemos a home
          this.router.navigate(['/home']);
        });
        return;
      }
      //Mensaje de error
      Swal.fire({
        icon: 'error',
        confirmButtonText: 'Aceptar',
        title: 'Error',
        text: 'Ocurrio un error al actualizar el usuario.',
      });
      return;
    }
  }

  checkControl(
    formControlName: string,
    validador: string
  ): boolean | undefined {
    return (
      this.userForm.get(formControlName)?.hasError(validador) &&
      this.userForm.get(formControlName)?.touched
    );
  }

  userNameExists(formValue: AbstractControl): any {
    const username = formValue.get('username')?.value;
    // Si estamos actualizando y el username no se cambió, no se valida
    if (this.action === 'Actualizar' && this.oldUsername === username) {
      return null;
    }
    // De lo contrario, se aplica la validación
    return this.userService.usernameExists(username)
      ? { usernameExists: true }
      : null;
  }

  generateId() {
    let timestamp = Date.now().toString(16);
    let randomString = Math.random().toString(16).substring(2, 14);
    let id = timestamp + randomString;
    return id;
  }
}
