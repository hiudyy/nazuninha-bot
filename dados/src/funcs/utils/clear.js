/**
 * Sistema de Gerenciamento de Memória Otimizado
 * Versão: 2.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Configurações
const CONFIG = {
  INTERVALS: {
    MEMORY_CHECK: 5 * 60 * 1000,    // 5 minutos
    CACHE_CLEANUP: 30 * 60 * 1000,  // 30 minutos
    TEMP_CLEANUP: 60 * 60 * 1000    // 1 hora
  },
  THRESHOLDS: {
    MEMORY_USAGE: 0.85,  // 85% do total
    HEAP_USAGE: 0.90     // 90% do heap máximo
  },
  PATHS: {
    TEMP: path.join(__dirname, '../../../database/tmp'),
    CACHE: path.join(__dirname, '../../../database/cache')
  }
};

// Monitor de Recursos
class ResourceMonitor {
  static getMemoryUsage() {
    const used = process.memoryUsage();
    const total = os.totalmem();
    
    return {
      heapUsed: used.heapUsed,
      heapTotal: used.heapTotal,
      external: used.external,
      rss: used.rss,
      systemTotal: total,
      systemFree: os.freemem(),
      processUsage: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal,
      systemUsage: (total - os.freemem()) / total
    };
  }

  static isMemoryCritical() {
    const usage = this.getMemoryUsage();
    return (
      usage.processUsage > CONFIG.THRESHOLDS.HEAP_USAGE ||
      usage.systemUsage > CONFIG.THRESHOLDS.MEMORY_USAGE
    );
  }

  static formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  static logMemoryStatus() {
    const usage = this.getMemoryUsage();
    console.log(`
[${new Date().toISOString()}] Status de Memória:
- Heap: ${this.formatBytes(usage.heapUsed)}/${this.formatBytes(usage.heapTotal)} (${(usage.processUsage * 100).toFixed(1)}%)
- Sistema: ${this.formatBytes(usage.systemTotal - usage.systemFree)}/${this.formatBytes(usage.systemTotal)} (${(usage.systemUsage * 100).toFixed(1)}%)
- RSS: ${this.formatBytes(usage.rss)}
- Externo: ${this.formatBytes(usage.external)}
    `);
  }
}

// Gerenciador de Arquivos Temporários
class TempFileManager {
  static async cleanup() {
    try {
      const directories = [CONFIG.PATHS.TEMP, CONFIG.PATHS.CACHE];
      
      for (const dir of directories) {
        try {
          const files = await fs.readdir(dir);
          const now = Date.now();
          
          for (const file of files) {
            try {
              const filePath = path.join(dir, file);
              const stats = await fs.stat(filePath);
              
              // Remove arquivos mais antigos que 24 horas
              if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
                await fs.unlink(filePath);
                console.log(`Arquivo removido: ${filePath}`);
              }
            } catch (error) {
              console.warn(`Erro ao processar arquivo ${file}:`, error.message);
            }
          }
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.warn(`Erro ao limpar diretório ${dir}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Erro na limpeza de arquivos temporários:', error);
    }
  }
}

// Gerenciador de Cache
class CacheManager {
  static clearModuleCache() {
    const preservedModules = new Set([
      'events',
      'util',
      'path',
      'fs',
      'os',
      'stream',
      'http',
      'https'
    ]);

    Object.keys(require.cache).forEach(key => {
      const moduleName = path.basename(key);
      if (!preservedModules.has(moduleName)) {
        delete require.cache[key];
      }
    });
  }

  static clearGlobalCache() {
    // Limpa caches globais customizados
    if (global.mediaCache) global.mediaCache.clear();
    if (global.uploadCache) global.uploadCache.clear();
    if (global.styleCache) global.styleCache.clear();
  }
}

/**
 * Limpa memória e recursos do sistema
 * @param {boolean} [force=false] - Força limpeza mesmo sem uso crítico
 * @returns {Object} Status da limpeza
 */
async function clearMemory(force = false) {
  const initialUsage = ResourceMonitor.getMemoryUsage();
  console.log(`[${new Date().toISOString()}] Iniciando limpeza de memória...`);

  try {
    // Verifica se limpeza é necessária
    if (!force && !ResourceMonitor.isMemoryCritical()) {
      console.log('Uso de memória normal, limpeza não necessária.');
      return { success: true, skipped: true };
    }

    // Limpa caches
    CacheManager.clearModuleCache();
    CacheManager.clearGlobalCache();

    // Força garbage collection se disponível
    if (global.gc) {
      global.gc();
      console.log('Garbage collection forçada executada.');
    }

    // Limpa arquivos temporários
    await TempFileManager.cleanup();

    // Registra resultados
    const finalUsage = ResourceMonitor.getMemoryUsage();
    const memoryFreed = initialUsage.heapUsed - finalUsage.heapUsed;

    console.log(`
Limpeza concluída:
- Memória liberada: ${ResourceMonitor.formatBytes(memoryFreed)}
- Uso atual: ${ResourceMonitor.formatBytes(finalUsage.heapUsed)}
    `);

    return {
      success: true,
      memoryFreed,
      initialUsage: initialUsage.heapUsed,
      finalUsage: finalUsage.heapUsed
    };
  } catch (error) {
    console.error('Erro durante limpeza:', error);
    return { success: false, error: error.message };
  }
}

// Configura intervalos de limpeza
const setupCleanupIntervals = () => {
  // Monitora uso de memória
  setInterval(() => {
    ResourceMonitor.logMemoryStatus();
    if (ResourceMonitor.isMemoryCritical()) {
      clearMemory(true);
    }
  }, CONFIG.INTERVALS.MEMORY_CHECK);

  // Limpa caches periodicamente
  setInterval(() => {
    CacheManager.clearGlobalCache();
  }, CONFIG.INTERVALS.CACHE_CLEANUP);

  // Limpa arquivos temporários
  setInterval(() => {
    TempFileManager.cleanup();
  }, CONFIG.INTERVALS.TEMP_CLEANUP);
};

// Inicia monitoramento
//setupCleanupIntervals();
//console.log('Sistema de limpeza automática iniciado.');

module.exports = clearMemory;
