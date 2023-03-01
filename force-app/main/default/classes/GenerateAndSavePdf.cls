public class GenerateAndSavePdf {
    
    public static void savePdf()
    {
        String testData = 'This is saved Data in PDF';
        ContentVersion cVersion = new ContentVersion();
        cVersion.ContentLocation = 'S';
        cVersion.Title = 'TestFile';
        cVersion.PathOnClient = cVersion.Title + '.pdf';
        cVersion.VersionData = Blob.toPdf(testData);
        insert cVersion;
        
        id conDocument = [Select ContentDocumentId from ContentVersion where Id =: cVersion.id].contentDocumentId;
        
        ContentDocumentLink cDocLink = new ContentDocumentLink();
        cDocLink.ContentDocumentId = conDocument;
        cDoclink.LinkedEntityId = 'a0T5j0000067HGAEA2';
        cDoclink.Visibility = 'AllUsers';
        cDoclink.ShareType = 'V';
        
        insert cDoclink;
        
        
    }

}