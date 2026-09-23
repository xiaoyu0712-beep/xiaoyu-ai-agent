import './style.css';

const icon = (name, size = 18) => {
  const paths = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
    settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m4 14-1-2 1-2 2-.5 1-2L7 5l2-1 2 1 .5 2h2L15 4l2 1-.5 2 1 2 2 .5 1 2-1 2-2 .5-1 2 .5 2-2 1-1.5-1.5h-2L11 20l-2-1 .5-2-1-2L6 14.5 4 14Z"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    send: '<path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/>',
    spark: '<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    tool: '<path d="m14 6 4 4M5 19l7-7 3 3-7 7H5v-3Z"/><path d="m13 7 2-2 4 4-2 2"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16"/>',
    folder: '<path d="M4 7h6l2 2h8v9H4V7Z"/><path d="M4 7V5h6l2 2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
};

const tasks = [
  { id: 't1', title: '整理開源工具與 Agent 能力', detail: 'CrewAI / OpenManus 工具層', status: '完成', type: '研究', progress: 100 },
  { id: 't2', title: '規劃 Xiaoyu AI 工作流程', detail: '拆分任務、工具與執行順序', status: '執行中', type: 'Agent', progress: 68 },
  { id: 't3', title: '建立 GitHub Pages 發佈設定', detail: 'Actions 建置與靜態部署', status: '等待中', type: '部署', progress: 24 },
];

const tools = [
  { icon: 'globe', name: '網路研究', desc: '搜尋、讀取與整理公開資訊', enabled: true },
  { icon: 'tool', name: '程式與資料分析', desc: '執行分析、產生圖表與檔案', enabled: true },
  { icon: 'folder', name: '檔案工作區', desc: '讀取、整理與建立工作檔案', enabled: true },
  { icon: 'spark', name: 'Crew 編排', desc: '多 Agent 協作與任務分工', enabled: true },
];

const state = { activeNav: '總覽', rightOpen: true, prompt: '', running: false, message: '' };

function render() {
  document.querySelector('#root').innerHTML = `
    <div class="app-shell">
      <aside class="left-sidebar">
        <div class="brand"><div class="brand-mark">${icon('spark', 20)}</div><span>Xiaoyu AI</span><small>AGENT WORKSPACE</small></div>
        <button class="new-task">${icon('plus', 18)}<span>新建任務</span><kbd>⌘ K</kbd></button>
        <nav class="main-nav">
          ${['總覽','任務','排程','工具與連接器'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['grid','check','clock','tool'][i], 17)}<span>${item}</span>${item === '任務' ? '<b class="count">3</b>' : ''}</button>`).join('')}
        </nav>
        <div class="nav-label">最近工作區</div>
        <div class="workspace-list"><button>${icon('folder', 16)}產品研究</button><button>${icon('folder', 16)}內容策略</button><button>${icon('folder', 16)}GitHub 專案</button></div>
        <div class="sidebar-bottom"><button class="nav-item">${icon('settings', 17)}<span>設定</span></button><div class="profile"><div class="avatar">小</div><div><strong>小宇</strong><small>本機工作區</small></div>${icon('chevron', 15)}</div></div>
      </aside>

      <main class="main-content">
        <header class="topbar"><div class="mobile-brand"><div class="brand-mark">${icon('spark', 18)}</div>Xiaoyu AI</div><div class="breadcrumbs">工作區 <span>/</span> ${state.activeNav}</div><div class="top-actions"><button class="icon-btn" title="搜尋">${icon('search')}</button><button class="icon-btn" title="設定">${icon('settings')}</button><button class="avatar mini">小</button></div></header>
        <section class="content-wrap">
          <div class="welcome-row"><div><p class="eyebrow">XIAOYU AI AGENT</p><h1>今天要一起完成什麼？</h1><p class="subtitle">把目標交給 Xiaoyu AI，讓它規劃、執行並回報每一步。</p></div><button class="right-toggle" data-action="toggle-right">${icon(state.rightOpen ? 'close' : 'menu', 17)}${state.rightOpen ? '收起進度' : '開啟進度'}</button></div>
          <div class="prompt-card"><div class="prompt-icon">${icon('spark', 23)}</div><textarea id="prompt" placeholder="描述你的任務，例如：研究一個主題、整理檔案、建立網站……">${state.prompt}</textarea><div class="prompt-footer"><div class="prompt-hints"><span>${icon('tool', 14)} 自動選擇工具</span><span>${icon('check', 14)} 可隨時檢視進度</span></div><button class="send-btn" data-action="run" ${state.running ? 'disabled' : ''}>${state.running ? '<span class="spinner"></span> 執行中' : icon('send', 17) + ' 開始執行'}</button></div></div>
          ${state.message ? `<div class="notice">${icon('check', 16)} ${state.message}</div>` : ''}
          <div class="section-head"><div><h2>進行中的任務</h2><p>AI 會自動拆分步驟並即時更新狀態</p></div><button class="text-btn">查看全部 ${icon('arrow', 15)}</button></div>
          <div class="task-grid">${tasks.map(taskCard).join('')}</div>
          <div class="section-head tools-head"><div><h2>可用能力</h2><p>整合 Suna 工作區、CrewAI 編排與 OpenManus 工具概念</p></div><button class="text-btn">管理工具 ${icon('arrow', 15)}</button></div>
          <div class="tool-grid">${tools.map(toolCard).join('')}</div>
        </section>
      </main>

      ${state.rightOpen ? `<aside class="right-sidebar"><div class="right-head"><div><p class="eyebrow">LIVE RUN</p><h2>任務實時進度</h2></div><span class="live-dot">即時</span></div><div class="run-card"><div class="run-top"><div class="run-orb">${icon('spark', 20)}</div><div><strong>${state.running ? '正在執行 Xiaoyu AI 任務' : 'Xiaoyu AI 工作流程'}</strong><small>${state.running ? 'AI 正在分析你的需求……' : '最後更新：剛剛'}</small></div></div><div class="overall-progress"><div style="width:${state.running ? '74%' : '56%'}"></div></div><div class="run-meta"><span>整體完成度</span><b>${state.running ? '74%' : '56%'}</b></div></div><div class="timeline">${tasks.map((t, i) => `<div class="timeline-item ${t.status === '執行中' ? 'current' : ''}"><div class="timeline-marker">${t.status === '完成' ? icon('check', 13) : t.status === '執行中' ? '<span class="pulse"></span>' : i + 1}</div><div class="timeline-copy"><div><strong>${t.title}</strong><span class="status ${t.status === '完成' ? 'done' : t.status === '執行中' ? 'doing' : ''}">${t.status}</span></div><small>${t.detail}</small>${t.status !== '等待中' ? `<div class="mini-progress"><i style="width:${t.progress}%"></i></div>` : ''}</div></div>`).join('')}</div><div class="right-footer"><div class="footer-row"><span>目前模型</span><b>內建 Agent 路由</b></div><div class="footer-row"><span>外部 API Key</span><b class="safe">未要求填寫</b></div><p>此 GitHub Pages 版本不在瀏覽器暴露金鑰；接上自有後端後即可啟用真實模型執行。</p></div></aside>` : ''}
    </div>`;
  bindEvents();
}

function taskCard(t) { return `<article class="task-card"><div class="task-card-top"><span class="task-type">${t.type}</span><button class="more">···</button></div><h3>${t.title}</h3><p>${t.detail}</p><div class="card-progress"><div><span>完成度</span><b>${t.progress}%</b></div><div class="progress-track"><i style="width:${t.progress}%"></i></div></div><div class="task-card-foot"><span class="status ${t.status === '完成' ? 'done' : t.status === '執行中' ? 'doing' : ''}">${t.status}</span><span>剛剛更新</span></div></article>`; }
function toolCard(t) { return `<button class="tool-card"><div class="tool-icon">${icon(t.icon, 19)}</div><div><strong>${t.name}</strong><p>${t.desc}</p></div><span class="enabled">${icon('check', 13)}</span></button>`; }
function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => { state.activeNav = b.dataset.nav; render(); });
  document.querySelector('[data-action="toggle-right"]')?.addEventListener('click', () => { state.rightOpen = !state.rightOpen; render(); });
  const input = document.querySelector('#prompt'); input?.addEventListener('input', e => state.prompt = e.target.value);
  document.querySelector('[data-action="run"]')?.addEventListener('click', async () => {
    if (!state.prompt.trim()) { state.message = '請先描述你想完成的任務。'; render(); return; }
    state.running = true; state.message = '已建立任務流程：Manus LLM 規劃 → CrewAI 分發 → OpenManus 工具執行'; render();
    const base = (window.XIAOYU_API_BASE || import.meta.env.VITE_XIAOYU_API_BASE || '').replace(/\/$/, '');
    if (!base) { state.message = '前端已完成 Gateway 接線；請設定 VITE_XIAOYU_API_BASE 後啟用真實後端。'; state.running = false; render(); return; }
    try {
      const response = await fetch(`${base}/api/runs`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ goal: state.prompt, engine: 'hybrid' }) });
      if (!response.ok) throw new Error(`Gateway ${response.status}`);
      const { run_id: runId } = await response.json();
      const stream = new EventSource(`${base}/api/runs/${runId}/events`);
      stream.onmessage = event => { const data = JSON.parse(event.data); state.message = data.message || data.step || data.summary || 'Agent 正在執行……'; if (data.event === 'completed' || data.event === 'failed') { state.running = false; stream.close(); } render(); };
      stream.onerror = () => { state.running = false; state.message = 'Gateway 連線中斷，請查看後端執行紀錄。'; stream.close(); render(); };
    } catch (error) { state.running = false; state.message = `無法連線 Xiaoyu Gateway：${error.message}`; render(); }
  });
}
render();
