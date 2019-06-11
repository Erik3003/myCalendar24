import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CategoryService } from 'src/app/services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryModel } from 'src/models/category.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customize-categories',
  templateUrl: './customize-categories.component.html',
  styleUrls: ['./customize-categories.component.css']
})
export class CustomizeCategoriesComponent implements OnInit {

  //an array of forms for each categorie of the user
  categoryForm: FormGroup[] = [];

  //the users categories an its color
  categories: CategoryModel[] = [];
  colors: string[];

  //booleans for displaying messegas in the dialog
  colorError: boolean;
  titleMinError: boolean;
  titleMaxError: boolean;
  hasChilds: boolean;
  success: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private dialogRef: MatDialogRef<CustomizeCategoriesComponent>) {
    //setting selectable colors for selecting in the form
    this.colors = ["red", "blue", "green", "yellow", "orange", "lightgreen", "lightblue"];
  }

  ngOnInit() {
    this.loadCategories();
  }

  //calling the service for fetching the users categories from the server
  async loadCategories() {
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;

    //build a form for every categorie of the user with its title and color
    for (let i = 0; i < this.categories.length; i++) {
      this.categoryForm[i] = this.formBuilder.group({
        title: [this.categories[i].title, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15)
        ]],
        color: [this.categories[i].color, [
          Validators.required,
        ]]
      });
    }
  }

  /*fetching input from form on clicking the submit button, validate it and call 
    service for updating category.*/
  onSubmit(index: number) {
    let category = new CategoryModel();
    category.title = this.categoryForm[index].get("title").value;
    category.color = this.categoryForm[index].get("color").value;
    category.persistance = this.categories[index].persistance;

    if (category.color == '') {
      this.colorError = true;
      setTimeout(() => { this.colorError = false }, 5000);
    } else if (category.title.length < 3) {
      this.titleMinError = true;
      setTimeout(() => { this.titleMinError = false }, 5000);
    } else if (category.title.length > 15) {
      this.titleMaxError = true;
      setTimeout(() => { this.titleMaxError = false }, 5000);
    } else {
      category._id = this.categories[index]._id;

      /*call service and send a changed message to the service to tell subscribing 
        components, that the categories have changed.*/
      this.catService.updateCategory(category).subscribe((data: any) => {
        this.catService.categoriesChanged("sidebar");
      });
    }
  }

  //call the service for deleting the selected category on clicking the remove button
  onDelete(index: number) {
    //get selected values. persistens to check, if it can be removed (group category is persistent).
    let category = new CategoryModel();
    category._id = this.categories[index]._id;
    category.persistance = this.categories[index].persistance;

    this.catService.deleteCategory(category).subscribe((data: any) => {
      this.catService.categoriesChanged("sidebar");
      this.loadCategories();
      this.success = true;
      setTimeout(()=> {this.success= false;},3000);
    },
      (err: HttpErrorResponse) => {
        this.hasChilds = true;
      });
  }

}
