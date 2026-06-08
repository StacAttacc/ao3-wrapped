import re

import requests
from bs4 import BeautifulSoup

AO3_WORK_URL = "https://archiveofourown.org/works/{}"
WORK_ID_RE = re.compile(r"/works/(\d+)")

HEADERS = {
    "User-Agent": "ao3-wrapped/1.0 (personal project; non-commercial)",
}


class ScraperError(Exception):
    pass


def extract_ao3_id(url: str) -> str:
    match = WORK_ID_RE.search(url)
    if not match:
        raise ScraperError("Not a valid AO3 work URL")
    return match.group(1)


def _tag_list(meta_dl, dd_class: str) -> list[str]:
    dd = meta_dl.find("dd", class_=dd_class)
    if not dd:
        return []
    return [a.get_text(strip=True) for a in dd.find_all("a", class_="tag")]


def _stat(meta_dl, dd_class: str) -> str | None:
    dd = meta_dl.find("dd", class_=dd_class)
    if not dd:
        return None
    return dd.get_text(strip=True) or None


def _parse_int(value: str | None) -> int | None:
    if not value:
        return None
    cleaned = value.replace(",", "").strip()
    try:
        return int(cleaned)
    except ValueError:
        return None


def scrape_fic(url: str) -> dict:
    ao3_id = extract_ao3_id(url)
    canonical_url = AO3_WORK_URL.format(ao3_id)

    try:
        response = requests.get(canonical_url, headers=HEADERS, timeout=15)
    except requests.RequestException as e:
        raise ScraperError(f"Request failed: {e}") from e

    if response.status_code == 403:
        raise ScraperError("Work is restricted to logged-in users")
    if response.status_code == 404:
        raise ScraperError("Work not found")
    if not response.ok:
        raise ScraperError(f"AO3 returned HTTP {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")

    title_el = soup.find("h2", class_="title heading")
    if not title_el:
        raise ScraperError("Could not parse work page — structure may have changed")
    title = title_el.get_text(strip=True)

    byline = soup.find("h3", class_="byline heading")
    authors = [a.get_text(strip=True) for a in byline.find_all("a")] if byline else []

    summary_div = soup.find("div", class_="summary module")
    summary = ""
    if summary_div:
        bq = summary_div.find("blockquote", class_="userstuff")
        if bq:
            summary = bq.get_text(strip=True)

    meta_dl = soup.find("dl", class_="work meta group")
    if not meta_dl:
        raise ScraperError("Could not find metadata block")

    rating = next(iter(_tag_list(meta_dl, "rating tags")), "")
    warnings = _tag_list(meta_dl, "warning tags")
    fandoms = _tag_list(meta_dl, "fandom tags")
    categories = _tag_list(meta_dl, "category tags")
    characters = _tag_list(meta_dl, "character tags")
    relationships = _tag_list(meta_dl, "relationship tags")
    additional_tags = _tag_list(meta_dl, "freeform tags")

    language = _stat(meta_dl, "language") or ""
    date_published = _stat(meta_dl, "published")
    date_updated = _stat(meta_dl, "updated")

    status_text = _stat(meta_dl, "status")
    is_complete = status_text == "Completed" if status_text else None

    word_count = _parse_int(_stat(meta_dl, "words"))
    kudos = _parse_int(_stat(meta_dl, "kudos"))
    hits = _parse_int(_stat(meta_dl, "hits"))
    bookmarks = _parse_int(_stat(meta_dl, "bookmarks"))
    comments = _parse_int(_stat(meta_dl, "comments"))

    total_chapters = None
    chapters_text = _stat(meta_dl, "chapters")
    if chapters_text and "/" in chapters_text:
        total_raw = chapters_text.split("/")[1].strip()
        if total_raw != "?":
            total_chapters = _parse_int(total_raw)

    return {
        "ao3_id": ao3_id,
        "url": canonical_url,
        "title": title,
        "authors": authors,
        "fandoms": fandoms,
        "rating": rating,
        "warnings": warnings,
        "categories": categories,
        "characters": characters,
        "relationships": relationships,
        "additional_tags": additional_tags,
        "summary": summary,
        "language": language,
        "word_count": word_count,
        "total_chapters": total_chapters,
        "is_complete": is_complete,
        "kudos": kudos,
        "hits": hits,
        "bookmarks": bookmarks,
        "comments": comments,
        "date_published": date_published or None,
        "date_updated": date_updated or None,
    }
