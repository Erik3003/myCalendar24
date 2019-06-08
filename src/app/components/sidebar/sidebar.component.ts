import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { CreateCategoryComponent } from '../create-category-dialog/create-category.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categories: CategoryModel[] = [];
  checked: boolean[] = [];

  constructor(private catService: CategoryService, private dialog: MatDialog) {
    this.initCategories();
  }

  ngOnInit() {

  }

  //load categorie and create array for choices
  async initCategories() {
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;
    
    for (let i = 0; i < this.categories.length; i++) {
      this.checked[i] = true;
    }

    this.catService.setChoosen(this.checked);
    this.catService.setCategories(this.categories);
  }

  //open dialog to create new category
  onCreateCategory() {
    this.dialog.open(CreateCategoryComponent);
  }

  //update if a checkbox changed
  onChange(index: number) {
    this.checked[index] = !this.checked[index];
    console.log(this.categories[index]._id+" is "+this.checked[index]);
    this.catService.setChoosen(this.checked);
  }
}
