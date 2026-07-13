const form = document.querySelector("form");
const password = document.getElementById("pass");
const confirmPassword = document.getElementById("conf_pass");
const errorMessage = document.getElementById("error_msg");

form.addEventListener("submit", function (event) {
    if (password.value !== confirmPassword.value) {
        //event.preventDefault(); // Stop the form submission
        errorMessage.textContent = "Passwords do not match";
    }
});

form.addEventListener("submit", function (event) {

    if (password.value !== confirmPassword.value) {
        event.preventDefault(); // Stop the form
        errorMessage.textContent = "Passwords do not match";
    } else {
        errorMessage.textContent = "";
    }

});