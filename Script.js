function initTrackAnimation(pathId, carLayerId, drawDuration = 5000, loopDuration = 12000) {
    const path = document.getElementById(pathId);
    const carLayer = document.getElementById(carLayerId);
    if (!path || !carLayer) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = `stroke-dashoffset ${drawDuration}ms ease-in-out`;

    requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });

    let startTime = null;
    function animate(time) {
        if (!startTime) startTime = time;
        const t = ((time - startTime) % loopDuration) / loopDuration;
        const dist = t * length;
        const pt = path.getPointAtLength(dist);
        carLayer.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
        requestAnimationFrame(animate);
    }

    setTimeout(() => requestAnimationFrame(animate), drawDuration);
}

function initF1Assistant(btnId, windowId, messagesId, inputId, sendBtnId) {
    const btn = document.getElementById(btnId);
    const windowChat = document.getElementById(windowId);
    const messages = document.getElementById(messagesId);
    const input = document.getElementById(inputId);
    const send = document.getElementById(sendBtnId);

    if (!btn || !windowChat || !messages || !input || !send) return;

    btn.onclick = () => {
        windowChat.style.display = windowChat.style.display === 'flex' ? 'none' : 'flex';
        windowChat.style.flexDirection = 'column';
    };

    function botReply(userText) {
        userText = userText.toLowerCase();
        let reply = "Интересный вопрос!";

        if (userText.includes("ферстаппен") || userText.includes("verstappen"))
            reply = "Макс Ферстаппен — гонщик Red Bull Racing, трёхкратный чемпион мира.";
        else if (userText.includes("ред бул") || userText.includes("red bull"))
            reply = "Red Bull Racing доминирует последние сезоны благодаря мощному болиду RB20.";
        else if (userText.includes("мерседес"))
            reply = "Mercedes AMG Petronas — восьмикратные чемпионы среди конструкторов.";
        else if (userText.includes("феррари"))
            reply = "Scuderia Ferrari — самая легендарная команда Формулы 1.";
        else if (userText.includes("макларен") || userText.includes("mclaren"))
            reply = "McLaren — британская команда, известная победами Айртона Сенны.";
        else if (userText.includes("привет"))
            reply = "Привет! Готов обсудить гонки, пилотов и трассы.";

        const botMsg = document.createElement('div');
        botMsg.className = 'assistant-msg bot';
        botMsg.textContent = reply;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }

    send.onclick = () => {
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'assistant-msg user';
        userMsg.textContent = text;
        messages.appendChild(userMsg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => botReply(text), 600);
    };
}

function animateValue(el, start, end, duration = 3500) {
    let startTime = null;
    function update(time) {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function initAchievementsAnimation(options = {}) {
  const duration = options.duration ?? 4000;
  const minInterval = options.minInterval ?? 8;

  const stats = document.querySelectorAll('.stat-value');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
      if (!entry.isIntersecting || el.classList.contains('animated')) return;

      el.classList.add('animated');

      let target = parseInt(el.textContent.replace(/\s+/g, ''), 10);
      if (isNaN(target) || target <= 0) {
        el.textContent = '0';
        return;
      }

      el.textContent = '0';

      let intervalMs = Math.round(duration / target);
      if (intervalMs < minInterval) intervalMs = minInterval;

      let current = 0;
      const timer = setInterval(() => {
        current += 1;     
        if (current >= target) {
          el.textContent = String(target);
          clearInterval(timer);
        } else {
          el.textContent = String(current);
        }
      }, intervalMs);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  initAchievementsAnimation({ duration: 4000, minInterval: 8 });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('trackPath') && document.getElementById('carLayer')) {
        initTrackAnimation('trackPath', 'carLayer', 5000, 12000);
    }

    initF1Assistant('assistantBtn', 'assistantWindow', 'chatMessages', 'userInput', 'sendBtn');

    document.querySelectorAll('.stat-card, .driver-card, .driver-detail').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    initStatsAnimation();

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        setTimeout(() => {
            const msg = document.createElement('div');
            msg.textContent = 'Добро пожаловать в мир Формулы 1!';
            msg.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #e10600;
                color: #fff;
                padding: 1rem 2rem;
                border-radius: 8px; Power+", desc: "Пятый титул, уверенное доминирование над Феттелем.", img: "images/mercedes2018.jpg" },
  2019: { name: "Льюис Хэмилтон", team: "Mercedes", car: "Mercedes F1 W10 EQ Power+", desc: "Шестой чемпионский титул, Mercedes снова непобедим.", img: "images/mercedes2019.jpg" },
  2020: { name: "Льюис Хэмилтон", team: "Mercedes", car: "Mercedes F1 W11 EQ Performance", desc: "Седьмой титул — повторение рекорда Шумахера.", img: "images/mercedes2020.jpg" },
  2021: { name: "Макс Ферстаппен", team: "Red Bull Racing", car: "Red Bull RB16B", desc: "Драма в Абу-Даби, Ферстаппен становится чемпионом мира.", img: "images/redbull2021.jpg" },
  2022: { name: "Макс Ферстаппен", team: "Red Bull Racing", car: "Red Bull RB18", desc: "22 гонки, 15 побед — абсолютное превосходство Red Bull.", img: "images/redbull2022.jpg" },
  2023: { name: "Макс Ферстаппен", team: "Red Bull Racing", car: "Red Bull RB19", desc: "19 побед — рекорд всех времён, Red Bull доминирует.", img: "images/redbull2023.jpg" },
  2024: { name: "Макс Ферстаппен", team: "Red Bull Racing", car: "Red Bull RB20", desc: "Четвёртый подряд титул. Историческая серия Red Bull.", img: "images/redbull2024.jpg" },
  2025: { name: "???", team: "???", car: "???", desc: "Сезон продолжается — интрига ещё впереди!", img: "images/f1default.jpg" }
};
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 9999;
                font-weight: 600;
            `;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 3500);
        }, 600);
    }
});
