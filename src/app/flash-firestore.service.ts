import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Guide } from './guide';
import { User } from './user';
import { TextBlock } from './text-block';
import { PictureBlock } from './picture-block';
import { DataBlock } from './data-block';
import { TextBlockComponent } from './text-block/text-block.component';
import { PictureBlockComponent } from './picture-block/picture-block.component';

import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})

export class FlashFirestoreService {

	private userCollection: AngularFirestoreCollection<User>;
	users: Observable<User[]>;
	publishedGuides: Observable<Guide[]>;

	guideDoc: AngularFirestoreDocument<Guide>;
	currentGuide: Observable<Object>;//the guide currently being viewed by the user

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

  //gets a guide by id
  getGuide(userId:string,guideKey:number):Observable<Object>{
  	this.currentGuide = this.aFirestore.doc("Users/" +userId+"/guides/"  + guideKey).valueChanges();

  	return this.currentGuide;
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
  					data.creatorId = userId;//sets author id on the guide object so we can get the guide data later without needing a User object
  					const id = a.payload.doc.id;
  					//userGuides.push(data);
  					return data;
  				})),

  			);
  	//}

  	return this.publishedGuides;
  }

  //get guide text by id from specific user
  getGuideTextData(userId:string,guideId: string,guideKey: number): Observable<DataBlock[]>{
  	let guideTextCollection = this.aFirestore.collection<Object>("Users/" + userId + "/guides/" + guideKey + "/textData");

  	let textBlocks: Observable<DataBlock[]> = guideTextCollection.snapshotChanges().pipe(
  			map(actions=>actions.map(a=>{
  				let doc = a.payload.doc;
  				const data: DataBlock = new DataBlock(TextBlockComponent,doc.data());
          console.log(data);
  				//data.setDataComponent(new TextBlockComponent);
  				return data;
  			}))
  		);

  	return textBlocks;
  }

  //get guide images by id from specific user
  getGuidePictureData(userId:string,guideId: string,guideKey: number): Observable<DataBlock[]>{
  	let guidePicturesCollection = this.aFirestore.collection("Users/" + userId + "/guides/" + guideKey + "/imageData");

  	let pictureBlocks: Observable<DataBlock[]> = guidePicturesCollection.snapshotChanges().pipe(
  			map(actions=>actions.map(a=>{
  				let doc = a.payload.doc;
  				const data: DataBlock = new DataBlock(PictureBlockComponent,doc.data());
  				return data;
  			}))
  		);

  	return pictureBlocks;
  }
}
