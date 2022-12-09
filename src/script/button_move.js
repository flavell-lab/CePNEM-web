var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].onclick = function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
      panel.style.maxWidth = null;
      panel.style.overflow = 'hidden';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 20 + "px";
      panel.style.maxWidth = panel.scrollWidth + "px";
      panel.style.overflow = 'auto';
    }
  }
}
