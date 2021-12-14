import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss']
})
export class UserPopupComponent implements OnInit {
  userData = new FormGroup({
    id: new FormControl(),
    email: new FormControl(),
    role: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<UserPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data && this.data?.user) {
      this.userData.patchValue(this.data.user);
    }
  }


  onSubmit() {
    const user = this.userData.getRawValue();
    this.dialogRef.close(user);
  }

}
