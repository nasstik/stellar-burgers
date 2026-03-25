import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Укажи здесь адрес, по которому открывается твой запущенный проект
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // здесь можно оставить пусто, если нет специальных плагинов
    },
    // Полезно добавить, чтобы видеть скриншоты при падении
    screenshotOnRunFailure: true,
    video: false
  }
});
