/* HW-09 · ภารกิจ 2 หาเงินได้สุทธิของบุคคลสมมติ */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  const TX = {
    personal: 60000,
    spouse: 60000,
    child: 30000,
    child2: 60000,
    parent: 30000,
    parentAge: 60,
    parentIncomeMax: 30000,
    ssoRate: 5,
    ssoWageCap: 17500,
    ssoMax: 10500,
    lifeCap: 100000,
    expenseCap: 100000,
    expensePct: 50
  };

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }
  const sso = m => Math.min(Math.min(m, TX.ssoWageCap) * TX.ssoRate / 100 * 12, TX.ssoMax);

  const NAMES = ['คุณวิภา', 'คุณชัยวัฒน์', 'คุณสุดา', 'คุณนที', 'คุณพิชญา', 'คุณกฤต', 'คุณรัตนา', 'คุณอานนท์'];

  window.HW = {
    id: 'HW-09', unit: 2, unitName: 'หน่วยที่ 2 ภาษีเงินได้บุคคลธรรมดา', title: 'หาเงินได้สุทธิของบุคคลสมมติ',
    sub: 'ภารกิจรวมหน่วยที่ 2: รวบรวมข้อมูลเงินได้ คัดกรองสิทธิค่าลดหย่อนที่ใช้ได้จริง (ระวังรายการลวงที่ไม่เข้าเกณฑ์) และคำนวณเงินได้สุทธิทีละขั้น',
    size: '5 ขั้น · 20 นาที', K: 0, P: 5,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ขั้นที่ 1: เงินได้พึงประเมินทั้งปี', kind: 'P', points: 1,
        skill: 'คำนวณเงินได้พึงประเมินทั้งปีจากเงินเดือนและโบนัส',
        desc: 'รวมเงินเดือน 12 เดือนและเงินโบนัสปลายปี',
        intro: 'เงินได้พึงประเมินทั้งปี (มาตรา 40(1)) = (เงินเดือน × 12) + โบนัส',
        build(R) {
          const name = R.pick(NAMES);
          const m = R.pick([24000, 28000, 32000, 36000, 42000, 48000]);
          const k = R.pick([1, 2, 3]);
          const bonus = m * k;
          const inc = m * 12 + bonus;

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.15em">👤 โปรไฟล์: ${name}</div>
              <p style="margin:6px 0">• เงินเดือน: <b>${baht(m)} บาท/เดือน</b></p>
              <p style="margin:6px 0">• โบนัสปลายปี: <b>${k} เดือน</b> (= ${baht(bonus)} บาท)</p>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'เงินได้ทั้งปี',
                  q: `<b>${name}</b> มีเงินได้พึงประเมินตลอดปีภาษีรวมเป็นเงินกี่บาท`,
                  answer: inc, unit: 'บาท', tol: 0.01,
                  hint: `เงินได้ทั้งปี = (${baht(m)} × 12) + ${baht(bonus)}`,
                  why: `เงินได้ทั้งปี = (${baht(m)} × 12) + ${baht(bonus)} = <b>${baht(inc)} บาท</b>`,
                  verify: () => inc
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · ขั้นที่ 2: หักค่าใช้จ่าย', kind: 'P', points: 1,
        skill: 'คำนวณค่าใช้จ่ายเงินได้ประเภท 40(1) ภายใต้เพดาน 100,000 บาท',
        desc: 'หักค่าใช้จ่าย 50% แต่ไม่เกิน 100,000 บาท',
        intro: 'เงินได้ 40(1) หักค่าใช้จ่ายเป็นการเหมาได้ 50% แต่สูงสุดไม่เกิน 100,000 บาท',
        build(R) {
          const m = R.pick([24000, 28000, 32000, 36000, 42000, 48000]);
          const k = R.pick([1, 2]);
          const inc = m * 12 + m * k;
          const exp = Math.min(inc * 0.5, TX.expenseCap);

          return [
            Q.fill({
              label: 'ค่าใช้จ่ายที่หักได้',
              q: `จากเงินได้พึงประเมินทั้งปี <b>${baht(inc)} บาท</b> จะหักค่าใช้จ่ายตามกฎหมายได้กี่บาท`,
              answer: exp, unit: 'บาท', tol: 0.01,
              hint: `50% ของ ${baht(inc)} คือ ${baht(inc * 0.5)} บาท แต่กฎหมายกำหนดเพดานสูงสุด 100,000 บาท`,
              why: `50% ของเงินได้ = ${baht(inc * 0.5)} บาท → หักได้ตามเพดานสูงสุด <b>${baht(exp)} บาท</b>`,
              verify: () => exp
            })
          ];
        }
      },
      {
        short: 'ด่าน 3', title: 'ด่าน 3 · ขั้นที่ 3: สรุปค่าลดหย่อน', kind: 'P', points: 1,
        skill: 'คัดกรองสิทธิค่าลดหย่อนและตัดรายการที่ไม่เข้าเกณฑ์',
        desc: 'รวมยอดค่าลดหย่อนที่ใช้สิทธิได้จริง (ระวังรายการลวงที่ไม่เข้าเกณฑ์)',
        intro: 'ตรวจดูทุกรายการ: ส่วนตัว 60,000 + ประกันสังคม + ค่าลดหย่อนครอบครัว/ประกัน (ถ้าเข้าเกณฑ์)',
        build(R) {
          const m = R.pick([25000, 30000, 35000, 40000]);
          const ssoAmt = sso(m);
          const life = step(R, 20000, 45000, 5000);
          const momAge = R.pick([62, 65, 68]);
          const parentAmt = TX.parent;
          // Trap: dad has pension 45,000 (exceeds 30,000 income cap -> cannot claim!)
          const totalAllow = TX.personal + ssoAmt + life + parentAmt;

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.1em;margin-bottom:8px">📋 ข้อมูลการใช้สิทธิลดหย่อนประจำปี:</div>
              <ul style="margin:0;padding-left:20px;line-height:1.8">
                <li>ค่าลดหย่อนส่วนตัวของผู้มีเงินได้ (ทุกคนได้รับสิทธิ)</li>
                <li>เงินสมทบกองทุนประกันสังคม 5% ของเงินเดือน ${baht(m)} บาท/เดือน (ตลอด 12 เดือน)</li>
                <li>เบี้ยประกันชีวิตทั่วไป (กรมธรรม์อายุ 12 ปี): จ่ายจริง <b>${baht(life)} บาท</b></li>
                <li>อุปการะเลี้ยงดูมารดา: อายุ ${momAge} ปี ไม่มีเงินได้ตลอดทั้งปี</li>
                <li style="color:#c00">อุปการะเลี้ยงดูบิดา: อายุ 64 ปี <b>มีเงินบำนาญปีละ 45,000 บาท</b></li>
              </ul>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ค่าลดหย่อนรวม',
                  q: 'ยอดรวมค่าลดหย่อนที่สามารถนำมาหักได้จริงทั้งหมด เป็นเงินกี่บาท',
                  answer: totalAllow, unit: 'บาท', tol: 0.01,
                  hint: `ส่วนตัว 60,000 + ประกันสังคม ${baht(ssoAmt)} + ประกันชีวิต ${baht(life)} + มารดา 30,000 (ส่วนบิดามีเงินได้เกิน 30,000 บาท จึงใช้สิทธิไม่ได้)`,
                  why: `ค่าลดหย่อนที่ใช้ได้จริง = ส่วนตัว 60,000 + ประกันสังคม ${baht(ssoAmt)} + ประกันชีวิต ${baht(life)} + มารดา 30,000 = <b>${baht(totalAllow)} บาท</b><br><small style="color:#c00">หมายเหตุ: บิดามีเงินบำนาญ 45,000 บาท เกินเกณฑ์ 30,000 บาท จึงไม่ได้รับสิทธิลดหย่อน</small>`,
                  verify: () => totalAllow
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 4', title: 'ด่าน 4 · ขั้นที่ 4: หาเงินได้สุทธิ', kind: 'P', points: 1,
        skill: 'คำนวณเงินได้สุทธิจากสูตร: เงินได้พึงประเมิน − ค่าใช้จ่าย − ค่าลดหย่อน',
        desc: 'นำยอดเงินได้ ค่าใช้จ่าย และค่าลดหย่อนมาคำนวณเงินได้สุทธิ',
        intro: 'เงินได้สุทธิ = เงินได้พึงประเมินทั้งปี − ค่าใช้จ่าย − ค่าลดหย่อน',
        build(R) {
          const m = R.pick([28000, 32000, 36000]);
          const bonus = m * 2;
          const inc = m * 12 + bonus;
          const exp = TX.expenseCap;
          const ssoAmt = sso(m);
          const life = 30000;
          const allow = TX.personal + ssoAmt + life + TX.parent;
          const net = inc - exp - allow;

          return [
            Q.fill({
              label: 'เงินได้สุทธิ',
              q: `กำหนดให้เงินได้พึงประเมินทั้งปี = <b>${baht(inc)} บาท</b>, ค่าใช้จ่ายหักได้ = <b>${baht(exp)} บาท</b>, และค่าลดหย่อนรวม = <b>${baht(allow)} บาท</b><br>เงินได้สุทธิเท่ากับกี่บาท`,
              answer: net, unit: 'บาท', tol: 0.01,
              hint: `เงินได้สุทธิ = ${baht(inc)} − ${baht(exp)} − ${baht(allow)}`,
              why: `เงินได้สุทธิ = ${baht(inc)} − ${baht(exp)} − ${baht(allow)} = <b>${baht(net)} บาท</b>`,
              verify: () => net
            })
          ];
        }
      },
      {
        short: 'ด่าน 5', title: 'ด่าน 5 · ขั้นที่ 5: ตรวจจับรายการลวง', kind: 'P', points: 1,
        skill: 'ระบุเงื่อนไขทางกฎหมายของรายการลดหย่อนที่ไม่ถูกต้อง',
        desc: 'เลือกรายการที่ไม่สามารถนำมาหักลดหย่อนได้ พร้อมเหตุผลประกอบ',
        intro: 'กฎหมายกำหนดเงื่อนไขเฉพาะสำหรับแต่ละรายการลดหย่อน เช่น อายุและเกณฑ์เงินได้ของบิดามารดา',
        build(R) {
          const trapOptions = [
            'อุปการะเลี้ยงดูบิดา (เพราะบิดามีเงินได้เกิน 30,000 บาทต่อปี)',
            'เงินสมทบกองทุนประกันสังคม',
            'เบี้ยประกันชีวิตทั่วไป (กรมธรรม์อายุ 12 ปี)',
            'ค่าลดหย่อนส่วนตัวของผู้มีเงินได้'
          ];

          return [
            Q.choice({
              label: 'รายการที่ใช้สิทธิไม่ได้',
              q: 'จากสถานการณ์ในขั้นที่ 3 รายการใดต่อไปนี้<b>ไม่สามารถ</b>นำมาหักลดหย่อนภาษีได้',
              options: trapOptions,
              answer: 0,
              shuffle: true,
              why: 'บิดามีเงินบำนาญ 45,000 บาทต่อปี ซึ่งเกินเกณฑ์เงินได้พึงประเมินไม่เกิน 30,000 บาทต่อปีตามที่กฎหมายกำหนด จึงไม่สามารถนำมาหักลดหย่อนได้',
              verify: () => 0
            })
          ];
        }
      }
    ]
  };
})();
