import { Component, ViewChild, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from './service/layout.service';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import { MenubarModule } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { UserService } from '../services/user/user.service';
import { response } from 'express';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, DropdownModule, MenuModule, OverlayPanelModule, OverlayModule, MenubarModule, TabsModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- SVG content -->
                </svg>
                <span style="text-align: center; color: green;">m1p12mean-Divno-Michael</span>
            </a>
        </div>
        <!-- <div class="layout-topbar-center">
            <p-tabs [value]="0">
                <p-tablist>
                    <p-tab [value]="0">Header I</p-tab>
                    <p-tab [value]="1">Header II</p-tab>
                    <p-tab [value]="2">Header III</p-tab>
                </p-tablist>
            </p-tabs>
        </div> -->
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button #profileButton type="button" class="layout-topbar-action" (click)="toggleProfileMenu()">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <ng-template
                        cdkConnectedOverlay
                        [cdkConnectedOverlayOrigin]="profileButton"
                        [cdkConnectedOverlayOpen]="isProfileMenuOpen"
                        [cdkConnectedOverlayPositions]="overlayPositions"
                        cdkConnectedOverlayHasBackdrop
                        (backdropClick)="closeProfileMenu()"
                    >
                        <p-menu [model]="profileOptions"></p-menu>
                    </ng-template>
                </div>
            </div>
        </div>
    </div>`,
    styles: [
        `
            .layout-topbar-center {
                display: flex;
                justify-content: center;
                flex-grow: 1;
            }
        `
    ]
})
export class AppTopbar {
    items!: MenuItem[];
    profileOptions: MenuItem[] = [
        // { label: 'View Profile', icon: 'pi pi-user', command: () => this.viewProfile() },
        // { label: 'Settings', icon: 'pi pi-cog', command: () => this.openSettings() },
        { label: 'Deconnexion', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];

    isProfileMenuOpen = false;

    @ViewChild('profileButton') profileButton!: ElementRef;

    overlayPositions: ConnectedPosition[] = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' }
    ];

    constructor(public layoutService: LayoutService, public userService: UserService, private router : Router) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    viewProfile() {
        // Logic to view profile
    }

    openSettings() {
        // Logic to open settings
    }

    logout() {
        this.userService.logout().subscribe(
            (response => {
                if(response.st == "yes"){
                    localStorage.removeItem('auth_token');
                    window.location.reload();
                    // this.router.navigate(['/']);
                }
            })
        )
    }

    toggleProfileMenu() {
        this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }

    closeProfileMenu() {
        this.isProfileMenuOpen = false;
    }
}
