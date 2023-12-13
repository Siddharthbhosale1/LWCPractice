import { LightningElement } from 'lwc';

export default class BmiCalculator extends LightningElement {
    height = ""
    weight = ""
    bmiValue = ""
    result = ""
    inputHandler(e){
        const {name, value}= e.target
        if(name === "height"){
            this.height=value
        }
        if(name === "weight"){
            this.weight=value
        }
    }

    onSubmitHandler(e){
        e.preventDefault();
        console.log("height" , this.height)
        console.log("weight" , this.weight)
        this.calculate()
    }

    calculate(){
        let height = Number(this.height)/100;
        let bmi = Number(this.weight)/(height*height)
        console.log("bmi value",bmi)
        this.bmiValue = Number(bmi.toFixed(2))

        if (this.bmiValue < 18.5){
            this.result = "Underweight"
        } else if (this.bmiValue >=18.5 && this.bmiValue < 25){
            this.result = "Healthy"
        }else if (this.bmiValue >=25 && this.bmiValue < 30){
            this.result = "Overweight"
        }else{
            this.result = "Obese"
        }

        console.log(this.bmiValue)
        console.log(this.result)
    }

    recalculate(){
        this.height = ""
        this.weight = ""
        this.bmiValue = ""
        this.result = ""
    }
}