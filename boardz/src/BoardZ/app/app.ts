import {Component, AfterViewInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {LoginForm} from './components/login/login';
import {Dashboard} from './components/dashboard/dashboard';
import {Sidebar} from './components/sidebar/sidebar';
import {HeaderComponent} from './components/header/header';
import {Games} from './components/games/games';
import {Notifications} from './components/notifications/notifications';
import {APP_SERVICES} from './services/all';
import {RadiusSearchComponent} from './components/radiussearch/radiussearch';
import {LogService} from './services/log.service';
import {LogLevel} from './models/loglevel';
import {SignalRService} from './services/signalr.service';
import {LoginService} from './services/login.service';
import {NotificationService} from './services/notification.service';
import {UiNotificationService} from './services/ui.notification.service';
import {PlatformInformationService} from "./services/platform.information.service";
import {NativeIntegrationService} from "./services/nativeIntegrationService";

@Component({
    selector: 'boardz-app',
    providers: APP_SERVICES,
    directives: [ROUTER_DIRECTIVES, Sidebar, HeaderComponent],
    templateUrl: 'app/app.html'
})
@RouteConfig([
    { path: '/', component: Dashboard, name: 'Dashboard', useAsDefault: true },
    { path: '/login', component: LoginForm, name: 'Login' },
    { path: '/notifications', component: Notifications, name: 'Notifications' },
    { path: '/games/...', component: Games, name: 'Games', data: { displayName: 'Games' } },
    { path: '/radiussearch', component: RadiusSearchComponent, name: 'RadiusSearch' }
])
export class BoardzApp implements AfterViewInit {
    constructor(private _signalRService: SignalRService,
                private _loginService: LoginService,
                private _notificationService: NotificationService,
                private _nativeIntegrationService: NativeIntegrationService,
                private _uiNotificationService: UiNotificationService,
                private _logService: LogService) {
        _logService.maximumLogLevel = LogLevel.Verbose;
        _uiNotificationService.subscribeToNotifications();
        _nativeIntegrationService.init();
    }

    ngAfterViewInit(): any {
        if (window.initAdminLTE) {
            window.initAdminLTE();
        }

        if (this._loginService.isAuthenticated) {
            this._signalRService.start();
        }

        this._signalRService.someoneJoinedAGame.subscribe(message => {
            this._notificationService.notifyInformation(message);
        });
    }
}

interface BoardZAppWindow extends Window {
    initAdminLTE(): void;
}

declare var window: BoardZAppWindow;
