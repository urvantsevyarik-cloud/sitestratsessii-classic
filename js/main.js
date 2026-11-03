;(function () {
"use strict";
/* Настройки. Заполните перед публикацией. */
const CONFIG = {
  FORM_ENDPOINT: "",        // адрес приёма заявок (Formspree, Getform, свой сервер). Пока пусто – форма сообщит, что не подключена
  YM_ID: "113844987",                // номер счётчика Яндекс.Метрики, например "12345678"
  VK_PIXEL_ID: "",          // номер пикселя VK Реклама / top.mail.ru
  POLICY_URL: "#",          // ссылка на политику обработки персональных данных
  REQS_URL: "#",            // ссылка на реквизиты ИП
  TELEGRAM: "https://t.me/Alexey_Urvancev"
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const q = new URLSearchParams(location.search);
const rub = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0\u20bd";

/* Счётчики. Подключаются, только если указан номер. */
if (CONFIG.YM_ID) {
  (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=" + CONFIG.YM_ID, "ym");
  ym(CONFIG.YM_ID, "init", { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });
}
if (CONFIG.VK_PIXEL_ID) {
  const _tmr = window._tmr || (window._tmr = []);
  _tmr.push({ id: CONFIG.VK_PIXEL_ID, type: "pageView", start: new Date().getTime() });
  const s = document.createElement("script"); s.async = true; s.src = "https://top-fwz1.mail.ru/js/code.js"; document.head.appendChild(s);
}
function goal(pos) {
  try { if (CONFIG.YM_ID) ym(CONFIG.YM_ID, "reachGoal", "lead", { form_position: pos }); } catch (e) {}
  try { if (CONFIG.VK_PIXEL_ID) (window._tmr = window._tmr || []).push({ type: "reachGoal", id: CONFIG.VK_PIXEL_ID, goal: "lead" }); } catch (e) {}
}

/* Ссылки в подвале */
$$("[data-policy]").forEach(a => a.href = CONFIG.POLICY_URL);
$$("[data-reqs]").forEach(a => a.href = CONFIG.REQS_URL);

/* Заголовок: ?h=a или ?h=b для теста */
const heads = {
  main: "Стратегическая сессия, после которой у команды <b class=\"ac\">есть план, а не набор идей</b>",
  a: "Идеи на сессии были, а через месяц <b class=\"ac\">ничего не изменилось</b>",
  b: "Стратегическая сессия, на которой <b class=\"ac\">первое лицо говорит последним</b>"
};
const variant = heads[q.get("h")] ? q.get("h") : "main";
$("#h1").innerHTML = heads[variant];

/* Мобильное меню */
const hdr = $("#top"), burger = $("#burger");
burger.addEventListener("click", () => {
  const open = hdr.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
$$("#nav a").forEach(a => a.addEventListener("click", () => { hdr.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

/* Диалоги */
const formDlg = $("#formDlg"), lbDlg = $("#lbDlg");
const closeOnBackdrop = d => d.addEventListener("click", e => { if (e.target === d) d.close(); });
[formDlg, lbDlg].forEach(closeOnBackdrop);
$$("dialog [data-close]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));
$$("[data-open-form]").forEach(b => b.addEventListener("click", () => { hdr.classList.remove("open"); formDlg.showModal(); }));
$$("[data-letter]").forEach(b => b.addEventListener("click", () => {
  $("#lbImg").src = b.dataset.letter; $("#lbImg").alt = b.dataset.alt; lbDlg.showModal();
}));

/* Липкая кнопка на телефоне: прячется, когда рядом уже есть форма или кнопка */
const st = $("#sticky"), seen = new Map();
if ("IntersectionObserver" in window) {
  const io2 = new IntersectionObserver(es => { es.forEach(e => seen.set(e.target, e.isIntersecting)); st.classList.toggle("off", [...seen.values()].some(Boolean)); }, { threshold: .15 });
  $$(".hero, .fband, .fdark").forEach(x => io2.observe(x));
}

/* Формы. Если на странице Тильды есть её форма (например, во всплывающем окне), заявки уходят через неё: в «Заявки» и в подключённые сервисы (amoCRM) */
function tildaForm() { return document.querySelector("#rec5246119101 form") || document.querySelector("form.js-form-proccess") || document.querySelector(".t-popup form.t-form") || document.querySelector("form.t-form"); }
function formHTML(pos) {
  const hid = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "erid"]
    .map(k => `<input type="hidden" name="${k}" value="${(q.get(k) || "").replace(/"/g, "&quot;")}">`).join("");
  const consent = pos === "final" || pos === "popup"
    ? `<label class="chk"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных (<a href="${CONFIG.POLICY_URL}">политика</a>)</span></label>`
    : `<p class="small" style="margin-bottom:14px">Нажимая кнопку, вы соглашаетесь с <a href="${CONFIG.POLICY_URL}">политикой обработки персональных данных</a>.</p>`;
  return `<form novalidate>
<div class="f"><input type="text" name="name" placeholder="Имя" autocomplete="name" aria-label="Имя" required>
<input type="text" name="contact" placeholder="Телефон или Telegram" autocomplete="tel" aria-label="Телефон или Telegram" required></div>
${hid}<input type="hidden" name="headline_variant" value="${variant}"><input type="hidden" name="form_position" value="${pos}">
${consent}<button class="btn" type="submit">Обсудить задачу сессии</button><p class="err" role="alert" hidden></p></form>`;
}
$$("[data-form]").forEach(box => {
  const pos = box.dataset.form;
  box.innerHTML = formHTML(pos);
  const f = $("form", box), err = $(".err", box);
  const fail = (t, el) => { err.hidden = false; err.textContent = t; el && el.focus(); };
  f.addEventListener("submit", async e => {
    e.preventDefault(); err.hidden = true;
    const bad = $$("input[required]", f).find(i => i.type === "checkbox" ? !i.checked : !i.value.trim());
    if (bad) return fail(bad.type === "checkbox" ? "Подтвердите согласие на обработку данных." : "Заполните имя и телефон или Telegram.", bad);
    const tf = tildaForm();
    if (!tf && !CONFIG.FORM_ENDPOINT) return fail("Форма пока не подключена к приёму заявок. Напишите в Telegram @Alexey_Urvancev.");
    if (tf) {
      const d = Object.fromEntries(new FormData(f));
      const note = ["Форма: " + d.form_position, "Заголовок: " + d.headline_variant, d.erid && ("erid: " + d.erid), d.utm_source && ("utm_source: " + d.utm_source), d.utm_medium && ("utm_medium: " + d.utm_medium), d.utm_campaign && ("utm_campaign: " + d.utm_campaign), d.utm_content && ("utm_content: " + d.utm_content), d.utm_term && ("utm_term: " + d.utm_term)].filter(Boolean).join("; ");
      const inputs = [...tf.querySelectorAll("input,textarea")].filter(el => !["hidden", "checkbox", "radio", "submit", "button"].includes(el.type));
      const byName = n => inputs.find(el => (el.name || "").toLowerCase() === n);
      const fire = el => ["input", "change", "keyup"].forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));
      const put = (el, v) => { if (el) { el.value = v; fire(el); } };
      const phoneEl = byName("phone"), commentEl = byName("comment"), emailEl = byName("email");
      const nameEl = byName("name") || inputs.find(el => el !== phoneEl && el !== commentEl && el !== emailEl && !/tel|email/.test(el.type));
      put(nameEl, d.name); put(phoneEl, d.contact); put(commentEl, "Имя: " + d.name + "; " + note);
      const btn = tf.querySelector(".t-submit") || tf.querySelector("button[type=submit]") || tf.querySelector("button");
      console.log("[lead] отправка через форму Тильды", { name: d.name, contact: d.contact });
      if (!btn) return fail("Не удалось отправить. Напишите в Telegram @Alexey_Urvancev.");
      btn.click();
      goal(pos);
      box.innerHTML = '<p class="ok" role="status">Заявка получена. Напишу или позвоню в течение рабочего дня, чтобы договориться о времени разговора.</p>';
      return;
    }
    try {
      const r = await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(f))) });
      if (!r.ok) throw 0;
      goal(pos);
      box.innerHTML = '<p class="ok" role="status">Заявка получена. Напишу или позвоню в течение рабочего дня, чтобы договориться о времени разговора.</p>';
    } catch { fail("Не удалось отправить. Попробуйте ещё раз или напишите в Telegram @Alexey_Urvancev."); }
  });
});



/* Слайдер «Атмосфера мероприятий» */
$$("[data-atm]").forEach(box => {
  const t = $(".atm-t", box), prev = $(".prev", box), next = $(".next", box), cnt = $("[data-atm-n]", box.parentElement);
  const step = () => { const i = $(".atm-i", t); return i ? i.getBoundingClientRect().width + 16 : 300; };
  const upd = () => {
    prev.disabled = t.scrollLeft < 4;
    next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
    if (cnt) cnt.textContent = Math.min(t.children.length, Math.round(t.scrollLeft / step()) + 1);
  };
  prev.addEventListener("click", () => t.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => t.scrollBy({ left: step(), behavior: "smooth" }));
  t.addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true });
  t.addEventListener("keydown", e => { if (e.key === "ArrowRight") { t.scrollBy({ left: step(), behavior: "smooth" }); e.preventDefault(); } if (e.key === "ArrowLeft") { t.scrollBy({ left: -step(), behavior: "smooth" }); e.preventDefault(); } });
  window.addEventListener("resize", upd); upd();
});


/* Просмотр фото из «Атмосферы мероприятий» */
(function () {
  const dlg = $("#galDlg"); if (!dlg) return;
  const opens = $$(".atm-o"), img = $("#galImg"), cnt = $("#galCnt"), prev = $(".prev", dlg), next = $(".next", dlg);
  const thumbs = opens.map(b => $("img", b).src), fulls = opens.map(b => new URL(b.dataset.full, $("img", b).src).href);
  let cur = 0;
  const pre = i => { const x = new Image(); x.src = fulls[(i + fulls.length) % fulls.length]; };
  function show(i) {
    cur = (i + opens.length) % opens.length;
    img.onerror = () => { img.onerror = null; img.src = thumbs[cur]; };
    img.src = fulls[cur];
    cnt.textContent = (cur + 1) + " из " + opens.length;
    pre(cur + 1); pre(cur - 1);
  }
  opens.forEach((b, i) => b.addEventListener("click", () => { show(i); dlg.showModal(); next.focus({ preventScroll: true }); }));
  prev.addEventListener("click", () => show(cur - 1));
  next.addEventListener("click", () => show(cur + 1));
  dlg.addEventListener("keydown", e => { if (e.key === "ArrowLeft") { show(cur - 1); e.preventDefault(); } else if (e.key === "ArrowRight") { show(cur + 1); e.preventDefault(); } });
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target.tagName === "FIGURE") dlg.close(); });
  let x0 = null;
  dlg.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  dlg.addEventListener("close", () => {
    img.removeAttribute("src");
    const t = $(".atm-t"), it = opens[cur] && opens[cur].closest(".atm-i");
    if (t && it) t.scrollTo({ left: it.offsetLeft - t.offsetLeft, behavior: "auto" });
  });
})();

})();
