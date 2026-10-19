# PostSignal – portfolio

```
index.html        struktura strony
css/style.css     cały wygląd (kolory w :root)
js/data.js        TUTAJ dodajesz projekty, filtry, opisy
js/scene.js       scena 3D: karty, bańki, kamera, ruch
js/ui.js          filtry, podpis case study, modal, kursor
js/main.js        spina całość ze scrollem
assets/img        logo
assets/video      tło (animowany gradient)
assets/work       okładki i klipy projektów
```

## Dodanie projektu
1. Wrzuć pliki do `assets/work/` (okładka 9:16 jpg/webp, opcjonalnie krótki klip `preview` mp4 3–6 s do ~1 MB).
2. Dopisz obiekt w `js/data.js`. Pełne wideo (`video`) najlepiej jako embed Vimeo/YouTube.

## Uruchomienie lokalnie
Moduły JS wymagają serwera: `python3 -m http.server`, potem http://localhost:8000

## Publikacja
GitHub → Settings → Pages → Deploy from branch → `main` / root. Domena: Custom domain + rekordy DNS wg instrukcji GitHuba.
