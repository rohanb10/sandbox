<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Scraper</title>
    <style>
      body,html{
        overflow-x: hidden;
        overflow-y: hidden;
      }
    </style>
  </head>
  <body>
    <?php
    // Defining the basic cURL function
    function curl($url) {
      $ch = curl_init();  // Initialising cURL
      curl_setopt($ch, CURLOPT_URL, $url);    // Setting cURL's URL option with the $url variable passed into the function
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); // Setting cURL's option to return the webpage data
      $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
      curl_close($ch);    // Closing cURL
      return $data;   // Returning the data from the function
    }
    echo curl("http://explosm.net/");
    ?>
    <button onclick="help()">
      Hey yo
    </button>
    <script>
    </script>
  </body>
</html>
