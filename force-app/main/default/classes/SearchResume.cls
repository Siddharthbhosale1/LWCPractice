public with sharing class SearchResume {

    
    @AuraEnabled(Cacheable = true)

    public static List<Resume_Data> getAccountData(String textkey) {

        textkey = '%' + textkey + '%';

        //SOQL
        //list<Resume__c> accLst = [SELECT Id, Name,Skills__c, Resume_Data__c FROM  Resume__c 
        //WHERE ((Skills__c LIKE :textkey) OR (Name LIKE :textkey))];
        
         //SOSL
       String query = 'FIND {'+ textKey +'} IN ALL FIELDS Returning Resume__c(Name, Skills__c, Resume_Data__c, Document_Url__c)';
	   List<List<Resume__c>> accLst = search.query(query) ;
       List<Resume__c> resList = ((List<Resume__c>)accLst[0]);
		System.debug('List  ' +accLst);

        
        if(accLst.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        // return accLst; 

        

        List<Resume_Data> resumeList = new List<Resume_Data>();
         for(Resume__c res : resList){
            Resume_Data resData = new Resume_Data(res);
        

        resData.name = res.Name;

        resData.resumeLink = '/lightning/r/Resume__c/' + res.Id + '/view';

        resData.resumeData = res.Resume_Data__c;

        resData.docUrl = res.Document_Url__c;

        resData.docName = 'Download File';

        

         resumeList.add(resData);
        system.debug('Data' +resumeList);

    }
    return resumeList;
   
}

    public class Resume_Data  {

        @AuraEnabled
        public string name;
    
        @AuraEnabled
        public string resumeLink;

        @AuraEnabled
        public string resumeData;

        @AuraEnabled
        public string docUrl;

        @AuraEnabled
        public string docName;

        @AuraEnabled
        public Resume__c res;
        

        public Resume_Data(Resume__c res){
            this.res = res;
            
        }
    }


}
    //wrapper class code