function sendLogin() {
  console.log("button worked");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch(`http://localhost:3000/login?username=${username}&password=${password}`, {mode: 'cors', method: 'post'})
    .then(
  function(response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }
      // Examine the text in the response
      console.log("response.json", response.json());
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}