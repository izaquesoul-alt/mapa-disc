/* Mapa DISC · app.js — motor genérico do chat + resultado.
   Lê tudo de window.MAPA_DATA (data.js). Não edite textos aqui. */
(function () {
  "use strict";
  var D = window.MAPA_DATA;
  if (!D) { document.body.innerHTML = "<p style='padding:24px'>Erro: data.js não carregou.</p>"; return; }

  var LIKERT = D.likert || ["Discordo totalmente", "Discordo", "Nem concordo, nem discordo", "Concordo", "Concordo totalmente"];
  var KEY = "mapaEmocional:" + (D.version || "1");
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var scaleById = {};
  (D.scales || []).forEach(function (s) { scaleById[s.id] = s; });
  var sectionById = {};
  (D.sections || []).forEach(function (s, i) { s._i = i; sectionById[s.id] = s; });
  var questions = D.questions || [];

  /* ---------- Analytics opcional: defina window.mapaTrack = fn(evento, dados) ---------- */
  function track(ev, data) { try { if (typeof window.mapaTrack === "function") window.mapaTrack(ev, data || {}); } catch (e) {} }

  /* ---------- Estado + localStorage ---------- */
  var state = load() || fresh();
  function fresh() { return { consent: null, name: "", answers: {}, done: false }; }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); return s && s.answers ? s : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} state = fresh(); }

  /* ---------- Utilitários ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fill(t) { return String(t).replace(/\{nome\}/g, esc(state.name || "")); }
  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function show(id) {
    ["welcome", "chat", "result"].forEach(function (s) { $(s).classList.toggle("active", s === id); });
    window.scrollTo(0, 0);
  }

  /* ---------- Roteiro linear do chat ---------- */
  var steps = [];
  arr(D.intro).forEach(function (t) { steps.push({ type: "msg", text: t }); });
  steps.push({ type: "msg", text: D.askName || "Qual é o seu primeiro nome?" });
  steps.push({ type: "name" });
  arr(D.afterName).forEach(function (t) { steps.push({ type: "msg", text: t }); });
  var lastSection = null;
  questions.forEach(function (q, i) {
    if (q.section !== lastSection) {
      lastSection = q.section;
      var sec = sectionById[q.section];
      if (sec) {
        steps.push({ type: "section", sec: sec });
        arr(sec.transition).forEach(function (t) { steps.push({ type: "msg", text: t }); });
      }
    }
    steps.push({ type: "q", q: q, n: i + 1 });
  });
  arr(D.outro).forEach(function (t) { steps.push({ type: "msg", text: t }); });
  steps.push({ type: "end" });

  function isPending(st) {
    return (st.type === "name" && !state.name) || (st.type === "q" && state.answers[st.q.id] == null);
  }

  /* ---------- Renderização do chat ---------- */
  var log = $("log"), composer = $("composer"), cursor = 0, busy = false;

  function scrollDown() { requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; }); }
  function addBubble(cls, html, instant) {
    var b = el("div", "bubble " + cls + (instant ? " instant" : ""), html);
    log.appendChild(b); scrollDown(); return b;
  }
  function addDivider(sec, instant) {
    var total = (D.sections || []).length;
    log.appendChild(el("div", "divider" + (instant ? " instant" : ""), "Parte " + (sec._i + 1) + " de " + total + " · " + esc(sec.title)));
    scrollDown();
  }
  function izaqueSays(html, cls) {
    if (REDUCED) { addBubble("izq " + (cls || ""), html); return Promise.resolve(); }
    var tmp = el("div"); tmp.innerHTML = html;
    var len = (tmp.textContent || "").length;
    var dur = Math.min(1600, 420 + len * 18);
    var ty = el("div", "typing", "<i></i><i></i><i></i>");
    log.appendChild(ty); scrollDown();
    $("status").textContent = "digitando…";
    return wait(dur).then(function () {
      ty.remove(); $("status").textContent = "online";
      addBubble("izq " + (cls || ""), html);
      return wait(260);
    });
  }
  function renderPast(st) {
    if (st.type === "msg") addBubble("izq", fill(st.text), true);
    else if (st.type === "section") addDivider(st.sec, true);
    else if (st.type === "name") addBubble("me", esc(state.name), true);
    else if (st.type === "q") {
      addBubble("izq q", esc(st.q.text), true);
      addBubble("me", esc(LIKERT[state.answers[st.q.id] - 1]), true);
    }
  }

  function updateProgress(st) {
    var answered = questions.filter(function (q) { return state.answers[q.id] != null; }).length;
    var pct = questions.length ? Math.round(answered / questions.length * 100) : 0;
    $("progress-bar").style.width = pct + "%";
    $("progress").setAttribute("aria-valuenow", pct);
    $("prog-count").textContent = answered + " de " + questions.length;
    var sec = null;
    for (var i = Math.min(cursor, steps.length - 1); i >= 0; i--) { if (steps[i].type === "q") { sec = sectionById[steps[i].q.section]; break; } if (steps[i].type === "section") { sec = steps[i].sec; break; } }
    $("prog-section").textContent = sec ? sec.title : "Início";
    $("btn-back").disabled = busy || lastAnsweredIndex() < 0;
  }
  function lastAnsweredIndex() {
    for (var i = cursor - 1; i >= 0; i--) {
      var s = steps[i];
      if ((s.type === "q" && state.answers[s.q.id] != null) || (s.type === "name" && state.name)) return i;
    }
    return -1;
  }

  /* Reconstrói o histórico sem animação até o primeiro passo pendente. */
  function rebuild() {
    log.innerHTML = ""; composer.hidden = true; composer.innerHTML = "";
    for (cursor = 0; cursor < steps.length; cursor++) {
      var st = steps[cursor];
      if (st.type === "end") return finish();
      if (isPending(st)) {
        if (st.type === "q") addBubble("izq q", esc(st.q.text), true);
        prompt(st);
        log.style.scrollBehavior = "auto";
        requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; log.style.scrollBehavior = ""; });
        return;
      }
      renderPast(st);
    }
  }

  /* Avança com animação a partir do cursor até o próximo input. */
  function advance() {
    busy = true; updateProgress();
    var loop = function () {
      if (cursor >= steps.length) return;
      var st = steps[cursor];
      if (st.type === "end") { busy = false; return finish(true); }
      if (st.type === "section") { addDivider(st.sec); cursor++; return wait(350).then(loop); }
      if (st.type === "msg") { return izaqueSays(fill(st.text)).then(function () { cursor++; return loop(); }); }
      if (isPending(st)) {
        if (st.type === "q") return izaqueSays(esc(st.q.text), "q").then(function () { busy = false; prompt(st); });
        busy = false; return prompt(st);
      }
      renderPast(st); cursor++; return loop();
    };
    return loop();
  }

  function prompt(st) {
    composer.innerHTML = ""; composer.hidden = false;
    updateProgress();
    if (st.type === "name") {
      var f = el("form", "name-form");
      f.innerHTML = '<input id="name-input" type="text" autocomplete="given-name" autocapitalize="words" maxlength="30" placeholder="Seu primeiro nome" aria-label="Seu primeiro nome" required>' +
        '<button type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>';
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = (f.querySelector("input").value || "").trim().split(/\s+/)[0] || "";
        v = v.replace(/[<>&"'`]/g, "");
        if (!v) return;
        state.name = v.charAt(0).toLocaleUpperCase("pt-BR") + v.slice(1);
        save(); track("name_entered");
        composer.hidden = true;
        addBubble("me", esc(state.name));
        cursor++; advance();
      });
      composer.appendChild(f);
      setTimeout(function () { var i = $("name-input"); if (i) i.focus(); }, 50);
    } else if (st.type === "q") {
      var box = el("div", "likert");
      box.setAttribute("role", "group"); box.setAttribute("aria-label", "Quanto essa frase combina com você?");
      LIKERT.forEach(function (label, i) {
        var b = el("button", null, '<span class="dot" aria-hidden="true"></span><span>' + esc(label) + "</span>");
        b.type = "button"; b.dataset.v = i + 1;
        b.addEventListener("click", function () {
          if (busy) return;
          busy = true; b.classList.add("sel");
          state.answers[st.q.id] = i + 1; save();
          if (st.n === 1) track("first_answer");
          setTimeout(function () {
            composer.hidden = true;
            addBubble("me", esc(label));
            cursor++; advance();
          }, 140);
        });
        box.appendChild(b);
      });
      composer.appendChild(box);
    }
  }

  $("btn-back").addEventListener("click", function () {
    if (busy) return;
    var i = lastAnsweredIndex(); if (i < 0) return;
    var st = steps[i];
    if (st.type === "q") delete state.answers[st.q.id]; else state.name = "";
    save(); rebuild();
  });

  /* ---------- Pontuação (genérica) ---------- */
  function bandOf(score) {
    var b = D.bands || { low: [0, 40], mid: [40, 60], high: [60, 100] };
    var keys = Object.keys(b), max = -Infinity;
    keys.forEach(function (k) { max = Math.max(max, b[k][1]); });
    for (var i = 0; i < keys.length; i++) {
      var r = b[keys[i]];
      if (score >= r[0] && (score < r[1] || (r[1] === max && score <= max))) return keys[i];
    }
    return "mid";
  }
  function computeScores() {
    var sums = {}, counts = {};
    questions.forEach(function (q) {
      var a = state.answers[q.id]; if (a == null) return;
      var v = q.reverse ? 6 - a : a;
      sums[q.scale] = (sums[q.scale] || 0) + v; counts[q.scale] = (counts[q.scale] || 0) + 1;
    });
    var scores = {}, bands = {};
    (D.scales || []).forEach(function (s) {
      if (!counts[s.id]) return;
      var m = sums[s.id] / counts[s.id];
      var raw = (m - 1) / 4 * 100;
      scores[s.id] = Math.round(raw);
      bands[s.id] = bandOf(raw); // faixa sobre o escore sem arredondar (cortes como 67,5)
    });
    return { scores: scores, bands: bands };
  }
  /* polarity: 'positive' (alto = recurso), 'negative' (alto = atenção), 'neutral' (nenhum polo é melhor:
     o traço vira ponto forte quando alto e nunca vira ponto fraco). Padrão: big5 = neutral, demais = positive. */
  function pol(s) { return s.polarity || (s.group === "big5" ? "neutral" : "positive"); }
  function fav(s, score) { return pol(s) === "negative" ? 100 - score : score; }
  function ruleMatches(rule, bands) {
    return Object.keys(rule.when || {}).every(function (k) { return arr(rule.when[k]).indexOf(bands[k]) >= 0; });
  }

  /* ---------- Resultado ---------- */
  function finish(animated) {
    state.done = true; save();
    composer.hidden = true;
    updateProgress();
    track("completed");
    var go = function () { renderResult(); show("result"); };
    if (animated) setTimeout(go, REDUCED ? 200 : 1300); else go();
  }

  function buildCtx() {
    var c = computeScores();
    var scored = (D.scales || []).filter(function (s) { return c.scores[s.id] != null; });
    // escalas sem textos em results (ex.: group "apoio") entram no cálculo, mas não viram cards
    var byFav = scored.filter(hasRes).sort(function (a, b) { return fav(b, c.scores[b.id]) - fav(a, c.scores[a.id]); });
    var strengths = byFav.filter(function (s) { return fav(s, c.scores[s.id]) >= 60; }).slice(0, 3);
    if (!strengths.length && byFav.length && fav(byFav[0], c.scores[byFav[0].id]) > 40) strengths = [byFav[0]];
    var asc = byFav.slice().reverse();
    var rated = asc.filter(function (s) { return pol(s) !== "neutral"; });
    var weaknesses = rated.filter(function (s) { return fav(s, c.scores[s.id]) <= 40 && strengths.indexOf(s) < 0; }).slice(0, 3);
    if (!weaknesses.length && rated.length && strengths.indexOf(rated[0]) < 0 && fav(rated[0], c.scores[rated[0].id]) < 60) weaknesses = [rated[0]];
    asc = rated.concat(asc.filter(function (s) { return pol(s) === "neutral"; }));
    return { nome: state.name, scores: c.scores, bands: c.bands, scales: scored, strengths: strengths, weaknesses: weaknesses, byFavAsc: asc };
  }

  function defaultSummary(ctx) {
    var f = ctx.strengths[0], w = ctx.weaknesses[0];
    return {
      title: "O seu Mapa, " + ctx.nome,
      text: ctx.nome + ", " + (f ? "o seu maior recurso hoje é " + f.name + "." : "o seu perfil é equilibrado.") + (w ? " O ponto que mais pede cuidado é " + w.name + "." : ""),
      short: (f ? "força em " + f.name : "perfil equilibrado") + (w ? "; atenção em " + w.name : "")
    };
  }
  function resOf(id, band) { var r = (D.results || {})[id]; return (r && r[band]) || {}; }
  function hasRes(s) { return !!(D.results && D.results[s.id]); }

  /* Texto com HTML simples vindo do data.js: escapa tudo e libera só <b> <strong> <em> <i> <br>. */
  function richText(t) {
    return esc(t).replace(/&lt;(\/?)(b|strong|em|i)&gt;/g, "<$1$2>").replace(/&lt;br\s*\/?&gt;/g, "<br>");
  }

  /* Gráfico DISC: círculo em 4 quadrantes (D topo-esq, I topo-dir, S baixo-dir, C baixo-esq).
     Raio de cada quadrante = intensidade; ponto dourado = resultante do perfil. */
  function discSVG(d, o) {
    var cx = 180, cy = 175, R = 130, S = D.disc.styles;
    var quad = { D: [180, 270], I: [270, 360], S: [0, 90], C: [90, 180] };
    var rad = function (a) { return a * Math.PI / 180; };
    var p = function (a, r) { return [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))]; };
    var mx = Math.max(1, d.D, d.I, d.S, d.C); // raio relativo ao estilo mais forte (leitura DISC é relativa)
    var s = '<svg class="radar disc" viewBox="-10 -5 380 360" role="img" aria-label="Gráfico DISC: ' +
      ["D", "I", "S", "C"].map(function (k) { return k + " " + Math.round(d[k]); }).join(", ") + '">';
    [0.25, 0.5, 0.75, 1].forEach(function (f) { s += '<circle class="grid-ring" cx="' + cx + '" cy="' + cy + '" r="' + R * f + '"/>'; });
    s += '<line class="axis" x1="' + (cx - R - 8) + '" y1="' + cy + '" x2="' + (cx + R + 8) + '" y2="' + cy + '"/>' +
      '<line class="axis" x1="' + cx + '" y1="' + (cy - R - 8) + '" x2="' + cx + '" y2="' + (cy + R + 8) + '"/>';
    ["D", "I", "S", "C"].forEach(function (k, i) {
      var a = quad[k], r = R * Math.max(0.18, 0.95 * d[k] / mx), a0 = p(a[0], r), a1 = p(a[1], r);
      var main = k === o[0];
      s += '<path class="wedge" style="animation-delay:' + (0.15 + i * 0.12) + 's" fill="' + esc(S[k].color) + '" fill-opacity="' + (main ? 0.85 : 0.45) +
        '" d="M' + cx + "," + cy + " L" + a0.join(",") + " A" + r + "," + r + " 0 0 1 " + a1.join(",") + ' Z"/>';
      var lp = p((a[0] + a[1]) / 2, R + 4), lx = lp[0] + (lp[0] < cx ? -6 : 6);
      s += '<text class="q-k" text-anchor="' + (lp[0] < cx ? "end" : "start") + '" x="' + lx + '" y="' + (lp[1] + (lp[1] < cy ? -2 : 18)) + '" fill="' + esc(S[k].color) + '">' + k +
        '<tspan class="q-v" dx="5">' + Math.round(d[k]) + "</tspan></text>";
    });
    var vx = ((d.I + d.S) - (d.D + d.C)) / mx, vy = ((d.D + d.I) - (d.S + d.C)) / mx, vl = Math.sqrt(vx * vx + vy * vy), sc = vl > 1 ? 1 / vl : 1;
    var px = cx + vx * sc * R * 0.8, py = cy - vy * sc * R * 0.8;
    s += '<circle class="disc-pt" cx="' + px + '" cy="' + py + '" r="7"/>';
    s += '<text class="ax" x="' + cx + '" y="' + (cy - R - 14) + '" text-anchor="middle">ATIVO</text>' +
      '<text class="ax" x="' + cx + '" y="' + (cy + R + 24) + '" text-anchor="middle">RESERVADO</text>';
    return s + "</svg>";
  }

  function radarSVG(list, scores) {
    var n = list.length, cx = 180, cy = 175, R = 112;
    if (n < 3) return "";
    var pt = function (i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    var s = '<svg class="radar" viewBox="-30 0 420 350" role="img" aria-label="Gráfico radar da personalidade: ' +
      list.map(function (x) { return esc(x.name) + " " + scores[x.id] + "%"; }).join(", ") + '">';
    [25, 50, 75, 100].forEach(function (p) {
      s += '<polygon class="grid-ring" points="' + list.map(function (_, i) { return pt(i, R * p / 100).join(","); }).join(" ") + '"/>';
    });
    list.forEach(function (_, i) { var e = pt(i, R); s += '<line class="axis" x1="' + cx + '" y1="' + cy + '" x2="' + e[0] + '" y2="' + e[1] + '"/>'; });
    var poly = list.map(function (x, i) { return pt(i, Math.max(4, R * scores[x.id] / 100)); });
    s += '<polygon class="shape" points="' + poly.map(function (p) { return p.join(","); }).join(" ") + '"/>';
    poly.forEach(function (p) { s += '<circle class="pt" cx="' + p[0] + '" cy="' + p[1] + '" r="4.5"/>'; });
    list.forEach(function (x, i) {
      var p = pt(i, R + 24), anchor = Math.abs(p[0] - cx) < 10 ? "middle" : p[0] > cx ? "start" : "end";
      var words = x.name.split(" "), lines = [];
      words.forEach(function (w) { var l = lines[lines.length - 1]; if (l && (l + " " + w).length <= 13) lines[lines.length - 1] = l + " " + w; else lines.push(w); });
      var y0 = p[1] - (lines.length - 1) * 7 + (p[1] < cy - 20 ? -8 : p[1] > cy + 20 ? 8 : 0);
      s += '<text class="lbl" text-anchor="' + anchor + '" x="' + p[0] + '" y="' + y0 + '">';
      lines.forEach(function (l, k) { s += '<tspan x="' + p[0] + '" dy="' + (k ? 14 : 0) + '">' + esc(l) + "</tspan>"; });
      s += '<tspan class="val" x="' + p[0] + '" dy="15">' + scores[x.id] + "</tspan></text>";
    });
    return s + "</svg>";
  }

  var ICON = {
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>',
    wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>'
  };

  function tile(kind, tag, r) {
    return '<article class="tile ' + kind + '"><div class="tag">' + esc(tag) + "</div><h3>" + esc(r.title || "") + "</h3><p>" + esc(kind === "impact" ? (r.impact || "") : (r.text || "")) + "</p></article>";
  }

  function renderResult() {
    var ctx = buildCtx();
    var sum = (typeof D.profileSummary === "function" ? safe(function () { return D.profileSummary(ctx); }) : null) || defaultSummary(ctx);
    var big5 = ctx.scales.filter(function (s) { return s.group === "big5"; });
    var emo = ctx.scales.filter(function (s) { return s.group === "emocional"; });

    var strongTiles = ctx.strengths.map(function (s) { return tile("strong", s.name, resOf(s.id, ctx.bands[s.id])); });
    var weakTiles = ctx.weaknesses.map(function (s) { return tile("weak", s.name, resOf(s.id, ctx.bands[s.id])); });
    arr(D.strengthRules).forEach(function (r) { if (ruleMatches(r, ctx.bands)) strongTiles.unshift(tile("strong", "Combinação", r)); });
    var impactTiles = [];
    arr(D.weakPointRules).forEach(function (r) { if (ruleMatches(r, ctx.bands)) { weakTiles.unshift(tile("weak", "Combinação", r)); impactTiles.push(tile("impact", "Combinação", { title: r.title, impact: r.impact })); } });
    ctx.byFavAsc.forEach(function (s) {
      if (impactTiles.length >= 3) return;
      var r = resOf(s.id, ctx.bands[s.id]); if (!r.impact) return;
      impactTiles.push(tile("impact", s.name, { title: r.title, impact: r.impact }));
    });

    var waText = String(D.whatsapp && D.whatsapp.text || "Oi! Sou {nome}. Meu perfil: {perfil}")
      .replace(/\{nome\}/g, state.name || "").replace(/\{perfil\}/g, sum.short || "");
    var waNum = String(D.whatsapp && D.whatsapp.number || "").replace(/\D/g, "");
    var waHref = "https://wa.me/" + waNum + "?text=" + encodeURIComponent(waText);

    var h = '<div class="res">';
    var disc = D.disc && sum.disc ? sum : (D.disc ? safe(function () { var d = D.disc.compute(ctx.scores); var o = D.disc.order(d); return { disc: d, discOrder: o, combo: o[0] }; }) : null);
    if (disc && disc.disc) {
      var d = disc.disc, o = disc.discOrder || D.disc.order(d), combo = disc.combo || o[0];
      var st = D.disc.styles[o[0]] || {};
      var comboName = combo.split("").map(function (k) { return (D.disc.styles[k] || {}).label || k; }).join("-");
      h += '<header class="res-hero"><div class="eyebrow">Mapa DISC · ' + esc(state.name) + "</div>" +
        "<h1>" + esc(D.disc.title || "Seu perfil DISC") + "</h1>" +
        '<div class="disc-seal" style="--c:' + esc(st.color || "#C9A45C") + '"><span class="seal-k">' + esc(combo) + '</span><span class="seal-n">' + esc(comboName) + "</span></div>" +
        '<div class="summary">' + richText(sum.text || "") + "</div></header>";
      h += '<div class="grid grid-2">' +
        '<section class="card"><div class="eyebrow">Seu mapa DISC</div><h2>Como você age</h2><p class="lead">Quanto maior a área, mais presente o estilo. O ponto dourado mostra para onde o seu jeito tende.</p>' +
        '<div class="radar-wrap">' + discSVG(d, o) + "</div>" +
        '<ul class="disc-legend">' + ["D", "I", "S", "C"].map(function (k) {
          var s = D.disc.styles[k] || {};
          return '<li style="--c:' + esc(s.color || "#2FB38A") + '"><b>' + k + "</b><span>" + esc(s.name || k) + "</span><em>" + Math.round(d[k]) + "</em></li>";
        }).join("") + "</ul></section>" +
        '<section class="card style-card" style="--c:' + esc(st.color || "#2FB38A") + '"><div class="eyebrow">Seu estilo principal</div>' +
        "<h2>" + esc(o[0]) + " · " + esc(st.name || "") + '</h2><p class="lead">' + esc(st.eixo || "") + "</p>" +
        '<p class="style-text">' + esc(st.text || "") + "</p>" +
        '<div class="style-cols"><div><h3>Suas forças</h3><ul class="ticks">' + arr(st.forcas).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div><h3>Seus riscos</h3><ul class="ticks warn">' + arr(st.riscos).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" +
        (st.pressao ? '<div class="style-note"><span>Sob pressão</span>' + esc(st.pressao) + "</div>" : "") +
        (st.cresce ? '<div class="style-note grow"><span>Como você cresce</span>' + esc(st.cresce) + "</div>" : "") +
        "</section></div>";
      h += '<div class="layer-title"><div class="eyebrow">Camada de aprofundamento</div><h2>Por baixo do seu <em>DISC</em></h2><p>A sua personalidade e as suas emoções explicam por que o seu perfil se manifesta do jeito que se manifesta.</p></div>';
    } else {
      h += '<header class="res-hero"><div class="eyebrow">Resultado</div>' +
        "<h1>" + esc(state.name) + ", este é o <em>seu mapa</em>.</h1>" +
        '<div class="summary">' + richText(sum.text || "") + "</div></header>";
    }

    h += '<div class="grid grid-2">';
    if (big5.length) {
      h += '<section class="card"><div class="eyebrow">Personalidade · Big Five</div><h2>Como você é</h2><p class="lead">Quanto mais longe do centro, mais forte o traço.</p>' +
        '<div class="radar-wrap">' + radarSVG(big5, ctx.scores) + '</div><ul class="trait-list">' +
        big5.map(function (s) { var b = ctx.bands[s.id]; return "<li><span><b>" + esc(s.name) + "</b> · " + esc(b === "low" ? s.descLow : b === "high" ? s.descHigh : "equilíbrio entre os dois polos") + '</span><span class="num">' + ctx.scores[s.id] + "</span></li>"; }).join("") +
        "</ul></section>";
    }
    if (emo.length) {
      h += '<section class="card"><div class="eyebrow">Emoções</div><h2>Quão presente isso está na sua vida</h2><p class="lead">Intensidade de cada padrão emocional no seu dia a dia.</p><div class="bars">' +
        emo.map(function (s) {
          var v = ctx.scores[s.id], b = ctx.bands[s.id], c = s.color || "#2FB38A";
          return '<div class="bar"><div class="bar-top"><span class="bar-name">' + esc(s.name) + '</span><span class="bar-pct" style="color:' + esc(c) + '">' + v + '%</span></div>' +
            '<div class="bar-track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '" aria-label="' + esc(s.name) + '"><div class="bar-fill" style="width:' + v + '%;background:' + esc(c) + '"></div></div>' +
            '<div class="bar-desc">' + esc(b === "low" ? s.descLow : b === "high" ? s.descHigh : (resOf(s.id, b).title || "presença moderada")) + "</div></div>";
        }).join("") + "</div></section>";
    }
    h += "</div>";

    if (strongTiles.length) h += '<div class="section-title"><span class="ic ic-strong">' + ICON.up + '</span><h2>Seus pontos fortes</h2></div><div class="tiles">' + strongTiles.join("") + "</div>";
    if (weakTiles.length) h += '<div class="section-title"><span class="ic ic-weak">' + ICON.alert + '</span><h2>Pontos que pedem cuidado</h2></div><div class="tiles">' + weakTiles.join("") + "</div>";
    if (impactTiles.length) h += '<div class="section-title"><span class="ic ic-impact">' + ICON.wave + '</span><h2>O que isso pode impactar na sua vida</h2></div><div class="tiles">' + impactTiles.join("") + "</div>";

    h += '<section class="cta-box"><div class="eyebrow">Próximo passo</div><h2>Isso é só o mapa. <span class="gold"><em>O caminho</em></span> a gente faz junto.</h2>' +
      "<p>Me chama no WhatsApp com o seu resultado, e eu te mostro o que fazer a partir dele.</p>" +
      '<a class="btn btn-gold btn-block" id="btn-wa" href="' + esc(waHref) + '" target="_blank" rel="noopener">' + ICON.wa + esc(D.cta || "Compreenda mais a si mesma") + "</a></section>";
    h += '<p class="disclaimer">' + ICON.info + "<span>" + esc(D.disclaimer || "Ferramenta de autoconhecimento. Não substitui acompanhamento psicológico.") + "</span></p>";
    h += '<nav class="res-foot"><button class="linkish" id="btn-redo">Refazer o mapa</button><button class="linkish" id="btn-erase">Apagar meus dados deste aparelho</button><a href="privacidade.html">Privacidade</a></nav>';
    h += "</div>";

    var root = $("result"); root.innerHTML = h;
    $("btn-wa").addEventListener("click", function () { track("whatsapp_click", { perfil: sum.short }); });
    $("btn-redo").addEventListener("click", function () { var n = state.name, c = state.consent; wipe(); state.consent = c; state.name = n; save(); openChat(); });
    $("btn-erase").addEventListener("click", function () { wipe(); location.reload(); });
    if (/X/i.test(D.whatsapp && D.whatsapp.number || "X")) console.warn("[Mapa] Preencha whatsapp.number em data.js");
  }
  function safe(fn) { try { return fn(); } catch (e) { console.error("[Mapa] profileSummary falhou:", e); return null; } }

  /* ---------- Boas-vindas ---------- */
  function openChat() { show("chat"); log.innerHTML = ""; cursor = 0; busy = false; rebuild(); }
  function openChatAnimated() {
    show("chat"); log.innerHTML = ""; composer.hidden = true;
    // reconstrói o que já existe; se nada foi respondido, anima a intro
    var anything = state.name || Object.keys(state.answers).length;
    if (anything) return rebuild();
    cursor = 0; advance();
  }
  var consent = $("consent"), btnStart = $("btn-start");
  var minutes = Math.max(2, Math.round(questions.length * 8 / 60));
  $("w-time").textContent = "Cerca de " + minutes + " minutos, em formato de conversa";
  consent.checked = !!state.consent;
  btnStart.disabled = !consent.checked;
  consent.addEventListener("change", function () { btnStart.disabled = !consent.checked; [].forEach.call(document.querySelectorAll("[data-needs-consent]"), function (b) { b.disabled = !consent.checked; }); });

  var hasProgress = state.name || Object.keys(state.answers).length;
  if (state.done) {
    renderResult(); show("result");
  } else if (hasProgress) {
    var area = $("start-area");
    btnStart.textContent = "Continuar de onde parei";
    var redo = el("button", "btn btn-ghost btn-block", "Começar do zero");
    redo.setAttribute("data-needs-consent", ""); redo.disabled = !consent.checked;
    redo.addEventListener("click", function () { wipe(); state.consent = new Date().toISOString(); save(); openChatAnimated(); });
    area.appendChild(redo);
  }
  btnStart.addEventListener("click", function () {
    if (!consent.checked) return;
    if (!state.consent) { state.consent = new Date().toISOString(); save(); }
    track("start");
    openChatAnimated();
  });
  track("view");
})();
