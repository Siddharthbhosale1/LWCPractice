public with sharing class ResumeFileInsert {
    public ResumeFileInsert() {

    }

    @AuraEnabled
    public static void insertData(){
       
        List<ContentVersion> versionData = [SELECT VersionData FROM ContentVersion WHERE ContentDocumentId = '0695j00000DTkQpAAL'];
        Blob blobContent = versionData[0].VersionData;
        //Initialize the Zippex
        Zippex myZip = new Zippex(blobContent);
		//Uncompress data
		String docXml = myZip.getFile('word/document.xml').toString();
		//Remove XML tags
		String plainText = docXml.stripHtmlTags();
		System.debug(plainText);
        //Update Field
        Resume__c acc = [SELECT Name, Resume_Data__c FROM Resume__c where Id ='a0T5j0000069jQnEAI'];
        System.debug('Resume --> '+acc.Name);
        acc.Resume_Data__c= plainText;
        update acc;
    }
}