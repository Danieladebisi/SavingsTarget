// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {

    // Get the form element
    const form = document.getElementById("contact-form");

    // Add a submit event listener to the form
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Prepare the data to send
        const formData = {
            name: name,
            email: email,
            message: message
        };

        // Send the data to the Google Sheets Web App
        fetch("YOUR_GOOGLE_SCRIPT_WEB_APP_URL", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response
            if (data.result === "success") {
                alert("Message sent successfully!");
                form.reset(); // Clear the form after successful submission
            } else {
                alert("Failed to send message. Please try again later.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to send message. Please try again later.");
        });
    });

});
