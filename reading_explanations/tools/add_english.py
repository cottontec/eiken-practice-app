"""作成済みの解説に、英語の再掲を機械的に加える。
- 大問1：【和訳】の先頭に（英文）正解を［ ］に入れた問題文を加える（抽出テキストがある回のみ）。
- 大問1：（選択肢の意味）の各行を「番号 英語：意味」にする。
- 大問3：＜この設問と選択肢の訳＞の各選択肢行を「番号 英語（訳）」にする。
使い方: python3 -I add_english.py <ZIP展開先の親> [--apply]"""
from pathlib import Path
import json, re, sys
HERE = Path(__file__).resolve().parent.parent
root = Path(sys.argv[1]); apply = '--apply' in sys.argv

def parse(path):
    raw = path.read_text('utf-8'); end = raw.find('\n---\n', 4)
    head = raw[:end + 5]; body = raw[end + 5:]
    meta = dict(l.split(':', 1) for l in raw[4:end].split('\n') if ':' in l)
    return head, body, {k.strip(): v.strip() for k, v in meta.items()}

def english(text, ans):
    lines = [l.rstrip() for l in text.replace('\r', '').split('\n')]
    out = []
    for l in lines:
        s = l.strip()
        if not s or re.fullmatch(r'\(\d+\)', s):
            continue
        s = re.sub(r'^\(\d+\)\s*', '', s)
        if re.match(r'^1\s', s):
            break
        s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
        if re.match(r'^[AB]\s*:', s):
            out.append(re.sub(r'^([AB])\s*:\s*', r'\1: ', s))
        elif out:
            out[-1] = out[-1][:-1] + s if out[-1].endswith('-') else out[-1] + ' ' + s
        else:
            out.append(s)
    eng = '\n'.join(out)
    if len(re.findall(r'\(\s*\)', eng)) != 1:
        return None
    return re.sub(r'\(\s*\)', '［' + ans + '］', eng)

stats = {'sent': 0, 'sent_skip': 0, 'choice': 0, 'q3choice': 0, 'files': 0}
for f in sorted(root.glob('*/batches/*.source.json')):
    d = json.loads(f.read_text('utf-8-sig'))
    w = HERE / 'work' / d['batchId']
    for u in d['units']:
        utext = u.get('text', '') if (u.get('textVerified') is not False and '画像のみ' not in u.get('text', '')) else ''
        for q in u['questions']:
            p = w / f"{q['id']}.txt"
            if not p.exists():
                continue
            head, body, meta = parse(p)
            if meta.get('status') == 'issue' or not body.startswith('【正解】'):
                continue
            ch = [c.strip() for c in meta.get('choices', '').split(' | ')]
            nb = body
            if u['section'] == 1:
                if '（英文）' not in nb and utext:
                    eng = english(utext, meta.get('answerText', ''))
                    if eng:
                        nb = nb.replace('【和訳】\n', '【和訳】\n（英文）\n' + eng + '\n（訳）\n', 1); stats['sent'] += 1
                    else:
                        stats['sent_skip'] += 1
                m = re.search(r'（選択肢の意味）\n((?:\d .*\n)+)', nb)
                if m:
                    new = []
                    for l in m.group(1).splitlines():
                        n = int(l.split(' ', 1)[0]); rest = l.split(' ', 1)[1]
                        if 1 <= n <= len(ch) and ch[n - 1].lower() not in rest.lower():
                            l = f'{n} {ch[n - 1]}：{rest}'; stats['choice'] += 1
                        new.append(l)
                    nb = nb[:m.start(1)] + '\n'.join(new) + '\n' + nb[m.end(1):]
            if u['section'] == 3:
                m = re.search(r'＜この設問と選択肢の訳＞\n設問：.*\n((?:\d .*\n)+)', nb)
                if m:
                    new = []
                    for l in m.group(1).splitlines():
                        n = int(l.split(' ', 1)[0]); rest = l.split(' ', 1)[1]
                        if 1 <= n <= len(ch) and ch[n - 1][:12].lower() not in rest.lower():
                            l = f'{n} {ch[n - 1]}（{rest}）'; stats['q3choice'] += 1
                        new.append(l)
                    nb = nb[:m.start(1)] + '\n'.join(new) + '\n' + nb[m.end(1):]
            if nb != body:
                stats['files'] += 1
                if apply:
                    p.write_text(head + nb, 'utf-8')
print(stats, 'APPLIED' if apply else 'DRY-RUN')
