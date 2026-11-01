/* HW-03 · 1.3 เลขคณิตหรือเรขาคณิต? รอบเร็ว */
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
    eq(o) {
      o = Fr.of(o);
      return this.n === o.n && this.d === o.d;
    }
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

  function ftx(x, dec) { return dec ? fmtN(x.val()) : x.tex(); }
  function seqTex(t, dec) { return t.map(x => ftx(x, dec)).join(',\\ ') + ',\\ \\dots'; }

  function arith(a1, d, n) {
    const o = [];
    let c = Fr.of(a1);
    for (let i = 0; i < n; i++) {
      o.push(c);
      c = c.add(d);
    }
    return o;
  }

  function geo(a1, r, n) {
    const o = [];
    let c = Fr.of(a1);
    for (let i = 0; i < n; i++) {
      o.push(c);
      c = c.mul(r);
    }
    return o;
  }

  function classify(t) {
    const d = t[1].sub(t[0]);
    let isA = d.n !== 0;
    for (let i = 1; i < t.length; i++) {
      if (!t[i].sub(t[i - 1]).eq(d)) isA = false;
    }
    let isG = false;
    if (t.every(x => x.n !== 0)) {
      const r = t[1].div(t[0]);
      isG = !r.eq(1);
      for (let i = 1; i < t.length; i++) {
        if (!t[i].div(t[i - 1]).eq(r)) isG = false;
      }
    }
    return isA && isG ? 'both' : isA ? 'a' : isG ? 'g' : 'n';
  }

  window.HW = {
    id: 'HW-03', unit: 1, unitName: 'หน่วยที่ 1 ลำดับและอนุกรม', title: 'เลขคณิตหรือเรขาคณิต? รอบเร็ว',
    sub: 'จำแนกลำดับเลขคณิตและเรขาคณิต คำนวณพจน์ทั่วไป an จำนวนพจน์ และโจทย์ปัญหามูลค่าลดลง',
    size: '5 ข้อ · 15 นาที', K: 3, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · จำแนกลำดับเลขคณิตและเรขาคณิต', kind: 'K', points: 1,
        skill: 'จำแนกลำดับเลขคณิต ลำดับเรขาคณิต และลำดับที่ไม่ใช่ทั้งสองแบบ',
        desc: 'จัดกลุ่มลำดับลงในถังประเภทให้ถูกต้อง',
        intro: 'ตรวจทั้ง “ผลต่าง” ($a_{n+1} - a_n$) และ “อัตราส่วน” ($a_{n+1}/a_n$) ของพจน์ติดกัน',
        build(R) {
          const items = [];

          // 2 ลำดับเลขคณิต
          {
            const a = R.int(-4, 15), d = R.pick([2, 3, 4, 5, 6, 7]);
            const t = arith(a, d, 5);
            items.push({
              html: '$' + seqTex(t) + '$',
              bin: 'a',
              why: `ผลต่างของพจน์ที่อยู่ติดกันคงตัวเท่ากับ $d = ${d}$ ทุกคู่ → <b>ลำดับเลขคณิต</b>`
            });
          }
          {
            const a = R.int(20, 50), d = -R.int(3, 8);
            const t = arith(a, d, 5);
            items.push({
              html: '$' + seqTex(t) + '$',
              bin: 'a',
              why: `ผลต่างของพจน์ที่อยู่ติดกันคงตัวเท่ากับ $d = ${d}$ ทุกคู่ → <b>ลำดับเลขคณิต</b>`
            });
          }

          // 2 ลำดับเรขาคณิต
          {
            const a = R.int(1, 6), r = R.pick([2, 3, 4]);
            const t = geo(a, r, 5);
            items.push({
              html: '$' + seqTex(t) + '$',
              bin: 'g',
              why: `อัตราส่วนของพจน์ที่อยู่ติดกันคงตัวเท่ากับ $r = ${r}$ ทุกคู่ → <b>ลำดับเรขาคณิต</b>`
            });
          }
          {
            const a = R.pick([1, 2, 3, -1, -2]), r = -R.int(2, 4);
            const t = geo(a, r, 5);
            items.push({
              html: '$' + seqTex(t) + '$',
              bin: 'g',
              why: `อัตราส่วนของพจน์ที่อยู่ติดกันคงตัวเท่ากับ $r = ${r}$ ทุกคู่ → <b>ลำดับเรขาคณิต</b>`
            });
          }

          // 2 ลำดับที่ไม่ใช่ทั้งสองแบบ
          {
            const c = R.int(1, 8);
            const t = [1, 2, 3, 4, 5].map(n => Fr.of(n * n + c));
            items.push({
              html: '$' + seqTex(t) + '$',
              bin: 'n',
              why: 'ผลต่างและอัตราส่วนของพจน์ติดกันไม่คงตัว (เป็นกำลังสอง) → <b>ไม่ใช่ทั้งสองแบบ</b>'
            });
          }
          {
            const a = R.int(2, 6);
            const t = [1, 2, 3, 4, 5].map(n => new Fr(n, n + 1));
            items.push({
              html: '$' + seqTex(t) + '$',
              bin: 'n',
              why: 'ผลต่างและอัตราส่วนไม่คงตัว (เป็นเศษส่วน $\\frac{n}{n+1}$) → <b>ไม่ใช่ทั้งสองแบบ</b>'
            });
          }

          const shuffled = R.shuffle(items);

          return [
            Q.sort({
              label: 'ข้อ 1',
              q: 'ลากการ์ดแต่ละใบไปวางในกลุ่มที่ถูกต้อง: <b>ลำดับเลขคณิต</b>, <b>ลำดับเรขาคณิต</b> หรือ <b>ไม่ใช่ทั้งสองแบบ</b>',
              bins: [
                { id: 'a', label: 'ลำดับเลขคณิต' },
                { id: 'g', label: 'ลำดับเรขาคณิต' },
                { id: 'n', label: 'ไม่ใช่ทั้งสองแบบ' }
              ],
              items: shuffled,
              hint: 'ลำดับเลขคณิต: ผลต่างคงตัว | ลำดับเรขาคณิต: อัตราส่วนคงตัว | อื่น ๆ: ไม่ใช่ทั้งสองแบบ',
              why: shuffled.map(it => `• ${it.html} — ${it.why}`).join('<br>')
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · คำนวณพจน์ของลำดับเรขาคณิต', kind: 'K', points: 2,
        skill: 'คำนวณ an, หาจำนวนพจน์, หา a1 และ r, และประยุกต์โจทย์การลดลงของมูลค่า',
        desc: 'คำนวณหาค่าพจน์ของลำดับเรขาคณิต 4 ข้อ (ข้อละ 0.5 คะแนน)',
        intro: 'ใช้สูตร $a_n = a_1 r^{n-1}$ โดยหา $a_1$ และ $r = \\frac{a_{n+1}}{a_n}$ ก่อนเสมอ',
        build(R) {
          const qs = [];

          // ข-1: หา a_n
          {
            const r = R.pick([2, 3, -2, -3]);
            const a1 = R.pick([1, -1]) * R.int(1, Math.abs(r) === 3 ? 4 : 8);
            const n = Math.abs(r) === 3 ? R.int(5, 7) : R.int(6, 9);
            const t = geo(a1, r, 3).map(x => x.tex());
            const ans = a1 * Math.pow(r, n - 1);

            qs.push(Q.fill({
              label: 'ข้อ 1',
              q: `จงหา $a_{${n}}$ ของลำดับเรขาคณิต $${t.join(',\\ ')},\\ \\dots$`,
              answer: ans, unit: '', tol: 0.01,
              hint: `หาอัตราส่วนร่วม $r = \\frac{a_2}{a_1}$ แล้วใช้สูตร $a_n = a_1 r^{n-1}$`,
              why: `$a_1 = ${a1}, r = ${r}$<br>$a_{${n}} = a_1 r^{${n}-1} = ${a1}(${r})^{${n - 1}} = <b>${ans}</b>$`,
              verify: () => ans
            }));
          }

          // ข-2: หาจำนวนพจน์
          {
            const q = R.pick([2, 3, 5]);
            const n = q === 5 ? R.pick([4, 5]) : q === 3 ? R.pick([5, 6, 7]) : R.pick([6, 7, 8, 9]);
            const a1 = R.int(1, q === 5 ? 3 : 5);
            const L = a1 * Math.pow(q, n - 1);
            const t = geo(a1, q, 3).map(x => x.tex());

            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `ลำดับเรขาคณิต $${t.join(',\\ ')},\\ \\dots,\\ ${L}$ มีทั้งหมดกี่พจน์`,
              answer: n, unit: 'พจน์', tol: 0.01,
              hint: `ตั้งสมการ $a_n = a_1 r^{n-1} = ${L}$ แล้วแก้สมการหา $n$`,
              why: `$${L} = ${a1}(${q})^{n-1}$<br>$${q}^{n-1} = ${L / a1} = ${q}^{${n - 1}}$<br>$n - 1 = ${n - 1} \\Rightarrow n = <b>${n}</b>$ พจน์`,
              verify: () => n
            }));
          }

          // ข-3: หา a1 และ r จาก a3, a6
          {
            const q = R.pick([2, 3, -2, -3, 4]);
            const a1 = R.pick([1, -1]) * R.int(1, 7);
            const a3 = a1 * q * q;
            const a6 = a1 * Math.pow(q, 5);

            qs.push(Q.fill({
              label: 'ข้อ 3',
              q: `ลำดับเรขาคณิตมี $a_3 = ${a3}$ และ $a_6 = ${a6}$ จงหาค่าของ $a_1$ และ $r$`,
              fields: [
                { label: '$a_1 =$', answer: a1, unit: '', tol: 0.01 },
                { label: '$r =$', answer: q, unit: '', tol: 0.01 }
              ],
              hint: `ตั้ง $a_6 = a_1 r^5$ และ $a_3 = a_1 r^2$ นำสมการมาหารกันจะได้ $r^3$`,
              why: `$\\frac{a_6}{a_3} = \\frac{a_1 r^5}{a_1 r^2} = r^3 = \\frac{${a6}}{${a3}} = ${Math.pow(q, 3)} \\Rightarrow r = <b>${q}</b>$<br>แทนกลับใน $a_3$: $a_1(${q})^2 = ${a3} \\Rightarrow a_1 = <b>${a1}</b>$`,
              verify: () => [a1, q]
            }));
          }

          // ข-4: มูลค่าลดลงทุกปี
          {
            let V, p, n;
            for (;;) {
              V = R.pick([150, 200, 250, 300, 400, 500]) * 1000;
              p = R.pick([10, 20]);
              n = R.pick([3, 4, 5]);
              if ((V * Math.pow(100 - p, n)) % Math.pow(100, n) === 0) break;
            }
            const mult = (100 - p) / 100;
            const ans = Math.round(V * Math.pow(mult, n));
            const a1 = V * mult;

            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `ซื้อเครื่องจักรราคา <b>${Number(V).toLocaleString()}</b> บาท มูลค่าของมันลดลงปีละ <b>${p}%</b> ของมูลค่าต้นปี จงหามูลค่าเมื่อสิ้นปีที่ <b>${n}</b>`,
              answer: ans, unit: 'บาท', tol: 0.01,
              hint: `มูลค่าลดลง ${p}% แปลว่าเหลือ ${100 - p}% หรือคูณด้วย ${mult} ในแต่ละปี ซึ่งเป็นลำดับเรขาคณิต`,
              why: `อัตราส่วนร่วม $r = ${mult}$ และมูลค่าสิ้นปีที่ 1 คือ $a_1 = ${Number(V).toLocaleString()} \\times ${mult} = ${Number(a1).toLocaleString()}$ บาท<br>สิ้นปีที่ ${n} คือ $a_{${n}} = a_1 r^{${n}-1} = ${Number(V).toLocaleString()}(${mult})^{${n}} = <b>${Number(ans).toLocaleString()}</b>$ บาท`,
              verify: () => ans
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
