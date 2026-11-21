# ⚡ Site Speed

**🇬🇧 English** | [🇩🇪 Deutsch](#-deutsch)

Compare how fast up to three websites respond, measured right from your own browser.

**Live:** https://muhammedfidann06.github.io/site-speed/

## Features

- Test one site or compare up to three side by side
- 5 requests per site: one cold start, four warm ones
- Shows first request, average, best and worst time
- Small bar chart for every run and a 🏆 for the fastest site
- Plain HTML, CSS and JavaScript, no dependencies

## How it works

The first request includes the DNS lookup and TLS handshake, so it's always the slowest. The next four reuse the open connection and get a random query parameter so no cache answers instead of the server. The average of those four decides the grade:

| Average | Grade |
| --- | --- |
| under 300 ms | Fast |
| 300 – 800 ms | Okay |
| over 800 ms | Slow |

Requests are sent with `fetch` in `no-cors` mode and timed with `performance.now()`. Sites are tested one after another so they don't compete for bandwidth.

## Limitations

- It measures the time until the server answers, not the full page load with images and scripts.
- Results depend on your own connection, so compare sites in the same run.
- Only `https://` sites can be tested from a GitHub Pages site.

---

## 🇩🇪 Deutsch

Vergleicht, wie schnell bis zu drei Websites antworten, gemessen direkt im eigenen Browser.

**Live:** https://muhammedfidann06.github.io/site-speed/

### Funktionen

- Eine Seite testen oder bis zu drei nebeneinander vergleichen
- 5 Anfragen pro Seite: ein Kaltstart, vier warme
- Zeigt erste Anfrage, Durchschnitt, beste und schlechteste Zeit
- Kleines Balkendiagramm pro Durchlauf und ein 🏆 für die schnellste Seite
- Reines HTML, CSS und JavaScript, keine Abhängigkeiten

### Funktionsweise

Die erste Anfrage enthält DNS-Abfrage und TLS-Handshake und ist deshalb immer die langsamste. Die nächsten vier nutzen die offene Verbindung und bekommen einen zufälligen Query-Parameter, damit kein Cache statt des Servers antwortet. Der Durchschnitt dieser vier bestimmt die Bewertung (unter 300 ms schnell, 300–800 ms okay, über 800 ms langsam).

### Einschränkungen

- Gemessen wird die Zeit bis zur Serverantwort, nicht das komplette Laden mit Bildern und Skripten.
- Die Ergebnisse hängen von der eigenen Verbindung ab, daher Seiten im selben Durchlauf vergleichen.
- Nur `https://`-Seiten können getestet werden.
