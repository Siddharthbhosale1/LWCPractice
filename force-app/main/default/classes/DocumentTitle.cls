public class DocumentTitle {
    
    public static void saveTitle()
    {
       Resume__c Title = new Resume__c();
        list<ContentDocumentLink> qTitle = [Select ContentDocument.Title from ContentDocumentLink where LinkedEntityId IN ('a0T5j0000067HGAEA2')];
        //Title.Document_Title__c = qTitle;
        system.debug(qTitle[0]);
        
        insert Title;
       }
 
}