import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/app.floatingconfigurator';
import { UserService } from '../../services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TabsModule],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <p-tabs [(value)]="activeTab" (valueChange)="onTabChange($event)">
                    <p-tablist>
                        <p-tab [value]="0">Client</p-tab>
                        <p-tab [value]="1">Mécanicien</p-tab>
                        <p-tab [value]="2">Manager</p-tab>
                    </p-tablist>
                </p-tabs>
                <div style="border-radius: 56px; margin-top: 50px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">m1p12mean-Divno-Michael</div>
                            <span class="text-muted-color font-medium">Connectez-vous pour continuer</span>
                        </div>

                        <div>
                            <form (ngSubmit)="login()">
                                <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nom d'utilisateur</label>
                                <input pInputText id="email1" type="text" name="username" placeholder="Nom d'utilisateur" class="w-full md:w-[30rem] mb-8" [(ngModel)]="authUser.username" />

                                <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                                <p-password id="password1" name="password" [(ngModel)]="authUser.password" placeholder="Mot de passe" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                                <p class="text-red-500">{{ message }}</p>

                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <!-- <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label> -->
                                        <!-- <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Mot de passe oublié ?</span> -->
                                    </div>

                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" routerLink="/auth/signup">S'inscrire?</span>
                                </div>
                                <p-button type="submit" label="Connexion" styleClass="w-full" routerLink="/"></p-button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    user: any = {};

    authUser = { username: '', password: '' };

    checked: boolean = false;

    message = '';

    activeTab: number = 0;

    constructor(
        private userService: UserService,
        private router: Router,
        private as: AuthService
    ) {}

    ngOnInit(): void {
        this.setDefaultCredentials(this.activeTab); // Définir les valeurs par défaut au chargement
    }

    onTabChange(tabIndex: number | string): void {
        this.setDefaultCredentials(Number(tabIndex)); // Conversion explicite en number
    }

    setDefaultCredentials(tabIndex: number): void {
        switch (tabIndex) {
            case 0:
                this.authUser.username = 'rakoto';
                this.authUser.password = 'password';
                break;
            case 1:
                this.authUser.username = 'rabe';
                this.authUser.password = 'password';
                break;
            case 2:
                this.authUser.username = 'rasoa';
                this.authUser.password = 'password';
                break;
            default:
                this.authUser.username = '';
                this.authUser.password = '';
        }
    }

    login(): void {
        this.userService.login(this.authUser).subscribe(
            (response) => {
                if (response.data == 'client') {
                    this.router.navigate(['client/vehicule']);
                }
                if (response.data == 'mécanicien') {
                    this.router.navigate(['mechanics/dashboard']);
                }
                if (response.data == 'manager') {
                    this.router.navigate(['manager/dashboard']);
                }
                console.log('Réponse :', response);
            },
            (error) => {
                if (error.status === 401) {
                    this.message = error.error.message;
                } else {
                    this.message = error.error.message;
                }
            }
        );
    }
}
