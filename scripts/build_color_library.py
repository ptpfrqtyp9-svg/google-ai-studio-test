#!/usr/bin/env python3
"""Validates color_by_number_120_designs.json, refines the artwork and emits
public/swift/Sources/ColorByNumberLibrary.swift.

Refinement rules (all deterministic):
  * Every design is validated (12x12 bounds, known palette keys, overlaps).
  * Designs with broken artwork are replaced by hand-authored left halves that
    are mirrored, so they are symmetrical by construction.
  * All other designs are shifted to the best horizontal alignment, mirrored
    (union) so they are symmetrical, and vertically centered.
  * Single-color designs get coherent colors plus details (face or rim).
"""
import json
import math
import pathlib
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "color_by_number_120_designs.json"
OUT = ROOT.parent / "public/swift/Sources/ColorByNumberLibrary.swift"
N = 12
MAX_COLORS = 6

data = json.loads(SRC.read_text())
PALETTE = data["palette_reference"]


def mirror_rows(half_rows):
    assert len(half_rows) == N, len(half_rows)
    cells = {}
    for y, row in enumerate(half_rows, start=1):
        assert len(row) == 6, (row, len(row))
        for x, ch in enumerate(row, start=1):
            if ch != ".":
                cells[(x, y)] = ch
                cells[(13 - x, y)] = ch
    return cells


def rainbow():
    cells = {}
    bands = [(4.5, 5.7, "R"), (3.5, 4.5, "O"), (2.5, 3.5, "Y"), (1.5, 2.5, "B")]
    for y in range(1, N + 1):
        for x in range(1, N + 1):
            d = math.hypot(x - 6.5, y - 10.5)
            if y <= 10:
                for lo, hi, color in bands:
                    if lo <= d < hi:
                        cells[(x, y)] = color
    return cells


H = {  # hand-authored left halves (cols 1-6), mirrored to the right
    "Sun": [".....O", ".O...O", "..O...", "...YYY", "..YYYY", "O.YYYY", "O.YYYY", "..YYYY", "...YYY", "..O...", ".O...O", ".....O"],
    "Moon": ["......", "...YYY", "..YYYY", ".YYYYY", ".YTTYY", "YYTTYY", "YYYYYT", "YYYYYY", ".YTYYY", ".YYYYY", "..YYYY", "...YYY"],
    "Cloud": ["......", "....BB", "..BBBB", ".BBBBB", "BBBBBB", "BBBBKB", "BBCBBB", "BBBBBK", ".BBBBB", "......", "......", "......"],
    "Rain Cloud": ["....KK", "..KKKK", ".KKKKK", "KKKKKK", "KKKKKK", ".KKKKK", "......", ".B..B.", "......", "..B..B", "......", "......"],
    "Lightning Cloud": ["....KK", "..KKKK", ".KKKKK", "KKKKKK", "KKKKKK", ".KKKKK", "....YY", ".....Y", "....YY", ".....Y", "......", "......"],
    "Star": [".....Y", "....YY", "....YY", "YYYYYY", ".YYYYY", "..YYOO", "..YYOO", ".YYYYY", ".YYYYY", ".YYY..", "YYY...", "......"],
    "Shooting Star": [".....B", ".....B", "....BB", "....BB", "...BBB", ".....Y", "....YY", ".YYYYY", "..YYYY", "..YYY.", ".YY...", "......"],
    "Comet": [".....R", "....RR", "....RY", "...RYY", "...RYY", "....OO", "..OOOO", "..OOOO", "..OOOO", "....OO", "......", "......"],
    "Mountain": ["......", ".....B", "....BB", "...BBB", "..BNBN", ".NNNNN", "NNNNNN", "GGGGGG", "GGGGGG", "......", "......", "......"],
    "Volcano": [".....K", "....KK", "....RR", "...RRR", "..NRRR", "..NNNN", ".NNNNN", ".NNNNN", "NNNNNN", "NNNNNN", "GGGGGG", "......"],
    "Treasure Chest": ["......", ".OOOOO", "OKOOOO", "OKOOOY", "KKKKKY", "NKNNNY", "NKNNNN", "NKNNNN", "NKNNNN", "......", "......", "......"],
    "Caterpillar": ["......", "...LLL", "..LLLL", "..LLKL", "..LLLL", "..GGGG", "..GGGG", "...LLL", "..LLLL", "..GGGG", "..GGGG", "......"],
    "Dragonfly": [".....K", ".....G", ".BBBBG", "BBBBBG", ".BBBBG", ".....G", "..BBBG", ".BBBBG", ".....G", ".....G", ".....G", "......"],
    "Ant": ["..N...", "...N..", "....NN", "...KNN", ".N.NNN", "N..NNN", ".N.NNN", "..NNNN", ".NNNNN", ".NNNNN", "..NNNN", "......"],
}


def snowflake():
    cells = {}
    for t in range(1, 6):
        for xy in [(t, t), (t, 13 - t)]:
            cells[xy] = "B"
            cells[(13 - xy[0], xy[1])] = "B"
    for y in range(1, N + 1):
        cells[(6, y)] = "B"
        cells[(7, y)] = "B"
    for x in range(1, N + 1):
        cells[(x, 6)] = "B"
        cells[(x, 7)] = "B"
    for xy in [(6, 6), (7, 6), (6, 7), (7, 7)]:
        cells[xy] = "P"
    return cells


OVERRIDES = {name: mirror_rows(rows) for name, rows in H.items()}
OVERRIDES["Rainbow"] = rainbow()
OVERRIDES["Snowflake"] = snowflake()

# (base color, rim color) for non-animal single-color designs
RIM = {
    "Watermelon Slice": ("R", "G"), "Cupcake": ("C", "P"), "Ice Cream Cone": ("C", "N"),
    "Donut": ("N", "C"), "Cookie": ("T", "N"), "Tree": ("G", "L"), "Pine Tree": ("G", "L"),
    "Four Leaf Clover": ("G", "L"), "Earth": ("B", "G"), "Heart": ("R", "C"),
    "Rainbow Heart": ("P", "C"), "Smiley Face": ("Y", "O"), "Sunflower Face": ("Y", "O"),
}
FACE_ON_RIM = {"Smiley Face", "Sunflower Face"}
ANIMAL_BASE = {
    "Cat": "O", "Kitten": "C", "Dog": "N", "Puppy": "O", "Fox": "O", "Bunny": "C", "Bear": "N",
    "Panda": "K", "Koala": "K", "Lion": "Y", "Tiger": "O", "Monkey": "N", "Pig": "C", "Frog": "G",
    "Duck": "Y", "Chick": "Y", "Chicken": "O", "Cow": "N", "Sheep": "T", "Horse": "N",
    "Unicorn": "P", "Dinosaur": "G", "Dragon": "R", "Whale": "B", "Dolphin": "B", "Octopus": "P",
    "Fish": "O", "Clownfish": "O", "Crab": "R", "Lobster": "R", "Seal": "K", "Otter": "N",
    "Hedgehog": "N", "Squirrel": "O", "Raccoon": "K", "Deer": "N", "Giraffe": "Y", "Elephant": "K",
    "Hippo": "P", "Zebra": "K", "Parrot": "G", "Flamingo": "C", "Peacock": "B", "Swan": "T",
    "Rooster": "R", "Llama": "T", "Sloth": "N",
}


def load_cells(design, report):
    cells = {}
    for key, coords in design["coordinates_by_color"].items():
        if key not in design["palette"]:
            report["unknown_color"].append(design["name"])
            continue
        for x, y in coords:
            if not (1 <= x <= N and 1 <= y <= N):
                report["out_of_bounds"].append(design["name"])
                continue
            if (x, y) in cells:
                report["overlap"].append(design["name"])
                continue
            cells[(x, y)] = key
    return cells


def symmetry_errors(cells):
    return sum(1 for (x, y), c in cells.items() if cells.get((13 - x, y)) != c)


def shift(cells, dx, dy):
    return {(x + dx, y + dy): c for (x, y), c in cells.items()}


def in_bounds(cells):
    return all(1 <= x <= N and 1 <= y <= N for x, y in cells)


def center_and_mirror(cells):
    best = None
    for dx in range(-4, 5):
        moved = shift(cells, dx, 0)
        if not in_bounds(moved):
            continue
        key = (symmetry_errors(moved), abs(dx))
        if best is None or key < best[0]:
            best = (key, moved)
    cells = best[1]
    mirrored = {}
    for (x, y), c in sorted(cells.items(), key=lambda item: item[0][0] > 6):
        left_x = x if x <= 6 else 13 - x
        mirrored.setdefault((left_x, y), c)
    return {**mirrored, **{(13 - x, y): c for (x, y), c in mirrored.items()}}


def vertical_center(cells):
    top = min(y for _, y in cells)
    bottom = max(y for _, y in cells)
    return shift(cells, 0, (13 - (top + bottom)) // 2)


def recolor_base(cells, base):
    return {xy: base for xy in cells}


def add_face(cells, base):
    ys = [y for _, y in cells]
    top, bottom = min(ys), max(ys)
    height = bottom - top + 1
    for x in (5, 4, 3):
        for y in range(top + int(height * 0.25), top + int(height * 0.6) + 1):
            need = [(x, y), (13 - x, y), (6, y + 1), (7, y + 1), (6, y + 2), (7, y + 2)]
            if all(cells.get(p) == base for p in need):
                eye = "T" if base == "K" else "K"
                belly = "W" if base == "T" else "T"
                for p in [(x, y), (13 - x, y), (6, y + 1), (7, y + 1)]:
                    cells[p] = eye
                for yy in range(y + 2, y + 5):
                    for xx in range(5, 9):
                        if cells.get((xx, yy)) == base:
                            cells[(xx, yy)] = belly
                return True
    return False


def add_rim(cells, base, rim):
    out = dict(cells)
    for (x, y) in cells:
        if any((x + dx, y + dy) not in cells for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            out[(x, y)] = rim
    return out


def build():
    report = {"unknown_color": [], "out_of_bounds": [], "overlap": [], "hand_fixed": [],
              "recolored": [], "auto_detail": [], "face_failed": []}
    designs = []
    for index, design in enumerate(data["designs"]):
        name = design["name"]
        if name in OVERRIDES:
            cells = dict(OVERRIDES[name])
            report["hand_fixed"].append(name)
        else:
            cells = load_cells(design, report)
            cells = center_and_mirror(cells)
        cells = vertical_center(cells)

        if name in ANIMAL_BASE:
            cells = recolor_base(cells, ANIMAL_BASE[name])
            if not add_face(cells, ANIMAL_BASE[name]):
                report["face_failed"].append(name)
            report["recolored"].append(name)
            report["auto_detail"].append(name)
        elif name in RIM:
            base, rim = RIM[name]
            cells = recolor_base(cells, base)
            cells = add_rim(cells, base, rim)
            if name in FACE_ON_RIM and not add_face(cells, base):
                report["face_failed"].append(name)
            report["recolored"].append(name)
            report["auto_detail"].append(name)

        assert in_bounds(cells), name
        assert symmetry_errors(cells) == 0, (name, symmetry_errors(cells))
        counts = Counter(cells.values())
        assert 1 <= len(counts) <= MAX_COLORS, (name, counts)
        order = sorted(counts, key=lambda k: (-counts[k], k))
        digit = {color: str(i + 1) for i, color in enumerate(order)}
        rows = ["".join(digit[cells[(x, y)]] if (x, y) in cells else "." for x in range(1, N + 1)) for y in range(1, N + 1)]
        designs.append({
            "id": index,
            "name": name,
            "category": design["category"],
            "palette": [PALETTE[c] for c in order],
            "rows": rows,
            "cells": len(cells),
            "colors": len(order),
        })
    return designs, report


def swift_literal(designs):
    lines = [
        "import Foundation",
        "",
        "// Generated by scripts/build_color_library.py from color_by_number_120_designs.json.",
        "// Every board is 12 x 12. A digit is a 1-based palette number and \".\" is an empty cell.",
        "// Every design is symmetrical left to right.",
        "",
        "struct ColorByNumberDesign: Identifiable, Hashable {",
        "    let id: Int",
        "    let name: String",
        "    let category: String",
        "    let palette: [UInt32]",
        "    let rows: [String]",
        "",
        "    static let size = 12",
        "",
        "    var isValid: Bool {",
        "        guard rows.count == Self.size, !palette.isEmpty else { return false }",
        "        for row in rows {",
        "            guard row.count == Self.size else { return false }",
        "            for ch in row {",
        "                if ch == \".\" { continue }",
        "                guard let n = ch.wholeNumberValue, n >= 1, n <= palette.count else { return false }",
        "            }",
        "        }",
        "        return true",
        "    }",
        "",
        "    // Row-major values, nil for empty cells.",
        "    var cells: [Int?] {",
        "        rows.flatMap { row in row.map { $0.wholeNumberValue } }",
        "    }",
        "",
        "    var numberedCellCount: Int { cells.compactMap { $0 }.count }",
        "}",
        "",
        "enum ColorByNumberLibrary {",
        "    static let categoryOrder: [String] = [" + ", ".join(json.dumps(c) for c in dict.fromkeys(d["category"] for d in designs)) + "]",
        "",
        "    static let all: [ColorByNumberDesign] = {",
        "        let valid = rawDesigns.filter { $0.isValid }",
        "        assert(valid.count == rawDesigns.count, \"Some color by number designs failed validation\")",
        "        return valid",
        "    }()",
        "",
        "    static func designs(in category: String) -> [ColorByNumberDesign] {",
        "        all.filter { $0.category == category }",
        "    }",
        "",
    ]
    # Split into chunks so the Swift type checker stays fast.
    chunks = [designs[i:i + 20] for i in range(0, len(designs), 20)]
    for ci, chunk in enumerate(chunks):
        lines.append(f"    private static let chunk{ci}: [ColorByNumberDesign] = [")
        for d in chunk:
            pal = ", ".join(f"0x{h[1:]}" for h in d["palette"])
            rows = ", ".join(json.dumps(r) for r in d["rows"])
            lines.append(f"        ColorByNumberDesign(id: {d['id']}, name: {json.dumps(d['name'])}, category: {json.dumps(d['category'])}, palette: [{pal}], rows: [{rows}]),")
        lines.append("    ]")
        lines.append("")
    joined = " + ".join(f"chunk{i}" for i in range(len(chunks)))
    lines.append("    private static let rawDesigns: [ColorByNumberDesign] = " + joined)
    lines.append("}")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    designs, report = build()
    assert len(designs) == 120 == data["design_count"]
    assert len({d["name"] for d in designs}) == 120
    OUT.write_text(swift_literal(designs))
    print("designs written:", len(designs))
    print("categories:", dict(Counter(d["category"] for d in designs)))
    print("colors per design:", dict(Counter(d["colors"] for d in designs)))
    print("min/max cells:", min(d["cells"] for d in designs), max(d["cells"] for d in designs))
    for key, value in report.items():
        print(key, len(value), value if len(value) < 30 else "")
    thin = [d["name"] for d in designs if d["cells"] < 20]
    print("still under 20 cells:", thin)
    json.dump(designs, open(ROOT / "color_library_preview.json", "w"))
