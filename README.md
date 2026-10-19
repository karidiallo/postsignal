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

## POP2UP (pierwszy projekt)
Plik `.mov` trzeba zamienić na mp4 (H.264), inaczej przeglądarki go nie zagrają:
```
ffmpeg -i POP2UP.mov -vf "scale=-2:1280" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -an -movflags +faststart assets/work/pop2up.mp4
```
Wynik wrzuć do `assets/work/pop2up.mp4`. Opis i wynik edytujesz w `js/data.js`.
