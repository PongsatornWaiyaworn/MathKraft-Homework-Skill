/* HW-02 · 1.2 ความรู้เบื้องต้นเกี่ยวกับภาษีมูลค่าเพิ่ม */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const vat = 7;

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function bahtd(n) { return fmt(r2(n), 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }

  window.HW = {
    id: 'HW-02', unit: 1, unitName: 'หน่วยที่ 1 ภาษีมูลค่าเพิ่ม', title: 'ความรู้เบื้องต้นเกี่ยวกับภาษีมูลค่าเพิ่ม',
    sub: 'แยกความแตกต่างระหว่างภาษีทางตรงกับภาษีทางอ้อม และฝึกอ่านใบกำกับภาษีอย่างย่อเพื่อระบุมูลค่าสินค้า VAT และยอดรวม',
    size: '10 ข้อ · 10 นาที', K: 2, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · จัดหมวดภาษี', kind: 'K', points: 1,
        skill: 'แยกประเภทภาษีทางตรงและภาษีทางอ้อม',
        desc: 'ลากการ์ดสถานการณ์ 6 ใบเข้ากลุ่มภาษีทางตรง หรือ ภาษีทางอ้อม',
        intro: 'หลักคิด: ถ้าผู้เสียภาษีผลักภาระให้ผู้อื่นได้ (รวมไว้ในราคา) = ภาษีทางอ้อม (เช่น VAT) · ถ้าต้องรับภาระเอง = ภาษีทางตรง',
        build(R) {
          const direct = [
            'ภาษีเงินได้ที่หักจากเงินเดือนของครูศิลปะ',
            'ภาษีเงินได้จากค่าจ้างถ่ายภาพงานรับปริญญาของช่างภาพอิสระ',
            'ภาษีเงินได้ของนักเขียนการ์ตูนจากค่าลิขสิทธิ์หนังสือ',
            'ภาษีเงินได้จากค่าเช่าห้องแถวของเจ้าของห้องเช่า',
            'ภาษีเงินได้ที่ผู้ขายเสื้อสกรีนออนไลน์ยื่นแบบเสียเองปลายปี',
            'ภาษีเงินได้บุคคลธรรมดาของพนักงานออกแบบกราฟิก'
          ];
          const indirect = [
            'ภาษีมูลค่าเพิ่ม 7% ที่รวมอยู่ในราคากาแฟแก้วละ 90 บาท',
            'ภาษีมูลค่าเพิ่มที่ลูกค้าจ่ายเพิ่มเมื่อซื้อชุดสีน้ำในร้านเครื่องเขียน',
            'ภาษีมูลค่าเพิ่มในใบเสร็จค่าอาหารบุฟเฟต์',
            'ภาษีมูลค่าเพิ่มที่รวมอยู่ในค่าตั๋วภาพยนตร์',
            'ภาษีมูลค่าเพิ่มที่ร้านบวกไว้ในราคาโทรศัพท์มือถือในห้าง',
            'ภาษีมูลค่าเพิ่มในค่าบริการพิมพ์โปสเตอร์ของร้านถ่ายเอกสาร'
          ];
          const dPicks = R.sample(direct, 3).map(t => ({ html: t, bin: 'd', why: 'ผู้เสียภาษีเป็นผู้รับภาระเอง ผลักภาระให้ผู้อื่นไม่ได้' }));
          const iPicks = R.sample(indirect, 3).map(t => ({ html: t, bin: 'i', why: 'ผู้ขายผลักภาระไปให้ผู้ซื้อโดยรวมไว้ในราคาสินค้า/บริการ' }));
          const items = R.shuffle([...dPicks, ...iPicks]);

          return [
            Q.sort({
              q: 'ลากการ์ดสถานการณ์ทั้ง 6 ใบลงในกลุ่มที่ถูกต้อง',
              bins: [
                { id: 'd', label: '📌 ภาษีทางตรง<br><small>(ผู้เสียภาษีรับภาระเอง ผลักภาระไม่ได้)</small>' },
                { id: 'i', label: '🛒 ภาษีทางอ้อม<br><small>(ผลักภาระไปให้ผู้อื่นได้ โดยรวมไว้ในราคาสินค้า)</small>' }
              ],
              items,
              why: `หลักคิด: ถ้าผู้เสียภาษี <b>ผลักภาระให้ผู้ซื้อได้</b> (รวมในราคาสินค้า) = ภาษีทางอ้อม เช่น VAT · ถ้าเสียเองทั้งหมด = ภาษีทางตรง เช่น ภาษีเงินได้บุคคลธรรมดา`
            })
          ];
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · อ่านใบกำกับภาษีจำลอง', kind: 'K', points: 1,
        skill: 'อ่านและระบุองค์ประกอบสำคัญในใบกำกับภาษีอย่างย่อ',
        desc: 'อ่านใบกำกับภาษีจำลองของร้านสมมติ แล้วตอบคำถาม 4 ข้อ',
        intro: 'สังเกตบรรทัดต่างๆ ในใบกำกับภาษี: ราคาสินค้าก่อนภาษี, VAT 7%, รวมทั้งสิ้น และข้อมูลผู้ขาย',
        build(R) {
          const shops = ['ร้านอาร์ตสเตชัน สยาม', 'ร้านโมเดิร์นกราฟิก พระนคร', 'ร้านเพนท์แอนด์คราฟต์ บางกอก', 'สยามคัลเลอร์แล็บ', 'ร้านสเก็ตช์ดีไซน์ สามย่าน', 'อาร์ตมาเก็ต พาหุรัด', 'ร้านเฟรมสตูดิโอ ธนบุรี', 'สีศิลป์สยาม'];
          const itemsPool = ['สีอะคริลิก 12 สี', 'พู่กันกลมชุด 5 ด้าม', 'สมุดสเก็ตช์ A4', 'ดินสอสีไม้ 36 สี', 'กระดาษสีน้ำ 300 แกรม', 'ผ้าใบ 30×40 ซม.', 'กาวสเปรย์', 'ปากกาเมจิก 24 สี', 'จานสีพลาสติก', 'ชุดปั้นดินน้ำมัน'];
          const shop = R.pick(shops);
          const B = step(R, 500, 2400, 100);
          const T = B * 107 / 100;
          const V = T - B;
          const names = R.sample(itemsPool, 3);

          let a = Math.round(T * R.pick([0.25, 0.3, 0.35]) / 5) * 5;
          let b = Math.round(T * R.pick([0.25, 0.3, 0.35]) / 5) * 5;
          let c = T - a - b;
          if (c <= 0) { a = Math.round(T / 3); b = Math.round(T / 3); c = T - a - b; }
          const lines = [a, b, c];
          const cash = Math.ceil(T / 100) * 100 + R.pick([0, 100, 400]);
          const change = cash - T;
          const day = R.int(2, 27);
          const mon = R.pick(['พ.ย.', 'ธ.ค.']);
          const taxid = '0-' + R.int(1000, 9999) + '-' + R.int(10000, 99999) + '-' + R.int(10, 99) + '-' + R.int(0, 9) + ' (สมมติ)';

          const receiptCard = `
            <div style="background:#fffefa;border:2px dashed var(--navy);border-radius:12px;padding:16px;max-width:380px;margin:12px auto;font-family:monospace;font-size:0.95em;line-height:1.6;box-shadow:4px 4px 0 var(--navy)">
              <div style="text-align:center;font-weight:700;font-size:1.15em">🏪 ${shop}</div>
              <div style="text-align:center;font-size:0.85em;color:#555">เลขประจำตัวผู้เสียภาษี ${taxid}</div>
              <div style="text-align:center;font-size:0.85em;color:#555">วันที่ ${day} ${mon} 2569</div>
              <div style="text-align:center;font-weight:700;margin:6px 0;border-top:1px dashed #999;border-bottom:1px dashed #999;padding:4px 0">ใบกำกับภาษีอย่างย่อ / ใบเสร็จรับเงิน</div>
              ${lines.map((x, i) => `<div style="display:flex;justify-content:space-between"><span>${names[i]}</span><span>${bahtd(x)}</span></div>`).join('')}
              <div style="border-top:1px dashed #999;margin:6px 0"></div>
              <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1.05em"><span>รวมทั้งสิ้น</span><span>${bahtd(T)}</span></div>
              <div style="display:flex;justify-content:space-between"><span>มูลค่าสินค้า (ก่อนภาษี)</span><span>${bahtd(B)}</span></div>
              <div style="display:flex;justify-content:space-between"><span>ภาษีมูลค่าเพิ่ม ${vat}%</span><span>${bahtd(V)}</span></div>
              <div style="border-top:1px dashed #999;margin:6px 0"></div>
              <div style="display:flex;justify-content:space-between"><span>เงินสดรับ</span><span>${bahtd(cash)}</span></div>
              <div style="display:flex;justify-content:space-between"><span>เงินทอน</span><span>${bahtd(change)}</span></div>
              <div style="text-align:center;font-size:0.85em;color:#666;margin-top:6px">ราคาสินค้ารวมภาษีมูลค่าเพิ่มแล้ว</div>
            </div>
          `;

          const optList = [
            `มูลค่าสินค้า (ก่อนภาษี) : ${bahtd(B)} บาท`,
            `ภาษีมูลค่าเพิ่ม ${vat}% : ${bahtd(V)} บาท`,
            `รวมทั้งสิ้น : ${bahtd(T)} บาท`,
            `ชื่อร้านค้า : ${shop}`,
            `เงินสดรับ : ${bahtd(cash)} บาท`,
            `เงินทอน : ${bahtd(change)} บาท`
          ];

          return [
            Q.group({
              story: receiptCard,
              parts: [
                Q.choice({
                  label: 'ข้อ 1',
                  q: '<b>ราคาสินค้าก่อนภาษี</b> (มูลค่าที่ยังไม่รวม VAT) คือยอดใดในใบกำกับภาษี',
                  options: optList,
                  answer: 0,
                  shuffle: false,
                  why: `ราคาสินค้าก่อนภาษี = <b>${bahtd(B)} บาท</b>`
                }),
                Q.choice({
                  label: 'ข้อ 2',
                  q: '<b>ภาษีมูลค่าเพิ่ม (VAT 7%)</b> ที่ร้านเรียกเก็บคือยอดใด',
                  options: optList,
                  answer: 1,
                  shuffle: false,
                  why: `ภาษีมูลค่าเพิ่ม 7% = <b>${bahtd(V)} บาท</b>`
                }),
                Q.choice({
                  label: 'ข้อ 3',
                  q: '<b>ยอดที่ลูกค้าต้องจ่ายจริงทั้งหมด</b> คือยอดใด',
                  options: optList,
                  answer: 2,
                  shuffle: false,
                  why: `ยอดรวมทั้งสิ้นที่ลูกค้าต้องจ่าย = <b>${bahtd(T)} บาท</b>`
                }),
                Q.choice({
                  label: 'ข้อ 4',
                  q: '<b>ผู้ขาย</b> (ผู้มีหน้าที่เรียกเก็บและนำส่งภาษีให้กรมสรรพากร) คือใคร',
                  options: optList,
                  answer: 3,
                  shuffle: false,
                  why: `ผู้ขายคือ <b>${shop}</b> ซึ่งเป็นผู้ประกอบการจดทะเบียน VAT`
                })
              ]
            })
          ];
        }
      }
    ]
  };
})();
