import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-device',
  templateUrl: './delete-device.component.html',
  styleUrls: ['./delete-device.component.css']
})
export class DeleteDeviceComponent {
  deviceName !: string;
  title !: string;

  constructor (@Inject(MAT_DIALOG_DATA) data: any, private dialogRef: MatDialogRef<DeleteDeviceComponent>) {
    this.deviceName = data.deviceName;
    this.title = data.title;
  }

  close() {
    this.dialogRef.close();

  }

  delete() {
    const deleteDevice = true;
    this.dialogRef.close(this.delete)
  }

}
