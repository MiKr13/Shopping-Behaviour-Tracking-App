import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { BackendService } from 'src/app/services/backend.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'ShopEasy';
  @Input() pageTitle: string;
  @Input() iconTitle: string;
  @Input() activeToggle: string;
  @Input() helpText: string;
  counter = 0;
  userStatusColor = 'accent';
  userStatus = 'Login/Signup';
  userRole: string;
  adminView: boolean;
  roleCookie: any;
  private querySubscription: any;
  search: string;
  validator: RegExp;

  constructor(private backendService: BackendService, private dialog: MatDialog, private _router: Router) { }

  ngOnInit() {
    this.search = 'Hey';
    this.querySubscription = this.backendService.getUserStatus().subscribe((res: Array<any>) => {
      this.userStatusColor = res[0] === 'true' ? 'primary' : 'accent';
      this.userStatus = res[0] === 'true' ? 'Your account section' : 'Login/Signup';
      this.userRole = res[1];
      if (this.userRole === 'admin') {
        this.adminView = true;
      } else {
        this.adminView = false;
        this.backendService.getCartTotal().subscribe((res2: number) => {
          this.counter = res2;
        });
      }
    });
  }

  private navigate = (data: string) => {
    const validator = `^[a-z ]+$`;
    if (data.match(validator)) {
      data = data.split(' ').join('+');
      this._router.navigate([`search/:${data}`]);
    } else {
      data = data.replace(/[`~!@#$%^&*()+_|\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      data = data.split(' ').filter(el => el.length !== 0).join('+');
      this._router.navigate([`search/:${data}`]);
    }
  }

  routeToProduct($event): void {
    this.search = $event.target.value;
    this.navigate(this.search);
  }

  openDialog(): void {
    if (this.search === undefined) { this.search = ''; }
    const dialogRef = this.dialog.open(DialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.search = result;
      this.navigate(this.search);
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}