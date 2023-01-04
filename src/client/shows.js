document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/customers")
        .then(response => response.json())
        .then(data => console.log(data));
})