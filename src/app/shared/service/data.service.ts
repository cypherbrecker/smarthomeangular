import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth.service';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap,concatMap  } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class DataService {
 

  constructor(private authService: AuthService, private asf : AngularFirestore) { }

  addDevice(device: any): Observable<any> {
    device.id = this.asf.createId();
  
    return from(this.authService.getCurrentUserId()).pipe(
      concatMap(userId => {
        if (userId) {
          const deviceDocRef = this.asf.collection("Device").doc(device.id);
          const saveDevice = deviceDocRef.set(device);
  
          const userCollectionRef = this.asf.collection("UserDevice").doc(userId).collection("Device");
          const saveUserDevice = userCollectionRef.doc(device.id).set(device);
  
          return from(Promise.all([saveDevice, saveUserDevice])).pipe(
            concatMap(() => {
              console.log("save:" + saveDevice);
              return from(saveDevice);
            })
          );
        } else {
          console.log("Nincs bejelentkezett felhasználó!");
          return new Observable(); // ures observable visszaadasa
        }
      })
    );
  }
  

  async getAllDevices(): Promise<Observable<any[]>> {
    try {
      return from(this.authService.getCurrentUserId()).pipe(
        switchMap(userId => {
          if (userId) {
            return this.asf.collection("UserDevice").doc(userId).collection("Device").snapshotChanges().pipe(
              map(actions => {
                if (actions.length > 0) {
                  return actions.map(action => {
                    const data = action.payload.doc.data();
                    const id = action.payload.doc.id;
                    return { id, ...data };
                  });
                } else {
                  console.log("snapshot ures.");
                  return [];
                }
              }),
              catchError(error => {
                console.log("hiba tortent: ", error);
                return of([]); // ures tomb, ha hiba vant
              })
            );
          } else {
            console.log("Nincs bejelentkezett felhasználó!");
            return of([]); // ures tomb, ha nincs bejelentkezett felh.
          }
        })
      );
    } catch (error) {
      console.log("Hiba tortent: ", error);
      return of([]); // ures tomb, ha hiba
    }
  }


  updateDevice(device: any): Observable<void> {
    const { id, ...updateData } = device; 
  
    return from(this.authService.getCurrentUserId()).pipe(
      switchMap(userId => {
        if (userId) {
          const deviceDocRef = this.asf.collection("Device").doc(id);
          const saveDevice = deviceDocRef.update(updateData);
  
          const userCollectionRef = this.asf.collection("UserDevice").doc(userId).collection("Device");
          const saveUserDevice = userCollectionRef.doc(id).update(updateData); 
  
          return from(Promise.all([saveDevice, saveUserDevice])).pipe(
            concatMap(() => {
              console.log("updatelve!");
              return of(undefined); //ures observable a végén
            })
          );
        } else {
          console.log("Nincs bejelentkezett felhasználó!");
          return of(undefined); // ures observable a végén
        }
      })
    );
  }


  configureDevice(device: any): Observable<void> {
    const { id, ...updateData } = device;

    return from(this.authService.getCurrentUserId()).pipe(
      switchMap(userId => {
        if (userId) {
          const deviceDocRef = this.asf.collection("Device").doc(id);
          const saveDevice = deviceDocRef.update(updateData); 
  
          const userCollectionRef = this.asf.collection("UserDevice").doc(userId).collection("Device");
          const saveUserDevice = userCollectionRef.doc(id).update(updateData); 
  
          return from(Promise.all([saveDevice, saveUserDevice])).pipe(
            concatMap(() => {
              console.log("configured!!");
              return of(undefined); // ures observable a végén
            })
          );
        } else {
          console.log("Nincs bejelentkezett felhasználó!");
          return of(undefined); // ures observable a végén
        }
      })
    );
  }


  deleteDevice(id: string): Observable<void> {
    return from(this.authService.getCurrentUserId()).pipe(
      switchMap(userId => {
        if (userId) {
          const deviceDocRef = this.asf.collection("Device").doc(id);
          const deleteDevice = deviceDocRef.delete(); 
  
          const userCollectionRef = this.asf.collection("UserDevice").doc(userId).collection("Device");
          const deleteUserDevice = userCollectionRef.doc(id).delete();
  
          return from(Promise.all([deleteDevice, deleteUserDevice])).pipe(
            concatMap(() => {
              console.log("deleted!");
              return of(undefined); // ures observable a végén
            })
          );
        } else {
          console.log("Nincs bejelentkezett felhasználó!");
          return of(undefined); // ures observable a végén
        }
      })
    );
  }

  getDeviceById(id : string) {
    return this.asf.doc("Device/"+id).valueChanges();
  }
}
