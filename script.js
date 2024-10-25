document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    // Client-side validation for phone number length
    if (formData.phone.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("signupForm").reset(); // Reset form after submission
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
