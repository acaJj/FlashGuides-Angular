import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'flash-guides-web-angular';
  allUsers: Observable<any[]>;

  constructor(private aFirestore:AngularFirestore){

  }

  ngOnInit(): void{
  	this.allUsers = this.aFirestore.collection('Users').valueChanges();
  }
}
