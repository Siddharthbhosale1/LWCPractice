public with sharing class YourController {
    @AuraEnabled(cacheable=true)
    public static List<Apex_Best_practice__c> getRecords() {
        // Fetch the parent records
        List<Apex_Best_practice__c> parentRecords = [SELECT Id, Name, 
        (SELECT Id, Name FROM ABPractice__r) 
        FROM Apex_Best_practice__c WHERE Parent_relation__c = null];
        return parentRecords;
    }
}