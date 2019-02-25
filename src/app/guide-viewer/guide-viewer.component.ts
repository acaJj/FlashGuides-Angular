import { Component, OnInit, Input,ComponentFactoryResolver,ViewChild } from '@angular/core';
import { FlashFirestoreService } from '../flash-firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Guide } from '../guide';
import { TextBlock } from '../text-block';
import { PictureBlock } from '../picture-block';
import { DataBlock } from '../data-block';
import { TextBlockComponent } from '../text-block/text-block.component';
import { PictureBlockComponent } from '../picture-block/picture-block.component';
import { DataBlockDirective } from '../data-block.directive';

@Component({
  selector: 'app-guide-viewer',
  templateUrl: './guide-viewer.component.html',
  styleUrls: ['./guide-viewer.component.css']
})
export class GuideViewerComponent implements OnInit {
	@Input() guide: Guide;
	@ViewChild(DataBlockDirective) guideHolder: DataBlockDirective;

  	constructor(
  		private flashService:FlashFirestoreService,
  		private route:ActivatedRoute,
  		private componentResolver:ComponentFactoryResolver
  	) { }

  	ngOnInit() {
  		this.getGuide();
  	}

  	getGuide():void{
  		const userId = this.route.snapshot.paramMap.get("userId");
  		const guideKey = +this.route.snapshot.paramMap.get("key");

  		this.flashService.getGuide(userId,guideKey).subscribe(guide => {
  			this.guide = guide as Guide;
  			this.loadData(userId,this.guide);
  		});
  	}


	//get text and picture data of the chosen guide
  	loadData(uId:string,guideToLoad:Guide):void{
		const userId:string = uId;
		const guideId: string =guideToLoad.id;
		const guideKey:number = guideToLoad.key;

		let completedGuide: DataBlock[] = [];
		//gets the guide text, followed by the guide images, and then sends the objects to the createGuide to add the components to the screen
		this.flashService.getGuideTextData(userId,guideId,guideKey).subscribe(text =>{
			console.log("loading text" + text);
			for (var i = 0; i < text.length; i++) {
			 	completedGuide.push(text[i]);
			}
			 this.flashService.getGuidePictureData(userId,guideId,guideKey).subscribe(imgs => {
			 	console.log("loading pics");
			 	for (var i = 0; i < imgs.length; i++) {
			 		completedGuide.push(imgs[i]);
				}
			 	console.log("completed guide: " + completedGuide);
			 	completedGuide = this.orderGuide(completedGuide);
			 	this.createGuide(completedGuide);
			 });
		});
		

		
	}

	orderGuide(data:DataBlock[]):DataBlock[]{
		let orderedGuide: DataBlock[] = [];
		var index = 0;
		var currStep = 1;
		var i = 0;
console.log(data.length);
		while(orderedGuide.length != data.length){
			console.log("ordering");
			if ((data[i].data.stepNumber == currStep) && (data[i].data.placement == index)) {
				index++;
				orderedGuide.push(data[i]);

				//if the ordered guide is the same length, then we're done sorting, break the loop
                if (orderedGuide.length == data.length) {
                    break;
                }else{
                    //if not, then we still have to look, set i back to 0 so we can go through the list again looking for the next element
                    i = 0;
                    continue;
                }
			}

			//increment i for the next iteration of the loop
            i++;
            //if i is greater than the data list length, we have searched the whole loop
            //and haven't found the element at the index we are looking for, this means we have found all elements in the step
            //increment currStep and start looking for the next step's elements
            if (i > data.length-1) {
                //break;
                currStep++;
                index = 0;
                i=0;
            }
		}

		return orderedGuide;
	}

	//displays the data onto the screen by creating custom components to hold them
	createGuide(guideData:DataBlock[]):void{
		let body = this.guideHolder.guideContainer;
		body.clear;

		for (var i = 0; i < guideData.length; i++) {
			let dataBlock = guideData[i];
			if (dataBlock.data.type == "Text") {
				console.log(dataBlock.data);
				let componentFactory = this.componentResolver.resolveComponentFactory(dataBlock.dataComponent);

				let componentRef = body.createComponent(componentFactory);
				(<TextBlockComponent>componentRef.instance).textData = dataBlock.data; 
			}else if (dataBlock.data.type == "Picture") {
				console.log(dataBlock.data);
				let componentFactory = this.componentResolver.resolveComponentFactory(dataBlock.dataComponent);

				let componentRef = body.createComponent(componentFactory);
				(<PictureBlockComponent>componentRef.instance).picData = dataBlock.data; 
			}
		}

	/*	for (var i = 0; i < textData.length; i++) {
			//console.log(textData[i]);
			let data = textData[i];
			let componentFactory = this.componentResolver.resolveComponentFactory(data.dataComponent);

			let componentRef = body.createComponent(componentFactory);
			(<TextBlockComponent>componentRef.instance).textData = data.data; 
		}

		for (var i = 0; i < picData.length; i++) {
			let data = picData[i];
			let componentFactory = this.componentResolver.resolveComponentFactory(data.dataComponent);

			let componentRef = body.createComponent(componentFactory);
			(<PictureBlockComponent>componentRef.instance).picData = data.data; 
		}
		*/
	}
}
