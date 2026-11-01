/* HW-13 · ทดสอบ 4 ค่ารายงวด */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  function fmtN(n, d = 2) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function rd(x, d) { const m = Math.pow(10, d); return Math.round(x * m) / m; }

  window.HW = {
    id: 'HW-13', unit: 2, unitName: 'หน่วยที่ 2 ดอกเบี้ยและมูลค่าของเงิน', title: 'ทดสอบ 4 · ค่ารายงวด',
    sub: 'ทดสอบความรู้เรื่องมูลค่าอนาคตและมูลค่าปัจจุบันของค่ารายงวด และค่างวดผ่อนชำระ (4 ข้อ 4 คะแนน)',
    size: '4 ข้อ · 15 นาที', K: 4, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ค่ารายงวดและค่างวดผ่อนชำระ', kind: 'K', points: 4,
        skill: 'คำนวณมูลค่าอนาคต มูลค่าปัจจุบัน และค่างวดผ่อนชำระ',
        desc: 'คำนวณคำตอบ 4 ข้อ (ข้อละ 1 คะแนน)',
        intro: 'ใช้สูตร $FV = R\\left[\\frac{(1+i)^n-1}{i}\\right]$ และ $PV = R\\left[\\frac{1-(1+i)^{-n}}{i}\\right]$',
        build(R) {
          const qs = [];

          // ข้อ 1: มูลค่าอนาคตของเงินฝากรายปี
          {
            const R_amt = R.pick([6000, 8000, 10000, 12000, 15000]);
            const rr = R.pick([2, 3, 4, 5]);
            const n = R.pick([6, 8, 10, 12]);
            const i = rr / 100;
            const FV = R_amt * (Math.pow(1 + i, n) - 1) / i;

            qs.push(Q.fill({
              label: 'ข้อ 1',
              q: `ฝากเงินทุกสิ้นปี ปีละ <b>${fmtN(R_amt, 0)} บาท</b> เป็นเวลา <b>${n} ปี</b> อัตราดอกเบี้ย <b>${rr}% ต่อปี</b> คิดทบต้นทุกปี เมื่อฝากครั้งสุดท้ายแล้ว จะมีเงินรวม ($FV$) ทั้งหมดกี่บาท (ทศนิยม 2 ตำแหน่ง)`,
              answer: FV, unit: 'บาท', tol: 0.1,
              hint: `ใช้สูตร $FV = R\\left[\\dfrac{(1+i)^n-1}{i}\\right]$ โดย $R = ${R_amt}, i = ${i}, n = ${n}$`,
              why: `$FV = ${R_amt}\\left[\\frac{(1+${i})^{${n}}-1}{${i}}\\right] = <b>${fmtN(FV, 2)}</b>$ บาท`,
              verify: () => FV
            }));
          }

          // ข้อ 2: มูลค่าปัจจุบันของเงินที่ได้รับรายเดือน
          {
            const R_amt = R.pick([2000, 3000, 4000, 5000]);
            const rr = R.pick([3.6, 4.8, 6.0]);
            const n = R.pick([12, 18, 24]);
            const i = rr / (100 * 12);
            const PV = R_amt * (1 - Math.pow(1 + i, -n)) / i;

            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `จะได้รับเงินช่วยเหลือทุกสิ้นเดือน เดือนละ <b>${fmtN(R_amt, 0)} บาท</b> เป็นเวลา <b>${n} เดือน</b> อัตราดอกเบี้ย <b>${rr}% ต่อปี</b> คิดทบต้นทุกเดือน จงหามูลค่าปัจจุบัน ($PV$) ของเงินช่วยเหลือนั้นทั้งหมด (ทศนิยม 2 ตำแหน่ง)`,
              answer: PV, unit: 'บาท', tol: 0.1,
              hint: `ใช้สูตร $PV = R\\left[\\dfrac{1-(1+i)^{-n}}{i}\\right]$ โดย $R = ${R_amt}, i = \\frac{${rr / 100}}{12}, n = ${n}$`,
              why: `$PV = ${R_amt}\\left[\\frac{1-(1+${i})^{-${n}}}{${i}}\\right] = <b>${fmtN(PV, 2)}</b>$ บาท`,
              verify: () => PV
            }));
          }

          // ข้อ 3: ค่างวดผ่อนชำระรายปี
          {
            const L = R.pick([120000, 180000, 240000, 300000]);
            const rr = R.pick([5, 6, 7, 8]);
            const n = R.pick([3, 4, 5]);
            const i = rr / 100;
            const Rn = L * i / (1 - Math.pow(1 + i, -n));

            qs.push(Q.fill({
              label: 'ข้อ 3',
              q: `กู้เงิน <b>${fmtN(L, 0)} บาท</b> ซื้อเครื่องจักร ผ่อนชำระทุกสิ้นปีเท่ากัน <b>${n} งวด</b> อัตราดอกเบี้ย <b>${rr}% ต่อปี</b> คิดทบต้นทุกปี ต้องผ่อนชำระปีละกี่บาท (ทศนิยม 2 ตำแหน่ง)`,
              answer: Rn, unit: 'บาทต่อปี', tol: 0.1,
              hint: `ทราบเงินกู้ $PV = ${L}$ ใช้สูตรค่างวด $R = \\dfrac{PV \\cdot i}{1-(1+i)^{-n}}$`,
              why: `$R = \\frac{${L} \\times ${i}}{1-(1+${i})^{-${n}}} = <b>${fmtN(Rn, 2)}</b>$ บาทต่อปี`,
              verify: () => Rn
            }));
          }

          // ข้อ 4: ค่างวดรายเดือนและดอกเบี้ยรวม
          {
            const L = R.pick([150000, 200000, 240000, 300000]);
            const rr = R.pick([4.8, 6.0, 7.2]);
            const n = R.pick([24, 36, 48]);
            const i = rr / (100 * 12);
            const Rn = L * i / (1 - Math.pow(1 + i, -n));
            const R2 = rd(Rn, 2);
            const totalInt = R2 * n - L;

            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `กู้เงินซื้อรถยนต์ <b>${fmtN(L, 0)} บาท</b> ผ่อนชำระทุกสิ้นเดือนเท่า ๆ กัน <b>${n} งวด</b> อัตราดอกเบี้ย <b>${rr}% ต่อปี</b> คิดทบต้นทุกเดือน ต้องผ่อนเดือนละกี่บาท และเสียดอกเบี้ยรวมทั้งหมดกี่บาท (ทศนิยม 2 ตำแหน่ง)`,
              fields: [
                { label: 'ผ่อนเดือนละ $R =$', answer: Rn, unit: 'บาทต่อเดือน', tol: 0.1 },
                { label: 'ดอกเบี้ยรวม $=$', answer: totalInt, unit: 'บาท', tol: 0.5 }
              ],
              hint: `คำนวณ $R = \\frac{PV \\cdot i}{1-(1+i)^{-n}}$ จากนั้นดอกเบี้ยรวม $= (R \\times n) - PV$`,
              why: `$i = \\frac{${rr / 100}}{12} = ${i}$<br>$R = \\frac{${L} \\times ${i}}{1-(1+${i})^{-${n}}} = <b>${fmtN(Rn, 2)}</b>$ บาทต่อเดือน<br>` +
                `ผ่อนรวม $= ${n} \\times ${fmtN(R2, 2)} = ${fmtN(R2 * n, 2)}$ บาท<br>` +
                `ดอกเบี้ยรวม $= ${fmtN(R2 * n, 2)} - ${fmtN(L, 0)} = <b>${fmtN(totalInt, 2)}</b>$ บาท`,
              verify: () => [Rn, totalInt]
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
