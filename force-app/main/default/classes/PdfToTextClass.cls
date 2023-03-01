global with sharing class PdfToTextClass {

    @RemoteAction
    public static Resume__c processReturnFile(String resumeData) {
        
        System.debug('resumeData --' + resumeData);
        Resume__c acc = [SELECT Name, Resume_Data__c FROM Resume__c where Id ='a0T5j0000069VteEAE'];
        System.debug('Resume --> '+acc.Name);
		acc.Resume_Data__c= resumeData;
        
		update acc;
        
        return null;
    }
}