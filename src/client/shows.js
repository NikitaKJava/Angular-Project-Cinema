document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/customers")
        .then(response => response.json())
        .then(data => console.log(data));
});

const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var formdata = new FormData(this);
    fetch("http://localhost:3000/login", {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Array.from(formdata))
    }).then(data => console.log(data));
})