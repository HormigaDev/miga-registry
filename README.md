# Miga Registry 🐜

The centralized, high-performance module registry for the **Miga CLI**. Built specifically for Minecraft Bedrock Edition scripting development.

---

### 🇺🇸 English

#### 🚀 Features

- **Strict Immutability:** Once a version is published to `master`, it's locked forever. No breaking changes on existing versions.
- **Hybrid Distribution:** Optimized for speed with `source.zip` archives while maintaining human readability through raw source files.
- **Open/Closed Philosophy:** Easy to extend with new versions, closed to modifications of old ones.
- **Type-Safe:** Integrated support for TypeScript definitions via `@minecraft` types.

#### 📦 Module Structure

Every module must follow this hierarchy:

```
modules/
└── <module-name>/
└── v<major.minor.patch>/
├── manifest.json
├── source.zip (generated)
└── <source-files>.ts
```

#### 🛠 Adding a Module

1. Create the version directory.
2. Fill the `manifest.json`.
3. Run the preparation script:
    ```bash
    npm run pre <module-name> <version>
    ```
4. Submit a Pull Request.

> **Every module in this registry is manually vetted.** We don't just host code; we audit it. Our goal is to provide a library of modules that are not only safe from malicious intent but also optimized for performance.

_Note: Always test new modules in a backup world to ensure compatibility with your specific setup._

---

### 🇪🇸 Español

#### 🚀 Características

- **Inmutabilidad Estricta:** Una vez que una versión se publica en `master`, se bloquea para siempre. Sin cambios disruptivos en versiones existentes.
- **Distribución Híbrida:** Optimizado para la velocidad con archivos `source.zip` manteniendo la legibilidad humana mediante archivos fuente directos.
- **Filosofía Abierto/Cerrado:** Fácil de extender con nuevas versiones, cerrado a modificaciones de las antiguas.
- **Tipado Seguro:** Soporte integrado para definiciones de TypeScript mediante tipos de `@minecraft`.

#### 📦 Estructura del Módulo

Cada módulo debe seguir esta jerarquía:

```
modules/
└── <nombre-del-modulo>/
└── v<major.minor.patch>/
├── manifest.json
├── source.zip (generado)
└── <archivos-fuente>.ts
```

#### 🛠 Añadir un Módulo

1. Crea el directorio de la versión.
2. Completa el `manifest.json`.
3. Ejecuta el script de preparación:
    ```bash
    npm run pre <nombre-del-modulo> <version>
    ```
4. Envía un Pull Request.

> **Cada módulo en este registro es revisado manualmente.** No solo alojamos código; lo auditamos. Nuestro objetivo es proporcionar una librería de módulos que no solo estén libres de intenciones maliciosas, sino que también estén optimizados para el rendimiento.

_Nota: Prueba siempre los nuevos módulos en un mundo de respaldo para asegurar la compatibilidad con tu configuración específica._

---

### 🇧🇷 Português

#### 🚀 Características

- **Imutabilidade Estrita:** Uma vez que uma versão é publicada na `master`, ela é bloqueada para sempre. Sem alterações que quebrem versões existentes.
- **Distribuição Híbrida:** Otimizado para velocidade com arquivos `source.zip`, mantendo a legibilidade humana através dos arquivos fonte originais.
- **Filosofia Aberto/Fechado:** Fácil de estender com novas versões, fechado para modificações das antigas.
- **Tipagem Segura:** Suporte integrado para definições de TypeScript via tipos `@minecraft`.

#### 📦 Estrutura do Módulo

Cada módulo deve seguir esta hierarquia:

```
modules/
└── <nome-do-modulo>/
└── v<major.minor.patch>/
├── manifest.json
├── source.zip (gerado)
└── <arquivos-fonte>.ts
```

#### 🛠 Adicionar um Módulo

1. Crie o diretório da versão.
2. Preencha o `manifest.json`.
3. Execute o script de preparação:
    ```bash
    npm run pre <nome-do-modulo> <versao>
    ```
4. Envie um Pull Request.

> **Cada módulo neste registro é revisado manualmente.** Não apenas hospedamos código; nós o auditamos. Nosso objetivo é fornecer uma biblioteca de módulos que não apenas estejam livres de intenções maliciosas, mas também sejam otimizados para o desempenho.

_Nota: Sempre teste novos módulos em um mundo de backup para garantir a compatibilidade com sua configuração específica._
