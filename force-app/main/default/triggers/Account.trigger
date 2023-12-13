trigger Account on Account (after insert) {
    List<Contact> conList = new List<Contact>();
    switch on Trigger.operationType{
        when AFTER_INSERT {
            for(Account acclist : Trigger.New){
                Contact con = new Contact();
                if(acclist.Industry == 'Banking')
                {
                con.AccountId = acclist.Id;
                con.LastName = acclist.Name;
                conList.add(con);   
                }
            }
            insert conList;
        }
    }
}