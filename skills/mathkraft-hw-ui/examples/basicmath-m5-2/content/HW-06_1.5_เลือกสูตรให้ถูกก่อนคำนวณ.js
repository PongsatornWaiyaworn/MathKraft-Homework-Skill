/* HW-06 · 1.5 เลือกสูตรให้ถูกก่อนคำนวณ */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  function P(x) { return x < 0 ? `(${x})` : String(x); }
  function sumTex(terms) {
    let s = String(terms[0]);
    for (let i = 1; i < terms.length; i++) {
      s += (terms[i] < 0 ? ' - ' + (-terms[i]) : ' + ' + terms[i]);
    }
    return s + ' + \\dots';
  }
  function geoTerms(a1, r, k) {
    const t = [];
    for (let i = 0; i < k; i++) t.push(a1 * Math.pow(r, i));
    return t;
  }
  function gsum(a1, r, n) {
    let s = 0, t = a1;
    for (let i = 0; i < n; i++) { s += t; t *= r; }
    return s;
  }

  const F_TEXT = {
    F1: '$S_n = \\dfrac{a_1(1-r^n)}{1-r}$ หรือ $\\dfrac{a_1(r^n-1)}{r-1}$',
    F3: '$S_n = \\dfrac{a_1 - a_n r}{1-r}$',
    F4: '$S_n = n a_1$'
  };

  function mkProblem(R, no, title, promptText, mode, rVal, whyFormula, calcAnswer, calcUnit, calcHint, calcSol) {
    // formula choices: F1, F3, F4
    const choices = [
      { key: 'F1', text: F_TEXT.F1 },
      { key: 'F3', text: F_TEXT.F3 },
      { key: 'F4', text: F_TEXT.F4 }
    ];
    const correctKey = mode === 'direct' ? 'F1' : mode === 'last' ? 'F3' : 'F4';
    const shuffled = R.shuffle(choices);
    const ansIdx = shuffled.findIndex(c => c.key === correctKey);

    return Q.group({
      label: `ข้อ ${no}`,
      story: `<div class="story-tag">${title}</div><p><b>โจทย์:</b> ${promptText}</p>`,
      parts: [
        Q.choice({
          label: 'ขั้นที่ 1: เลือกสูตร',
          q: 'เลือกสูตรที่ใช้คำนวณได้โดยตรงจากสิ่งที่โจทย์กำหนด',
          options: shuffled.map(c => c.text),
          answer: ansIdx,
          shuffle: false,
          hint: 'ดูว่าโจทย์กำหนด $n$ หรือกำหนดพจน์สุดท้าย $a_n$ หรือ $r = 1$',
          why: whyFormula,
          verify: () => ansIdx
        }),
        Q.fill({
          label: 'ขั้นที่ 2: คำนวณคำตอบ',
          q: 'แทนค่าลงในสูตรแล้วคำนวณคำตอบ',
          answer: calcAnswer,
          unit: calcUnit,
          tol: 0.01,
          hint: calcHint,
          why: calcSol,
          verify: () => calcAnswer
        })
      ]
    });
  }

  window.HW = {
    id: 'HW-06', unit: 1, unitName: 'หน่วยที่ 1 ลำดับและอนุกรม', title: 'เลือกสูตรให้ถูกก่อนคำนวณ',
    sub: 'วิเคราะห์สิ่งที่โจทย์กำหนด เลือกสูตรผลบวกอนุกรมเรขาคณิตที่เหมาะสม และคำนวณคำตอบ',
    size: '6 ข้อ · 15 นาที', K: 3, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · คำนวณ Sn เมื่อกำหนดเงื่อนไขต่าง ๆ', kind: 'K', points: 1.5,
        skill: 'เลือกสูตรและคำนวณผลบวกอนุกรมเรขาคณิตเมื่อ r > 1, ทราบ an และ r < 0',
        desc: 'เลือกสูตรและคำนวณคำตอบ 3 ข้อ',
        intro: 'พิจารณาข้อมูลที่โจทย์ให้ก่อนเลือกสูตร',
        build(R) {
          const qs = [];

          // ข้อ 1: Sn เมื่อ r > 1
          {
            const a1 = R.pick([2, 3, 4, 5, 6, 7]);
            const q = R.pick([2, 3, 4]);
            const n = q === 2 ? R.pick([6, 7, 8]) : q === 3 ? R.pick([5, 6]) : R.pick([4, 5]);
            const S = gsum(a1, q, n);
            const t = geoTerms(a1, q, 3);
            const why = `ทราบ $a_1 = ${a1}$, $r = ${q}$ และ $n = ${n}$ ครบ จึงใช้สูตรที่มี $a_1, r, n$ ได้โดยตรง: $S_n = \\frac{a_1(r^n-1)}{r-1}$`;

            qs.push(mkProblem(
              R, 1, 'หา $S_n$ เมื่อ $r > 1$',
              `จงหา $S_{${n}}$ ของอนุกรมเรขาคณิต $${sumTex(t)}$`,
              'direct', q, why, S, '',
              'ใช้สูตร $S_n = \\frac{a_1(r^n-1)}{r-1}$',
              `$a_1 = ${a1}, r = ${q}, n = ${n}$<br>$S_{${n}} = \\frac{${a1}(${q}^{${n}}-1)}{${q}-1} = <b>${S}</b>$`
            ));
          }

          // ข้อ 2: 0 < r < 1 และทราบพจน์สุดท้าย
          {
            const q = R.pick([2, 3, 4]);
            const c = R.pick([1, 2, 3, 5]);
            const m = q === 2 ? R.int(4, 7) : R.int(3, 5);
            const a1 = c * Math.pow(q, m), last = c;
            let S = 0;
            for (let i = 0; i <= m; i++) S += c * Math.pow(q, i);
            const t = [a1, a1 / q, a1 / (q * q)];
            const why = `โจทย์ให้พจน์สุดท้าย $a_n = ${last}$ แต่ไม่บอก $n$ สูตร $S_n = \\frac{a_1 - a_n r}{1-r}$ จึงคำนวณได้โดยตรงโดยไม่ต้องหา $n$ ก่อน`;

            qs.push(mkProblem(
              R, 2, 'หา $S_n$ เมื่อทราบพจน์สุดท้าย',
              `จงหาผลบวกของอนุกรมเรขาคณิต $${sumTex(t).replace(' + \\dots', ' + \\dots + ' + last)}$`,
              'last', `1/${q}`, why, S, '',
              `ใช้สูตร $S_n = \\frac{a_1 - a_n r}{1-r}$ เมื่อทราบพจน์สุดท้าย $a_n = ${last}$ และ $r = \\frac{1}{${q}}$`,
              `$a_1 = ${a1}, a_n = ${last}, r = \\frac{1}{${q}}$<br>$S_n = \\frac{${a1} - ${last}(1/${q})}{1 - 1/${q}} = <b>${S}</b>$`
            ));
          }

          // ข้อ 3: r < 0
          {
            const a1 = R.pick([1, 2, 3, 4]);
            const q = R.pick([-2, -3]);
            const n = q === -2 ? R.pick([6, 7, 8]) : R.pick([5, 6]);
            const S = gsum(a1, q, n);
            const t = geoTerms(a1, q, 4);
            const why = `ทราบ $a_1 = ${a1}$, $r = ${q}$ (ติดลบ) และ $n = ${n}$ ครบ จึงใช้สูตร $S_n = \\frac{a_1(1-r^n)}{1-r}$`;

            qs.push(mkProblem(
              R, 3, 'หา $S_n$ เมื่อ $r < 0$',
              `จงหา $S_{${n}}$ ของอนุกรมเรขาคณิต $${sumTex(t)}$`,
              'direct', q, why, S, '',
              'ระวังเครื่องหมายลบเมื่อยกกำลัง $r^n$',
              `$a_1 = ${a1}, r = ${q}, n = ${n}$<br>$S_{${n}} = \\frac{${a1}(1-(${q})^{${n}})}{1-(${q})} = <b>${S}</b>$`
            ));
          }

          return qs;
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · หา n, r = 1 และหา a1 จากผลบวก', kind: 'K', points: 1.5,
        skill: 'เลือกสูตรและคำนวณหาจำนวนพจน์, ผลบวกกรณี r = 1 และพจน์แรก a1',
        desc: 'เลือกสูตรและคำนวณคำตอบ 3 ข้อ',
        intro: 'พิจารณาข้อมูลที่โจทย์ให้ก่อนเลือกสูตร',
        build(R) {
          const qs = [];

          // ข้อ 4: หา n จากผลบวก
          {
            const a1 = R.pick([1, 2, 3, 4]);
            const q = R.pick([2, 3]);
            const n = q === 2 ? R.int(5, 8) : R.int(4, 6);
            const S = gsum(a1, q, n);
            const t = geoTerms(a1, q, 3);
            const why = `ทราบ $a_1 = ${a1}, r = ${q}$ และ $S_n = ${S}$ แต่ไม่ทราบ $n$ จึงใช้สูตร $S_n = \\frac{a_1(r^n-1)}{r-1}$ ตั้งสมการแก้หา $n$`;

            qs.push(mkProblem(
              R, 4, 'หาจำนวนพจน์ $n$ จากผลบวก',
              `อนุกรมเรขาคณิต $${sumTex(t)}$ มีผลบวกเท่ากับ <b>${S}</b> อนุกรมนี้มีกี่พจน์`,
              'direct', q, why, n, 'พจน์',
              `ตั้งสมการ $\\frac{${a1}(${q}^n-1)}{${q}-1} = ${S}$ แล้วแก้หา $n$`,
              `$\\frac{${a1}(${q}^n-1)}{${q}-1} = ${S} \\Rightarrow ${q}^n - 1 = ${S * (q - 1) / a1} \\Rightarrow ${q}^n = ${Math.pow(q, n)} \\Rightarrow n = <b>${n}</b>$ พจน์`
            ));
          }

          // ข้อ 5: r = 1
          {
            const a1 = R.int(4, 12);
            const n = R.int(15, 30);
            const S = a1 * n;
            const why = `เมื่อ $r = 1$ ทุกพจน์เท่ากับ $a_1 = ${a1}$ ตัวส่วน $1-r = 0$ หารไม่ได้ ต้องใช้สูตร $S_n = n a_1$`;

            qs.push(mkProblem(
              R, 5, 'แทนค่าในสูตรเมื่อ $r = 1$',
              `อนุกรมเรขาคณิตมี $a_1 = ${a1}$ และอัตราส่วนร่วม $r = 1$ จงหาผลบวก $S_{${n}}$`,
              'one', 1, why, S, '',
              'เมื่อ $r = 1$ ทุกพจน์มีค่าเท่ากัน ใช้สูตร $S_n = n a_1$',
              `$S_{${n}} = ${n} \\times ${a1} = <b>${S}</b>$`
            ));
          }

          // ข้อ 6: หา a1 จากผลบวก
          {
            const a1 = R.int(1, 9);
            const q = R.pick([2, 3, 4]);
            const n = q === 2 ? R.pick([4, 5]) : R.pick([3, 4]);
            const S = gsum(a1, q, n);
            const factor = (Math.pow(q, n) - 1) / (q - 1);
            const why = `ทราบ $r = ${q}, n = ${n}$ และ $S_{${n}} = ${S}$ แต่ไม่ทราบ $a_1$ ใช้สูตร $S_n = \\frac{a_1(r^n-1)}{r-1}$ แล้วแก้สมการหา $a_1$`;

            qs.push(mkProblem(
              R, 6, 'หาพจน์แรก $a_1$ จากผลบวก',
              `อนุกรมเรขาคณิตมีอัตราส่วนร่วม $r = ${q}$ และผลบวก $S_{${n}} = ${S}$ จงหาค่าของ $a_1$`,
              'direct', q, why, a1, '',
              `ตั้งสมการ $S_{${n}} = \\frac{a_1(${q}^{${n}}-1)}{${q}-1} = ${S}$ แล้วแก้หา $a_1$`,
              `$a_1 \\times ${factor} = ${S} \\Rightarrow a_1 = <b>${a1}</b>$`
            ));
          }

          return qs;
        }
      }
    ]
  };
})();
