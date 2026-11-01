/* HW-02 · 1.2 การเรียงสับเปลี่ยน */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q, bf = MK.bf;
  const r = String.raw;
  const F = MK.fact, P = MK.nPr;
  const NAMES = ['กานต์', 'มิน', 'ฝน', 'เจ', 'ภูมิ', 'นุ่น', 'ต้น', 'ใบเตย', 'พีท', 'แพร', 'บิ๊ก', 'ข้าวฟ่าง'];

  /* ---------- level 1 : factorial ladder ---------- */
  function qFact(R) {
    const n = R.int(6, 9);
    return Q.fill({ q: r`หาค่าของ \(${n}!\)`, answer: F(n), hint: r`\(n!=n\times(n-1)\times\cdots\times 2\times 1\)`, why: r`\(${n}!=${Array.from({ length: n }, (_, i) => n - i).join('\\times ')}=${MK.fmt(F(n))}\)`,
      verify: () => { let x = 1; for (let i = 1; i <= n; i++) x *= i; return x; } });
  }
  function qRatio(R) {
    const n = R.int(8, 12), k = R.int(2, 4);
    return Q.fill({ q: r`หาค่าของ \(\dfrac{${n}!}{${n - k}!}\)`, answer: P(n, k), hint: r`เขียน \(${n}!\) ให้เหลือถึง \(${n - k}!\) แล้วตัดกับตัวส่วน`,
      why: r`\(\dfrac{${n}!}{${n - k}!}=${Array.from({ length: k }, (_, i) => n - i).join('\\times ')}=${MK.fmt(P(n, k))}\)`,
      verify: () => F(n) / F(n - k) });
  }
  function qPodium(R) {
    const n = R.int(7, 11), nm = R.pick(['ประกวดร้องเพลง', 'แข่งขันตอบปัญหาวิทยาศาสตร์', 'แข่งขันหุ่นยนต์', 'ประกวดเรียงความ']);
    return Q.fill({ q: r`${nm}มีผู้เข้ารอบสุดท้าย <b>${n} คน</b> ต้องประกาศผล “ชนะเลิศ รองชนะเลิศอันดับ 1 และรองชนะเลิศอันดับ 2” ตามลำดับ ผลการประกาศมีได้กี่แบบ`,
      answer: P(n, 3), unit: 'แบบ', hint: r`ตำแหน่งแตกต่างกัน ลำดับสำคัญ — เลือกคนสำหรับตำแหน่งแรกก่อน แล้วลดจำนวนคนที่เหลือทีละ 1`,
      why: r`\(P(${n},3)=${n}\times ${n - 1}\times ${n - 2}=${MK.fmt(P(n, 3))}\) แบบ`,
      verify: () => { let c = 0; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let d = 0; d < n; d++) if (a !== b && b !== d && a !== d) c++; return c; } });
  }
  function qSolveN(R) {
    const n = R.int(6, 15), v = n * (n - 1);
    return Q.fill({ q: r`ถ้า \(P(n,2)=${v}\) จงหาค่า \(n\)`, answer: n, hint: r`\(P(n,2)=n(n-1)\) ลองหาจำนวนเต็มสองจำนวนที่ต่างกัน 1 และคูณกันได้ ${v}`,
      why: r`\(P(n,2)=n(n-1)=${v}\) → \(n=${n}\) เพราะ \(${n}\times ${n - 1}=${v}\)`,
      verify: () => { for (let m = 2; m < 100; m++) if (m * (m - 1) === v) return m; return NaN; } });
  }
  function qZero(R) {
    const a = R.int(5, 8), b = a - R.int(2, 3), c = R.int(3, 5);
    const ans = F(a) / F(b) + F(0) * F(c);
    return Q.fill({ q: r`หาค่าของ \(\dfrac{${a}!}{${b}!}+0!\times ${c}!\)`, answer: ans, hint: r`อย่าลืมว่า \(0!=1\)`,
      why: r`\(\dfrac{${a}!}{${b}!}=${F(a) / F(b)}\) และ \(0!\times ${c}!=1\times ${F(c)}=${F(c)}\) → รวม \(${ans}\)`,
      verify: () => { let x = 1; for (let i = b + 1; i <= a; i++) x *= i; let y = 1; for (let i = 1; i <= c; i++) y *= i; return x + y; } });
  }

  /* ---------- level 2 : repeated letters & conditions ---------- */
  const WORDS = ['SUCCESS', 'COMMITTEE', 'BOOKKEEPER', 'BALLOON', 'LETTER', 'TOMORROW', 'ASSESSMENT', 'MATHEMATICS', 'ENGINEERING', 'PEPPER', 'ACCESS'];
  function qWord(R) {
    const w = R.pick(WORDS), cnt = bf.letterCounts(w);
    const rep = Object.keys(cnt).filter((k) => cnt[k] > 1).map((k) => ({ k, c: cnt[k] }));
    const den = rep.map((x) => x.c).reduce((a, c) => a * F(c), 1);
    const ans = F(w.length) / den;
    return Q.fill({ q: r`จัดเรียงตัวอักษรทั้งหมดของคำว่า <b>${w}</b> (${w.length} ตัว) ได้กี่แบบที่ต่างกัน`, answer: ans, unit: 'แบบ',
      hint: r`ตัวอักษรที่ซ้ำกันสลับที่กันแล้วได้คำเดิม ต้องหารด้วย (จำนวนที่ซ้ำ)! ของแต่ละตัว`,
      why: r`มี ${w.length} ตัว ซ้ำ: ${rep.map((x) => x.k + ' ' + x.c + ' ตัว').join(' , ')}<br>\(\dfrac{${w.length}!}{${rep.map((x) => x.c + '!').join('\\,')}}=${MK.fmt(ans)}\) แบบ`,
      verify: () => bf.distinct(cnt) });
  }
  function qEnd(R) {
    const n = R.int(5, 7), who = R.pick(NAMES), what = R.pick(['วิ่งผลัด', 'ขึ้นรับเหรียญรางวัล', 'ถ่ายรูปแถวเรียง']);
    const ans = 2 * F(n - 1);
    return Q.fill({ q: r`นักกีฬา ${n} คนต่อแถว${what} โดย <b>${who}</b> ต้องอยู่<b>ปลายแถวข้างใดข้างหนึ่ง</b>เท่านั้น (หัวแถวหรือท้ายแถว) จัดแถวได้กี่แบบ`,
      answer: ans, unit: 'แบบ', hint: r`เลือกตำแหน่งให้คนที่มีเงื่อนไขก่อน แล้วจัดคนที่เหลือ`,
      why: r`${who} เลือกปลายแถวได้ 2 แบบ · อีก ${n - 1} คนจัดได้ \(${n - 1}!\) แบบ → \(2\times ${n - 1}!=${MK.fmt(ans)}\)`,
      verify: () => { let c = 0; bf.eachPerm([...Array(n).keys()], (p) => { if (p[0] === 0 || p[n - 1] === 0) c++; }); return c; } });
  }
  function qGroup(R) {
    const b = R.int(3, 4), g = R.int(2, 3), n = b + g;
    const ans = F(b + 1) * F(g);
    return Q.fill({ q: r`นักเรียนชาย <b>${b} คน</b> และหญิง <b>${g} คน</b> ยืนเรียงแถวเดียว โดย<b>นักเรียนหญิงทุกคนต้องยืนติดกัน</b> จัดแถวได้กี่แบบ`,
      answer: ans, unit: 'แบบ', hint: r`มัดนักเรียนหญิงทั้ง ${g} คนเป็น 1 กลุ่ม แล้วนับการจัดกลุ่มกับนักเรียนชาย อย่าลืมสลับที่กันภายในกลุ่ม`,
      why: r`มัดหญิงเป็น 1 กลุ่ม: เรียง ${b} คน + 1 กลุ่ม = ${b + 1} หน่วย → \(${b + 1}!\) · หญิงในกลุ่มสลับกันได้ \(${g}!\)<br>รวม \(${b + 1}!\times ${g}!=${ans}\) แบบ`,
      verify: () => { let c = 0; const arr = [...Array(n).keys()]; // 0..g-1 are girls
        bf.eachPerm(arr, (p) => { const idx = []; p.forEach((x, i) => { if (x < g) idx.push(i); }); if (idx[idx.length - 1] - idx[0] === g - 1) c++; }); return c; } });
  }
  function qCode(R) {
    const v = R.int(2, 3), c = R.int(4, 5), len = R.int(3, 4);
    const V = 'AEI'.slice(0, v).split(''), C = 'BCDFG'.slice(0, c).split('');
    const ans = v * P(v + c - 1, len - 1);
    return Q.fill({ q: r`ใช้ตัวอักษร ${V.concat(C).join(', ')} (สระ ${v} ตัว: ${V.join(', ')} · พยัญชนะ ${c} ตัว) สร้างรหัส <b>${len} ตัวอักษร</b> ที่ไม่ซ้ำกัน โดย<b>ต้องขึ้นต้นด้วยสระ</b> ได้กี่รหัส`,
      answer: ans, unit: 'รหัส', hint: r`เลือกตัวแรกจากสระก่อน แล้วเลือกตัวที่เหลือจากตัวอักษรที่ยังไม่ถูกใช้ ลำดับสำคัญ`,
      why: r`ตัวแรก: ${v} วิธี · อีก ${len - 1} ตำแหน่งจากตัวที่เหลือ ${v + c - 1} ตัว: \(P(${v + c - 1},${len - 1})=${P(v + c - 1, len - 1)}\)<br>รวม \(${v}\times ${P(v + c - 1, len - 1)}=${ans}\) รหัส`,
      verify: () => { let n = 0; bf.eachRPerm(V.concat(C), len, (p) => { if (V.includes(p[0])) n++; }); return n; } });
  }
  function qFirst(R) {
    const b = R.int(2, 4), g = R.int(3, 4), n = b + g;
    const ans = b * F(n - 1);
    return Q.fill({ q: r`ทีมสำรองมีชาย <b>${b} คน</b> หญิง <b>${g} คน</b> ยืนเรียงแถวเดียวตามลำดับการขึ้นเวที โดยคนแรกในแถว<b>ต้องเป็นชาย</b> จัดแถวได้กี่แบบ`,
      answer: ans, unit: 'แบบ', hint: r`เลือกคนแรกก่อน (จากกลุ่มที่กำหนด) แล้วจัดอีก ${n - 1} คนที่เหลือ`,
      why: r`คนแรก: ${b} วิธี · ที่เหลือ ${n - 1} คน: \(${n - 1}!\) แบบ → \(${b}\times ${n - 1}!=${MK.fmt(ans)}\)`,
      verify: () => { let c = 0; bf.eachPerm([...Array(n).keys()], (p) => { if (p[0] < b) c++; }); return c; } });
  }

  /* ---------- level 3 : build the solution ---------- */
  const R1 = ['นับจำนวนวิธีเรียงทั้งหมดโดยไม่สนใจเงื่อนไข', 'นับกรณีที่ “ไม่ต้องการ” (ติดกัน) โดยมัดสองคนเป็น 1 หน่วย', 'สลับที่กันเองภายในกลุ่มที่มัดไว้', 'คำตอบ = ทั้งหมด − กรณีที่ไม่ต้องการ', 'แทนค่าและคำนวณ'];
  function qNotAdj(R) {
    const n = R.int(5, 7);
    const [a, b] = R.sample(NAMES, 2);
    const total = F(n), adj = 2 * F(n - 1), ans = total - adj;
    return Q.order({ q: r`ครู ${n} คนยืนเรียงแถวเดียว โดย <b>${a}</b> และ <b>${b}</b> <b>ต้องไม่ยืนติดกัน</b> จัดแถวได้กี่แบบ — เรียงขั้นตอนวิธีทำให้ถูกต้อง แล้วเลือกเหตุผลของแต่ละขั้น`,
      hint: r`ทำจากจำนวนทั้งหมดก่อน แล้วค่อยตัดกรณีที่ติดกันออก`,
      steps: [
        { html: r`จำนวนวิธีเรียงทั้ง ${n} คนโดยไม่มีเงื่อนไข = \(${n}!=${total}\)`, reason: 0 },
        { html: r`มัด ${a} กับ ${b} เป็น 1 หน่วย เหลือ ${n - 1} หน่วย เรียงได้ \(${n - 1}!=${F(n - 1)}\) วิธี`, reason: 1 },
        { html: r`${a} กับ ${b} สลับที่กันในกลุ่มได้ \(2!\) วิธี → ติดกัน \(=2\times ${F(n - 1)}=${adj}\) วิธี`, reason: 2 },
        { html: r`ไม่ติดกัน = ทั้งหมด − ติดกัน \(=${total}-${adj}\)`, reason: 3 },
        { html: r`ดังนั้นจัดแถวได้ \(${ans}\) แบบ`, reason: 4 },
      ],
      reasons: R1,
      why: r`วิธีคอมพลีเมนต์: ไม่ติดกัน = ทั้งหมด − ติดกัน = \(${n}!-2\times ${n - 1}!=${ans}\)`,
      verify: () => { let c = 0; bf.eachPerm([...Array(n).keys()], (p) => { if (Math.abs(p.indexOf(0) - p.indexOf(1)) !== 1) c++; }); return c; }, answer: ans });
  }
  const R2 = ['ถ้าตัวอักษรต่างกันหมดจะเรียงได้ n! วิธี', 'ตัวที่ซ้ำกันสลับกันแล้วได้ผลเหมือนเดิม จึงนับเกิน ต้องหารออก', 'ใช้สูตรเรียงสับเปลี่ยนเมื่อสิ่งของไม่แตกต่างกันทั้งหมด', 'แทนค่าและคำนวณ'];
  function qWordSteps(R) {
    const w = R.pick(['SUCCESS', 'BALLOON', 'LETTER', 'PEPPER', 'ACCESS', 'TOMORROW']);
    const cnt = bf.letterCounts(w);
    const rep = Object.keys(cnt).filter((k) => cnt[k] > 1).map((k) => ({ k, c: cnt[k] }));
    const n = w.length, den = rep.reduce((a, x) => a * F(x.c), 1), ans = F(n) / den;
    return Q.order({ q: r`หาจำนวนวิธีเรียงตัวอักษรทั้งหมดของคำว่า <b>${w}</b> — เรียงขั้นตอนวิธีทำ แล้วเลือกเหตุผลของแต่ละขั้น`,
      hint: r`คิดว่าถ้าทุกตัวต่างกัน จะเรียงได้เท่าไร แล้วค่อยแก้ให้ตรงกับตัวที่ซ้ำ`,
      steps: [
        { html: r`ถ้าทั้ง ${n} ตัวต่างกันหมด จะเรียงได้ \(${n}!\) วิธี`, reason: 0 },
        { html: r`${rep.map((x) => x.k + ' ซ้ำ ' + x.c + ' ตัว (สลับกันได้ \\(' + x.c + '!\\) แบบที่ได้คำเดิม)').join(' · ')}`, reason: 1 },
        { html: r`จึงใช้ \(\dfrac{${n}!}{${rep.map((x) => x.c + '!').join('\\,')}}\)`, reason: 2 },
        { html: r`คำนวณได้ \(${MK.fmt(ans)}\) วิธี`, reason: 3 },
      ],
      reasons: R2, why: r`จำนวนวิธี \(=\dfrac{${n}!}{${rep.map((x) => x.c + '!').join('\\,')}}=${MK.fmt(ans)}\)`,
      verify: () => bf.distinct(cnt), answer: ans });
  }

  window.HW = {
    id: 'HW-02', unit: 1, unitName: 'หน่วยที่ 1 หลักการนับเบื้องต้น', title: 'การเรียงสับเปลี่ยน',
    sub: 'ไต่บันไดแฟกทอเรียลจากง่ายไปยาก จัดคำที่มีตัวอักษรซ้ำและแถวที่มีเงื่อนไข แล้วฝึกเรียบเรียงวิธีทำให้เป็นขั้นตอนพร้อมเหตุผล',
    size: '12 ข้อ · 20 นาที', K: 3, P: 1, reviewFile: '1.2_การเรียงสับเปลี่ยน.html',
    levels: [
      { short: 'ด่าน 1', title: 'ด่าน 1 · บันไดแฟกทอเรียล', kind: 'K', points: 1.5, skill: 'หาค่าแฟกทอเรียลและจำนวนวิธีเรียงสับเปลี่ยนเชิงเส้น', review: 'หัวข้อ 1.2.1–1.2.2 แฟกทอเรียลและเรียงสับเปลี่ยนเชิงเส้น',
        desc: 'ค่า n! และ P(n, r) ไล่จากง่ายไปยาก ตอบผิดมีคำใบ้',
        intro: 'พิมพ์คำตอบเป็นตัวเลข ถ้าตอบผิดจะมีคำใบ้ให้แก้ใหม่ได้อีก 1 ครั้ง',
        build(R) { return [qFact(R), qRatio(R), qPodium(R), qSolveN(R), qZero(R)]; } },
      { short: 'ด่าน 2', title: 'ด่าน 2 · ตัวซ้ำและเงื่อนไข', kind: 'K', points: 1.5, skill: 'นับการเรียงที่มีตัวซ้ำและมีเงื่อนไข (ติดกัน/ปลายแถว/ขึ้นต้น)', review: 'หัวข้อ 1.2.3 เรียงสับเปลี่ยนเมื่อสิ่งของไม่แตกต่างกันทั้งหมด และตัวอย่างโจทย์มีเงื่อนไข',
        desc: 'คำที่มีตัวอักษรซ้ำ และการจัดแถวที่มีเงื่อนไข',
        intro: 'มีเงื่อนไขตำแหน่งให้ <b>จัดตำแหน่งที่มีเงื่อนไขก่อน</b> แล้วค่อยจัดส่วนที่เหลือ',
        build(R) { return [qWord(R), qEnd(R), qGroup(R), qCode(R), qFirst(R)]; } },
      { short: 'ด่าน 3', title: 'ด่าน 3 · สร้างวิธีทำ', kind: 'P', points: 1, skill: 'เรียบเรียงวิธีทำพร้อมให้เหตุผลในแต่ละขั้น', review: 'ตัวอย่างโจทย์ในหัวข้อ 1.2 ที่ใช้การหักกรณีตรงข้าม และสูตรเมื่อมีสิ่งของซ้ำ',
        desc: 'เรียงขั้นตอนวิธีทำที่สลับกันให้ถูก แล้วเลือกเหตุผลของแต่ละขั้น',
        intro: 'ใช้ปุ่ม ▲ ▼ เรียงขั้นตอนให้ถูกต้อง แล้วเลือกเหตุผลที่ตรงกับแต่ละขั้น (ให้คะแนนตามจำนวนขั้นที่ถูก)',
        build(R) { return [qNotAdj(R), qWordSteps(R)]; } },
    ],
  };
})();
