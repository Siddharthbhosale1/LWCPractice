trigger AccountCheck on Contact (after insert, after update, after delete, after undelete) {
  switch on Trigger.operationType {
    when AFTER_INSERT {
        Set<Id> uniqueAccounts = new Set<Id>();
        for(Contact conCount : Trigger.new){
            if(String.isNotBlank(conCount.AccountId)){
               
                uniqueAccounts.add(conCount.AccountId);
            }
        }
            List<AggregateResult> results = [SELECT AccountId, COUNT(Id) totalContacts FROM Contact 
            WHERE Active1__c = true 
            AND AccountId 
            IN :uniqueAccounts 
            GROUP BY AccountId];
            List<Account> accList = new List<Account>();  
            for(AggregateResult result : results){
                String accId = String.valueOf(result.get('AccountId'));
                Integer accCount = Integer.valueOf(result.get('totalContacts'));
                Account acc = new Account(Id = accId, AccNumb__c = accCount );
                accList.add(acc);
                }
        update accList;
    }
    
  }
}