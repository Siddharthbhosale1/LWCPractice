trigger AccountOpp on Account (after insert, after update) {
    if(trigger.isAfter && trigger.isUpdate){
       List<Opportunity> oppList = new List<Opportunity>();
        for(Account accList : trigger.New){
            //Opportunity opp = new Opportunity();
            if(accList.Industry != trigger.oldMap.get(accList.id).Industry && accList.Industry == 'Agriculture')
            {
                oppList.add(new Opportunity(StageName = 'Prospecting',
                            Amount = 0, 
                            CloseDate = System.today() + 90, 
                            AccountId = accList.Id, 
                            Name = accList.Name + 'Opp'));
            }
            update oppList;
        }
    }
}