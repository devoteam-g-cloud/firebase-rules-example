import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentData, DocumentReference, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { }



  async createUser(user: any): Promise<string> {
    const claims = await this.afAuth.currentUser;
    const uid = claims?.uid;
    const docRef: DocumentReference<DocumentData> | any = await this.db.collection(environment.userPath).add(
      {
        ...user,
        uid: claims?.uid 
        // this uid will be used to compare it with the request uid.
      }
    );
      return docRef.id
  }


  async updateUser(user: any) {
    const claims = await this.afAuth.currentUser;
    const uid = claims?.uid;
    await this.db
      .collection(environment.userPath)
      .doc(user.id).update({
        ...user,
        canUpdate: true // having that the current user is an admin or has some specific permission that can replace 'canUpdate'
      });
    return;
  }


  async listUsers(): Promise<any[]> {
    const querySnap: any = await this.db
      .collection(environment.userPath)
      .get().toPromise();
    const listUsers: any[] = [];
    querySnap.docs.forEach((value: QueryDocumentSnapshot<any>) => {
      const data: any = value.data();
      data.id = value.id;
      listUsers.push(data);
    });
    return listUsers;
  }


}
