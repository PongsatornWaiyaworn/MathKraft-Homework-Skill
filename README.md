# MathKraft Homework Skill 📐

ชุดเครื่องมือและแม่แบบสร้างแบบฝึกหัดคณิตศาสตร์ออนไลน์เชิงโต้ตอบ (Interactive Homework Engine) สไตล์ Retro-Neobrutalism มาตรฐานโรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก

---

## 📦 วิธีการติดตั้งและใช้งาน (Installation)

### 1. วิธีติดตั้งเป็น Antigravity Skill
คัดลอกโฟลเดอร์ `skills/mathkraft-hw-ui` ไปวางในตำแหน่งของ Antigravity:

- **Global Skill (ใช้งานได้ทุกโปรเจกต์):**
  - **Windows:** `C:\Users\<username>\.gemini\antigravity\skills\mathkraft-hw-ui`
  - **macOS / Linux:** `~/.gemini/antigravity/skills/mathkraft-hw-ui`
- **Workspace Skill (เฉพาะโปรเจกต์ปัจจุบัน):**
  - คัดลอกไปไว้ที่ `.gemini/skills/mathkraft-hw-ui` ภายในโฟลเดอร์ Workspace ของคุณ

*เมื่อติดตั้งแล้ว Antigravity Agent จะสามารถเรียกใช้งาน Skill นี้เพื่อสร้างและบิลด์แบบฝึกหัดได้อัตโนมัติ*

---

### 2. วิธีติดตั้งเป็น Claude Skill

รองรับการใช้งานร่วมกับ Claude ได้ 3 รูปแบบ:

#### 2.1 ใช้งานใน Claude Projects (แนะนำสำหรับ Claude.ai)
1. สร้างหรือเปิดโปรเจกต์ใน **Claude Projects**
2. ไปที่แถบ **Project Knowledge** แล้วเพิ่มไฟล์:
   - [`CLAUDE.md`](CLAUDE.md) หรือ [`templates/CLAUDE_PROMPT.md`](templates/CLAUDE_PROMPT.md)
   - [`templates/HW-template.js`](templates/HW-template.js)
3. ในกล่อง **Custom Instructions** ให้คัดลอกเนื้อหาจาก [`templates/CLAUDE_PROMPT.md`](templates/CLAUDE_PROMPT.md) ไปวาง
4. สั่งให้ Claude สร้างโจทย์บทเรียนที่ต้องการ แล้วนำโค้ดที่ได้ไปใส่ใน [`templates/template.html`](templates/template.html) (ตรงช่อง `<script id="mathkraft-content">`) ดับเบิลคลิกเปิดไฟล์ทำแบบฝึกหัดได้ทันที

#### 2.2 ใช้งานใน Claude Code (CLI)
- เมื่อ Clone คลังนี้ไป Claude Code จะตรวจพบไฟล์ [`CLAUDE.md`](CLAUDE.md) ที่ Root ของโปรเจกต์โดยอัตโนมัติ ทำให้ Claude Code เข้าใจคำสั่ง บิลด์ และตรวจสอบแบบฝึกหัดตามมาตรฐาน MathKraft ได้ทันที

#### 2.3 ใช้งานใน Claude Chat ทั่วไป
- คัดลอก System Prompt จากไฟล์ [`templates/CLAUDE_PROMPT.md`](templates/CLAUDE_PROMPT.md) ส่งให้ Claude ก่อนเริ่มสั่งทำโจทย์

---

### 3. วิธีติดตั้งผ่าน GitHub & Command Line (CLI)

```bash
# 1. Clone repository
git clone https://github.com/PongsatornWaiyaworn/MathKraft-Homework-Skill.git
cd MathKraft-Homework-Skill

# 2. ทดสอบความพร้อมของระบบ (100% Passed)
npm test

# 3. บิลด์ไฟล์ HTML จากไฟล์โจทย์
node skills/mathkraft-hw-ui/scripts/build-hw.js --config ./templates/course.json
```
