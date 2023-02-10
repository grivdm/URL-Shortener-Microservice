# API Project: URL Shortener Microservice

__for [FreeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)__

[Click](https://shrt-grivdm.glitch.me/)

+ The API endpoint ```POST [url]/api/shorturl``` send a JSON response with ```original_url``` and ```short_url``` properties  e.g. ```{ original_url : 'https://freeCodeCamp.org', short_url : 1}```
+ If URL is invalid and doesn't follow the valid http://www.example.com format, the JSON response will contain```{ error: 'invalid url' }```
+ visiting ```[url]/api/shorturl/<short_url>``` will redirect to the original URL. 


### Creation Example:
POST /api/shorturl/new - body (urlencoded) : url=https://www.google.com

 ### Example usage:
https://shrt-grivdm.glitch.me/api/shorturl/5  
https://shrt-grivdm.glitch.me/api/shorturl/6
