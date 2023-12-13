trigger Ap on SOBJECT (before insert) {
  trigger AccountTrigger on Account (after insert, after update) {

    if(Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)){
        AccountTriggerHandler.countClosedWonOpp(Trigger.new);
    }
}
}