trigger CreateContact on Account (after insert) {
    List<Contact> contactsToInsert = new List<Contact>();
    
    // Iterate through the inserted accounts
    for (Account acc : Trigger.new) {
        // Check if the account has a name
        if (acc.Name != null) {
            // Create a new Contact with the account name
            Contact con = new Contact();
            con.AccountId = acc.Id;
            con.FirstName = 'New';
            con.LastName = acc.Name;
            contactsToInsert.add(con);
        }
    }
    
    // Insert the contacts if there are any
    if (!contactsToInsert.isEmpty()) {
        insert contactsToInsert;
    }
}