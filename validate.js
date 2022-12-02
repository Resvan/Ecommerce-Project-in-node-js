var nameError = document.getElementById('name-error');
var emailError = document.getElementById('email-error');
var subjectError = document.getElementById('subject-error');
var messageError = document.getElementById('message-error');
var submitError = document.getElementById('submit-error');


function validateName() {
    var name = document.getElementById('contact-name').value.trim();

    if (name.length == 0) {
        nameError.innerHTML = 'Name is Required';
        nameError.style.color = 'red'
        return false;
    }

    if (!name.match(/^[A-Za-z ]*$/)) {
        nameError.innerHTML = 'Write a FullName';
        nameError.style.color = 'red'
        return false;
    }

    if (name.length < 3) {
        nameError.innerHTML = 'Enter minimum 3 charactors';
        nameError.style.color = 'red'
        return false;
    }

    nameError.innerHTML = 'Name is valid';
    nameError.style.color = 'green'
    return true;
}

function validateEmail() {
    var email = document.getElementById('contact-email').value.trim();
    if (email.length == 0) {
        emailError.innerHTML = 'Email is Required';
        emailError.style.color = 'red'
        return false;
    }

    if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        emailError.innerHTML = 'Email is Invalid';
        emailError.style.color = 'red'
        return false;
    }
    emailError.innerHTML = 'Email is valid';
    emailError.style.color = 'green'
    return true;
}

function validateMessage() {
    var message = document.getElementById('contact-message').value.trim();
    var Required = 15;
    var left = Required - message.length;

    if (message.length == 0 || message.length < 10) {
        messageError.innerHTML = 'More Character Required';
        messageError.style.color = 'red'
        return false;
    }
    messageError.innerHTML = 'Message is valid';
    messageError.style.color = 'green'
    return true;

}

function validateSubject() {
    var phone = document.getElementById("contact-subject").value.trim();
    if (phone.length == 0) {
        subjectError.innerHTML = 'Phone number is Required';
        subjectError.style.color = 'red'
        // document.getElementById("contact-subject").style.borderColor = "red"
        document.getElementById("contact-subject").style.color = "red"
        return false;
    }
    if (phone.length <= 9) {
        subjectError.innerHTML = "Enter Valid Phone Number"
        subjectError.style.color = "red"
        // document.getElementById("contact-subject").style.borderColor = "red"
        document.getElementById("contact-subject").style.color = "red"
        return false

    }
    if (phone.length >= 11) {
        subjectError.innerHTML = "Phone Number Must be 10 Digits"
        subjectError.style.color = "red"
        // document.getElementById("contact-subject").style.borderColor = "red"
        document.getElementById("contact-subject").style.color = "red"
        return false

    }
    if (!phone.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
        subjectError.innerHTML = "Phonenumber must be digits"
        subjectError.style.color("red")
        // document.getElementById("contact-subject").style.borderColor = "red"
        document.getElementById("contact-subject").style.color = "red"


        return false;
    }
    subjectError.innerHTML = ""
    // document.getElementById("contact-subject").style.borderColor = "green"
    subjectError.innerHTML = "Phone Number is valid"
    subjectError.style.color = 'green'
    return true;


}
function contactSubmit() {
    if (validateName() && validateEmail() && validateSubject() && validateMessage()) {
        return true;
    }
    return false;

}