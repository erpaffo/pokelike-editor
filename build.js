const esbuild = require('esbuild');
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

async function build() {
  console.log('🔄 Avvio il processo di build...');
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  try {
    // 1. Bundle con esbuild
    await esbuild.build({
      entryPoints: ['js/main.js'],
      bundle: true,
      outfile: 'dist/bundle.js',
      format: 'esm', // Modulo ES per il browser
      target: ['es2020']
    });
    
    console.log('✅ Bundle completato con esbuild.');

    // 2. Offuscamento
    const bundleCode = fs.readFileSync('dist/bundle.js', 'utf8');
    
    console.log('🔄 Offuscamento del codice in corso...');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(bundleCode, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 4000,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayEncoding: ['base64'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    });

    fs.writeFileSync('dist/bundle.obfuscated.js', obfuscationResult.getObfuscatedCode());
    
    console.log('✅ Offuscamento completato! File salvato in dist/bundle.obfuscated.js');
    console.log('⚠️ Ricordati di aggiornare popup.html per usare dist/bundle.obfuscated.js prima di rilasciare l\'estensione in produzione.');

  } catch (error) {
    console.error('❌ Errore durante la build:', error);
    process.exit(1);
  }
}

build();
