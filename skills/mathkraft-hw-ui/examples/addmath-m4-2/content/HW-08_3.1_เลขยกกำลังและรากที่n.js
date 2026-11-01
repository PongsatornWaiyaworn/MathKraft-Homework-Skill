/* HW-08 · 3.1 ทบทวนเลขยกกำลังและรากที่ n */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const r = String.raw;
  const fr = MK.fr;
  const PH = 'จำนวนเต็ม เศษส่วน หรือทศนิยม';
  const TOL = 1e-9;

  /* ---------- ด่าน 1 : จับคู่นิพจน์เทียบเท่า ---------- */
  function qLaws(R) {
    const [v, w] = R.pick([['a', 'b'], ['x', 'y'], ['p', 'q']]);
    const [m, n] = R.pick([[3, 2], [4, 2], [4, 3], [5, 2], [5, 3]]);
    const p = R.int(2, 6), q = R.int(2, 6);
    const items = [
      { key: 'add', L: r`${v}^{${m}}\cdot ${v}^{${n}}`, Rr: r`${v}^{${m + n}}`, fl: (a) => a ** m * a ** n, fr: (a) => a ** (m + n) },
      { key: 'sub', L: r`\dfrac{${v}^{${m}}}{${v}^{${n}}}`, Rr: m - n === 1 ? v : r`${v}^{${m - n}}`, fl: (a) => a ** m / a ** n, fr: (a) => a ** (m - n) },
      { key: 'pow', L: r`\left(${v}^{${m}}\right)^{${n}}`, Rr: r`${v}^{${m * n}}`, fl: (a) => (a ** m) ** n, fr: (a) => a ** (m * n) },
      { key: 'mul', L: r`(${v}${w})^{${p}}`, Rr: r`${v}^{${p}}${w}^{${p}}`, fl: (a, b) => (a * b) ** p, fr: (a, b) => a ** p * b ** p },
      { key: 'neg', L: r`${v}^{-${q}}`, Rr: r`\dfrac{1}{${v}^{${q}}}`, fl: (a) => a ** -q, fr: (a) => 1 / a ** q },
    ];
    const dis = [{ key: 'd1', Rr: r`${v}^{${m}}+${v}^{${n}}`, fr: (a) => a ** m + a ** n }, { key: 'd2', Rr: r`-${v}^{${m}}`, fr: (a) => -(a ** m) }];
    const chips = items.map((i) => ({ html: '\\(' + i.Rr + '\\)', key: i.key })).concat(dis.map((d) => ({ html: '\\(' + d.Rr + '\\)', key: d.key })));
    return Q.pairs({ q: 'จับคู่นิพจน์ทางซ้ายกับนิพจน์ที่เท่ากัน (มีการ์ดเกิน 2 ใบ ที่ไม่ตรงกับข้อใด)',
      left: items.map((i) => ({ html: '\\(' + i.L + '\\)', key: i.key })), chips,
      hint: r`ทดลองแทนค่าตัวแปรด้วยเลขเล็ก ๆ เช่น 2 หรือ 3 แล้วเทียบสองข้างว่าเท่ากันหรือไม่`,
      why: r`\(a^{m}\cdot a^{n}=a^{m+n}\) · \(\dfrac{a^{m}}{a^{n}}=a^{m-n}\) · \((a^{m})^{n}=a^{mn}\) · \((ab)^{n}=a^{n}b^{n}\) · \(a^{-n}=\dfrac{1}{a^{n}}\)`,
      answer: true,
      verify: () => {
        const pts = [[2, 3], [3, 5], [1.5, 2]];
        const eq = (f, g) => pts.every((t) => Math.abs(f(...t) - g(...t)) < 1e-9 * Math.max(1, Math.abs(f(...t))));
        const all = items.map((i) => ({ key: i.key, f: i.fr })).concat(dis.map((d) => ({ key: d.key, f: d.fr })));
        const okPairs = items.every((i) => eq(i.fl, i.fr));
        const distinct = items.every((i) => all.every((c) => c.key === i.key || !eq(i.fl, c.f)));
        const uniq = new Set(chips.map((c) => c.html)).size === chips.length;
        return okPairs && distinct && uniq;
      } });
  }
  function qRoots(R) {
    const cand = [];
    for (let n = 2; n <= 5; n++) for (let m = 1; m <= 4; m++) if (MK.gcd(n, m) === 1 && m !== n) cand.push([n, m]);
    const picks = R.sample(cand, 5);
    const forms = ['rt', 'inv', 'pw'];
    const items = picks.map(([n, m], i) => {
      const f = forms[i % 3 === 0 ? 0 : R.int(0, 2)];
      const rt = n === 2 ? '\\sqrt' : '\\sqrt[' + n + ']';
      const e = '\\frac{' + m + '}{' + n + '}';
      const xm = m === 1 ? 'x' : 'x^{' + m + '}';
      if (f === 'inv') return { key: 'k' + i, L: '\\dfrac{1}{' + rt + '{' + xm + '}}', Rr: 'x^{-' + e + '}', fl: (x) => 1 / Math.pow(Math.pow(x, m), 1 / n), fr: (x) => Math.pow(x, -m / n) };
      if (f === 'pw') return { key: 'k' + i, L: (m === 1 ? rt + '{x}' : '\\left(' + rt + '{x}\\right)^{' + m + '}'), Rr: 'x^{' + e + '}', fl: (x) => Math.pow(Math.pow(x, 1 / n), m), fr: (x) => Math.pow(x, m / n) };
      return { key: 'k' + i, L: rt + '{' + xm + '}', Rr: 'x^{' + e + '}', fl: (x) => Math.pow(Math.pow(x, m), 1 / n), fr: (x) => Math.pow(x, m / n) };
    });
    // chip text must be unique: (n,m,sign) differ for every item, but 'rt' and 'pw' forms of different pairs can never coincide
    const dis = [];
    const used = new Set(items.map((i) => i.Rr));
    const [n0, m0] = picks[0];
    [['x^{\\frac{' + n0 + '}{' + m0 + '}}', (x) => Math.pow(x, n0 / m0)], ['x^{' + (m0 + n0) + '}', (x) => Math.pow(x, m0 + n0)], ['x^{\\frac{1}{' + (m0 + n0) + '}}', (x) => Math.pow(x, 1 / (m0 + n0))]].some(([t, f]) => {
      if (used.has(t)) return false;
      if (items.some((i) => Math.abs(i.fr(2) - f(2)) < 1e-9 || Math.abs(i.fr(3) - f(3)) < 1e-9)) return false;
      dis.push({ key: 'dx', Rr: t, fr: f }); return true;
    });
    const chips = items.map((i) => ({ html: '\\(' + i.Rr + '\\)', key: i.key })).concat(dis.map((d) => ({ html: '\\(' + d.Rr + '\\)', key: d.key })));
    return Q.pairs({ q: 'จับคู่รากที่ \\(n\\) ทางซ้ายกับนิพจน์เลขชี้กำลังที่เป็นเศษส่วนที่เท่ากัน',
      left: items.map((i) => ({ html: '\\(' + i.L + '\\)', key: i.key })), chips,
      hint: r`\(\sqrt[n]{x^{m}}=x^{\frac{m}{n}}\) · รากที่ \(n\) ตัวส่วนของเลขชี้กำลัง · ถ้าอยู่ในตัวส่วนของเศษส่วน เลขชี้กำลังจะติดลบ`,
      why: r`\(\sqrt[n]{x^{m}}=\left(\sqrt[n]{x}\right)^{m}=x^{\frac{m}{n}}\) และ \(\dfrac{1}{x^{r}}=x^{-r}\)`, answer: true,
      verify: () => {
        const eq = (f, g) => [2, 3, 5].every((x) => Math.abs(f(x) - g(x)) < 1e-9 * Math.max(1, Math.abs(f(x))));
        const all = items.map((i) => ({ key: i.key, f: i.fr })).concat(dis.map((d) => ({ key: d.key, f: d.fr })));
        return items.every((i) => eq(i.fl, i.fr)) && items.every((i) => all.every((c) => c.key === i.key || !eq(i.fl, c.f))) && new Set(chips.map((c) => c.html)).size === chips.length;
      } });
  }

  /* ---------- ด่าน 2 : หาค่า ---------- */
  const frac = (num, den) => (den === 1 ? String(num) : '\\dfrac{' + num + '}{' + den + '}');
  const roots = [[2, [2, 3, 4, 5, 6, 7, 8, 9, 10]], [3, [2, 3, 4, 5]], [4, [2, 3]], [5, [2]]];
  function baseRoot(R) { const [n, ss] = R.pick(roots); const s = R.pick(ss); return { n, s, B: Math.pow(s, n) }; }
  function qPosFrac(R) {
    const { n, s, B } = baseRoot(R), m = R.int(1, 4), ans = Math.pow(s, m);
    return Q.fill({ q: r`หาค่าของ \(${B}^{\frac{${m}}{${n}}}\)`, answer: ans, prob: true, ph: PH, hint: r`เขียน \(${B}=${s}^{${n}}\) แล้วใช้ \((a^{m})^{n}=a^{mn}\)`,
      why: r`\(${B}^{\frac{${m}}{${n}}}=(${s}^{${n}})^{\frac{${m}}{${n}}}=${s}^{${m}}=${ans}\)`, verify: () => Math.pow(B, m / n) });
  }
  function qNegFrac(R) {
    const { n, s, B } = baseRoot(R), m = R.int(1, 3), den = Math.pow(s, m);
    return Q.fill({ q: r`หาค่าของ \(${B}^{-\frac{${m}}{${n}}}\) (ตอบเป็นเศษส่วนหรือทศนิยม)`, answer: 1 / den, prob: true, ph: PH, show: '1/' + den, hint: r`\(a^{-r}=\dfrac{1}{a^{r}}\) แล้วจัดฐานให้เป็นเลขยกกำลังเดียวกับตัวส่วนของเลขชี้กำลัง`,
      why: r`\(${B}^{-\frac{${m}}{${n}}}=\dfrac{1}{${B}^{\frac{${m}}{${n}}}}=\dfrac{1}{(${s}^{${n}})^{\frac{${m}}{${n}}}}=\dfrac{1}{${s}^{${m}}}=\dfrac{1}{${den}}\)`, verify: () => Math.pow(B, -m / n) });
  }
  function qFracBaseInt(R) {
    const [p, q] = R.pick([[2, 3], [3, 2], [2, 5], [5, 2], [3, 4], [4, 3], [3, 5], [5, 3], [1, 2], [1, 3], [2, 1], [3, 1]]);
    const k = R.int(2, 3), num = Math.pow(q, k), den = Math.pow(p, k);
    return Q.fill({ q: r`หาค่าของ \(\left(\dfrac{${p}}{${q}}\right)^{-${k}}\)`, answer: num / den, prob: true, ph: PH, show: den === 1 ? String(num) : num + '/' + den, hint: r`เลขชี้กำลังติดลบ ให้กลับเศษส่วนเป็นส่วนกลับ แล้วเปลี่ยนเลขชี้กำลังเป็นบวก`,
      why: r`\(\left(\dfrac{${p}}{${q}}\right)^{-${k}}=\left(\dfrac{${q}}{${p}}\right)^{${k}}=${frac(num, den)}\)`, verify: () => Math.pow(p / q, -k) });
  }
  function qFracBaseFrac(R) {
    const n = R.int(2, 3), [s, t] = R.pick([[2, 3], [3, 2], [2, 5], [3, 4], [1, 2], [4, 3], [5, 2]]), m = R.int(1, 3);
    const B1 = Math.pow(s, n), B2 = Math.pow(t, n), sign = R.pick([-1, 1]);
    const num = sign < 0 ? Math.pow(t, m) : Math.pow(s, m), den = sign < 0 ? Math.pow(s, m) : Math.pow(t, m);
    return Q.fill({ q: r`หาค่าของ \(\left(\dfrac{${B1}}{${B2}}\right)^{${sign < 0 ? '-' : ''}\frac{${m}}{${n}}}\)`, answer: num / den, prob: true, ph: PH, show: den === 1 ? String(num) : num + '/' + den,
      hint: r`เขียนตัวเศษและตัวส่วนเป็นเลขยกกำลังที่มีเลขชี้กำลัง ${n} แล้วใช้ \((a^{m})^{n}=a^{mn}\)${sign < 0 ? ' และกลับเศษส่วนเมื่อเลขชี้กำลังติดลบ' : ''}`,
      why: r`\(\dfrac{${B1}}{${B2}}=\left(\dfrac{${s}}{${t}}\right)^{${n}}\) จึง \(\left(\dfrac{${B1}}{${B2}}\right)^{${sign < 0 ? '-' : ''}\frac{${m}}{${n}}}=\left(\dfrac{${s}}{${t}}\right)^{${sign < 0 ? '-' : ''}${m}}=${frac(num, den)}\)`, verify: () => Math.pow(B1 / B2, (sign * m) / n) });
  }
  function qSameBase(R) {
    for (let g = 0; g < 100; g++) {
      const b = R.pick([2, 3]), pw = b === 2 ? [[2, 1], [4, 2], [8, 3]] : [[3, 1], [9, 2], [27, 3]];
      const [bx, ex] = R.pick(pw.slice(1)), [by, ey] = R.pick(pw), [bz, ez] = R.pick(pw.slice(1));
      const x = R.int(2, 6), y = R.int(1, 4), z = R.int(1, 4);
      const e = x + ex * y - ez * z;
      if (e === 0 || e < -4 || e > 6) continue;
      const num = e >= 0 ? Math.pow(b, e) : 1, den = e >= 0 ? 1 : Math.pow(b, -e);
      return Q.fill({ q: r`หาค่าของ \(\dfrac{${b}^{${x}}\cdot ${bx}^{${y}}}{${bz}^{${z}}}\)`, answer: num / den, prob: true, ph: PH, show: den === 1 ? String(num) : '1/' + den, hint: r`เขียนทุกจำนวนเป็นเลขยกกำลังที่มีฐาน ${b} แล้วใช้สมบัติคูณและหาร`,
        why: r`\(${bx}=${b}^{${ex}}\) และ \(${bz}=${b}^{${ez}}\) · \(\dfrac{${b}^{${x}}\cdot ${b}^{${ex * y}}}{${b}^{${ez * z}}}=${b}^{${x}+${ex * y}-${ez * z}}=${b}^{${e}}=${frac(num, den)}\)`, verify: () => (Math.pow(b, x) * Math.pow(bx, y)) / Math.pow(bz, z) });
    }
    return qPosFrac(R);
  }

  /* ---------- ด่าน 3 : ถูกหรือผิด ---------- */
  function tfPool(R) {
    const a = R.int(2, 5), b = R.int(2, 5), bb = R.pick([2, 3, 5]), [m, n] = R.pick([[3, 2], [4, 3], [5, 2], [5, 3]]), s = R.pick([2, 3]), k = R.int(2, 3);
    const T = [
      { t: r`${bb}^{${m}}\cdot ${bb}^{${n}}=${bb}^{${m + n}}`, l: Math.pow(bb, m) * Math.pow(bb, n), rr: Math.pow(bb, m + n), w: r`คูณฐานเดียวกัน บวกเลขชี้กำลัง: \(${bb}^{${m}+${n}}=${bb}^{${m + n}}\)` },
      { t: r`\left(${bb}^{${m}}\right)^{${n}}=${bb}^{${m * n}}`, l: Math.pow(Math.pow(bb, m), n), rr: Math.pow(bb, m * n), w: r`ยกกำลังซ้อน คูณเลขชี้กำลัง: \(${m}\times ${n}=${m * n}\)` },
      { t: r`(${a}\cdot ${b})^{${k}}=${a}^{${k}}\cdot ${b}^{${k}}`, l: Math.pow(a * b, k), rr: Math.pow(a, k) * Math.pow(b, k), w: r`ยกกำลังของผลคูณ เท่ากับผลคูณของการยกกำลังแต่ละตัว` },
      { t: r`${Math.pow(s, 3)}^{\frac{1}{3}}=${s}`, l: Math.pow(Math.pow(s, 3), 1 / 3), rr: s, w: r`\(${Math.pow(s, 3)}^{\frac{1}{3}}=\sqrt[3]{${Math.pow(s, 3)}}=${s}\)` },
      { t: r`${bb}^{0}=1`, l: 1, rr: 1, w: r`จำนวนที่ไม่เป็นศูนย์ยกกำลัง 0 ได้ 1` },
      { t: r`\dfrac{${bb}^{${m}}}{${bb}^{${n}}}=${bb}^{${m - n}}`, l: Math.pow(bb, m) / Math.pow(bb, n), rr: Math.pow(bb, m - n), w: r`หารฐานเดียวกัน ลบเลขชี้กำลัง` },
    ];
    const F = [
      { t: r`(${a}+${b})^{2}=${a}^{2}+${b}^{2}`, l: Math.pow(a + b, 2), rr: a * a + b * b, w: r`ซ้าย \(=${Math.pow(a + b, 2)}\) แต่ขวา \(=${a * a + b * b}\) · \((a+b)^{2}=a^{2}+2ab+b^{2}\) ไม่ใช่ \(a^{2}+b^{2}\)` },
      { t: r`${bb}^{${m}}\cdot ${bb}^{${n}}=${bb}^{${m * n}}`, l: Math.pow(bb, m) * Math.pow(bb, n), rr: Math.pow(bb, m * n), w: r`คูณฐานเดียวกันต้อง<b>บวก</b>เลขชี้กำลัง: \(${bb}^{${m + n}}\) ไม่ใช่ \(${bb}^{${m * n}}\)` },
      { t: r`\left(${bb}^{${m}}\right)^{${n}}=${bb}^{${m + n}}`, l: Math.pow(Math.pow(bb, m), n), rr: Math.pow(bb, m + n), w: r`ยกกำลังซ้อนต้อง<b>คูณ</b>เลขชี้กำลัง: \(${bb}^{${m * n}}\)` },
      { t: r`\sqrt{${a}^{2}+${b}^{2}}=${a}+${b}`, l: Math.sqrt(a * a + b * b), rr: a + b, w: r`ซ้าย \(=\sqrt{${a * a + b * b}}\approx ${Math.sqrt(a * a + b * b).toFixed(2)}\) ส่วนขวา \(=${a + b}\) · รากที่สองของผลบวกไม่เท่ากับผลบวกของราก` },
      { t: r`${bb}^{-${k}}=-${bb}^{${k}}`, l: Math.pow(bb, -k), rr: -Math.pow(bb, k), w: r`เลขชี้กำลังติดลบหมายถึงส่วนกลับ: \(${bb}^{-${k}}=\dfrac{1}{${bb}^{${k}}}\) ไม่ใช่จำนวนลบ` },
      { t: r`${bb}^{0}=0`, l: 1, rr: 0, w: r`\(${bb}^{0}=1\)` },
      { t: r`${Math.pow(s, 3)}^{\frac{1}{3}}=\dfrac{${Math.pow(s, 3)}}{3}`, l: s, rr: Math.pow(s, 3) / 3, w: r`เลขชี้กำลัง \(\frac{1}{3}\) หมายถึงรากที่สาม: \(\sqrt[3]{${Math.pow(s, 3)}}=${s}\) ไม่ใช่การหารด้วย 3` },
      { t: r`\dfrac{${bb}^{${m}}}{${bb}^{${n}}}=${bb}^{\frac{${m}}{${n}}}`, l: Math.pow(bb, m) / Math.pow(bb, n), rr: Math.pow(bb, m / n), w: r`หารฐานเดียวกันต้อง<b>ลบ</b>เลขชี้กำลัง: \(${bb}^{${m - n}}\)` },
    ];
    return { T, F };
  }
  function qTF(R) {
    const { T, F } = tfPool(R);
    const items = R.sample(T, 2).map((x) => ({ ...x, truth: true })).concat(R.sample(F, 2).map((x) => ({ ...x, truth: false })));
    return R.shuffle(items).map((it) => Q.tf({ q: r`ข้อความต่อไปนี้ถูกหรือผิด<div class="rulebox center">\(${it.t}\)</div>`, answer: it.truth, why: it.w,
      verify: () => (Math.abs(it.l - it.rr) < 1e-9 * Math.max(1, Math.abs(it.l)) ? 0 : 1) }));
  }

  window.HW = {
    id: 'HW-08', unit: 3, unitName: 'หน่วยที่ 3 ฟังก์ชันเอกซ์โพเนนเชียลและฟังก์ชันลอการิทึม', title: 'ทบทวนเลขยกกำลังและรากที่ n',
    sub: 'จับคู่นิพจน์ที่เท่ากัน หาค่าของเลขยกกำลังที่มีเลขชี้กำลังเป็นเศษส่วนและเลขชี้กำลังติดลบ และตรวจจับข้อผิดพลาดที่พบบ่อย',
    size: '11 ข้อ · 12 นาที', K: 2, P: 0, reviewFile: '3.1_ทบทวนเลขยกกำลังและรากที่n.html',
    levels: [
      { short: 'ด่าน 1', title: 'ด่าน 1 · นิพจน์เทียบเท่า', kind: 'K', points: 0.8, skill: 'ใช้สมบัติของเลขยกกำลังและเปลี่ยนรากที่ n เป็นเลขชี้กำลังที่เป็นเศษส่วน', review: 'หัวข้อ 3.1 สมบัติของเลขยกกำลัง · รากที่ n กับเลขชี้กำลังที่เป็นจำนวนตรรกยะ',
        desc: 'ลากการ์ดมาจับคู่นิพจน์ที่เท่ากัน',
        intro: 'ลากการ์ด (หรือแตะการ์ดแล้วแตะช่อง) ไปวางข้างนิพจน์ที่มีค่าเท่ากัน · แต่ละข้อมีการ์ดเกินที่ไม่ตรงกับข้อใด',
        build(R) { return [qLaws(R), qRoots(R)]; } },
      { short: 'ด่าน 2', title: 'ด่าน 2 · หาค่า', kind: 'K', points: 0.8, skill: 'หาค่าเลขยกกำลังที่มีเลขชี้กำลังเป็นเศษส่วน เลขชี้กำลังติดลบ และฐานที่เป็นเศษส่วน', review: 'หัวข้อ 3.1 เลขชี้กำลังที่เป็นจำนวนตรรกยะ',
        desc: 'เลขชี้กำลังเศษส่วน เลขชี้กำลังติดลบ และฐานที่เป็นเศษส่วน',
        intro: 'ตอบเป็น<b>จำนวนเต็ม เศษส่วน (เช่น 9/4) หรือทศนิยม</b> (ถ้าเป็นทศนิยมที่ไม่รู้จบให้ปัดถูกอย่างน้อย 2 ตำแหน่ง) · ผิดครั้งแรกมีคำใบ้ให้ลองใหม่',
        build(R) { return [qPosFrac(R), qNegFrac(R), qFracBaseInt(R), qFracBaseFrac(R), qSameBase(R)]; } },
      { short: 'ด่าน 3', title: 'ด่าน 3 · ถูกหรือผิด', kind: 'K', points: 0.4, skill: 'ตรวจสอบสมบัติของเลขยกกำลังที่มักใช้ผิด', review: 'หัวข้อ 3.1 ข้อควรระวัง: (a + b)ⁿ ≠ aⁿ + bⁿ · คูณบวกเลขชี้กำลัง · ยกกำลังซ้อนคูณเลขชี้กำลัง',
        desc: 'ตัดสินว่าความเท่ากันแต่ละข้อถูกหรือผิด',
        intro: 'ข้อละ 1 ครั้ง (ตอบแล้วดูเฉลยได้ทันที) · ถ้าไม่แน่ใจ ลองแทนค่าตัวเลขดูทั้งสองข้าง',
        build(R) { return qTF(R); } },
    ],
  };
})();
