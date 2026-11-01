/* HW-12 · 3.5 การแก้สมการเอกซ์โพเนนเชียลและสมการลอการิทึม */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const r = String.raw;
  const PH = 'จำนวนเต็ม เศษส่วน หรือทศนิยม';
  const lg = (b, v) => Math.log(v) / Math.log(b);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const sg = (c) => (c < 0 ? '-' : '+') + Math.abs(c);            // +3 / -2
  const lin = (d, c) => (d === 1 ? 'x' : d + 'x') + sg(c);            // 2x-1
  const term = (c, t) => (c < 0 ? '-' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + t; // +2t / -t
  // วิธีหาคำตอบแบบ brute force: คำนวณทั้งสองข้างของสมการจริง แล้วหาจำนวนเต็มที่ทำให้เท่ากัน
  const intRoots = (f, lo, hi) => { const out = []; for (let x = lo; x <= hi; x++) { const v = f(x); if (isFinite(v) && Math.abs(v) < 1e-9) out.push(x); } return out; };

  /* ---------- ด่าน 1 : แก้สมการ ---------- */
  const PM = [[2, [1, 2, 3, 4]], [3, [1, 2, 3]], [5, [1, 2]]];
  function qDirect(R, recip) {
    const [p, ms] = R.pick(PM), m = R.pick(ms), A = Math.pow(p, m), n = R.int(1, p === 2 ? 6 : 4);
    const rhs = recip ? 1 / Math.pow(p, n) : Math.pow(p, n);
    const rhsT = recip ? '\\dfrac{1}{' + Math.pow(p, n) + '}' : String(Math.pow(p, n));
    const ans = (recip ? -n : n) / m;
    return Q.fill({ q: r`จงแก้สมการ \(${A}^{x}=${rhsT}\)`, answer: ans, prob: true, ph: PH,
      hint: r`เขียนทั้งสองข้างให้เป็นเลขยกกำลังที่มีฐาน ${p} เหมือนกัน แล้วเทียบเลขชี้กำลัง`,
      why: r`\(${A}=${p}^{${m}}\)${recip ? r` และ \(\dfrac{1}{${Math.pow(p, n)}}=${p}^{-${n}}\)` : r` และ \(${Math.pow(p, n)}=${p}^{${n}}\)`} · \((${p}^{${m}})^{x}=${p}^{${recip ? '-' : ''}${n}}\) · \(${m}x=${recip ? '-' : ''}${n}\) จึง \(x=${MK.fmt(+ans.toFixed(6))}\)`,
      verify: () => lg(A, rhs) });
  }
  const BASEP = [[8, 4, 3, 2], [4, 8, 2, 3], [16, 8, 4, 3], [8, 2, 3, 1], [4, 2, 2, 1], [9, 27, 2, 3], [27, 9, 3, 2], [9, 3, 2, 1], [25, 5, 2, 1], [16, 4, 4, 2]];
  function qLin(R) {
    for (let t = 0; t < 400; t++) {
      const [A, B, m, n] = R.pick(BASEP), c1 = R.pick([-3, -2, -1, 1, 2, 3]), d = R.pick([1, 2, 3]), c2 = R.pick([-3, -2, -1, 1, 2, 3]);
      const den = m - n * d, num = n * c2 - m * c1;
      if (den === 0 || num % den !== 0) continue;
      const x = num / den; if (Math.abs(x) > 9 || x === 0) continue;
      const p = A === 8 || A === 4 || A === 16 ? 2 : A === 9 || A === 27 ? 3 : 5;
      return Q.fill({ q: r`จงแก้สมการ \(${A}^{${lin(1, c1)}}=${B}^{${lin(d, c2)}}\)`, answer: x,
        hint: r`เขียน ${A} และ ${B} เป็นเลขยกกำลังของ ${p} แล้วเทียบเลขชี้กำลังทั้งสองข้าง`,
        why: r`\((${p}^{${m}})^{${lin(1, c1)}}=(${p}^{${n}})^{${lin(d, c2)}}\) · \(${m}(x${sg(c1)})=${n}(${lin(d, c2)})\) · \(${m}x${m * c1 < 0 ? '-' : '+'}${Math.abs(m * c1)}=${n * d}x${sg(n * c2)}\) จึง \(x=${x}\)`,
        verify: () => { const f = (xx) => Math.pow(A, xx + c1) - Math.pow(B, d * xx + c2); let lo = -30, hi = 30; const sl = f(lo) > 0 ? 1 : -1; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if ((f(mid) > 0 ? 1 : -1) === sl) lo = mid; else hi = mid; } return Math.round((lo + hi) / 2); } });
    }
    throw new Error('qLin failed');
  }
  function qSubBoth(R) {
    const p = R.pick([2, 3]), [i, j] = R.sample([1, 2, 3], 2).sort(), s = Math.pow(p, i), t = Math.pow(p, j);
    const eq = r`${p * p}^{x}-${s + t}\cdot${p}^{x}+${s * t}=0`;
    return Q.fill({ q: r`จงแก้สมการ \(${eq}\) (กรอกคำตอบทุกค่าที่เป็นไปได้ คั่นด้วยจุลภาค)`, set: [i, j], ph: 'คั่นด้วยจุลภาค เช่น 1, 2',
      hint: r`ให้ \(u=${p}^{x}\) จะได้ \(${p * p}^{x}=(${p}^{x})^{2}=u^{2}\) แล้วแก้สมการกำลังสอง จากนั้นแปลง \(u\) กลับเป็น \(x\)`,
      why: r`ให้ \(u=${p}^{x}\): \(u^{2}-${s + t}u+${s * t}=0\) · \((u-${s})(u-${t})=0\) · \(u=${s}\) หรือ \(u=${t}\) · \(${p}^{x}=${s}\to x=${i}\) และ \(${p}^{x}=${t}\to x=${j}\)`,
      verify: () => intRoots((x) => Math.pow(p * p, x) - (s + t) * Math.pow(p, x) + s * t, -4, 8) });
  }
  function qSubReject(R) {
    const p = R.pick([2, 3]), i = R.int(1, p === 2 ? 3 : 2), s = Math.pow(p, i), k = R.pick([1, 2, 3]);
    if (s === k) return qSubReject(R);
    const b = s - k, c = s * k;                    // u^2 - b u - c = 0 → (u-s)(u+k)
    const eq = r`${p * p}^{x}${b === 0 ? '' : b > 0 ? '-' + (b === 1 ? '' : b + '\\cdot') + p + '^{x}' : '+' + (-b === 1 ? '' : -b + '\\cdot') + p + '^{x}'}-${c}=0`;
    return Q.fill({ q: r`จงแก้สมการ \(${eq}\) (กรอกเฉพาะคำตอบที่ใช้ได้)`, answer: i, ph: PH,
      hint: r`ให้ \(u=${p}^{x}\) แก้สมการกำลังสอง แล้วดูว่าค่า \(u\) ใดเป็นไปได้ (\(${p}^{x}\) เป็นลบหรือศูนย์ได้หรือไม่)`,
      why: r`ให้ \(u=${p}^{x}\): \(u^{2}${b === 0 ? '' : (b > 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'u'}-${c}=0\) · \((u-${s})(u+${k})=0\) · \(u=${s}\) หรือ \(u=-${k}\) · เพราะ \(${p}^{x}>0\) เสมอ จึงตัด \(u=-${k}\) ออก · \(${p}^{x}=${s}\) จึง \(x=${i}\)`,
      verify: () => intRoots((x) => Math.pow(p * p, x) - b * Math.pow(p, x) - c, -4, 8)[0] });
  }
  // สมการลอการิทึมที่ต้องตัดรากที่ไม่อยู่ในโดเมน: log_b x + log_b (x−c) = k
  const LOGEQ = [];
  [2, 3, 5].forEach((b) => [1, 2, 3, 4].forEach((k) => { const N = Math.pow(b, k); for (let c = 1; c <= 8; c++) for (let rr = c + 1; rr <= 40; rr++) if (rr * (rr - c) === N) LOGEQ.push({ b, k, c, r: rr, N }); }));
  const LOGEQ_PICK = LOGEQ.filter((e) => e.r - e.c >= 1);
  function qLogEq1(R) {
    const e = R.pick(LOGEQ_PICK), { b, k, c, r: rr, N } = e;
    return Q.fill({ q: r`จงแก้สมการ \(\log_{${b}}x+\log_{${b}}(x-${c})=${k}\) (กรอกเฉพาะคำตอบที่ใช้ได้)`, answer: rr, ph: PH,
      hint: r`รวมล็อกเป็นตัวเดียว แล้วแก้สมการกำลังสอง · อย่าลืมตรวจว่าจำนวนในล็อกต้องมากกว่า 0 ทุกตัว`,
      why: r`\(\log_{${b}}x(x-${c})=${k}\) · \(x(x-${c})=${b}^{${k}}=${N}\) · \(x^{2}-${c}x-${N}=0\) · \((x-${rr})(x+${rr - c})=0\) · \(x=${rr}\) หรือ \(x=-${rr - c}\) · ต้องมี \(x>${c}\) จึงรับเฉพาะ \(x=${rr}\)`,
      verify: () => { const f = (x) => (x > 0 && x - c > 0 ? lg(b, x) + lg(b, x - c) - k : NaN); const out = []; for (let x = -50; x <= 80; x++) { const v = f(x); if (isFinite(v) && Math.abs(v) < 1e-9) out.push(x); } return out.length === 1 ? out[0] : -999; } });
  }
  function qLogSingle(R) {
    for (;;) {
      const b = R.pick([2, 3, 5]), k = R.int(1, b === 2 ? 4 : 2), a = R.pick([2, 3]), x0 = R.int(2, 8), c = Math.pow(b, k) - a * x0;
      if (c === 0 || Math.abs(c) > 20) continue;
      return Q.fill({ q: r`จงแก้สมการ \(\log_{${b}}(${a}x${sg(c)})=${k}\)`, answer: x0, ph: PH,
        hint: r`เขียนเป็นรูปเลขชี้กำลัง: \(${a}x${sg(c)}=${b}^{${k}}\)`,
        why: r`\(\log_{${b}}(${a}x${sg(c)})=${k}\iff ${a}x${sg(c)}=${b}^{${k}}=${Math.pow(b, k)}\) จึง \(${a}x=${Math.pow(b, k) - c}\) ได้ \(x=${x0}\) (ตรวจแล้ว \(${a}(${x0})${sg(c)}=${Math.pow(b, k)}>0\))`,
        verify: () => { const out = []; for (let x = -50; x <= 80; x++) { const arg = a * x + c; if (arg > 0 && Math.abs(lg(b, arg) - k) < 1e-9) out.push(x); } return out.length === 1 ? out[0] : -999; } });
    }
  }
  function qLogEqual(R) {
    const b = R.pick([2, 3, 5, 10]), x0 = R.int(2, 7), u = R.int(1, 2 * x0 - 1), v = 2 * x0 - u;
    return Q.fill({ q: r`จงแก้สมการ \(\log_{${b}}(x+${u})=\log_{${b}}(3x-${v})\)`, answer: x0, ph: PH,
      hint: r`ฟังก์ชันลอการิทึมเป็นฟังก์ชันหนึ่งต่อหนึ่ง จึงให้จำนวนในล็อกสองข้างเท่ากันได้ (แล้วตรวจเงื่อนไขว่าจำนวนในล็อกมากกว่า 0)`,
      why: r`\(x+${u}=3x-${v}\) · \(${u + v}=2x\) · \(x=${x0}\) · ตรวจ: \(x+${u}=${x0 + u}>0\) และ \(3x-${v}=${3 * x0 - v}>0\) จึงใช้ได้`,
      verify: () => { const out = []; for (let x = -50; x <= 80; x++) { const a1 = x + u, a2 = 3 * x - v; if (a1 > 0 && a2 > 0 && Math.abs(lg(b, a1) - lg(b, a2)) < 1e-9) out.push(x); } return out.length === 1 ? out[0] : -999; } });
  }

  /* ---------- ด่าน 2 : จับผิดวิธีทำ ---------- */
  const CAUSES = ['ใช้สมบัติผลบวกผิด (ล็อกบวกล็อก ต้องคูณจำนวนภายใน)', 'ไม่ตรวจเงื่อนไขของโดเมน (จำนวนในล็อกต้อง > 0)', 'คำนวณเลขคณิตผิด', 'ลืมแปลง u กลับเป็น x'];
  function causes(R, right) { const idx = R.shuffle(CAUSES.map((_, i) => i)); return { list: idx.map((i) => CAUSES[i]), right: idx.indexOf(right) }; }
  function eFindDomain(R) {
    const e = R.pick(LOGEQ_PICK), { b, k, c, r: rr, N } = e, cs = causes(R, 1);
    return Q.find({ q: r`<b>โจทย์:</b> จงแก้สมการ \(\log_{${b}}x+\log_{${b}}(x-${c})=${k}\)<br><b>วิธีทำของเพื่อนคนหนึ่ง</b> (มีบรรทัดที่ผิด 1 บรรทัด)`,
      lines: [r`\(\log_{${b}}x+\log_{${b}}(x-${c})=\log_{${b}}x(x-${c})=${k}\)`, r`\(x(x-${c})=${b}^{${k}}=${N}\) ได้ \(x^{2}-${c}x-${N}=0\)`, r`\((x-${rr})(x+${rr - c})=0\) จึง \(x=${rr}\) หรือ \(x=-${rr - c}\)`, r`ดังนั้น คำตอบคือ \(x=${rr}\) และ \(x=-${rr - c}\)`],
      wrong: 3, causes: cs.list, cause: cs.right, fix: { answer: rr }, fixLabel: r`คำตอบของสมการนี้ที่ใช้ได้คือ \(x=\) อะไร`, hint: r`ลองแทน \(x=-${rr - c}\) ลงใน \(\log_{${b}}x\) ดูว่าหาค่าได้หรือไม่`,
      why: r`ต้องมี \(x>0\) และ \(x-${c}>0\) จึงต้องมี \(x>${c}\) · ค่า \(x=-${rr - c}\) ทำให้ \(\log_{${b}}x\) หาค่าไม่ได้ จึงตัดทิ้ง เหลือ \(x=${rr}\)`,
      verify: () => { const out = []; for (let x = -50; x <= 80; x++) { if (x > 0 && x - c > 0 && Math.abs(lg(b, x) + lg(b, x - c) - k) < 1e-9) out.push(x); } return out.length === 1 ? out[0] : -999; }, answer: rr });
  }
  function eFindAdd(R) {
    const rr = R.int(2, 7), c = R.int(1, 5), b = R.pick([2, 3, 5, 10]), N = rr * (rr + c), cs = causes(R, 0);
    const wrongX = (N - c) / 2;
    return Q.find({ q: r`<b>โจทย์:</b> จงแก้สมการ \(\log_{${b}}x+\log_{${b}}(x+${c})=\log_{${b}}${N}\)<br><b>วิธีทำของเพื่อนคนหนึ่ง</b> (มีบรรทัดที่ผิด 1 บรรทัด)`,
      lines: [r`โดเมนของสมการ คือ \(x>0\) (เพราะ \(x>0\) และ \(x+${c}>0\))`, r`\(\log_{${b}}x+\log_{${b}}(x+${c})=\log_{${b}}${N}\) ได้ \(x+(x+${c})=${N}\)`, r`\(2x+${c}=${N}\) จึง \(x=${Number.isInteger(wrongX) ? wrongX : '\\dfrac{' + (N - c) + '}{2}'}\)`, r`ตรวจแล้ว \(x>0\) จึงรับคำตอบ`],
      wrong: 1, causes: cs.list, cause: cs.right, fix: { answer: rr }, fixLabel: r`คำตอบที่ถูกต้องของสมการนี้คือ \(x=\) อะไร`, hint: r`ล็อกสองตัวบวกกัน จะรวมเป็นล็อกของ "ผลบวก" หรือ "ผลคูณ" ของจำนวนภายใน`,
      why: r`\(\log_{${b}}x+\log_{${b}}(x+${c})=\log_{${b}}x(x+${c})\) จึงต้องได้ \(x(x+${c})=${N}\) · \(x^{2}+${c}x-${N}=0\) · \((x-${rr})(x+${rr + c})=0\) · \(x=${rr}\) (ตัด \(x=-${rr + c}\) เพราะ \(x>0\))`,
      verify: () => { const out = []; for (let x = -50; x <= 80; x++) { if (x > 0 && Math.abs(lg(b, x) + lg(b, x + c) - lg(b, N)) < 1e-9) out.push(x); } return out.length === 1 ? out[0] : -999; }, answer: rr });
  }
  function eFindRevert(R) {
    const p = R.pick([2, 3]), [i, j] = R.sample([1, 2, 3], 2).sort(), s = Math.pow(p, i), t = Math.pow(p, j), cs = causes(R, 3);
    return Q.find({ q: r`<b>โจทย์:</b> จงแก้สมการ \(${p * p}^{x}-${s + t}\cdot${p}^{x}+${s * t}=0\)<br><b>วิธีทำของเพื่อนคนหนึ่ง</b> (มีบรรทัดที่ผิด 1 บรรทัด)`,
      lines: [r`ให้ \(u=${p}^{x}\) จะได้ \(${p * p}^{x}=u^{2}\)`, r`สมการเป็น \(u^{2}-${s + t}u+${s * t}=0\) จึง \((u-${s})(u-${t})=0\)`, r`ดังนั้น \(u=${s}\) หรือ \(u=${t}\) (ทั้งสองค่าเป็นบวก ใช้ได้)`, r`ดังนั้น คำตอบของสมการคือ \(x=${s}\) และ \(x=${t}\)`],
      wrong: 3, causes: cs.list, cause: cs.right, fix: { set: [i, j] }, fixLabel: r`คำตอบทั้งหมดของ \(x\) คืออะไร (คั่นด้วยจุลภาค)`, hint: r`\(u\) ไม่ใช่ \(x\) · ต้องแก้ \(${p}^{x}=${s}\) และ \(${p}^{x}=${t}\) อีกครั้ง`,
      why: r`\(u=${p}^{x}\) จึงต้องแก้ \(${p}^{x}=${s}\) ได้ \(x=${i}\) และ \(${p}^{x}=${t}\) ได้ \(x=${j}\) ไม่ใช่ตอบค่า \(u\) เป็น \(x\)`,
      verify: () => intRoots((x) => Math.pow(p * p, x) - (s + t) * Math.pow(p, x) + s * t, -4, 8).join(','), answer: i + ',' + j });
  }

  window.HW = {
    id: 'HW-12', unit: 3, unitName: 'หน่วยที่ 3 ฟังก์ชันเอกซ์โพเนนเชียลและฟังก์ชันลอการิทึม', title: 'การแก้สมการเอกซ์โพเนนเชียลและสมการลอการิทึม',
    sub: 'แก้สมการโดยทำฐานให้เท่ากัน ตั้งตัวแปรใหม่ แก้สมการลอการิทึมพร้อมตรวจคำตอบ และจับผิดวิธีทำที่พบบ่อย',
    size: '11 ข้อ · 25 นาที', K: 3, P: 1, reviewFile: '3.5_การแก้สมการเอกซ์โพเนนเชียลและลอการิทึม.html',
    levels: [
      { short: 'ด่าน 1', title: 'ด่าน 1 · แก้สมการ', kind: 'K', points: 3, skill: 'แก้สมการเอกซ์โพเนนเชียลโดยทำฐานให้เท่ากันหรือตั้งตัวแปรใหม่ และแก้สมการลอการิทึมพร้อมตรวจเงื่อนไขของโดเมน', review: 'หัวข้อ 3.5.1 สมการเอกซ์โพเนนเชียล · 3.5.2 สมการลอการิทึม (ต้องตรวจคำตอบ)',
        desc: 'แก้สมการเอกซ์โพเนนเชียลและสมการลอการิทึม',
        intro: 'ตอบเป็นจำนวนเต็ม เศษส่วน หรือทศนิยม · โจทย์ที่ได้มากกว่า 1 คำตอบให้คั่นด้วยจุลภาค · <b>สมการลอการิทึมให้กรอกเฉพาะคำตอบที่ใช้ได้</b> (ตรวจว่าจำนวนในล็อกมากกว่า 0) · ผิดครั้งแรกมีคำใบ้ให้ลองใหม่',
        build(R) { return [qDirect(R, false), qDirect(R, true), qLin(R), qSubBoth(R), qSubReject(R), qLogSingle(R), qLogEqual(R), qLogEq1(R)]; } },
      { short: 'ด่าน 2', title: 'ด่าน 2 · จับผิดวิธีทำ', kind: 'P', points: 1, skill: 'ตรวจสอบวิธีทำ ระบุบรรทัดที่ผิดและสาเหตุ และแก้ให้ถูกต้อง (สมบัติลอการิทึม โดเมน และการแปลงกลับจากตัวแปรใหม่)', review: 'หัวข้อ 3.5 ข้อควรระวัง: ตรวจคำตอบของสมการลอการิทึม และการแปลงกลับจากตัวแปรใหม่',
        desc: 'หาบรรทัดที่ผิด เลือกสาเหตุ และกรอกคำตอบที่ถูกต้อง 3 ข้อ',
        intro: 'แต่ละข้อมีบรรทัดที่ผิดเพียง 1 บรรทัด · ทำ 3 ขั้น: คลิกบรรทัดที่ผิด → เลือกสาเหตุ → กรอกคำตอบที่ถูกต้อง แล้วกดตรวจ',
        build(R) { return [eFindDomain(R), eFindAdd(R), eFindRevert(R)]; } },
    ],
  };
})();
