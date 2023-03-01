global class CaptureSignature implements omnistudio.VlocityOpenInterface2 {
    
    global Object invokeMethod(String methodName,Map<String,Object> input,Map<String,Object> output,Map<String,Object> options){
        System.debug('Calling method from class');
        System.debug('options>>>' + options);
        if(methodName=='sign'){
            String applicationId=String.valueOf(input.get('applicationId'));
            List<Map<String, Object>> files=new List<Map<String, Object>>();
            Map<String, Object> signMap=new Map<String, Object>();
            signMap.put('pathOnClient', 'signature.png');
            signMap.put('title', 'signature.png');
            signMap.put('documentName', 'signature.png');
            signMap.put('versionData', EncodingUtil.base64Decode(input.get('signatureFileStr').toString()));
            //signMap.put('versionData',input.get('convertedDataURI'));
            files.add(signMap);
            System.debug('signMap>>>'+signMap);
            uploadFiles(files,applicationId );
        }
        return 'success';
    }
   public static void uploadFiles(List<Map<String, Object>> files, String parentId )
    {
        system.debug('** FileManager.uploadFiles() ... START **');
        system.debug('--> files=' + files );
        system.debug('--> parentId=' + parentId );

        List<ContentVersion> relatedDocuments = new List<ContentVersion>();
        for (Map<String, Object> file : files) 
        {
            String fileJson = JSON.serialize(file);
            RelatedFile relatedDocument = (RelatedFile) JSON.deserialize(fileJson, RelatedFile.class);
            ContentVersion contentVersionFile = new ContentVersion();
            contentVersionFile.PathOnClient = relatedDocument.pathOnClient;
            contentVersionFile.Title = relatedDocument.title;
            //contentVersionFile.Title = 'Signature';
            contentVersionFile.VersionData = relatedDocument.versionData;
            relatedDocuments.add(contentVersionFile);
        }

        insert relatedDocuments;

        // Next, we need to associate the newly added Files to the record
        Set<Id> cvIdSet = new Set<Id>();
        for (ContentVersion cv: relatedDocuments)
        {
            cvIdSet.add(cv.Id); 
        }
        
        List<ContentVersion> cvList = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id IN : cvIdSet];
        List<ContentDocumentLink> contentDocLinks = new List<ContentDocumentLink>();
        for (ContentVersion cv: cvList )
        {
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = cv.ContentDocumentId;
            cdl.LinkedEntityId = parentId;
            cdl.ShareType = 'V';
            contentDocLinks.add(cdl);
        }
        insert contentDocLinks;

    }    



    // INNER CLASS USED FOR FILE UPLOADS
    public class RelatedFile 
    {
        @AuraEnabled public String pathOnClient;
        @AuraEnabled public String title;
        @AuraEnabled public Blob versionData;
        @AuraEnabled public String documentName;
    }    
}