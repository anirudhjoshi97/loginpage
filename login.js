document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            // Redirect to the welcome page after a successful login
            window.location.href = "welcome.html";
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
