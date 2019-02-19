import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Guide } from './guide';
import { User } from './user';

import * as firebase from 'firebase/app';



/** when service is provided at root level, Angular creates a singular, shared instance of HeroService and injects into any class that asks for it
	Registering the provider in the @Injectable metadata lets Angular optimize the app by removing the service if it ends up unused **/
@Injectable({
  providedIn: 'root'
})

export class FlashFirestoreService {

	private userCollection: AngularFirestoreCollection<User>;
	users: Observable<User[]>;
	publishedGuides: Observable<Guide[]>;

	guideDoc: AngularFirestoreDocument<Guide>;
	guideToEdit: Observable<Guide>;

  constructor(private aFirestore: AngularFirestore) { }

  getAllUsers():Observable<User[]>{
  	this.users = this.aFirestore.collection("Users").snapshotChanges().pipe(
  			map(actions=>actions.map(a=>{
  				const data = a.payload.doc.data() as User;
  				const id = a.payload.doc.id;
  				return data;
  			}))
  		);

  	return this.users;
  }

  //gets all published guides from the db 
  getPublishedGuides(user:User): Observable<Guide[]>{
  	//let currentUser: User;
  	//let userGuides: Guide[];

  	//go through array of users and return all guides that are published
  	//for (var i = 0; i < users.length; i++) {
  	//	currentUser = users[i];
  		let userId: string = user.id;
  		this.publishedGuides = this.aFirestore.collection("Users/"+userId+"/guides").snapshotChanges().pipe(
  				map(actions=>actions.map(a=>{
  					const data = a.payload.doc.data() as Guide;
  					const id = a.payload.doc.id;
  					//userGuides.push(data);
  					return data;
  				})),

  			);
  	//}

  	return this.publishedGuides;
  }

  //get guide by id from specific user, 404 if not found
  getGuide(userId:number,guideId: number,guideKey: string): Observable<Guide>{
  	this.guideDoc = this.aFirestore.doc("Users/" + userId + "/guides/" + guideKey);
  	this.guideToEdit = this.guideDoc.valueChanges();
  	return this.guideToEdit;
  }
}
