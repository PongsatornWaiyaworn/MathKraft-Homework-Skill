#!/usr/bin/env node
/**
 * MathKraft Skill Verification Test
 * ---------------------------------
 * Validates the core engine shell, templates, and math rendering.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
console.log('Testing MathKraft HW Skill integrity at:', ROOT);

let failed = false;
function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed = true;
  }
}

// 1. Files existence
const headPath = path.join(ROOT, 'skills', 'mathkraft-hw-ui', 'assets', 'shell', 'head.tpl.html');
const tailPath = path.join(ROOT, 'skills', 'mathkraft-hw-ui', 'assets', 'shell', 'tail.tpl.html');
const tmplJsPath = path.join(ROOT, 'templates', 'HW-template.js');
const tmplHtmlPath = path.join(ROOT, 'templates', 'standalone-worksheet.html');
const promptPath = path.join(ROOT, 'templates', 'CLAUDE_PROMPT.md');

assert('head.tpl.html exists', fs.existsSync(headPath));
assert('tail.tpl.html exists', fs.existsSync(tailPath));
assert('templates/HW-template.js exists', fs.existsSync(tmplJsPath));
assert('templates/standalone-worksheet.html exists', fs.existsSync(tmplHtmlPath));
assert('templates/CLAUDE_PROMPT.md exists', fs.existsSync(promptPath));

// 2. KaTeX equation parsing in tail.tpl.html
const tailContent = fs.readFileSync(tailPath, 'utf8');
assert('tail.tpl.html supports $...$ inline math', tailContent.includes('(?<!\\\\)\\$') && tailContent.includes('km(t, false)'));
assert('tail.tpl.html supports $$...$$ display math', tailContent.includes('\\$\\$([\\s\\S]+?)\\$\\$') && tailContent.includes('km(t, true)'));

// 3. HW-template.js executes without errors in mock sandbox
const jsContent = fs.readFileSync(tmplJsPath, 'utf8');
const mockSandbox = {
  window: {},
  Math,
  Array,
  String
};
mockSandbox.window = mockSandbox;
mockSandbox.window.MK = {
  Q: {
    choice: (o) => o,
    fill: (o) => o,
    sort: (o) => o,
    pairs: (o) => o,
    order: (o) => o,
    find: (o) => o,
    group: (o) => o
  }
};

try {
  vm.runInNewContext(jsContent, mockSandbox);
  assert('HW-template.js executes cleanly', true);
  assert('HW-template.js defines window.HW', !!mockSandbox.window.HW);
  assert('window.HW has id and levels', !!mockSandbox.window.HW.id && Array.isArray(mockSandbox.window.HW.levels));
  assert('window.HW has 3 levels', mockSandbox.window.HW.levels.length === 3);

  // Test build(R) on each level
  const mockR = {
    int: (a, b) => Math.floor((a + b) / 2),
    pick: (arr) => arr[0],
    shuffle: (arr) => arr.slice(),
    chance: (p) => true
  };
  mockSandbox.window.HW.levels.forEach((lvl, i) => {
    const qList = lvl.build(mockR);
    assert(`Level ${i + 1} builds ${qList.length} questions`, qList.length > 0);
  });
} catch (e) {
  assert(`HW-template.js executes cleanly (${e.message})`, false);
}

// 4. Standalone worksheet check
const htmlContent = fs.readFileSync(tmplHtmlPath, 'utf8');
assert('standalone-worksheet.html has student login fields', htmlContent.includes('f-name') && htmlContent.includes('f-cls') && htmlContent.includes('f-no'));
assert('standalone-worksheet.html has embedded fonts and KaTeX', htmlContent.includes('Prompt') && htmlContent.includes('window.katex'));
assert('standalone-worksheet.html has NO breadcrumb navigation', !htmlContent.includes('🏠 หน้าหลัก'));
assert('standalone-worksheet.html has NO floating student bar', !htmlContent.includes('เปลี่ยนผู้ทำ'));

console.log('\n========================================');
if (failed) {
  console.error('✗ Skill integrity checks FAILED!');
  process.exit(1);
} else {
  console.log('✓ All Skill integrity checks PASSED successfully!');
  console.log('========================================\n');
}
