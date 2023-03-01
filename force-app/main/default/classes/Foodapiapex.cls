public class Foodapiapex {
    private static final string SPOONACULAR_API ='https://api.spoonacular.com'; 
    private static final string API_KEY ='9a00d07ea6344a77b4e57898b7b338ff';
    
    public static void getRandomReceipe(){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API+'/recipes/random?apiKey='+API_KEY);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        system.debug('response '+response.getStatusCode());
        if(response.getStatusCode() == 200) {
            system.debug('response '+response.getBody());
        }
        
    }
    
     public static void getReceipe(String recipeId){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API+'/recipes/'+recipeId+'/information?apiKey='+API_KEY);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        system.debug('response '+response.getStatusCode());
        if(response.getStatusCode() == 200) {
            system.debug('response '+response.getBody());
        }
        
    }
     public static void getReceipeByIngredient(String ingredient ){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API+'/recipes/findByIngredients?apiKey='+API_KEY+'&ingredient='+ingredient);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        system.debug('response '+response.getStatusCode());
        if(response.getStatusCode() == 200) {
            system.debug('response '+response.getBody());
        }
        
    }

    
    

}