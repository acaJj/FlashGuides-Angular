import { Component, OnInit, Input } from '@angular/core';
import { FlashFirestoreService } from '../flash-firestore.service';
import { Observable } from 'rxjs';
import { User } from '../user';
import { Guide } from '../guide';
import { TextBlock } from '../text-block';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']	
})
export class SearchComponent implements OnInit {

	@Input() showResults: boolean;
	@Input() users: User[] = [];
	@Input() guides: Guide[] = [];
	
	constructor(private flashService: FlashFirestoreService) { }

 	ngOnInit() {
 		//this.getAllUsers();
 		
	}

	getAllUsers():void{
		this.flashService.getAllUsers().subscribe(users => this.getUserPublishedGuides(users));
		
	}

	getUserPublishedGuides(users:User[]):void{
		this.users = users;
		this.getPublishedGuides();
	}

	getPublishedGuides():void{
		let currentUser: User;
		let userGuides: Guide[] = [];

		for (var i = 0; i < this.users.length; i++) {
			currentUser = this.users[i];
			this.flashService.getPublishedGuides(currentUser).subscribe(guides => this.guides = this.guides.concat(guides));
		}
		
	}

	loadData(userId:string, guideId:string,guideKey:number):void{
		//get text and picture data of the chosen guide
		let textData: TextBlock[] = [];
		let picData: Object[] = [];

		this.flashService.getGuideTextData(userId,guideId,guideKey).subscribe(text => textData = text);
		this.flashService.getGuidePictureData(userId,guideId,guideKey).subscribe(imgs => picData = imgs);
	}
}
