import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from './services/auth.service';
// import {Paper} from 'paper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  "styles": [
    "../node_modules/bootstrap/dist/css/bootstrap.min.css",
    "styles.css"
  ]
})
export class AppComponent implements AfterViewChecked {


  constructor(public auth: AuthService,
              private changeDetector: ChangeDetectorRef) { }

  // This fixes: https://github.com/DavideViolante/Angular-Full-Stack/issues/105
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

}
