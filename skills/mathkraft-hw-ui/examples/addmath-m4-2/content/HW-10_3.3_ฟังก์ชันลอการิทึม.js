/* HW-10 · 3.3 ฟังก์ชันลอการิทึม */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q, lab = MK.lab;
  const r = String.raw;
  const PH = 'จำนวนเต็ม เศษส่วน หรือทศนิยม';
  const brk = (t) => '\\left(' + t + '\\right)';
  const numT = (v) => String(+v.toFixed(3)).replace('-', '−');

  /* triple a^y = x  (a = n หรือ 1/n) พร้อมรูปเขียน LaTeX */
  function T(n, inv, y) {
    const aTex = inv ? '\\frac{1}{' + n + '}' : String(n);
    const av = inv ? 1 / n : n;
    const e = inv ? -y : y;
    const big = Math.pow(n, Math.abs(e));
    const xv = Math.pow(n, e);
    const xTex = e >= 0 ? String(big) : n === 10 ? '0.' + '0'.repeat(-e - 1) + '1' : '\\frac{1}{' + big + '}';
    return { n, inv, y, a: aTex, av, x: xTex, xv,
      exp: (inv ? brk(aTex) : aTex) + '^{' + y + '}=' + xTex,
      log: '\\log_{' + aTex + '}\\,' + xTex + '=' + y };
  }
  const INT = [[2, 5], [3, 4], [5, 3], [7, 2], [6, 3], [4, 3], [2, 6], [5, 4], [9, 2], [8, 2], [2, 4], [3, 5]];
  const NEG = [[2, -3], [3, -2], [5, -2], [4, -2], [2, -4], [3, -3], [5, -1]];
  const DEC = [[10, -1], [10, -2], [10, -3]];
  const FRC = [[2, 3], [3, 2], [2, -2], [3, -2], [2, 4], [4, 2], [5, 2]];
  const mk = (list, inv) => list.map(([n, y]) => T(n, inv, y));
  const lg = (b, arg) => (b > 0 && b !== 1 && arg > 0 ? Math.log(arg) / Math.log(b) : NaN);
  const near = (u, v) => Math.abs(u - v) < 1e-9 * Math.max(1, Math.abs(v));

  /* ---------- ด่าน 1 : สลับรูป ---------- */
  function qSwitch(R) {
    const pick = [].concat(R.sample(mk(INT, false), 2), R.sample(mk(NEG, false), 1), R.sample(mk(DEC, false), 1), R.sample(mk(FRC, true), 1));
    const items = R.shuffle(pick.map((t, i) => Object.assign({ key: 'k' + i }, t)));
    const t0 = items.find((t) => !near(lg(t.xv, t.av), t.y));
    // ตัวลวง: สลับบทบาทของ a, y, x
    const dis = { key: 'dx', html: '\\(\\log_{' + t0.x + '}\\,' + t0.a + '=' + t0.y + '\\)', b: t0.xv, arg: t0.av, val: t0.y };
    const chips = items.map((t) => ({ html: '\\(' + t.log + '\\)', key: t.key })).concat([{ html: dis.html, key: dis.key }]);
    return Q.pairs({ q: 'จับคู่ความสัมพันธ์รูปเลขชี้กำลัง (ซ้าย) กับรูปลอการิทึมที่เทียบเท่า (ตัวเลือก) · มีตัวเลือกที่ไม่ตรงกับข้อใดอยู่ 1 ตัว',
      left: items.map((t) => ({ html: '\\(' + t.exp + '\\)', key: t.key })), chips,
      hint: r`\(a^{y}=x\) เทียบเท่า \(\log_{a}x=y\) คือ ฐานเดิมเป็นฐานของล็อก · เลขชี้กำลังคือค่าของล็อก · ผลลัพธ์คือจำนวนที่ถูกล็อก`,
      why: r`\(a^{y}=x \iff \log_{a}x=y\) ฐาน \(a\) ยังเป็นฐาน, เลขชี้กำลัง \(y\) กลายเป็นค่าของลอการิทึม, ค่า \(x\) คือจำนวนที่อยู่หลัง \(\log\)`, answer: true,
      verify: () => items.every((t) => near(Math.pow(t.av, t.y), t.xv) && near(lg(t.av, t.xv), t.y)) && !near(lg(dis.b, dis.arg), dis.val) && new Set(chips.map((c) => c.html)).size === chips.length });
  }
  function pw(bTex, eTex, rTex) {
    const wrap = /^-|frac/.test(bTex) ? brk(bTex) : bTex;
    return wrap + '^{' + eTex + '}=' + rTex;
  }
  function lgT(bTex, aTex, vTex) { return '\\log_{' + bTex + '}\\,' + (/^-/.test(aTex) ? '(' + aTex + ')' : aTex) + '=' + vTex; }
  const SRC = () => mk(INT.filter(([n, y]) => n !== y && Math.pow(y, n) !== Math.pow(n, y)), false).concat(mk(NEG, false), mk(DEC, false)).filter((t) => !near(Math.pow(t.y, t.av), t.xv) && !near(Math.pow(t.xv, t.y), t.av) && !near(lg(t.xv, t.av), t.y) && !near(Math.pow(t.av, t.xv), t.y));
  function qLogToExp(R) {
    const t = R.pick(SRC()), Y = String(t.y);
    const opts = [
      { tex: pw(t.a, Y, t.x), b: t.av, e: t.y, v: t.xv },
      { tex: pw(t.a, t.x, Y), b: t.av, e: t.xv, v: t.y },
      { tex: pw(t.x, Y, t.a), b: t.xv, e: t.y, v: t.av },
      { tex: pw(Y, t.a, t.x), b: t.y, e: t.av, v: t.xv },
    ];
    const truth = (o) => near(Math.pow(o.b, o.e), o.v);
    return Q.choice({ q: r`จงเขียน \(${t.log}\) ให้อยู่ในรูปเลขชี้กำลัง`, options: opts.map((o) => '\\(' + o.tex + '\\)'), answer: 0,
      why: r`\(\log_{a}x=y\) หมายความว่า \(a^{y}=x\) · ดังนั้น \(${t.log}\) เขียนเป็น \(${t.exp}\)`,
      verify: () => (opts.filter(truth).length === 1 ? opts.findIndex(truth) : -1) });
  }
  function qExpToLog(R) {
    const t = R.pick(SRC()), Y = String(t.y);
    const opts = [
      { tex: lgT(t.a, t.x, Y), b: t.av, arg: t.xv, v: t.y },
      { tex: lgT(t.a, Y, t.x), b: t.av, arg: t.y, v: t.xv },
      { tex: lgT(t.x, t.a, Y), b: t.xv, arg: t.av, v: t.y },
      { tex: lgT(Y, t.x, t.a), b: t.y, arg: t.xv, v: t.av },
    ];
    const truth = (o) => near(lg(o.b, o.arg), o.v);
    return Q.choice({ q: r`จงเขียน \(${t.exp}\) ให้อยู่ในรูปลอการิทึม`, options: opts.map((o) => '\\(' + o.tex + '\\)'), answer: 0,
      why: r`\(a^{y}=x\) หมายความว่า \(\log_{a}x=y\) · ดังนั้น \(${t.exp}\) เขียนเป็น \(${t.log}\)`,
      verify: () => (opts.filter(truth).length === 1 ? opts.findIndex(truth) : -1) });
  }

  /* ---------- ด่าน 2 : หาค่าลอการิทึม ---------- */
  const BS = [2, 3, 5, 6, 7];
  function qVal(R) {
    const b = R.pick(BS), k = R.int(2, b > 5 ? 3 : 5), N = Math.pow(b, k);
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${b}}\,${N}\)`, answer: k, hint: r`ถามว่า ${b} ยกกำลังเท่าใดจึงได้ ${N}`, why: r`\(${b}^{${k}}=${N}\) จึง \(\log_{${b}}${N}=${k}\)`, verify: () => Math.round(Math.log(N) / Math.log(b)) });
  }
  function qRecip(R) {
    const b = R.pick([2, 3, 4, 5]), k = R.int(2, b > 3 ? 2 : 4), N = Math.pow(b, k);
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${b}}\,\dfrac{1}{${N}}\)`, answer: -k, hint: r`\(\dfrac{1}{${N}}=${b}^{?}\) · เลขชี้กำลังของส่วนกลับเป็นจำนวนลบ`, why: r`\(\dfrac{1}{${N}}=${b}^{-${k}}\) จึง \(\log_{${b}}\dfrac{1}{${N}}=-${k}\)`, verify: () => Math.round(Math.log(1 / N) / Math.log(b)) });
  }
  function qDec(R) {
    const k = R.int(2, 4), dec = '0.' + '0'.repeat(k - 1) + '1';
    return Q.fill({ q: r`จงหาค่าของ \(\log_{10}\,${dec}\)`, answer: -k, hint: r`เขียน \(${dec}\) ให้อยู่ในรูป \(10^{?}\)`, why: r`\(${dec}=\dfrac{1}{${Math.pow(10, k)}}=10^{-${k}}\) จึง \(\log_{10}${dec}=-${k}\)`, verify: () => Math.round(Math.log10(parseFloat(dec))) });
  }
  function qRoot(R) {
    const [b, k] = R.pick([[3, 2], [5, 2], [2, 3], [3, 3], [2, 4], [4, 2], [7, 2]]), N = Math.pow(b, k);
    return Q.fill({ q: r`จงหาค่าของ \(\log_{${N}}\,${b}\)`, answer: 1 / k, prob: true, ph: PH, hint: r`ถามว่า ${N} ยกกำลังเท่าใดจึงได้ ${b} · เลขชี้กำลังเป็นเศษส่วน (รากที่ ${k} ของ ${N} คือ ${b})`,
      why: r`\(${N}^{\frac{1}{${k}}}=\sqrt[${k}]{${N}}=${b}\) จึง \(\log_{${N}}${b}=\dfrac{1}{${k}}\)`, verify: () => Math.log(b) / Math.log(N) });
  }
  function qUnknown(R) {
    const kind = R.pick(['a', 'x1', 'x2']), b = R.pick([2, 3, 4, 5]);
    if (kind === 'a') { const k = R.int(2, 3), N = Math.pow(b, k); return Q.fill({ q: r`ถ้า \(\log_{a}\,${N}=${k}\) เมื่อ \(a>0\) และ \(a\neq1\) จงหาค่า \(a\)`, answer: b, hint: r`เขียนเป็นรูปเลขชี้กำลัง: \(a^{${k}}=${N}\)`, why: r`\(\log_{a}${N}=${k}\iff a^{${k}}=${N}\) ดังนั้น \(a=${b}\) (เพราะ \(a>0\))`, verify: () => Math.round(Math.pow(N, 1 / k)) }); }
    if (kind === 'x1') { const k = R.int(2, 3); return Q.fill({ q: r`ถ้า \(\log_{${b}}\,x=-${k}\) จงหาค่า \(x\)`, answer: 1 / Math.pow(b, k), prob: true, ph: PH, hint: r`เขียนเป็นรูปเลขชี้กำลัง: \(x=${b}^{-${k}}\)`, why: r`\(\log_{${b}}x=-${k}\iff x=${b}^{-${k}}=\dfrac{1}{${Math.pow(b, k)}}\)`, verify: () => Math.pow(b, -k) }); }
    const k = R.int(3, 4); return Q.fill({ q: r`ถ้า \(\log_{${b}}\,x=${k}\) จงหาค่า \(x\)`, answer: Math.pow(b, k), hint: r`เขียนเป็นรูปเลขชี้กำลัง: \(x=${b}^{${k}}\)`, why: r`\(\log_{${b}}x=${k}\iff x=${b}^{${k}}=${Math.pow(b, k)}\)`, verify: () => Math.pow(b, k) });
  }

  /* ---------- ด่าน 3 : กราฟลอการิทึม ---------- */
  const LVALS = [[1, 4], [1, 3], [1, 2], [2, 1], [3, 1], [4, 1]];
  const lval = (a) => a[0] / a[1];
  const ltex = (a) => (a[1] === 1 ? String(a[0]) : '\\frac{' + a[0] + '}{' + a[1] + '}');
  function labLog() {
    const qs = [
      Q.choice({ q: r`กราฟของ \(y=a^{x}\) กับ \(y=\log_{a}x\) <b>สมมาตรกัน</b> (สะท้อนกัน) ในเส้นตรงใด`, options: ['เส้นตรง \\(y=x\\) (เส้นประ)', 'แกน \\(x\\) (เส้นตรง \\(y=0\\))', 'แกน \\(y\\) (เส้นตรง \\(x=0\\))', 'เส้นตรง \\(y=1\\)'], answer: 0, why: r`ฟังก์ชันเอกซ์โพเนนเชียลและฟังก์ชันลอการิทึมที่ฐานเดียวกันเป็นฟังก์ชันผกผันกัน กราฟสะท้อนกันในเส้นตรง \(y=x\)`, verify: () => 0 }),
      Q.choice({ q: r`ถ้ากราฟของ \(y=a^{x}\) ผ่านจุด \((p,\ q)\) แล้วกราฟของ \(y=\log_{a}x\) ต้องผ่านจุดใด`, options: ['\\((q,\\ p)\\)', '\\((p,\\ -q)\\)', '\\((-p,\\ q)\\)', '\\((p,\\ q)\\)'], answer: 0, why: r`\(q=a^{p}\iff \log_{a}q=p\) ดังนั้นสลับพิกัด \(x\) กับ \(y\) จะได้จุด \((q,\ p)\) บนกราฟของ \(y=\log_{a}x\)`, verify: () => 0 }),
      Q.choice({ q: r`ข้อใดกล่าวถูกต้อง (สำหรับทุกค่า \(a>0,\ a\neq1\))`, options: ['กราฟ \\(y=a^{x}\\) ตัดแกน \\(y\\) ที่ \\((0,1)\\) · กราฟ \\(y=\\log_{a}x\\) ตัดแกน \\(x\\) ที่ \\((1,0)\\)', 'กราฟทั้งสองตัดแกน \\(y\\) ที่ \\((0,1)\\)', 'กราฟทั้งสองตัดแกน \\(x\\) ที่ \\((1,0)\\)', 'กราฟ \\(y=\\log_{a}x\\) ตัดแกน \\(y\\) ที่ \\((0,1)\\)'], answer: 0, why: r`\(a^{0}=1\) จึงผ่าน \((0,1)\) · \(\log_{a}1=0\) จึงผ่าน \((1,0)\) (สะท้อนกัน: สลับพิกัดของ \((0,1)\))`, verify: () => 0 }),
      Q.choice({ q: r`เรนจ์ของฟังก์ชัน \(y=\log_{a}x\) คือเซตใด`, options: ['จำนวนจริงทั้งหมด', 'จำนวนจริงบวกเท่านั้น', 'จำนวนจริงที่มากกว่าหรือเท่ากับ 0', 'จำนวนจริงที่มากกว่า 1'], answer: 0, why: r`โดเมนของ \(y=a^{x}\) คือจำนวนจริงทั้งหมด จึงเรนจ์ของ \(y=\log_{a}x\) (ผกผัน) เป็นจำนวนจริงทั้งหมด · ส่วนโดเมนของ \(y=\log_{a}x\) คือ \(\{x\mid x>0\}\)`, verify: () => 0 }),
    ];
    return lab.expLab({ desc: r`<b>ห้องทดลองกราฟ</b> เลื่อนแถบเพื่อเปลี่ยนค่า \(a\) ดูกราฟของ \(y=a^{x}\) (สีม่วง) และ \(y=\log_{a}x\) (สีส้ม) เทียบกับเส้น \(y=x\) (เส้นประ) แล้วสังเกตว่าจุดในตารางสะท้อนกันอย่างไร`,
      vals: LVALS.map(lval), labels: LVALS.map(ltex), qs,
      opts: (a) => ({ xmin: -2, xmax: 5, ymin: -2, ymax: 5, w: 320, h: 310, diag: true, minorY: 0,
        curves: [{ f: (x) => Math.pow(a, x), cls: 'c0' }, { xy: (t) => [Math.pow(a, t), t], cls: 'c3', xmin: -2, xmax: 5 }],
        pts: [{ x: 0, y: 1, cls: 'hi', label: '(0, 1)', dx: 7, dy: -8, r: 5 }, { x: 1, y: 0, cls: 'hi', label: '(1, 0)', dx: 4, dy: 18, r: 5 }] }),
      readout: (a, l) => 'ค่า \\(a=' + l + '\\) · สีม่วง \\(y=a^{x}\\) · สีส้ม \\(y=\\log_{a}x\\) · เส้นประ \\(y=x\\)',
      table: (a) => [-1, 0, 1, 2].map((x) => ['(' + numT(x) + ', ' + numT(Math.pow(a, x)) + ') บน aˣ', 'สะท้อน (' + numT(Math.pow(a, x)) + ', ' + numT(x) + ')']) });
  }
  const GB = [[2, 1], [3, 1], [1, 2], [1, 3]];
  function qGraphLog(R) {
    const a = R.pick(GB), av = lval(a);
    const g = lab.graph({ xmin: -0.5, xmax: 4.5, ymin: -2.5, ymax: 2.5, ystep: 1, minorY: 0.5, w: 320, h: 270, curves: [{ f: (x) => Math.log(x) / Math.log(av), cls: 'c3', xmin: 0.015, xmax: 4.5 }], pts: [{ x: 1, y: 0, cls: 'hi', r: 5, label: '(1, 0)', dx: 6, dy: -8 }] });
    const idx = GB.indexOf(a);
    const sig = (b) => [2, 3].map((x) => Math.round(Math.log(x) / Math.log(lval(b)) * 1000));
    return Q.choice({ q: r`กราฟต่อไปนี้เป็นกราฟของฟังก์ชันใด (ลองอ่านค่า \(y\) เมื่อ \(x=2\) และ \(x=3\))<div class="gx-wrap">${g.svg}</div>`,
      options: GB.map((b) => '\\(y=\\log_{' + ltex(b) + '}x\\)'), shuffle: false, answer: idx,
      why: r`ที่ \(x=${av > 1 ? a[0] : a[1]}\) กราฟมีค่า \(y=${av > 1 ? 1 : -1}\) เพราะ \(\log_{${ltex(a)}}${av > 1 ? a[0] : a[1]}=${av > 1 ? 1 : -1}\) · จึงเป็น \(y=\log_{${ltex(a)}}x\) (${av > 1 ? 'เพิ่ม เพราะ \\(a>1\\)' : 'ลด เพราะ \\(0<a<1\\)'})`,
      verify: () => { const s = sig(a); const m = GB.map((b, i) => (sig(b).join() === s.join() ? i : -1)).filter((i) => i >= 0); return m.length === 1 ? m[0] : -1; } });
  }
  function qReflect(R) {
    const a = R.pick([2, 3, 5]), p = R.pick([2, 3, -1, -2]), qv = Math.pow(a, p);
    const qTex = qv >= 1 ? String(qv) : '\\tfrac{1}{' + Math.round(1 / qv) + '}';
    return Q.fill({ q: r`กราฟของ \(y=${a}^{x}\) ผ่านจุด \((${p},\ ${qTex})\) จงหาพิกัดของจุดที่สะท้อนกันบนกราฟของ \(y=\log_{${a}}x\)`,
      fields: [{ label: r`พิกัด \(x\) =`, answer: qv, prob: true, ph: PH }, { label: r`พิกัด \(y\) =`, answer: p }],
      hint: r`สลับพิกัด: จุด \((p,\ q)\) บน \(y=a^{x}\) สะท้อนเป็น \((q,\ p)\) บน \(y=\log_{a}x\)`,
      why: r`\(${a}^{${p}}=${qTex}\iff\log_{${a}}${qTex}=${p}\) จึงผ่านจุด \((${qTex},\ ${p})\)`, verify: () => [Math.pow(a, p), p] });
  }
  function qDomain(R) {
    const a = R.pick(GB);
    return Q.fill({ q: r`สำหรับฟังก์ชัน \(f(x)=\log_{${ltex(a)}}x\) จงเติมให้สมบูรณ์`,
      fields: [{ label: r`โดเมนของ \(f\) คือ \(\{x\mid x>\)`, answer: 0, unit: '\\(\\}\\)' }, { label: r`กราฟตัดแกน \(x\) ที่จุด \((\)`, answer: 1, unit: '\\(,\\ 0)\\)' }, { label: r`กราฟเข้าใกล้เส้นตรง \(x=\)`, answer: 0 }],
      hint: r`ลอการิทึมของจำนวนลบหรือศูนย์หาค่าไม่ได้ · \(\log_{a}1=?\)`,
      why: r`โดเมน \(=\{x\mid x>0\}\) · \(\log_{a}1=0\) จึงตัดแกน \(x\) ที่ \((1,0)\) · เมื่อ \(x\) เข้าใกล้ 0 กราฟเข้าใกล้เส้น \(x=0\) (แกน \(y\)) แต่ไม่ตัดแกน \(y\)`, verify: () => [0, lg(lval(a), 1) === 0 ? 1 : -1, 0] });
  }

  window.HW = {
    id: 'HW-10', unit: 3, unitName: 'หน่วยที่ 3 ฟังก์ชันเอกซ์โพเนนเชียลและฟังก์ชันลอการิทึม', title: 'ฟังก์ชันลอการิทึม',
    sub: 'สลับรูปเลขชี้กำลังกับรูปลอการิทึม หาค่าลอการิทึม และสำรวจกราฟ y = logₐ x เทียบกับ y = aˣ',
    size: '12 ข้อ · 15 นาที', K: 3, P: 0, reviewFile: '3.3_ฟังก์ชันลอการิทึม.html',
    levels: [
      { short: 'ด่าน 1', title: 'ด่าน 1 · สลับรูป', kind: 'K', points: 1, skill: 'เขียนความสัมพันธ์รูปเลขชี้กำลังกับรูปลอการิทึมสลับกันได้ถูกต้อง รวมกรณีเลขชี้กำลังติดลบและฐานเป็นเศษส่วน', review: 'หัวข้อ 3.3 นิยามของลอการิทึม: log_a x = y ก็ต่อเมื่อ aʸ = x',
        desc: 'จับคู่รูปเลขชี้กำลังกับรูปลอการิทึม และเลือกรูปที่เทียบเท่า',
        intro: 'ข้อแรกลากหรือแตะตัวเลือกไปวางคู่กัน (มีตัวลวง 1 ตัว) ข้อถัดไปเลือกตอบ ข้อละ 1 ครั้ง',
        build(R) { return [qSwitch(R), qLogToExp(R), qExpToLog(R)]; } },
      { short: 'ด่าน 2', title: 'ด่าน 2 · หาค่าลอการิทึม', kind: 'K', points: 1, skill: 'หาค่าลอการิทึมโดยเขียนจำนวนในรูปเลขยกกำลัง และหาค่าตัวไม่ทราบค่าจากสมการลอการิทึมอย่างง่าย', review: 'หัวข้อ 3.3 การหาค่าลอการิทึมและการเปลี่ยนรูปเพื่อหาตัวไม่ทราบค่า',
        desc: 'หาค่าของ log และหาตัวไม่ทราบค่า',
        intro: 'ตอบเป็นจำนวนเต็ม เศษส่วน หรือทศนิยม · ผิดครั้งแรกมีคำใบ้ให้ลองใหม่ (ถูกในครั้งที่ 2 ได้ครึ่งคะแนน)',
        build(R) { return [qVal(R), qRecip(R), qDec(R), qRoot(R), qUnknown(R)]; } },
      { short: 'ด่าน 3', title: 'ด่าน 3 · กราฟลอการิทึม', kind: 'K', points: 1, skill: 'บอกลักษณะของกราฟ y = logₐ x เทียบกับ y = aˣ ระบุโดเมน เรนจ์ และอ่านกราฟเพื่อหาสมการ', review: 'หัวข้อ 3.3.1 กราฟของฟังก์ชันลอการิทึม',
        desc: 'ทดลองกราฟคู่ผกผัน แล้วอ่านกราฟและตอบเรื่องโดเมน เรนจ์',
        intro: 'เลื่อนแถบดูกราฟคู่ผกผันก่อน (ลองค่า a ที่น้อยกว่า 1 และมากกว่า 1 อย่างละ 2 ค่า) แล้วตอบสรุป 4 ข้อ จากนั้นทำข้ออ่านกราฟและเติมคำตอบ',
        build(R) { return [labLog(), qGraphLog(R), qReflect(R), qDomain(R)]; } },
    ],
  };
})();
