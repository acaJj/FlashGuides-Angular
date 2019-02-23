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

  //TODO: find a way to display the guide in a separate component, maybe through routing?
  //clicking on the guide name in the search list should take user to a new page for just displaying the guide (guide-viewer.html)
  //sends the user id and guide id params so guide-viewer can fetch data OR just guide id and i can normalize the nosql tree to simplify the logic here

  /*
	Firestore DB Structure

	Top Level: Users, All-Guides and Published-Guides
	Users: userIds[userId,firstName,lastName,etc]
		- holds a sub-collection, Guides[guideId,dateCreated,author,title,description]
	All-Guides: holds all of the guides across all users in their last edited state
		- guideIds[guideId,userId,dateCreated,author,title,description]
		- holds up to 3 sub-collections representing the data: stepData, textData, imageData
	PublishedGuides: holds all guides that have been published in the state they were in at the time of publishing
		- branch structure is same as All-Guides

	Example Use Case: Editing User Guides
	A user has published a guide on building a shelf and published it. Now they want to edit it to include new information. 
	They go to the section 'Your Guides' to look at all of their currently saved guides, it displays them in a list by getting all of the guide
	documents in their node of the tree and displaying just the relevant data such as the title and its current status.

	They select their guide on shelf building and the app then takes the guideId stored in the doc, and travels through the 'All-Guides' branch,
	finds the guide matching the id and gets the guide data to load up for further editing. Once the user is done, they save the guide but don't 
	publish it because they still think they need to further fine-tune before the changes are made. They then go to the options menu and choose to 
	set the current status from 'Published' to 'Under Review' which displays when searching the guide so that users who may want to read it know
	that edits are being made to it. The most recently published state of the guide is still available for viewing with the knowledge it isn't up
	to date. When the user finally decides to publish it then the guide stored in 'Published-Guides' updates to the new version.

	Problems?:
	Not sure but when getting a document in a collection it may load all documents in the collection for easier access, even if only 1 is needed.
	This would mean you are constantly loading all documents in the 'All-Guides' and 'Published-Guides' collections which could be a lot of bandwidth.
  */


  //get guide text by id from specific user
  getGuideTextData(userId:string,guideId: string,guideKey: number): Observable<DataBlock[]>{
  	let guideTextCollection = this.aFirestore.collection<Object>("Users/" + userId + "/guides/" + guideKey + "/textData");

  	let textBlocks: Observable<DataBlock[]> = guideTextCollection.snapshotChanges().pipe(
  			map(actions=>actions.map(a=>{
  				let doc = a.payload.doc;
  				const data: DataBlock = new DataBlock(TextBlockComponent,doc.data());
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
