
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    let PHRASES = {
      "uiDefaults": { "branch": "厦门分行", "dept": "科技业务部", "email": "coolkiy@gmail.com" },
      "titleTemplates": { "main": "{branch}关于{cust}贷款利率优惠的申请" },
      "summaryTemplate": "客户：{cust}；金额：{amt}万元；期限：{tenor}；执行利率：{rate}%（较LPR{bpLpr}BP，较FTP{bpFtp}BP）。要素：{segMain}·{tenor} {thrRef}%；用途：{use}；担保：{gb}。审批：{apprPath}。建议按本次方案办理。",
      "presets": [
        { "label": "普惠标准", "seg": ["普惠小微"], "tenor": "1年", "prod": ["流动资金贷款"], "gb": "不动产抵押", "use": "企业经营周转" },
        { "label": "科技/绿色标准", "seg": ["科技", "绿色"], "tenor": "1年", "prod": ["科技贷"], "gb": "信用", "use": "研发投入" }
      ],
      "THRESH": {
        "6个月": { "国企/总战/台商": 2.28, "科技/绿色": 2.28, "普惠": 2.28, "非上述客群": 2.28 },
        "1年":   { "国企/总战/台商": 2.31, "科技/绿色": 2.50, "普惠": 2.60, "非上述客群": 2.70 },
        "2年":   { "国企/总战/台商": 2.44, "科技/绿色": 2.50, "普惠": 2.60, "非上述客群": 2.70 },
        "3年":   { "国企/总战/台商": 2.54, "科技/绿色": 2.64, "普惠": 2.54, "非上述客群": 2.70 },
        "4年":   { "国企/总战/台商": 2.63, "科技/绿色": 2.63, "普惠": 2.63, "非上述客群": 2.70 }
      },
      "segGroupMap": { "普惠小微": "普惠", "科技": "科技/绿色", "绿色": "科技/绿色", "台商": "国企/总战/台商", "一般客群": "非上述客群", "上市公司": "非上述客群" },
      "products": ["税易贷", "成长伴侣", "科技贷", "流动资金贷款", "项目贷款", "抵押贷款", "信用贷款", "票据贴现", "银承"],
      "purposes": ["企业经营周转","采购备货","支付工资","设备购置","研发投入","项目建设"],
      "collateral": ["不动产抵押", "担保公司100%保证","知识产权质押","信用"],
      "industryTemplates": {
        "通用": { "talk": "经营模式清晰，收入确认规范；现金回笼节奏与采购/销售匹配，主要指标稳健。" },
        "制造业": { "talk": "以销定产、订单驱动；原材料与人工波动对毛利敏感；应收/存货周转保持在合理区间，现金流覆盖本息。" },
        "批发和零售业": { "talk": "轻资产、高周转；结算笔数大、资金回笼快；通过保理/票据对冲应收集中度，沉淀结算资金。" },
        "建筑业": { "talk": "项目制管理，回款受业主资质与进度影响；保函需求刚性，授信节奏与工程节点匹配。" },
        "信息传输、软件和信息技术服务业": { "talk": "轻资产、应收账期偏长；以知识产权/合同回款为信用补充；适配科技债资金，控制价格敏感度。" },
        "电力、热力、燃气及水生产和供应业": { "talk": "准公益属性，回款稳定；价格受政策边界约束；以保函与短期周转贷配套。" },
        "交通运输、仓储和邮政业": { "talk": "运力配置与油价/运价联动；以运单/货权质押及保理沉淀结算资金。" },
        "农、林、牧、渔业": { "talk": "季节性与政策性强；保险增信+仓单/订单融资；绿色属性可匹配绿债资金。" },
        "卫生和社会工作/医药": { "talk": "费用结算周期较长；医保/商保回款影响应收；可做应收质押并对接供应链平台。" }
      },
      "lexicon": {
        "structure": {
          "collateral": {
          "不动产抵押": "以不动产抵押为主，抵押率控制在合理区间，权证齐备，处置路径清晰。",
            "信用": "信用方式，以企业经营现金流作为核心还款来源，设定严格的财务约束指标。",
            "default": "以{gb}为主要担保措施。"
          },
          "use": {
            "企业经营周转": "用于企业经营周转，形成真实、可核的采购/销售闭环，资金用途不得流向限制性领域。",
            "default": "用于{use}，资金用途明确，符合我行信贷政策。"
          }
        },
        "risk": { "信用": "关注客户现金流稳定性与应收账款回款风险。" },
        "measures": { "default": "（1）交易核验：以合同/发票/物流/回款四单对齐为原则，提款与回款节奏匹配。\n（2）现金管理：工资/税费/货款在我行归集，加强账户流水监控。" },
        "closure": {
          "分行审批权限": "按制度口径测算，本案属于分行审批权限；建议按本方案执行，配套措施随附清单落实。",
          "总行条线负责人审批": "按制度口径测算，本案低于分行权限，建议提请上级条线负责人审批。",
          "default": "请领导审阅。"
        }
      },
      "disclaimer": {
        "confidential": "本文件包含敏感信息，仅限内部使用，未经授权不得外传。",
        "validity": "本签报自审批通过之日起生效，有效期为{days}天。"
      },
      "docExt": {
        "attachments": [
          "EVA测算截图",
          "审批通知书",
          "人行报备报告及表格（如申请自律加点豁免）"
        ]
      },
      "incomePlans": [
        {"id":"A","label":"主办结算","text":"以我行作为主办结算行，提升日均存款与结算手续费收入。"},
        {"id":"B","label":"代发与代缴","text":"落地工资代发与税费代缴，形成稳定沉淀与费收。"},
        {"id":"C","label":"供应链拓展","text":"围绕上下游引入保理、票据、保函等产品，带动链式客户。"},
        {"id":"D","label":"票据与保函/国际","text":"开展票据与保函业务，叠加国际结算，形成中收增量。"},
        {"id":"E","label":"投融资协同","text":"配置结构性存款/理财，并对接投行产品，贡献中收。"},
        {"id":"F","label":"科技/绿色专属","text":"匹配科技债或绿债资金，获取政策性成本优势。"}
      ],
      "incomeDetailTemplates": {
        "A": "主办结算：日均存款≥__万，对公支付≥__笔/月，上线收单；预计年化结算与存款贡献__万。",
        "B": "代发与代缴：代发人数__人、规模__万/月，上线税费代缴/银企直联；预计中收__万，沉淀__万。",
        "C": "供应链拓展：导入核心__家、上下游__家，落地保理/票据/保函；预计新增表内外资产__万。",
        "D": "票据与保函/国际：票据与保函年化中收__万，国际结算量__万美元。",
        "E": "投融资协同：配置结构性存款/理财__万，对接投行产品（租赁/ABS/顾问）中收__万。",
        "F": "科技/绿色专属：匹配科技债/绿债，边际成本下降__bp；配套专利质押/碳结算等场景。"
      },
      "industryIncomePreset": {
        "制造业": ["A","C"],
        "批发和零售业": ["A","B","D"],
        "建筑业": ["D","A"],
        "信息传输、软件和信息技术服务业": ["A","B","F"],
        "电力、热力、燃气及水生产和供应业": ["D","A"],
        "交通运输、仓储和邮政业": ["A","C"],
        "农、林、牧、渔业": ["F","A"],
        "卫生和社会工作/医药": ["A","C"],
        "通用": ["A"]
      },
      "peerRange": {
        "default": [2.30, 2.50]
      },
      "styleTemplates": {
        "simple": {
          "preface": "为提升办理效率，现就本次利率优惠的核心要点简要说明如下。",
          "pricing_intro": "审批权限口径：{layer}。{thrLine}",
          "pricing_refs": "参考基准：一年期LPR {lpr}% ，FTP {ftp}% 。",
          "pricing_diff": "利率对比：拟执行利率 {rate}%；较LPR {dL}BP；与FTP利差 {dF}BP。",
          "structure_line": "结构安排：以{prods}为主，期限{tenor}，与客户经营周期匹配。",
          "application_line": "拟新增/调整授信{amt}万元，期限{tenor}，品种为{prods}，拟执行利率{rate}% 。",
          "measures_hint": "配套以交易核验与现金管理为主。",
          "riskTone": "关注资金用途与回款落实情况，常规信用风险为主。",
          "conclusion": "综合评估，建议按上述方案办理。"
        },
        "full": {
          "preface": "基于客户经营情况、资金成本与权限口径，提出如下完整方案，供审阅。",
          "pricing_intro": "审批权限口径：{layer}。{thrLine}",
          "pricing_refs": "参考基准：一年期LPR {lpr}% ，FTP {ftp}% 。",
          "pricing_diff": "利率对比：拟执行利率 {rate}%；较LPR {dL}BP；与FTP利差 {dF}BP。",
          "structure_line": "结构安排：以{prods}为主，期限{tenor}，与客户经营周期匹配。担保方式：{gbLine}；资金用途：{useLine}。",
          "application_line": "拟新增/调整授信{amt}万元，期限{tenor}，品种为{prods}，拟执行利率{rate}% 。{stockLine}",
          "measures_hint": "配套措施：{measures}",
          "riskTone": "结合行业特征与授信结构，关注原材料波动、周转效率与现金流波动。",
          "conclusion": "按制度口径与收益测算，建议按本方案执行，配套措施同步落实。"
        },
        "compliance": {
          "preface": "本申请遵循现行授信与定价管理办法，严格执行监管及行内制度要求，具体如下。",
          "pricing_intro": "审批权限口径：{layer}。{thrLine}",
          "pricing_refs": "参考基准：一年期LPR {lpr}% ，FTP {ftp}% 。",
          "pricing_diff": "利率对比：拟执行利率 {rate}%；较LPR {dL}BP；与FTP利差 {dF}BP。",
          "structure_line": "结构安排：以{prods}为主，期限{tenor}；担保方式：{gbLine}；资金用途：{useLine}。",
          "application_line": "拟新增/调整授信{amt}万元，期限{tenor}，品种为{prods}，拟执行利率{rate}% 。{stockLine}",
          "measures_hint": "合规提示：严格核验交易真实性与回款闭环，资金不得流向限制性领域。",
          "riskTone": "强调真实性与合规性：用途真实可核、交易闭环可证、资金不流向限制领域；对低于分行权限的情形依法合规提请上级审批。",
          "conclusion": "本案在权限与收益底线内提出办理建议；如遇口径变化，将按流程及时调整。请予审阅并批准/按权限提请上级审批。"
        }
      }
    };

    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    // ===== Samurai Intro (设计/动效/前端代理合成) =====
    (function samuraiIntro(){
      const stage = $('#samuraiStage');
      if (!stage) return;
      const params = new URLSearchParams(location.search);
      // 默认关闭，仅当 ?intro=1 时展示
      if (params.get('intro') !== '1') { stage.remove(); return; }
      const canvas = $('#samuraiTrail'); const ctx = canvas.getContext('2d');
      const cursor = $('#samuraiCursor'); const layer = $('#samuraiLayer'); const bg = stage.querySelector('.samurai-bg');
      function fit(){ canvas.width = stage.clientWidth; canvas.height = stage.clientHeight; }
      fit(); window.addEventListener('resize', fit);
      stage.classList.add('show'); setTimeout(()=> layer.classList.add('show'), 60);
      let mouse = {x: innerWidth/2, y: innerHeight/2}, cur = {x: mouse.x, y: mouse.y};
      const tail = Array.from({length: 10}, () => ({x: cur.x, y: cur.y}));
      const particles = Array.from({length: 60}, ()=>({x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: 0.4 + Math.random()*1.2, vx: -0.2 + Math.random()*0.4, vy: -0.1 + Math.random()*0.2, a: 0.08 + Math.random()*0.18}));
      function lerp(a,b,t){ return a + (b-a)*t; }
      window.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; const rx=(e.clientX/innerWidth-.5)*16; const ry=(e.clientY/innerHeight-.5)*16; bg.style.setProperty('--sx', rx.toFixed(2)+'px'); bg.style.setProperty('--sy', ry.toFixed(2)+'px'); });
      window.addEventListener('mousedown', ()=>{ const cx=cur.x,cy=cur.y,r=46+Math.random()*24; const a0=Math.random()*Math.PI*2,a1=a0+(Math.random()>0.5?1:-1)*(Math.PI/3); ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=2.2; ctx.beginPath(); ctx.arc(cx,cy,r,a0,a1); ctx.stroke(); });
      function step(){ cur.x=lerp(cur.x,mouse.x,.22); cur.y=lerp(cur.y,mouse.y,.22); cursor.style.transform=`translate(${cur.x-7}px,${cur.y-7}px) rotate(45deg)`; tail.unshift({x:cur.x,y:cur.y}); tail.pop(); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.save();
        for(const p of particles){ p.x+=p.vx; p.y+=p.vy; if(p.x<-10)p.x=canvas.width+10; if(p.x>canvas.width+10)p.x=-10; if(p.y<-10)p.y=canvas.height+10; if(p.y>canvas.height+10)p.y=-10; ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
        for(let i=0;i<tail.length-1;i++){ const p=tail[i],n=tail[i+1]; ctx.strokeStyle=`rgba(226,226,226,${0.12+(1-i/tail.length)*0.26})`; ctx.lineWidth=1+(1-i/tail.length)*1.6; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(n.x,n.y); ctx.stroke(); }
        requestAnimationFrame(step);
      } step();
      function closeIntro(){ stage.classList.remove('show'); stage.classList.add('samurai-hidden'); setTimeout(()=> stage.remove(), 360); }
      function handleEnter(){ if(!document.body) return; if (!stage.isConnected) return; closeIntro(); window.removeEventListener('keydown', handleEnter); window.removeEventListener('click', handleEnter); }
      window.addEventListener('keydown', handleEnter); window.addEventListener('click', handleEnter);
      $('#samuraiSkip')?.addEventListener('click', handleEnter);
    })();

    function toast(txt) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = txt;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 260); }, 2000);
        // 避免过多 toast 堆叠：最多保留3个
        const list = Array.from(document.querySelectorAll('.toast'));
        if (list.length > 3) list.slice(0, list.length - 3).forEach(n => n.remove());
    }

    async function copyTarget(sel) {
        const txt = $(sel)?.textContent || '';
        if (!txt.trim()) { toast('请先生成内容'); return; }
        try { await navigator.clipboard.writeText(txt); } catch (_) {
            const ta = document.createElement('textarea');
            ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        }
        // 内联 ✅ 标记 2 秒
        const btn = sel === '#out' ? $('#btnCopy') : $('#btnCopySummary');
        if (btn){
          const mark = document.createElement('span');
          mark.className = 'checkmark'; mark.innerHTML = '✅ 已复制';
          btn.insertAdjacentElement('afterend', mark);
          requestAnimationFrame(()=> mark.classList.add('show'));
          setTimeout(()=> { mark.classList.remove('show'); setTimeout(()=> mark.remove(), 180); }, 2000);
        }
    }

    function build() {
        const form = {
            branch: $('#branch').value.trim(),
            cust: $('#cust').value.trim(),
            prods: $$('#prodChips .chip.sel').map(x => x.dataset.v),
            segs: $$('#segChips .chip.sel').map(x => x.dataset.v),
            gb: $('#gb').value,
            use: $('#use').value,
            stock: $('#stockChips .chip.sel')?.dataset.v || '否',
            amt: parseFloat($('#amt').value) || 500,
            tenor: $('#tenor').value,
            rate: parseFloat($('#rate').value) || 0,
            lpr: parseFloat($('#lpr').value) || 0,
            ftp: parseFloat($('#ftp').value) || 0,
            stockRate: parseFloat($('#stockRate').value),
            eva: $('#eva').value.trim(),
            note: $('#note').value.trim(),
            industry: $('#industry')?.value || '通用',
            style: ($$('#styleChips .chip.sel')[0]?.dataset.v) || 'simple',
            apprOverride: $('#apprOverride')?.value,
            attachments: $$('#attachChips .chip.sel').map(x => x.dataset.v),
            applyType: (function(){ const isStock=$('#stockChips .chip.sel')?.dataset.v==='是'; const sr=parseFloat($('#stockRate').value); return (isStock && !isNaN(sr))? '存量调整':'新增'; })(),
            holding: $('#holding')?.value,
            isStrategic: ($$('#isStrategicChips .chip.sel')[0]?.dataset.v) || '否',
            isListed: ($$('#isListedChips .chip.sel')[0]?.dataset.v) || '否',
            isSelfDisc: ($$('#isSelfDiscChips .chip.sel')[0]?.dataset.v) || '否',
            lowCostFunds: $$('#lowCostChips .chip.sel').map(x => x.dataset.v),
            incomeSel: $$('#incomeChips .chip.sel').map(x => x.dataset.v),
            incomeDetail: $('#incomeDetail')?.value || ''
        };

        const dL = Math.round((form.rate - form.lpr) * 100);
        const dF = Math.round((form.rate - form.ftp) * 100);
        let J = judgeLayer(form.rate, form.tenor, form.segs);
        if (form.apprOverride) {
          J = { layer: form.apprOverride, msg: `已手动覆盖：${form.apprOverride}` };
        }
        const segMain = normalizeSeg(form.segs);
        const thrRef = (PHRASES.THRESH[form.tenor] || {})[segMain];

        // 综合收益：若未选择，按行业预设填充
        if (!form.incomeSel || form.incomeSel.length === 0) {
          const preset = (PHRASES.industryIncomePreset && (PHRASES.industryIncomePreset[form.industry] || PHRASES.industryIncomePreset['通用'])) || [];
          form.incomeSel = preset.slice();
        }

        const context = { ...form, dL, dF, J, segMain, thrRef, apprPath: J.layer };

        const title = generateTitle(context);
        const bodyParts = generateBodyParts(context);
        const summary = generateSummary(context);

        $('#out').textContent = [title, ...Object.values(bodyParts)].join('\n\n');
        $('#summaryOut').textContent = summary;
        // 预览更新动画
        ['#out','#summaryOut'].forEach(sel=>{ const el=$(sel); el.classList.remove('updated'); void el.offsetWidth; el.classList.add('updated'); });
        updateUI(context);
    }

    function generateTitle({ branch, cust, isSelfDisc }) {
        if (isSelfDisc === '是') {
          // 组合标题：贷款利率优惠及自律加点豁免的申请
          return `${branch}关于${cust}贷款利率优惠及自律加点豁免的申请`;
        }
        return PHRASES.titleTemplates.main.replace('{branch}', branch).replace('{cust}', cust);
    }

    function generateSummary(ctx) {
        const base = PHRASES.summaryTemplate.replace(/\{(\w+)\}/g, (_, k) => {
            if (k === 'bpLpr') return (ctx.dL >= 0 ? '+' : '') + (isFinite(ctx.dL)? ctx.dL : 0);
            if (k === 'bpFtp') return (ctx.dF >= 0 ? '+' : '') + (isFinite(ctx.dF)? ctx.dF : 0);
            const val = ctx[k];
            if (typeof val === 'number') return val.toFixed(2);
            return val ?? '';
        });
        return base;
    }

    // function sectionPricing(ctx) { /* removed to align with formal memo style */ }

    // 删除“授信结构与用途安排”以避免与模板重复/冗余

    function sectionApplication(ctx){
      const {applyType, amt, tenor, rate, stockRate, gb, use, prods} = ctx;
      const stockLine = (!isNaN(stockRate)) ? `（存量执行利率${stockRate.toFixed(2)}%）` : '';
      const prodLine = (Array.isArray(prods) && prods.length) ? `；授信品种：${prods.join('、')}` : '';
      let appLines='';
      if (applyType==='新增'){
        appLines = `金额${amt}万元，期限${tenor}，执行利率${rate.toFixed(2)}%；担保方式：${gb||'不动产抵押'}；资金用途：${use||'企业经营周转'}${prodLine}。`;
      } else {
        const line = stockLine || '';
        appLines = `金额${amt}万元，期限${tenor}，拟调整执行利率至${rate.toFixed(2)}%${line}；担保方式：${gb||'不动产抵押'}；资金用途：${use||'企业经营周转'}${prodLine}。`;
      }
      return ['二、申请事项', appLines ].filter(Boolean).join('\n');
    }

    function sectionQualification(ctx){
      const {holding, segs, isStrategic, isListed, industry} = ctx; 
      const segText=(segs.length?segs:['普惠小微']).join('、');
      const it = (PHRASES.industryTemplates[industry]||PHRASES.industryTemplates['通用'])?.talk || '';
      const line1 = `${holding||'民营控股'}，实控人穿透清晰，治理规范；客群属性为${segText||'普惠小微'}。`;
      const line2 = `总行战略客户：${isStrategic||'否'}；上市情况：${isListed||'否'}。`;
      const line3 = `所属行业：${industry||'通用'}；${it}`;
      return ['一、客户资质', `${line1}\n${line2}\n${line3}`].join('\n');
    }

    // 删除“主要风险与关注点”以避免冗余

    // 删除“配套措施与协同安排”，将必要表述融合到“申请理由”

    function sectionReasons(ctx){
      const {lowCostFunds, eva, industry, rate} = ctx;
      const cost = (Array.isArray(lowCostFunds) && lowCostFunds.length) 
        ? `资金成本：优先匹配低成本资金（${lowCostFunds.join('、')}），在合规范围内降低边际成本。`
        : '资金成本：按常规资金匹配，综合考虑期限结构与价格稳定性。';
      const evaLine = (eva && !isNaN(Number(eva))) 
        ? `利润/EVA：经营中台测算EVA为${Number(eva).toFixed(2)}。`
        : '利润/EVA：以经营中台口径测算为准。';
      const plans = PHRASES.incomePlans || [];
      const id2plan = Object.fromEntries(plans.map(p=>[p.id||p.label,p]));
      const ordered = ['A','B','C','D','E','F'].filter(id => (ctx.incomeSel||[]).includes(id) && id2plan[id]);
      const incomeLines = ordered.map(id => `${id} ${id2plan[id].label}：${id2plan[id].text}`);
      let income = '';
      const ta = document.getElementById('incomeDetail');
      const detailTxt = ta ? (ta.value||'').trim() : '';
      if (detailTxt) {
        income = ['综合收益计划：', ...detailTxt.split(/\n+/)].join('\n');
      } else {
        income = ['综合收益计划：', ...incomeLines].join('\n');
      }
      const pr = (PHRASES.peerRange && Array.isArray(PHRASES.peerRange.default)) ? PHRASES.peerRange.default : null;
      const low = pr ? pr[0] : Math.max(2.28, (Number(rate)||0) - 0.10);
      const high = pr ? pr[1] : (Number(rate)||0) + 0.10;
      const peer = `同业价格参考：同期限同客群报价约在${low.toFixed(2)}%—${high.toFixed(2)}%区间，本次定价处于区间中位偏下，兼顾收益与客户黏性。`;
      const stickiness = '客户黏性提升路径：以主办结算、代发与供应链导入为抓手，提升账户活跃与留存。';
      const industryTalk = (PHRASES.industryTemplates[industry]||PHRASES.industryTemplates['通用'])?.talk;
      const talkLine = industryTalk ? `行业要点：${industryTalk}` : '';
      return ['三、申请理由', cost, evaLine, peer, stickiness, income, talkLine].filter(Boolean).join('\n');
    }

    // 删除“结论与审批建议”，以符合简版模板

    function sectionNotes(ctx){
      const {isSelfDisc, note} = ctx;
      const attach = '附件：1.EVA测算截图 2.审批通知书' + (isSelfDisc==='是' ? ' 3.人行报备报告及表格' : '');
      return [
        '四、其他事项',
        '1. 关联方已穿透核查，结论：非我行关联方。',
        (isSelfDisc==='是') ? '2. 拟申请豁免自律加点：附人行报备报告及表格，并同步计财部审批。' : '2. 不申请豁免自律加点。',
        attach,
        note?`\n补充说明：\n${note}`:''
      ].filter(Boolean).join('\n');
    }

    // 附件清单模块按模板删除

    function generateBodyParts(ctx) {
        const { style, segs, industry, J, thrRef } = ctx;
        const IT = PHRASES.industryTemplates[industry] || {};
        const lexicon = PHRASES.lexicon;
        const ST = PHRASES.styleTemplates?.[style] || PHRASES.styleTemplates?.full;

        const parts = {};
        parts.part0_preface = '';
        // 去除“贷款利率要素”段落，按公文结构输出
        parts.part1_qualification = sectionQualification(ctx);
        parts.part2_application = sectionApplication(ctx);
        parts.part3_reasons = sectionReasons(ctx);
        parts.part4_notes = sectionNotes(ctx);
        return parts;
    }

    function updateUI({ J, dL, dF, thrRef, segs, tenor }) {
        const segMain = normalizeSeg(segs);
        const badge = $('#apprBadge'), bt = $('#apprBadgeText');
        bt.textContent = J.layer;
        badge.className = 'pill'; 
        if (J.layer.startsWith('分行')) badge.classList.add('ok');
        else if (J.layer.startsWith('总行')) badge.classList.add('warn');
        else badge.classList.add('err');

        const hints = $('#smartHints');
        hints.innerHTML = '';
        const addHint = (text) => { const h = document.createElement('div'); h.className = 'hint'; h.textContent = text; hints.appendChild(h); };
        addHint(`审批判断：${J.msg}`);
        addHint(`利差（LPR）：${dL >= 0 ? `+${dL}` : `${dL}`}BP；利差（FTP）：${dF >= 0 ? `+${dF}` : `${dF}`}BP`);
        
        const hintEl = $('#rateHint');
        hintEl.textContent = (typeof thrRef === 'number') ? `建议：${thrRef.toFixed(2)}%（${tenor}·${segMain}）` : '暂无建议，请检查客群/期限';
        hintEl.setAttribute('title','建议值来自“客群×期限”的权限阈值，供参考。');
    }

    function judgeLayer(rate, tenor, segs) {
        const segMain = normalizeSeg(segs);
        const thr = (PHRASES.THRESH[tenor] || {})[segMain];
        if (thr == null) return { layer: '分行审批权限', msg: '按制度口径核对。' };
        if (rate >= thr) return { layer: '分行审批权限', msg: '符合分行审批权限。' };
        const floor = 2.28;
        if (rate >= floor) return { layer: '总行条线负责人审批', msg: '低于分行权限，提请总行条线负责人审批。' };
        return { layer: '超政策下限（不予受理）', msg: `低于当前制度下限（${floor.toFixed(2)}%），不在本批次权限范围。` };
    }
    
    function normalizeSeg(segs) {
        const priority = ["国企/总战/台商", "科技/绿色", "普惠", "非上述客群"];
        const mappedSegs = segs.map(s => PHRASES.segGroupMap[s]).filter(Boolean);
        if (mappedSegs.length === 0) return '非上述客群';
        
        for (const p of priority) {
            if (mappedSegs.includes(p)) return p;
        }
        return mappedSegs[0];
    }

    function setupEventListeners() {
        // 更健壮的芯片点击代理，支持嵌套元素（如预设卡片）
        document.body.addEventListener('click', e => {
            const el = (e.target instanceof HTMLElement) ? e.target.closest('.chip') : null;
            if (el instanceof HTMLElement) handleChipClick(el);
        });

        $$('input, select, textarea').forEach(el => el.addEventListener('input', build));

        const addRipple=(btn)=>btn&&btn.addEventListener('click',e=>{const r=document.createElement('span');r.className='ripple';const rect=btn.getBoundingClientRect();const size=Math.max(rect.width,rect.height);r.style.width=r.style.height=size+'px';r.style.left=(e.clientX-rect.left-size/2)+'px';r.style.top=(e.clientY-rect.top-size/2)+'px';btn.appendChild(r);setTimeout(()=>r.remove(),520)});
        $('#btnCopy').onclick = () => copyTarget('#out'); addRipple($('#btnCopy'));
        $('#btnCopySummary').onclick = () => copyTarget('#summaryOut'); addRipple($('#btnCopySummary'));
        $('#btnDocx').onclick = buildWord; addRipple($('#btnDocx'));
        $('#btnOcr').onclick = ocrClick; addRipple($('#btnOcr'));
        $('#applySuggest').onclick = applySuggestedRate; addRipple($('#applySuggest'));
        $('#btnCheer').onclick = () => {
            // 仅弹窗，不跳转邮件；兼容display切换
            const m = $('#cheerModal');
            if (m){ m.classList.add('show'); m.style.display='flex'; }
        };
        $('#cheerClose').onclick = () => { const m=$('#cheerModal'); if(m){ m.classList.remove('show'); m.style.display=''; } };
        $('#cheerModal').addEventListener('click', e => { if (e.target === $('#cheerModal')) { const m=$('#cheerModal'); if(m){ m.classList.remove('show'); m.style.display=''; } } });

        // 主题切换
        $('#themeToggle').addEventListener('change', (e)=>{
          const on=e.target.checked; document.body.classList.toggle('theme-dark', on); try{localStorage.setItem('themeDark', on? '1':'0');}catch(_){}}
        );

        // 建议值说明 tooltip
        const info = $('#rateInfo'); const tip = $('#rateTip');
        const showTip=()=>{ tip.classList.add('show'); };
        const hideTip=()=>{ tip.classList.remove('show'); };
        info.addEventListener('mouseenter', showTip);
        info.addEventListener('mouseleave', hideTip);
        info.addEventListener('focus', showTip);
        info.addEventListener('blur', hideTip);
        info.addEventListener('click', ()=>{ tip.classList.toggle('show'); });
    }

    function handleChipClick(t) {
        const parent = t.parentElement;
        const isMultiSelect = parent.id === 'segChips' || parent.id === 'prodChips' || parent.id === 'attachChips' || parent.id === 'lowCostChips' || parent.id === 'incomeChips';
        
        if (!isMultiSelect) {
            if (t.classList.contains('sel')) return;
            parent.querySelectorAll('.chip.sel').forEach(c => c.classList.remove('sel'));
        }

        t.classList.toggle('sel');
        t.classList.add('jump');
        setTimeout(() => t.classList.remove('jump'), 320);

        if (parent.id === 'presetChips') applyPreset(JSON.parse(t.dataset.preset));
        else {
            if (parent.id === 'stockChips') {
              $('#stockRow').style.display = (t.dataset.v === '是') ? '' : 'none';
              if (t.dataset.v !== '是') { $('#stockRate').value=''; }
            }
            // 模板移除附件清单，不做附件联动
            if (parent.id === 'styleChips') { try{ localStorage.setItem('stylePref', ($$('#styleChips .chip.sel')[0]?.dataset.v)||'simple'); }catch(_){}}
            if (parent.id === 'incomeChips') { autoFillIncomeDetail(true); }
            build();
        }
    }

    function applyPreset(p) {
        const { seg, tenor, prod, gb, use, stock, stockRate, rate } = p || {};
        
        updateChipSelection('segChips', seg, true);
        updateChipSelection('prodChips', prod, true);
        updateChipSelection('stockChips', stock || '否', false);

        $('#gb').value = gb || '不动产抵押';
        $('#use').value = use || '企业经营周转';
        $('#tenor').value = tenor || '1年';
        
        const segMain = normalizeSeg(Array.isArray(seg) ? seg : [seg]);
        const thr = (PHRASES.THRESH[$('#tenor').value] || {})[segMain];
        $('#rate').value = Number(rate ?? thr ?? 2.60).toFixed(2);

        $('#stockRow').style.display = (stock === '是') ? '' : 'none';
        if (stock === '是' && stockRate) $('#stockRate').value = Number(stockRate).toFixed(2);

        build();
        toast('已应用场景预设');
    }

    function applySuggestedRate() {
        const segs = $$('#segChips .chip.sel').map(x => x.dataset.v);
        const tenor = $('#tenor').value;
        const segMain = normalizeSeg(segs);
        const thr = (PHRASES.THRESH[tenor] || {})[segMain];
        if (typeof thr === 'number') {
            $('#rate').value = thr.toFixed(2);
            build();
            toast('已应用建议利率');
        } else {
            toast('暂无建议值，请手动填写');
        }
    }

    function populateUI(data) {
        const populateSelect = (id, list) => {
            const select = $(`#${id}`);
            select.innerHTML = '';
            list.forEach(item => { const o = document.createElement('option'); o.textContent = item; select.appendChild(o); });
        };

        populateSelect('industry', Object.keys(data.industryTemplates || {}));
        populateSelect('gb', data.collateral || []);
        populateSelect('use', data.purposes || []);

        buildChips('segChips', Object.keys(data.segGroupMap || {}), ['普惠小微'], true);
        buildChips('prodChips', data.products || [], ['流动资金贷款'], true);
        buildChips('incomeChips', data.incomePlans || [], (data.industryIncomePreset && data.industryIncomePreset['通用']) || [], true);
        // 初始化综合收益明细
        autoFillIncomeDetail();

        const presetContainer = $('#presetChips');
        presetContainer.innerHTML = '';
        presetContainer.classList.add('preset-cards');
        (data.presets || []).forEach(p => {
            const card = document.createElement('div');
            card.className = 'chip';
            card.style.padding='10px 12px';
            card.dataset.preset = JSON.stringify(p);
            const sub = Array.isArray(p.seg)? p.seg.join('/') : (p.seg || '');
            card.innerHTML = `<div style="font-weight:700">${p.label||'预设'}</div><div class="subtle">${p.subtitle||sub||'点击应用此场景'}</div>`;
            presetContainer.appendChild(card);
        });

        // 行业切换时应用预设综合收益
        $('#industry')?.addEventListener('change', ()=>{
          const ind = $('#industry').value || '通用';
          const preset = (PHRASES.industryIncomePreset && (PHRASES.industryIncomePreset[ind] || PHRASES.industryIncomePreset['通用'])) || [];
          updateChipSelection('incomeChips', preset, true);
          autoFillIncomeDetail(true);
          build();
        });

        // 按模板要求：移除附件清单模块

        // 恢复撰写风格偏好
        try{
          const saved = localStorage.getItem('stylePref');
          if (saved) updateChipSelection('styleChips', saved, false);
        }catch(_){ }
    }

    function buildChips(containerId, items, selected, isMulti) {
        const container = $(`#${containerId}`);
        if (!container) return;
        container.innerHTML = '';
        items.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            const isObj = typeof item === 'object' && item !== null;
            const id = isObj ? (item.id || item.label) : item;
            const label = isObj ? (item.label || item.id) : item;
            chip.dataset.v = id;
            chip.textContent = label;
            const isSel = isMulti ? (Array.isArray(selected) && selected.includes(id)) : (selected === id);
            if (isSel) {
                chip.classList.add('sel');
            }
            container.appendChild(chip);
        });
    }

    // 将所选综合收益方案自动生成到“综合收益明细”文本框
    let incomeDetailDirty = false;
    $('#incomeDetail')?.addEventListener('input', ()=>{ incomeDetailDirty = true; });
    function autoFillIncomeDetail(force=false){
      const ta = $('#incomeDetail'); if (!ta) return;
      if (incomeDetailDirty && !force) return; // 用户已编辑则不覆盖
      const ids = $$('#incomeChips .chip.sel').map(x=>x.dataset.v);
      const lines = ids.map(id => PHRASES.incomeDetailTemplates?.[id]).filter(Boolean);
      ta.value = lines.join('\n');
    }

    function updateChipSelection(containerId, selection, isMulti) {
        $$(`#${containerId} .chip`).forEach(chip => {
            const value = chip.dataset.v;
            const shouldBeSelected = isMulti 
                ? Array.isArray(selection) && selection.includes(value)
                : selection === value;
            chip.classList.toggle('sel', shouldBeSelected);
        });
    }

    // 简易“附带EVA截图”：提示用户上传图片并在导出时附带，不进行OCR
    function ocrClick(){
      const files = Array.from($('#ocrImg').files || []);
      if (!files.length){
        $('#ocrLog').textContent = '请先选择图片文件，系统将在导出 Word 时附带（不进行OCR识别）。';
        toast('请选择需附带的EVA截图');
        return;
      }
      $('#ocrLog').textContent = `已选择 ${files.length} 张图片（导出Word将附带，不进行OCR）`;
      toast('图片已就绪，导出 Word 可附带');
    }

    let docxLoaded = false;
    async function ensureDocx() {
        if (docxLoaded) return;
        const candidates = ['../../docx.min.js', './docx.min.js', 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js'];
        for (const c of candidates) {
            try {
                await new Promise((res, rej) => {
                    const s = document.createElement('script');
                    s.src = c;
                    s.onload = () => { if(window.docx) { docxLoaded = true; res(); } else { rej(); } };
                    s.onerror = rej;
                    document.head.appendChild(s);
                });
                if (docxLoaded) return;
            } catch (_) {}
        }
        throw new Error('生成组件(docx)加载失败');
    }

    async function buildWord() {
        toast('⏳ 正在生成Word文档…');
        const btn = document.getElementById('btnDocx');
        if (btn){ btn.classList.add('loading'); btn.setAttribute('disabled','disabled'); }
        try {
            await ensureDocx();
            const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, PageBreak } = window.docx;

            const p = (text) => new Paragraph({ children: [new TextRun({ text, font: '仿宋_GB2312', size: 24 })], spacing: { after: 160 } });
            const h1 = (text) => new Paragraph({ text, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 240 } });
            const h2 = (text) => new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { after: 120 } });

            const title = $('#out').textContent.split('\n\n')[0] || '利率优惠签报';
            const summary = $('#summaryOut').textContent || '';
            const bodyText = $('#out').textContent.substring(title.length).trim();

            const docChildren = [h1(title), h2('OA 摘要'), p(summary), new Paragraph({ children: [new PageBreak()] }), h2('正文'), ...bodyText.split('\n\n').flatMap(section => {
                const lines = section.split('\n');
                const heading = lines.shift();
                return [h2(heading), ...lines.map(p)];
            })];

            const imgs = Array.from($('#ocrImg').files || []);
            if (imgs.length > 0) {
                docChildren.push(h2('附件：EVA截图'));
                for (let i = 0; i < imgs.length; i++) {
                    const buffer = await imgs[i].arrayBuffer();
                    docChildren.push(p(`截图 ${i + 1}`), new Paragraph({ children: [new ImageRun({ data: buffer, transformation: { width: 540, height: 405 } })] }));
                }
            }

            const doc = new Document({ sections: [{ children: docChildren }] });
            const blob = await Packer.toBlob(doc);
            downloadBlob(`利率优惠签报_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.docx`, blob);
            toast('✔ Word文档已生成');
        } catch (e) {
            console.error(e);
            toast(e.message || '生成Word失败，请检查控制台');
        } finally {
            if (btn){ btn.classList.remove('loading'); btn.removeAttribute('disabled'); }
        }
    }

    function downloadBlob(name, blob) {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url; a.download = name; document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1200);
    }

    async function tryLoadExternalPhrases(){
      const paths = ['./phrases.json','../../sub_agents/middleware/phrases.json'];
      for (const p of paths) {
        try{
          const res = await fetch(p, {cache:'no-store'});
          if (!res.ok) continue;
          const ext = await res.json();
          PHRASES = { ...PHRASES, ...ext };
          break;
        }catch(_){/* ignore */}
      }
    }

    async function main(){
      await tryLoadExternalPhrases();
      // 主题持久化
      try{ const saved=localStorage.getItem('themeDark')==='1'; document.body.classList.toggle('theme-dark', saved); $('#themeToggle').checked=saved; }catch(_){ }
      populateUI(PHRASES);
      setupEventListeners();
      build();
      // 启动 scrollspy 与进度条
      window.addEventListener('scroll', onScrollSpy, {passive:true});
      runDiagnostics();
    }

    function onScrollSpy(){
      const sections=['sec-basic','sec-pricing','sec-preview'].map(id=>document.getElementById(id)).filter(Boolean);
      let current='';
      const threshold=120;
      for(const sec of sections){
        const rect=sec.getBoundingClientRect();
        if(rect.top<=threshold) current=sec.id;
      }
      document.querySelectorAll('.topnav a').forEach(a=>{
        const href=a.getAttribute('href')||''; const id=href.replace('#','');
        a.classList.toggle('active', id===current);
      });
      // 顶部进度条
      const dh=document.documentElement; const h=dh.scrollHeight-dh.clientHeight; const sc=dh.scrollTop||document.body.scrollTop; const pct=Math.max(0,Math.min(1,h?sc/h:0));
      const bar=document.getElementById('progress'); if(bar) bar.style.width=(pct*100)+'%';
      const pp=document.getElementById('progressPct'); if(pp) pp.textContent = Math.round(pct*100)+'%';
    }

    // 基础可用性诊断：检查关键按钮与处理器
    function runDiagnostics(){
      const ids=['btnCopy','btnCopySummary','btnOcr','btnDocx','applySuggest'];
      const issues=[];
      ids.forEach(id=>{
        const el=document.getElementById(id);
        if(!el) issues.push(`${id}: missing`);
      });
      // 简单事件挂载判定（无法读取 onclick 源，只检查存在性）
      if(!document.getElementById('rate')||!document.getElementById('tenor')) issues.push('inputs: missing');
      const log=document.getElementById('log');
      if (log){ log.textContent = issues.length? `诊断: ${issues.join('; ')}` : '就绪 · 诊断: OK'; }
      if (issues.length) console.warn('Diagnostics', issues);
    }

    main();
});
