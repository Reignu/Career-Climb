// retrieves and uses job title keyword from pay calculator to run search
document.addEventListener('DOMContentLoaded', function() {
    var jobTitle = localStorage.getItem('jobTitle');
    if (jobTitle) {
        // Invoke searchVacancies function with the keyword from pay calculator
        searchVacanciesByKeyword(jobTitle);
    }
    localStorage.clear();
});

// retrieves description and tasks most relevant to vacancy job title
function displayInfo(vacancy, detailsDiv) {
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        if (data.length > 0) {
            // Create and append description and tasks array objects based on api schema
            var descriptionElement = document.createElement('p');
            descriptionElement.textContent = "Description: " + data[0].description;

            var tasksElement = document.createElement('p');
            tasksElement.textContent = "Tasks: " + data[0].tasks;

            // Append description and tasks elements to the job listing div
            detailsDiv.appendChild(descriptionElement);
            detailsDiv.appendChild(tasksElement);
        } else {
            // error validation if no data can be accessed
            console.error("No data returned from API for vacancy:", vacancy);
          }
    }
  };
    // query the api to run the link using job title
    xhttp2.open("GET", "https://api.lmiforall.org.uk/api/v1/soc/search?q=" + encodeURIComponent(vacancy.title), true);
    xhttp2.send();
}

// this function runs to retrieve data from api if user followed the link from pay calculator
function searchVacanciesByKeyword(keyword, data) {
    var xhttp = new XMLHttpRequest();
    document.getElementById("results").innerHTML = ''; // clear results of previous search before query
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // parse api data and use it to display vacancy search results
            var vacancies = JSON.parse(this.responseText);
            displayResults(vacancies, data);
        }
    };
    // keyword from pay calculator used to query the api call
    xhttp.open("GET", "https://api.lmiforall.org.uk/api/v1/vacancies/search?keywords=" + encodeURIComponent(keyword), true);
    xhttp.send();
}

// used if user entered keyword within the vacancy page
function searchVacancies(data) {
      var xhttp = new XMLHttpRequest();
      var keyword = document.getElementById("searchInput").value;
      document.getElementById("results").innerHTML = ''; // results cleared before new api query
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var vacancies = JSON.parse(this.responseText);
          displayResults(vacancies, data); // runs to display data within html once api data is retrieved
        }
      };
  xhttp.open("GET", "https://api.lmiforall.org.uk/api/v1/vacancies/search?keywords=" + encodeURIComponent(keyword), true);
  xhttp.send();
}

// creates html elements and displays 10 most recent vacancies information within
function displayResults(vacancies, data) {
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  // displays up to 10 vacancies
  var count = Math.min(vacancies.length, 10);
  for (var i = 0; i < count; i++) {
      var vacancy = vacancies[i]; // each vacancy is a new iteration

      // div element for each job listing
      var vacancyDiv = document.createElement('div');
      vacancyDiv.classList.add('vacancy');

      // div for vacancy information
      var detailsDiv = document.createElement('div');
      detailsDiv.classList.add('details');
      detailsDiv.style.display = 'none'; // Initially hide details

      // displays job title for the vacancy
      var titleElement = document.createElement('h2');
      titleElement.textContent = vacancy.title;
      titleElement.id = "title"; // used to reference in css to add style

      // description and tasks queried for the relevant vacancy
      displayInfo(vacancy, detailsDiv);

      // displays along job title to distinguish vacancies when search first runs
      var companyElement = document.createElement('p');
      companyElement.textContent = 'Company: ' + vacancy.company;
      companyElement.id = "company";

      // job description accessed based on api schema
      var summaryElement = document.createElement('p');
      summaryElement.textContent = vacancy.summary;

      // element to display address and postcode or both depending on vacancy
      var locationElement = document.createElement('p');
      locationElement.textContent = 'Location: ' + vacancy.location.location;

      // link to original job listing on gov.uk site
      var linkElement = document.createElement('a');
      linkElement.textContent = 'Apply for this job';
      linkElement.href = vacancy.link;
      linkElement.target = '_blank'; // Open link in a new tab

      // Append title and company to display at the top
      vacancyDiv.appendChild(titleElement);
      vacancyDiv.appendChild(companyElement);
      // details div below with extensive vacancy information
      detailsDiv.appendChild(summaryElement);
      detailsDiv.appendChild(locationElement);
      detailsDiv.appendChild(linkElement);
      // appended to ensure details are part of vacancy
      vacancyDiv.appendChild(detailsDiv);

      // event listener to collapse and expand details div
      // IIFE used to manipulate details immediately as part of the vacancy
      (function(detailsDiv) {
          var isExpanded = false; // Track the state of detailsDiv

          var toggleButton = document.createElement('button');
          toggleButton.id = 'collapse-btn'; // used in css
          toggleButton.textContent = 'Show more';
          toggleButton.addEventListener('click', function() {
              toggleDetails(detailsDiv); // passes in relevant details div
          });
          vacancyDiv.appendChild(toggleButton);

          // used in the event listener to collapse and expand vacancy info
          function toggleDetails(detailsDiv) {
              if (isExpanded) {
                  detailsDiv.style.display = 'none';
                  toggleButton.textContent = 'Show more';
              } else {
                  detailsDiv.style.display = 'block';
                  toggleButton.textContent = 'Show less';
              }
              isExpanded = !isExpanded; // Toggle the state
          }
      })(detailsDiv);


      // appends the job listing div to the results container
      resultsDiv.appendChild(vacancyDiv);
      }
}