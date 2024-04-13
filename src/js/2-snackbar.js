import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const delayInput = document.querySelector('input[name="delay"]');
  const stateInputs = document.querySelectorAll('input[name="state"]');

  const delay = delayInput.value;

  const state = [...stateInputs].find(input => input.checked).value;

  const notificationPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  notificationPromise
    .then((delay) => {
      iziToast.success({
        title: "Fulfilled promise",
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: "topCenter",
      });
      delayInput.value = '';
      stateInputs.forEach(input => input.checked = false);
    })
    .catch((delay) => {
      iziToast.error({
        title: "Rejected promise",
        message: `❌ Rejected promise in ${delay}ms`,
        position: "topCenter",
      });
      delayInput.value = '';
      stateInputs.forEach(input => input.checked = false);
    });
});
