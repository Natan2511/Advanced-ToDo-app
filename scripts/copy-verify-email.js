import { copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filesToCopy = [
  {
    source: "../verify-email.html",
    dest: "../dist/verify-email.html",
    name: "verify-email.html",
  },
  { source: "../public/404.html", dest: "../dist/404.html", name: "404.html" },
];

try {
  // Убеждаемся, что папка dist существует
  const distDir = resolve(__dirname, "../dist");
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  filesToCopy.forEach(({ source, dest, name }) => {
    const sourceFile = resolve(__dirname, source);
    const destFile = resolve(__dirname, dest);

    if (existsSync(sourceFile)) {
      copyFileSync(sourceFile, destFile);
      console.log(`✅ ${name} скопирован в dist/`);
    } else {
      console.warn(`⚠️ ${name} не найден`);
    }
  });
} catch (error) {
  console.error("❌ Ошибка при копировании файлов:", error.message);
  process.exit(1);
}
