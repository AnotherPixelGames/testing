/* =================================
   SETH PERCIVAL — SCRIPT.JS
================================= */


/* =================================
   CURSOR GLOW
================================= */

const cursor = document.getElementById("cursor");

if (cursor) {
  document.addEventListener("mousemove", (event) => {
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
  });
}


/* =================================
   3D CARD TILT
================================= */

const cards = document.querySelectorAll(".tilt");

cards.forEach((card) => {

  card.addEventListener("mousemove", (event) => {

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX =
      ((y / rect.height) - 0.5) * -12;

    const rotateY =
      ((x / rect.width) - 0.5) * 12;

    card.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;
  });


  card.addEventListener("mouseleave", () => {

    card.style.transform = `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  });

});


/* =================================
   COOLNESS METER
================================= */

const meterSection = document.getElementById("meter");
const meterFill = document.getElementById("meterFill");
const score = document.getElementById("score");

let meterStarted = false;

if (meterSection && meterFill && score) {

  const observer = new IntersectionObserver(
    (entries) => {

      if (
        entries[0].isIntersecting &&
        !meterStarted
      ) {

        meterStarted = true;

        meterFill.style.width = "100%";

        let current = 0;

        const interval = setInterval(() => {

          current += Math.ceil(
            Math.random() * 7
          );

          if (current >= 100) {
            current = 100;
            clearInterval(interval);
          }

          score.textContent =
            current + "%";

        }, 70);

        observer.disconnect();
      }

    },
    {
      threshold: 0.35
    }
  );

  observer.observe(meterSection);
}


/* =================================
   SECRET BUTTON
================================= */

const secretButton =
  document.getElementById("secretButton");

const secretMessage =
  document.getElementById("secretMessage");


if (secretButton && secretMessage) {

  secretButton.addEventListener(
    "click",
    revealSecret
  );

}


function revealSecret() {

  secretMessage.style.display = "block";

  document.body.classList.add(
    "rainbow-mode"
  );

  secretButton.textContent =
    "😎 YOU HAVE BEEN WARNED 😎";

  secretButton.disabled = true;

  createEmojiExplosion();
}


/* =================================
   EMOJI EXPLOSION
================================= */

function createEmojiExplosion() {

  const emojis = [
    "😎",
    "🔥",
    "⚡",
    "🗿",
    "🚀",
    "✨",
    "💀",
    "🏆"
  ];

  for (let i = 0; i < 30; i++) {

    const emoji =
      document.createElement("div");

    emoji.textContent =
      emojis[
        Math.floor(
          Math.random() * emojis.length
        )
      ];

    emoji.style.position = "fixed";

    emoji.style.left =
      Math.random() * 100 + "vw";

    emoji.style.top = "-50px";

    emoji.style.fontSize =
      20 + Math.random() * 25 + "px";

    emoji.style.zIndex = "9999";

    emoji.style.pointerEvents = "none";

    document.body.appendChild(emoji);


    const duration =
      2000 + Math.random() * 3000;

    const rotation =
      360 + Math.random() * 720;


    const animation =
      emoji.animate(
        [
          {
            transform:
              "translateY(0) rotate(0deg)",
            opacity: 1
          },

          {
            transform:
              `translateY(110vh) rotate(${rotation}deg)`,
            opacity: 0.8
          }
        ],
        {
          duration: duration,
          easing: "linear"
        }
      );


    animation.onfinish = () => {
      emoji.remove();
    };

  }
}


/* =================================
   SMOOTH NAVIGATION
================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


/* =================================
   EXTRA CARD GLOW
================================= */

cards.forEach((card) => {

  card.addEventListener("mouseenter", () => {

    card.style.boxShadow =
      "0 20px 60px rgba(0, 234, 255, 0.2)";

  });


  card.addEventListener("mouseleave", () => {

    card.style.boxShadow = "";

  });

});


/* =================================
   CONSOLE EASTER EGG
================================= */

console.log(
  "%c😎 SETH PERCIVAL 😎",
  "font-size: 30px; font-weight: bold; color: #ff32d0;"
);

console.log(
  "%cYou found the developer console.",
  "font-size: 16px; color: #00eaff;"
);

console.log(
  "%cCoolness level: 100%",
  "font-size: 14px; color: #ffea00;"
);
