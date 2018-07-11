export class ActionObject{
  	public object_id: number = -1;
  	constructor(public label: string,
  				//Meant to be kept in seconds
  				public startTime: number = 0,
	 			public endTime: number = 0){}
	
}
