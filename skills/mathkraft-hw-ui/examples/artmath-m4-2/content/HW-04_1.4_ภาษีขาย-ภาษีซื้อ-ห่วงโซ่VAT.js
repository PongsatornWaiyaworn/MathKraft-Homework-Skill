/* HW-04 · 1.4 ภาษีขาย ภาษีซื้อ และภาษีที่ต้องชำระ */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const v = 7;

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function bahtd(n) { return fmt(r2(n), 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }

  window.HW = {
    id: 'HW-04', unit: 1, unitName: 'หน่วยที่ 1 ภาษีมูลค่าเพิ่ม', title: 'ภาษีขาย ภาษีซื้อ และภาษีที่ต้องชำระ',
    sub: 'ทำความเข้าใจห่วงโซ่ภาษีมูลค่าเพิ่ม (VAT Supply Chain) และการคำนวณภาษีที่ต้องนำส่ง: ภาษีขาย − ภาษีซื้อ = ภาษีที่ต้องชำระ (หรือขอคืน)',
    size: '12 ข้อ · 12 นาที', K: 3, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ห่วงโซ่การขาย 3 ทอด', kind: 'K', points: 2.5,
        skill: 'คำนวณภาษีขาย ภาษีซื้อ และภาษีที่ต้องนำส่งในแต่ละทอดของห่วงโซ่',
        desc: 'เติมตัวเลขลงในแผนภาพห่วงโซ่สินค้า ผู้ผลิต → ผู้ค้าส่ง → ผู้ค้าปลีก → ผู้บริโภค',
        intro: 'หลักสำคัญ: ภาษีที่นำส่ง = ภาษีขาย − ภาษีซื้อ · ภาษีซื้อของผู้ซื้อ คือภาษีขายของผู้ขายในทอดก่อนหน้า',
        build(R) {
          const goods = [
            ['ผ้าใบวาดภาพ', 'โรงงานผ้าใบ', 'ร้านส่งอุปกรณ์ศิลปะ', 'ร้านเครื่องเขียน'],
            ['กรอบรูปไม้', 'โรงงานกรอบรูป', 'ร้านขายส่งกรอบรูป', 'ร้านแต่งภาพ'],
            ['เสื้อยืดสกรีนลาย', 'โรงงานเสื้อสกรีน', 'ร้านค้าส่งเสื้อผ้า', 'ร้านเสื้อผ้าวัยรุ่น'],
            ['ชุดสีน้ำ', 'โรงงานผลิตสี', 'บริษัทจัดจำหน่ายสี', 'ร้านศิลป์ภัณฑ์'],
            ['เครื่องปั้นดินเผา', 'โรงปั้นเซรามิก', 'ร้านรับซื้อเครื่องเซรามิก', 'ร้านของที่ระลึก']
          ];
          const [gn, n1, n2, n3] = R.pick(goods);
          let s1, s2, s3;
          do {
            s1 = step(R, 24000, 58000, 2000);
            s2 = s1 + step(R, 6000, 22000, 2000);
            s3 = s2 + step(R, 8000, 30000, 2000);
          } while (s1 === 50000 || s2 === 65000 || s3 === 80000);

          const o1 = r2(s1 * v / 100);
          const i2 = o1;
          const o2 = r2(s2 * v / 100);
          const i3 = o2;
          const o3 = r2(s3 * v / 100);
          const r1 = o1;
          const r2_ = r2(o2 - i2);
          const r3 = r2(o3 - i3);
          const tot = r2(r1 + r2_ + r3);
          const cv = o3;

          const chainStory = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.1em;margin-bottom:6px">⛓️ ห่วงโซ่สินค้า: ${gn} (ราคาทุกทอด “ยังไม่รวม VAT”)</div>
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px">
                <div style="background:#fff;border:1.5px solid var(--navy);border-radius:8px;padding:8px 12px;flex:1;min-width:140px">
                  <b>ทอดที่ 1: ${n1}</b><br>
                  ขายให้ผู้ค้าส่ง: <b>${baht(s1)} บาท</b>
                </div>
                <div style="background:#fff;border:1.5px solid var(--navy);border-radius:8px;padding:8px 12px;flex:1;min-width:140px">
                  <b>ทอดที่ 2: ${n2}</b><br>
                  ขายให้ผู้ค้าปลีก: <b>${baht(s2)} บาท</b>
                </div>
                <div style="background:#fff;border:1.5px solid var(--navy);border-radius:8px;padding:8px 12px;flex:1;min-width:140px">
                  <b>ทอดที่ 3: ${n3}</b><br>
                  ขายให้ผู้บริโภค: <b>${baht(s3)} บาท</b>
                </div>
              </div>
            </div>
          `;

          return [
            Q.group({
              story: chainStory,
              parts: [
                Q.fill({
                  label: 'ทอดที่ 1: โรงงานผู้ผลิต',
                  q: `<b>1) โรงงาน (${n1})</b> ขายสินค้า ${baht(s1)} บาท`,
                  fields: [
                    { label: 'ภาษีขาย 7%', answer: o1, unit: 'บาท', tol: 0.01 },
                    { label: 'ภาษีที่ต้องนำส่งสรรพากร', answer: r1, unit: 'บาท', tol: 0.01 }
                  ],
                  why: `ภาษีขาย = ${baht(s1)} × 7/100 = <b>${bahtd(o1)} บาท</b> (ไม่มีภาษีซื้อ จึงนำส่งเท่ากับภาษีขาย = ${bahtd(r1)} บาท)`,
                  verify: () => [o1, r1]
                }),
                Q.fill({
                  label: 'ทอดที่ 2: ผู้ค้าส่ง',
                  q: `<b>2) ผู้ค้าส่ง (${n2})</b> ซื้อมา ${baht(s1)} บาท แล้วขายต่อ ${baht(s2)} บาท`,
                  fields: [
                    { label: 'ภาษีซื้อ (ที่จ่ายให้โรงงาน)', answer: i2, unit: 'บาท', tol: 0.01 },
                    { label: 'ภาษีขาย (ที่เก็บจากร้านค้าปลีก)', answer: o2, unit: 'บาท', tol: 0.01 },
                    { label: 'ภาษีที่ต้องนำส่ง (ภาษีขาย − ภาษีซื้อ)', answer: r2_, unit: 'บาท', tol: 0.01 }
                  ],
                  why: `ภาษีซื้อ = ${bahtd(i2)} บาท · ภาษีขาย = ${baht(s2)} × 7/100 = ${bahtd(o2)} บาท · นำส่ง = ${bahtd(o2)} − ${bahtd(i2)} = <b>${bahtd(r2_)} บาท</b>`,
                  verify: () => [i2, o2, r2_]
                }),
                Q.fill({
                  label: 'ทอดที่ 3: ร้านค้าปลีก',
                  q: `<b>3) ร้านค้าปลีก (${n3})</b> ซื้อมา ${baht(s2)} บาท แล้วขายให้ผู้บริโภค ${baht(s3)} บาท`,
                  fields: [
                    { label: 'ภาษีซื้อ (ที่จ่ายให้ผู้ค้าส่ง)', answer: i3, unit: 'บาท', tol: 0.01 },
                    { label: 'ภาษีขาย (ที่เก็บจากผู้บริโภค)', answer: o3, unit: 'บาท', tol: 0.01 },
                    { label: 'ภาษีที่ต้องนำส่ง (ภาษีขาย − ภาษีซื้อ)', answer: r3, unit: 'บาท', tol: 0.01 }
                  ],
                  why: `ภาษีซื้อ = ${bahtd(i3)} บาท · ภาษีขาย = ${baht(s3)} × 7/100 = ${bahtd(o3)} บาท · นำส่ง = ${bahtd(o3)} − ${bahtd(i3)} = <b>${bahtd(r3)} บาท</b>`,
                  verify: () => [i3, o3, r3]
                }),
                Q.fill({
                  label: 'สรุปภาพรวมห่วงโซ่',
                  q: `<b>4) สรุปภาพรวมของห่วงโซ่นี้</b>`,
                  fields: [
                    { label: 'ภาษีรวมที่สรรพากรได้รับ (นำส่ง 3 ทอดรวมกัน)', answer: tot, unit: 'บาท', tol: 0.01 },
                    { label: 'VAT ทั้งหมดที่ผู้บริโภคคนสุดท้ายเป็นผู้จ่าย', answer: cv, unit: 'บาท', tol: 0.01 }
                  ],
                  why: `ภาษีรวมที่นำส่ง = ${bahtd(r1)} + ${bahtd(r2_)} + ${bahtd(r3)} = <b>${bahtd(tot)} บาท</b> ซึ่งเท่ากับ VAT ที่ผู้บริโภคจ่ายทั้งหมด (${baht(s3)} × 7/100 = <b>${bahtd(cv)} บาท</b>) พอดี!`,
                  verify: () => [tot, cv]
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · ภาษีซื้อมากกว่าภาษีขาย', kind: 'K', points: 0.5,
        skill: 'ตัดสินใจและคำนวณกรณีภาษีซื้อมากกว่าภาษีขาย (ขอคืนภาษี)',
        desc: 'ร้านที่ซื้อสินค้าเข้าร้านมากกว่าที่ขายได้ในเดือนนั้น',
        intro: 'ถ้าภาษีขาย − ภาษีซื้อ ได้ค่าติดลบ แสดงว่าไม่ต้องนำส่ง แต่มีสิทธิขอคืนภาษีหรือยกไปเครดิตภาษีเดือนถัดไป',
        build(R) {
          const monthN = R.pick(['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']);
          const shop = R.pick(['ร้านปั้นดินเผาริมคลอง', 'ร้านผ้าบาติกสีสด', 'ร้านโปสเตอร์ลายเส้น', 'ร้านกรอบรูปมุมถนน', 'ร้านสติกเกอร์ลายไทย']);
          let S, P;
          do {
            S = step(R, 80000, 240000, 10000);
            P = S + step(R, 40000, 140000, 10000);
          } while (S === 200000 || P === 300000);

          const sT = r2(S * v / 100);
          const pT = r2(P * v / 100);
          const ex = r2(Math.abs(sT - pT));

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.05em">📦 สถานการณ์: ${shop} (เดือน${monthN})</div>
              <p style="margin:6px 0">ร้านซื้อสินค้าเตรียมสต็อกไว้ขาย ยอดซื้อ <b>${baht(P)} บาท</b> (ภาษีซื้อ = ${baht(P)} × 7% = <b>${bahtd(pT)} บาท</b>)<br>
              แต่เดือนนี้มียอดขาย <b>${baht(S)} บาท</b> (ภาษีขาย = ${baht(S)} × 7% = <b>${bahtd(sT)} บาท</b>)</p>
            </div>
          `;

          const dirOptions = [
            'ไม่ต้องนำส่ง — มีภาษีส่วนเกินให้ขอคืน หรือยกไปเครดิตในเดือนถัดไป',
            'ต้องนำส่งภาษีให้กรมสรรพากรเพิ่ม',
            'ไม่ต้องนำส่ง และไม่มีสิทธิทำอะไรกับภาษีที่เหลือ'
          ];

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ข้อ 1',
                  q: 'ผลต่างระหว่างภาษีขายกับภาษีซื้อ (|ภาษีขาย − ภาษีซื้อ|) เท่ากับกี่บาท',
                  answer: ex, unit: 'บาท', tol: 0.01,
                  hint: `ผลต่าง = |${bahtd(sT)} − ${bahtd(pT)}|`,
                  why: `ภาษีขาย − ภาษีซื้อ = ${bahtd(sT)} − ${bahtd(pT)} = −${bahtd(ex)} บาท → มีภาษีส่วนเกิน <b>${bahtd(ex)} บาท</b>`,
                  verify: () => ex
                }),
                Q.choice({
                  label: 'ข้อ 2',
                  q: 'ผลลัพธ์ของเดือนนี้ ทางร้านต้องดำเนินการอย่างไร',
                  options: dirOptions,
                  answer: 0,
                  shuffle: false,
                  why: `เนื่องจากภาษีซื้อมากกว่าภาษีขาย จึงไม่ต้องนำส่งภาษี และมีสิทธิขอคืนเงินภาษี <b>${bahtd(ex)} บาท</b> หรือยกยอดไปหักกลบเป็นเครดิตภาษีในเดือนถัดไปได้`,
                  verify: () => 0
                })
              ]
            })
          ];
        }
      }
    ]
  };
})();
