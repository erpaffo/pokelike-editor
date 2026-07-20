import { currentRun, currentPokedollars, setCurrentPokedollars, autoSave } from '../state.js';
import { requirePro } from '../api.js';
import { renderAll } from '../main.js';

function renderRun() {
  document.getElementById('runMoney').value = currentPokedollars;
  if (!currentRun) return;
  
  document.getElementById('runMoney').value = currentPokedollars;
  document.getElementById('runBadges').value = currentRun.badges || 0;
  document.getElementById('runMap').value = currentRun.currentMap || 0;
  document.getElementById('runNuzlocke').checked = !!currentRun.nuzlockeMode;
  document.getElementById('runEndless').checked = !!currentRun.isEndlessMode;
  
  const stageRow = document.getElementById('endlessStageRow');
  if (currentRun.isEndlessMode) {
    stageRow.style.display = 'flex';
    document.getElementById('runEndlessStage').value = currentRun.endlessStage || 0;
  } else {
    stageRow.style.display = 'none';
  }

  // Bindings attached only once in init bindings
}


export function initRunListeners() {
  ['runMoney','runBadges','runMap','runEndlessStage'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', (e) => {
      if (id !== 'runMoney' && !requirePro()) {
        renderRun();
        return;
      }
      const val = parseInt(e.currentTarget.value) || 0;
      if(id === 'runMoney') setCurrentPokedollars(val);
      if(id === 'runBadges') currentRun.badges = val;
      if(id === 'runMap') currentRun.currentMap = val;
      if(id === 'runEndlessStage') currentRun.endlessStage = val;
      autoSave();
    });
  });
  
  ['runNuzlocke','runEndless'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', (e) => {
      if (id !== 'runNuzlocke' && !requirePro()) {
        e.currentTarget.checked = !e.currentTarget.checked;
        return;
      }
      const val = e.currentTarget.checked;
      if(id === 'runNuzlocke') currentRun.nuzlockeMode = val;
      if(id === 'runEndless') {
        currentRun.isEndlessMode = val;
        renderRun();
      }
      autoSave();
    });
  });
}
