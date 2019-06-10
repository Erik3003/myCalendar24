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

  categoryForm: FormGroup[] = [];
  categories: CategoryModel[] = [];
  colorError: boolean;
  titleMinError: boolean;
  titleMaxError: boolean;
  hasChilds: boolean;

  colors: string[];

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private dialogRef: MatDialogRef<CustomizeCategoriesComponent>) {
    this.colors = ["red", "blue", "green", "yellow", "orange", "lightgreen", "lightblue"];
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;
    console.log(this.categories);
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

  onSubmit(index: number) {
    let category = new CategoryModel();
    category.title = this.categoryForm[index].get("title").value;
    category.color = this.categoryForm[index].get("color").value;
    category.persistance = this.categories[index].persistance;

    if (category.color == '') {
      this.colorError = true;
      setTimeout(()=>{this.colorError=false},5000);
    } else if (category.title.length < 3) {
      this.titleMinError = true;
      setTimeout(()=>{this.titleMinError=false},5000);
    } else if (category.title.length > 15) {
      this.titleMaxError = true;
      setTimeout(()=>{this.titleMaxError=false},5000);
    } else {
      category._id = this.categories[index]._id;
      
      this.catService.updateCategory(category).subscribe((data: any) => {
        console.log(data);
        this.catService.categoriesChanged("sidebar");
      });
    }
  }

  onDelete(index:number) {
    let category = new CategoryModel();
    category._id = this.categories[index]._id;
    category.persistance = this.categories[index].persistance;
    this.catService.deleteCategory(category).subscribe((data: any) => {
      console.log(data);
      this.catService.categoriesChanged("sidebar");
      this.loadCategories();
    },
    (err: HttpErrorResponse)=>{
      this.hasChilds = true;
    });
  }

}
