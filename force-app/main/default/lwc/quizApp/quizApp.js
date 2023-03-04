import { LightningElement } from 'lwc';

export default class QuizApp extends LightningElement {
    selected={

    }//for storing value
    myQuestions=[

       {
        id:"Question1",
        question:"Which one of the following is template loop?",
        answer:{
            a:"for:each",
            b:"iterator",
            c:"map loop"
        },
        correctAnswer:"c"
       },
       {
        id:"Question2",
        question:"Which of the following is invalid in LWC component folder?",
        answer:{
            a:"svg",
            b:"apex",
            c:"js"
        },
        correctAnswer:"b"
       },
       {
        id:"Question3",
        question:"Which of the following is not a directice?",
        answer:{
            a:"for:each",
            b:"if:true",
            c:"@track"
        },
        correctAnswer:"c"
       }

    ]

    changeHandler(event){
        console.log("name", event.target.name)
        console.log("value", event.target.value)
        const {name, value} = event.target
        //const name = event.target.name
        //const name = event.target.value
        this.selected={...this.selected, [name]:value}
        //this.selected={"Question1":"b"}
    }
    submitHandler(){
        
    }
    resetHandler(){

    }
}