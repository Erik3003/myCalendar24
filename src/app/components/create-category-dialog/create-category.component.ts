/*
 * This component is represented in a pop up dialog and is for creating new categories
 * for the user. A title and a color can be selected in a form.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoryModel } from 'src/models/category.model';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  //form for getting input data
  categoryForm: FormGroup;

  //string array of selectable colors
  colors: string[];

  /*variable to get, which component the dialog opened. It causes different changes in other components */
  element: string;

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //fetching sending element
    this.element = data.element;
    this.colors = ["red", "blue", "green", "yellow", "orange", "lightgreen", "lightblue"];
  }

  //initilizing form for category creation with needed values title and color
  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]],
      color: ['', [
        Validators.required,
      ]]
    });
  }

  //getting input from form and call service to create a new category
  onCommit() {
    let category = new CategoryModel();
    category.title = this.categoryForm.get("title").value;
    category.color = this.categoryForm.get("color").value;
    this.catService.createCategory(category).subscribe((data: any) => {
      this.catService.categoriesChanged(this.element);
      this.dialogRef.close();
    });
  }

  //closes window on clicking abort
  onClose() {
    this.dialogRef.close();
  }

  //getter for form validation
  get title() {
    return this.categoryForm.get("title");
  }

}
