import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //Atributos
  private url: string = 'https://peticiones.online/api/users';
  private httpClient: HttpClient = inject(HttpClient);
  private arrayUsersInMemory!: User[];

  //Metodos API
  //GET
  getAll(): Promise<User[]> {
    return lastValueFrom(
      this.httpClient.get<{ results: User[] }>(this.url)
    ).then((response) => response.results);
  }

  getById(id: string): Promise<User> {
    return lastValueFrom(this.httpClient.get<User>(`${this.url}/${id}`)).then(
      (response) => {
        if (response._id) {
          return response;
        } else {
          return this.arrayUsersInMemory.find(
            (user) => user._id === id
          ) as User;
        }
      }
    );
  }

  //POST
  createOne(user: User): Promise<User> {
    return lastValueFrom(this.httpClient.post<User>(this.url, user)).then(
      (response) => response
    );
  }

  //PUT
  updateById(user: User): Promise<User> {
    return lastValueFrom(
      this.httpClient.put<User>(`${this.url}/${user._id}`, user)
    ).then((response) => response);
  }

  //DELETE
  deleteById(id: string): Promise<User> {
    return lastValueFrom(
      this.httpClient.delete<User>(`${this.url}/${id}`)
    ).then((response) => response);
  }

  //Metodos Array en memoria
  //GET
  async getArrayUsersInMemory() {
    if (
      this.arrayUsersInMemory === undefined ||
      this.arrayUsersInMemory.length === 0
    ) {
      this.arrayUsersInMemory = await this.getAll();
      return this.arrayUsersInMemory;
    } else {
      return this.arrayUsersInMemory;
    }
  }

  //ADD
  addArrayUsersInMemory(user: User) {
    this.arrayUsersInMemory.push(user);
  }

  //DELETE
  deleteArrayUsersInMemory(_id: string) {
    this.arrayUsersInMemory = this.arrayUsersInMemory.filter(
      (user) => user._id !== _id
    );
  }

  //UPDATE
  updateArrayUsersInMemory(user: User) {
    this.arrayUsersInMemory = this.arrayUsersInMemory.map((u) =>
      u._id === user._id ? user : u
    );
  }

  //Validaciones
  usernameExists(username: any) {
    if (this.arrayUsersInMemory === undefined) {
      return false;
    } else {
      return this.arrayUsersInMemory.some((user) => user.username === username);
    }
  }
}
