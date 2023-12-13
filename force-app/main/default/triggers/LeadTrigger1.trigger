trigger LeadTrigger1 on Lead (before insert, before update) {
    switch on Trigger.operationType{
        when BEFORE_INSERT {
            for(Case caseList : Trigger.new){
                if(caseList.Origin == 'Email'){
                     caseList.Status = '	New';
                     caseList.Priority = 'Medium';
                  }
             }
         }
        when BEFORE_UPDATE {
            // List<Case> updateCase = new List<Case>();
             for(Case caseList : Trigger.new){
                if(caseList.Origin == 'Email'){
                     caseList.Status = 'New';
                     caseList.Priority = 'Medium';
                   //  updateCase.add(caseList);
                   //system.debug('update');
                  }
                 
              }  
              //  update updateCase;            
         }
     }

}