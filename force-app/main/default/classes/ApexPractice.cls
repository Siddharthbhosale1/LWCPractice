public class ApexPractice {
    
    public static void dataTypeConversion()
    {
      String bio = '23';
      String maths = '28';
      String chem = '30';

      Integer total = Integer.valueOf(bio) + Integer.valueOf(maths) + Integer.valueOf(chem);
      system.debug('total - ' + Total);  
    }
    
    public static void ifElse()
    {
        Boolean isItRaining = False;
        Boolean isSunny = False;
        Boolean areYouWorking = False;
       // Boolean is = true;
        If(isItRaining == True){
            system.debug('Donot go to party');
        }
        Else IF(areYouWorking == True){
            system.debug('Donot go to party');
        }else{
            system.debug('party is on');
            
            }
    
    }
    
    public static void switchCase(){
        
        String TToday = 'Saturday';
        //switch on TToday {
        //whenTToday = monday,t;
        //system.debug
        //whenTToday
    
    } 
    
    public static void leapYear()
    {
       Integer year = 2000;
        If(Math.mod(year, 4) == 0)
        {
            system.debug('Its a leap year');
        }
        
    }
    
    //public static void doWhileLoop()
    //{
      //  do{
        // year++;   
        //}while(year <= 2000);
    //}
     
    public static void fissBuss()
    {
        Integer No = 0;
        do{
            system.debug(No + 1);
          No++; 
        }while(No < 100);
    }
    
    //Whileloop
    //fibonachiseries
 

}