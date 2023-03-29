import { LightningElement } from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader'
import fontawesome from '@salesforce/resourceUrl/Fontawesome'
export default class MemoryGameLwc extends LightningElement {
    isLibLoaded = false
    renderedCallback(){
        if(this.isLibLoaded){
            return
        }else{
            loadStyle(this,fontawesome+'/fontawesome/css/font-awesome.min.css').then(()=>{
                console.log("Loaded successfully")
            }).catch(error=>{
                console.error(error)
            })
            this.isLibLoaded=true
        }
        
    }
}