import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(resolve(process.env.SEO_TOOLS, 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.SEO_ORIGIN || 'http://127.0.0.1:4173';
const routes = ['/', '/cv/', '/artigos/', '/artigos/inbox-zero-outlook/', '/produtos/diskguardian/', '/produtos/windows-technical-toolkit/', '/produtos/domain-admin-toolkit/'];
const errors = [];
let combinations = 0;
mkdirSync('seo-evidence', {recursive:true});
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [{width:390,height:844}, {width:1440,height:900}]) {
    const context = await browser.newContext({viewport,permissions:['clipboard-read','clipboard-write']});
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(page.url()+': '+e.message));
    for (const lang of ['en','pt-PT']) {
      for (const route of routes) {
        const path = (lang==='pt-PT'?'/pt':'')+route;
        const url = origin+path;
        const response = await page.goto(url);
        assert.equal(response.status(),200,path);
        assert.equal(await page.locator('html').getAttribute('lang'),lang,path);
        assert.ok(await page.locator('h1').isVisible(),path+' heading');
        for (const theme of ['dark','light']) {
          if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#theme').click();
          assert.equal(await page.locator('html').getAttribute('data-theme'),theme,path);
          const overflow = await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
          if (overflow>1) errors.push(path+' '+viewport.width+' '+theme+' horizontal overflow '+overflow+'px');
          combinations++;
          if (['/','/cv/','/artigos/inbox-zero-outlook/'].includes(route)) {
            const slug = route === '/' ? 'home' : route.split('/').filter(Boolean).at(-1);
            await page.screenshot({path:'seo-evidence/'+lang+'-'+slug+'-'+viewport.width+'-'+theme+'.png',fullPage:false});
          }
        }
        const target = origin + await page.locator('#lang').getAttribute('href');
        await page.locator('#lang').click();
        await page.waitForURL(target);
        assert.equal(await page.locator('html').getAttribute('lang'),lang==='pt-PT'?'en':'pt-PT');
        assert.equal(await page.locator('html').getAttribute('data-theme'),'light','theme persists across language navigation');
        await page.goto(url);
        if (route==='/' || route==='/cv/') {
          const panel=page.locator('[data-contact-panel]');
          assert.ok(await panel.isVisible(),path+' contact panel');
          const email=panel.locator('[data-email-address]');
          const expected=(await email.innerText()).trim();
          assert.ok(expected.includes('@'));
          await panel.locator('[data-copy-email]').click();
          await page.waitForFunction(()=>document.querySelector('.contact-feedback')?.textContent?.length>0);
          assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected);
          const intro=await page.locator('.contact-inner > div').first().boundingBox();
          const box=await panel.boundingBox();
          if (viewport.width===1440) assert.ok(box.x>intro.x+10,path+' contact panel horizontal');
          else assert.ok(box.y>intro.y,path+' contact panel stacked');
        }
        if (route==='/artigos/') {
          await page.locator('#article-search').fill('zzzzxyz');
          await page.locator('#articles-no-results').waitFor({state:'visible'});
          await page.locator('#article-reset').click();
          await page.locator('.article-card').first().waitFor({state:'visible'});
        }
      }
    }
    await context.close();
  }
  const context = await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto(origin+'/pt/artigos/inbox-zero-outlook/');
  assert.match(await page.locator('h1').innerText(),/^Inbox Zero no Outlook/);
  await page.locator('#lang').click();
  assert.match(await page.locator('h1').innerText(),/^Inbox Zero in Outlook/);
  await context.close();
} finally {
  await browser.close();
  writeFileSync('seo-evidence/browser-summary.json',JSON.stringify({combinations,errors},null,2));
}
assert.deepEqual(errors,[]);
console.log('Browser verification passed: '+combinations+' route/viewport/theme combinations, language navigation, contact, search, no-JS language switch.');
