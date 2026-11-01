/* HW-11 · 3.2 การคำนวณภาษีเงินได้บุคคลธรรมดาครบทุกขั้นตอน */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;

  const TX = {
    personal: 60000,
    spouse: 60000,
    child: 30000,
    child2: 60000,
    child2FromYear: 2561,
    parent: 30000,
    parentAge: 60,
    ssoRate: 5,
    ssoWageCap: 17500,
    ssoMax: 10500,
    lifeCap: 100000,
    healthCap: 25000,
    homeInterestCap: 100000,
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

  function person(sp) {
    const inc = sp.m * 12 + sp.m * (sp.k || 0);
    const exp = Math.min(inc * TX.expensePct / 100, TX.expenseCap);
    const ss = sso(sp.m);
    const kids = (sp.kids || []).slice().sort((a, b) => a - b);
    const kidAmt = kids.reduce((a, y, i) => a + (i === 0 || y < TX.child2FromYear ? TX.child : TX.child2), 0);
    const Hd = Math.min(sp.H || 0, TX.healthCap);
    const ins = Math.min((sp.L || 0) + Hd, TX.lifeCap);
    const home = Math.min(sp.I || 0, TX.homeInterestCap);

    const parts = [['ส่วนตัว', TX.personal]];
    if (sp.mar) parts.push(['คู่สมรส', TX.spouse]);
    if (kids.length) parts.push(['บุตร ' + kids.length + ' คน', kidAmt]);
    if (sp.par) parts.push(['บิดามารดา ' + sp.par + ' คน', sp.par * TX.parent]);
    parts.push(['ประกันสังคม', ss]);
    if (ins) parts.push(['เบี้ยประกันชีวิต/สุขภาพ', ins]);
    if (home) parts.push(['ดอกเบี้ยบ้าน', home]);

    const allow = parts.reduce((a, p) => a + p[1], 0);
    const net = inc - exp - allow;
    const tax = taxCalc(net).tax;
    return { sp, inc, exp, allow, parts, net, tax, ss, ins, home, kidAmt };
  }

  function distract(p) {
    const err = [], net = p.net, top = taxCalc(net).top, bi = bandOf(net);
    const add = (v, why) => { v = Math.round(v); if (v >= 0 && v !== p.tax && !err.some(e => e.v === v)) err.push({ v, why }); };
    if (p.inc * TX.expensePct / 100 > TX.expenseCap) add(taxCalc(p.inc - p.inc * TX.expensePct / 100 - p.allow).tax, 'ไม่ติดเพดานค่าใช้จ่าย 100,000 บาท');
    add(taxCalc(net + TX.personal).tax, 'ลืมหักค่าลดหย่อนส่วนตัว 60,000 บาท');
    add(taxCalc(p.inc).tax, 'นำเงินได้พึงประเมินไปคิดภาษีโดยตรง (ไม่ได้หักค่าใช้จ่ายและลดหย่อน)');
    if (top > 0) add(net * top / 100, `คูณเงินได้สุทธิทั้งก้อนด้วยอัตราสูงสุด ${top}%`);
    if (bi > 1) add((net - prevUp(bi)) * B[bi].rate / 100, 'ลืมบวกภาษีสะสมของขั้นก่อนหน้า');
    add(taxCalc(p.inc - p.exp).tax, 'ลืมหักค่าลดหย่อนทั้งหมด');
    add(taxCalc(net + p.ss).tax, 'ลืมหักเงินสมทบประกันสังคม');
    [10000, 20000, 30000, 50000].forEach(k => add(taxCalc(net + k).tax, `คำนวณค่าลดหย่อนขาดไป ${baht(k)} บาท`));
    return err;
  }

  const mrange = [16500, 18500, 21500, 24500, 27500, 31500, 35500, 41500, 48500, 56500, 68500];

  function buildProblem(R, name, spSpec) {
    let p, err, n = 0;
    do {
      p = person(spSpec(R));
      n++;
      err = distract(p);
    } while (!(err.length >= 3) && n < 300);

    const net = p.net, tx = p.tax, tc = taxCalc(net);
    const dis = R.sample(err, 3);
    const choices = R.shuffle([{ v: tx, ok: true }, ...dis.map(d => ({ v: d.v, ok: false, why: d.why }))]);
    const ansIdx = choices.findIndex(c => c.ok);
    const options = choices.map(c => `${baht(c.v)} บาท`);

    const s = p.sp;
    const descBits = [
      `${name} ${s.mar ? 'มีคู่สมรสที่ไม่มีเงินได้' : 'เป็นโสด'}${s.kids && s.kids.length ? ' มีบุตร ' + s.kids.length + ' คน' : ''}${s.par ? ' เลี้ยงดูบิดามารดา ' + s.par + ' คน' : ''}`,
      `มีเงินเดือนเดือนละ <b>${baht(s.m)} บาท</b>${s.k ? ' ได้โบนัส <b>' + baht(s.m * s.k) + ' บาท</b>' : ' ไม่มีโบนัส'}`,
      `จ่ายประกันสังคมทั้งปี <b>${baht(p.ss)} บาท</b>`,
      s.L ? `จ่ายประกันชีวิต <b>${baht(s.L)} บาท</b>` : '',
      s.I ? `จ่ายดอกเบี้ยบ้าน <b>${baht(s.I)} บาท</b>` : ''
    ].filter(Boolean).join(' · ');

    const whyHtml = `
      <div style="background:#fffdf6;border:1px solid #ccc;border-radius:8px;padding:10px;font-size:0.9em;margin-top:6px">
        <b>วิธีคำนวณทีละขั้น:</b><br>
        (1) เงินได้พึงประเมินทั้งปี = <b>${baht(p.inc)} บาท</b><br>
        (2) หักค่าใช้จ่าย 50% ไม่เกิน 100,000 = <b>${baht(p.exp)} บาท</b> (เหลือ ${baht(p.inc - p.exp)} บาท)<br>
        (3) หักค่าลดหย่อนรวม = <b>${baht(p.allow)} บาท</b> (${p.parts.map(x => x[0] + ' ' + baht(x[1])).join(' + ')})<br>
        (4) เงินได้สุทธิ = ${baht(p.inc)} − ${baht(p.exp)} − ${baht(p.allow)} = <b>${baht(net)} บาท</b><br>
        (5) ภาษีเงินได้แบบขั้นบันได = <b>${baht(tx)} บาท</b>
      </div>
    `;

    return Q.choice({
      q: `<p>${descBits}</p><p><b>ภาษีเงินได้บุคคลธรรมดาที่ต้องชำระทั้งปี</b> เท่ากับข้อใด</p>`,
      options,
      answer: ansIdx,
      shuffle: false,
      why: whyHtml,
      verify: () => ansIdx
    });
  }

  window.HW = {
    id: 'HW-11', unit: 3, unitName: 'หน่วยที่ 3 การคำนวณและการวางแผนภาษี', title: 'การคำนวณภาษีเงินได้บุคคลธรรมดาครบทุกขั้นตอน',
    sub: 'ฝึกคำนวณภาษีเงินได้บุคคลธรรมดาครบทั้ง 5 ขั้นตอน: เงินได้พึงประเมิน → หักค่าใช้จ่าย → หักค่าลดหย่อน → เงินได้สุทธิ → คิดภาษีแบบขั้นบันได (ปรนัย 4 ตัวเลือกพร้อมตัวลวงจากข้อผิดจริง)',
    size: '8 ข้อ · 15 นาที', K: 4, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · คำนวณภาษีชุดที่ 1', kind: 'K', points: 2,
        skill: 'คำนวณภาษีครบวงจรระดับเงินได้สุทธิขั้นต้นถึงปานกลาง',
        desc: 'คำนวณภาษีเงินได้จากสถานการณ์ของบุคคลสมมติ 4 ข้อ',
        intro: 'คิดทีละขั้นตามลำดับ แล้วเลือกคำตอบที่ถูกต้อง (ระวังตัวลวงที่เกิดจากการลืมหักลดหย่อนหรือคิดภาษีผิดวิธี)',
        build(R) {
          const names = R.sample(['คุณอ้อม', 'คุณธนา', 'คุณมะลิ', 'คุณปกรณ์'], 4);
          return [
            buildProblem(R, names[0], () => ({ m: R.pick([16500, 18500, 20500]), k: 0 })),
            buildProblem(R, names[1], () => ({ m: R.pick([22000, 25000, 28000]), k: 1, L: step(R, 10000, 30000, 5000) })),
            buildProblem(R, names[2], () => ({ m: R.pick([28000, 32000, 36000]), k: 1, mar: true })),
            buildProblem(R, names[3], () => ({ m: R.pick([32000, 38000, 42000]), k: 2, par: 1, L: step(R, 15000, 35000, 5000) }))
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · คำนวณภาษีชุดที่ 2', kind: 'K', points: 2,
        skill: 'คำนวณภาษีครบวงจรที่มีค่าลดหย่อนหลายรายการและอัตราภาษีหลายขั้น',
        desc: 'คำนวณภาษีเงินได้บุคคลธรรมดา 4 ข้อ',
        intro: 'ตรวจเช็กเพดานค่าใช้จ่าย 100,000 บาท และรวมสิทธิลดหย่อนบุตร/บิดามารดา/ดอกเบี้ยบ้านให้ครบถ้วน',
        build(R) {
          const names = R.sample(['คุณพลอย', 'คุณสิงห์', 'คุณใบหยก', 'คุณวีระ'], 4);
          return [
            buildProblem(R, names[0], () => ({ m: R.pick([35000, 42000, 48000]), k: 1, kids: [2560] })),
            buildProblem(R, names[1], () => ({ m: R.pick([42000, 50000, 58000]), k: 2, I: step(R, 20000, 50000, 5000) })),
            buildProblem(R, names[2], () => ({ m: R.pick([50000, 60000, 70000]), k: 2, kids: [2559, 2563], L: 40000 })),
            buildProblem(R, names[3], () => ({ m: R.pick([65000, 75000, 85000]), k: 3, mar: true, par: 2, L: 60000, I: 40000 }))
          ];
        }
      }
    ]
  };
})();
