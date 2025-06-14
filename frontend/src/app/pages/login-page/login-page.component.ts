import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { dispatch } from '@ngxs/store';
import { Loader, LucideAngularModule } from 'lucide-angular';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import {
  CredentialSignInSchema,
  CredentialSignUpSchema,
} from '../../../models/schemas';
import { CredentialSignIn, CredentialSignUp } from '../../state/auth.actions';
import { concatMap } from 'rxjs';

@Component({
  selector: 'ot-login-page',
  imports: [
    RouterLink,
    LucideAngularModule,
    NgClass,
    ReactiveFormsModule,
    NgTemplateOutlet,
    RecaptchaV3Module,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  Loader = Loader;
  signingIn = signal(false);
  signUpForm = new FormGroup({
    names: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [
      Validators.email,
      Validators.required,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    tCAgreement: new FormControl(false, [Validators.requiredTrue]),
  });
  signInForm = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });
  submitting = signal(false);
  private credentialSignUp = dispatch(CredentialSignUp);
  private credentialSignIn = dispatch(CredentialSignIn);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recaptchaService = inject(ReCaptchaV3Service);

  onSignUpFormSubmitted(event: SubmitEvent) {
    event.preventDefault();
    this.submitting.set(true);
    const input = CredentialSignUpSchema.parse(this.signUpForm.value);
    this.recaptchaService
      .execute('signUp')
      .pipe(concatMap((token) => this.credentialSignUp(token, input)))
      .subscribe({
        error: (e: Error) => {
          this.submitting.set(false);
          alert(e.message);
        },
        complete: () => {
          this.submitting.set(false);
          this.signInForm.setValue({
            password: input.password,
            email: input.email,
          });
          this.signUpForm.reset();
          alert('Sign up successful!');
          this.signingIn.set(true);
        },
      });
  }

  onSignInFormSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.submitting.set(true);
    const input = CredentialSignInSchema.parse(this.signInForm.value);
    this.recaptchaService
      .execute('signIn')
      .pipe(concatMap((token) => this.credentialSignIn(token, input)))
      .subscribe({
        error: (e: Error) => {
          this.submitting.set(false);
          alert(e.message);
        },
        complete: () => {
          this.submitting.set(false);
          const redirect = decodeURIComponent(
            this.route.snapshot.queryParamMap.get('continue') ?? '/'
          );
          this.router.navigateByUrl(redirect);
        },
      });
  }
}
