import { DataBlock } from './data-block';
/* Class takes a component that will display the data and a json array to hold the data */
export class TextBlock{
	constructor(public dataComponent: any,public data:any){	}
}