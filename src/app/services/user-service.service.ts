import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //Atributos
  private url: string = 'https://peticiones.online/api/users';
  private httpClient: HttpClient = inject(HttpClient);

  //Metodos
  getAll(): Promise<User[]> {
    return lastValueFrom(
      this.httpClient.get<{ results: User[] }>(this.url)
    ).then((response) => response.results);
  }

  getById(id: string): Promise<User> {
    return lastValueFrom(this.httpClient.get<User>(`${this.url}/${id}`)).then(
      (response) => response
    );
  }

  createOne(user: User): Promise<User> {
    return lastValueFrom(this.httpClient.post<User>(this.url, user)).then(
      (response) => response
    );
  }

  updateById(user: User): Promise<User> {
    return lastValueFrom(
      this.httpClient.put<User>(`${this.url}/${user._id}`, user)
    ).then((response) => response);
  }

  deleteById(id: string): Promise<User> {
    return lastValueFrom(
      this.httpClient.delete<User>(`${this.url}/${id}`)
    ).then((response) => response);
  }
}
