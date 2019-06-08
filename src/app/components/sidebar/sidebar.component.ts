import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { CreateCategoryComponent } from '../create-category/create-category.component';
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

  //load categorie
  async initCategories() {
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;

    for (let i = 0; i < this.categories.length; i++) {
      this.checked[i] = true;
    }
  }

  //open dialog to create new category
  onCreateCategory() {
    this.dialog.open(CreateCategoryComponent);
  }

  onChange(id: string, index: number) {
    this.checked[index] = this.checked[index];

  }
}
