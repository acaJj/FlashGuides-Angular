import { Component, OnInit,Input } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-picture-block',
  templateUrl: './picture-block.component.html',
  styleUrls: ['./picture-block.component.css']
})
export class PictureBlockComponent implements OnInit {
	src:SafeHtml;
	@Input() picData:any;

  	constructor(
  		private aFireAuth:AngularFireAuth,
  		private aFStorage:AngularFireStorage
  		) { }

  	ngOnInit() {
  		let This = this;
  		//this makes a new anonymous user every time a picture is added, this should be changed so that 
  		//anonymous sign in only happens when user first opens app
  		this.aFireAuth.auth.signInAnonymously().then(function(){
  			let imageRef = This.aFStorage.ref(This.picData.imgPath);
  			console.log(imageRef.getDownloadURL());
  			imageRef.getDownloadURL().subscribe(url =>{
  				This.src = url;
  			})
  		});
  		
  	}

}
