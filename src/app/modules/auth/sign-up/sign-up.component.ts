import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
   selector: 'auth-sign-up',
   templateUrl: './sign-up.component.html',
   encapsulation: ViewEncapsulation.None,
   animations: fuseAnimations
})

export class AuthSignUpComponent implements OnInit {
   @ViewChild('signUpNgForm') signUpNgForm: NgForm;

   alert: { type: FuseAlertType; message: string } = {
      type: 'success',
      message: ''
   };
   signUpForm: UntypedFormGroup;
   showAlert: boolean = false;

   /**
    * Constructor
    */
   constructor(
      private _authService: AuthService,
      private _formBuilder: UntypedFormBuilder,
      private _router: Router
   ) {
   }

   ngOnInit(): void {
      this.signUpForm = this._formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', Validators.required],
            phone: ['', Validators.required],
            password: ['', Validators.required]
         }
      );
   }

   signUp(): void {
      if (this.signUpForm.invalid) {
         return;
      }

      // Disable the form
      this.signUpForm.disable();

      // Hide the alert
      this.showAlert = false;

      // Sign up
      this._authService.signUp(this.signUpForm.value)
         .subscribe(
            (response) => {

               // Navigate to the confirmation required page
               this._router.navigateByUrl('/confirmation-required');
            },
            (response) => {

               // Re-enable the form
               this.signUpForm.enable();

               // Reset the form
               this.signUpNgForm.resetForm();

               // Set the alert
               this.alert = {
                  type: 'error',
                  message: 'Something went wrong, please try again.'
               };

               // Show the alert
               this.showAlert = true;
            }
         );
   }
}