---
layout: typescript
title: TypeScript 高级特性
date: 2023-03-01 23:06:49
tags:
  - TypeScript
comments: true
---

# 前言

TypeScript 是由[安德斯·海尔斯伯格](https://en.wikipedia.org/wiki/Anders_Hejlsberg)（Anders Hejlsberg）在微软开发的严格超集语言，是 JavaScript 的一个强类型版本。任何 JavaScript 中的特性都可以在 TypeScript 中使用，这也就意味着我们可以运用已熟知的 JavaScript 技能，以及以前不支持的编码功能去开发复杂的大型应用，从而提高代码的可读性和可维护性。此外，TypeScript 还提供了诸如类型推断、联合类型、类型保护和泛型等高级特性，以便我们可以更好地处理日趋复杂的代码库。

# 为什么需要 TypeScript

TypeScript 为 JavaScript 添加了类型系统的支持。使用 TypeScript 的好处有很多，例如：

- 代码即文档
- 编译器自动提示
- 一定程度上能够避免低级 bug
- 代码的可维护性更强

TypeScript 可以让我们在编写 JavaScript 代码时拥有更好的代码质量和更强的编译时错误检查。在开发阶段能够帮助我们更快速、更精准地定位问题，以降低代码在运行时才能引发错误的风险。并且在开发大型项目时，TypeScript 的类型系统可以帮助我们更好地组织代码，使团队成员能够更快地了解项目。

# TypeScript 的高级特性

## 操作符

TypeScript 支持 JavaScript 中的大多数操作符，包括算数、关系、逻辑、位、赋值、条件、类型转换和其他操作符。此外，TypeScript 还提供了一些额外的特殊操作符，如**类型保护**和**断言**操作符。

<!-- more -->

### 类型保护

类型保护是一种缩小类型的机制。TypeScript 通过编译时进行类型保护，使得在编写代码时就能发现和修复类型错误。

类型保护的形式有多种，例如：

1. 类型断言：使用 `as` 语法手动指定变量的类型
2. `instanceof` 运算符：检查一个变量是否是某个类的实例
3. `typeof` 运算符：检查一个变量的类型是否是某个类型
4. `in` 运算符：检查一个变量是否是某个对象的属性
5. 用户自定义的类型保护函数：使用特定的逻辑，检查一个变量是否符合特定的类型

### typeof

TypeScript 和 JavaScript 里面都有 `typeof` 关键字，二者的作用都差不多。

- 在 TypeScript 中，`typeof` **返回的是一个 TypeScript 类型定义**，即将 JS data 转换成 TS type。它只能对数据进行转换，不能转换 `type` 和 `interface`。
- 在 JavaScript 中，`typeof` **返回的是一个字符串**，指示操作数的 JavaScript 类型，即将 JS data 转换成 JS data。

```typescript
const organization = {
  name: 'zcy',
  age: 6,
}

type TOrganization = {
  name: string;
  age: number;
};

interface IOrganization {
  name: string;
  age: number;
}

// 以下方式会被认为是 JS 的 typeof
const JsData1 = typeof organization; // const JsData1 = "object"
const JsData2 = typeof TOrganization; // 'TOrganization' only refers to a type, but is being used as a value here.
const JsData3 = typeof IOrganization; // 'IOrganization' only refers to a type, but is being used as a value here.

// 以下方式会被认为是 TS 的 typeof
type TsType1 = typeof organization; // type TsType1 = {name: string; age: number}
type TsType2 = typeof TOrganization; // 'TOrganization' only refers to a type, but is being used as a value here.
type TsType3 = typeof IOrganization; // 'IOrganization' only refers to a type, but is being used as a value here.
```

### instanceof

`instanceof` 可以用于检查对象是否属于特定类。它仅适用于 `class` 类，不适用于其他 TypeScript 结构，如 `interface`。

```typescript
// 语法
objectVariable instanceof ClassName;
```

```typescript
class Contact {
  constructor(public emailAddress: string) {}
}
class Person extends Contact {
  constructor(
    public firstName: string,
    public surname: string,
    emailAddress: string
  ) {
    super(emailAddress);
  }
}
function sayHello(contact: Contact) {
  if (contact instanceof Person) {
    console.log("Hello " + contact.firstName);
  }
}
```

### keyof 索引类型查询

`keyof` 有时被称为索引查询运算符，因为它查询在它之后指定的类型的所有键的联合类型。换句话说，它将对象类型的所有键作为字符串类型的联合类型返回。

```typescript
// 语法
keyof T
```

结果为泛型 `T` 上已知的公共属性名的联合类型。

```typescript
interface User {
  name: string;
  age: number;
}

type UserKeys = keyof User;
// 等价于
// type UserKeys = "name" | "age"
```

### T[K] 索引访问

```typescript
// 语法
T[K]
```

结果为泛型 `T` 上 `K` 属性的值类型。

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // obj[key] 的类型是 T[K]
}
```

上述例子中，我们使用泛型定义了入参 `obj: T` 和 `key: K`，此时有 `obj[key]: T[K]`。当我们返回 `obj[key]`，编译器会实例化 `obj[key]` 的真实类型，因此返回值类型可以随着属性值类型的改变而改变。

### in

```typescript
// 语法
propertyName in objectVariable;
```

`in` 关键字在 TypeScript 中有两层含义，第一层含义与 JavaScript 一致，用于检查属性是否属于特定对象。TypeScript 编译器使用 `in` 表达式来收窄表达式中变量的类型。其返回值取决于 `propertyName` 属性是否属于 `objectVariable` 对象。

```typescript
interface A {
  x: number;
}
interface B {
  y: string;
}

let q: A | B = ...;
if ('x' in q) {
  // q: A
} else {
  // q: B
}
```

此外，`in` 在 TypeScript 中的另一层含义是在**映射类型**（Mapped Types）中，`in` 关键字用作语法的一部分，用于遍历枚举类型。

```typescript
interface Person {
  name: string;
  age: number;
}

type Partial<T> = {
  [P in keyof T]?: T[P]; // P 是泛型 T 中的任意属性
}

type PersonPartial = Partial<Person>;
// 等价于
// type PersonPartial = { name?: string;  age?: number; }
```

### extends 继承

`extends` 用于定义泛型类型或接口。它表示泛型类型或接口必须继承指定的类型，并受其约束。

在 TypeScript 中，`extends` 主要有三种使用场景：

- 类型继承，类型 A 继承类型 B（`interface` 可用 `extends` 继承，`type` 不可以）
- 定义范型，约束范型必须与目标类型相匹配
- 条件匹配，判断类型 A 是否匹配类型 B

当我们在定义接口类型时，可以为多个接口提取其可复用部分作为基础类型定义，然后通过**类型继承**来派生出其他子类型，例如：

```typescript
interface T1 {
  name: string;
}

interface T2 {
  location: string;
}

// 多重继承用逗号隔开
interface T3 extends T1, T2 {
  age: number;
}

// 合法
const t3: T3 = {
  name: 'zcy',
  location: 'Hangzhou',
  age: 6
}
```

在定义接口泛型时，如果想要约束这个泛型的有效范围，则可以使用 `extends` 来定义**范型约束**，我们还可以为其指定默认值。

```typescript
enum LANGUAGE {
  JAVA,
  GO,
  JAVASCRIPT,
}
// 约束范型 T 的类型并且指定默认值
interface IProgrammer<T extends LANGUAGE = LANGUAGE.JAVASCRIPT> {
  language: T;
}
```

条件匹配是一种利用条件表达式进行类型的关系检测，我们将在下文详细讨论。

```typescript
// 判断范型 T 是否匹配 number
type TNumber<T> = T extends number ? any : never;

type T1 = TNumber<number>; // type T1 = any
type T2 = TNumber<string>; // type T2 = never
```

### as 断言

`as` 关键字是一个类型断言运算符，用于将一个值的类型强制转换为另一种类型。这意味着，即使编译器检测到的变量类型与我们预期的类型不匹配，也可以使用类型断言将其转换为正确的类型。

```typescript
let someValue: any = "Hello";
let strLength = (someValue as string).length;
```

上述例子中，我们显式将 `someValue` 指定为 `any` 类型，此时 `strLength` 为 `any` 类型，因为无法从一个 `any` 类型的值中推断出 `length` 属性的类型。当我们通过类型断言将 `someValue` 转换为 `string` 类型后，`strLength` 将能得到正确的 `number` 类型。

TypeScript 还有一个**非空断言运算符**（`!`）用于断言一个变量非空，它位于我们想要告诉 TypeScript 不是 `null` 或 `undefined` 的变量或表达式之后。非空断言运算符是避免代码中不必要的 `null` 和 `undefined` 检查的简洁方法。

```typescript
function duplicate(text: string | null) {
  // if (text === null || text === undefined) {
  //   text = "";
  // }
  // return text.concat(text);

  // 使用非空断言运算符简写代码
  return text!.concat(text!);
}
```

### infer 类型推断

`infer` 关键字是 TypeScript 中的一个特殊类型，表示在 `extends` 条件语句中待推断的类型变量。它允许我们在声明一个类型变量时，从其他类型中推断出这个变量的类型。使用 `infer` 关键字可以使 TypeScript 更加灵活，并改善类型推断的表现。

```typescript
type T1<T> = T extends (infer U)[] ? U : T;
```

上述示例中，我们通过推断传入的类型是否是数组，如果是数组，则返回数组中推断的元素类型 `U`，否则返回 `T`。

```typescript
type ParamType<T> = T extends (...args: infer P) => any ? P : T;
```

上述代码表示：如果 `T` 能赋值给 `(...args: infer P) => any`，则结果是 `(...args: infer P) => any` 类型中的参数 `P`，否则返回 `T`。

```typescript
interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void;

type Type1 = ParamType<Func>;
// 等同于
// type Type1 = User

type Type2 = ParamType<string>;
// 等同于
// type Type2 = string
```

## 高级类型

### 索引类型（Index types）

当我们从对象中获取一些属性的值时，索引类型能够帮助我们检查使用了动态属性名的代码。 

```typescript
const organization = {
  name: 'zcy',
  age: 6,
}

function getValues(organization: any, keys: string[]) {
  return keys.map(key => organization[key]);
}

getValues(organization, ['name', 'age']); // ['zcy', 6]
getValues(organization, ['location']); // [undefined]
```

在上述代码中，`getValues(organization, ['location'])` 输出 `[undefined]`，TypeScript 编译器并没有给出错误提示。接下来我们运用前一章节操作符中学到的**索引类型查询**（`keyof`）和**索引访问**（`T[K]`）操作符来纠正类型约束。

```typescript
interface IOrganization {
  name: string;
  age: number;
}

const organization: IOrganization = {
  name: 'zcy',
  age: 6,
}

function getValues<T, K extends keyof T>(organization: T, keys: K[]): T[K][] {
  return keys.map(key => organization[key]);
}

// ['zcy', 6]
getValues(organization, ['name', 'age']);

// Type '"location"' is not assignable to type 'keyof IOrganization'.
getValues(organization, ['location']);
```

### 映射类型（**Mapped Types**）

有时候我们希望能从现有类型派生出新的类型。映射类型就是 TypeScript 为我们提供的基于现有类型创建新类型的一种方式，新类型会以相同的形式去转换旧类型中的每个属性。

在使用映射类型时，我们可以应用两个附加的修饰符 `readonly` 和 `?` 来分别影响属性的可变性和可选性。

```typescript
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
* Make all properties in T optional
*/
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type ReadonlyPerson = Readonly<Person>;
type PersonPartial = Partial<Person>;
```

我们可以通过添加 `-` 或 `+` 前缀来**删除**或**添加**这些修饰符。若没有显式指定前缀，则默认为 `+`。

```typescript
// 为 TOrganization 类型移除 readonly 修饰符
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type TOrganization = {
  readonly name: string;
  readonly age: number;
};

type UnlockedOrganization = Mutable<TOrganization>;
// 等价于
// type UnlockedOrganization = {
//   name: string;
//   age: number;
// };

// 为 MaybeOrganization 类型移除 ? 修饰符
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};

type MaybeOrganization = {
  name: string;
  age?: number;
  location?: string;
};

type Organization = Concrete<MaybeOrganization>;
// 等价于
// type Organization = {
//   name: string;
//   age: string;
//   location: number;
// };
```

此外，我们还可以利用 `as` 为生成的键名重新映射。

```typescript
type Getters<T> = {
  // 模板字面量类型后文会提及
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P]
};

interface IOrganization {
  name: string;
  age: number;
  location: string;
}

type LazyOrganization = Getters<IOrganization>;

// type LazyOrganization = {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```

### 条件类型（**Conditional Types**）

条件类型是 TypeScript 中非常强大的工具，是一种在编译时执行的特殊类型，可以让我们在编写代码时根据特定条件来确定类型，以灵活地处理复杂的类型问题。

条件类型看起来有点类似于 JavaScript 中的条件表达式，语法如下：

```typescript
SomeType extends OtherType ? TrueType : FalseType
```

- `SomeType` 和 `OtherType` 是比较的类型
- 如果 `SomeType` 可以赋值给 `OtherType`，则类型为 `TrueType`
- 如果 `SomeType` 无法赋值给 `OtherType`，则类型为 `FalseType`

条件类型可以用于创建动态类型。例如：

1、创建具有多种可能类型的对象

```typescript
type Options = {
  color: 'red' | 'green' | 'blue';
  size: 'small' | 'medium' | 'large';
  colors: string[];
  price: number;
};

type Item = {
  [K in keyof Options]: Options[K] extends string ? K : never;
}[keyof Options];

const item: Item = 'color';
```

在上述例子中，我们通过条件类型筛选出了 `Options` 中所有值类型为 `string` 的属性所组成的联合类型 `Item`。

2、创建只有满足特定条件的类型的类

```typescript
class DataStore<T> {
  private data: T;

  constructor(data: T) {
    this.data = data;
  }

  getData<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
}

const store = new DataStore({ name: 'zcy', age: 6 });
const name = store.getData('name');
```

### ****模板字面量类型（Template Literal Types）****

模板字面量类型是一种特殊的类型，用于在运行时生成字符串值。它们使用反引号 ``` 括起来，并且允许在字符串中嵌入表达式，跟 JavaScript 的模板字符串是相同的语法，但是只能用在类型操作中。

```typescript
type World = "world";
 
type Greeting = `hello ${World}`;
// 等价于
// type Greeting = "hello world"
```

为了帮助进行字符串操作，TypeScript 内置了一组可用于操纵字符串的类型，这些类型出于性能的考虑被内置在编译器中，无法在 `.d.ts` 文件中找到。

```typescript
/**
 * Convert string literal type to uppercase
 */
type Uppercase<S extends string> = intrinsic;

/**
 * Convert string literal type to lowercase
 */
type Lowercase<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to uppercase
 */
type Capitalize<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to lowercase
 */
type Uncapitalize<S extends string> = intrinsic;
```

从 TypeScript 4.1 开始，存在 4 种内置类型：`Uppercase`、`Lowercase`、`Capitalize` 和 `Uncapitalize`，它们都是使用关键字 `intrinsic` 定义的。`intrinsic`（adj. 固有的; 内在的; 本身的;）是 TypeScript 引入的一个关键字，就如同它的含义一样，是 TypeScript 内置的。它们的共同特点是生成的类型涉及到了值的转换，而不是类型的转换，这在 TypeScript 中通过已有的类型书写方式是无法表达的，所以 TypeScript 只能通过内置关键字在编译期实现。这些内置函数会直接使用 JavaScript 字符串运行时函数，而不是本地化识别。

```typescript
const enum IntrinsicTypeKind {
  Uppercase,
  Lowercase,
  Capitalize,
  Uncapitalize
}
const intrinsicTypeKinds: ReadonlyMap<string, IntrinsicTypeKind> = new Map(Object.entries({
  Uppercase: IntrinsicTypeKind.Uppercase,
  Lowercase: IntrinsicTypeKind.Lowercase,
  Capitalize: IntrinsicTypeKind.Capitalize,
  Uncapitalize: IntrinsicTypeKind.Uncapitalize
}));

function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
      case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
      case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
      case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
      case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}
```

你可以在[此处](https://raw.githubusercontent.com/microsoft/TypeScript/main/src/compiler/checker.ts)找到上述编译器源码的定义。

### 不可变类型（Immutable Types）

不可变类型是指一旦创建了该类型的值，就不能对其进行修改，这有助于防止由于意外副作用导致的错误。可以通过使用 `const` 和 `readonly` 关键字来实现。

`const` 断言是一种类型断言。使用 `const` 断言将导致 TypeScript 根据值结构为变量提供不可变类型。对于对象，`readonly` 修饰符以递归的方式应用于所有嵌套属性。`const` 断言是一种使对象或数组在编译时深度不可变的简便方法。

```typescript
let variableName = someValue as const;

const bill = {
  name: "Bill",
  profile: {
    level: 1,
  },
  scores: [90, 65, 80],
} as const;

// 等价于
// const bill = {
//   readonly name: "Bill";
//   readonly profile: {
//     readonly level: 1;
//   };
//   readonly scores: readonly [90, 65, 80];
// }

// Cannot assign to 'name' because it is a read-only property.
bill.name = "Bob";
// Cannot assign to 'level' because it is a read-only property.
bill.profile.level = 2;
// Property 'push' does not exist on type 'readonly [90, 65, 80]'
bill.scores.push(100);
```

`readonly` 用于声明对象的属性是只读的。这意味着一旦声明了 `readonly` 修饰符，就不能再对此属性进行赋值。这对于防止意外地修改对象的状态很有用。可以应用于类型别名和接口以及类属性。

```typescript
type TypeName = {
  readonly propertyName: PropertyType;
};

interface InterfaceName {
  readonly propertyName: PropertyType;
}

class ClassName {
  constructor(public readonly propertyName: PropertyType) {}
}
```

## 工具类型（**Utility Types**）

TypeScript 提供了很多内置的工具类型，它们可以帮助我们在编写代码时更有效地处理类型，以减少重复代码。

### Required

`Required<T>` 能将所有类型 `T` 中的可选属性变成必需的属性。它只适用于可选的属性，如果属性已经是必需的，则不会产生任何影响。

```typescript
/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

上述源码中，我们发现一个很有意思的用法 `-?`，就是将可选项代表的 `?` 去掉，从而让这个类型变成必选项。与之对应的还有个 `+?`，用来把属性变成可选项，`+` 是默认的前缀。

```typescript
interface IOrganization {
  name?: string;
  age?: number;
}

const organization: Required<IOrganization> = {
  name: 'zcy',
  age: 6,
};
```

上述例子中，我们定义了一个 `IOrganization` 接口，它有两个可选属性：`name` 和 `age`。通过使用 `Required<IOrganization>`，我们能够将它们变成必需的属性。

### Readonly

```typescript
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

`Readonly<T>` 能将所有类型 `T` 中的可变属性变成只读属性。它仅对可变的属性有效，如果属性已经是只读的，则不会产生任何影响。

```typescript
interface IOrganization {
  name?: string;
  age?: number;
}

const organization: Readonly<IOrganization> = {
  name: 'zcy',
  age: 6,
};

organization.name = 'lcy'; // Error: Cannot assign to 'name' because it is a read-only property.
```

在上述例子中，我们定义了一个 `IOrganization` 接口，它有两个可变属性：`name` 和 `age`。通过使用 `Readonly<IOrganization>`，我们能够将它们变成只读属性。

### Record

`Record<K, T>` 能够用于创建一个以键为类型的映射表，其中键类型必须是字符串或数字，这是因为它们是唯一的。

```typescript
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

它会将 `K` 中所有属性的值转化为 `T` 类型。

```typescript
interface IOrganization {
  name: string;
  age: number;
}

const organization: Record<string, IOrganization> = {
  'zc': { name: 'zcy', age: 6 },
  'lc': { name: 'lcy', age: 1 }
};
```

在上述例子中，我们定义了一个 `IOrganization` 接口，然后使用 `Record<string, IOrganization>` 创建了一个 `organization` 对象。它是一个字符串键和 `IOrganization` 值的映射，能够存储多个组织的信息。

### Exclude

在 TypeScript 2.8 中引入了一个条件类型，示例如下：

```typescript
T extends U ? X : Y
```

以上语句的意思是如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否则返回 `Y`。

对于联合类型来说会自动分发条件，例如 `T extends U ? X : Y`，`T` 可能是 `A | B` 的联合类型，那实际情况就变成 `(A extends U ? X : Y) | (B extends U ? X : Y)` 。

有了以上的了解我们再来理解下面的工具泛型：

```typescript
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```

示例：

```typescript
type NumberOrString = number | string;
type OnlyNumbers = Exclude<NumberOrString, string>;

const onlyNumbers: OnlyNumbers = 42;
```

根据源码和示例我们可以推断出 `Exclude` 的作用是从 `T` 中找出 `U` 中没有的元素，换种更加贴近语义的说法其实就是从类型 `T` 中排除类型 `U` 。

### Extract

源码：

```typescript
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```

如果类型 `U` 不是类型 `T` 的子类型，则将导致编译错误。

示例：

```typescript
type NumberOrString = number | string;
type OnlyStrings = Extract<NumberOrString, string>;

const onlyStrings: OnlyStrings = 'Hello, world!';
```

根据源码我们推断出 `Extract` 的作用是提取出 `T` 包含在 `U` 中的元素，换种更加贴近语义的说法就是从类型 `T` 中提取出类型 `U` 。

### Pick

`Pick<T, K>` 能够从类型 `T` 中选择一组键，并创建一个新的类型。

```typescript
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

它从 `T` 中取出一系列 `K` 的属性。其中 `K` 的属性必须存在于 `T` 中。`K extends keyof T` 表示 `K` 受到 `keyof T` 的约束，即 `K` 的属性必须是 `keyof T` 的子集。

```typescript
interface IOrganization {
  name: string;
  age: number;
  location: string;
}

type OrganizationInfo = Pick<IOrganization, 'name' | 'age'>;

const organization: OrganizationInfo = {
  name: 'zcy',
  age: 6,
};
```

### Omit

用之前的 `Pick` 和 `Exclude` 进行组合，实现忽略对象某些属性的功能。

```typescript
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

删除的键必须是类型 `T` 中的属性，否则将导致编译错误。

示例：

```typescript
interface IOrganization {
  name: string;
  age: number;
  location: string;
}

type OrganizationWithoutLocation = Omit<IOrganization, 'location'>;

const organizationWithoutLocation: OrganizationWithoutLocation = {
  name: 'zcy',
  age: 6
};
```

### Partial

`Partial<T>` 能够将类型 `T` 中的所有属性都变为可选的，并创建一个新的类型。

```typescript
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

`keyof T` 拿到 `T` 所有属性名，然后 `in` 进行遍历，将值赋给 `P`，最后 `T[P]` 取得相应属性的值。

示例：

```typescript
interface IOrganization {
  name: string;
  age: number;
  location: string;
}

type PartialOrganization = Partial<IOrganization>;

const partialOrganization: PartialOrganization = {};
```

### ReturnType

`ReturnType<T>` 能够从函数类型 `T` 中提取返回类型，并创建一个新的类型。

```typescript
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

试图推断返回值，并返回推断类型或 `any` 。

```typescript
function getName(): string {
  return 'zcy';
}

type Name = ReturnType<typeof getName>;

const name: Name = 'zcy';
```

# 在 React 中使用 TypeScript

在这个部分，我们将探讨下如何在 React 项目中使用 TypeScript。

## 定义组件 Props 类型

在 React 项目中，最常用的场景是定义组件的 `props` 类型。通过声明组件的 `props` 类型，能够为我们带来：

- 在消费组件时进行参数合法性校验。不需要查看源码查询支持的 `props` 参数以及类型
- 更好的组件自解释和 IDE 支持

```typescript
import { FC } from 'react';

interface IFunctionComponentProps {
  name: string;
  age: number;
	location?: string;
};

const FunctionComponent: FC<IFunctionComponentProps> = (props) => {
  const { name, age, location } = props;
}

export default FunctionComponent;
```

## 移除 `children` 类型定义

在 React 17.x 版本之前，`React.FC` 和 `React.FunctionComponent` 为我们隐式定义了 `children` 属性，即便我们可能并不需要消费 `children` 这个 prop。

```typescript
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };

type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

当我们升级到 React 18.x 版本后，旧项目在使用 `React.FC` 定义的组件中将得到 `Property 'children' does not exist on type 'IXXXProps'.` 类型错误提示。这是因为在 React 18.x 版本中，React 团队认为 `children` 只是一个常规 prop，并不是什么特别的东西，默认移除了 `children` 这个 prop，因此我们需要像定义其他 props 一样去显式定义它。相关的讨论可在此常看：[React 18 TypeScript children FC](https://stackoverflow.com/questions/71788254/react-18-typescript-children-fc)。

```typescript
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

## 常见的 Hooks 类型

接下来我们看一下如何在 React 中编写一些常用的 hook。

### useState

`useState` 是一个用于在函数组件中添加状态的 hook，它返回一个包含当前状态和更新状态的数组。其类型定义如下：

```typescript
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
```

`useState` 接收一个泛型类型 `S`，该类型是状态的类型。它需要传递一个初始状态 `initialState`，可以是一个静态的初始状态值或一个函数，该函数返回初始状态。

大多数情况下，`useState` 不需要显式指定状态类型，TypeScript 会自动进行类型推断。但是如果初始值和未来值不同则需要特别声明。

```typescript
export default function List() {
  const [data, setData] = useState<IData | null>(null);
  const [num, setNum] = useState(1);
}
```

上述示例中，如果 data 没有初始值，则为 `null`，其最终会被赋值 `IData` 类型的值，所以必须显式地将 data 的类型指定为这两种可能类型的集合。而 num 可以根据初始值推断为 `number` 类型，setNum 也会推断为 `Dispatch<SetStateAction<number>>`。

### useMemo

`useMemo` 是一个用于性能优化的 hook，它可以帮助避免在渲染时不必要地计算昂贵的计算结果。其类型定义如下：

```typescript
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
```

从源码类型定义可以看出，`useMemo` 接收一个泛型类型 `T`，该类型是由工厂函数 `factory` 计算出来的值的类型。

### useCallback

`useCallback` 是一个用于性能优化的 hook，它可以帮助避免在渲染时不必要地创建新函数。其类型定义如下：

```typescript
function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
```

`useCallback` 接收一个泛型函数类型 `T`，返回一个与传入的回调函数相同类型的函数。

### useRef

`useRef` 是一个用于在函数组件中存储可变值的 hook，它返回一个可变的 `ref` 对象，该对象包含一个 `current` 属性，可以用来存储和访问值。其类型定义如下：

```typescript
function useRef<T>(initialValue: T): MutableRefObject<T>;

interface MutableRefObject<T> {
  current: T;
}
```

`useRef` 接收一个泛型类型 `T`，该类型是 `ref` 对象 `current` 属性存储的值的类型。返回的 `ref` 对象的类型是 `MutableRefObject<T>`，它是一个包含 `current` 属性的对象。该属性可以被修改而不会触发组件重新渲染。

```typescript
import { useRef, useEffect } from 'react';

function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return <input type="text" ref={inputRef} />;
}
```

在上述例子中，`MyComponent` 组件使用 `useRef` hook 来创建一个 `inputRef` 引用，它的类型是 `HTMLInputElement | null`。`useEffect` hook 在组件挂载后运行一次，它使用 `inputRef.current` 检查引用是否存在，如果存在则调用 `focus()` 方法以聚焦输入元素。

# 总结

本文介绍了 TypeScript 的基本概念和高级语法，以及如何在项目中使用它来提高生产力。通过类型定义来指定变量、函数、对象等的类型，从而在编译时就能检测出潜在的风险，减少在运行时才能发现的问题。TypeScript 的高级语言特性使得代码的组织和重构更加方便，帮助开发者编写更加健壮、可维护的 JavaScript 代码，从而提高开发效率。

# 参考链接

[The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[Learn TypeScript](https://learntypescript.dev/)

[TypeScript for React Developers – Why TypeScript is Useful and How it Works](https://www.freecodecamp.org/news/typescript-for-react-developers/)

[typescript中intrinsic代表什么](https://segmentfault.com/q/1010000040197076/a-1020000040198712)
