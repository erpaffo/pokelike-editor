# -*- coding: utf-8 -*-
"""Compone uno screenshot pronto per il Chrome Web Store (1280x800).

Il popup è 480x600: da solo al centro di una tela 1280x800 lascia molto vuoto,
perché l'altezza limita l'ingrandimento a circa 1,1x. Per questo il popup sta a
sinistra e la colonna di destra porta titolo e punti chiave.

Uso:
    python make_screenshot.py cattura.png "Titolo" out.png ["punto uno|punto due"]

Richiede Pillow:  pip install Pillow
"""
import sys
from PIL import Image, ImageDraw

W, H = 1280, 800
PAD = 56
GAP = 56

BG_TOP = (21, 12, 29)
BG_BOTTOM = (9, 10, 18)
GOLD = (255, 215, 0)
WHITE = (255, 255, 255)
MUTED = (170, 177, 196)


def gradient_background():
    bg = Image.new('RGB', (W, H), BG_BOTTOM)
    draw = ImageDraw.Draw(bg)
    for y in range(H):
        k = y / (H - 1)
        draw.line([(0, y), (W, y)],
                  fill=tuple(round(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * k) for i in range(3)))
    return bg


def load_font(size, bold=True):
    from PIL import ImageFont
    names = ('segoeuib.ttf', 'arialbd.ttf') if bold else ('segoeui.ttf', 'arial.ttf')
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ''
    for word in words:
        probe = (cur + ' ' + word).strip()
        if draw.textbbox((0, 0), probe, font=font)[2] <= max_w:
            cur = probe
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def soft_shadow(canvas, box, radius=20, blur=30):
    x0, y0, x1, y1 = box
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([x0 - 4, y0 + 8, x1 + 4, y1 + 14],
                                             radius=radius, fill=(0, 0, 0, 165))
    try:
        from PIL import ImageFilter
        shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    except Exception:
        pass
    canvas.alpha_composite(shadow)


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        return 1

    shot_path, title, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    bullets = [b.strip() for b in sys.argv[4].split('|')] if len(sys.argv) > 4 else []

    shot = Image.open(shot_path).convert('RGBA')
    avail_h = H - 2 * PAD
    scale = min(avail_h / shot.height, 1.25)
    shot = shot.resize((round(shot.width * scale), round(shot.height * scale)), Image.LANCZOS)

    canvas = gradient_background().convert('RGBA')
    draw = ImageDraw.Draw(canvas)

    x = PAD
    y = (H - shot.height) // 2
    soft_shadow(canvas, (x, y, x + shot.width, y + shot.height))
    # bordo dorato: ImageDraw non fonde l'alpha, il colore va miscelato a mano
    k = 0.42
    muted_gold = tuple(round(BG_TOP[i] + (GOLD[i] - BG_TOP[i]) * k) for i in range(3))
    draw.rounded_rectangle([x - 1, y - 1, x + shot.width, y + shot.height],
                           radius=16, outline=muted_gold, width=1)
    canvas.alpha_composite(shot, (x, y))

    col_x = x + shot.width + GAP
    col_w = W - col_x - PAD
    f_title = load_font(46)
    f_bullet = load_font(24, bold=False)

    lines = wrap(draw, title, f_title, col_w)
    block_h = len(lines) * 58 + (28 + len(bullets) * 46 if bullets else 0)
    ty = (H - block_h) // 2

    for line in lines:
        draw.text((col_x, ty), line, font=f_title, fill=WHITE)
        ty += 58

    if bullets:
        ty += 28
        for b in bullets:
            draw.ellipse([col_x + 2, ty + 11, col_x + 12, ty + 21], fill=GOLD)
            for bl in wrap(draw, b, f_bullet, col_w - 28):
                draw.text((col_x + 28, ty), bl, font=f_bullet, fill=MUTED)
                ty += 34
            ty += 12

    canvas.convert('RGB').save(out_path, quality=95)
    print('scritto %s (%dx%d) - popup al %d%%' % (out_path, W, H, round(scale * 100)))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
