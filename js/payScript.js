function calculateSalary() {
    var jobTitle = document.getElementById("job").value;
    var pay = parseFloat(document.getElementById("pay").value);
    var timeframe = document.getElementById("timeframe").value;
    var weekHrs = parseFloat(document.getElementById("weekHrs").value);

    // Check if field is empty or inappropriate data type
    if (jobTitle === "" || isNaN(pay) || timeframe === "" || isNaN(weekHrs)) {
        alert("Please fill in all required fields appropriately, pay and hours should be numeric");
        return;
    }

    var hourPay, weekPay, monthPay, annualPay;

    // calculation based on the timeframe from html form
    if (timeframe == "hourly") {
        hourPay = pay;
        weekPay = weekHrs * hourPay;
        monthPay = weekPay * 4.3; // month has 4.3 weeks on average
        annualPay = monthPay * 12;
    } else if (timeframe == "weekly") {
         weekPay = pay;
         hourPay = weekPay / weekHrs;
         monthPay = weekPay * 4.3;
         annualPay = monthPay * 12;
    } else if (timeframe == "monthly") {
         monthPay = pay;
         weekPay = monthPay / 4.3;
         hourPay = weekPay / weekHrs;
         annualPay = monthPay * 12;
    } else {
         annualPay = pay;
         monthPay = annualPay / 12;
         weekPay = monthPay / 4.3;
         hourPay = weekPay / weekHrs;
    }

    // round up results
    hourlyRate = hourPay.toFixed(2);
    weeklySalary = weekPay.toFixed(2);
    monthlySalary = monthPay.toFixed(2);
    annualSalary = annualPay.toFixed(2);

    // retrieve div used to display results
    const resultsDiv = document.getElementById('result');

    // used to retrieve on vacancy search page if view jobs link below is followed
    localStorage.setItem('jobTitle', jobTitle);

    // display results
    const resultString = "<span id='job-header'>Job: " + jobTitle + "</span><button id='view-jobs' onclick=directToVacancy()> View " + jobTitle + " jobs" + "</button><br> Working " + weekHrs + " hours a week for £" + pay + " " + timeframe + " breaks down into: <br>" + "£" + hourlyRate + " per hour <br>" + "£" + weeklySalary + " per week <br>" + "£" + monthlySalary + " per month <br>" + "£" + annualSalary + " per year <br>"

    // div for each separate vacancy calculation
    const resultElement = document.createElement('div');
    resultElement.id = "calc-div"; // id to reference in css so style can be applied
    resultElement.innerHTML = resultString;
    resultsDiv.appendChild(resultElement);

    resultsDiv.style.display = 'block';
}

// directs to vacancy page to display relevant vacancies based on job title entered into form
function directToVacancy(){
    window.location.href = 'vacancy.html';
}
