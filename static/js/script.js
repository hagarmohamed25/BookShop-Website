const form = document.querySelector("form");
const password = document.getElementById("pass");
const confirmPassword = document.getElementById("conf_pass");
const errorMessage = document.getElementById("error_msg");

// Check if the password and confirm password match
form.addEventListener("submit", function (event) {
    if (password.value !== confirmPassword.value) {
        errorMessage.textContent = "Passwords do not match";
    }
});

// Prevent form submission if passwords do not match
form.addEventListener("submit", function (event) {

    if (password.value !== confirmPassword.value) {
        event.preventDefault(); // Stop the form
        errorMessage.textContent = "Passwords do not match";
    } else {
        errorMessage.textContent = "";
    }

});