/* HW-03 · 1.3 การคำนวณภาษีมูลค่าเพิ่ม (ร้านค้าจำลอง) */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const v = 7, sv = 10;

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function bahtd(n) { return fmt(r2(n), 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }

  window.HW = {
    id: 'HW-03', unit: 1, unitName: 'หน่วยที่ 1 ภาษีมูลค่าเพิ่ม', title: 'การคำนวณภาษีมูลค่าเพิ่ม (ร้านค้าจำลอง)',
    sub: 'ฝึกคำนวณ VAT ใน 4 สถานการณ์จริง: ราคายังไม่รวมภาษี, ราคารวมภาษีแล้ว, ร้านอาหารมี Service Charge, และเปรียบเทียบโปรโมชัน 2 ร้าน',
    size: '8 ข้อ · 15 นาที', K: 4, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ราคายังไม่รวม VAT', kind: 'K', points: 1,
        skill: 'คำนวณ VAT 7% และราคารวมจากยอดสินค้าก่อนภาษี',
        desc: 'คำนวณมูลค่าสินค้าในตะกร้า แล้วหา VAT 7% และยอดที่ต้องจ่ายทั้งหมด',
        intro: 'คิดมูลค่าสินค้ารวมก่อนภาษีให้ได้ก่อน แล้วค่อยนำมาคูณ 7/100 เพื่อหา VAT',
        build(R) {
          const cat = [
            ['สีโปสเตอร์ 12 สี', [60, 70, 80, 90, 120]],
            ['พู่กันกลมเบอร์ 8', [30, 40, 50, 60]],
            ['สมุดสเก็ตช์ A4', [80, 90, 110, 120]],
            ['ดินสอสี 24 สี', [150, 180, 220, 250]],
            ['ผ้าใบ 30×40 ซม.', [120, 150, 180, 240, 300]],
            ['จานสีพลาสติก', [20, 30, 40, 50]],
            ['กาวสองหน้า', [20, 30, 40, 60]]
          ];
          const cart = R.sample(cat, 3).map(([name, ps]) => ({ name, price: R.pick(ps), qty: R.int(1, 4) }));
          const S = cart.reduce((a, c) => a + c.price * c.qty, 0);
          const VA = S * v / 100;
          const TA = S + VA;

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.05em;margin-bottom:8px">🛒 ตะกร้าสินค้าในร้านศิลป์สุขใจ (ราคาทุกชิ้น “ยังไม่รวม VAT 7%”)</div>
              <ul style="margin:0;padding-left:20px;line-height:1.7">
                ${cart.map(c => `<li><b>${c.name}</b> ราคา ${baht(c.price)} บาท/ชิ้น × <b>${c.qty}</b> ชิ้น</li>`).join('')}
              </ul>
              <div style="margin-top:8px;font-size:0.9em;color:#555">มูลค่าสินค้ารวมก่อนภาษี = ${cart.map(c => `${baht(c.price)}×${c.qty}`).join(' + ')} = <b>${baht(S)} บาท</b></div>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ข้อ 1',
                  q: `ภาษีมูลค่าเพิ่ม (${v}%) ของสินค้าในตะกร้านี้ เท่ากับกี่บาท`,
                  answer: VA, unit: 'บาท', tol: 0.01,
                  hint: `VAT = มูลค่าสินค้าก่อนภาษี × ${v}/100`,
                  why: `VAT = ${baht(S)} × ${v}/100 = <b>${baht(VA)} บาท</b>`,
                  verify: () => S * v / 100
                }),
                Q.fill({
                  label: 'ข้อ 2',
                  q: 'นักเรียนต้องจ่ายเงินที่เคาน์เตอร์ทั้งหมดกี่บาท (รวมภาษีมูลค่าเพิ่มแล้ว)',
                  answer: TA, unit: 'บาท', tol: 0.01,
                  hint: 'ยอดจ่ายจริง = ราคาสินค้าก่อนภาษี + VAT',
                  why: `ยอดจ่ายจริง = ${baht(S)} + ${baht(VA)} = <b>${baht(TA)} บาท</b>`,
                  verify: () => S + VA
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · ราคารวม VAT แล้ว', kind: 'K', points: 1,
        skill: 'ถอดภาษีมูลค่าเพิ่มออกจากราคารวม (หาราคาเนื้อและ VAT)',
        desc: 'สินค้าราคารวม VAT แล้ว แยกหามูลค่าสินค้าก่อนภาษี และภาษีมูลค่าเพิ่ม',
        intro: 'สูตรสำคัญ: มูลค่าก่อนภาษี = ราคารวม × 100/107 · ภาษีมูลค่าเพิ่ม = ราคารวม × 7/107',
        build(R) {
          const clean = R.chance(0.7);
          let T2;
          if (clean) {
            let k;
            do { k = R.int(13, 95); } while (k === 12 || k === 8);
            T2 = 107 * k;
          } else {
            T2 = step(R, 310, 2990, 10);
          }
          const V2 = r2(T2 * v / (100 + v));
          const B2 = r2(T2 * 100 / (100 + v));

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.05em">🏷️ ป้ายราคาสินค้ารวม VAT แล้ว</div>
              <p style="margin:6px 0">สินค้าชิ้นหนึ่งติดป้ายราคา <b>${baht(T2)} บาท</b> โดยระบุตัวเล็ก ๆ ใต้ราคาว่า <i>“ราคานี้รวมภาษีมูลค่าเพิ่ม 7% แล้ว”</i></p>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ข้อ 3',
                  q: 'มูลค่าสินค้าก่อนภาษี เท่ากับกี่บาท (ตอบเป็นบาท ทศนิยม 2 ตำแหน่งถ้าไม่ลงตัว)',
                  answer: B2, unit: 'บาท', tol: 0.015,
                  hint: 'มูลค่าก่อนภาษี = ราคารวม × 100/107',
                  why: `มูลค่าก่อนภาษี = ${baht(T2)} × 100/107 = <b>${bahtd(B2)} บาท</b>`,
                  verify: () => B2
                }),
                Q.fill({
                  label: 'ข้อ 4',
                  q: 'ภาษีมูลค่าเพิ่ม 7% ที่แฝงอยู่ในราคานี้ เท่ากับกี่บาท',
                  answer: V2, unit: 'บาท', tol: 0.015,
                  hint: 'VAT = ราคารวม × 7/107 หรือ ราคารวม − มูลค่าก่อนภาษี',
                  why: `VAT = ${baht(T2)} × 7/107 = <b>${bahtd(V2)} บาท</b>`,
                  verify: () => V2
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 3', title: 'ด่าน 3 · Service Charge + VAT', kind: 'K', points: 1,
        skill: 'คำนวณค่าบริการ (Service Charge 10%) ก่อน แล้วจึงคำนวณ VAT 7%',
        desc: 'ร้านอาหารคิด Service Charge 10% แล้วบวก VAT 7% จากยอดรวมค่าบริการ',
        intro: 'ลำดับการคิด: 1) หาค่าบริการ 10% นำไปบวกกับค่าอาหาร 2) นำยอดรวมนั้นมาคิด VAT 7%',
        build(R) {
          const names = ['ร้านบะหมี่เส้นสดโบราณ', 'ร้านพิซซ่าเตาถ่านอิตาเลียน', 'ร้านสเต๊กเนื้อดรายเอจ', 'ร้านอาหารญี่ปุ่นโมเดิร์น', 'ร้านชาบูหม้อไฟฮ่องกง', 'ร้านคาเฟ่ต์แอนด์บิสโทร'];
          const rest = R.pick(names);
          let F;
          do { F = step(R, 800, 3600, 50); } while (F === 1500 || F === 2000);
          const SC = r2(F * sv / 100);
          const VC = r2((F + SC) * v / 100);
          const TC = r2(F + SC + VC);

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.05em">🍽️ ใบเสร็จ ${rest}</div>
              <p style="margin:6px 0">ไปรับประทานอาหาร ยอดรวมค่าอาหารและเครื่องดื่ม <b>${baht(F)} บาท</b></p>
              <p style="margin:4px 0;font-size:0.9em;color:#555">เงื่อนไขทางร้าน: มีค่าบริการ (Service Charge) <b>${sv}%</b> และคิดภาษีมูลค่าเพิ่ม (VAT) <b>${v}%</b> จากยอดรวมที่รวมค่าบริการแล้ว</p>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ข้อ 5',
                  q: `ค่าบริการ (Service Charge ${sv}%) เป็นเงินกี่บาท`,
                  answer: SC, unit: 'บาท', tol: 0.01,
                  hint: `ค่าบริการ = ค่าอาหาร × ${sv}/100`,
                  why: `ค่าบริการ = ${baht(F)} × ${sv}/100 = <b>${baht(SC)} บาท</b>`,
                  verify: () => SC
                }),
                Q.fill({
                  label: 'ข้อ 6',
                  q: 'ลูกค้าต้องชำระเงินทั้งหมดกี่บาท (รวมค่าอาหาร + Service Charge + VAT 7%)',
                  answer: TC, unit: 'บาท', tol: 0.02,
                  hint: 'ยอดรวมก่อน VAT = ค่าอาหาร + Service Charge จากนั้นคิด VAT 7% แล้วบวกรวมกัน',
                  why: `ยอดรวมค่าอาหาร + Service Charge = ${baht(F + SC)} บาท<br>VAT 7% = ${baht(F + SC)} × 7/100 = ${bahtd(VC)} บาท<br>รวมต้องชำระ = ${baht(F + SC)} + ${bahtd(VC)} = <b>${bahtd(TC)} บาท</b>`,
                  verify: () => TC
                })
              ]
            })
          ];
        }
      },
      {
        short: 'ด่าน 4', title: 'ด่าน 4 · เปรียบเทียบ 2 ร้าน', kind: 'K', points: 1,
        skill: 'เปรียบเทียบราคาที่จ่ายจริงระหว่างร้านลดราคากับร้านรวม VAT',
        desc: 'ร้าน ก ราคาไม่รวม VAT แต่ลดราคา เทียบกับ ร้าน ข ราคาป้ายรวม VAT แล้ว',
        intro: 'ต้องเปรียบเทียบที่ "ราคาที่จ่ายจริงที่เคาน์เตอร์" ของทั้งสองร้านเท่านั้น',
        build(R) {
          const goods = ['ชุดสีน้ำมืออาชีพ 24 สี', 'กระเป๋าใส่อุปกรณ์วาดภาพ', 'โต๊ะวาดภาพพับได้', 'ชุดดินสอถ่านพร้อมกระดาษ', 'ไฟตั้งโต๊ะสำหรับวาดภาพ'];
          const g = R.pick(goods);
          const PA = step(R, 1200, 6000, 100);
          const dA = R.pick([10, 15, 20, 25]);
          const baseA = PA * (100 - dA) / 100;
          const finA = r2(baseA * (100 + v) / 100);

          const delta = R.int(12, 65) * 10;
          const aCheaper = R.chance(0.5);
          let TB = Math.round(aCheaper ? finA + delta : finA - delta);
          if (TB === Math.round(finA)) TB += 90;
          const diff = r2(Math.abs(finA - TB));
          const cheap = finA < TB ? 'ร้าน ก' : 'ร้าน ข';

          const storyCard = `
            <div style="background:#fffdf6;border:2px solid var(--navy);border-radius:12px;padding:16px;margin:10px 0;box-shadow:3px 3px 0 var(--navy)">
              <div style="font-weight:700;font-size:1.05em">⚖️ เปรียบเทียบราคา: ${g} (รุ่นเดียวกัน)</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px">
                <div style="background:#fff;border:1.5px solid var(--navy);border-radius:8px;padding:10px">
                  <b>🏪 ร้าน ก</b><br>
                  ราคาป้าย: <b>${baht(PA)} บาท</b><br>
                  <i>(ยังไม่รวม VAT · <b>ลด ${dA}%</b>)</i>
                </div>
                <div style="background:#fff;border:1.5px solid var(--navy);border-radius:8px;padding:10px">
                  <b>🏪 ร้าน ข</b><br>
                  ราคาป้าย: <b>${baht(TB)} บาท</b><br>
                  <i>(<b>รวม VAT แล้ว</b> · ไม่มีส่วนลด)</i>
                </div>
              </div>
            </div>
          `;

          return [
            Q.group({
              story: storyCard,
              parts: [
                Q.fill({
                  label: 'ข้อ 7',
                  q: `ซื้อที่ร้าน ก จะต้องจ่ายจริงกี่บาท (หักส่วนลด ${dA}% ก่อน แล้วจึงคิด VAT 7%)`,
                  answer: finA, unit: 'บาท', tol: 0.02,
                  hint: `ราคาหลังลด = ${baht(PA)} × (100 − ${dA})/100 แล้วคิด VAT 7% บวกเพิ่ม`,
                  why: `ร้าน ก: ลด ${dA}% เหลือ ${baht(PA)} × ${100 - dA}/100 = ${baht(baseA)} บาท<br>บวก VAT 7% → ${baht(baseA)} × 1.07 = <b>${bahtd(finA)} บาท</b>`,
                  verify: () => finA
                }),
                Q.choice({
                  label: 'ข้อ 8.1',
                  q: 'เมื่อเทียบราคาที่จ่ายจริงแล้ว ร้านใดถูกกว่ากัน',
                  options: ['ร้าน ก', 'ร้าน ข'],
                  answer: cheap === 'ร้าน ก' ? 0 : 1,
                  shuffle: false,
                  why: `ร้าน ก จ่ายจริง ${bahtd(finA)} บาท vs ร้าน ข จ่ายจริง ${baht(TB)} บาท → <b>${cheap}</b> ถูกกว่า`,
                  verify: () => (cheap === 'ร้าน ก' ? 0 : 1)
                }),
                Q.fill({
                  label: 'ข้อ 8.2',
                  q: 'ราคาที่จ่ายจริงถูกกว่ากันกี่บาท',
                  answer: diff, unit: 'บาท', tol: 0.02,
                  hint: 'ส่วนต่าง = |ราคาจ่ายจริงร้าน ก − ราคาจ่ายจริงร้าน ข|',
                  why: `ส่วนต่าง = |${bahtd(finA)} − ${baht(TB)}| = <b>${bahtd(diff)} บาท</b>`,
                  verify: () => diff
                })
              ]
            })
          ];
        }
      }
    ]
  };
})();
