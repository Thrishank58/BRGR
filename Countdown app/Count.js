// Countdown with smooth fade animation on change
let intervalId = null;

function pad(v) { return v.toString().padStart(2,'0'); }

function getTimeParts(ms) {
  const total = Math.max(ms, 0);
  const days = Math.floor(total / (1000*60*60*24));
  const hours = Math.floor((total / (1000*60*60)) % 24);
  const minutes = Math.floor((total / (1000*60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function updateElementWithFade(el, value) {
  // add fade class, update after short delay, then remove
  el.classList.add('fade');
  setTimeout(() => {
    el.textContent = value;
    el.classList.remove('fade');
  }, 260); // matches CSS transition
}

function startCountdown(targetTime, eventName) {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const titleEl = document.getElementById('countTitle');

  titleEl.textContent = eventName;

  // clear any old interval
  if (intervalId) clearInterval(intervalId);

  function tick() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      // final state
      updateElementWithFade(daysEl, '00');
      updateElementWithFade(hoursEl, '00');
      updateElementWithFade(minsEl, '00');
      updateElementWithFade(secsEl, '00');
      clearInterval(intervalId);
      intervalId = null;
      return;
    }

    const t = getTimeParts(diff);
    updateElementWithFade(daysEl, pad(t.days));
    updateElementWithFade(hoursEl, pad(t.hours));
    updateElementWithFade(minsEl, pad(t.minutes));
    updateElementWithFade(secsEl, pad(t.seconds));
  }

  // run immediately and then every second
  tick();
  intervalId = setInterval(tick, 1000);
}

/* UI flow: form -> countdown screen (fade) */
document.addEventListener('DOMContentLoaded', () => {
  const formScreen = document.getElementById('formScreen');
  const countdownScreen = document.getElementById('countdownScreen');
  const startBtn = document.getElementById('startBtn');

  startBtn.addEventListener('click', () => {
    const name = document.getElementById('eventName').value.trim();
    const dateVal = document.getElementById('eventDate').value;

    if (!name || !dateVal) {
      // small inline feedback (use alert to keep it simple)
      alert('Enter event name and date/time.');
      return;
    }

    const target = new Date(dateVal).getTime();
    if (isNaN(target) || target <= Date.now()) {
      alert('Choose a valid future date and time.');
      return;
    }

    // fade out form, show countdown
    formScreen.classList.add('hidden');

    // slight delay so hide looks smooth, then show countdown
    setTimeout(() => {
      countdownScreen.classList.remove('hidden');
      countdownScreen.classList.add('show');
      startCountdown(target, name);
    }, 160);
  });
});
