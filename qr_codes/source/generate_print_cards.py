#!/usr/bin/env python3
"""
Generate a printable HTML (two cards per page) using existing QR PNGs in qr_codes/.
Each card shows the NYU logo, headings, and a large QR with a caption.

Output: qr_codes/print_cards.html
"""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
QR_DIR = ROOT / "qr_codes"
IMG_DIR = ROOT / "images"
OUTPUT_HTML = QR_DIR / "print_cards.html"

def collect_qr_images() -> list[Path]:
    images = []
    for ext in ("*.png", "*.jpg", "*.jpeg"):
        images.extend(sorted(QR_DIR.glob(ext)))
    # Exclude the source folder
    images = [p for p in images if p.is_file() and "source" not in p.parts]
    return images

def derive_label_from_filename(p: Path) -> str:
    name = p.stem
    # Example: Room_307_QR -> Room 307
    name = name.replace("_QR", "").replace("_", " ")
    return name.strip()

def build_html(qr_images: list[Path]) -> str:
    logo_rel = os.path.relpath(IMG_DIR / "nyu-logo.svg", QR_DIR)
    card_items = []
    for p in qr_images:
        label = derive_label_from_filename(p)
        rel = os.path.relpath(p, QR_DIR)
        card_items.append(f"""
        <div class=\"card\">
            <div class=\"card-header\">
                <img class=\"logo\" src=\"{logo_rel}\" alt=\"NYU Logo\"/>
                <div class=\"header-text\">
                    <div class=\"dept\">NYU Steinhardt</div>
                    <div class=\"subtitle\">Music and Performing Arts Professions</div>
                </div>
            </div>
            <div class=\"info\">
                <div>For urgent tech support: <strong>(212) 995-3355</strong></div>
                <div>Report issues: <strong>steinhardt.technology@nyu.edu</strong></div>
            </div>
            <div class=\"titles\">
                <div class=\"left-title\">Do you want to report a tech issue?</div>
                <div class=\"right-title\">Room Instructions</div>
            </div>
            <div class=\"qr-row\">
                <div class=\"qr-col\">
                    <img class=\"qr\" src=\"{rel}\" alt=\"{label} QR\"/>
                    <div class=\"scan\">SCAN ME</div>
                </div>
                <div class=\"qr-col\">
                    <img class=\"qr\" src=\"{rel}\" alt=\"{label} QR\"/>
                    <div class=\"scan\">SCAN ME</div>
                </div>
            </div>
            <div class=\"label\">{label}</div>
        </div>
        """)

    cards_html = "\n".join(card_items)
    return f"""
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"utf-8\"/>
    <title>Printable QR Cards</title>
    <style>
        @page {{ size: Letter; margin: 0.5in; }}
        body {{ font-family: Arial, Helvetica, sans-serif; color: #111; }}
        .page {{ display: grid; grid-template-columns: 1fr; gap: 0.6in; }}
        .card {{ border: 1px solid #ccc; border-radius: 10px; padding: 16px; }}
        .card-header {{ display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }}
        .logo {{ height: 28px; }}
        .dept {{ color: #57068c; font-weight: 700; }}
        .subtitle {{ font-size: 12px; opacity: 0.85; }}
        .info {{ font-size: 12px; margin: 10px 0 6px 0; }}
        .titles {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #3b3b3b; font-weight: 600; margin: 6px 0; }}
        .qr-row {{ display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; }}
        .qr-col {{ text-align: center; }}
        .qr {{ width: 100%; max-width: 3.2in; border-radius: 10px; }}
        .scan {{ margin-top: 6px; font-weight: 700; letter-spacing: 1px; }}
        .label {{ text-align: center; margin-top: 10px; font-size: 14px; font-weight: 600; color: #57068c; }}

        /* Two cards per page */
        .card { page-break-inside: avoid; }
        .card + .card { margin-top: 0.6in; }

        @media print {{
            body {{ margin: 0; }}
            .page {{ gap: 0.5in; }}
        }}
    </style>
    </head>
    <body>
        <div class=\"page\">
            {cards_html}
        </div>
    </body>
    </html>
    """

def main():
    qr_images = collect_qr_images()
    if not qr_images:
        raise SystemExit("No QR images found in qr_codes/.")
    html = build_html(qr_images)
    OUTPUT_HTML.write_text(html, encoding="utf-8")
    print(f"Wrote {OUTPUT_HTML}")

if __name__ == "__main__":
    main()



