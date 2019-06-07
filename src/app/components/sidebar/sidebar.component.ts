import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categories: CategoryModel[] = [];

  constructor(private catService:CategoryService) { 
      this.catService.fetchCategories().subscribe((data:any) => {
        this.categories= data.category;
      });
  }


  ngOnInit() {
    
  }
}
