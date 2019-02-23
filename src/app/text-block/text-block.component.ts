import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.css']
})
export class TextBlockComponent implements OnInit {
	text:SafeHtml;
	@Input() textData: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  	//console.log(this.textData);
  	this.text = this.sanitizer.sanitize(SecurityContext.HTML,this.textData.stringFromBlob);
  }

}
