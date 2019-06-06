//Class copied from https://stackoverflow.com/questions/51605737/confirm-password-validation-in-angular-6
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
      const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
  
      return (invalidCtrl || invalidParent);
    }
  }
