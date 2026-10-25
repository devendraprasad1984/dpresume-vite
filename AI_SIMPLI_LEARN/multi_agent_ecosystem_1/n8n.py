def ms_to_iso(ms):
    secs, milli = divmod(int(ms), 1000)
    days, rem = divmod(secs, 86400)
    h, rem = divmod(rem, 3600)
    mi, s = divmod(rem, 60)
    z = days + 719468
    era = z // 146097
    doe = z - era * 146097
    yoe = (doe - doe // 1460 + doe // 36524 - doe // 146096) // 365
    y = yoe + era * 400
    doy = doe - (365 * yoe + yoe // 4 - yoe // 100)
    mp = (5 * doy + 2) // 153
    d = doy - (153 * mp + 2) // 5 + 1
    mo = mp + 3 if mp < 10 else mp - 9
    if mo <= 2:
        y += 1
    return f"{y:04d}-{mo:02d}-{d:02d}T{h:02d}:{mi:02d}:{s:02d}.{milli:03d}Z"

output = []

for item in _items:
    r = item["json"] or {}
    print(r)
    headers = r.get("headers") or {}
    sender  = r.get("from") or r.get("sender") or headers.get("from") or r.get("From") or ""
    subject = r.get("Subject") or headers.get("subject") or ""
    body    = r.get("text") or r.get("textPlain") or r.get("textHtml") or r.get("snippet") or ""

    text = f"{subject} {body}".lower()
    priority = "Low"
    if any(k in text for k in ("urgent", "critical", "immediately", "down")):
        priority = "High"
    elif any(k in text for k in ("issue", "problem", "error", "delay")):
        priority = "Medium"

    ts = r.get("internalDate")
    output.append({"json": {
        "timestamp": ms_to_iso(ts) if ts else r.get("date", ""),
        "sender": sender,
        "subject": subject,
        "body": body,
        "priority": priority,
    }})

return output