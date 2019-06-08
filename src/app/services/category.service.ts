import { Injectable, Output } from '@angular/core';
import { CategoryModel } from 'src/models/category.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: CategoryModel[] = [];
  choosen: boolean[] = [];
  readonly ROOT_URL = 'http://localhost:3000/api/category';
  messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  //title color
  createCategory(category: CategoryModel) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer " + this.authService.getToken());

    return this.http.post(this.ROOT_URL + "/new", category, { headers: headers });
  }

  //complete
  fetchCategories(): Observable<CategoryModel[]> {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer " + this.authService.getToken());

    return this.http.get<CategoryModel[]>(this.ROOT_URL + "/get", { headers: headers });
  }

  //_id
  deleteCategory() {
    let headers = this.createRequestHeaders();

    return this.http.post(this.ROOT_URL + "/remove", { headers: headers });
  }

  //title color _id
  updateCategory(category: CategoryModel) {
    let headers = this.createRequestHeaders();

    return this.http.post(this.ROOT_URL + "/remove", category, { headers: headers });
  }

  createRequestHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer " + this.authService.getToken());
    return headers;
  }

  setCategories(categories: CategoryModel[]) {
    this.categories = categories;
  }

  getCategories(): CategoryModel[] {
    return this.categories;
  }

  setChoosen(choosen: boolean[]) {
    console.log("aus");
    
      this.choosen=choosen;
      this.messageSource.next("changed");
  }

  getChoosen(): boolean[] {
    return this.choosen;
  }
}
