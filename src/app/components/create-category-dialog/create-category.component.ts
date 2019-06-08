import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CategoryModel } from 'src/models/category.model';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  categoryForm: FormGroup;

  colors: string[];

  constructor(
    private formBuilder: FormBuilder,
    private catService: CategoryService,
    private dialogRef: MatDialogRef<CreateCategoryComponent>
  ) { 
    this.colors = ["red", "blue", "green", "yellow", "orange", "lightgreen", "lightblue"];
  }

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

  //calling service to create a new category
  onCommit(){
    console.log(this.categoryForm.get("title").value);
    
    let category = new CategoryModel();
		category.title = this.categoryForm.get("title").value;	
		category.color = this.categoryForm.get("color").value;
		this.catService.createCategory(category).subscribe((data:any)=>{
      console.log(data);
      this.dialogRef.close();
		});   
  }

  onClose(){
    this.dialogRef.close();  
  }

  get title(){
    return this.categoryForm.get("title");
  }
  
}
