import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {ProductModel, UserModel} from "../models";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userCollection: AngularFirestoreCollection<UserModel>;

  constructor(private firestore: AngularFirestore) {
    this.userCollection = this.firestore.collection('users');
  }

  // Create a new user
  async adduser(user: UserModel): Promise<DocumentReference<UserModel>> {
    return this.userCollection.add({...user});
  }

  // Get user data by email
  async getUser(email: string): Promise<UserModel | null> {
    try {
      const querySnapshot = await this.userCollection.ref.where('email', '==', email).get();
      if (querySnapshot.empty) {
        return null;
      } else {
        const userData = querySnapshot.docs[0].data() as UserModel;
        userData.uuid = querySnapshot.docs[0].id;
        return userData;
      }
    } catch (error) {
      return null;
    }
  }

}
