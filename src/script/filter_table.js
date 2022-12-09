/*
 * This script was adapted from code written by chatGPT.
 */ 

// Get references to the table and input elements
var table = document.getElementById("dataset_table");
var input = document.getElementById("filter-input");
var filterButton = document.getElementById("filter-button");

// Add an event listener to the filter button
filterButton.addEventListener("click", function() {
    // Get the filter values from the input element
    var filterValues = input.value.toUpperCase().split(",");

	var notFound = [];
    // Loop through all table rows except the header row.
    for (var i = 1; i < table.rows.length; i++) {
        // Get the current row
        var row = table.rows[i];

        // Check if the current row has any cells that match the filter values
        var dataCells = row.getElementsByTagName("td");

        // Get the current dataset
        var dataset = dataCells[0].textContent.replace(/\s/g, "");
        var match = true;

        link_url_append = [];
        for (var j = 0; j < filterValues.length; j++) {
            value = filterValues[j].replace(/\s/g, "").toUpperCase();
			if (value == "") {
				continue;
			}
			if (!Object.keys(matches).includes(value)) {
				if (!notFound.includes(value)) {
					notFound.push(value);
				}
				match = false;
				continue;
			}
            match_this = false;
            for (var k = 0; k < matches[value].length; k++) {
                if (matches[value][k][0] == dataset) {
                    match_this = true;
                    link_url_append.push(matches[value][k][1]);
                    break;
                }
            }
            if (!match_this) {
                match = false;
                break;
            }
        }
        // If there was a match, show the row, otherwise hide it
        if (match) {
            row.style.display = "";
            var links = dataCells[0].quareySelectorAll('a');
            links.forEach((link) => {
                matches_url_str = link_url_append.map((number) => `neurons[]=${encodeURIComponent(number)}`).join('&');
                link.setAttribute('href', "load_dataset.php?name=" + dataset + "&" + matches_url_str);
            });
        } else {
            row.style.display = "none";
        }
    }
	if (notFound.length > 0) {
		alert("Warning: neurons " + notFound + " not detected.");
    }
});
