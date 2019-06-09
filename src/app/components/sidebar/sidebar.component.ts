import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { CreateCategoryComponent } from '../create-category-dialog/create-category.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categories: CategoryModel[] = [];
  categorie: CategoryModel;
  checked: boolean[] = [];
  sub:Subscription;

  constructor(
    private catService: CategoryService,
    private dialog: MatDialog,
  ) {
    this.loadCategories();
    this.categorie = new CategoryModel();   
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  ngOnInit() {
  //fetching if a choosen category changed
    this.sub = this.catService.currentMessage.subscribe(message => {
      if (message == "sidebar changed") {
        console.log("categories changed");
        setTimeout(() => { this.loadCategories() }, 200);
      }
    });
  }

  //load categorie and create array for choices
  async loadCategories() {
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;

    for (let i = 0; i < this.categories.length; i++) {
      this.checked[i] = true;
    }

    this.catService.setChoosen(this.checked);
  }

  //open dialog to create new category
  onCreateCategory() {
    this.dialog.open(CreateCategoryComponent, {
      data: {
        element: "sidebar",
      }
    });
  }

  //update if a checkbox changed
  onChange(index: number) {
    this.checked[index] = !this.checked[index];
    this.catService.setChoosen(this.checked);
  }
}
