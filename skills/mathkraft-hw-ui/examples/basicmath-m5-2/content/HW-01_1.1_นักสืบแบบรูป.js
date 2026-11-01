/* HW-01 · 1.1 นักสืบแบบรูป */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const r = String.raw;

  function tex(x) { return String(x); }
  function linTex(p, q, v) {
    v = v || 'n';
    let s = '';
    if (p === 1) s = v;
    else if (p === -1) s = '-' + v;
    else s = p + v;
    if (q > 0) s += '+' + q;
    else if (q < 0) s += '-' + (-q);
    return s;
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  }

  class Fr {
    constructor(n, d) {
      if (d === 0) throw new Error('Division by zero');
      const g = gcd(n, d);
      this.n = (d < 0 ? -n : n) / g;
      this.d = Math.abs(d) / g;
    }
    tex() {
      if (this.d === 1) return String(this.n);
      return `\\frac{${this.n}}{${this.d}}`;
    }
  }

  window.HW = {
    id: 'HW-01', unit: 1, unitName: 'หน่วยที่ 1 ลำดับและอนุกรม', title: 'นักสืบแบบรูป',
    sub: 'สืบหารูปแบบของลำดับ แยกแยะลำดับจำกัดและลำดับอนันต์ หาพจน์ที่กำหนดจากพจน์ทั่วไป และหาพจน์ทั่วไปจากแบบรูปตัวเลข',
    size: '4 ข้อ · 10 นาที', K: 2, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · สืบหาแบบรูป', kind: 'K', points: 2,
        skill: 'แยกแยะลำดับจำกัด/อนันต์ หาพจน์จากพจน์ทั่วไป และหาพจน์ทั่วไปจากแบบรูป',
        desc: 'ตอบคำถามเรื่องลำดับ 4 ข้อ (ข้อละ 0.5 คะแนน)',
        intro: 'วางแผนก่อนตอบ ทดวิธีคิดในกระดาษ แล้วพิมพ์หรือเลือกคำตอบที่ถูกต้อง',
        build(R) {
          const qs = [];

          // ข้อ 1: ลำดับจำกัด / ลำดับอนันต์
          {
            const m = R.int(3, 9), L = R.int(12, 40), c = R.int(2, 6), N = R.int(40, 95), q = R.int(3, 8), e = R.int(5, 9), f2 = R.pick([36, 48, 60, 72]), lo = R.int(11, 19), hi = R.int(61, 99);
            const fin = [
              { h: `$${m},\\ ${2 * m},\\ ${3 * m},\\ \\dots,\\ ${L * m}$`, why: `มีพจน์สุดท้ายคือ ${L * m} จึงเป็นลำดับจำกัด` },
              { h: `จำนวนเต็มบวกที่น้อยกว่า ${N} และหารด้วย ${q} ลงตัว`, why: `มีเพียงจำนวนจำกัด (ไม่เกิน ${N}) จึงเป็นลำดับจำกัด` },
              { h: `$a_n = ${linTex(c, 1)}$ เมื่อ $n = 1, 2, 3, \\dots, ${L + 5}$`, why: `n มีค่าตั้งแต่ 1 ถึง ${L + 5} เท่านั้น จึงมี ${L + 5} พจน์ เป็นลำดับจำกัด` },
              { h: `ตัวประกอบที่เป็นจำนวนนับของ ${f2}`, why: 'จำนวนนับมีตัวประกอบจำนวนจำกัด จึงเป็นลำดับจำกัด' },
              { h: `$\\frac{1}{2},\\ \\frac{1}{4},\\ \\frac{1}{8},\\ \\dots,\\ \\frac{1}{${Math.pow(2, e)}}$`, why: `มีพจน์สุดท้ายคือ $\\frac{1}{${Math.pow(2, e)}}$ จึงเป็นลำดับจำกัด` },
              { h: `จำนวนคู่ที่อยู่ระหว่าง ${lo} ถึง ${hi}`, why: 'อยู่ในช่วงที่มีขอบเขต จึงมีจำนวนจำกัด เป็นลำดับจำกัด' }
            ];
            const inf = [
              { h: `$${m},\\ ${2 * m},\\ ${3 * m},\\ ${4 * m},\\ \\dots$`, why: 'มี … ต่อท้ายโดยไม่มีพจน์สุดท้าย จึงเป็นลำดับอนันต์' },
              { h: `จำนวนเต็มบวกที่หารด้วย ${q} ลงตัว`, why: `ทวีคูณของ ${q} มีไม่จำกัด จึงเป็นลำดับอนันต์` },
              { h: `$a_n = ${linTex(c, 1)}$ เมื่อ $n$ เป็นจำนวนนับ`, why: 'n เป็นจำนวนนับได้ไม่จำกัด จึงเป็นลำดับอนันต์' },
              { h: `$1,\\ \\frac{1}{2},\\ \\frac{1}{3},\\ \\frac{1}{4},\\ \\dots$`, why: 'ไม่มีพจน์สุดท้าย จึงเป็นลำดับอนันต์' },
              { h: `$${c},\\ ${2 * c},\\ ${4 * c},\\ ${8 * c},\\ \\dots$`, why: 'คูณ 2 ต่อไปได้เรื่อย ๆ ไม่มีพจน์สุดท้าย เป็นลำดับอนันต์' },
              { h: `ผลคูณของจำนวนนับกับ ${q + 1}`, why: 'จำนวนนับมีไม่จำกัด ผลคูณจึงมีไม่จำกัด เป็นลำดับอนันต์' }
            ];

            const askFin = R.chance(0.5);
            const good = R.pick(askFin ? fin : inf);
            const bad = R.sample(askFin ? inf : fin, 3);
            const rawOpts = R.shuffle([good, ...bad]);
            const ansIdx = rawOpts.findIndex(o => o === good);

            qs.push(Q.choice({
              label: 'ข้อ 1',
              q: `ข้อใดต่อไปนี้ <b>เป็นลำดับ${askFin ? 'จำกัด' : 'อนันต์'}</b> (เลือกข้อเดียว)`,
              options: rawOpts.map(o => o.h),
              answer: ansIdx,
              shuffle: false,
              hint: 'ลำดับจำกัดมีพจน์สุดท้าย ส่วนลำดับอนันต์มีพจน์ต่อไปเรื่อย ๆ ไม่สิ้นสุด',
              why: rawOpts.map(o => `• ${o.h} — ${o.why}`).join('<br>') + `<br><b>ตอบ: ${good.h}</b>`,
              verify: () => ansIdx
            }));
          }

          // ข้อ 2: หาค่าพจน์ที่ k เมื่อกำหนด an
          {
            const kind = R.int(1, 3);
            let tx, fn, k, steps;
            if (kind === 1) {
              const al = R.int(1, 3);
              const be = R.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
              const ga = R.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
              k = R.int(12, 25);
              fn = n => al * n * n + be * n + ga;
              tx = (al === 1 ? '' : al) + 'n^2' + (be < 0 ? '-' + (-be) : '+' + be) + 'n' + (ga < 0 ? '-' + (-ga) : '+' + ga);
              steps = `a_{${k}} = ${(al === 1 ? '' : al)}(${k})^2` + (be < 0 ? '-' + (-be) : '+' + be) + `(${k})` + (ga < 0 ? '-' + (-ga) : '+' + ga);
            } else if (kind === 2) {
              const p = R.int(2, 5);
              const qVal = R.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]);
              k = R.int(11, 30);
              fn = n => (n % 2 === 0 ? 1 : -1) * (p * n + qVal);
              tx = `(-1)^n(${linTex(p, qVal)})`;
              steps = `a_{${k}} = (-1)^{${k}}(${p}(${k})` + (qVal < 0 ? '-' + (-qVal) : '+' + qVal) + `)`;
            } else {
              const base = R.pick([2, 3]);
              const pp = R.int(2, 5);
              const qq = R.int(1, 9);
              k = R.int(5, base === 2 ? 9 : 6);
              fn = n => pp * Math.pow(base, n) - qq;
              tx = `${pp}\\cdot ${base}^n - ${qq}`;
              steps = `a_{${k}} = ${pp}\\cdot ${base}^{${k}} - ${qq}`;
            }

            const ans = fn(k);
            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `กำหนดลำดับ $a_n = ${tx}$ จงหาค่าของพจน์ที่ <b>${k}</b> ($a_{${k}}$)`,
              answer: ans, unit: '', tol: 0.01,
              hint: `แทนค่า $n = ${k}$ ลงในพจน์ทั่วไป $a_n$`,
              why: `แทน $n = ${k}$ จะได้: $${steps} = ${ans}$`,
              verify: () => ans
            }));
          }

          // ข้อ 3: หาพจน์ทั่วไปจากแบบรูป
          {
            const kind = R.int(1, 4);
            let fn, terms, correctFormula, wrongFormulas;
            if (kind === 1) {
              const p1 = R.pick([3, 4, 5, 6, 7]), q1 = R.int(-9, 15);
              fn = n => p1 * n + q1;
              terms = [1, 2, 3, 4, 5].map(n => fn(n));
              correctFormula = linTex(p1, q1);
              wrongFormulas = [linTex(p1 + 1, q1 - 1), linTex(p1, q1 + p1), linTex(p1 - 1, q1 + 1)];
            } else if (kind === 2) {
              const p3 = R.int(2, 6);
              fn = n => (n % 2 === 0 ? 1 : -1) * p3 * n;
              terms = [1, 2, 3, 4, 5].map(n => fn(n));
              correctFormula = `(-1)^n\\cdot ${p3}n`;
              wrongFormulas = [`(-1)^{n+1}\\cdot ${p3}n`, `(-1)^n\\cdot ${p3}^n`, `${p3}n`];
            } else if (kind === 3) {
              const c4 = R.int(1, 5);
              fn = n => n / (n + c4);
              terms = [1, 2, 3, 4, 5].map(n => new Fr(n, n + c4).tex());
              correctFormula = `\\frac{n}{n+${c4}}`;
              wrongFormulas = [`\\frac{n}{n+${c4 + 1}}`, `\\frac{n+${c4}}{n}`, `\\frac{n}{n-${c4}}`];
            } else {
              const a5 = R.pick([2, 3, 5]), b5 = R.pick([2, 3]);
              fn = n => a5 * Math.pow(b5, n - 1);
              terms = [1, 2, 3, 4, 5].map(n => fn(n));
              correctFormula = `${a5}\\cdot ${b5}^{n-1}`;
              wrongFormulas = [`${a5}\\cdot ${b5}^n`, `${a5 * b5}^{n-1}`, `${a5}\\cdot ${b5}n`];
            }

            const allOpts = R.shuffle([correctFormula, ...wrongFormulas]);
            const ansIdx = allOpts.indexOf(correctFormula);

            qs.push(Q.choice({
              label: 'ข้อ 3',
              q: `ลำดับ $${terms.slice(0, 5).join(',\\ ')},\\ \\dots$ มีพจน์ทั่วไป $a_n$ เป็นข้อใด`,
              options: allOpts.map(o => `$a_n = ${o}$`),
              answer: ansIdx,
              shuffle: false,
              hint: 'ลองแทน $n = 1, 2, 3$ ในแต่ละตัวเลือก แล้วดูว่าตรงกับพจน์ในโจทย์หรือไม่',
              why: `แทน $n = 1, 2, 3, 4, 5$ ใน $a_n = ${correctFormula}$ จะได้พจน์ตรงกับ $${terms.slice(0, 5).join(',\\ ')}$ ครบถ้วน`,
              verify: () => ansIdx
            }));
          }

          // ข้อ 4: หา n เมื่อรู้ค่าของพจน์
          {
            const p = R.pick([2, 3, 4, 5, 6, 7, 8, -2, -3, -4]);
            const qVal = R.int(-12, 20) || 5;
            const n0 = R.int(18, 60);
            const val = p * n0 + qVal;

            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `กำหนดลำดับ $a_n = ${linTex(p, qVal)}$ ถ้าพจน์หนึ่งของลำดับนี้มีค่าเท่ากับ <b>${val}</b> จงหาว่าพจน์นั้นเป็นพจน์ที่เท่าใด ($n = ?$)`,
              answer: n0, unit: '', tol: 0.01,
              hint: `ตั้งสมการ $${linTex(p, qVal)} = ${val}$ แล้วแก้สมการหาค่า $n$`,
              why: `ตั้งสมการ $${linTex(p, qVal)} = ${val}$<br>$${p}n = ${val} - (${qVal}) = ${val - qVal}$<br>$n = \\frac{${val - qVal}}{${p}} = <b>${n0}</b>$`,
              verify: () => n0
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
