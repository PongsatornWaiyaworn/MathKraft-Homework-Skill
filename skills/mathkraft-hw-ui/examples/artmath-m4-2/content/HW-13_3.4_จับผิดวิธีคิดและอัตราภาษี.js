/* HW-13 · 3.4 การพิจารณาอัตราภาษีและการลดหย่อนภาษีอย่างสมเหตุสมผล */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  const TX = {
    personal: 60000,
    expenseCap: 100000,
    expensePct: 50,
    ssoRate: 5,
    ssoWageCap: 17500,
    ssoMax: 10500,
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
  function bandOf(net) { return B.findIndex(b => net <= b.upTo); }

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

  window.HW = {
    id: 'HW-13', unit: 3, unitName: 'หน่วยที่ 3 การคำนวณและการวางแผนภาษี', title: 'การพิจารณาอัตราภาษีและการลดหย่อนภาษีอย่างสมเหตุสมผล',
    sub: 'วิเคราะห์ข้อผิดพลาดในวิธีทำคำนวณภาษีของเพื่อนสมมติ และทำความเข้าใจเรื่องอัตราภาษีส่วนเพิ่ม (Marginal Tax Rate) ว่าเงินได้ที่ลดลงช่วยประหยัดภาษีได้จริงเท่าใด',
    size: '4 ข้อ · 12 นาที', K: 4, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · จับผิดวิธีทำของเพื่อน', kind: 'K', points: 2,
        skill: 'ตรวจพบข้อผิดพลาดในขั้นตอนการคำนวณภาษีและเสนอวิธีแก้ไขที่ถูกต้อง',
        desc: 'แตะบรรทัดที่ผิดในวิธีทำของเพื่อน แล้วเลือกวิธีแก้ที่ถูกต้อง',
        intro: 'ข้อผิดพลาดที่พบบ่อย: คิดภาษีคูณทั้งก้อนแทนที่จะคิดแบบขั้นบันได, หรือลืมเพดานค่าใช้จ่าย 100,000 บาท',
        build(R) {
          const nm = R.pick(['ต้น', 'ก้อย', 'ภูมิ', 'ฝ้าย', 'เจ', 'นุ่น']);
          const m = R.pick([28000, 32000, 36000, 42000]);
          const k = 1;
          const inc = m * 12 + m * k;
          const ss = sso(m);
          const expOK = Math.min(inc * 0.5, TX.expenseCap);
          const netOK = inc - expOK - TX.personal - ss;
          const taxOK = taxCalc(netOK).tax;
          const topRate = taxCalc(netOK).top;

          // Error: Lump sum multiply on net income instead of step brackets!
          const taxWrong = r2(netOK * topRate / 100);

          const lines = [
            `เงินได้พึงประเมิน = (${baht(m)} × 12) + ${baht(m * k)} = ${baht(inc)} บาท`,
            `หักค่าใช้จ่าย 50% ไม่เกิน 100,000 บาท = ${baht(expOK)} บาท`,
            `หักค่าลดหย่อน: ส่วนตัว 60,000 + ประกันสังคม ${baht(ss)} = ${baht(TX.personal + ss)} บาท`,
            `เงินได้สุทธิ = ${baht(inc)} − ${baht(expOK)} − ${baht(TX.personal + ss)} = ${baht(netOK)} บาท`,
            `เงินได้สุทธิอยู่ในขั้น ${topRate}% ดังนั้น ภาษี = ${baht(netOK)} × ${topRate}% = ${baht(taxWrong)} บาท`,
            `สรุป ภาษีที่ต้องเสีย = ${baht(taxWrong)} บาท`
          ];

          const fixOptions = [
            `ต้องคิดภาษีแบบขั้นบันไดแยกทีละช่วง (150,000 แรกยกเว้น ส่วนเกินคิดตามอัตราของช่วงนั้น) ซึ่งคำนวณได้ ${baht(taxOK)} บาท`,
            'ต้องนำเงินได้พึงประเมินมาคูณกับอัตราภาษีโดยตรง',
            'ต้องหักค่าใช้จ่ายเพิ่มขึ้นเป็น 60%'
          ];

          return [
            Q.find({
              q: `<b>เพื่อนชื่อ ${nm}</b> แสดงวิธีทำคำนวณภาษีเงินได้บุคคลธรรมดาไว้ดังนี้ จงแตะบรรทัดที่<b>ผิดพลาดเป็นบรรทัดแรก</b>`,
              lines,
              wrong: 4, // index 4 is the lump sum line
              fixOptions,
              fixAnswer: 0,
              why: `ข้อผิดพลาดอยู่ที่บรรทัดที่ 5: เพื่อนเอาเงินได้สุทธิทั้งก้อน (${baht(netOK)} บาท) ไปคูณ ${topRate}% ตรง ๆ ซึ่งผิดหลักการคำนวณภาษีเงินได้บุคคลธรรมดาของไทยที่เป็น <b>อัตราก้าวหน้าแบบขั้นบันได</b> (ต้องแยกคิดทีละช่วง 150,000 บาทแรกยกเว้น) ภาษีที่ถูกต้องคือ <b>${baht(taxOK)} บาท</b>`,
              verify: () => 4
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · อัตราภาษีส่วนเพิ่มและประโยชน์ลดหย่อน', kind: 'K', points: 2,
        skill: 'คำนวณภาษีที่ประหยัดได้จากค่าลดหย่อนตามอัตราภาษีขั้นสูงสุดของตนเอง',
        desc: 'วิเคราะห์ผลของการเพิ่มค่าลดหย่อนต่อการประหยัดภาษี 3 ข้อ',
        intro: 'การลดหย่อนภาษี 1 บาท ไม่ได้แปลว่าประหยัดภาษี 1 บาท! แต่ประหยัดภาษีได้เท่ากับ (เงินที่ลดหย่อน × อัตราภาษีขั้นสูงสุดของตนเอง)',
        build(R) {
          const nm = R.sample(['คุณก้อง', 'คุณเมษา', 'คุณชลธี'], 3);
          const qs = [];

          // ข้อ 2: อยู่ขั้น 10% ซื้อประกันเพิ่ม 20,000 บาท ประหยัดภาษีได้กี่บาท
          {
            const addAllow = 20000;
            const rate = 10;
            const saved = addAllow * rate / 100;
            qs.push(Q.fill({
              label: 'ข้อ 2',
              q: `<b>${nm[0]}</b> มีเงินได้สุทธิตกอยู่ในขั้นอัตราภาษี <b>${rate}%</b> (ช่วง 300,001 – 500,000 บาท) ถ้าซื้อประกันชีวิตเพิ่มอีก <b>${baht(addAllow)} บาท</b> (ยังไม่เกินเพดาน 1 แสน) จะช่วยประหยัดภาษีได้จริงกี่บาท`,
              answer: saved, unit: 'บาท', tol: 0.01,
              hint: `ภาษีที่ประหยัดได้ = ยอดลดหย่อนที่เพิ่มขึ้น × อัตราภาษีขั้นสูงสุด (${rate}%)`,
              why: `ภาษีที่ประหยัดได้จริง = ${baht(addAllow)} × ${rate}/100 = <b>${baht(saved)} บาท</b> (ไม่ใช่ประหยัดได้ 20,000 บาท)`,
              verify: () => saved
            }));
          }

          // ข้อ 3: อยู่ขั้นยกเว้น (0%) บริจาคเงินหรือซื้อประกัน ช่วยลดภาษีได้หรือไม่
          {
            qs.push(Q.choice({
              label: 'ข้อ 3',
              q: `<b>${nm[1]}</b> มีเงินได้สุทธิ <b>120,000 บาท</b> (อยู่ในช่วงยกเว้นภาษี 0%) ถ้าตัดสินใจซื้อประกันชีวิต 30,000 บาท จะช่วยให้เสียภาษีน้อยลงได้หรือไม่`,
              options: [
                'ไม่ช่วยลดภาษีเลย เพราะเดิมก็เสียภาษี 0 บาทอยู่แล้ว (0% × 30,000 = 0)',
                'ช่วยประหยัดภาษีได้ 30,000 บาทเต็มจำนวน',
                'ช่วยประหยัดภาษีได้ 1,500 บาท (5%)'
              ],
              answer: 0,
              shuffle: false,
              why: 'เนื่องจากเดิมเงินได้สุทธิไม่ถึง 150,000 บาท ซึ่งเสียภาษี 0 บาทอยู่แล้ว แม้จะเพิ่มค่าลดหย่อน ภาษีก็ยังคงเป็น 0 บาทเท่าเดิม จึงไม่ได้ช่วยประหยัดภาษีเลย',
              verify: () => 0
            }));
          }

          // ข้อ 4: อยู่ขั้น 20% ซื้อกองทุนลดหย่อน 50,000 บาท ประหยัดภาษีได้กี่บาท
          {
            const addFund = 50000;
            const rate = 20;
            const saved = addFund * rate / 100;
            qs.push(Q.fill({
              label: 'ข้อ 4',
              q: `<b>${nm[2]}</b> มีเงินได้สุทธิอยู่ในช่วงอัตราภาษี <b>${rate}%</b> (ช่วง 750,001 – 1,000,000 บาท) หากลงทุนในกองทุนลดหย่อนภาษี (SSF/RMF) เพิ่มอีก <b>${baht(addFund)} บาท</b> จะประหยัดภาษีได้กี่บาท`,
              answer: saved, unit: 'บาท', tol: 0.01,
              hint: `ภาษีที่ประหยัดได้ = ${baht(addFund)} × ${rate}/100`,
              why: `ภาษีที่ประหยัดได้ = ${baht(addFund)} × ${rate}/100 = <b>${baht(saved)} บาท</b>`,
              verify: () => saved
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
