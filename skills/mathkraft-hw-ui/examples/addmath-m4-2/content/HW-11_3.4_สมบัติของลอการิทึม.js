/* HW-11 · 3.4 สมบัติของลอการิทึม */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const r = String.raw;
  const PH = 'จำนวนเต็ม เศษส่วน หรือทศนิยม';
  const lg = (b, v) => Math.log(v) / Math.log(b);
  const near = (u, v, t) => Math.abs(u - v) <= (t || 1e-9) * Math.max(1, Math.abs(v));
  const LOG2 = 0.3010, LOG7 = 0.8451;
  const GIVEN = r`กำหนด \(\log 2\approx 0.3010\) และ \(\log 7\approx 0.8451\) (\(\log\) คือ \(\log_{10}\))`;

  /* ---------- ด่าน 1 : จับคู่สมบัติ ---------- */
  // แต่ละสมบัติ: left = ข้อความสมบัติทั่วไป, make(R) = ตัวอย่างตัวเลข + ตรวจเชิงตัวเลข
  const PROPS = [
    { id: 'one', left: 'ลอการิทึมของ 1 &nbsp;\\(\\log_{a}1=0\\)', make(R) { const b = R.pick([2, 3, 5, 7, 10]); return { tex: '\\log_{' + b + '}1=0', ok: () => near(lg(b, 1), 0) }; } },
    { id: 'base', left: 'ลอการิทึมของฐาน &nbsp;\\(\\log_{a}a=1\\)', make(R) { const b = R.pick([2, 3, 5, 6, 7]); return { tex: '\\log_{' + b + '}' + b + '=1', ok: () => near(lg(b, b), 1) }; } },
    { id: 'sum', left: 'ผลบวก &nbsp;\\(\\log_{a}M+\\log_{a}N=\\log_{a}MN\\)', make(R) { const b = R.int(2, 7), [M, N] = R.sample([2, 3, 5, 6, 7, 9], 2); return { tex: '\\log_{' + b + '}' + M + '+\\log_{' + b + '}' + N + '=\\log_{' + b + '}' + (M * N), ok: () => near(lg(b, M) + lg(b, N), lg(b, M * N)) }; } },
    { id: 'diff', left: 'ผลต่าง &nbsp;\\(\\log_{a}M-\\log_{a}N=\\log_{a}\\dfrac{M}{N}\\)', make(R) { const b = R.int(2, 7), N = R.pick([2, 3, 4, 5]), q = R.pick([3, 5, 6, 7]); return { tex: '\\log_{' + b + '}' + (N * q) + '-\\log_{' + b + '}' + N + '=\\log_{' + b + '}' + q, ok: () => near(lg(b, N * q) - lg(b, N), lg(b, q)) }; } },
    { id: 'pow', left: 'การยกกำลัง &nbsp;\\(\\log_{a}M^{n}=n\\log_{a}M\\)', make(R) { const b = R.int(2, 7), M = R.pick([2, 3, 5, 7]), n = R.int(2, 4); return { tex: '\\log_{' + b + '}' + M + '^{' + n + '}=' + n + '\\log_{' + b + '}' + M, ok: () => near(lg(b, Math.pow(M, n)), n * lg(b, M)) }; } },
    { id: 'chg', left: 'เปลี่ยนฐาน &nbsp;\\(\\log_{a}b=\\dfrac{\\log_{c}b}{\\log_{c}a}\\)', make(R) { const [a, c] = R.pick([[4, 2], [9, 3], [8, 2], [25, 5], [27, 3]]), x = R.pick([5, 7, 10, 11]); return { tex: '\\log_{' + a + '}' + x + '=\\dfrac{\\log_{' + c + '}' + x + '}{\\log_{' + c + '}' + a + '}', ok: () => near(lg(a, x), lg(c, x) / lg(c, a)) }; } },
  ];
  // ตัวอย่างที่ใช้สมบัติ "ผิด" (ตรวจเชิงตัวเลขว่าไม่เป็นจริง)
  function wrongEx(R) {
    for (let t = 0; t < 50; t++) { const w = wrongEx1(R); if (!w.ok()) return w; }
    throw new Error('no wrong example');
  }
  function wrongEx1(R) {
    const b = R.int(2, 7), [M, N] = R.sample([3, 5, 6, 7, 9], 2), n = R.int(2, 4);
    return R.pick([
      { tex: '\\log_{' + b + '}' + M + '+\\log_{' + b + '}' + N + '=\\log_{' + b + '}' + (M + N), ok: () => near(lg(b, M) + lg(b, N), lg(b, M + N)) },
      { tex: '\\log_{' + b + '}(' + (M + N) + ')=\\log_{' + b + '}' + M + '+\\log_{' + b + '}' + N, ok: () => near(lg(b, M + N), lg(b, M) + lg(b, N)) },
      { tex: '\\log_{' + b + '}' + (M * N) + '-\\log_{' + b + '}' + N + '=\\log_{' + b + '}' + (M * N - N), ok: () => near(lg(b, M * N) - lg(b, N), lg(b, M * N - N)) },
      { tex: '\\log_{' + b + '}' + M + '^{' + n + '}=(\\log_{' + b + '}' + M + ')^{' + n + '}', ok: () => near(lg(b, Math.pow(M, n)), Math.pow(lg(b, M), n)) },
      { tex: '\\log_{' + b + '}' + M + '\\cdot\\log_{' + b + '}' + N + '=\\log_{' + b + '}' + (M * N), ok: () => near(lg(b, M) * lg(b, N), lg(b, M * N)) },
    ]);
  }
  function qMatchProp(R) {
    const five = R.sample(PROPS, 5);
    const items = five.map((p, i) => Object.assign({ key: 'k' + i, left: p.left }, p.make(R)));
    const dis = wrongEx(R);
    const chips = items.map((t) => ({ html: '\\(' + t.tex + '\\)', key: t.key })).concat([{ html: '\\(' + dis.tex + '\\)', key: 'dx' }]);
    return Q.pairs({ q: 'จับคู่สมบัติของลอการิทึม (ซ้าย) กับตัวอย่างที่ใช้สมบัตินั้น · มีตัวอย่างที่ใช้สมบัติผิดอยู่ 1 ตัว (ไม่ต้องจับคู่)',
      left: items.map((t) => ({ html: t.left, key: t.key })), chips,
      hint: r`ดูรูปแบบ: ผลบวกของล็อกที่ฐานเดียวกัน → ล็อกของผลคูณ · ผลต่าง → ผลหาร · เลขยกกำลังในล็อก → ตัวคูณหน้าล็อก · ล็อกของฐาน = 1 · ล็อกของ 1 = 0`,
      why: r`สมบัติใช้กับ \(\log\) ที่ฐานเดียวกัน: ผลบวก → คูณจำนวน, ผลต่าง → หารจำนวน, \(\log_{a}M^{n}=n\log_{a}M\) · ตัวอย่างที่ผิดคือการ "บวก/ลบ/คูณ" จำนวนภายในล็อก ซึ่งไม่ตรงกับสมบัติใดเลย`, answer: true,
      verify: () => items.every((t) => t.ok()) && !dis.ok() && new Set(chips.map((c) => c.html)).size === chips.length });
  }
  function qWrongUse(R) {
    const three = R.sample(PROPS.filter((p) => ['sum', 'diff', 'pow', 'chg'].includes(p.id)), 3).map((p) => p.make(R));
    const dis = wrongEx(R);
    const opts = three.concat([dis]);
    return Q.choice({ q: 'ข้อใด<b>ใช้สมบัติของลอการิทึมไม่ถูกต้อง</b>', options: opts.map((o) => '\\(' + o.tex + '\\)'), answer: 3,
      why: r`ลอการิทึมของ "ผลบวก" หรือ "ผลต่าง" ของสองจำนวนไม่สามารถแยกเป็นล็อกแต่ละตัวได้ · และ \(\log_{a}M\cdot\log_{a}N\) ไม่เท่ากับ \(\log_{a}MN\) · สมบัติที่ใช้ได้คือ \(\log_{a}MN=\log_{a}M+\log_{a}N\)`,
      verify: () => (opts.filter((o) => !o.ok()).length === 1 ? opts.findIndex((o) => !o.ok()) : -1) });
  }

  /* ---------- ด่าน 2 : หาค่า ---------- */
  function qSum(R) {
    const b = R.pick([2, 3, 5]), i = R.int(1, b > 3 ? 2 : 4), j = (() => { const m = b > 3 ? 2 : 4; let v; do { v = R.int(1, m); } while (v === i); return v; })(), p = Math.pow(b, i), q = Math.pow(b, j);
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${b}}${p}+\log_{${b}}${q}\)`, answer: i + j, hint: r`ใช้ \(\log_{a}M+\log_{a}N=\log_{a}MN\) แล้วหาว่า ${p} × ${q} เป็นกำลังเท่าใดของ ${b}`,
      why: r`\(\log_{${b}}${p}+\log_{${b}}${q}=\log_{${b}}(${p}\times${q})=\log_{${b}}${p * q}=${i + j}\) เพราะ \(${b}^{${i + j}}=${p * q}\)`, verify: () => Math.round(lg(b, p) + lg(b, q)) });
  }
  function qDiff(R) {
    const b = R.pick([2, 3, 5]), N = R.pick([2, 3, 4, 5, 6]), k = R.int(2, b > 3 ? 3 : 4), M = N * Math.pow(b, k);
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${b}}${M}-\log_{${b}}${N}\)`, answer: k, hint: r`ใช้ \(\log_{a}M-\log_{a}N=\log_{a}\dfrac{M}{N}\)`,
      why: r`\(\log_{${b}}${M}-\log_{${b}}${N}=\log_{${b}}\dfrac{${M}}{${N}}=\log_{${b}}${Math.pow(b, k)}=${k}\)`, verify: () => Math.round(lg(b, M) - lg(b, N)) });
  }
  function qMix(R) {
    const b = R.pick([2, 3, 5, 10]), N = R.pick([2, 3, 5, 7]), k = R.int(1, 3), M = Math.pow(b, k) * N * N;
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${b}}${M}-2\log_{${b}}${N}\)`, answer: k, hint: r`จัด \(2\log_{${b}}${N}\) เป็น \(\log_{${b}}${N * N}\) ก่อน แล้วใช้สมบัติผลต่าง`,
      why: r`\(2\log_{${b}}${N}=\log_{${b}}${N}^{2}=\log_{${b}}${N * N}\) · \(\log_{${b}}${M}-\log_{${b}}${N * N}=\log_{${b}}\dfrac{${M}}{${N * N}}=\log_{${b}}${Math.pow(b, k)}=${k}\)`, verify: () => Math.round(lg(b, M) - 2 * lg(b, N)) });
  }
  function qBase(R) {
    const [b, m, n] = R.pick([[2, 2, 6], [3, 2, 6], [2, 3, 6], [3, 2, 4], [2, 2, 4], [2, 3, 9], [5, 2, 6], [3, 3, 6]]);
    const A = Math.pow(b, m), X = Math.pow(b, n);
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${A}}${X}\) (ถ้าไม่เป็นจำนวนเต็มให้ตอบเป็นเศษส่วนหรือทศนิยม)`, answer: n / m, prob: true, ph: PH,
      hint: r`เปลี่ยนฐานเป็น ${b}: \(\log_{${A}}${X}=\dfrac{\log_{${b}}${X}}{\log_{${b}}${A}}\)`,
      why: r`\(\log_{${A}}${X}=\dfrac{\log_{${b}}${X}}{\log_{${b}}${A}}=\dfrac{${n}}{${m}}${n % m === 0 ? '=' + n / m : ''}\)`, verify: () => lg(A, X) });
  }
  const APX = [
    () => ({ t: '\\log 14', v: LOG2 + LOG7, w: r`\(\log 14=\log(2\times7)=\log2+\log7=0.3010+0.8451=1.1461\)`, tv: () => Math.log10(14) }),
    () => ({ t: '\\log 28', v: 2 * LOG2 + LOG7, w: r`\(\log 28=\log(2^{2}\times7)=2\log2+\log7=0.6020+0.8451=1.4471\)`, tv: () => Math.log10(28) }),
    () => ({ t: '\\log 49', v: 2 * LOG7, w: r`\(\log 49=\log7^{2}=2\log7=2(0.8451)=1.6902\)`, tv: () => Math.log10(49) }),
    () => ({ t: '\\log 56', v: 3 * LOG2 + LOG7, w: r`\(\log 56=\log(2^{3}\times7)=3\log2+\log7=0.9030+0.8451=1.7481\)`, tv: () => Math.log10(56) }),
    () => ({ t: '\\log \\dfrac{7}{2}', v: LOG7 - LOG2, w: r`\(\log\dfrac{7}{2}=\log7-\log2=0.8451-0.3010=0.5441\)`, tv: () => Math.log10(3.5) }),
    () => ({ t: '\\log 700', v: 2 + LOG7, w: r`\(\log700=\log(7\times10^{2})=\log7+2\log10=0.8451+2=2.8451\)`, tv: () => Math.log10(700) }),
    () => ({ t: '\\log 5', v: 1 - LOG2, w: r`\(\log5=\log\dfrac{10}{2}=\log10-\log2=1-0.3010=0.6990\)`, tv: () => Math.log10(5) }),
    () => ({ t: '\\log 98', v: LOG2 + 2 * LOG7, w: r`\(\log98=\log(2\times7^{2})=\log2+2\log7=0.3010+1.6902=1.9912\)`, tv: () => Math.log10(98) }),
    () => ({ t: '\\log 0.7', v: LOG7 - 1, w: r`\(\log0.7=\log\dfrac{7}{10}=\log7-\log10=0.8451-1=-0.1549\)`, tv: () => Math.log10(0.7) }),
    () => ({ t: '\\log 20', v: 1 + LOG2, w: r`\(\log20=\log(2\times10)=\log2+\log10=0.3010+1=1.3010\)`, tv: () => Math.log10(20) }),
  ];
  function qApprox(R, idx) {
    const a = APX[idx](), vv = +a.v.toFixed(4);
    return Q.fill({ q: r`${GIVEN} จงหาค่าประมาณของ \(${a.t}\)`, answer: vv, tol: 0.003, ph: 'ทศนิยม (เช่น 1.2345)',
      hint: r`แยกจำนวนให้อยู่ในรูปผลคูณหรือผลหารของ 2, 7 และ 10 แล้วใช้สมบัติของลอการิทึม (\(\log10=1\))`, why: a.w + r` (ตอบคลาดเคลื่อนไม่เกิน 0.003 ถือว่าถูก)`, verify: () => +(a.tv()).toFixed(4) });
  }

  /* ---------- ด่าน 3 : กระจายและรวมนิพจน์ ---------- */
  const VARSETS = [['x', 'y', 'z'], ['m', 'n', 'k'], ['p', 'q', 's'], ['u', 'v', 'w']];
  function coefT(c) {
    if (Math.abs(c) === 1) return '';
    if (Number.isInteger(c)) return String(Math.abs(c));
    return '\\frac{1}{2}';
  }
  function sumT(vec, vars, base) {
    let s = '';
    vec.forEach((c, i) => {
      if (!c) return;
      s += (c < 0 ? '-' : s ? '+' : '') + coefT(c) + '\\log_{' + base + '}' + vars[i];
    });
    return s;
  }
  function expandQ(R, kind) {
    const vars = R.pick(VARSETS), [x, y, z] = vars, base = R.pick(['a', 'a', '3', '2']);
    let expr, correct, wrongs, why;
    if (kind === 'mixed') {
      const p = R.int(2, 4), q = R.int(1, 3), s = R.int(2, 3);
      expr = '\\dfrac{' + x + '^{' + p + '}' + (q === 1 ? y : y + '^{' + q + '}') + '}{' + z + '^{' + s + '}}';
      correct = [p, q, -s]; wrongs = [[1, 1, -1], [p, q, s], [p, -q, -s]];
      why = r`\(\log_{${base}}\dfrac{${x}^{${p}}${y}${q === 1 ? '' : '^{' + q + '}'}}{${z}^{${s}}}=\log_{${base}}${x}^{${p}}+\log_{${base}}${y}${q === 1 ? '' : '^{' + q + '}'}-\log_{${base}}${z}^{${s}}=${sumT(correct, vars, base)}\)`;
    } else {
      const q = R.int(2, 4);
      expr = '\\dfrac{\\sqrt{' + x + '}}{' + y + '^{' + q + '}}';
      correct = [0.5, -q, 0]; wrongs = [[2, -q, 0], [0.5, q, 0], [0.5, -1, 0]];
      why = r`\(\sqrt{${x}}=${x}^{\frac12}\) · \(\log_{${base}}\dfrac{${x}^{1/2}}{${y}^{${q}}}=\tfrac12\log_{${base}}${x}-${q}\log_{${base}}${y}\)`;
    }
    const all = [correct].concat(wrongs);
    return Q.choice({ q: r`จงกระจาย \(\log_{${base}}${expr}\) ให้อยู่ในรูปผลบวกและผลลบของลอการิทึม`, options: all.map((v) => '\\(' + sumT(v, vars, base) + '\\)'), answer: 0, why,
      verify: () => (new Set(all.map((v) => v.join())).size === all.length ? 0 : -1) });
  }
  function condenseQ(R) {
    const vars = R.pick(VARSETS), [x, y, z] = vars, base = R.pick(['a', '2', '3']);
    const p = R.int(2, 3), q = R.int(2, 3), s = R.int(1, 2);
    const given = [p, q, -s];
    const ex = (v, e) => (e === 1 ? v : v + '^{' + e + '}');
    const opts = [
      { tex: '\\log_{' + base + '}\\dfrac{' + ex(x, p) + ex(y, q) + '}{' + ex(z, s) + '}', good: true },
      { tex: '\\log_{' + base + '}\\dfrac{' + p + x + '\\cdot' + q + y + '}{' + s + z + '}', good: false },
      { tex: '\\log_{' + base + '}\\left(' + ex(x, p) + ex(y, q) + '-' + ex(z, s) + '\\right)', good: false },
      { tex: '\\log_{' + base + '}\\dfrac{' + ex(x, p) + '+' + ex(y, q) + '}{' + ex(z, s) + '}', good: false },
    ];
    return Q.choice({ q: r`จงเขียน \(${sumT(given, vars, base)}\) ให้อยู่ในรูปลอการิทึมเพียงตัวเดียว`, options: opts.map((o) => '\\(' + o.tex + '\\)'), answer: 0,
      why: r`ย้ายตัวคูณหน้าล็อกไปเป็นเลขชี้กำลัง: \(${p}\log ${x}=\log ${x}^{${p}}\) ฯลฯ · แล้วบวก → คูณ, ลบ → หาร ได้ \(\log_{${base}}\dfrac{${ex(x, p)}${ex(y, q)}}{${ex(z, s)}}\)`,
      verify: () => (opts.filter((o) => o.good).length === 1 ? opts.findIndex((o) => o.good) : -1) });
  }
  function qGivenLog(R) {
    const p = '\\log_{a}2', q = '\\log_{a}3';
    // N = 2^i * 3^j (หรือหาร) → i p ± j q
    const forms = [[1, 1], [2, 1], [1, 2], [3, 1], [2, 2], [1, 3], [3, 2], [2, 3], [4, 1]];
    const [i, j] = R.pick(forms), sgn = R.pick([1, 1, -1]);
    const N = sgn > 0 ? Math.pow(2, i) * Math.pow(3, j) : null;
    const Ntex = sgn > 0 ? String(N) : '\\dfrac{' + Math.pow(2, i) + '}{' + Math.pow(3, j) + '}';
    const correct = [i, sgn * j];
    const lin = (v) => {
      const t = (c, s) => (Math.abs(c) === 1 ? '' : String(Math.abs(c))) + s;
      return (v[0] ? (v[0] < 0 ? '-' : '') + t(v[0], 'P') : '') + (v[1] ? (v[1] < 0 ? '-' : v[0] ? '+' : '') + t(v[1], 'Q') : '');
    };
    const pool = R.shuffle([[j, sgn * i], [i, -sgn * j], [i + j, 0], [i * j, 0], [i + 1, sgn * j], [i, sgn * (j + 1)], [i * 2, sgn * j]]);
    const seen = new Set([correct.join()]), all = [correct];
    pool.forEach((v) => { const k = v.join(); if (!seen.has(k) && all.length < 4 && (v[0] || v[1])) { seen.add(k); all.push(v); } });
    const fix = (s) => s.replace(/P/g, 'p').replace(/Q/g, 'q');
    return Q.choice({ q: r`กำหนด \(\log_{a}2=p\) และ \(\log_{a}3=q\) จงหาค่าของ \(\log_{a}${Ntex}\) ในรูปของ \(p\) และ \(q\)`, options: all.map((v) => '\\(' + fix(lin(v)) + '\\)'), answer: 0,
      why: r`\(${Ntex}=${sgn > 0 ? '2^{' + i + '}\\cdot3^{' + j + '}' : '\\dfrac{2^{' + i + '}}{3^{' + j + '}}'}\) จึง \(\log_{a}${Ntex}=${i}\log_{a}2${sgn > 0 ? '+' : '-'}${j}\log_{a}3=${fix(lin(correct))}\)`,
      verify: () => (new Set(all.map((v) => v.join())).size === 4 ? 0 : -1) });
  }

  window.HW = {
    id: 'HW-11', unit: 3, unitName: 'หน่วยที่ 3 ฟังก์ชันเอกซ์โพเนนเชียลและฟังก์ชันลอการิทึม', title: 'สมบัติของลอการิทึม',
    sub: 'จับคู่สมบัติกับตัวอย่าง หาค่าด้วยสมบัติของลอการิทึมและการเปลี่ยนฐาน ประมาณค่าจาก log 2 และ log 7 และกระจายนิพจน์ลอการิทึม',
    size: '13 ข้อ · 20 นาที', K: 3, P: 0, reviewFile: '3.4_สมบัติของลอการิทึม.html',
    levels: [
      { short: 'ด่าน 1', title: 'ด่าน 1 · จับคู่สมบัติ', kind: 'K', points: 1, skill: 'จำแนกสมบัติของลอการิทึมที่ใช้ในตัวอย่าง และตรวจจับการใช้สมบัติผิด', review: 'หัวข้อ 3.4 สมบัติของลอการิทึม (ข้อ 1–6) และการเปลี่ยนฐาน',
        desc: 'จับคู่สมบัติกับตัวอย่างที่ใช้สมบัตินั้น และหาตัวอย่างที่ใช้ผิด',
        intro: 'ข้อแรกลากหรือแตะตัวอย่างไปวางคู่กับสมบัติ (มีตัวลวง 1 ตัว) ข้อต่อไปเลือกตอบ ข้อละ 1 ครั้ง',
        build(R) { return [qMatchProp(R), qWrongUse(R)]; } },
      { short: 'ด่าน 2', title: 'ด่าน 2 · หาค่า', kind: 'K', points: 1, skill: 'ใช้สมบัติผลบวก ผลต่าง การยกกำลัง การเปลี่ยนฐาน และประมาณค่าลอการิทึมจากค่าที่กำหนดให้', review: 'หัวข้อ 3.4 ตัวอย่างการหาค่าด้วยสมบัติ และการประมาณค่าจากตาราง/ค่าที่กำหนด',
        desc: 'หาค่าของนิพจน์ลอการิทึม เปลี่ยนฐาน และประมาณค่า',
        intro: 'ตอบเป็นจำนวนเต็ม เศษส่วน หรือทศนิยม · ข้อประมาณค่าให้ใช้ค่าที่กำหนดบนหน้าจอ: <b>log 2 ≈ 0.3010 และ log 7 ≈ 0.8451</b> (ไม่ต้องใช้เครื่องคิดเลขหรือตาราง) · ผิดครั้งแรกมีคำใบ้ให้ลองใหม่',
        build(R) { const ix = R.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2); return [qSum(R), qDiff(R), qMix(R), qBase(R), qApprox(R, ix[0]), qApprox(R, ix[1])]; } },
      { short: 'ด่าน 3', title: 'ด่าน 3 · กระจายและรวมนิพจน์', kind: 'K', points: 1, skill: 'กระจายนิพจน์ลอการิทึมเป็นผลบวกผลลบ รวมกลับเป็นล็อกตัวเดียว และเขียนนิพจน์ในรูปของค่าที่กำหนดให้', review: 'หัวข้อ 3.4 การกระจายและการรวมลอการิทึมโดยใช้สมบัติข้อ 3–5',
        desc: 'เลือกรูปที่ถูกต้องของนิพจน์ที่กระจายหรือรวมแล้ว',
        intro: 'เลือกตอบข้อละ 1 ครั้ง · ระวังตัวเลือกที่ลืมเลขชี้กำลังหรือสลับเครื่องหมาย',
        build(R) { return [expandQ(R, 'mixed'), expandQ(R, 'sqrt'), condenseQ(R), qGivenLog(R)]; } },
    ],
  };
})();
