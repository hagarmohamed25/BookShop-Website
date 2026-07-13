const form = document.querySelector("form");
const password = document.getElementById("pass");
const confirmPassword = document.getElementById("conf_pass");
const errorMessage = document.getElementById("error_msg");

form.addEventListener("submit", function (event) {
    if (password.value !== confirmPassword.value) {
        errorMessage.textContent = "Passwords do not match";
    }
});

form.addEventListener("submit", function (event) {

    if (password.value !== confirmPassword.value) {
        event.preventDefault(); 
        errorMessage.textContent = "Passwords do not match";
    } else {
        errorMessage.textContent = "";
    }

});