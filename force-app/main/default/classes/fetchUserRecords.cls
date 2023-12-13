public with sharing class fetchUserRecords {
    @AuraEnabled(Cacheable = true)
    public static list<User> fetchUserRecords() {
        return [SELECT Id, Name FROM User Where ProfileId = '00e5j00000306IsAAI']; 
    }
}