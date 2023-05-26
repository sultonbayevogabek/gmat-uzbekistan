import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
   selector: 'auth-sign-in',
   templateUrl: './sign-in.component.html',
   encapsulation: ViewEncapsulation.None,
   animations: fuseAnimations
})

export class AuthSignInComponent implements OnInit {
   @ViewChild('signInNgForm') signInNgForm: NgForm;

   alert: { type: FuseAlertType; message: string } = {
      type: 'success',
      message: ''
   };
   signInForm: UntypedFormGroup;
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
      this.signInForm = this._formBuilder.group({
            phone: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
         }
      );
   }

   signUp(): void {
      if (this.signInForm.invalid) {
         return;
      }

      // Disable the form
      this.signInForm.disable();

      // Hide the alert
      this.showAlert = false;

      // Sign up
      this._authService.signUp(this.signInForm.value)
         .subscribe(
            () => {

               // Navigate to the confirmation required page
               this._router.navigateByUrl('/confirmation-required');
            },
            () => {

               // Re-enable the form
               this.signInForm.enable();

               // Reset the form
               this.signInNgForm.resetForm();

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
