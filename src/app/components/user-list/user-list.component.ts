import { Component, inject } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user-service.service';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  //Atributos
  users: User[];
  userService = inject(UserService);
  pageSize!: number;
  currentPage!: number;

  //Constructor
  constructor() {
    this.pageSize = 6;
    this.currentPage = 1;
    this.users = [];
  }

  //ngOnInit
  async ngOnInit() {
    try {
      this.users = await this.userService.getArrayUsersInMemory();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

  //Metodos
  nextPage() {
    if (this.currentPage < Math.ceil(this.users.length / this.pageSize)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }

  get pages(): number[] {
    return Array(this.getTotalPages())
      .fill(0)
      .map((_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
