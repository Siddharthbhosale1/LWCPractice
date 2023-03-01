trigger DemoTrigger1 on Account (before insert) {
    
    system.debug('before trigger has been initiated');
}