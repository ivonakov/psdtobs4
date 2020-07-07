// Init
window.addEventListener("DOMContentLoaded", () => {
  navBg();
  navLink();
  addBr();
  stikyDrone();
  hideCollapse();
  close();
  year();
});

// Scroll
window.addEventListener("scroll", () => {
  stikyDrone();
  navBg();
});

// Separate functions
const navLink = () => {
  document.querySelectorAll("li>a:not([href='./'])").forEach((e) => {
    e.addEventListener("click", function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            1000
          );
        }
      }
    });
  });
};

const navBg = () => {
  const $nav = document.querySelector("nav.navbar");
  const scroll = $(window).scrollTop();
  if ($nav.classList && scroll < $nav.offsetHeight) {
    $nav.classList.remove("scrolled");
  } else {
    $nav.classList.add("scrolled");
  }
};

const stikyDrone = () => {
  const $nav = document.querySelector("nav.navbar");
  const el = document.querySelector("#about h3");
  el.style.cssText = "top: " + $nav.offsetHeight + "px;";
};

const addBr = () => {
  const items = document.querySelectorAll("h6 > small");
  for (let i = 0; i < items.length; i++) {
    const text = items[i].textContent;
    let words = text.split(" ");
    words[0] = words[0] + "<br />";
    items[i].innerHTML = words.join(" ");
  }
};

const hideCollapse = () => {
  document.querySelectorAll(".nav-link").forEach((e) => {
    e.addEventListener("click", () => {
      $(".collapse").collapse("hide");
    });
  });
};

const close = () => {
  document.querySelector(".btn-close").addEventListener("click", () => {
    document.querySelector(".navbar-collapse").classList.remove("show");
  });
};

const year = () => {
  document
    .querySelector(".year")
    .insertAdjacentHTML("beforeend", new Date().getFullYear());
};

$("body").scrollspy({
  target: "nav",
  offset: 60,
});
