/*
 * This service handles all requests for categories between components and server.
 * This includes creating, updating, deleting and fetching of categories.
 */
import { Injectable, Output } from '@angular/core';
import { CategoryModel } from 'src/models/category.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  //array of users categories
  categories: CategoryModel[] = [];

  //array of a boolean for each category, if it is selected
  choosen: boolean[] = [];

  //http request url
  readonly ROOT_URL = 'http://localhost:3000/api/category';

  //subscription elements
  messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  //http post request for creating a category and returning response
  createCategory(category: CategoryModel) {
    let headers = this.createRequestHeaders();
    return this.http.post(this.ROOT_URL + "/new", category, { headers: headers });
  }

  ////http get request for getting all users categories and returning response
  fetchCategories(): Observable<CategoryModel[]> {
    let headers = this.createRequestHeaders();
    return this.http.get<CategoryModel[]>(this.ROOT_URL + "/get", { headers: headers });
  }

  ////http get request for getting all public categories and returning response
  fetchPublicCategories(): Observable<CategoryModel[]> {
    let headers = this.createRequestHeaders();
    return this.http.get<CategoryModel[]>(this.ROOT_URL + "/public", { headers: headers });
  }

  //http post request for deleting a category and returning response
  deleteCategory(category: CategoryModel) {
    let headers = this.createRequestHeaders();
    console.log(category);
    return this.http.post(this.ROOT_URL + "/remove", category, { headers: headers });
  }

  //http post request for updating a category and returning response
  updateCategory(category: CategoryModel) {
    let headers = this.createRequestHeaders();
    return this.http.post(this.ROOT_URL + "/update", category, { headers: headers });
  }

  //create header with authorization toke from authentification service
  createRequestHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer " + this.authService.getToken());
    return headers;
  }

  //push a message if the categories changed
  categoriesChanged(element:string){
    this.messageSource.next(element+" changed");
  }

  //set and get categories
  setCategories(categories: CategoryModel[]) {
    this.categories = categories;
  }

  getCategories(): CategoryModel[] {
    return this.categories;
  }

  //set and get which categories are selected and send change message to subscriber
  setChoosen(choosen: boolean[]) {  
      this.choosen=choosen;
      this.messageSource.next("choosen changed");
  }

  //get which categories are selected
  getChoosen(): boolean[] {
    return this.choosen;
  }
}
