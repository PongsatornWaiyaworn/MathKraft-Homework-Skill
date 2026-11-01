# MathKraft Homework UI & Skill 📐⚡

> **คลังเครื่องมือสร้างแบบฝึกหัดคณิตศาสตร์ออนไลน์ (Interactive Homework Engine & Skill)**
> มาตรฐานโรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก · พัฒนาโดย ครูนิพนธ์ ไวยวรณ์ (MathKraft)

โปรเจกต์นี้เป็นชุดเครื่องมือแบบ Standalone และ Antigravity/Claude Skill สำหรับสร้างแบบฝึกหัดคณิตศาสตร์แบบ Single-file HTML ที่ทำงานแบบ Offline 100% ด้วยดีไซน์สไตล์ **Retro-Neobrutalism** ที่สวยงาม มีเอกลักษณ์ และเป็นมาตรฐานเดียวกันกับวิชาคณิตศาสตร์เพิ่มเติม

---

## ✨ จุดเด่น (Features)

1. **Single-file Offline HTML**:
   - บิลด์ไฟล์ออกมาเป็น `.html` เดี่ยวขนาดกะทัดรัด
   - รวมฟอนต์ Prompt (woff2) และระบบเรนเดอร์สมการคณิตศาสตร์ KaTeX ฝังอยู่ในไฟล์ ไม่ต้องต่อเน็ต
2. **KaTeX Math Engine เต็มรูปแบบ**:
   - รองรับสมการในประโยค (Inline): เขียนด้วย `$formula$` (เช่น `$a_n = 3\cdot 2^n - 6$`) หรือ `\(formula\)`
   - รองรับสมการแยกบรรทัด (Display): เขียนด้วย `$$formula$$` หรือ `\[formula\]`
3. **Retro-Neobrutalism Design System**:
   - เส้นกรอบคมชัด เงาทึบ 5px โทนสีครีม-เนวี-ทอง (`#F4F1E8`, `#16205B`, `#F5B335`)
   - ไม่มีแถบนำทางลอย (No Breadcrumbs), ไม่มีแถบข้อมูลนักเรียนกวนใจขณะทำโจทย์
   - หน้า Login และหน้าสรุปผลพร้อมรหัสยืนยัน (Verification Hash) ป้องกันการทุจริต
4. **รองรับโจทย์ถึง 7 รูปแบบ (7 Question Types)**:
   - `Q.choice` (ปรนัย 4 ตัวเลือก พร้อมสลับตัวเลือกอัตโนมัติ)
   - `Q.fill` (เติมคำตอบตัวเลข/ข้อความ พร้อมระบบ Tolerance ทศนิยม)
   - `Q.sort` (ลากหรือแตะการ์ดลงกล่องจำแนกประเภท)
   - `Q.pairs` (จับคู่ 1 ต่อ 1)
   - `Q.order` (เรียงลำดับขั้นตอนแสดงวิธีทำ/พิสูจน์ พร้อมเลือกเหตุผลกำกับ)
   - `Q.find` (จับผิดวิธีทำ 3 ขั้นตอน: หาบรรทัดผิด + เลือกสาเหตุ + เติมคำตอบที่ถูก)
   - `Q.group` (โจทย์สถานการณ์ปัญหาต่อเนื่องหลายข้อย่อย)
5. **Claude & AI Ready**:
   - มีเทมเพลตและคำสั่งเฉพาะสำหรับ Claude ในโฟลเดอร์ `templates/`
   - สามารถนำไปใช้ใน **Claude Projects** หรือส่งให้ AI เจนเนอเรตโจทย์ได้ทันทีโดยไม่หลุดกรอบดีไซน์
6. **Multi-seed RNG & Headless Selftest**:
   - สุ่มตัวเลขโจทย์ตาม seed ของนักเรียนแต่ละคน
   - ตรวจสอบความถูกต้องของโจทย์และคำตอบแบบอัตโนมัติก่อนนำไปสอนจริง (`npm test` / `--check`)

---

## 📁 โครงสร้างโปรเจกต์ (Repository Structure)

```
mathkraft-hw-skill/
├── README.md                      # คู่มือการใช้งานภาพรวม
├── package.json                   # การตั้งค่าแพ็กเกจและ npm scripts
├── LICENSE                        # สิทธิ์การใช้งาน MIT License
├── .gitignore
│
├── templates/                     # 🌟 โฟลเดอร์เทมเพลตสำหรับใช้งานทันที & Claude
│   ├── HW-template.js             # แม่แบบโค้ด JS สำหรับเขียนโจทย์ (มีตัวอย่างครบทุกรูปแบบ)
│   ├── standalone-worksheet.html  # ไฟล์ HTML สำเร็จรูป เปิดในเบราว์เซอร์ได้ทันที ไม่ต้องลง Node
│   ├── course.json                # แม่แบบการตั้งค่าคอร์สสำหรับบิลด์
│   └── CLAUDE_PROMPT.md           # คำสั่ง System Prompt สำหรับสั่งงาน Claude ให้สร้างโจทย์
│
├── scripts/
│   └── verify_skill.js            # สคริปต์ตรวจสอบความถูกต้องของ Skill (npm test)
│
└── skills/
    └── mathkraft-hw-ui/           # ตัว Engine หลักสำหรับ Antigravity Skill
        ├── SKILL.md               # คู่มือและสเปกของ Skill
        ├── scripts/
        │   └── build-hw.js        # CLI Builder สำหรับรวมไฟล์และทดสอบ
        ├── assets/
        │   └── shell/
        │       ├── head.tpl.html  # ส่วนหัว: Fonts, KaTeX, Engine CSS, Core Libs
        │       └── tail.tpl.html  # ส่วนท้าย: UI Controller, Form, Pills, Modal
        └── examples/              # ตัวอย่างคอร์สจริงที่ใช้งานในโรงเรียน
            ├── addmath-m4-2/      # คอร์สคณิตศาสตร์เพิ่มเติม ม.4 เทอม 2 (13 บท)
            ├── artmath-m4-2/      # คอร์สคณิตศาสตร์ศิลป์ ม.4 เทอม 2 (14 บท)
            └── basicmath-m5-2/    # คอร์สคณิตศาสตร์พื้นฐาน ม.5 เทอม 2 (13 บท)
```

---

## 🚀 วิธีการใช้งาน (Getting Started)

### วิธีที่ 1: ใช้งานผ่าน Claude AI (ง่ายที่สุด ✨)

1. เปิดไฟล์ [`templates/CLAUDE_PROMPT.md`](templates/CLAUDE_PROMPT.md)
2. คัดลอก System Prompt ไปวางใน **Claude Projects** หรือ **Claude Chat**
3. พิมพ์สั่งโจทย์ที่ต้องการ เช่น:
   > *"สร้างแบบฝึกหัด MathKraft เรื่อง ลำดับเรขาคณิต ม.5 จำนวน 3 ด่านตามมาตรฐานนี้"*
4. นำโค้ด JavaScript ที่ Claude สร้างไปใช้งาน:
   - **ทางเลือก A (ไม่ต้องลงโปรแกรม):** เปิดไฟล์ [`templates/standalone-worksheet.html`](templates/standalone-worksheet.html) แล้วนำโค้ดไปวางในแท็ก `<script id="mathkraft-content">` จากนั้นดับเบิลคลิกเปิดไฟล์ด้วยเบราว์เซอร์ได้ทันที!
   - **ทางเลือก B (ระบบบิลด์อัตโนมัติ):** บันทึกเป็นไฟล์ `HW-xx.js` ในโฟลเดอร์ `content/` แล้วสั่งบิลด์ด้วย Node.js

---

### วิธีที่ 2: ติดตั้งและใช้งานผ่าน GitHub

#### 1. Clone คลังเก็บโค้ด
```bash
git clone https://github.com/<your-username>/mathkraft-hw-skill.git
cd mathkraft-hw-skill
```

#### 2. ตรวจสอบความสมบูรณ์ของระบบ
```bash
npm test
```

#### 3. สร้างคอร์สใหม่ด้วย CLI (Scaffold)
```bash
node skills/mathkraft-hw-ui/scripts/build-hw.js --init ./my-course --name "ค32101"
```

#### 4. ทดสอบความถูกต้องของโจทย์ทุกข้อ (Headless Multi-seed Selftest)
```bash
node skills/mathkraft-hw-ui/scripts/build-hw.js --config ./skills/mathkraft-hw-ui/examples/addmath-m4-2/course.json --check
```

#### 5. บิลด์ไฟล์ HTML ทั้งหมด
```bash
node skills/mathkraft-hw-ui/scripts/build-hw.js --config ./skills/mathkraft-hw-ui/examples/addmath-m4-2/course.json
```
ไฟล์ผลลัพธ์ทั้งหมดจะถูกสร้างไว้ในโฟลเดอร์ `dist/` เป็นไฟล์ HTML เดี่ยวพร้อมแจกให้นักเรียนทำได้ทันที

---

### วิธีที่ 3: ติดตั้งเป็น Antigravity Skill

คัดลอกโฟลเดอร์ `skills/mathkraft-hw-ui` ไปวางไว้ที่:
- **Global Skill**: `~/.gemini/antigravity/skills/mathkraft-hw-ui` (Windows: `C:\Users\<username>\.gemini\antigravity\skills\mathkraft-hw-ui`)
- **Workspace Skill**: วางใน `.gemini/skills/mathkraft-hw-ui` ภายในโฟลเดอร์โปรเจกต์ของคุณ

เมื่อติดตั้งแล้ว AI Assistant ใน Antigravity จะสามารถสร้างแบบฝึกหัด ตรวจสอบข้อคำถาม และบิลด์ไฟล์ตามมาตรฐานนี้ได้อัตโนมัติ

---

## 📐 ตัวอย่างการเขียนสมการคณิตศาสตร์ (Math Formatting)

```javascript
// สมการในบรรทัด (Inline)
q: 'กำหนดลำดับ $a_n = 3\cdot 2^n - 6$ จงหาค่าของ $a_4$'

// สมการแยกบรรทัดกึ่งกลาง (Display)
why: 'จากสูตรผลรวมอนุกรม $$S_n = \\frac{n}{2}(a_1 + a_n)$$ แทนค่าจะได้ $S_5 = 50$'
```

---

## 📜 ลิขสิทธิ์ (License)

เผยแพร่ภายใต้สัญญาอนุญาต [MIT License](LICENSE)
- MathKraft · ครูนิพนธ์ ไวยวรณ์
- โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก
