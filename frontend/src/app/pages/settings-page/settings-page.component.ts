import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dispatch, select } from '@ngxs/store';
import { Loader, LucideAngularModule } from 'lucide-angular';
import { DeleteAccount } from '../../state/auth.actions';
import { principal } from '../../state/selectors';
import { isActionLoading } from '../../state/loading.plugin';

@Component({
  selector: 'ot-settings-page',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent {
  Loader = Loader;
  principal = select(principal);
  // deletingAccount = signal(false);
  showPasswordInput = signal(false);
  password = model<string>();
  private deleteAccount = dispatch(DeleteAccount);
  deletingAccount = isActionLoading(DeleteAccount);

  onEmailNotifyCheckBoxChanged(v: boolean) {}

  onDeleteButtonClicked() {
    if (!this.showPasswordInput()) this.showPasswordInput.set(true);
    else this.onPasswordFormSubmit();
  }

  onPasswordFormSubmit(event?: SubmitEvent) {
    event?.preventDefault();
    const password = this.password();
    if (!password) return;

    this.deleteAccount(password).subscribe({
      error: (e: Error) => {
        alert(e.message);
      },
      complete: () => {
        this.showPasswordInput.set(false);
      },
    });
  }
}
