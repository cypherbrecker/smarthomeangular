import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {

  form !: FormGroup;
  title !: string;

  name !: string;
  type !: string;
  room !: string;
  id !: string;
  created: Date = new Date();
  buttonName !: string;

  rooms : string[] = ["Hálószoba1", "Hálószoba2", "Konyha", "Nappali", "Fürdőszoba", "Garázs"];
  types : string[] = ["Klíma", "Lámpa"];
  private formSubscription: Subscription | undefined;

  constructor (private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data : any,
    private dialogRef : MatDialogRef<AddDeviceComponent>
  ) {
    this.title = data.title;
    this.id = data.id;
    this.name = data.name;
    this.created = data.created;
    this.type = data.type;
    this.room = data.room;
    this.buttonName = data.buttonName;

  }
/*
  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required]],
      mobile : ['', [Validators.required]],
      gender : ['', [Validators.required]],
      department : ['', Validators.required]
    })
  }*/

 /* ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(): void {
    this.form = this.fb.group({
      id: [this.id],
      name: [this.name, Validators.required],
      type: [this.type, Validators.required],
      created: [this.created],
      room: [this.room, Validators.required],
      datas: this.fb.group({
        lightpower: [this.type === 'Lámpa' ? 90 : null], 
        mana: [this.type === 'Klíma' ? 66 : null] 
      })
    });
  }*/

  ngOnInit(): void {
    this.initializeForm();
    this.form.get('type')?.valueChanges.subscribe((value) => {
      this.updateDatas(value);
    });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
  
  initializeForm(): void {
    this.form = this.fb.group({
      id: [this.id],
      name: [this.name, Validators.required],
      type: [this.type, Validators.required],
      created: [this.created],
      room: [this.room, Validators.required],
      datas: this.fb.group({
        lightpower: [null],
        temperature: [null],
        power: [null]
      })
    });
    
    if (this.title === "Eszköz szerkesztése") {
      this.form.get('type')?.disable();
    }
  }
  
  updateDatas(type: string): void {
    // datas resz frissitese tipusnak megfeleloen
    const datasGroup = this.form.get('datas') as FormGroup; // castoljuk a FormGroup típusra
  
    // lightpower visszahelyezese ha nincs benne meg
    if (!datasGroup.get('lightpower')) {
      datasGroup.addControl('lightpower', this.fb.control(null));
    }
    if (!datasGroup.get('temperature')) {
      datasGroup.addControl('temperature', this.fb.control(null));
    }
  
    if (type === 'Lámpa') {
      datasGroup.get('temperature')?.setValue(null); // lampa eseten a temp. erteket null-ra állítjuk
      datasGroup.get('lightpower')?.setValue(50); // lampa eseten a lightpower erteket állítjuk be
      datasGroup.removeControl('temperature'); // lampa eseten eltavolitjuk a temp. adattagot
      datasGroup.get('power')?.setValue(1);
    } else if (type === 'Klíma') {
      datasGroup.get('lightpower')?.setValue(null); // klima eseten a lightpower erteket null-ra állítjuk
      datasGroup.get('temperature')?.setValue(15); // klima eseten a temp. erteket állítjuk be
      datasGroup.removeControl('lightpower'); // klima eseten eltavolitjuk a lightpower adattagot
      datasGroup.get('power')?.setValue(1);
    } else {
      // egyeb esetekben mindket adattagot eltavolitjuk
      datasGroup.removeControl('lightpower');
      datasGroup.removeControl('temperature');
    }
  }


  cancelRegistration() {
    this.dialogRef.close();
  }

  registerDevice() {
    this.dialogRef.close(this.form.value);
  }
  
}
