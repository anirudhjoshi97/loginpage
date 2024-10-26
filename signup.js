document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate phone number: Make sure the input is not empty
    if (!phone) {
        document.getElementById('error').textContent = 'Phone number is required.';
        return;
    }

    const userData = {
        name,
        countryCode,
        phone,
        email,
        password
    };

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('success').textContent = 'Signup successful! Please log in.';
            document.getElementById('error').textContent = '';
        } else {
            document.getElementById('error').textContent = 'Error signing up: ' + data.message;
            document.getElementById('success').textContent = '';
        }
    } catch (error) {
        document.getElementById('error').textContent = 'Error signing up: ' + error.message;
        document.getElementById('success').textContent = '';
    }
});
