/*
 * Component for displaying the sidebar on the left side. It contains a button for
 * creating a new appointment, a list of checkboxes to select which categories 
 * should be displayed in the calendar and a button for creating a new category.
 */

import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { CreateCategoryComponent } from '../create-category-dialog/create-category.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  //array with all categories f the user to display them as checkboxes
  categories: CategoryModel[] = [];

  //array of booleans for each category to store if they are checked or not
  checked: boolean[] = [];

  //subscribtion for the category service to get changes
  categorySubscription: Subscription;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
  ) {
    this.loadCategories();
  }

  //unsubscribe if the component is destroyed
  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
  }

  ngOnInit() {
    //check if a selection of a category has changed to get the new categories and display them
    this.categorySubscription = this.categoryService.currentMessage.subscribe(message => {
      if (message == "sidebar changed") {
        setTimeout(() => { this.loadCategories() }, 200);
      }
    });
  }

  /*load categorie and create array for selection of each category. set the selection in
    the category service.*/
  async loadCategories() {
    const data = await this.categoryService.fetchCategories().toPromise();
    this.categories = data;

    for (let i = 0; i < this.categories.length; i++) {
      this.checked[i] = true;
    }

    this.categoryService.setChoosen(this.checked);
  }

  //open dialog to create a new category
  onCreateCategory() {
    this.dialog.open(CreateCategoryComponent, {
      data: {
        element: "sidebar",
      }
    });
  }

  //update service if a checkbox changed
  onChange(index: number) {
    this.checked[index] = !this.checked[index];
    this.categoryService.setChoosen(this.checked);
  }
}
