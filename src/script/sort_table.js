/* 
 * Adapted from the following:
 * https://www.w3schools.com/howto/howto_js_sort_table.asp
 */
function sortTable(n,table_id) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(table_id);
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n].textContent;
      y = rows[i + 1].getElementsByTagName("TD")[n].textContent;
      /* Check the type of the two values,
      and compare them based on their type: */
      if (isNaN(x) || isNaN(y)) {
        /* If both values are strings, compare them
        alphabetically using the toLowerCase() method: */
        if (dir == "asc") {
          if (x.toLowerCase() > y.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.toLowerCase() < y.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      } else {
        /* If both values are numbers, compare them
        numerically using the parseInt() or parseFloat() function: */
        x = parseFloat(x);
        y = parseFloat(y);
        if (dir == "asc") {
          if (x > y) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x < y) {
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    /* If a switch has been marked, make the switch
	and mark that a switch has been done: */
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
