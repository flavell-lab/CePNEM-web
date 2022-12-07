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

    // Loop through all table rows except the header row.
    for (var i = 1; i < table.rows.length; i++) {
        // Get the current row
        var row = table.rows[i];

        // Check if the current row has any cells that match the filter values
        var dataCells = row.getElementsByTagName("td");

        // Get the current dataset
        var dataset = dataCells[0].innerHTML;
        var match = true;
        for (var j = 0; j < filterValues.length; k++) {
            value = filterValues[j].toUpperCase();
            match_this = false;
            for (var k = 0; k < length(matches[value]); k++) {
                if (matches[value][0] == dataset) {
                    match_this = true;
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
        } else {
            row.style.display = "none";
        }
    }
});