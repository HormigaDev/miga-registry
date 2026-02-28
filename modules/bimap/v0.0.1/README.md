# BiMap (Bi-directional Map)

A generic TypeScript implementation of a Bi-directional Map. It enforces a strict **1:1 relationship** between keys and values.

---

## 🇬🇧 English

### Description

`BiMap<K, V>` allows you to map keys to values and values back to keys. Unlike a standard Map, `BiMap` ensures that values are unique. If you try to insert a duplicate value, the previous key associated with that value is removed automatically.

### Usage

```typescript
import { BiMap } from "./BiMap";

// Example 1: String to Number
const ids = new BiMap<string, number>();

ids.set("UserA", 101);
ids.set("UserB", 102);

console.log(ids.getByKey("UserA")); // 101
console.log(ids.getByValue(101)); // "UserA"

// Enforcing 1:1 relationship
// If we assign ID 101 to UserC, UserA will be removed because 101 is taken.
ids.set("UserC", 101);

console.log(ids.hasKey("UserA")); // false
console.log(ids.getByKey("UserC")); // 101
```

---

## 🇪🇸 Español

### Descripción

`BiMap<K, V>` permite mapear claves a valores y valores de vuelta a claves. A diferencia de un Map estándar, `BiMap` garantiza que los valores sean únicos. Si intentas insertar un valor duplicado, la clave anterior asociada a ese valor será eliminada automáticamente.

### Uso

```typescript
import { BiMap } from "./BiMap";

// Ejemplo 2: Number a String (Códigos de error)
// Podemos inicializarlo con un array de tuplas
const errors = new BiMap<number, string>([
    [404, "Not Found"],
    [500, "Server Error"],
]);

console.log(errors.getByKey(404)); // "Not Found"
console.log(errors.getByValue("Not Found")); // 404

// Garantizando relación 1:1
// Si asignamos "Not Found" al código 400, el 404 desaparecerá.
errors.set(400, "Not Found");

console.log(errors.hasKey(404)); // false
console.log(errors.getByKey(400)); // "Not Found"
```

---

## 🇧🇷 Português

### Descrição

`BiMap<K, V>` permite mapear chaves para valores e valores de volta para chaves. Diferente de um Map padrão, o `BiMap` garante que os valores sejam únicos. Se você tentar inserir um valor duplicado, a chave anterior associada a esse valor será removida automaticamente.

### Uso

```typescript
import { BiMap } from "./BiMap";

// Exemplo 3: String para String (Nomes de usuário e Emails)
const users = new BiMap<string, string>();

users.set("dev1", "alice@example.com");

console.log(users.getByKey("dev1")); // "alice@example.com"
console.log(users.getByValue("alice@example.com")); // "dev1"

// Garantindo relação 1:1
// Se "dev2" tentar usar o mesmo email, "dev1" será removido.
users.set("dev2", "alice@example.com");

console.log(users.hasKey("dev1")); // false
console.log(users.getByKey("dev2")); // "alice@example.com"
```

---

## API Reference

| Method                    | Returns          | Description / Descripción / Descrição            |
| :------------------------ | :--------------- | :----------------------------------------------- |
| `set(key: K, value: V)`   | `void`           | Adds a pair. Overwrites if key or value exists.  |
| `getByKey(key: K)`        | `V \| undefined` | Gets value by key.                               |
| `getByValue(value: V)`    | `K \| undefined` | Gets key by value.                               |
| `hasKey(key: K)`          | `boolean`        | Checks if key exists.                            |
| `hasValue(value: V)`      | `boolean`        | Checks if value exists.                          |
| `deleteByKey(key: K)`     | `boolean`        | Removes entry by key. Returns true if removed.   |
| `deleteByValue(value: V)` | `boolean`        | Removes entry by value. Returns true if removed. |
| `clear()`                 | `void`           | Removes all entries.                             |
| `size`                    | `number`         | Returns the number of entries.                   |
