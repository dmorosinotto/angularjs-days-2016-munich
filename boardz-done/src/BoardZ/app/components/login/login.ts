import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {LoginService} from '../../services/login.service';
import {LogService} from '../../services/log.service';
import {NotificationService} from '../../services/notification.service';
import {SignalRService} from '../../services/signalr.service';

@Component({
    templateUrl: 'app/components/login/login.html'
})
export class LoginForm {
    private _userName: string;
    private _password: string;

    public _hasError: boolean = false;
    
    constructor(private _router: Router,
                private _loginService: LoginService,
                private _logService: LogService,
                private _notificationService: NotificationService,
                private _signalRService: SignalRService) {
    }

    public doLogin(): void {
        this._logService.logDebug('LoginForm.doLogin called');
        
        this._loginService.login(this._userName, this._password)
            .subscribe(
                () => {
                    this._signalRService.start();
                    this.setError(false);
                    this._router.navigate(['Dashboard'])
                },
                () => {
                    this.setError(true);
                    this._notificationService.notifyError('Login was unsuccessful.');
                }
            );
    }

    setError(value: boolean) {
        this._logService.logDebug('LoginForm.setError: Setting error state to: ' + value);
        this._hasError = value;
    }
}
