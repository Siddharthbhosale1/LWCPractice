import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets'

export default class AlarmClockApp extends LightningElement {
    clockImage = AlarmClockAssets +'/AlarmClockAssets/clock.png'
    currentTime = ""
    hours = []
    mins = []
    meridiens = ['AM' , 'PM']

    hourSelected
    minSelected
    meridienSelected

    connectedCallback(){
        this.currentTimeHandler()
        this.CreateHoursOptions()
        this.CreateMinOptions()
    }
    currentTimeHandler() {
        setInterval(() => {
          let dateTime = new Date();
          let hour = dateTime.getHours();
          let min = dateTime.getMinutes();
          let sec = dateTime.getSeconds();
          let ampm = "AM";
      
          if (hour === 0) {
            hour = 12;
            ampm = "AM";
          } else if (hour === 12) {
            ampm = "PM";
          } else if (hour >= 12) {
            hour = hour - 12;
            ampm = "PM";
          }
      
          hour = hour < 10 ? "0" + hour : hour;
          min = min < 10 ? "0" + min : min;
          sec = sec < 10 ? "0" + sec : sec;
      
          this.currentTime = `${hour}:${min}:${sec} ${ampm}`;
      
          if (this.alarmTime === `${hour}:${min} ${ampm}`) {
            console.log("Alarm Triggered!!");
            this.isAlarmTriggered = true;
            this.ringtone.play();
            this.ringtone.loop = true;
          }
        }, 1000);
      }
        
    CreateHoursOptions(){
        for(let i = 1; i <= 12; i++){
            let val = i<10 ? "0"+i : i
            this.hours.push(val)
        }
    }  

    CreateMinOptions(){
        for(let i = 0; i <= 59; i++){
            let val = i<10 ? "0"+i : i
            this.mins.push(val)
        }
    }  
     
    optionHandler(event){
      const {label, value} = event.details
      if(label === "Hour(s)"){
        this.hourSelected = value
      } else if(label === "Minute(s)"){
        this.minSelected = value
      } else if(label === "AM/PM"){
        this.meridienSelected = value
      }else {}

      console.log(this.hourSelected , "hour")
      console.log(this.minSelected , "min")
      console.log(this.meridienSelected , "am/pm")
    }
}