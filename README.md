# MathKraft Homework Skill 📐

ชุดเครื่องมือและแม่แบบสร้างแบบฝึกหัดคณิตศาสตร์ออนไลน์เชิงโต้ตอบ (Interactive Homework Engine) สไตล์ Retro-Neobrutalism มาตรฐานโรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก

---

## 📦 วิธีการติดตั้งและใช้งาน (Installation)

### 1. ติดตั้งเป็น Antigravity Skill
คัดลอกโฟลเดอร์ `skills/mathkraft-hw-ui` ไปวางในตำแหน่งที่ต้องการ:

- **Global Skill (ทุกโปรเจกต์):**
  - **Windows:** `C:\Users\<username>\.gemini\antigravity\skills\mathkraft-hw-ui`
  - **macOS / Linux:** `~/.gemini/antigravity/skills/mathkraft-hw-ui`
- **Workspace Skill (เฉพาะโปรเจกต์นี้):**
  - นำไปวางในโฟลเดอร์ `.gemini/skills/mathkraft-hw-ui` ของ Workspace

---

### 2. ติดตั้งใช้งานใน Claude / Claude Projects
1. เปิดไฟล์ [`templates/CLAUDE_PROMPT.md`](templates/CLAUDE_PROMPT.md)
2. คัดลอก System Prompt ไปวางใน **Project Instructions** (ใน Claude Projects) หรือวางในกล่องข้อความก่อนสั่งงาน
3. นำโค้ดโจทย์ที่ Claude สร้างมาใส่ใน [`templates/template.html`](templates/template.html) (ตรง `<script id="mathkraft-content">`) ดับเบิลคลิกเปิดใช้งานได้ทันที

---

### 3. ติดตั้งผ่าน GitHub & Command Line (CLI)

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/mathkraft-hw-skill.git
cd mathkraft-hw-skill

# 2. ทดสอบความพร้อมของระบบ
npm test

# 3. บิลด์ไฟล์ HTML จากไฟล์โจทย์
node skills/mathkraft-hw-ui/scripts/build-hw.js --config ./templates/course.json
```
