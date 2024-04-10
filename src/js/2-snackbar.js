import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";



const startBtn = document.querySelector("[data-start]");
const datetimePicker = document.getElementById("datetime-picker");
const daysDisplay = document.querySelector("[data-days]");
const hoursDisplay = document.querySelector("[data-hours]");
const minutesDisplay = document.querySelector("[data-minutes]");
const secondsDisplay = document.querySelector("[data-seconds]");

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    const currentDate = new Date();

    if (userSelectedDate <= currentDate) {
      iziToast.warning({
        title: "Warning",
        message: "Please choose a date in the future",
        position: "topCenter"
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  }
});

class Timer {
  constructor(futureDate) {
    this.futureDate = futureDate;
    this.timerInterval = null;
  }

  start() {
    const updateTimer = () => {
      const currentTime = new Date();
      const timeDifference = this.futureDate - currentTime;

      if (timeDifference <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const { days, hours, minutes, seconds } = this.convertMs(timeDifference);
      this.updateDisplay({ days, hours, minutes, seconds });
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  updateDisplay({ days, hours, minutes, seconds }) {
    daysDisplay.textContent = String(days).padStart(2, "0");
    hoursDisplay.textContent = String(hours).padStart(2, "0");
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }
}
startBtn.addEventListener("click", () => {
  const selectedDate = new Date(datetimePicker.value);
  const timer = new Timer(selectedDate);
  timer.start();
  startBtn.disabled = true;
});
