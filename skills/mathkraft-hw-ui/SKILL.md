---
name: mathkraft-hw-ui
description: สร้างและบิลด์แบบฝึกหัดคณิตศาสตร์ออนไลน์ MathKraft (Interactive Homework Worksheet) สไตล์ Retro-Neobrutalism ด้วย UI มาตรฐานคณิตเพิ่มเติม, ระบบสุ่มโจทย์หลาย seed, ตรวจคำตอบอัตโนมัติ, KaTeX rendering, และ headless selftest
---

# MathKraft Homework UI Skill

คู่มือและชุดเครื่องมือสร้างแบบฝึกหัดคณิตศาสตร์เชิงโต้ตอบ (Interactive Worksheet) ที่เป็นไฟล์ HTML เดี่ยว (Single-file HTML) ทำงานแบบ Client-side 100% ไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก มี KaTeX และฟอนต์ Prompt ในตัว พร้อม UI สไตล์ Retro-Neobrutalism ที่ทันสมัย สะอาด และใช้งานง่ายบนทุกอุปกรณ์

---

## 1. โครงสร้างและสถาปัตยกรรม (Architecture)

ไฟล์แบบฝึกหัดแต่ละไฟล์ถูกประกอบขึ้นจาก 3 ส่วนหลักโดย `build-hw.js`:

```
┌────────────────────────────────────────────────────────┐
│ 1. Head Shell (head.tpl.html)                          │
│    - WOFF2 Embedded 'Prompt' Font (400, 600, 700)      │
│    - KaTeX Math Typesetting (CSS + JS bundle)          │
│    - MathKraft Design Tokens (CSS Variables)           │
│    - Engine Core (window.MK: RNG, KaTeX helper, Lab)   │
├────────────────────────────────────────────────────────┤
│ 2. Content Module (content/HW-XX_*.js)                 │
│    - window.HW = { ... }                               │
│    - Metadata, Levels (ด่านย่อย), Question generators   │
│    - Analytical solution & validation logic            │
├────────────────────────────────────────────────────────┤
│ 3. Tail Shell (tail.tpl.html)                          │
│    - Engine UI Controller                              │
│    - Intro Screen (แผ่นปิดหน้าแบบฝึกหัด + ตราประทับ)        │
│    - Sticky Pill Bar (สลับด่านย่อย)                     │
│    - Question Renderers (Choice, Fill, Sort, Pairs...) │
│    - Grading, Summary Modal, LocalStorage state save   │
└────────────────────────────────────────────────────────┘
```

---

## 2. คำสั่ง CLI (build-hw.js)

ชุดคำสั่งหลักอยู่ที่ `scripts/build-hw.js`:

### 2.1 เริ่มต้นสร้างคอร์สใหม่ (Scaffold)
```bash
node scripts/build-hw.js --init <path-to-target-dir> --name <CourseCode>
```
คำสั่งนี้จะสร้าง:
- `course.json` พร้อมตั้งค่ารายวิชา
- โฟลเดอร์ `content/` พร้อมไฟล์โครงสร้างตั้งต้น `HW-01_1.1_ตัวอย่าง.js`
- โฟลเดอร์ `dist/` สำหรับเก็บไฟล์ HTML ปลายทาง

### 2.2 บิลด์เป็นไฟล์ HTML
```bash
node scripts/build-hw.js --config <path-to-course.json>
```
อ่านไฟล์ใน `content/` แล้วนำมารวมกับ `head.tpl.html` และ `tail.tpl.html` เพื่อสร้างไฟล์ HTML เดี่ยวในโฟลเดอร์ปลายทาง (`outDir`)

### 2.3 ตรวจสอบความถูกต้องของโจทย์และระบบตรวจ (Headless Multi-seed Selftest)
```bash
node scripts/build-hw.js --config <path-to-course.json> --check
```
คำสั่งนี้จะจำลองการสุ่มโจทย์ด้วย seed ต่างๆ (Default 5 seeds ต่อข้อ) แล้วรันระบบตรวจคำตอบอัตโนมัติ เพื่อยืนยันว่า:
- ไม่มีข้อใดคำนวณผิดพลาด (NaN, Infinity, Divide by zero)
- ตัวเลือกคำตอบถูกต้องและไม่ซ้ำกัน
- ฟังก์ชันตรวจ (Validator) ทำงานถูกต้องกับคำตอบที่ถูกต้อง

### 2.4 บิลด์เฉพาะไฟล์ใดไฟล์หนึ่ง (Single File Build)
```bash
node scripts/build-hw.js --config <path-to-course.json> --single HW-01
```

---

## 3. รูปแบบข้อมูล `course.json`

```json
{
  "code": "ค31202",
  "title": "คณิตศาสตร์เพิ่มเติม ม.4 ภาคเรียนที่ 2",
  "author": "MathKraft · ครูนิพนธ์ ไวยวรณ์ · โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก",
  "contentDir": "./content",
  "outDir": "./dist",
  "brand": "MathKraft",
  "theme": "retro-cream"
}
```

---

## 4. โครงสร้างไฟล์โจทย์ (`content/HW-XX_*.js`)

ไฟล์โจทย์แต่ละไฟล์จะกำหนดออบเจกต์ `window.HW`:

```javascript
window.HW = {
  id: "HW-01",
  code: "1.1",
  title: "ชื่อเรื่องแบบฝึกหัด",
  unit: 1,
  type: "K", // K = ความรู้ความเข้าใจ, P = ทักษะกระบวนการ, S = สรุป
  points: 10,
  time: "20-30 นาที",
  brief: {
    desc: "คำอธิบายภาพรวมของแบบฝึกหัดนี้",
    objectives: [
      "สามารถอธิบายแนวคิด...",
      "สามารถคำนวณและแก้โจทย์..."
    ]
  },
  levels: [
    {
      id: "lv1",
      title: "ด่านที่ 1: พื้นฐาน",
      pts: 3,
      desc: "ทดสอบความเข้าใจเบื้องต้น",
      build: function(ctx, rng) {
        // สร้างข้อคำถาม
      }
    },
    {
      id: "lv2",
      title: "ด่านที่ 2: ประยุกต์",
      pts: 4,
      desc: "วิเคราะห์และคำนวณหลายขั้นตอน",
      build: function(ctx, rng) {
        // สร้างข้อคำถาม
      }
    }
  ]
};
```

---

## 5. รูปแบบข้อคำถามที่รองรับ (Question Types)

ภายในฟังก์ชัน `build(ctx, rng)` สามารถสร้างข้อคำถามได้หลายประเภทผ่าน `ctx.add(...)`:

### 5.1 ตัวเลือกหลายข้อ (Multiple Choice)
```javascript
ctx.add({
  type: 'choice',
  prompt: 'ถ้าต้องการจัดเรียงหนังสือ ' + n + ' เล่มที่แตกต่างกันเป็นแถว จะจัดได้กี่วิธี',
  options: [
    { text: '$' + n + '! = ' + ans + '$ วิธี', correct: true },
    { text: '$' + (n - 1) + '!$ วิธี', correct: false },
    { text: '$' + (n * 2) + '$ วิธี', correct: false },
    { text: '$' + Math.pow(n, 2) + '$ วิธี', correct: false }
  ],
  hint: 'ใช้กฎการเรียงสับเปลี่ยนสิ่งของที่แตกต่างกันทั้งหมด $P_{n,n} = n!$',
  solution: 'จำนวนวิธีทั้งหมดเท่ากับ $' + n + '! = ' + ans + '$ วิธี'
});
```

### 5.2 เติมคำตอบตัวเลข / ค่าสัมบูรณ์ (Fill in the Blank)
```javascript
ctx.add({
  type: 'fill',
  prompt: 'จงหาค่าของ $\\log_{' + b + '}{' + val + '}$',
  answer: ans,
  tolerance: 0.001, // ค่าเผื่อทศนิยมสำหรับคำนวณ
  unit: '', // หน่วย (ถ้ามี)
  hint: 'แปลงเป็นสมการเลขยกกำลัง $' + b + '^x = ' + val + '$',
  solution: 'เนื่องจาก $' + b + '^{' + ans + '} = ' + val + '$ ดังนั้นตอบ $' + ans + '$'
});
```

### 5.3 ถูก / ผิด (True / False)
```javascript
ctx.add({
  type: 'tf',
  prompt: 'ข้อความต่อไปนี้ถูกต้องหรือไม่: "สำหรับเซต $A, B$ ใดๆ $P(A \\cup B) = P(A) + P(B)$ เสมอ"',
  answer: false,
  explanation: 'เป็นจริงเฉพาะเมื่อ $A$ และ $B$ เป็นเหตุการณ์ที่ไม่เกิดร่วมกัน ($A \\cap B = \\emptyset$)'
});
```

### 5.4 จับคู่ (Matching / Pairs)
```javascript
ctx.add({
  type: 'pairs',
  prompt: 'จับคู่นิพจน์ลอการิทึมกับค่าที่เท่ากัน',
  pairs: [
    { left: '$\\log_2 8$', right: '$3$' },
    { left: '$\\log_3 81$', right: '$4$' },
    { left: '$\\log_{10} 1000$', right: '$3$' },
    { left: '$\\log_5 25$', right: '$2$' }
  ]
});
```

### 5.5 เรียงลำดับขั้นตอน (Order / Sort)
```javascript
ctx.add({
  type: 'order',
  prompt: 'เรียงลำดับขั้นตอนการแก้สมการ $\\log_2(x - 1) = 3$',
  items: [
    'แปลงเป็นรูปเลขยกกำลัง $x - 1 = 2^3$',
    'คำนวณค่า $2^3 = 8$ จะได้ $x - 1 = 8$',
    'ย้ายข้างหาค่า $x = 8 + 1 = 9$',
    'ตรวจเงื่อนไขหลัง log: $9 - 1 = 8 > 0$ (ผ่าน)'
  ]
});
```

### 5.6 ข้อกำหนดเฉพาะและห้องแล็บจำลอง (Interactive Labs)
รองรับการแทรกโมดูลโต้ตอบ `MK.lab`:
- `MK.lab.venn(...)` – แผนภาพเวนน์-ออยเลอร์โต้ตอบ
- `MK.lab.tree(...)` – แผนภาพต้นไม้แจกแจงกรณี
- `MK.lab.spinner(...)` – วงล้อสุ่มหมุนพร้อมสถิติ
- `MK.lab.dice(...)` – ลูกเต๋าสุ่มเสมือนจริง

---

## 6. เครื่องมือสุ่มและคำนวณ (RNG Helpers)

Engine มาพร้อมคลาสสุ่มที่มี deterministic seed:
- `rng.int(min, max)`: สุ่มจำนวนเต็มระหว่าง `min` ถึง `max`
- `rng.pick(array)`: สุ่มเลือกสมาชิก 1 ตัวจากอาร์เรย์
- `rng.shuffle(array)`: สลับลำดับสมาชิกในอาร์เรย์
- `rng.sub(name)`: สร้าง sub-generator แยกส่วนเพื่อไม่ให้กระทบโจทย์ข้ออื่น

---

## 7. มาตรฐานการออกแบบ (Design Tokens & UI)

ชุดสีและสไตล์ Retro-Neobrutalism มาตรฐาน:
- **Cream Background**: `#F4F1E8`
- **Paper Surface**: `#FFFDF7`
- **Deep Navy (Line/Text/Border)**: `#16205B`
- **Accent Gold**: `#F5B335`
- **Accent Teal**: `#14A38B`
- **Accent Red / Coral**: `#F4522D`
- **Borders**: `2px solid #16205B` หรือ `2.5px solid #16205B`
- **Shadows**: `5px 5px 0 #16205B` (สไตล์ Neobrutalism หนักแน่น)
- **Typography**: Google Fonts `'Prompt'` (TH/EN) และ KaTeX สำหรับสมการ
- **Header / Brand**: `MathKraft · ครูนิพนธ์ ไวยวรณ์ · โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก`
