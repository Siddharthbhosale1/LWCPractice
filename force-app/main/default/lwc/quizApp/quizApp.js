import { LightningElement } from 'lwc';

export default class QuizApp extends LightningElement {
    selected={
   
    }//for storing value
    correctAnswer=0 //To show the no of correct answer
    isSubmitted = false //use to show the result
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
    get allNotSelected(){
        return !(Object.keys(this.selected).length === this.myQuestions.length)
    }
    get isScoredFull(){
        return `slds-text-heading_large  ${this.myQuestions.length === this.correctAnswer? 'slds-text-color_success':'slds-text-color_error'}`
    }
    changeHandler(event){
        console.log("name", event.target.name)
        console.log("value", event.target.value)
        const {name, value} = event.target
        //const name = event.target.name
        //const name = event.target.value
        this.selected={...this.selected, [name]:value}
        //this.selected={"Question1":"b"}
    }
    submitHandler(event){
        event.preventDefault()
       let correct= this.myQuestions.filter(item=>this.selected[item.id] === item.correctAnswer)
       this.correctAnswer = correct.length
       this.isSubmitted = true
       console.log("this.correctAnswer",this.correctAnswer)
    }
    resetHandler(){
        this.selected = {}
        this.correctAnswer=0
        this.isSubmitted = false
    }
}