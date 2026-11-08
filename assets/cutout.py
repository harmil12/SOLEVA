from PIL import Image
from collections import deque

src = r"C:\Users\User\.cursor\projects\c-Users-User-Documents-SOLEVA\assets\hero-cutout.jpg"
dst = r"C:\Users\User\Documents\SOLEVA\assets\images\hero-cutout.png"
im = Image.open(src).convert("RGBA")
w, h = im.size
px = im.load()


def is_bg(r, g, b):
    mx = max(r, g, b)
    mn = min(r, g, b)
    return (mx > 185 and (mx - mn) < 55) or (r > 200 and g > 200 and b > 200)


seen = [[False] * w for _ in range(h)]
q = deque()
seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
for x in range(0, w, 8):
    seeds.append((x, 0))
    seeds.append((x, h - 1))
for y in range(0, h, 8):
    seeds.append((0, y))
    seeds.append((w - 1, y))

for x, y in seeds:
    r, g, b, a = px[x, y]
    if is_bg(r, g, b):
        q.append((x, y))
        seen[y][x] = True

while q:
    x, y = q.popleft()
    r, g, b, a = px[x, y]
    px[x, y] = (r, g, b, 0)
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx]:
            rr, gg, bb, aa = px[nx, ny]
            if is_bg(rr, gg, bb):
                seen[ny][nx] = True
                q.append((nx, ny))

im.save(dst, "PNG")
print("saved", dst)
