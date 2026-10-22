"""Reading解説：作業ファイルの統合と自動検算。

work/<batchId>/<questionId>.txt と work/<batchId>/<unitId>.passage.txt を読み、
parts/partNN/ に results・完成JSON・疑義一覧・progress・作成結果を出力する。
内容の正しさ（訳の正確さ・英語の自然さ）は保証しない。機械的に照合できる項目だけを検査する。

使い方:
  python3 -I build_and_check.py --src-root <ZIP展開先の親> --part 01 [--batch 2-2007-3]
"""
from pathlib import Path
import argparse, json, re, sys, unicodedata, collections, datetime

HERE = Path(__file__).resolve().parent.parent
PLACEHOLDER = '{{本文全訳}}'
HEAD_COMMON = ['【正解】', '【和訳】', '【考え方】', '【覚えるポイント】']
FORBIDDEN = [('```', 'コード囲み'), ('|---', 'Markdown表'), ('別の問題を見', '他問参照'),
             ('を参照してください', '他問参照'), ('上の問題を見', '他問参照'), ('前の問題を見', '他問参照')]


def load(p):
    return json.loads(Path(p).read_text('utf-8-sig'))


def norm(s):
    s = unicodedata.normalize('NFKC', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('—', '-').replace('–', '-')
    s = re.sub(r'-\s*\n\s*', '', s)  # 行末ハイフン
    return re.sub(r'\s+', ' ', s).strip().lower()


def parse_item(path):
    raw = path.read_text('utf-8-sig').replace('\r\n', '\n')
    meta, body = {}, raw
    if raw.startswith('---\n'):
        end = raw.find('\n---\n', 4)
        if end < 0:
            raise ValueError('ヘッダの閉じ --- がありません')
        for line in raw[4:end].split('\n'):
            if ':' in line:
                k, v = line.split(':', 1)
                meta[k.strip()] = v.strip()
        body = raw[end + 5:]
    return meta, body.strip('\n')


def section_block(body, head):
    i = body.find(head)
    if i < 0:
        return ''
    rest = body[i + len(head):]
    m = re.search(r'\n【[^】]+】', rest)
    return rest[:m.start()] if m else rest


def check_batch(src_root, part, batch_id):
    src = load(src_root / part / 'batches' / f'{batch_id}.source.json')
    wdir = HERE / 'work' / batch_id
    out, issues, errors, warns, stats = {}, [], [], [], collections.Counter()
    reasoning_seen = collections.defaultdict(list)
    orders = {}
    selfsolve = {}
    ssp = wdir / '_selfsolve.tsv'
    if ssp.exists():
        for line in ssp.read_text('utf-8-sig').splitlines():
            parts = line.strip().split('\t')
            if len(parts) >= 2 and parts[1].strip().isdigit():
                selfsolve[parts[0].strip()] = int(parts[1].strip())
    for u in src['units']:
        sec = u['section']
        utext = u.get('text', '') if (u.get('textVerified') is not False and len(u.get('text', '')) > 100) else ''
        ntext = norm(utext) if utext else ''
        passage = ''
        if sec in (2, 3):
            pp = wdir / f"{u['id']}.passage.txt"
            if pp.exists():
                passage = pp.read_text('utf-8-sig').replace('\r\n', '\n').strip()
        for q in u['questions']:
            qid, correct, nch = q['id'], q['correct'], q['choices']
            stats['target'] += 1
            out[qid] = ''
            f = wdir / f'{qid}.txt'
            if not f.exists():
                stats['missing'] += 1
                continue
            try:
                meta, body = parse_item(f)
            except ValueError as e:
                errors.append((qid, str(e)))
                continue
            if meta.get('status') == 'issue':
                issues.append({'questionId': qid, 'reason': meta.get('issueReason', ''),
                               'imageKeys': [im['key'] for im in u.get('images', [])], 'status': '要確認'})
                stats['issue'] += 1
                continue
            e = []
            # 正解番号
            m = re.match(r'【正解】\s*(\d)', body)
            if not m:
                e.append('本文が【正解】番号で始まっていない')
            elif int(m.group(1)) != correct:
                e.append(f'【正解】の番号{m.group(1)}が正式データ{correct}と不一致')
            if qid not in selfsolve:
                e.append('_selfsolve.tsv に自力解答がない')
            elif selfsolve[qid] != correct:
                stats['selfsolveMismatch'] += 1
                if not meta.get('selfSolveNote'):
                    e.append(f'自力解答{selfsolve[qid]}が正式データ{correct}と不一致なのに selfSolveNote がない')
            choices = [c.strip() for c in meta.get('choices', '').split(' | ')]
            if len(choices) != nch:
                e.append(f'choices数{len(choices)}が{nch}と不一致')
            ans = meta.get('answerText', '').strip()
            if len(choices) == nch and norm(choices[correct - 1]) != norm(ans):
                e.append('answerTextがchoices[正解]と不一致')
            first_line = body.split('\n', 1)[0]
            if ans and norm(ans) not in norm(first_line + section_block(body, '【正解】')):
                e.append('【正解】欄に正解選択肢の英語がない')
            heads = HEAD_COMMON + (['【完成文】'] if sec == 4 else ['【ほかの選択肢】'])
            for h in heads:
                if h not in body:
                    e.append(f'見出し{h}がない')
            if sec in (1, 2, 3):
                other = section_block(body, '【ほかの選択肢】')
                for n in range(1, nch + 1):
                    if n != correct and not re.search(rf'(^|\n)\s*{n}\s', other):
                        e.append(f'【ほかの選択肢】に選択肢{n}の行がない')
            if sec in (2, 3):
                if body.count(PLACEHOLDER) != 1:
                    e.append(f'{PLACEHOLDER}が1回でない')
                if not passage:
                    e.append('本文全訳ファイルがない')
                body = body.replace(PLACEHOLDER, passage)
            if sec == 4:
                try:
                    order = [int(x) for x in meta.get('order', '').split()]
                except ValueError:
                    order = []
                if sorted(order) != list(range(1, nch + 1)):
                    e.append('orderが1～5の並べ替えになっていない')
                else:
                    pos = int(qid.rsplit('-', 1)[1])
                    if order[pos - 1] != correct:
                        e.append(f'order上の{pos}番目={order[pos-1]}が正式データ{correct}と不一致')
                    base = qid.rsplit('-', 1)[0]
                    if base in orders and orders[base] != order:
                        e.append('同じ問題の2番目/4番目でorderが異なる')
                    orders[base] = order
            for pat, label in FORBIDDEN:
                if pat in body:
                    e.append(f'禁止形式：{label}（{pat}）')
            if re.search(r'</?[a-zA-Z][^>]*>', body):
                e.append('HTMLタグらしき記述')
            if len(body) > 12000:
                e.append(f'12000字超（{len(body)}字）')
            # 抽出テキストとの照合（テキストがある回のみ・警告）
            if ntext:
                for i, c in enumerate(choices, 1):
                    if c and norm(c) not in ntext:
                        warns.append((qid, f'選択肢{i}「{c}」が抽出テキストに見つからない（画像で要確認）'))
            reasoning = section_block(body, '【考え方】').strip()
            if reasoning:
                reasoning_seen[reasoning].append(qid)
            if e:
                errors.extend((qid, x) for x in e)
                stats['error'] += 1
                continue
            out[qid] = body
            stats['written'] += 1
            if meta.get('reviewed', '').lower() == 'yes':
                stats['reviewed'] += 1
    for r, ids in reasoning_seen.items():
        if len(ids) > 1:
            warns.append((','.join(ids), '【考え方】が完全に同一'))
    return out, issues, errors, warns, stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src-root', required=True)
    ap.add_argument('--part', required=True)
    ap.add_argument('--batch')
    a = ap.parse_args()
    src_root = Path(a.src_root)
    part = a.part
    pdir = HERE / 'parts' / f'part{part}'
    (pdir / 'results').mkdir(parents=True, exist_ok=True)
    batch_ids = [p.name[:-len('.source.json')] for p in sorted((src_root / part / 'batches').glob('*.source.json'))]
    if a.batch:
        batch_ids = [a.batch]
    prog_path = pdir / 'progress.json'
    prog = load(prog_path) if prog_path.exists() else load(src_root / part / 'progress.json')
    pb = {b['batchId']: b for b in prog['batches']}
    issue_path = pdir / 'Reading_疑義一覧.json'
    all_issues = {i['questionId']: i for i in (load(issue_path) if issue_path.exists() else [])}
    report = {}
    for bid in batch_ids:
        out, issues, errors, warns, st = check_batch(src_root, part, bid)
        (pdir / 'results' / f'{bid}.json').write_text(json.dumps(out, ensure_ascii=False, indent=2), 'utf-8')
        for k in [k for k, v in all_issues.items() if k in out]:
            del all_issues[k]
        for i in issues:
            all_issues[i['questionId']] = i
        b = pb[bid]
        b.update({'written': st['written'], 'blank': st['target'] - st['written'], 'contentReviewed': st['reviewed'],
                  'issues': st['issue'], 'checkErrors': len(errors), 'checkWarnings': len(warns)})
        b['status'] = ('complete_reviewed' if st['reviewed'] == st['target'] else
                       'complete_unreviewed' if st['written'] == st['target'] else
                       'not_started' if st['written'] == 0 and st['issue'] == 0 else 'in_progress')
        report[bid] = {'stats': dict(st), 'errors': errors, 'warnings': warns}
        print(f"{bid}: target={st['target']} written={st['written']} reviewed={st['reviewed']} issue={st['issue']} "
              f"missing={st['missing']} errors={len(errors)} warnings={len(warns)}")
        for q, m in errors:
            print('  ERROR', q, m)
        for q, m in warns:
            print('  WARN ', q, m)
    prog['updatedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    prog_path.write_text(json.dumps(prog, ensure_ascii=False, indent=2), 'utf-8')
    issue_path.write_text(json.dumps(sorted(all_issues.values(), key=lambda x: x['questionId']), ensure_ascii=False, indent=2), 'utf-8')
    # 完成JSON（全バッチ統合・未完成は空文字）
    merged = {}
    tmpl = load(src_root / part / 'Reading_解説返却用.json')
    for bid in [p.name[:-len('.source.json')] for p in sorted((src_root / part / 'batches').glob('*.source.json'))]:
        rp = pdir / 'results' / f'{bid}.json'
        if rp.exists():
            merged.update(load(rp))
    final = {k: merged.get(k, '') for k in tmpl}
    (pdir / f'Reading_解説完成_part{part}.json').write_text(json.dumps(final, ensure_ascii=False, indent=2), 'utf-8')
    logp = pdir / 'check_report.json'
    old = load(logp) if logp.exists() else {}
    old.update(report)
    logp.write_text(json.dumps(old, ensure_ascii=False, indent=2), 'utf-8')
    sys.exit(1 if any(r['errors'] for r in report.values()) else 0)


if __name__ == '__main__':
    main()
