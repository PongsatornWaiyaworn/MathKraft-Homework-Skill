/* HW-04 · ทดสอบ 1 ลำดับ */
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
    add(o) { o = Fr.of(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Fr.of(o); return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Fr.of(o); return new Fr(this.n * o.n, this.d * o.d); }
    pow(k) { return new Fr(Math.pow(this.n, k), Math.pow(this.d, k)); }
    val() { return this.n / this.d; }
    isInt() { return this.d === 1; }
    tex() {
      if (this.d === 1) return String(this.n);
      return `\\frac{${this.n}}{${this.d}}`;
    }
  }

  function linTex(p, q) {
    let s = '';
    if (p === 1) s = 'n';
    else if (p === -1) s = '-n';
    else s = p + 'n';
    if (q > 0) s += '+' + q;
    else if (q < 0) s += '-' + (-q);
    return s;
  }

  function arith(a1, d, n) {
    const o = [];
    let c = a1;
    for (let i = 0; i < n; i++) {
      o.push(c);
      c += d;
    }
    return o;
  }

  function geoFr(a1, r, n) {
    const o = [];
    let c = Fr.of(a1);
    for (let i = 0; i < n; i++) {
      o.push(c);
      c = c.mul(r);
    }
    return o;
  }

  window.HW = {
    id: 'HW-04', unit: 1, unitName: 'หน่วยที่ 1 ลำดับและอนุกรม', title: 'ทดสอบ 1 · ลำดับ',
    sub: 'ทดสอบความรู้เรื่องพจน์ทั่วไป ลำดับเลขคณิต และลำดับเรขาคณิต (6 ข้อ 6 คะแนน)',
    size: '6 ข้อ · 20 นาที', K: 6, P: 0,
    levels: [
      {
        short: 'ตอน 1', title: 'ตอน 1 · พจน์ทั่วไปและลำดับเลขคณิต', kind: 'K', points: 3,
        skill: 'หาพจน์ทั่วไป พจน์จากพจน์ทั่วไป และพจน์ที่ n ของลำดับเลขคณิต',
        desc: 'ตอบคำถาม 3 ข้อ (ข้อละ 1 คะแนน)',
        intro: 'คิดด้วยความรอบคอบในกระดาษทดก่อนตอบคำถาม',
        build(R) {
          const qs = [];

          // ข้อ 1: หาพจน์ทั่วไป
          {
            let p, q;
            for (;;) {
              p = R.pick([2, 3, 4, 5, 6, 7, -2, -3, -4, -5]);
              q = R.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
              if (p === 3 && q === -2) continue;
              break;
            }
            const a1 = p + q;
            const t = arith(a1, p, 4);

            const good = linTex(p, q);
            const bad1 = linTex(p, a1);
            const bad2 = linTex(p + 1, q - 1);
            const bad3 = linTex(p, q + 2);
            const opts = R.shuffle([good, bad1, bad2, bad3]);
            const ansIdx = opts.indexOf(good);

            qs.push(Q.choice({
              label: 'ข้อ 1',
              q: `จงหาพจน์ทั่วไป $a_n$ ของลำดับ $${t.join(',\\ ')},\\ \\dots$`,
              options: opts.map(o => `$a_n = ${o}$`),
              answer: ansIdx,
              shuffle: false,
              hint: `เป็นลำดับเลขคณิตที่มี $a_1 = ${a1}$ และผลต่างร่วม $d = ${p}$ ใช้สูตร $a_n = a_1 + (n-1)d$`,
              why: `$a_1 = ${a1}, d = ${p}$<br>$a_n = ${a1} + (n-1)(${p}) = <b>${good}</b>$`,
              verify: () => ansIdx
            }));
          }

          // ข้อ 2: a1 และ a4 จากสูตรเศษส่วน
          {
            let p, q, c, s;
            for (;;) {
              p = R.int(1, 5); q = R.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
              c = R.pick([1, 2, 3]); s = R.int(1, 5);
              const f1 = new Fr(p + q, c + s), f4 = new Fr(4 * p + q, 4 * c + s);
              if (f1.isInt() && f4.isInt()) continue;
              break;
            }
            const A1 = new Fr(p + q, c + s), A4 = new Fr(4 * p + q, 4 * c + s);

            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `กำหนดลำดับ $a_n = \\dfrac{${linTex(p, q)}}{${linTex(c, s)}}$ จงหาค่าของ $a_1$ และ $a_4$ (ตอบเป็นทศนิยมหรือเศษส่วน)`,
              fields: [
                { label: '$a_1 =$', answer: A1.val(), unit: '', tol: 0.02 },
                { label: '$a_4 =$', answer: A4.val(), unit: '', tol: 0.02 }
              ],
              hint: `แทน $n = 1$ เพื่อหา $a_1$ และแทน $n = 4$ เพื่อหา $a_4$`,
              why: `$a_1 = \\frac{${p}(1) ${q >= 0 ? '+' + q : q}}{${c}(1) + ${s}} = ${A1.tex()} \\approx <b>${A1.val().toFixed(2)}</b>$<br>$a_4 = \\frac{${p}(4) ${q >= 0 ? '+' + q : q}}{${c}(4) + ${s}} = ${A4.tex()} \\approx <b>${A4.val().toFixed(2)}</b>$`,
              verify: () => [A1.val(), A4.val()]
            }));
          }

          // ข้อ 3: พจน์ที่ n ของลำดับเลขคณิต
          {
            let a1, d, n;
            for (;;) {
              a1 = R.int(-12, 45);
              d = R.pick([-9, -8, -7, -6, -5, -3, -2, 2, 3, 5, 6, 7, 9]);
              n = R.pick([18, 20, 22, 24, 25, 30]);
              if (a1 === 12 && d === -4) continue;
              break;
            }
            const ans = a1 + (n - 1) * d;
            const t = arith(a1, d, 3);

            qs.push(Q.fill({
              label: 'ข้อ 3',
              q: `จงหาพจน์ที่ <b>${n}</b> ($a_{${n}}$) ของลำดับเลขคณิต $${t.join(',\\ ')},\\ \\dots$`,
              answer: ans, unit: '', tol: 0.01,
              hint: `หา $d$ จากผลต่าง แล้วใช้ $a_{${n}} = a_1 + (${n}-1)d$`,
              why: `$a_1 = ${a1}, d = ${d}$<br>$a_{${n}} = ${a1} + (${n}-1)(${d}) = <b>${ans}</b>$`,
              verify: () => ans
            }));
          }

          return qs;
        }
      },
      {
        short: 'ตอน 2', title: 'ตอน 2 · ลำดับเรขาคณิตและการประยุกต์', kind: 'K', points: 3,
        skill: 'นับจำนวนที่หารลงตัว หาพจน์ที่ n ของลำดับเรขาคณิต และหา a1, a6',
        desc: 'ตอบคำถาม 3 ข้อ (ข้อละ 1 คะแนน)',
        intro: 'คิดด้วยความรอบคอบในกระดาษทดก่อนตอบคำถาม',
        build(R) {
          const qs = [];

          // ข้อ 4: นับจำนวนที่หารลงตัว
          {
            const m = R.pick([9, 12, 14, 15, 16, 17, 18, 19]);
            const lo = R.int(21, 130), hi = R.int(330, 880);
            let cnt = 0;
            for (let x = lo; x <= hi; x++) { if (x % m === 0) cnt++; }
            const first = Math.ceil(lo / m) * m, last = Math.floor(hi / m) * m;

            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `จำนวนเต็มตั้งแต่ <b>${lo}</b> ถึง <b>${hi}</b> ที่หารด้วย <b>${m}</b> ลงตัว มีทั้งหมดกี่จำนวน`,
              answer: cnt, unit: 'จำนวน', tol: 0.01,
              hint: `หาพหุคูณตัวแรก $\\ge ${lo}$ และตัวสุดท้าย $\\le ${hi}$ แล้วแก้สมการ $a_n = a_1 + (n-1)d$`,
              why: `พหุคูณแรกคือ ${first}, ตัวสุดท้ายคือ ${last}, $d = ${m}$<br>$${last} = ${first} + (n-1)(${m}) \\Rightarrow n = <b>${cnt}</b>$ จำนวน`,
              verify: () => cnt
            }));
          }

          // ข้อ 5: พจน์ที่ n ของลำดับเรขาคณิต (r ติดลบ)
          {
            const rr = R.pick([-2, -3]);
            const q = Fr.of(rr);
            const n = rr === -2 ? R.pick([8, 9, 10]) : R.pick([6, 7, 8]);
            const a1 = R.pick([1, -1]) * R.int(1, 5);
            const ans = a1 * Math.pow(rr, n - 1);
            const t = geoFr(a1, q, 3);

            qs.push(Q.fill({
              label: 'ข้อ 5',
              q: `จงหาพจน์ที่ <b>${n}</b> ของลำดับเรขาคณิต $${t.map(x => x.tex()).join(',\\ ')},\\ \\dots$`,
              answer: ans, unit: '', tol: 0.01,
              hint: `หาอัตราส่วนร่วม $r = \\frac{a_2}{a_1}$ (ระวังเครื่องหมายลบ) แล้วใช้สูตร $a_n = a_1 r^{n-1}$`,
              why: `$a_1 = ${a1}, r = ${rr}$<br>$a_{${n}} = ${a1}(${rr})^{${n}-1} = <b>${ans}</b>$`,
              verify: () => ans
            }));
          }

          // ข้อ 6: a1 และ a6 จาก a2, a4 (r > 0)
          {
            const q = Fr.of(R.pick([2, 3, 4]));
            const a1 = R.int(1, 5);
            const a2 = Fr.of(a1).mul(q);
            const a4 = Fr.of(a1).mul(q.pow(3));
            const a6 = Fr.of(a1).mul(q.pow(5));

            qs.push(Q.fill({
              label: 'ข้อ 6',
              q: `ลำดับเรขาคณิตที่มีอัตราส่วนร่วมเป็นบวก ($r > 0$) มี $a_2 = ${a2.tex()}$ และ $a_4 = ${a4.tex()}$ จงหาค่าของ $a_1$ และ $a_6$`,
              fields: [
                { label: '$a_1 =$', answer: a1, unit: '', tol: 0.01 },
                { label: '$a_6 =$', answer: a6.val(), unit: '', tol: 0.01 }
              ],
              hint: `นำ $a_4$ หารด้วย $a_2$ จะได้ $r^2$ จากนั้นถอดรากที่สอง (เลือกค่าบวก) แล้วหา $a_1$ และ $a_6$`,
              why: `$r^2 = \\frac{a_4}{a_2} = \\frac{${a4.tex()}}{${a2.tex()}} = ${q.pow(2).tex()} \\Rightarrow r = ${q.tex()}$ ($r > 0$)<br>$a_1 = \\frac{a_2}{r} = <b>${a1}</b>$<br>$a_6 = a_4 r^2 = <b>${a6.tex()}</b>$`,
              verify: () => [a1, a6.val()]
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
