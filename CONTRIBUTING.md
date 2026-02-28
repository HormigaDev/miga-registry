# Contributing to Miga Registry

Thank you for considering contributing! This registry follows a strict **Open/Closed** principle: once a version is published, it is **immutable**.

### 🇺🇸 English

#### How to add a module

1. Create a folder: `modules/<module-name>/v<x.y.z>/`.
2. Include your source files and a `manifest.json`.
3. Run `npm run prepare <module> <version>` to generate the `source.zip`.
4. Submit a Pull Request.

#### Rules

- **Immutability:** Never modify an existing version. If you find a bug, submit a new version (e.g., v1.0.1).
- **Source Zip:** Every version must include a `source.zip` containing the files declared in the manifest.

---

### 🇪🇸 Español

#### Cómo añadir un módulo

1. Crea una carpeta: `modules/<nombre-del-modulo>/v<x.y.z>/`.
2. Incluye tus archivos fuente y un `manifest.json`.
3. Ejecuta `npm run prepare <modulo> <version>` para generar el `source.zip`.
4. Envía un Pull Request.

#### Reglas

- **Inmutabilidad:** Nunca modifiques una versión existente. Si encuentras un error, envía una nueva versión (ej: v1.0.1).
- **Source Zip:** Cada versión debe incluir un `source.zip` con los archivos declarados en el manifiesto.

---

### 🇧🇷 Português

#### Como adicionar um módulo

1. Crie uma pasta: `modules/<nome-do-modulo>/v<x.y.z>/`.
2. Inclua seus arquivos fonte e um `manifest.json`.
3. Execute `npm run prepare <modulo> <versao>` para gerar o `source.zip`.
4. Envie um Pull Request.

#### Regras

- **Imutabilidade:** Nunca modifique uma versão existente. Se encontrar um erro, envie uma nova versão (ex: v1.0.1).
- **Source Zip:** Cada versão deve incluir um `source.zip` contendo os arquivos declarados no manifesto.
