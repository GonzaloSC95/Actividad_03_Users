import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  userForm!: FormGroup;

  //Constructor
  constructor() {
    //Accion
    this.action = 'Crear';
    //Formulario
    this.userForm = new FormGroup({
      _id: new FormControl(this.generateId(), [Validators.required]),
      username: new FormControl(null, [Validators.required]),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ]),
      image: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      //Usuario
      const user = await this.userService.getById(params.id);

      if (user._id) {
        //Accion
        this.action = 'Actualizar';
        //Formulario
        this.userForm = new FormGroup({
          _id: new FormControl(user._id, [Validators.required]),
          username: new FormControl(user.username, [Validators.required]),
          first_name: new FormControl(user.first_name, [Validators.required]),
          last_name: new FormControl(user.last_name, [Validators.required]),
          email: new FormControl(user.email, [
            Validators.required,
            Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
          ]),
          image: new FormControl(user.image, [Validators.required]),
        });
      }
    });
  }
  //Metodos
  async onSubmit() {
    const user: User = this.userForm.value as User;
    if (this.action === 'Crear') {
      const userCreated = await this.userService.createOne(user);

      if (userCreated.id) {
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Aceptar',
          title: 'Atención',
          text: 'Usuario creado correctamente',
        });
        this.userForm.reset();
        return;
      }
      Swal.fire({
        icon: 'error',
        confirmButtonText: 'Aceptar',
        title: 'Error',
        text: 'Ocurrio un error al crear el usuario',
      });
      this.userForm.reset();
      return;
    } else if (this.action === 'Actualizar') {
      const userUpdated = await this.userService.updateById(user);

      if (userUpdated.id) {
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Aceptar',
          title: 'Atención',
          text: 'Usuario actualizado correctamente',
        });
        return;
      }
      Swal.fire({
        icon: 'error',
        confirmButtonText: 'Aceptar',
        title: 'Error',
        text: 'Ocurrio un error al actualizar el usuario',
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

  generateId() {
    const timestamp = Date.now().toString(16);
    const randomString = Math.random().toString(16).substring(2, 14);
    return timestamp + randomString;
  }
}
