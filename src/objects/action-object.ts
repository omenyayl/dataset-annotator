export class ActionObject{
  	constructor(public label: string,
  				//Meant to be kept in seconds
  				public startTime: number = 0,
	 			public endTime: number = 0,
				public action_id: number = -1){
	}
	
}
