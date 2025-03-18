import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/app.floatingconfigurator';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, DropdownModule],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">m1p12mean-Divno-Michael</div>
                            <span class="text-muted-color font-medium">Inscription</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Adresse email" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="role" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Rôle</label>
                            <p-dropdown id="role" [options]="roles" [(ngModel)]="selectedRole" placeholder="Sélectionner un rôle" class="w-full md:w-[30rem] mb-8"></p-dropdown>

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Mot de passe" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <label for="password2" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmer votre mot de passe</label>
                            <p-password id="password2" [(ngModel)]="password_confirmed" placeholder="Confirmer votre mot de passe" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8"></div>
                            <p-button label="S'inscrire" styleClass="w-full" routerLink="/"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Signup {
    email: string = '';
    password: string = '';
    password_confirmed: string = '';
    selectedRole: string = '';
    roles: any[] = [
        { label: 'Client', value: 'client' },
        { label: 'Mécanicien', value: 'mecanicien' }
    ];
    checked: boolean = false;
}
