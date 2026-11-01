/* HW-01 · 1.1 ตัวอย่างแบบฝึก
 * ------------------------------------------------------------------
 * คัดลอกไฟล์นี้ → ตั้งชื่อ HW-02_1.2_ชื่อบทเรียน.js → แก้เนื้อหา
 * ไฟล์ต้องขึ้นต้นด้วย IIFE และกำหนด window.HW ตอนท้าย (ห้ามใส่ <script> ครอบ)
 * ไฟล์ตัวอย่างเต็ม ๆ ทุกชนิดข้อ ดูที่ examples/addmath-m4-2/content/
 */
(function () {
  'use strict';
  const MK = window.MK, Q = MK.Q;
  const r = String.raw; // r`...` เก็บเครื่องหมาย \ ของ LaTeX ไว้ เช่น \(x^2\) และ \\dfrac

  /* ---------- ข้อแบบเติมคำตอบ (ตัวเลขสุ่มใหม่ทุกครั้งที่ทำ) ---------- */
  function qSum(R) {
    const a = R.int(12, 48), b = R.int(12, 48);
    return Q.fill({
      q: r`จงหาค่าของ \(${a}+${b}\)`,
      answer: a + b, unit: '',
      hint: r`บวกหลักหน่วยก่อน แล้วค่อยบวกหลักสิบ`,
      why: r`\(${a}+${b}=${a + b}\)`,
      verify: () => a + b, // คำนวณซ้ำอีกวิธี — selftest จะเทียบกับ answer
    });
  }

  /* ---------- ข้อเลือกตอบ (answer = ลำดับเดิมใน options ก่อนสลับ) ---------- */
  function qWhich(R) {
    const n = R.int(3, 6);
    return Q.choice({
      q: r`ข้อใดเท่ากับ \(${n}\times ${n}\)`,
      options: [r`\(${n * n}\)`, r`\(${n + n}\)`, r`\(${n * 2 + 1}\)`, r`\(${n * n + n}\)`],
      answer: 0,
      why: r`\(${n}\times ${n}=${n * n}\)`,
      verify: () => [n * n, n + n, n * 2 + 1, n * n + n].indexOf(n * n),
    });
  }

  /* ---------- ข้อจริง/เท็จ ---------- */
  function qTrue(R) {
    const a = R.int(2, 9), b = R.int(2, 9), claim = R.chance(0.5);
    const shown = claim ? a * b : a * b + R.int(1, 3);
    return Q.tf({
      q: r`ข้อความ \(${a}\times ${b}=${shown}\) ถูกหรือผิด`,
      answer: claim,
      why: r`\(${a}\times ${b}=${a * b}\)`,
      verify: () => (a * b === shown ? 0 : 1), // 0 = ถูก, 1 = ผิด
    });
  }

  /* ---------- ข้อกลุ่ม: โจทย์สถานการณ์เดียว หลายข้อย่อย ---------- */
  function qStory(R) {
    const price = R.int(8, 20), qty = R.int(3, 9), pay = price * qty + R.int(1, 5) * 10;
    return Q.group({
      story: r`<b>ร้านค้าโรงเรียน</b> · ขายสมุดเล่มละ ${price} บาท นักเรียนซื้อ ${qty} เล่ม`,
      parts: [
        Q.fill({ label: 'ราคารวม', q: r`ต้องจ่ายเงินรวมกี่บาท`, answer: price * qty, unit: 'บาท', why: r`\(${price}\times ${qty}=${price * qty}\)`, verify: () => price * qty, weight: 1 }),
        Q.fill({ label: 'เงินทอน', q: r`ถ้าจ่ายด้วยเงิน ${pay} บาท จะได้รับเงินทอนกี่บาท`, answer: pay - price * qty, unit: 'บาท', why: r`\(${pay}-${price * qty}=${pay - price * qty}\)`, verify: () => pay - price * qty, weight: 1 }),
      ],
    });
  }

  window.HW = {
    id: 'HW-01', unit: 1, unitName: 'หน่วยที่ 1 ชื่อหน่วย', title: 'ตัวอย่างแบบฝึก',
    sub: 'คำอธิบายสั้น ๆ ใต้หัวเรื่อง 1–2 ประโยค บอกว่านักเรียนจะได้ฝึกอะไร',
    size: '8 ข้อ · 10 นาที', K: 2, P: 1, // คะแนนรวมความรู้ (K) และทักษะกระบวนการ (P)
    // reviewFile: '1.1_ชื่อไฟล์สื่อการสอน.html', // ถ้ามีสื่อการสอนให้ปุ่ม "เปิดสื่อการสอน" ลิงก์ไป (ต่อท้าย reviewBase ใน course.json)
    levels: [
      { short: 'ด่าน 1', title: 'ด่าน 1 · วอร์มอัป', kind: 'K', points: 1, skill: 'บวกและคูณจำนวนเต็ม', review: 'หัวข้อ 1.1.1',
        desc: 'ตอบข้อสั้น ๆ เพื่ออุ่นเครื่อง', intro: 'พิมพ์คำตอบเป็นตัวเลข ตอบถูกครั้งแรกได้เต็ม ผิดแล้วมีคำใบ้',
        build(R) { return [qSum(R), qWhich(R), qTrue(R)]; } },
      { short: 'ด่าน 2', title: 'ด่าน 2 · โจทย์สถานการณ์', kind: 'K', points: 1, skill: 'ประยุกต์การคูณและการลบในสถานการณ์จริง', review: 'หัวข้อ 1.1.2',
        desc: 'อ่านสถานการณ์แล้วตอบหลายข้อย่อย', intro: 'อ่านโจทย์ให้ครบก่อนตอบ',
        build(R) { return [qStory(R), qStory(R)]; } },
      { short: 'ด่าน 3', title: 'ด่าน 3 · ท้าทาย', kind: 'P', points: 1, skill: 'วางแผนแก้ปัญหาหลายขั้นตอน', review: 'หัวข้อ 1.1.3',
        desc: 'โจทย์หลายขั้นตอน', intro: 'ลองคิดทีละขั้นตอน',
        build(R) { return [qStory(R), qSum(R)]; } },
    ],
  };
})();
