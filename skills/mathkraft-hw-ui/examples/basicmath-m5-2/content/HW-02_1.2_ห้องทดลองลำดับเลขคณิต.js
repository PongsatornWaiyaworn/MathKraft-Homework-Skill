/* HW-02 · 1.2 ห้องทดลองลำดับเลขคณิต */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  }

  class Fr {
    constructor(n, d = 1) {
      if (d === 0) throw new Error('Division by zero');
      const g = gcd(n, d);
      this.n = (d < 0 ? -n : n) / g;
      this.d = Math.abs(d) / g;
    }
    static of(x) {
      if (x instanceof Fr) return x;
      return new Fr(x, 1);
    }
    add(o) {
      o = Fr.of(o);
      return new Fr(this.n * o.d + o.n * this.d, this.d * o.d);
    }
    sub(o) {
      o = Fr.of(o);
      return new Fr(this.n * o.d - o.n * this.d, this.d * o.d);
    }
    mul(o) {
      o = Fr.of(o);
      return new Fr(this.n * o.n, this.d * o.d);
    }
    div(o) {
      o = Fr.of(o);
      return new Fr(this.n * o.d, this.d * o.n);
    }
    neg() { return new Fr(-this.n, this.d); }
    val() { return this.n / this.d; }
    text() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
    tex() {
      if (this.d === 1) return String(this.n);
      return `\\frac{${this.n}}{${this.d}}`;
    }
  }

  function fmtN(n, d = 1) {
    return Number(n).toFixed(d).replace(/\.0+$/, '');
  }

  function seqTex(terms, dec) {
    return terms.map(t => dec ? fmtN(t.val()) : t.tex()).join(',\\ ') + ',\\ \\dots';
  }

  function arith(a1, d, n) {
    const o = [];
    let c = Fr.of(a1);
    for (let i = 0; i < n; i++) {
      o.push(c);
      c = c.add(d);
    }
    return o;
  }

  function diffs(t) {
    const o = [];
    for (let i = 1; i < t.length; i++) o.push(t[i].sub(t[i - 1]));
    return o;
  }

  function diffTex(t, dec) {
    return diffs(t).map(x => dec ? fmtN(x.val()) : x.tex()).join(',\\ ');
  }

  window.HW = {
    id: 'HW-02', unit: 1, unitName: 'หน่วยที่ 1 ลำดับและอนุกรม', title: 'ห้องทดลองลำดับเลขคณิต',
    sub: 'สำรวจลำดับเลขคณิต ผลต่างร่วม d พจน์ทั่วไป an จำนวนพจน์ และการหาพจน์จากสองพจน์ใด ๆ',
    size: '6 ข้อ · 15 นาที', K: 3, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · จัดกลุ่มลำดับและหา d', kind: 'K', points: 1,
        skill: 'จำแนกลำดับเลขคณิตและหาผลต่างร่วม d',
        desc: 'จัดกลุ่มลำดับเลขคณิตและเลือกระบุผลต่างร่วม d ให้ถูกต้อง',
        intro: 'ลำดับเลขคณิตคือลำดับที่ผลต่างของพจน์ติดกันคงตัวเท่ากันทุกคู่ ($d = a_{n+1} - a_n$)',
        build(R) {
          const cards = [];

          // 4 ลำดับเลขคณิต
          {
            let a = R.int(-5, 12), d = R.pick([2, 3, 4, 5, 6, 7]), t = arith(a, d, 5);
            cards.push({ cat: 'a', terms: t, d: Fr.of(d) });

            a = R.int(15, 45); d = -R.int(2, 7); t = arith(a, d, 5);
            cards.push({ cat: 'a', terms: t, d: Fr.of(d) });

            const dd = R.pick([new Fr(1, 2), new Fr(1, 3), new Fr(1, 4), new Fr(3, 2), new Fr(2, 3), new Fr(3, 4)]);
            const aa = R.pick([Fr.of(0), Fr.of(1), new Fr(1, 2), Fr.of(2), new Fr(1, 4)]);
            t = arith(aa, dd, 5);
            cards.push({ cat: 'a', terms: t, d: dd });

            const tenth = R.pick([3, 4, 6, 7, 9, 11, 12]), a10 = R.int(2, 30);
            t = arith(new Fr(a10, 10), new Fr(tenth, 10), 5);
            cards.push({ cat: 'a', terms: t, d: new Fr(tenth, 10), dec: true });
          }

          // 4 ลำดับที่ไม่เป็นเลขคณิต
          {
            const nonPool = [];
            // เกือบเป็น: ผิดที่พจน์ 4
            {
              const a = R.int(1, 9), d = R.int(2, 6), df = [d, d, d + R.pick([1, 2]), d];
              const t = [Fr.of(a)];
              df.forEach(x => t.push(t[t.length - 1].add(x)));
              nonPool.push({ terms: t, why: 'ผลต่างไม่คงตัว (เกือบเป็นลำดับเลขคณิต แต่พจน์ที่ 4 คลาดไป)' });
            }
            // เกือบเป็น: ผิดที่พจน์ 5
            {
              const a = R.int(10, 30), d = -R.int(2, 5), df = [d, d, d, d - R.pick([1, 2])];
              const t = [Fr.of(a)];
              df.forEach(x => t.push(t[t.length - 1].add(x)));
              nonPool.push({ terms: t, why: 'ผลต่างไม่คงตัว (พจน์ที่ 5 คลาดไปจากแบบรูป)' });
            }
            // เรขาคณิต
            {
              const a = R.int(1, 4), r = R.pick([2, 3]), t = [];
              for (let i = 0; i < 5; i++) t.push(Fr.of(a * Math.pow(r, i)));
              nonPool.push({ terms: t, why: `เป็นลำดับเรขาคณิต (คูณด้วย ${r} ทุกครั้ง) ผลต่างจึงไม่คงตัว` });
            }
            // ผลต่างเพิ่มขึ้นเรื่อย ๆ
            {
              const c = R.int(0, 5), t = [];
              for (let n = 1; n <= 5; n++) t.push(Fr.of(n * n + c));
              nonPool.push({ terms: t, why: 'ผลต่างเพิ่มขึ้นเรื่อย ๆ จึงไม่คงตัว' });
            }

            nonPool.forEach(x => cards.push({ cat: 'b', terms: x.terms, why: x.why }));
          }

          const shuffledCards = R.shuffle(cards);
          shuffledCards.forEach((c, i) => {
            c.id = 'c' + i;
            c.html = '$' + seqTex(c.terms, c.dec) + '$';
            const dtx = diffTex(c.terms, c.dec);
            c.whyText = c.cat === 'a'
              ? 'ผลต่างคงตัว $' + dtx.split(',\\ ')[0] + '$ ทุกคู่ → เป็นลำดับเลขคณิต ($d = ' + (c.dec ? fmtN(c.d.val()) : c.d.tex()) + '$)'
              : 'ผลต่าง $' + dtx + '$ → ' + c.why;
          });

          // ข้อ 1: จัดกลุ่ม
          const q1 = Q.sort({
            label: 'ข้อ 1',
            q: 'ลากการ์ดแต่ละใบไปวางในกลุ่มที่ถูกต้อง (มีลำดับ “เกือบเป็น” ลำดับเลขคณิตแฝงอยู่ ต้องดูผลต่างให้ครบทุกคู่)',
            bins: [
              { id: 'a', label: 'เป็นลำดับเลขคณิต' },
              { id: 'b', label: 'ไม่เป็นลำดับเลขคณิต' }
            ],
            items: shuffledCards.map(c => ({
              html: c.html,
              bin: c.cat,
              why: c.whyText
            })),
            hint: 'ลำดับเลขคณิตต้องมีผลต่างของพจน์ติดกันคงที่เท่ากันทุกคู่',
            why: 'สรุปการตรวจสอบผลต่าง:<br>' + shuffledCards.map(c => `• ${c.html}: ${c.whyText}`).join('<br>')
          });

          // ข้อ 2: หา d จากหนึ่งในลำดับเลขคณิต
          const tgt = R.pick(cards.filter(c => c.cat === 'a'));
          const dTrue = tgt.d;
          const cand = [dTrue.neg(), dTrue.add(1), dTrue.sub(1), dTrue.mul(2), dTrue.div(2), tgt.terms[0], tgt.terms[1]];
          const seen = { [dTrue.text()]: 1 };
          const wrongD = [];
          R.shuffle(cand).forEach(x => {
            const k = x.text();
            if (!seen[k] && wrongD.length < 3) {
              seen[k] = 1;
              wrongD.push(x);
            }
          });

          const dOpts = R.shuffle([
            { k: 'good', h: '$d = ' + (tgt.dec ? fmtN(dTrue.val()) : dTrue.tex()) + '$' },
            ...wrongD.map((x, i) => ({ k: 'w' + i, h: '$d = ' + (tgt.dec ? fmtN(x.val()) : x.tex()) + '$' }))
          ]);
          const ansIdx = dOpts.findIndex(o => o.k === 'good');

          const q2 = Q.choice({
            label: 'ข้อ 2',
            q: `ลำดับ $${seqTex(tgt.terms, tgt.dec)}$ เป็นลำดับเลขคณิต จงหาผลต่างร่วม $d$`,
            options: dOpts.map(o => o.h),
            answer: ansIdx,
            shuffle: false,
            hint: '$d = a_2 - a_1$ (พจน์หลังลบพจน์หน้า) ระวังเครื่องหมาย',
            why: `$d = a_2 - a_1 = ${tgt.dec ? fmtN(tgt.terms[1].val()) + '-' + fmtN(tgt.terms[0].val()) : tgt.terms[1].tex() + '-(' + tgt.terms[0].tex() + ')'} = <b>${tgt.dec ? fmtN(dTrue.val()) : dTrue.tex()}</b>`,
            verify: () => ansIdx
          });

          return [q1, q2];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · คำนวณพจน์และจำนวนพจน์', kind: 'K', points: 2,
        skill: 'คำนวณ an, หาจำนวนพจน์ และหา a1, d จากสองพจน์ใด ๆ',
        desc: 'คำนวณหาค่าพจน์ของลำดับเลขคณิต 4 ข้อ (ข้อละ 0.5 คะแนน)',
        intro: 'ใช้สูตร $a_n = a_1 + (n-1)d$ โดยหา $a_1$ และ $d$ ก่อนเสมอ',
        build(R) {
          const qs = [];

          // ข-1: หา a_n
          {
            const a1 = R.int(-20, 25), d = R.pick([-7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9]);
            const t = arith(a1, d, 4).map(x => x.tex());
            const n = R.pick([25, 30, 35, 40, 45, 50]);
            const ans = a1 + (n - 1) * d;

            qs.push(Q.fill({
              label: 'ข้อ 1',
              q: `จงหา $a_{${n}}$ ของลำดับเลขคณิต $${t.join(',\\ ')},\\ \\dots$`,
              answer: ans, unit: '', tol: 0.01,
              hint: `หา $d$ ก่อน จากนั้นใช้สูตร $a_n = a_1 + (n-1)d$`,
              why: `$a_1 = ${a1}, d = ${d}$<br>$a_{${n}} = ${a1} + (${n} - 1)(${d}) = ${a1} + (${n - 1})(${d}) = <b>${ans}</b>$`,
              verify: () => ans
            }));
          }

          // ข-2: หาจำนวนพจน์
          {
            const a1 = R.int(-15, 30), d = R.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]), n = R.int(22, 85);
            const L = a1 + (n - 1) * d;
            const t = arith(a1, d, 3).map(x => x.tex());

            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `ลำดับเลขคณิต $${t.join(',\\ ')},\\ \\dots,\\ ${L}$ มีทั้งหมดกี่พจน์`,
              answer: n, unit: 'พจน์', tol: 0.01,
              hint: `แทนค่าลงในสมการ $a_n = a_1 + (n-1)d$ โดยให้ $a_n = ${L}$ แล้วแก้หา $n$`,
              why: `$${L} = ${a1} + (n-1)(${d})$<br>$(n-1)(${d}) = ${L - a1}$<br>$n-1 = ${(L - a1) / d}$<br>$n = <b>${n}</b>$ พจน์`,
              verify: () => n
            }));
          }

          // ข-3: หา a1 และ d จากสองพจน์
          {
            const a1 = R.int(-12, 22), d = R.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
            const p = R.pick([3, 4, 5]), q = p + R.pick([3, 4, 5]);
            const ap = a1 + (p - 1) * d, aq = a1 + (q - 1) * d;

            qs.push(Q.fill({
              label: 'ข้อ 3',
              q: `ลำดับเลขคณิตมี $a_{${p}} = ${ap}$ และ $a_{${q}} = ${aq}$ จงหาค่าของ $a_1$ และ $d$`,
              fields: [
                { label: '$a_1 =$', answer: a1, unit: '', tol: 0.01 },
                { label: '$d =$', answer: d, unit: '', tol: 0.01 }
              ],
              hint: `ใช้ $a_q - a_p = (q - p)d$ เพื่อหาค่า $d$ ก่อน แล้วแทนกลับไปหา $a_1$`,
              why: `$a_{${q}} - a_{${p}} = (${q} - ${p})d$<br>$${aq} - (${ap}) = ${q - p}d \\Rightarrow d = <b>${d}</b>$<br>จาก $a_{${p}} = a_1 + (${p}-1)d \\Rightarrow ${ap} = a_1 + ${p - 1}(${d}) \\Rightarrow a_1 = <b>${a1}</b>$`,
              verify: () => [a1, d]
            }));
          }

          // ข-4: นับจำนวนพหุคูณ
          {
            const m = R.pick([6, 7, 8, 11, 12, 13]), lo = R.int(12, 95), hi = R.int(320, 950);
            let cnt = 0;
            for (let x = lo; x <= hi; x++) { if (x % m === 0) cnt++; }
            const first = Math.ceil(lo / m) * m, last = Math.floor(hi / m) * m;

            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `จำนวนนับตั้งแต่ <b>${lo}</b> ถึง <b>${hi}</b> ที่หารด้วย <b>${m}</b> ลงตัว มีทั้งหมดกี่จำนวน`,
              answer: cnt, unit: 'จำนวน', tol: 0.01,
              hint: `หาพหุคูณตัวแรกที่ $\\ge ${lo}$ และตัวสุดท้ายที่ $\\le ${hi}$ แล้วมองเป็นลำดับเลขคณิตที่มี $d = ${m}$`,
              why: `ตัวแรกคือ ${first}, ตัวสุดท้ายคือ ${last}, $d = ${m}$<br>$${last} = ${first} + (n-1)(${m}) \\Rightarrow n = <b>${cnt}</b>$ จำนวน`,
              verify: () => cnt
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
