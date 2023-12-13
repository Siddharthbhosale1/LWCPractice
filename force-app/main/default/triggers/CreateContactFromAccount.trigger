trigger CreateContactFromAccount on Account (after insert, before insert,after update,before update) {
    
    if(Trigger.isInsert){
        if(Trigger.isAfter){
            CreateContactFromAccountHandler.createContact(Trigger.New);
        }
    }
   UpdateAccountOwner.updateContacts(Trigger.new, Trigger.oldMap);
}