@isTest
public class CreateContactTest {
	@testSetup
    static void testSetup() {
        // Create some accounts to be inserted
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 10; i++) {
            accounts.add(new Account(Name='Test Account ' + i));
        }
        insert accounts;
    }

    @isTest
    static void testContactCreation() {
        // Get the inserted accounts
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Name LIKE 'Test Account%'];

        // Verify that there are no contacts in the database
        System.assertEquals(0, [SELECT COUNT() FROM Contact]);

        // Insert the accounts
        Test.startTest();
        insert accounts;
        Test.stopTest();

        // Verify that the contacts were created
        System.assertEquals(10, [SELECT COUNT() FROM Contact]);
    }
}