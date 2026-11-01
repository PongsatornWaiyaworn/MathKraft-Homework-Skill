/* HW-14 · ภารกิจ 3 วางแผนภาษีของฉัน */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  const TX = {
    personal: 60000,
    parent: 30000,
    ssoRate: 5,
    ssoWageCap: 17500,
    ssoMax: 10500,
    lifeCap: 100000,
    expenseCap: 100000,
    expensePct: 50,
    brackets: [
      { upTo: 150000, rate: 0 },
      { upTo: 300000, rate: 5 },
      { upTo: 500000, rate: 10 },
      { upTo: 750000, rate: 15 },
      { upTo: 1000000, rate: 20 },
      { upTo: 2000000, rate: 25 },
      { upTo: 5000000, rate: 30 },
      { upTo: Infinity, rate: 35 }
    ]
  };

  const B = TX.brackets;

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }

  function prevUp(i) { return i ? B[i - 1].upTo : 0; }
  function taxCalc(net) {
    let rem = Math.max(0, net), tot = 0, last = 0;
    const rows = [];
    for (let i = 0; i < B.length; i++) {
      const from = prevUp(i), to = B[i].upTo, span = to - from;
      if (rem <= 0) break;
      const amt = Math.min(rem, span);
      const tx = r2(amt * B[i].rate / 100);
      rows.push({ from, to, amt, rate: B[i].rate, tax: tx });
      tot += tx;
      last = B[i].rate;
      rem -= amt;
    }
    return { tax: r2(tot), rows, top: last };
  }

  const sso = m => Math.min(Math.min(m, TX.ssoWageCap) * TX.ssoRate / 100 * 12, TX.ssoMax);
  const NAMES = ['คุณธัญญ่า', 'คุณณัฐ', 'คุณอรอุมา', 'คุณภาคิน', 'คุณพิมพ์ชนก', 'คุณกันตพงศ์'];

  window.HW = {
    id: 'HW-14', unit: 3, unitName: 'หน่วยที่ 3 การคำนวณและการวางแผนภาษี', title: 'วางแผนภาษีของฉัน',
    sub: 'ภารกิจใหญ่ท้ายรายวิชา: วางแผนภาษีครบวงจร คำนวณเงินได้ หักค่าใช้จ่ายและค่าลดหย่อน คำนวณภาษีเดิม แล้ววางแผนใช้สิทธิลดหย่อนเพิ่มเติมเพื่อประหยัดภาษีอย่างคุ้มค่า',
    size: '6 ขั้น · 25 นาที', K: 0, P: 6,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ขั้นที่ 1: เงินได้พึงประเมินทั้งปี', kind: 'P', points: 1,
        skill: 'รวบรวมและคำนวณเงินได้พึงประเมินทั้งปี',
        desc: 'รวมเงินได้จากเงินเดือน โบนัส และงานพิเศษ',
        intro: 'นำรายรับทั้งหมดตลอดทั้งปีมารวมกันเป็นเงินได้พึงประเมิน',
        build(R) {
          const name = R.pick(NAMES);
          const m = R.pick([35000, 42000, 48000, 55000]);
          const bonus = m * 2;
          const inc = m * 12 + bonus;

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.15em">👤 โปรไฟล์ผู้เสียภาษี: ${name}</div>
              <p style="margin:6px 0">• เงินเดือน: <b>${baht(m)} บาท/เดือน</b> (12 เดือน)</p>
              <p style="margin:6px 0">• โบนัสปลายปี: <b>2 เดือน</b> (= ${baht(bonus)} บาท)</p>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'เงินได้พึงประเมินทั้งปี',
                  q: `เงินได้พึงประเมินตลอดทั้งปีของ ${name} เป็นเงินกี่บาท`,
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
        short: 'ด่าน 2', title: 'ด่าน 2 · ขั้นที่ 2: ค่าใช้จ่ายและค่าลดหย่อนเดิม', kind: 'P', points: 1,
        skill: 'คำนวณค่าใช้จ่ายและค่าลดหย่อนพื้นฐานเดิม',
        desc: 'หักค่าใช้จ่าย 50% (ไม่เกิน 1 แสน) และรวมค่าลดหย่อนเดิม',
        intro: 'ส่วนตัว 60,000 + ประกันสังคม (คำนวณจากฐานเงินเดือนสูงสุด 17,500 บาท)',
        build(R) {
          const m = R.pick([35000, 42000, 48000, 55000]);
          const ss = sso(m);
          const allowOld = TX.personal + ss;

          return [
            Q.fill({
              label: 'ค่าลดหย่อนเดิม',
              q: `ค่าลดหย่อนเดิมที่มีอยู่ (ค่าลดหย่อนส่วนตัว 60,000 บาท + เงินสมทบประกันสังคม ${baht(ss)} บาท) รวมเป็นเงินกี่บาท`,
              answer: allowOld, unit: 'บาท', tol: 0.01,
              hint: `ค่าลดหย่อน = 60,000 + ${baht(ss)}`,
              why: `ค่าลดหย่อนเดิม = 60,000 + ${baht(ss)} = <b>${baht(allowOld)} บาท</b>`,
              verify: () => allowOld
            })
          ];
        }
      },
      {
        short: 'ด่าน 3', title: 'ด่าน 3 · ขั้นที่ 3: เงินได้สุทธิเดิม', kind: 'P', points: 1,
        skill: 'คำนวณเงินได้สุทธิก่อนเริ่มวางแผนภาษีเพิ่มเติม',
        desc: 'คำนวณเงินได้สุทธิ = เงินได้ − ค่าใช้จ่าย − ค่าลดหย่อนเดิม',
        intro: 'เงินได้สุทธิเดิมจะเป็นฐานในการคำนวณภาษีอัตราขั้นบันไดเดิม',
        build(R) {
          const m = R.pick([35000, 42000, 48000]);
          const bonus = m * 2;
          const inc = m * 12 + bonus;
          const exp = TX.expenseCap;
          const ss = sso(m);
          const allowOld = TX.personal + ss;
          const netOld = inc - exp - allowOld;

          return [
            Q.fill({
              label: 'เงินได้สุทธิเดิม',
              q: `เงินได้สุทธิเดิม (ก่อนวางแผนลดหย่อนเพิ่ม) มีค่าเท่ากับกี่บาท`,
              answer: netOld, unit: 'บาท', tol: 0.01,
              hint: `เงินได้สุทธิ = ${baht(inc)} − ${baht(exp)} − ${baht(allowOld)}`,
              why: `เงินได้สุทธิเดิม = ${baht(inc)} − ${baht(exp)} − ${baht(allowOld)} = <b>${baht(netOld)} บาท</b>`,
              verify: () => netOld
            })
          ];
        }
      },
      {
        short: 'ด่าน 4', title: 'ด่าน 4 · ขั้นที่ 4: ภาษีเดิมที่ต้องชำระ', kind: 'P', points: 1,
        skill: 'คำนวณภาษีเงินได้บุคคลธรรมดาเดิมตามอัตราขั้นบันได',
        desc: 'คำนวณภาษีเดิมจากเงินได้สุทธิเดิม',
        intro: 'คำนวณตามขั้นบันได 150,000 แรกยกเว้น, 150,000–300,000 (5%), 300,000–500,000 (10%)',
        build(R) {
          const netOld = R.pick([360000, 420000, 480000]);
          const taxOld = taxCalc(netOld).tax;

          return [
            Q.fill({
              label: 'ภาษีเดิม',
              q: `จากเงินได้สุทธิเดิม <b>${baht(netOld)} บาท</b> จะต้องเสียภาษีเงินได้บุคคลธรรมดาเดิมกี่บาท`,
              answer: taxOld, unit: 'บาท', tol: 0.01,
              hint: `ภาษีสะสม 300,000 แรก = 7,500 บาท + ส่วนเกิน 300,000 × 10%`,
              why: `ภาษีเดิม = 7,500 + (${baht(netOld - 300000)} × 10%) = <b>${baht(taxOld)} บาท</b>`,
              verify: () => taxOld
            })
          ];
        }
      },
      {
        short: 'ด่าน 5', title: 'ด่าน 5 · ขั้นที่ 5: วางแผนเพิ่มค่าลดหย่อน', kind: 'P', points: 1,
        skill: 'คำนวณเงินได้สุทธิใหม่และภาษีใหม่หลังเพิ่มค่าลดหย่อน',
        desc: 'จำลองการซื้อประกันชีวิตและกองทุนลดหย่อนเพิ่ม 50,000 บาท',
        intro: 'เมื่อเพิ่มค่าลดหย่อน 50,000 บาท เงินได้สุทธิจะลดลง 50,000 บาท ส่งผลให้ภาษีใหม่ลดลง',
        build(R) {
          const netOld = R.pick([380000, 440000, 500000]);
          const addPlan = 50000;
          const netNew = netOld - addPlan;
          const taxNew = taxCalc(netNew).tax;

          return [
            Q.fill({
              label: 'ภาษีใหม่หลังวางแผน',
              q: `หากตัดสินใจซื้อเบี้ยประกันชีวิตและกองทุนลดหย่อนภาษีเพิ่มอีก <b>${baht(addPlan)} บาท</b> ทำให้เงินได้สุทธิใหม่ลดลงเหลือ <b>${baht(netNew)} บาท</b> ภาษีที่ต้องเสียใหม่จะเป็นกี่บาท`,
              answer: taxNew, unit: 'บาท', tol: 0.01,
              hint: `คำนวณภาษีจากเงินได้สุทธิใหม่ ${baht(netNew)} บาท`,
              why: `ภาษีใหม่คำนวณจากเงินได้สุทธิ ${baht(netNew)} บาท = <b>${baht(taxNew)} บาท</b>`,
              verify: () => taxNew
            })
          ];
        }
      },
      {
        short: 'ด่าน 6', title: 'ด่าน 6 · ขั้นที่ 6: ภาษีที่ประหยัดได้จริง', kind: 'P', points: 1,
        skill: 'คำนวณผลประโยชน์ภาษีสุทธิที่ประหยัดได้จากการวางแผน',
        desc: 'คำนวณภาษีเดิม − ภาษีใหม่ = ภาษีที่ประหยัดได้จริง',
        intro: 'ภาษีที่ประหยัดได้จริง = ภาษีเดิม − ภาษีใหม่',
        build(R) {
          const netOld = R.pick([380000, 440000, 500000]);
          const addPlan = 50000;
          const netNew = netOld - addPlan;
          const taxOld = taxCalc(netOld).tax;
          const taxNew = taxCalc(netNew).tax;
          const saved = r2(taxOld - taxNew);

          return [
            Q.fill({
              label: 'ภาษีที่ประหยัดได้',
              q: `จากภาษีเดิม <b>${baht(taxOld)} บาท</b> และภาษีใหม่ <b>${baht(taxNew)} บาท</b> การวางแผนเพิ่มค่าลดหย่อนนี้ช่วยประหยัดภาษีได้กี่บาท`,
              answer: saved, unit: 'บาท', tol: 0.01,
              hint: `ภาษีที่ประหยัดได้ = ${baht(taxOld)} − ${baht(taxNew)}`,
              why: `ภาษีที่ประหยัดได้จริง = ${baht(taxOld)} − ${baht(taxNew)} = <b>${baht(saved)} บาท</b> (คิดเป็น 10% ของเงิน 50,000 บาทที่นำไปลดหย่อน)`,
              verify: () => saved
            })
          ];
        }
      }
    ]
  };
})();
