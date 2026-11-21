const RUNS = 5;
const TIMEOUT = 10000;

const form = document.getElementById("speed-form");
const button = document.getElementById("run-btn");
const statusEl = document.getElementById("status");
const results = document.getElementById("results");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const urls = [...form.querySelectorAll(".url")]
    .map((el) => el.value.trim())
    .filter(Boolean);

  const invalid = urls.find((u) => !u.startsWith("https://"));
  if (invalid) {
    setStatus("Only https:// addresses can be tested from the browser.", true);
    return;
  }

  button.disabled = true;
  results.innerHTML = "";
  const cards = urls.map(createCard);

  // one site at a time so they don't slow each other down
  const summaries = [];
  for (let i = 0; i < urls.length; i++) {
    setStatus(`Testing ${new URL(urls[i]).host}...`);
    summaries.push(await testSite(urls[i], cards[i]));
  }

  markWinner(summaries, cards);
  setStatus("Done.");
  button.disabled = false;
});

async function testSite(url, card) {
  const times = [];

  for (let i = 0; i < RUNS; i++) {
    const ms = await timeRequest(url, i === 0);
    if (ms === null) {
      showDown(card);
      return null;
    }
    times.push(ms);
    drawBars(card, times);
  }

  const warm = times.slice(1);
  const summary = {
    cold: times[0],
    avg: Math.round(warm.reduce((a, b) => a + b, 0) / warm.length),
    min: Math.min(...warm),
    max: Math.max(...warm),
  };

  showSummary(card, summary);
  return summary;
}

async function timeRequest(url, cold) {
  // a random query param makes sure no cache sits in between,
  // except on the first run where we want the real cold start
  const target = cold ? url : addBuster(url);
  const start = performance.now();

  try {
    await fetch(target, {
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT),
    });
    return Math.round(performance.now() - start);
  } catch {
    return null;
  }
}

function addBuster(url) {
  const u = new URL(url);
  u.searchParams.set("_t", Date.now().toString(36));
  return u.href;
}

function grade(avg) {
  if (avg < 300) return ["fast", "Fast"];
  if (avg < 800) return ["ok", "Okay"];
  return ["slow", "Slow"];
}

function createCard(url) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-head">
      <span class="host"></span>
      <span class="grade down">testing</span>
    </div>
    <div class="numbers">
      <div><strong data-key="cold">–</strong>first request</div>
      <div><strong data-key="avg">–</strong>average</div>
      <div><strong data-key="min">–</strong>best</div>
      <div><strong data-key="max">–</strong>worst</div>
    </div>
    <div class="bars"></div>
  `;
  card.querySelector(".host").textContent = new URL(url).host;
  results.appendChild(card);
  return card;
}

function drawBars(card, times) {
  const bars = card.querySelector(".bars");
  const highest = Math.max(...times);
  bars.innerHTML = "";

  times.forEach((t, i) => {
    const bar = document.createElement("div");
    bar.className = i === 0 ? "bar cold" : "bar";
    bar.style.height = `${(t / highest) * 100}%`;
    bar.title = `${t} ms`;
    bars.appendChild(bar);
  });
}

function showSummary(card, summary) {
  for (const [key, value] of Object.entries(summary)) {
    card.querySelector(`[data-key="${key}"]`).textContent = `${value} ms`;
  }
  const [cls, label] = grade(summary.avg);
  const badge = card.querySelector(".grade");
  badge.className = `grade ${cls}`;
  badge.textContent = label;
}

function showDown(card) {
  const badge = card.querySelector(".grade");
  badge.className = "grade down";
  badge.textContent = "No response";
}

function markWinner(summaries, cards) {
  if (summaries.filter(Boolean).length < 2) return;

  let best = -1;
  summaries.forEach((s, i) => {
    if (s && (best === -1 || s.avg < summaries[best].avg)) best = i;
  });
  cards[best].classList.add("winner");
  cards[best].querySelector(".grade").textContent += " 🏆";
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}
