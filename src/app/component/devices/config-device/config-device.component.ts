import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../shared/service/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-config-device',
  templateUrl: './config-device.component.html',
  styleUrls: ['./config-device.component.css']
})
export class ConfigDeviceComponent {

  form !: FormGroup;
  title !: string;
  type !: string;
  id !: string;
  buttonName !: string;
  lightpower!: number | null;
  temperature!: number | null;
  power!: number | null;
  private formSubscription: Subscription | undefined;

  constructor (private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data : any,
    private dialogRef : MatDialogRef<ConfigDeviceComponent>,
    private dataService: DataService
  ) {
    this.title = data.title;
    this.id = data.id;
    this.type = data.type;
    this.buttonName = data.buttonName;
    this.lightpower = data.datas?.lightpower || null;
    this.temperature = data.datas?.temperature || null;
    this.power = data.datas?.power || null;
    console.log("Power lekerve: "+this.power);
    console.log("Type lekerve: "+this.type);
    
    this.initializeForm();
  }


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

/*
  initializeForm(): void {
    this.form = this.fb.group({
        id: [this.id],
        datas: this.fb.group({
            health: [this.health, Validators.required],
            mana: [this.mana]
        }),
        displayedHealth: [this.health]
    });
}*/

initializeForm(): void {
  this.form = this.fb.group({
      id: [this.id],
      datas: this.fb.group({
        lightpower: [this.type === 'Lámpa' ? this.lightpower : 0, [Validators.required, Validators.min(10), Validators.max(100)]],
        temperature: [this.type === 'Klíma' ? this.temperature : 0,[Validators.required,Validators.min(10),Validators.max(30)]],
        power: [this.power,[Validators.required,Validators.min(1),Validators.max(2)]]
      })
  });

  //nem vesszuk figyelembe, a clearValidators torli az initializeFormban levot, ez typera szures
  if (this.type === 'Lámpa') {
    this.form.get('datas.temperature')?.clearValidators();
    this.form.get('datas.temperature')?.updateValueAndValidity();
  } else if (this.type === 'Klíma') {
    this.form.get('datas.lightpower')?.clearValidators();
    this.form.get('datas.lightpower')?.updateValueAndValidity();
  }
}

updateDatas(type: string): void {
  const datasGroup = this.form.get('datas') as FormGroup;

  if (type === 'Lámpa') {
      datasGroup.removeControl('temperature');
  } else if (type === 'Klíma' && !datasGroup.get('temperature')) {
      datasGroup.addControl('temperature', this.fb.control(this.temperature || 0));
  } else if (type === 'Lámpa' && datasGroup.get('temperature')) {
      datasGroup.get('temperature')?.setValue(null); 
  }
}

  cancelRegistration() {
    this.dialogRef.close();

  }


registerDevice() {

  const formData = this.form.value;
  const lightpowerValue = formData.datas?.lightpower;
  const temperatureValue = formData.datas?.temperature;
  const powerValue = formData.datas?.power;

  
  if (this.type === 'Lámpa' && !isNaN(lightpowerValue) && lightpowerValue > 9 && lightpowerValue < 101 && !isNaN(powerValue) && powerValue > 0 && powerValue < 3)  {
    console.log('lightpower value:', lightpowerValue);
    const dataToUpdate = { datas: { lightpower: lightpowerValue, power: powerValue } };
    
    this.dataService.configureDevice({ id: this.id, ...dataToUpdate }).subscribe(() => {
      console.log('updated!');
      this.dialogRef.close(dataToUpdate);
    });


  } else if (this.type === 'Klíma' && !isNaN(temperatureValue) && temperatureValue > 9 && temperatureValue < 31 && !isNaN(powerValue) && powerValue > 0 && powerValue < 3 ) { 
    console.log('temperature value:', temperatureValue);
    const dataToUpdate = { datas: { temperature: temperatureValue, power: powerValue } };

    
    this.dataService.configureDevice({ id: this.id, ...dataToUpdate }).subscribe(() => {
      console.log('updated!');
      this.dialogRef.close(dataToUpdate);
    });
  } else {
    console.log('value is undefined.');
    // A "Mentés" gomb letiltása
    this.dialogRef.disableClose = true;
    return; 
  }

  // A "Mentés" gomb engedélyezése
  this.dialogRef.disableClose = false;
}




onHealthKeyUp() {
  console.log('Type:', this.type);
}

}
