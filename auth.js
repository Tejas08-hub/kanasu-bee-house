function signup() {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch(err => alert(err.message));
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch(err => alert(err.message));
}