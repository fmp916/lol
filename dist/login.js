document.getElementById('bookingForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Blokowanie domyślnego przesyłania formularza

  // Pobranie wartości pól formularza
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Walidacja CAPTCHA
  const captchaResponse = grecaptcha.getResponse();
  if (!isCaptchaValid(captchaResponse)) {
      alert("Potwierdź, że nie jesteś robotem!");
      return false;
  }

  // Walidacja danych formularza
  if (!isEmailValid(email)) {
      alert("Proszę wprowadzić poprawny adres e-mail.");
      return false;
  }

  if (!isPasswordValid(password)) {
      alert("Hasło musi zawierać co najmniej 8 znaków, w tym 1 literę, 1 cyfrę i 1 znak specjalny.");
      return false;
  }

  // Haszowanie hasła
  const hashedPassword = await hashPassword(password);

  // Zamiana wartości pola hasła na zaszyfrowane
  document.getElementById('password').value = hashedPassword;

  // Wysłanie formularza ręcznie po przetworzeniu danych
  document.getElementById('bookingForm').submit();
});

// Funkcja do walidacji CAPTCHA
function isCaptchaValid(captchaResponse) {
  return captchaResponse.length !== 0;
}

// Funkcja do walidacji adresu e-mail
function isEmailValid(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Funkcja do walidacji hasła
function isPasswordValid(password) {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
}

// Funkcja do haszowania hasła za pomocą SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
}
