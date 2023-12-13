public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(){
        return [Select Id, Name, Type, Industry from Account Limit 5];
    }
}