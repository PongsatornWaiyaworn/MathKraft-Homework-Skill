/* HW-12 · 3.3 ภาษีหัก ณ ที่จ่าย และการชำระเพิ่มหรือขอคืนภาษี */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const wr = 3; // withholding freelance 3%

  function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function baht(n) { n = r2(n); return Number.isInteger(n) ? fmt(n, 0) : fmt(n, 2); }
  function step(R, a, b, s) { return a + s * R.int(0, Math.floor((b - a) / s)); }

  window.HW = {
    id: 'HW-12', unit: 3, unitName: 'หน่วยที่ 3 การคำนวณและการวางแผนภาษี', title: 'ภาษีหัก ณ ที่จ่าย และการชำระเพิ่มหรือขอคืนภาษี',
    sub: 'ทำความเข้าใจหลักการภาษีหัก ณ ที่จ่าย (Withholding Tax): การหักภาษีเงินเดือนล่วงหน้า ค่าจ้างงานอิสระ 3% และการเปรียบเทียบกับภาษีที่คำนวณได้จริงปลายปี',
    size: '6 ข้อ · 12 นาที', K: 3, P: 0,
    levels: [
      {
        short: 'ด่าน 1', title: 'ด่าน 1 · ยื่นแบบปลายปีของลูกจ้าง', kind: 'K', points: 1.5,
        skill: 'เปรียบเทียบภาษีที่ถูกหัก ณ ที่จ่ายทั้งปีกับภาษีที่คำนวณได้จริง',
        desc: 'พิจารณาว่าลูกจ้างต้องชำระภาษีเพิ่ม หรือ ได้รับเงินคืน 3 ข้อ',
        intro: 'นำภาษีที่ถูกหักรายเดือน × 12 เทียบกับภาษีที่คำนวณได้ทั้งปี: ถ้าหักไว้มากกว่า = ขอคืนเงินภาษี, ถ้าหักไว้น้อยกว่า = ชำระเพิ่ม',
        build(R) {
          const nm = R.sample(['คุณมิ่ง', 'คุณฝนทิพย์', 'คุณพิสิษฐ์', 'คุณรินรดา'], 3);
          const qs = [];

          // ข้อ 1: ชำระภาษีเพิ่ม
          {
            const T = step(R, 12000, 28000, 500);
            const w = Math.round((T * 0.7) / 12 / 100) * 100;
            const wh = w * 12;
            const diff = T - wh;
            qs.push(Q.group({
              story: `<div style="background:#fffdf6;border:1.5px solid var(--navy);border-radius:10px;padding:12px;margin:6px 0"><b>สถานการณ์ที่ 1</b>: <b>${nm[0]}</b> คำนวณภาษีเงินได้ทั้งปีได้ <b>${baht(T)} บาท</b> ระหว่างปีนายจ้างหักภาษี ณ ที่จ่ายไว้ <b>เดือนละ ${baht(w)} บาท</b> ครบ 12 เดือน</div>`,
              parts: [
                Q.choice({
                  label: 'ผลลัพธ์',
                  q: `เมื่อยื่นแบบปลายปี ${nm[0]} ต้องชำระภาษีเพิ่ม หรือ ได้รับเงินคืน`,
                  options: ['ต้องชำระภาษีเพิ่ม', 'ได้รับเงินคืน'],
                  answer: 0,
                  shuffle: false,
                  why: `ภาษีที่ต้องเสียทั้งปี ${baht(T)} บาท > ภาษีที่ถูกหักไว้ ${baht(wh)} บาท → <b>ต้องชำระภาษีเพิ่ม</b>`,
                  verify: () => 0
                }),
                Q.fill({
                  label: 'จำนวนเงิน',
                  q: 'จำนวนเงินที่ต้องชำระเพิ่ม เป็นเงินกี่บาท',
                  answer: diff, unit: 'บาท', tol: 0.01,
                  hint: `ผลต่าง = ${baht(T)} − (${baht(w)} × 12)`,
                  why: `ชำระเพิ่ม = ${baht(T)} − ${baht(wh)} = <b>${baht(diff)} บาท</b>`,
                  verify: () => diff
                })
              ]
            }));
          }

          // ข้อ 2: ได้รับเงินคืน
          {
            const T = step(R, 8000, 22000, 500);
            const w = Math.round((T * 1.35) / 12 / 100) * 100;
            const wh = w * 12;
            const diff = wh - T;
            qs.push(Q.group({
              story: `<div style="background:#fffdf6;border:1.5px solid var(--navy);border-radius:10px;padding:12px;margin:6px 0"><b>สถานการณ์ที่ 2</b>: <b>${nm[1]}</b> คำนวณภาษีเงินได้ทั้งปีได้ <b>${baht(T)} บาท</b> แต่นายจ้างหักภาษี ณ ที่จ่ายไว้ <b>เดือนละ ${baht(w)} บาท</b> ครบ 12 เดือน</div>`,
              parts: [
                Q.choice({
                  label: 'ผลลัพธ์',
                  q: `เมื่อยื่นแบบปลายปี ${nm[1]} ต้องชำระภาษีเพิ่ม หรือ ได้รับเงินคืน`,
                  options: ['ได้รับเงินคืน', 'ต้องชำระภาษีเพิ่ม'],
                  answer: 0,
                  shuffle: false,
                  why: `ภาษีที่ถูกหักไว้ ${baht(wh)} บาท > ภาษีที่ต้องเสียทั้งปี ${baht(T)} บาท → <b>ได้รับเงินคืน</b>`,
                  verify: () => 0
                }),
                Q.fill({
                  label: 'จำนวนเงิน',
                  q: 'จำนวนเงินที่ได้รับคืน เป็นเงินกี่บาท',
                  answer: diff, unit: 'บาท', tol: 0.01,
                  hint: `ผลต่าง = (${baht(w)} × 12) − ${baht(T)}`,
                  why: `ได้รับคืน = ${baht(wh)} − ${baht(T)} = <b>${baht(diff)} บาท</b>`,
                  verify: () => diff
                })
              ]
            }));
          }

          // ข้อ 3: ภาษีทั้งปีเป็น 0 (ได้รับเงินคืนทั้งหมดที่ถูกหักไว้)
          {
            const w = step(R, 300, 900, 50);
            const wh = w * 12;
            qs.push(Q.fill({
              label: 'ข้อ 3',
              q: `<b>${nm[2]}</b> ถูกนายจ้างหักภาษี ณ ที่จ่ายไว้เดือนละ <b>${baht(w)} บาท</b> ครบ 12 เดือน แต่เมื่อยื่นแบบปลายปีพบว่าเงินได้สุทธิไม่ถึงเกณฑ์ (ภาษีที่ต้องเสีย = 0 บาท) ${nm[2]} จะได้รับเงินภาษีคืนทั้งหมดกี่บาท`,
              answer: wh, unit: 'บาท', tol: 0.01,
              hint: `ได้รับภาษีที่ถูกหักไว้ทั้งหมดคืน = ${baht(w)} × 12`,
              why: `ได้รับเงินคืนเต็มจำนวนที่ถูกหักไว้ = ${baht(w)} × 12 = <b>${baht(wh)} บาท</b>`,
              verify: () => wh
            }));
          }

          return qs;
        }
      },
      {
        short: 'ด่าน 2', title: 'ด่าน 2 · ฟรีแลนซ์และงานอิสระ', kind: 'K', points: 1.5,
        skill: 'คำนวณภาษีหัก ณ ที่จ่าย 3% ของค่าจ้างงานอิสระและการนำส่ง',
        desc: 'คำนวณภาษีหัก ณ ที่จ่ายของค่าจ้างทำของ/ฟรีแลนซ์ 3 ข้อ',
        intro: 'ค่าจ้างบริการ/รับทำงานให้ (มาตรา 40(2)) หากจ่ายตั้งแต่ 1,000 บาทขึ้นไป ผู้จ่ายมีหน้าที่หักภาษี ณ ที่จ่าย 3%',
        build(R) {
          const nm = R.sample(['คุณชนาธิป', 'คุณกุลธิดา', 'คุณเจตน์'], 3);
          const qs = [];

          // ข้อ 4: ค่าจ้างออกแบบ โดนหัก ณ ที่จ่าย 3%
          {
            const W = step(R, 15000, 60000, 5000);
            const wht = r2(W * wr / 100);
            const net = r2(W - wht);
            qs.push(Q.group({
              story: `<div style="background:#fffdf6;border:1.5px solid var(--navy);border-radius:10px;padding:12px;margin:6px 0"><b>${nm[0]}</b> รับจ้างออกแบบกราฟิกให้บริษัทแห่งหนึ่ง ตกลงค่าจ้างกันที่ <b>${baht(W)} บาท</b> บริษัทมีหน้าที่หักภาษี ณ ที่จ่าย <b>${wr}%</b></div>`,
              parts: [
                Q.fill({
                  label: 'ภาษีหัก ณ ที่จ่าย',
                  q: `บริษัทจะหักภาษี ณ ที่จ่ายไว้เป็นเงินกี่บาท`,
                  answer: wht, unit: 'บาท', tol: 0.01,
                  hint: `ภาษีหัก ณ ที่จ่าย = ${baht(W)} × ${wr}/100`,
                  why: `ภาษีหัก ณ ที่จ่าย ${wr}% = ${baht(W)} × 3/100 = <b>${baht(wht)} บาท</b>`,
                  verify: () => wht
                }),
                Q.fill({
                  label: 'เงินที่ได้รับจริง',
                  q: `${nm[0]} จะได้รับเงินค่าจ้างสุทธิจริงกี่บาท`,
                  answer: net, unit: 'บาท', tol: 0.01,
                  hint: `เงินสุทธิ = ค่าจ้าง − ภาษีหัก ณ ที่จ่าย`,
                  why: `เงินสุทธิที่ได้รับ = ${baht(W)} − ${baht(wht)} = <b>${baht(net)} บาท</b>`,
                  verify: () => net
                })
              ]
            }));
          }

          // ข้อ 5: หนังสือรับรอง 50 ทวิ รวมยอดหัก ณ ที่จ่าย
          {
            const j1 = step(R, 20000, 40000, 5000);
            const j2 = step(R, 30000, 50000, 5000);
            const totWht = r2((j1 + j2) * 3 / 100);
            qs.push(Q.fill({
              label: 'ข้อ 5',
              q: `<b>${nm[1]}</b> เป็นฟรีแลนซ์ รับงาน 2 บริษัท: งานแรกได้ค่าจ้าง ${baht(j1)} บาท (ถูกหัก 3%) และงานที่สองได้ค่าจ้าง ${baht(j2)} บาท (ถูกหัก 3%) รวมภาษีที่ถูกหัก ณ ที่จ่ายตามหนังสือรับรอง 50 ทวิ ทั้งปีเป็นเงินกี่บาท`,
              answer: totWht, unit: 'บาท', tol: 0.01,
              hint: `รวมค่าจ้าง (${baht(j1)} + ${baht(j2)}) แล้วคูณ 3%`,
              why: `ค่าจ้างรวม = ${baht(j1 + j2)} บาท · ภาษีที่ถูกหักรวม = ${baht(j1 + j2)} × 3% = <b>${baht(totWht)} บาท</b>`,
              verify: () => totWht
            }));
          }

          // ข้อ 6: ฟรีแลนซ์เทียบภาษีปลายปี
          {
            const taxTot = step(R, 4000, 9000, 500);
            const whtTot = taxTot + step(R, 1500, 4000, 500);
            const refund = whtTot - taxTot;
            qs.push(Q.fill({
              label: 'ข้อ 6',
              q: `<b>${nm[2]}</b> มีภาษีที่ถูกหัก ณ ที่จ่ายจากงานอิสระทั้งปีรวม <b>${baht(whtTot)} บาท</b> แต่เมื่อคำนวณภาษีปลายปีหลังหักค่าใช้จ่ายและค่าลดหย่อนแล้ว พบว่ามีภาษีที่ต้องเสียเพียง <b>${baht(taxTot)} บาท</b> ${nm[2]} จะได้รับเงินภาษีคืนกี่บาท`,
              answer: refund, unit: 'บาท', tol: 0.01,
              hint: `เงินคืน = ภาษีที่ถูกหักไว้ − ภาษีที่ต้องเสียจริง`,
              why: `ได้รับเงินคืน = ${baht(whtTot)} − ${baht(taxTot)} = <b>${baht(refund)} บาท</b>`,
              verify: () => refund
            }));
          }

          return qs;
        }
      }
    ]
  };
})();
