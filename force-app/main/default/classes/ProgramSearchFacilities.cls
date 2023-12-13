public with sharing class ProgramSearchFacilities {
    @AuraEnabled(cacheable=true)
    public static List<Services_at_Facility__c> getAllServiceAtFacility(string searchKey){
        try{
            List<Services_at_Facility__c> serviceList = [SELECT Id,Cost__c,Name,Service__r.Name,Facility__r.Name,Facility_Location__c, Start_Date__c, Status__c, 
            Maximum_Capacity__c FROM Services_at_Facility__c where Name like :('%'+searchKey+'%') ];
            return serviceList;
        }
        catch(Exception e){
            system.debug('Exception occured '+e.getMessage());
            return null;
        }
    }
     @AuraEnabled(cacheable=true)
     public static List<Services_at_Facility__c> getAllServiceAtFacilityWithoutParam(){
        try{
            List<Services_at_Facility__c> serviceList = [SELECT Id,Cost__c,Name,Service__r.Name,Facility__r.Name, Facility_Location__c,Start_Date__c, Status__c, 
            Maximum_Capacity__c FROM Services_at_Facility__c ];
            return serviceList;
        }
        catch(Exception e){
            system.debug('Exception occured '+e.getMessage());
            return null;
        }
    }
}