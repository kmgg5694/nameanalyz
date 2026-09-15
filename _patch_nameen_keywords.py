# -*- coding: utf-8 -*-
"""Replace phonetic nameEn with short English keywords for 81 Su-ri and 64 hexagrams."""
import re
from pathlib import Path

PATH = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")

# 81 Su-ri: phonetic -> short keyword (from 보흘님 reference + traditional meaning fill)
SURI = {
    "Chulbal Gwonwi": "New Beginning",
    "Bunri Pagoe": "Hardship",
    "Jidojeok Inmul": "Prosperity",
    "Jesa Bulseong": "Trial",
    "Bugwi Bongnok": "Fortune",
    "Gyeseung Baljeon": "Stability",
    "Maengho Chullim": "Independence",
    "Subok Gyeomjeon": "Perseverance",
    "Daejae Muyong": "Wasted Talent",
    "Mansa Heomang": "Emptiness",
    "Jungin Sinmang": "Renewal",
    "Bagyak Bakbok": "Isolation",
    "Chongmyeong Jimo": "Wisdom",
    "Isan Pamyeol": "Collapse",
    "Gungye Ilhak": "Leadership",
    "Deokmang Yubok": "Harmony",
    "Myeongmang Sahae": "Breakthrough",
    "Bugwi Yeongdal": "Success",
    "Godok Bicham": "Loneliness",
    "Baeksa Silpae": "Failure",
    "Duryeong Jimo": "Mastery",
    "Jungdo Jwajeol": "Setback",
    "Ilheung Jungcheon": "Prestige",
    "Bugwi Yeonghwa": "Self-Made",
    "Jimo Sunjo": "Intellect",
    "Yeongung Pungpa": "Turbulence",
    "Daein Gyeok": "Grandeur",
    "Paran Pungpa": "Chaos",
    "Gwollyeok Jaemul": "Adventure",
    "Gilhyong Sangban": "Mixed Fate",
    "Jasu Seongga": "Flourishing",
    "Uioe Deukjae": "Good Fortune",
    "Gwonwi Chungcheon": "Power & Glory",
    "Jaehwa Yeonsok": "Continuity",
    "Onyu Hwasun": "Peaceful Flow",
    "Yeonggeol Sibi": "Obstruction",
    "Gwonwi Indeok": "Authority",
    "Munye Giye": "Artistry",
    "Wise Gangjung": "Glory",
    "Byeonhwa Gongheo": "Emptiness",
    "Seongyeon Gomyeong": "Nobility",
    "Paran Jacho": "Ruin",
    "Paega Mangsin": "Defeat",
    "Baekjeon Baekpae": "Defeat",
    "Tongdal Sahae": "Resurgence",
    "Gongung Singo": "Abundance",
    "Ilhwak Cheongeum": "Pioneering",
    "Baehu Jojeong": "Intrigue",
    "Seonga Euntoe": "Decline",
    "Gongheo Silui": "Hollow Gain",
    "Paran Byeondong": "Upheaval",
    "Biryong Seungcheon": "Foresight",
    "Oehwa Naebin": "Contentment",
    "Jeolmang Bulgu": "Hopelessness",
    "Geukseong Geuksoe": "Extremes",
    "Byeonjeon Musang": "Diligent Success",
    "Gojin Gamrae": "Smooth Sailing",
    "Myeongseong Bugwi": "Late Bloom",
    "Uiji Bagyak": "Weak Will",
    "Bongnok Jasil": "Lost Fortune",
    "Yeongdal Gyeok": "Honor & Wealth",
    "Soemyeol Gyeok": "Decline",
    "Gilsang Gyeok": "Prosperity",
    "Gohaeng Gyeok": "Hard Path",
    "Yudeok Gyeok": "Longevity & Wealth",
    "Soemang Gyeok": "Withering",
    "Hyeongtong Gyeok": "Wise Growth",
    "Gongmang Gyeok": "Void",
    "Jaenan Gyeok": "Disaster",
    "Jeokmak Gyeok": "Isolation",
    "Baljeon Gyeok": "Endurance",
    "Pyeongsang Gyeok": "Ordinary",
    "Noryeok Gyeok": "Effort",
    "Buru Gyeok": "Wealth",
    "Subun Gyeok": "Serenity",
    "Seongon Gyeok": "Late Joy",
    "Huibi Gyeok": "Joy",
    "Mango Gyeok": "Hardship",
    "Gunggeuk Gyeok": "Exhaustion",
    "Eundun Gyeok": "Retreat",
    "Cheonji Gaebyeok": "Ultimate Peak",
}

# 64 Hexagrams: phonetic spaced romanization -> short keyword
HEX = {
    "Geon Wi Cheon": "Creative",
    "Gon Wi Ji": "Receptive",
    "Su Roe Dun": "Beginnings",
    "San Su Mong": "Folly",
    "Su Cheon Su": "Waiting",
    "Cheon Su Song": "Conflict",
    "Ji Su Sa": "Army",
    "Su Ji Bi": "Union",
    "Pung Cheon So Chuk": "Small Restraint",
    "Cheon Taek Ri": "Treading",
    "Ji Cheon Tae": "Peace",
    "Cheon Ji Bi": "Standstill",
    "Cheon Hwa Dong In": "Fellowship",
    "Hwa Cheon Dae Yu": "Great Possession",
    "Ji San Gyeom": "Modesty",
    "Noe Ji Ye": "Enthusiasm",
    "Taek Roe Su": "Following",
    "San Pung Go": "Repair",
    "Ji Taek Rim": "Approach",
    "Pung Ji Gwan": "Contemplation",
    "Hwa Roe Seo Hap": "Biting Through",
    "San Hwa Bi": "Grace",
    "San Ji Bak": "Splitting",
    "Ji Roe Bok": "Return",
    "Cheon Roe Mu Mang": "Innocence",
    "San Cheon Dae Chuk": "Great Restraint",
    "San Roe I": "Nourishment",
    "Taek Pung Dae Gwa": "Excess",
    "Gam Wi Su": "Abyss",
    "I Wi Hwa": "Clarity",
    "Taek San Ham": "Influence",
    "Noe Pung Hang": "Duration",
    "Cheon San Dun": "Retreat",
    "Noe Cheon Dae Jang": "Great Power",
    "Hwa Ji Jin": "Progress",
    "Ji Hwa Myeong I": "Darkening",
    "Pung Hwa Ga In": "Family",
    "Hwa Taek Gyu": "Opposition",
    "Su San Geon": "Obstruction",
    "Noe Su Hae": "Deliverance",
    "San Taek Son": "Decrease",
    "Pung Roe Ik": "Increase",
    "Taek Cheon Kwae": "Breakthrough",
    "Cheon Pung Gu": "Encounter",
    "Taek Ji Chwe": "Gathering",
    "Ji Pung Seung": "Ascent",
    "Taek Su Gon": "Oppression",
    "Su Pung Jeong": "Well",
    "Taek Hwa Hyeok": "Revolution",
    "Hwa Pung Jeong": "Cauldron",
    "Jin Wi Roe": "Arousing",
    "Gan Wi San": "Stillness",
    "Pung San Jeom": "Development",
    "Noe Taek Gwi Mae": "Maiden",
    "Noe Hwa Pung": "Abundance",
    "Hwa San Ryeo": "Wanderer",
    "Son Wi Pung": "Gentle",
    "Tae Wi Taek": "Joyous",
    "Pung Su Hwan": "Dispersion",
    "Su Taek Jeol": "Limitation",
    "Pung Taek Jung Bu": "Inner Truth",
    "Noe San So Gwa": "Small Excess",
    "Su Hwa Gi Je": "Completion",
    "Hwa Su Mi Je": "Incomplete",
}


def main():
    t = PATH.read_text(encoding="utf-8")
    report = []
    suri_n = hex_n = 0

    # Replace only nameEn:"..." exact matches from our maps (longest first to avoid partial)
    # Process hex first (longer multi-word), then suri
    for old, new in sorted(HEX.items(), key=lambda x: -len(x[0])):
        pat = f'nameEn:"{old}"'
        if pat in t:
            t = t.replace(pat, f'nameEn:"{new}"')
            hex_n += 1
            report.append(f"HEX\t{old}\t→\t{new}\n")
        else:
            report.append(f"HEX_MISS\t{old}\n")

    for old, new in sorted(SURI.items(), key=lambda x: -len(x[0])):
        pat = f'nameEn:"{old}"'
        cnt = t.count(pat)
        if cnt:
            t = t.replace(pat, f'nameEn:"{new}"')
            suri_n += cnt
            report.append(f"SURI\t{old}\t→\t{new}\t(x{cnt})\n")
        else:
            report.append(f"SURI_MISS\t{old}\n")

    # Verify leftover phonetics
    leftover = []
    for m in re.finditer(r'nameEn:"([^"]+)"', t):
        n = m.group(1)
        # heuristic: still looks romanized korean if has 2+ Capitalized syllables and not in our new set
        if re.match(r"^[A-Z][a-z]+(?: [A-Z][a-z]+)+$", n) and n not in (
            "New Beginning",
            "Power & Glory",
            "Peaceful Flow",
            "Good Fortune",
            "Diligent Success",
            "Smooth Sailing",
            "Late Bloom",
            "Weak Will",
            "Lost Fortune",
            "Honor & Wealth",
            "Hard Path",
            "Longevity & Wealth",
            "Wise Growth",
            "Late Joy",
            "Ultimate Peak",
            "Wasted Talent",
            "Mixed Fate",
            "Hollow Gain",
            "Small Restraint",
            "Biting Through",
            "Great Possession",
            "Great Restraint",
            "Great Power",
            "Inner Truth",
            "Small Excess",
        ):
            leftover.append(n)

    PATH.write_text(t, encoding="utf-8")
    rep_path = Path(r"C:\Users\a8071\Projects\nameanalyz\_nameen_replace_report.txt")
    rep_path.write_text(
        f"suri_replacements={suri_n}\nhex_replacements={hex_n}\nleftover_spaced={leftover}\n\n"
        + "".join(report),
        encoding="utf-8",
    )
    print("suri", suri_n, "hex", hex_n, "leftover", leftover)
    print("report", rep_path)


if __name__ == "__main__":
    main()
