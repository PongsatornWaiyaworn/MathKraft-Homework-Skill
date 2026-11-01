/* HW-05 · ภารกิจ 1 ร้านสมมติ 1 เดือน */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const v = 7, TH = 1800000;

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function bahtd(n) { return fmt(r2(n), 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }

  const SH = [
    { n: 'ร้านศิลป์สุขใจ', t: 'ร้านอุปกรณ์ศิลปะ', sales: ['สีอะคริลิกและสีน้ำ', 'พู่กันและจานสี', 'ผ้าใบและสมุดสเก็ตช์', 'ชุดอุปกรณ์สำหรับนักเรียน'], sup: ['โรงงานผลิตสี', 'บริษัทนำเข้าพู่กัน', 'ร้านขายส่งกระดาษ', 'แผงขายผ้าใบริมทางที่ไม่ได้จด VAT'] },
    { n: 'ร้านกรอบรูปบ้านสวน', t: 'ร้านกรอบรูป', sales: ['กรอบรูปไม้', 'กรอบรูปอะลูมิเนียม', 'บริการจัดกรอบงานศิลป์', 'ภาพพิมพ์ตกแต่งบ้าน'], sup: ['โรงงานไม้แปรรูป', 'ร้านส่งกระจกและอะคริลิก', 'ผู้ผลิตกรอบสำเร็จรูป', 'ช่างฝีมือในชุมชนที่ไม่ได้จด VAT'] },
    { n: 'ร้านสกรีนสนุก', t: 'ร้านเสื้อสกรีนลาย', sales: ['เสื้อสกรีนลายสั่งทำ', 'เสื้อกีฬาสี', 'กระเป๋าผ้าสกรีน', 'เสื้อลายศิลปะสำเร็จรูป'], sup: ['โรงงานผ้าฝ้าย', 'บริษัทหมึกสกรีน', 'ร้านส่งเสื้อเปล่า', 'แผงขายเศษผ้าในตลาดนัดที่ไม่ได้จด VAT'] },
    { n: 'ร้านดินเผาริมคลอง', t: 'ร้านเครื่องปั้นดินเผา', sales: ['แจกันและกระถาง', 'ชุดถ้วยชามเซรามิก', 'ของตกแต่งสวน', 'ชุดทำเซรามิกสำหรับเด็ก'], sup: ['เหมืองดินเหนียว (บริษัท)', 'ร้านขายส่งเคลือบเซรามิก', 'บริษัทขนส่งสินค้า', 'เกษตรกรขายฟืนที่ไม่ได้จด VAT'] },
    { n: 'ร้านพิมพ์ภาพด่วน', t: 'ร้านพิมพ์โปสเตอร์และถ่ายภาพ', sales: ['พิมพ์โปสเตอร์', 'ถ่ายภาพและตกแต่งภาพ', 'พิมพ์นามบัตรและการ์ด', 'ทำป้ายไวนิล'], sup: ['บริษัทกระดาษโฟโต้', 'ผู้จำหน่ายหมึกพิมพ์', 'ร้านขายส่งไวนิล', 'ช่างทำโครงป้ายอิสระที่ไม่ได้จด VAT'] },
    { n: 'ร้านลายไทยมิกซ์', t: 'ร้านของที่ระลึกและสติกเกอร์', sales: ['สติกเกอร์ลายไทย', 'พวงกุญแจและของที่ระลึก', 'สมุดโน้ตลายเส้น', 'โปสการ์ดและแม่เหล็ก'], sup: ['โรงพิมพ์สติกเกอร์', 'บริษัทผลิตพวงกุญแจ', 'ร้านส่งกระดาษคราฟต์', 'กลุ่มแม่บ้านทำของใช้ที่ไม่ได้จด VAT'] }
  ];

  window.HW = {
    id: 'HW-05', unit: 1, unitName: 'หน่วยที่ 1 ภาษีมูลค่าเพิ่ม', title: 'ร้านสมมติ 1 เดือน: ภาษีขาย–ภาษีซื้อ–ภาษีที่ต้องชำระ',
    sub: 'ภารกิจสรุปภาษีประจำเดือนของร้านสมมติ: คำนวณภาษีขาย ภาษีซื้อ ภาษีที่ต้องนำส่ง (ภ.พ.30) และประเมินเกณฑ์การจดทะเบียน VAT 1.8 ล้านบาทต่อปี',
    size: '4 ขั้น · 20 นาที', K: 0, P: 4,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ขั้นที่ 1: ภาษีขาย', kind: 'P', points: 1,
        skill: 'รวมยอดขายและคำนวณภาษีขายประจำเดือน',
        desc: 'รวมยอดขายสินค้า 4 รายการ แล้วคำนวณภาษีขาย 7%',
        intro: 'ราคาสินค้าทุกรายการเป็นราคา “ก่อน VAT” นำยอดขายรวมมาคูณ 7/100 เพื่อหาภาษีขาย',
        build(R) {
          const sh = R.pick(SH);
          const big = R.chance(0.5);
          const ln = [0, 1, 2, 3].map(() => big ? step(R, 42000, 66000, 500) : step(R, 20000, 35000, 500));
          const S = ln.reduce((a, b) => a + b, 0);
          const out = r2(S * v / 100);

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.1em;margin-bottom:6px">🏪 ${sh.n} (${sh.t} · ร้านสมมติ)</div>
              <p style="margin:4px 0;font-size:0.92em;color:#555">ร้านจดทะเบียน VAT แล้ว สรุปยอดขายประจำเดือนนี้ (ราคาทุกรายการยังไม่รวม VAT):</p>
              <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:0.92em">
                <thead><tr style="background:var(--navy);color:#fff"><th style="padding:6px 10px;text-align:left">รายการขาย</th><th style="padding:6px 10px;text-align:right">ยอดขาย (ก่อน VAT)</th></tr></thead>
                <tbody>
                  ${sh.sales.map((s, i) => `<tr style="border-bottom:1px solid #ddd"><td style="padding:6px 10px">${s}</td><td style="padding:6px 10px;text-align:right">${baht(ln[i])} บาท</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ยอดขายรวม',
                  q: 'ยอดขายรวมทั้งเดือน (ก่อน VAT) เป็นเงินกี่บาท',
                  answer: S, unit: 'บาท', tol: 0.01,
                  hint: `นำยอดขายทั้ง 4 รายการมาบวกกัน`,
                  why: `ยอดขายรวม = ${ln.map(baht).join(' + ')} = <b>${baht(S)} บาท</b>`,
                  verify: () => S
                }),
                Q.fill({
                  label: 'ภาษีขายรวม',
                  q: `ภาษีขายรวมของเดือนนี้ (${v}%) เป็นเงินกี่บาท`,
                  answer: out, unit: 'บาท', tol: 0.01,
                  hint: `ภาษีขาย = ยอดขายรวม × ${v}/100`,
                  why: `ภาษีขาย = ${baht(S)} × ${v}/100 = <b>${bahtd(out)} บาท</b>`,
                  verify: () => out
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · ขั้นที่ 2: ภาษีซื้อ', kind: 'P', points: 1,
        skill: 'คัดกรองบิลซื้อสินค้า แยก VAT และคำนวณภาษีซื้อรวม',
        desc: 'ตรวจสอบบิลซื้อสินค้าเข้าร้าน 4 บิล ระวังบิลที่ผู้ขายไม่ได้จด VAT',
        intro: 'บิลที่ผู้ขายไม่ได้จด VAT จะไม่มีภาษีซื้อให้นำมาหักกลบ · บิลที่รวม VAT แล้วต้องถอดภาษีออกก่อน',
        build(R) {
          const sh = R.pick(SH);
          const a1 = step(R, 15000, 90000, 5000);
          const a2 = step(R, 15000, 90000, 5000);
          const nb = step(R, 10000, 70000, 5000);
          const xb = step(R, 3000, 15000, 1000);
          const P = a1 + a2 + nb;
          const g1 = a1 * 107 / 100, g2 = a2 * 107 / 100;
          let si = 0;
          const bills = R.shuffle([
            { k: 'g', amt: g1, base: a1, note: `ราคา<b>รวม</b> VAT ${v}% แล้ว` },
            { k: 'g', amt: g2, base: a2, note: `ราคา<b>รวม</b> VAT ${v}% แล้ว` },
            { k: 'n', amt: nb, base: nb, note: `ราคา<b>ยังไม่รวม</b> VAT` },
            { k: 'x', amt: xb, base: 0, note: `ผู้ขาย<b>ไม่ได้จด VAT</b> (ไม่มีสิทธิออกใบกำกับภาษี)` }
          ]).map(b => Object.assign(b, { sup: b.k === 'x' ? sh.sup[3] : sh.sup[si++] }));

          const inn = r2(P * v / 100);

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.1em;margin-bottom:6px">📦 บิลซื้อสินค้าเข้าร้านในเดือนนี้</div>
              <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:0.9em">
                <thead><tr style="background:var(--navy);color:#fff"><th style="padding:6px">บิล</th><th style="padding:6px;text-align:left">ผู้ขาย</th><th style="padding:6px;text-align:right">ยอดในบิล</th><th style="padding:6px;text-align:left">หมายเหตุ</th></tr></thead>
                <tbody>
                  ${bills.map((b, i) => `<tr style="border-bottom:1px solid #ddd"><td style="padding:6px;text-align:center">${i + 1}</td><td style="padding:6px">${b.sup}</td><td style="padding:6px;text-align:right">${bahtd(b.amt)}</td><td style="padding:6px">${b.note}</td></tr>`).join('')}
                </tbody>
              </table>
              <div style="margin-top:8px;font-size:0.88em;color:#c00">⚠️ คำเตือน: บิลของผู้ขายที่ไม่ได้จด VAT ไม่สามารถนำมาคิดเป็นภาษีซื้อได้</div>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ยอดซื้อก่อน VAT',
                  q: 'ยอดซื้อก่อน VAT รวม (เฉพาะบิลที่มีสิทธินำมาคิดภาษีซื้อ) เป็นเงินกี่บาท',
                  answer: P, unit: 'บาท', tol: 0.01,
                  hint: 'ถอด VAT ออกจากบิลที่รวม VAT (ยอด × 100/107) บวกกับบิลที่ยังไม่รวม VAT และตัดบิลที่ไม่ได้จด VAT ออก',
                  why: `ยอดซื้อก่อน VAT ที่มีสิทธิ = ${baht(a1)} + ${baht(a2)} + ${baht(nb)} = <b>${baht(P)} บาท</b>`,
                  verify: () => P
                }),
                Q.fill({
                  label: 'ภาษีซื้อรวม',
                  q: `ภาษีซื้อรวมของเดือนนี้ (${v}%) เป็นเงินกี่บาท`,
                  answer: inn, unit: 'บาท', tol: 0.01,
                  hint: `ภาษีซื้อ = ยอดซื้อก่อน VAT × ${v}/100`,
                  why: `ภาษีซื้อ = ${baht(P)} × ${v}/100 = <b>${bahtd(inn)} บาท</b>`,
                  verify: () => inn
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 3', title: 'ด่าน 3 · ขั้นที่ 3: สรุปภาษีที่ต้องชำระ', kind: 'P', points: 1,
        skill: 'คำนวณภาษีที่ต้องนำส่งหรือขอคืนจากภาษีขายและภาษีซื้อ',
        desc: 'นำภาษีขายและภาษีซื้อมาหักกลบกันเพื่อสรุปยอดนำส่ง ภ.พ.30',
        intro: 'ภาษีที่ต้องชำระ = ภาษีขาย − ภาษีซื้อ (ถ้าผลเป็นบวก = ต้องนำส่งเพิ่ม, ถ้าผลเป็นลบ = ขอคืนหรือเครดิตภาษี)',
        build(R) {
          const neg = R.chance(0.5);
          let S = step(R, 120000, 240000, 10000);
          let P = neg ? S + step(R, 20000, 80000, 10000) : S - step(R, 20000, 80000, 10000);
          const out = r2(S * v / 100);
          const inn = r2(P * v / 100);
          const diff = r2(Math.abs(out - inn));
          const pay = out >= inn;

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.1em;margin-bottom:6px">📊 สรุปยอดภาษีประจำเดือน</div>
              <p style="margin:4px 0">ภาษีขายรวมของเดือนนี้: <b>${bahtd(out)} บาท</b></p>
              <p style="margin:4px 0">ภาษีซื้อรวมของเดือนนี้: <b>${bahtd(inn)} บาท</b></p>
            </div>
          `;

          const dirOpts = [
            'ต้องนำส่งภาษีให้กรมสรรพากรเพิ่ม',
            'ไม่ต้องนำส่ง — ขอคืนภาษี หรือยกยอดไปเป็นเครดิตภาษีเดือนถัดไป'
          ];

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ผลต่างภาษี',
                  q: 'ผลต่างระหว่างภาษีขายกับภาษีซื้อ (|ภาษีขาย − ภาษีซื้อ|) เป็นเงินกี่บาท',
                  answer: diff, unit: 'บาท', tol: 0.01,
                  hint: `ผลต่าง = |${bahtd(out)} − ${bahtd(inn)}|`,
                  why: `|ภาษีขาย − ภาษีซื้อ| = |${bahtd(out)} − ${bahtd(inn)}| = <b>${bahtd(diff)} บาท</b>`,
                  verify: () => diff
                }),
                Q.choice({
                  label: 'ทิศทางภาษี',
                  q: 'ผลลัพธ์ของเดือนนี้ ทางร้านต้องดำเนินการอย่างไร',
                  options: dirOpts,
                  answer: pay ? 0 : 1,
                  shuffle: false,
                  why: pay
                    ? `ภาษีขาย (${bahtd(out)}) มากกว่า ภาษีซื้อ (${bahtd(inn)}) → <b>ต้องนำส่งภาษี ${bahtd(diff)} บาท</b>`
                    : `ภาษีซื้อ (${bahtd(inn)}) มากกว่า ภาษีขาย (${bahtd(out)}) → <b>ไม่ต้องนำส่ง มีภาษีส่วนเกิน ${bahtd(diff)} บาท ขอคืนหรือเครดิตได้</b>`,
                  verify: () => (pay ? 0 : 1)
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 4', title: 'ด่าน 4 · ขั้นที่ 4: สรุปและตัดสินใจ', kind: 'P', points: 1,
        skill: 'ทำความเข้าใจความหมายทางธุรกิจและเกณฑ์การจดทะเบียน VAT 1.8 ล้านบาท',
        desc: 'ประเมินรายรับทั้งปีเทียบกับเพดาน 1,800,000 บาทต่อปี',
        intro: 'เกณฑ์ 1.8 ล้านบาทต่อปี เทียบกับ “ยอดขาย (รายรับ)” ไม่ใช่ตัวภาษีหรือกำไร',
        build(R) {
          const S = step(R, 100000, 200000, 10000);
          const ann = S * 12;
          const must = ann > TH;

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.1em;margin-bottom:6px">📈 ประมาณการรายรับทั้งปี</div>
              <p style="margin:4px 0">ถ้าร้านมียอดขายเฉลี่ยเดือนละ <b>${baht(S)} บาท</b> (ก่อน VAT) สม่ำเสมอตลอด 12 เดือน</p>
            </div>
          `;

          const regOpts = [
            'ต้องจดทะเบียนภาษีมูลค่าเพิ่ม (รายรับเกิน 1.8 ล้านบาทต่อปี)',
            'ยังไม่ต้องจดทะเบียนภาษีมูลค่าเพิ่ม (รายรับไม่เกิน 1.8 ล้านบาทต่อปี)'
          ];

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'รายรับทั้งปี',
                  q: `รายรับรวมทั้งปี (12 เดือน) เป็นเงินกี่บาท`,
                  answer: ann, unit: 'บาท', tol: 0.01,
                  hint: `รายรับทั้งปี = ${baht(S)} × 12`,
                  why: `รายรับทั้งปี = ${baht(S)} × 12 = <b>${baht(ann)} บาท</b>`,
                  verify: () => ann
                }),
                Q.choice({
                  label: 'เกณฑ์จดทะเบียน VAT',
                  q: `เมื่อเทียบกับเกณฑ์กฎหมาย (${baht(TH)} บาทต่อปี) ร้านนี้ต้องจดทะเบียน VAT หรือไม่`,
                  options: regOpts,
                  answer: must ? 0 : 1,
                  shuffle: false,
                  why: `รายรับทั้งปี ${baht(ann)} บาท ${must ? 'เกิน' : 'ไม่เกิน'} เกณฑ์ 1,800,000 บาท → <b>${must ? 'ต้องจดทะเบียน VAT' : 'ยังไม่จำเป็นต้องจดทะเบียน VAT'}</b>`,
                  verify: () => (must ? 0 : 1)
                })
              ]
            })
          ];
        }
      }
    ]
  };
})();
