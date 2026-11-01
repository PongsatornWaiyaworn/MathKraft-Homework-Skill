/* HW-08 · ทดสอบ 2 อนุกรมและการประยุกต์ */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  function fmtN(n, d = 0) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function asum(a1, d, n) { return n * (2 * a1 + (n - 1) * d) / 2; }
  function gsum(a1, q, n) {
    let s = 0, t = a1;
    for (let i = 0; i < n; i++) { s += t; t *= q; }
    return s;
  }
  function sumTex(terms) {
    let s = String(terms[0]);
    for (let i = 1; i < terms.length; i++) {
      s += (terms[i] < 0 ? ' - ' + (-terms[i]) : ' + ' + terms[i]);
    }
    return s + ' + \\dots';
  }

  window.HW = {
    id: 'HW-08', unit: 1, unitName: 'หน่วยที่ 1 ลำดับและอนุกรม', title: 'ทดสอบ 2 · อนุกรมและการประยุกต์',
    sub: 'ทดสอบความรู้เรื่องอนุกรมเลขคณิต อนุกรมเรขาคณิต และโจทย์ปัญหาประยุกต์ (6 ข้อ 6 คะแนน)',
    size: '6 ข้อ · 20 นาที', K: 6, P: 0,
    levels: [
      {
        short: 'ตอน 1', title: 'ตอน 1 · อนุกรมเลขคณิตและเรขาคณิต', kind: 'K', points: 3,
        skill: 'คำนวณผลบวกอนุกรมเลขคณิตและอนุกรมเรขาคณิต',
        desc: 'คำนวณผลบวก 3 ข้อ (ข้อละ 1 คะแนน)',
        intro: 'คิดด้วยความรอบคอบในกระดาษทดก่อนตอบคำถาม',
        build(R) {
          const qs = [];

          // ข้อ 1: Sn อนุกรมเลขคณิต
          {
            let a1, d, n;
            for (;;) {
              a1 = R.int(-6, 30);
              d = R.pick([-5, -4, -3, 3, 4, 5, 6, 7, 8, 9]);
              n = R.pick([18, 20, 22, 24, 25, 30]);
              if (a1 === 7 && d === 4 && n === 20) continue;
              break;
            }
            const t = [a1, a1 + d, a1 + 2 * d];
            const ans = asum(a1, d, n);

            qs.push(Q.fill({
              label: 'ข้อ 1',
              q: `จงหาผลบวก <b>${n} พจน์แรก</b> ($S_{${n}}$) ของอนุกรมเลขคณิต $${sumTex(t)}$`,
              answer: ans, unit: '', tol: 0.01,
              hint: `ทราบ $a_1 = ${a1}$ และ $d = ${d}$ ใช้สูตร $S_n = \\frac{n}{2}[2a_1 + (n-1)d]$`,
              why: `$a_1 = ${a1}, d = ${d}, n = ${n}$<br>$S_{${n}} = \\frac{${n}}{2}[2(${a1}) + (${n}-1)(${d})] = <b>${ans}</b>$`,
              verify: () => ans
            }));
          }

          // ข้อ 2: ผลบวกจำนวนคี่ในช่วง
          {
            let lo, hi;
            for (;;) {
              lo = R.int(10, 60);
              hi = R.int(150, 400);
              if (lo === 1 && hi === 99) continue;
              break;
            }
            const first = lo % 2 !== 0 ? lo : lo + 1;
            const last = hi % 2 !== 0 ? hi : hi - 1;
            const n = Math.floor((last - first) / 2) + 1;
            const ans = n * (first + last) / 2;

            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `จงหาผลบวกของ<b>จำนวนคี่</b>ทุกจำนวนตั้งแต่ <b>${lo}</b> ถึง <b>${hi}</b>`,
              answer: ans, unit: '', tol: 0.01,
              hint: `จำนวนคี่ตัวแรกคือ ${first} ตัวสุดท้ายคือ ${last} มีผลต่างร่วม $d = 2$ หาจำนวนพจน์ $n$ ก่อนแล้วใช้สูตร $S_n$`,
              why: `พจน์แรก $a_1 = ${first}$, พจน์สุดท้าย $a_n = ${last}, d = 2$<br>$${last} = ${first} + (n-1)(2) \\Rightarrow n = ${n}$ พจน์<br>$S_{${n}} = \\frac{${n}}{2}(${first} + ${last}) = <b>${fmtN(ans)}</b>$`,
              verify: () => ans
            }));
          }

          // ข้อ 3: Sn อนุกรมเรขาคณิต
          {
            let a1, q, n;
            for (;;) {
              q = R.pick([2, 3, 4, -2, -3]);
              a1 = R.int(1, 6);
              n = q === 2 ? R.int(7, 9) : q === 3 ? R.int(5, 7) : q === 4 ? R.int(4, 5) : R.int(5, 7);
              if (a1 === 1 && q === 3 && n === 7) continue;
              break;
            }
            const terms = [a1, a1 * q, a1 * q * q];
            const ans = gsum(a1, q, n);

            qs.push(Q.fill({
              label: 'ข้อ 3',
              q: `จงหาผลบวก <b>${n} พจน์แรก</b> ($S_{${n}}$) ของอนุกรมเรขาคณิต $${sumTex(terms)}$`,
              answer: ans, unit: '', tol: 0.01,
              hint: `ทราบ $a_1 = ${a1}$ และอัตราส่วนร่วม $r = ${q}$ ใช้สูตร $S_n = \\frac{a_1(r^n-1)}{r-1}$ หรือ $\\frac{a_1(1-r^n)}{1-r}$`,
              why: `$a_1 = ${a1}, r = ${q}, n = ${n}$<br>$S_{${n}} = \\frac{${a1}(1-(${q})^{${n}})}{1-(${q})} = <b>${ans}</b>$`,
              verify: () => ans
            }));
          }

          return qs;
        }
      },
      {
        short: 'ตอน 2', title: 'ตอน 2 · หาตัวแปรและโจทย์ประยุกต์', kind: 'K', points: 3,
        skill: 'หาจำนวนพจน์ n และผลต่างร่วม d และแก้โจทย์ปัญหาประยุกต์',
        desc: 'แก้ปัญหา 3 ข้อ (ข้อละ 1 คะแนน)',
        intro: 'คิดด้วยความรอบคอบในกระดาษทดก่อนตอบคำถาม',
        build(R) {
          const qs = [];

          // ข้อ 4: หา n และ d จากผลบวก
          {
            let a1, d, n;
            for (;;) {
              a1 = R.int(-5, 20);
              d = R.pick([2, 3, 4, 5, 6, 7, 8]);
              n = R.int(10, 25);
              if (a1 === 3 && d === 4 && n === 16) continue;
              break;
            }
            const last = a1 + (n - 1) * d;
            const S = asum(a1, d, n);

            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `อนุกรมเลขคณิตหนึ่งมีพจน์แรก $a_1 = ${a1}$ พจน์สุดท้าย $a_n = ${last}$ และผลบวกทุกพจน์เท่ากับ <b>${fmtN(S)}</b> จงหาจำนวนพจน์ ($n$) และผลต่างร่วม ($d$)`,
              fields: [
                { label: 'จำนวนพจน์ $n =$', answer: n, unit: 'พจน์', tol: 0.01 },
                { label: 'ผลต่างร่วม $d =$', answer: d, unit: '', tol: 0.01 }
              ],
              hint: `ใช้ $S_n = \\frac{n}{2}(a_1 + a_n)$ หา $n$ ก่อน แล้วใช้ $a_n = a_1 + (n-1)d$ หา $d$`,
              why: `$S_n = \\frac{n}{2}(${a1} + ${last}) = ${S} \\Rightarrow n = <b>${n}</b>$ พจน์<br>$${last} = ${a1} + (${n}-1)d \\Rightarrow d = <b>${d}</b>$`,
              verify: () => [n, d]
            }));
          }

          // ข้อ 5: โจทย์ประยุกต์อนุกรมเลขคณิต
          {
            let A, d, n;
            for (;;) {
              A = R.pick([250, 300, 350, 400, 450, 500]);
              d = R.pick([10, 15, 20, 25, 30]);
              n = R.pick([20, 25, 28, 30]);
              if (A === 300 && d === 20 && n === 30) continue;
              break;
            }
            const ans = asum(A, d, n);

            qs.push(Q.fill({
              label: 'ข้อ 5',
              q: `พนักงานส่งของคนหนึ่งได้รับค่าตอบแทนวันแรก <b>${fmtN(A)} บาท</b> และวันถัด ๆ ไปได้รับเพิ่มขึ้นวันละ <b>${d} บาท</b> ทุกวัน ถ้าเขาทำงานติดต่อกัน <b>${n} วัน</b> เขาจะได้รับค่าตอบแทนรวมทั้งหมดกี่บาท`,
              answer: ans, unit: 'บาท', tol: 0.01,
              hint: `เป็นอนุกรมเลขคณิตที่มี $a_1 = ${A}, d = ${d}, n = ${n}$ คำนวณยอดรวมโดยใช้สูตร $S_n$`,
              why: `$a_1 = ${A}, d = ${d}, n = ${n}$<br>$S_{${n}} = \\frac{${n}}{2}[2(${A}) + (${n}-1)(${d})] = <b>${fmtN(ans)}</b>$ บาท`,
              verify: () => ans
            }));
          }

          // ข้อ 6: โจทย์ประยุกต์อนุกรมเรขาคณิต (r = 1/2)
          {
            const n = R.pick([5, 6, 7]);
            const c = R.pick([3, 5, 7, 9, 10]);
            const a1 = c * Math.pow(2, n - 1);
            let ans = 0, t = a1;
            for (let i = 0; i < n; i++) { ans += t; t /= 2; }

            qs.push(Q.fill({
              label: 'ข้อ 6',
              q: `ร้านขนมปังแห่งหนึ่งขายขนมปังได้เดือนแรก <b>${fmtN(a1)} ชิ้น</b> และยอดขายในแต่ละเดือนถัดไปลดลงเหลือเพียงครึ่งหนึ่งของเดือนก่อนหน้าเสมอ ภายใน <b>${n} เดือนแรก</b> ร้านนี้ขายขนมปังได้รวมทั้งหมดกี่ชิ้น`,
              answer: ans, unit: 'ชิ้น', tol: 0.01,
              hint: `เป็นอนุกรมเรขาคณิตที่มี $a_1 = ${a1}$ และอัตราส่วนร่วม $r = \\frac{1}{2}$ ใช้สูตร $S_n = \\frac{a_1(1-r^n)}{1-r}$`,
              why: `$a_1 = ${a1}, r = \\frac{1}{2}, n = ${n}$<br>$S_{${n}} = \\frac{${a1}(1-(1/2)^{${n}})}{1 - 1/2} = <b>${fmtN(ans)}</b>$ ชิ้น`,
              verify: () => ans
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
