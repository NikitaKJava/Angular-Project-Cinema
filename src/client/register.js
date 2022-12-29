const registerForm = document.getElementById("register");

registerForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var formdata = new FormData(this);
    console.log(formdata);
    console.log(JSON.stringify(Array.from(formdata)));
    fetch("http://localhost:3000/register", {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Array.from(formdata))
        }).then(data => console.log(data))
        .then(data => console.log(data));
})