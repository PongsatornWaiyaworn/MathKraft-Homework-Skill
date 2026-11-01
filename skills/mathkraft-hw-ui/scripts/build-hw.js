#!/usr/bin/env node
/**
 * MathKraft HW builder
 * --------------------
 * Assembles a complete, single-file, offline worksheet from
 *   assets/shell/head.tpl.html  (fonts + KaTeX + engine CSS + engine core/labs)
 *   <your lesson content .js>   (the window.HW = {...} definition)
 *   assets/shell/tail.tpl.html  (engine UI: intro form, level pills, summary page)
 *
 * Usage
 *   node build-hw.js --config course.json [--out dist] [--content content] [--only HW-03]
 *                    [--check] [--no-selftest] [--seeds 120]
 *   node build-hw.js --init <dir> [--name ค3xxxx]      scaffold a new course folder
 *
 * course.json (paths are relative to the json file)
 *   {
 *     "courseCode":   "ค31202",
 *     "courseName":   "คณิตศาสตร์เพิ่มเติม 2",
 *     "level":        "ม.4",
 *     "defaultClass": "ม.4/1",
 *     "storageId":    "31202",
 *     "reviewBase":   "../สื่อการสอน-HTML/",
 *     "content":      "content",
 *     "out":          "dist"
 *   }
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SKILL_ROOT = path.resolve(__dirname, '..');
const SHELL = path.join(SKILL_ROOT, 'assets', 'shell');

function die(msg) { console.error('✗ ' + msg); process.exit(1); }

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const k = t.slice(2);
      if (['check', 'no-selftest'].includes(k)) a[k] = true;
      else a[k] = argv[++i];
    } else a._.push(t);
  }
  return a;
}

/* ------------------------------------------------------------------ */
const REQUIRED = ['courseCode', 'courseName', 'level', 'defaultClass', 'storageId'];
function loadConfig(file) {
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const k of REQUIRED) if (!cfg[k]) die(`course.json is missing "${k}"`);
  cfg.reviewBase = cfg.reviewBase == null ? '' : cfg.reviewBase;
  // these values land inside single-quoted JS strings / attribute values — keep them inert
  for (const k of [...REQUIRED, 'reviewBase']) if (/['"\\<>\n]/.test(String(cfg[k]))) die(`"${k}" must not contain quotes, backslashes or angle brackets`);
  cfg.__dir = path.dirname(path.resolve(file));
  return cfg;
}

function escText(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function fillTemplate(tpl, vars) {
  return tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => {
    if (!(k in vars)) die('unknown placeholder ' + m);
    return vars[k];
  });
}

/** read window.HW id/title out of a content file without executing it */
function readMeta(js, file) {
  const m = js.match(/window\.HW\s*=\s*\{\s*id:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")[\s\S]*?\btitle:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)/);
  if (!m) die(`${file}: could not find "window.HW = { id: '...', ..., title: '...' }"`);
  return { id: vm.runInNewContext(m[1]), title: vm.runInNewContext(m[2]) };
}

function buildOne(cfg, contentFile, headTpl, tailTpl, total) {
  const js = fs.readFileSync(contentFile, 'utf8');
  const meta = readMeta(js, path.basename(contentFile));
  const vars = {
    TITLE: escText(`${meta.id} ${meta.title} · ${cfg.courseCode} ${cfg.level} · MathKraft`),
    COURSE_CODE: cfg.courseCode, COURSE_NAME: cfg.courseName, LEVEL: cfg.level,
    DEFAULT_CLASS: cfg.defaultClass, STORAGE_ID: cfg.storageId, REVIEW_BASE: cfg.reviewBase,
    TOTAL: String(total),
  };
  const html = fillTemplate(headTpl, vars) + '<script>' + js + '</script>\n' + fillTemplate(tailTpl, vars);
  return { html, js, meta };
}

/* ------------------------------------------------------------------ */
/* selftest: run the engine headlessly, generate many seeds, cross-check answer vs verify() */
function engineScripts(headTpl, tailTpl) {
  const out = [];
  for (const m of (headTpl + tailTpl).matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const s = m[1];
    if (s.startsWith('!function(e,t){')) continue;           // KaTeX
    if (s.includes('MathKraft HW engine — UI')) continue;     // DOM UI
    out.push(s.replace(/\{\{[A-Z_]+\}\}/g, 'x'));
  }
  return out;
}

function sameAnswer(MK, a, b) {
  if (typeof a === 'number' && typeof b === 'number') return MK.numEq(a, b) || Math.abs(a - b) < 5e-4; // tolerate 4-decimal rounding
  try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return a === b; }
}

function selftest(js, name, scripts, seeds) {
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, document: {}, navigator: {}, setTimeout, clearTimeout });
  ctx.window = ctx;
  try {
    for (const s of scripts) vm.runInContext(s, ctx, { filename: 'engine' });
    vm.runInContext(js, ctx, { filename: name });
  } catch (e) { return [`cannot load: ${e && e.message}`]; }
  const MK = ctx.MK, HW = ctx.HW;
  const problems = [];
  if (!HW) return ['window.HW was not defined'];
  for (const k of ['id', 'unit', 'unitName', 'title', 'sub', 'size', 'K', 'levels']) if (HW[k] == null) problems.push(`HW.${k} is missing`);
  if (!Array.isArray(HW.levels) || !HW.levels.length) return problems.concat('HW.levels must be a non-empty array');
  HW.levels.forEach((L, i) => { for (const k of ['short', 'title', 'kind', 'points', 'build', 'skill', 'desc', 'intro']) if (L[k] == null) problems.push(`levels[${i}].${k} is missing`); });
  const sums = { K: 0, P: 0 };
  HW.levels.forEach((L) => { if (sums[L.kind] != null) sums[L.kind] += +L.points || 0; });
  const simpleKinds = HW.levels.every((L) => L.kind === 'K' || L.kind === 'P');
  if (simpleKinds && (Math.abs(sums.K - (HW.K || 0)) > 1e-9 || Math.abs(sums.P - (HW.P || 0)) > 1e-9)) problems.push(`warning: level points K=${sums.K}, P=${sums.P} but HW.K=${HW.K}, HW.P=${HW.P || 0}`);

  const walk = (q, where, seed, out) => {
    if (q.type === 'group') { (q.parts || []).forEach((p, j) => walk(p, where + '.' + j, seed, out)); return; }
    out.push([q, where]);
  };
  let checked = 0;
  const seen = new Set();
  for (let seed = 1; seed <= seeds; seed++) {
    HW.levels.forEach((L, li) => {
      let qs;
      try { qs = L.build(MK.rng(seed * 100003 + (li + 1) * 7919)); } catch (e) { const m = `levels[${li}].build threw (seed ${seed}): ${e && e.message}`; if (!seen.has(m)) { seen.add(m); problems.push(m); } return; }
      const flat = []; qs.forEach((q, qi) => walk(q, `L${li + 1}.Q${qi + 1}`, seed, flat));
      for (const [q, where] of flat) {
        if (typeof q.verify !== 'function' || q.answer === undefined) continue;
        checked++;
        let v; try { v = q.verify(); } catch (e) { v = e; }
        if (!sameAnswer(MK, v, q.answer)) {
          const m = `${where}: answer ${JSON.stringify(q.answer)} ≠ verify() ${JSON.stringify(v instanceof Error ? v.message : v)} (seed ${seed})`;
          if (!seen.has(m.replace(/ \(seed.*$/, ''))) { seen.add(m.replace(/ \(seed.*$/, '')); problems.push(m); }
        }
      }
    });
  }
  selftest.lastChecked = checked;
  return problems;
}

/* ------------------------------------------------------------------ */
function init(dir, name) {
  const target = path.resolve(dir);
  fs.mkdirSync(path.join(target, 'content'), { recursive: true });
  const cfg = { courseCode: name || 'ค3xxxx', courseName: 'ชื่อรายวิชา', level: 'ม.4', defaultClass: 'ม.4/1', storageId: (name || '3xxxx').replace(/[^0-9a-zA-Z]/g, '') || 'course', reviewBase: '', content: 'content', out: 'dist' };
  const cfgFile = path.join(target, 'course.json');
  if (!fs.existsSync(cfgFile)) fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  const sk = path.join(target, 'content', 'HW-01_1.1_ตัวอย่าง.js');
  if (!fs.existsSync(sk)) fs.copyFileSync(path.join(SKILL_ROOT, 'assets', 'HW-skeleton.js'), sk);
  console.log('✓ scaffolded ' + target + '\n  edit course.json, edit content/HW-01_*.js, then:\n  node ' + path.relative(process.cwd(), __filename) + ' --config ' + path.join(dir, 'course.json'));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.init) return init(args.init, args.name);
  if (!args.config) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^\/\*\*?|^ \* ?/gm, '')); process.exit(args.help ? 0 : 1); }

  const cfg = loadConfig(args.config);
  const contentDir = path.resolve(cfg.__dir, args.content || cfg.content || 'content');
  const outDir = path.resolve(cfg.__dir, args.out || cfg.out || 'dist');
  if (!fs.existsSync(contentDir)) die('content folder not found: ' + contentDir);
  const headTpl = fs.readFileSync(path.join(SHELL, 'head.tpl.html'), 'utf8');
  const tailTpl = fs.readFileSync(path.join(SHELL, 'tail.tpl.html'), 'utf8');
  const scripts = engineScripts(headTpl, tailTpl);

  let files = fs.readdirSync(contentDir).filter((f) => /^HW-.*\.js$/.test(f)).sort();
  const total = cfg.total || files.length;
  if (args.only) files = files.filter((f) => f.startsWith(args.only));
  if (!files.length) die('no HW-*.js content files found in ' + contentDir);
  if (!args.check) fs.mkdirSync(outDir, { recursive: true });

  const seeds = +(args.seeds || 120);
  let bad = 0;
  for (const f of files) {
    const built = buildOne(cfg, path.join(contentDir, f), headTpl, tailTpl, total);
    let note = '';
    if (!args['no-selftest']) {
      const probs = selftest(built.js, f, scripts, seeds);
      const hard = probs.filter((p) => !p.startsWith('warning'));
      if (hard.length) { bad++; note = `  ✗ selftest: ${hard.length} problem(s)`; }
      else note = `  ✓ selftest (${selftest.lastChecked} answers cross-checked)`;
      probs.slice(0, 8).forEach((p) => (note += '\n      - ' + p));
    }
    if (!args.check) fs.writeFileSync(path.join(outDir, f.replace(/\.js$/, '.html')), built.html, 'utf8');
    console.log(`${args.check ? '·' : '✓'} ${built.meta.id} ${built.meta.title}${note}`);
  }
  console.log(`\n${files.length} worksheet(s) ${args.check ? 'checked' : 'built → ' + outDir}${bad ? ` · ${bad} with selftest problems` : ''}`);
  if (bad) process.exit(2);
}

main();

