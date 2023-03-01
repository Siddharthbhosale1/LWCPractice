public class ContentVersionTriggerHandler {

    public static void createPublicLinkForFile(List<ContentVersion> contentVersions){
        ContentDistribution[] distributionsToInsert = new List<ContentDistribution>();
        
       	for(ContentVersion objContentVersion : contentVersions){
            //if image uploaded then only create public link
            if(objContentVersion.FileType.toLowerCase() == 'PDF'){
                system.debug('objContentVersion.FileExtension.toLowerCase():' + objContentVersion.FileType);
                
                distributionsToInsert.add(createContentDistribution(objContentVersion.Id));
                publicURL();
            }
        }
        if(!distributionsToInsert.isEmpty())
        {
        	insert distributionsToInsert;
        }
    }
    
     public static ContentDistribution createContentDistribution(Id contentVersionId){
        ContentDistribution newDist = new ContentDistribution();
        newDist.ContentVersionId = contentVersionId;
        newDist.Name = 'External Link';
        newDist.PreferencesNotifyOnVisit = false;
        newDist.PreferencesAllowViewInBrowser = true;
        newDist.PreferencesAllowOriginalDownload=true;
        system.debug('createContentDistribution created');
        return newDist;
    }
    
    public static void publicURL(){
        
        List<Resume__c> resumeList = [Select Id,Resume_URL__c From Resume__c];
        System.debug('resumeList-->'+ resumeList);
        
        String resumeURL = '';
        for(Resume__c re : resumeList){
            resumeURL += re.Resume_URL__c;
        }
        System.debug('resumeURL-->'+ resumeURL);
        
        List<ContentDistribution> conDisList = [Select Id, DistributionPublicUrl 
                                                From ContentDistribution where ContentVersionId = '0685j000008KtPVAA0'];
        system.debug(conDisList);
        String URLs = '';
        for(ContentDistribution condi : conDisList){
            URLs += condi.DistributionPublicUrl;
        }
        System.debug('URLs-->'+ URLs);
        
        List<Resume__c> rList = new List<Resume__c>();
        for(Resume__c res : [Select Resume_URL__c from Resume__c Where Id = 'a0T5j0000067HGLEA2'])
        {
            res.Resume_URL__c = URLs;
            rList.add(res);
        }
        update rList;
    }
    
    
}