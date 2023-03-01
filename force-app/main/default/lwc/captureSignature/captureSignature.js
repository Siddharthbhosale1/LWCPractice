import { LightningElement,api,track } from 'lwc';
//import uploadFiles from '@salesforce/apex/CaptureSignature.uploadFiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import tmpl from './captureSignature.html';
import { OmniscriptBaseMixin } from 'omnistudio/omniscriptBaseMixin';

//declaration of variables for calculations
let isDownFlag, 
    isDotFlag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;            
       
let x = "#0000A0"; //blue color
let y = 1.5; //weight of line width and dot.       

let canvasElement, ctx; //storing canvas context
let attachment; //holds attachment information after saving the sigture on canvas
let dataURL,convertedDataURI; //holds image data
export default class CaptureSignature  extends OmniscriptBaseMixin(LightningElement) {
    @track filesUploaded = [];
   
   uploadFiles;

    @api recordId;

    //event listeners added for drawing the signature within shadow boundary
    constructor() {
        super();
        this.template.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.template.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.template.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.template.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }

    //retrieve canvase and context
    renderedCallback(){
        canvasElement = this.template.querySelector('canvas');
        ctx = canvasElement.getContext("2d");
    }
    
    //handler for mouse move operation
    handleMouseMove(event){
        this.searchCoordinatesForEvent('move', event);      
    }
    
    //handler for mouse down operation
    handleMouseDown(event){
        this.searchCoordinatesForEvent('down', event);         
    }
    
    //handler for mouse up operation
    handleMouseUp(event){
        this.searchCoordinatesForEvent('up', event);       
    }

    //handler for mouse out operation
    handleMouseOut(event){
        this.searchCoordinatesForEvent('out', event);         
    }
    
    /*
        handler to perform save operation.
        save signature as attachment.
        after saving shows success or failure message as toast
    */
    handleSaveClick(){    

        console.log("captureSignature - handleSaveClick ... ");

        //set to draw behind current content
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "#FFF"; //white
        ctx.fillRect(0,0,canvasElement.width, canvasElement.height); 

        //convert to png image as dataURL
        dataURL = canvasElement.toDataURL("image/png");
        //convert that as base64 encoding
        convertedDataURI = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        
        this.fireChange(convertedDataURI);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Signature has been saved with the form',
                variant: 'success',
            }),
        );        
        /*
        //call Apex method imperatively and use promise for handling sucess & failure
        saveSign({strSignElement: convertedDataURI,recId : this.recordId})
            .then(result => {
                //this.ContentDocumentLink = result;
                //console.log('ContentDocumentId=' + this.ContentDocumentLink.ContentDocumentId);
                //show success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Salesforce File created with Signature',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                //show error message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating Salesforce File record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
        */
    }


    /* Fires the signature file tpo the parent */
    fireChange(event) {

       /* console.log(">> signature-fireChange ... send signature file back to parent!");
        console.log("changedValue=" + changedValue);

        let customChange = new CustomEvent('signaturechanged', {
            detail: changedValue,
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(customChange);
        this.omniApplyCallResp({"convertedDataURI":changedValue});*/
        console.log(">> handleSignatureChange >> ");

        let signatureFile = event;
        this.omniApplyCallResp({"signatureFileStr":signatureFile});

       // console.log("--> signatureFile=" + signatureFile);

       // let signatureFileTitle = "signature";

      //  let signatureFileName = "signature.png";

       // this.filesUploaded.push({PathOnClient: "signature.png", Title: "signature.png", VersionData: signatureFile, DocumentName: "signature"});
       // this.omniApplyCallResp({"filesUploaded":filesUploaded});
       /*  uploadFiles({files:this.filesUploaded}).then(result => {
            if(result == true) {
                this.showToastMessage('Success','Files uploaded', 'success');
            }else{
                this.showToastMessage('Error','Error uploading files', 'error');
            }
        })
        .catch(error => {
            this.showToastMessage('Error','Error uploading files', 'error');
        });*/
    }        

    //clear the signature from canvas
    handleClearClick(){
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);          
    }

    searchCoordinatesForEvent(requestedEvent, event){
        event.preventDefault();
        if (requestedEvent === 'down') {
            this.setupCoordinate(event);           
            isDownFlag = true;
            isDotFlag = true;
            if (isDotFlag) {
                this.drawDot();
                isDotFlag = false;
            }
        }
        if (requestedEvent === 'up' || requestedEvent === "out") {
            isDownFlag = false;
        }
        if (requestedEvent === 'move') {
            if (isDownFlag) {
                this.setupCoordinate(event);
                this.redraw();
            }
        }
    }

    //This method is primary called from mouse down & move to setup cordinates.
    setupCoordinate(eventParam){
        //get size of an element and its position relative to the viewport 
        //using getBoundingClientRect which returns left, top, right, bottom, x, y, width, height.
        const clientRect = canvasElement.getBoundingClientRect();
        prevX = currX;
        prevY = currY;
        currX = eventParam.clientX -  clientRect.left;
        currY = eventParam.clientY - clientRect.top;
    }

    //For every mouse move based on the coordinates line to redrawn
    redraw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x; //sets the color, gradient and pattern of stroke
        ctx.lineWidth = y;        
        ctx.closePath(); //create a path from current point to starting point
        ctx.stroke(); //draws the path
    }
    
    //this draws the dot
    drawDot(){
        ctx.beginPath();
        ctx.fillStyle = x; //blue color
        ctx.fillRect(currX, currY, y, y); //fill rectrangle with coordinates
        ctx.closePath();
    }

}