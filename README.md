# MathKraft Homework UI & Skill

คลังเครื่องมือสร้างแบบฝึกหัดคณิตศาสตร์ออนไลน์ (Interactive Homework Engine) มาตรฐานโรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก พัฒนาโดย ครูนิพนธ์ ไวยวรณ์ (MathKraft)

โปรเจกต์นี้แยกออกมาเป็น Git Repository อิสระ สามารถนำไปติดตั้งบนเครื่องคอมพิวเตอร์เครื่องอื่น หรือนำไปใช้งานร่วมกับ Antigravity ได้ทันที

---

## จุดเด่น (Features)

1. **Single-file HTML**: บิลด์ไฟล์ออกมาเป็น HTML เดี่ยวขนาดกะทัดรัด มีฟอนต์ Prompt (woff2) และ KaTeX รวมอยู่ในตัว สามารถเปิดบนเบราว์เซอร์ใดก็ได้โดยไม่ต้องต่ออินเทอร์เน็ต
2. **Retro-Neobrutalism UI**: หน้าตาสวยงาม ทันสมัย ชัดเจน สไตล์ Neobrutalism (กรอบเส้นคมชัด เงาทึบ 5px โทนสีครีม-เนวี-ทอง) เหมือนวิชาคณิตศาสตร์เพิ่มเติม
3. **Multi-seed RNG & Headless Selftest**: ระบบสุ่มโจทย์ตาม seed ของนักเรียน พร้อมระบบจำลองการตรวจคำตอบอัตโนมัติก่อนนำไปใช้งานจริง (`--check`)
4. **Antigravity Skill Ready**: โครงสร้างโฟลเดอร์ถูกจัดเตรียมไว้ตามมาตรฐาน Antigravity Skill สามารถคัดลอกไปไว้ใน `~/.gemini/antigravity/skills/` หรือ workspace ได้ทันที

---

## โครงสร้างโฟลเดอร์ (Repository Structure)

```
mathkraft-hw-skill/
├── README.md
├── .gitignore
└── skills/
    └── mathkraft-hw-ui/
        ├── SKILL.md                 # คู่มือและคำอธิบาย Skill สำหรับ Antigravity
        ├── scripts/
        │   └── build-hw.js          # CLI Script สำหรับสร้าง, บิลด์ และทดสอบโจทย์
        ├── assets/
        │   ├── HW-skeleton.js       # แม่แบบเริ่มต้นสำหรับการเขียนข้อคำถาม
        │   └── shell/
        │       ├── head.tpl.html    # Head shell (Fonts, CSS, KaTeX, Engine Core)
        │       └── tail.tpl.html    # Tail shell (UI Controller, Intro, Summary)
        └── examples/
            └── addmath-m4-2/        # ตัวอย่างคอร์สคณิตศาสตร์เพิ่มเติม ม.4 เทอม 2 (13 บท)
                ├── course.json
                └── content/
                    ├── HW-01_1.1_หลักการบวกและหลักการคูณ.js
                    └── ...
```

---

## การติดตั้งและใช้งาน (Usage)

### ความต้องการของระบบ
- [Node.js](https://nodejs.org/) v18 ขึ้นไป

### 1. วิธีติดตั้งเป็น Antigravity Skill

สามารถคัดลอกโฟลเดอร์ `skills/mathkraft-hw-ui` ไปวางไว้ที่:
- **Global Skill**: `C:\Users\<username>\.gemini\antigravity\skills\mathkraft-hw-ui` (Windows) หรือ `~/.gemini/antigravity/skills/mathkraft-hw-ui` (macOS/Linux)
- **Workspace Skill**: นำไปวางในโฟลเดอร์ `.gemini/skills/mathkraft-hw-ui` ของโปรเจกต์ใดก็ได้

เมื่อติดตั้งแล้ว AI Assistant ใน Antigravity จะสามารถเรียกใช้ Skill นี้เพื่อสร้างแบบฝึกหัดใหม่ ตรวจสอบโจทย์ และบิลด์ไฟล์ HTML ได้โดยอัตโนมัติ

---

### 2. วิธีใช้งานผ่าน Command Line (CLI)

#### 2.1 สร้างโครงสร้างคอร์สใหม่ (Scaffold)
```bash
node skills/mathkraft-hw-ui/scripts/build-hw.js --init ./my-new-course --name "ค32101"
```

#### 2.2 ทดสอบความถูกต้องของโจทย์ทุกข้อ (Selftest)
```bash
node skills/mathkraft-hw-ui/scripts/build-hw.js --config ./skills/mathkraft-hw-ui/examples/addmath-m4-2/course.json --check
```

#### 2.3 บิลด์ไฟล์ HTML ทั้งหมด
```bash
node skills/mathkraft-hw-ui/scripts/build-hw.js --config ./skills/mathkraft-hw-ui/examples/addmath-m4-2/course.json
```

---

## ลิขสิทธิ์และการนำไปใช้
- MathKraft · ครูนิพนธ์ ไวยวรณ์
- โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก
