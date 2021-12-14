import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserPopupComponent } from './popup/user-popup/user-popup.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'role', 'action'];
  dataSource: any = new MatTableDataSource([]);
  title = 'front';
  currentUser: any;
  users: any[] = [
  ]
  constructor(private api: ApiService, private dialog: MatDialog, private auth: AuthService) {}


  ngOnInit() {
    this.currentUser = this.auth.currentUser();
    this.auth.authenticationState.subscribe(r => {
      if(r) {
        this.currentUser = r;
      }
    })
    this.getUsers();
  }


  editUser(user: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60vh';
    dialogConfig.data = {
      title: 'User form',
      user
    };
    this.dialog
      .open(UserPopupComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if(result) {
          this.api.updateUser(result).then(r => {
            this.getUsers();
          }).catch(e => {
            console.log("e ?", e)
          })
        }
      });
  }


  newUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60vh';
    dialogConfig.data = {
      title: 'User form'
    };
    this.dialog
      .open(UserPopupComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if(result) {
          delete result.id
          this.api.createUser(result).then(r => {
            this.getUsers();
          }).catch(e => {
            console.log("e ?", e)
          })
        }
      });
  }


  getUsers() {
    this.api.listUsers().then(r => {
      this.users = r;
      this.dataSource = new MatTableDataSource(this.users);
    }).catch(e => {
      console.log("e ?", e)
    })
  }
}
