import calendar
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:
    raise SystemExit("Pillow is required: python3 -m pip install Pillow") from exc


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = PROJECT_ROOT / "public/static/assets/images/calendar.webp"

FONT_CANDIDATES = {
    "ko": [
        Path("/System/Library/Fonts/AppleSDGothicNeo.ttc"),
        Path("/Library/Fonts/AppleGothic.ttf"),
        Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
        Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc"),
    ],
    "en": [
        Path("/System/Library/Fonts/Helvetica.ttc"),
        Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"),
    ],
}

WIDTH = 1698
HEIGHT = 1862

BG = (255, 255, 255)
TEXT_MAIN = (88, 88, 88)
TEXT_SUB = (145, 145, 145)
TEXT_DARK = (35, 35, 35)
TEXT_SUN = (225, 178, 182)
TEXT_SAT = (152, 152, 152)
LINE = (216, 216, 216)
HIGHLIGHT = (225, 178, 182)


def resolve_font(font_key: str) -> Path:
    for path in FONT_CANDIDATES[font_key]:
        if path.exists():
            return path

    searched = ", ".join(str(path) for path in FONT_CANDIDATES[font_key])
    raise FileNotFoundError(f"No {font_key} font found. Searched: {searched}")


def load_font(font_key: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(resolve_font(font_key), size=size)


def draw_centered_text(draw: ImageDraw.ImageDraw, text: str, y: int, font: ImageFont.FreeTypeFont, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=font, fill=fill)


def draw_calendar():
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)

    ko_title_font = load_font("ko", 65)
    en_title_font = load_font("en", 61)
    weekday_font = load_font("ko", 63)
    day_font = load_font("en", 67)

    # Top text
    draw_centered_text(draw, "2026년 8월 8일 | 오후 2시", 130, ko_title_font, TEXT_MAIN)
    draw_centered_text(draw, "Saturday, August 8, 2026 | PM 2:00", 275, en_title_font, TEXT_SUB)

    # Divider lines
    draw.line([(24, 527), (WIDTH - 24, 527)], fill=LINE, width=4)
    draw.line([(24, HEIGHT - 24), (WIDTH - 24, HEIGHT - 24)], fill=LINE, width=4)

    # Weekday headers
    weekdays = ["일", "월", "화", "수", "목", "금", "토"]
    left = 95
    right = WIDTH - 95
    col_step = (right - left) / 6
    header_y = 660

    for idx, label in enumerate(weekdays):
        x = int(left + idx * col_step)
        color = TEXT_SUN if idx == 0 else TEXT_DARK
        draw.text((x, header_y), label, font=weekday_font, fill=color, anchor="mm")

    # August 2026 (Sunday-first)
    cal = calendar.Calendar(firstweekday=6)
    weeks = cal.monthdayscalendar(2026, 8)

    first_row_y = 910
    row_step = 170

    for row_idx, week in enumerate(weeks):
        y = first_row_y + row_idx * row_step
        for col_idx, day in enumerate(week):
            if day == 0:
                continue

            x = int(left + col_idx * col_step)

            # Highlight wedding day
            if day == 8:
                draw.ellipse((x - 61, y - 61, x + 61, y + 61), fill=HIGHLIGHT)
                draw.text((x, y + 2), str(day), font=day_font, fill=(255, 255, 255), anchor="mm")
                continue

            if col_idx == 0:  # Sunday
                color = TEXT_SUN
            elif col_idx == 6:  # Saturday
                color = TEXT_SAT
            else:
                color = TEXT_DARK

            draw.text((x, y + 2), str(day), font=day_font, fill=color, anchor="mm")

    image.save(OUTPUT_PATH, "WEBP", lossless=True, method=6)


if __name__ == "__main__":
    draw_calendar()
    print(f"Updated calendar image: {OUTPUT_PATH}")
