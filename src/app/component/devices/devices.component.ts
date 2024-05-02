import { DialogConfig } from '@angular/cdk/dialog';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddDeviceComponent } from './add-device/add-device.component';
import { DataService } from 'src/app/shared/service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Device } from 'src/app/shared/model/device';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteDeviceComponent } from './delete-device/delete-device.component';
import { firstValueFrom, of, Subscription, Subject  } from 'rxjs';
import { catchError, map, switchMap,concatMap } from 'rxjs/operators';
import { ConfigDeviceComponent } from './config-device/config-device.component';



@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent {
  progressValue = 0; 
  progressColor = 'primary'; 
  type !: string;
  

  devicesArr : Device[] = [];


  dataSource!: MatTableDataSource<Device>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private ngUnsubscribe = new Subject<void>();


  constructor (
    public dialog : MatDialog,
    private dataApi : DataService,
    private _snackBar : MatSnackBar,
  ) {
    this.updateProgress(20);
  }

  updateProgress(value: number) {
    this.progressValue = value;
    this.progressColor = this.calculateColor(value);
  }

  calculateColor(value: number): string {
    // Szín kiszámítása az érték alapján
    if (value >= 75) {
      return 'accent'; // kek szín
    } else if (value >= 50) {
      return 'warn'; // sarga szín
    } else {
      return 'primary'; // default szín
    }
  }

  ngOnInit(): void {
    this.getAllDevice();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  async addDevice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title : 'Eszköz hozzáadása',
      buttonName : 'Hozzáadás'
  }

  const dialogRef = this.dialog.open(AddDeviceComponent, dialogConfig);

  try {
    const data = await firstValueFrom(dialogRef.afterClosed());
    if (data) {
      data.created = new Date();
      await firstValueFrom(this.dataApi.addDevice(data));
      this.openSnackBar("Sikeres","OK");
    }
  } catch (error) {
    console.log('Hiba történt az eszköz hozzáadása közben:', error);
  }
}


  editDevice(row: any) {
    if (row.id == null || row.name == null) {
      return;
    }
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = row;
    dialogConfig.data.title = "Eszköz szerkesztése";
    dialogConfig.data.buttonName = "Mentés";
  
    const dialogRef = this.dialog.open(AddDeviceComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(updatedData => {
      if (updatedData) {
        
        const hasHealthChanged = updatedData.datas && updatedData.datas.health !== undefined && updatedData.datas.health !== null;
        
        //csak akkor kuldjuk el a modositott adatot a szerverre, ha tenylegesen megvaltozott
        if (hasHealthChanged) {
          this.dataApi.updateDevice(updatedData).pipe(
            catchError(error => {
              console.log('Hiba történt az eszköz frissítésekor:', error);
              this.openSnackBar("Hiba", "OK");
              return of(null);
            })
          ).subscribe(() => {
            this.openSnackBar("Sikeres", "OK");
          });
        } else {
          // ha nem valtozott a health, ne kuldjuk el
          const { datas, ...rest } = updatedData; 
          const modifiedData = { ...rest }; 
          this.dataApi.updateDevice(modifiedData).pipe(
            catchError(error => {
              console.log('Hiba történt az eszköz frissítésekor:', error);
              this.openSnackBar("Hiba", "OK");
              return of(null);
            })
          ).subscribe(() => {
            this.openSnackBar("Sikeres", "OK");
          });
        }
      }
    });
  }

  configDevice(row : any) {
    if (row.id == null || row.name == null) {
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = row;
    dialogConfig.data.title = "Eszköz konfigurálása";
    dialogConfig.data.buttonName = "Mentés";

    const dialogRef = this.dialog.open(ConfigDeviceComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(configData => {
      if (configData) {
        
        this.dataApi.configureDevice(configData).pipe(
          catchError(error => {
            console.log('Hiba történt az eszköz frissítésekor:', error);
            this.openSnackBar("Hiba", "OK");
            return of(null); 
          })
        ).subscribe(() => {
        
          this.openSnackBar("Sikeres", "OK");
        });
      }
    });


  }

/*Amikor a felhasználó törölni kíván egy eszközt, először megnyitódik egy párbeszédpanel a DeleteDeviceComponent segítségével, 
amelyben megerősítheti a törlési szándékát. Ha a felhasználó megerősíti a törlési szándékát,
 akkor meghívódik a deleteDevice metódus a data-service.ts fájlból, amely törli az eszközt az adatbázisból. */
  deleteDevice(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title : 'Eszköz törlése',
      deviceName : row.name
    }
  
    const dialogRef = this.dialog.open(DeleteDeviceComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.dataApi.deleteDevice(row.id).subscribe(() => { 
          this.openSnackBar("Sikeres törlés!", "OK");
        }, error => {
          console.log("Hiba történt a törlés során:", error);
          this.openSnackBar("Hiba", "OK");
        });
      }
    });
  }


  async getAllDevice() {
    try {
      const devicesObservable = await this.dataApi.getAllDevices();
      devicesObservable.subscribe({
        next: (res: any[]) => {
          this.devicesArr = res.map((data: any) => {
            const id = data['id'];
            const deviceData = data;
            if (typeof data.created === 'string') {
              const utcDate = new Date(data.created); 
              const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);    
              const formattedDate = localDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
              deviceData.created = formattedDate;
            } else {
              // Egyéb esetben az adatot nem kell átalakítani
              deviceData.created = data.created;
            }

            return { id, ...deviceData };
          });
          console.log(this.devicesArr);
          this.dataSource = new MatTableDataSource(this.devicesArr);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error: any) => {
          console.log("Hiba történt: ", error);
        }
      });
    } catch (error) {
      console.log("Hiba történt: ", error);
    }
  }
  


  
  viewDevice(row : any) {
    //window.open('/dashboard/devices/'+row.id, '_blank');
    window.location.href = '/dashboard/devices/'+row.id;
  }

  openSnackBar(message:string, action:string) {
    this._snackBar.open(message, action);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
