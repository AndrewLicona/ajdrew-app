/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Usuario
 *
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>;
/**
 * Model Juego
 *
 */
export type Juego = $Result.DefaultSelection<Prisma.$JuegoPayload>;
/**
 * Model Categoria
 *
 */
export type Categoria = $Result.DefaultSelection<Prisma.$CategoriaPayload>;
/**
 * Model ItemCalificable
 *
 */
export type ItemCalificable =
  $Result.DefaultSelection<Prisma.$ItemCalificablePayload>;
/**
 * Model Calificacion
 *
 */
export type Calificacion =
  $Result.DefaultSelection<Prisma.$CalificacionPayload>;
/**
 * Model VotacionBracket
 *
 */
export type VotacionBracket =
  $Result.DefaultSelection<Prisma.$VotacionBracketPayload>;
/**
 * Model BracketMatch
 *
 */
export type BracketMatch =
  $Result.DefaultSelection<Prisma.$BracketMatchPayload>;
/**
 * Model Sorteo
 *
 */
export type Sorteo = $Result.DefaultSelection<Prisma.$SorteoPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const Rol: {
    ADMIN: 'ADMIN';
    EDITOR: 'EDITOR';
  };

  export type Rol = (typeof Rol)[keyof typeof Rol];
}

export type Rol = $Enums.Rol;

export const Rol: typeof $Enums.Rol;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent,
    ) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.juego`: Exposes CRUD operations for the **Juego** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Juegos
   * const juegos = await prisma.juego.findMany()
   * ```
   */
  get juego(): Prisma.JuegoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categoria`: Exposes CRUD operations for the **Categoria** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Categorias
   * const categorias = await prisma.categoria.findMany()
   * ```
   */
  get categoria(): Prisma.CategoriaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itemCalificable`: Exposes CRUD operations for the **ItemCalificable** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ItemCalificables
   * const itemCalificables = await prisma.itemCalificable.findMany()
   * ```
   */
  get itemCalificable(): Prisma.ItemCalificableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.calificacion`: Exposes CRUD operations for the **Calificacion** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Calificacions
   * const calificacions = await prisma.calificacion.findMany()
   * ```
   */
  get calificacion(): Prisma.CalificacionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.votacionBracket`: Exposes CRUD operations for the **VotacionBracket** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more VotacionBrackets
   * const votacionBrackets = await prisma.votacionBracket.findMany()
   * ```
   */
  get votacionBracket(): Prisma.VotacionBracketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bracketMatch`: Exposes CRUD operations for the **BracketMatch** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BracketMatches
   * const bracketMatches = await prisma.bracketMatch.findMany()
   * ```
   */
  get bracketMatch(): Prisma.BracketMatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sorteo`: Exposes CRUD operations for the **Sorteo** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Sorteos
   * const sorteos = await prisma.sorteo.findMany()
   * ```
   */
  get sorteo(): Prisma.SorteoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends bigint
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Usuario: 'Usuario';
    Juego: 'Juego';
    Categoria: 'Categoria';
    ItemCalificable: 'ItemCalificable';
    Calificacion: 'Calificacion';
    VotacionBracket: 'VotacionBracket';
    BracketMatch: 'BracketMatch';
    Sorteo: 'Sorteo';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'usuario'
        | 'juego'
        | 'categoria'
        | 'itemCalificable'
        | 'calificacion'
        | 'votacionBracket'
        | 'bracketMatch'
        | 'sorteo';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>;
        fields: Prisma.UsuarioFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>;
          };
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>;
          };
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[];
          };
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>;
          };
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[];
          };
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>;
          };
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>;
          };
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[];
          };
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>;
          };
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUsuario>;
          };
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UsuarioGroupByOutputType>[];
          };
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>;
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number;
          };
        };
      };
      Juego: {
        payload: Prisma.$JuegoPayload<ExtArgs>;
        fields: Prisma.JuegoFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.JuegoFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.JuegoFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>;
          };
          findFirst: {
            args: Prisma.JuegoFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.JuegoFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>;
          };
          findMany: {
            args: Prisma.JuegoFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>[];
          };
          create: {
            args: Prisma.JuegoCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>;
          };
          createMany: {
            args: Prisma.JuegoCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.JuegoCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>[];
          };
          delete: {
            args: Prisma.JuegoDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>;
          };
          update: {
            args: Prisma.JuegoUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>;
          };
          deleteMany: {
            args: Prisma.JuegoDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.JuegoUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.JuegoUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>[];
          };
          upsert: {
            args: Prisma.JuegoUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$JuegoPayload>;
          };
          aggregate: {
            args: Prisma.JuegoAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateJuego>;
          };
          groupBy: {
            args: Prisma.JuegoGroupByArgs<ExtArgs>;
            result: $Utils.Optional<JuegoGroupByOutputType>[];
          };
          count: {
            args: Prisma.JuegoCountArgs<ExtArgs>;
            result: $Utils.Optional<JuegoCountAggregateOutputType> | number;
          };
        };
      };
      Categoria: {
        payload: Prisma.$CategoriaPayload<ExtArgs>;
        fields: Prisma.CategoriaFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CategoriaFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CategoriaFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>;
          };
          findFirst: {
            args: Prisma.CategoriaFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CategoriaFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>;
          };
          findMany: {
            args: Prisma.CategoriaFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[];
          };
          create: {
            args: Prisma.CategoriaCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>;
          };
          createMany: {
            args: Prisma.CategoriaCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CategoriaCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[];
          };
          delete: {
            args: Prisma.CategoriaDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>;
          };
          update: {
            args: Prisma.CategoriaUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>;
          };
          deleteMany: {
            args: Prisma.CategoriaDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CategoriaUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CategoriaUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[];
          };
          upsert: {
            args: Prisma.CategoriaUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>;
          };
          aggregate: {
            args: Prisma.CategoriaAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCategoria>;
          };
          groupBy: {
            args: Prisma.CategoriaGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CategoriaGroupByOutputType>[];
          };
          count: {
            args: Prisma.CategoriaCountArgs<ExtArgs>;
            result: $Utils.Optional<CategoriaCountAggregateOutputType> | number;
          };
        };
      };
      ItemCalificable: {
        payload: Prisma.$ItemCalificablePayload<ExtArgs>;
        fields: Prisma.ItemCalificableFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ItemCalificableFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ItemCalificableFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>;
          };
          findFirst: {
            args: Prisma.ItemCalificableFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ItemCalificableFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>;
          };
          findMany: {
            args: Prisma.ItemCalificableFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>[];
          };
          create: {
            args: Prisma.ItemCalificableCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>;
          };
          createMany: {
            args: Prisma.ItemCalificableCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ItemCalificableCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>[];
          };
          delete: {
            args: Prisma.ItemCalificableDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>;
          };
          update: {
            args: Prisma.ItemCalificableUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>;
          };
          deleteMany: {
            args: Prisma.ItemCalificableDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ItemCalificableUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ItemCalificableUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>[];
          };
          upsert: {
            args: Prisma.ItemCalificableUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ItemCalificablePayload>;
          };
          aggregate: {
            args: Prisma.ItemCalificableAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateItemCalificable>;
          };
          groupBy: {
            args: Prisma.ItemCalificableGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ItemCalificableGroupByOutputType>[];
          };
          count: {
            args: Prisma.ItemCalificableCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<ItemCalificableCountAggregateOutputType>
              | number;
          };
        };
      };
      Calificacion: {
        payload: Prisma.$CalificacionPayload<ExtArgs>;
        fields: Prisma.CalificacionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CalificacionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CalificacionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>;
          };
          findFirst: {
            args: Prisma.CalificacionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CalificacionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>;
          };
          findMany: {
            args: Prisma.CalificacionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>[];
          };
          create: {
            args: Prisma.CalificacionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>;
          };
          createMany: {
            args: Prisma.CalificacionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CalificacionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>[];
          };
          delete: {
            args: Prisma.CalificacionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>;
          };
          update: {
            args: Prisma.CalificacionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>;
          };
          deleteMany: {
            args: Prisma.CalificacionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CalificacionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CalificacionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>[];
          };
          upsert: {
            args: Prisma.CalificacionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>;
          };
          aggregate: {
            args: Prisma.CalificacionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCalificacion>;
          };
          groupBy: {
            args: Prisma.CalificacionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CalificacionGroupByOutputType>[];
          };
          count: {
            args: Prisma.CalificacionCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<CalificacionCountAggregateOutputType>
              | number;
          };
        };
      };
      VotacionBracket: {
        payload: Prisma.$VotacionBracketPayload<ExtArgs>;
        fields: Prisma.VotacionBracketFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VotacionBracketFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VotacionBracketFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>;
          };
          findFirst: {
            args: Prisma.VotacionBracketFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VotacionBracketFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>;
          };
          findMany: {
            args: Prisma.VotacionBracketFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>[];
          };
          create: {
            args: Prisma.VotacionBracketCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>;
          };
          createMany: {
            args: Prisma.VotacionBracketCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VotacionBracketCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>[];
          };
          delete: {
            args: Prisma.VotacionBracketDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>;
          };
          update: {
            args: Prisma.VotacionBracketUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>;
          };
          deleteMany: {
            args: Prisma.VotacionBracketDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VotacionBracketUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.VotacionBracketUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>[];
          };
          upsert: {
            args: Prisma.VotacionBracketUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VotacionBracketPayload>;
          };
          aggregate: {
            args: Prisma.VotacionBracketAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVotacionBracket>;
          };
          groupBy: {
            args: Prisma.VotacionBracketGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VotacionBracketGroupByOutputType>[];
          };
          count: {
            args: Prisma.VotacionBracketCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<VotacionBracketCountAggregateOutputType>
              | number;
          };
        };
      };
      BracketMatch: {
        payload: Prisma.$BracketMatchPayload<ExtArgs>;
        fields: Prisma.BracketMatchFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.BracketMatchFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.BracketMatchFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>;
          };
          findFirst: {
            args: Prisma.BracketMatchFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.BracketMatchFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>;
          };
          findMany: {
            args: Prisma.BracketMatchFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>[];
          };
          create: {
            args: Prisma.BracketMatchCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>;
          };
          createMany: {
            args: Prisma.BracketMatchCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.BracketMatchCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>[];
          };
          delete: {
            args: Prisma.BracketMatchDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>;
          };
          update: {
            args: Prisma.BracketMatchUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>;
          };
          deleteMany: {
            args: Prisma.BracketMatchDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.BracketMatchUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.BracketMatchUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>[];
          };
          upsert: {
            args: Prisma.BracketMatchUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BracketMatchPayload>;
          };
          aggregate: {
            args: Prisma.BracketMatchAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateBracketMatch>;
          };
          groupBy: {
            args: Prisma.BracketMatchGroupByArgs<ExtArgs>;
            result: $Utils.Optional<BracketMatchGroupByOutputType>[];
          };
          count: {
            args: Prisma.BracketMatchCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<BracketMatchCountAggregateOutputType>
              | number;
          };
        };
      };
      Sorteo: {
        payload: Prisma.$SorteoPayload<ExtArgs>;
        fields: Prisma.SorteoFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SorteoFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SorteoFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>;
          };
          findFirst: {
            args: Prisma.SorteoFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SorteoFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>;
          };
          findMany: {
            args: Prisma.SorteoFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>[];
          };
          create: {
            args: Prisma.SorteoCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>;
          };
          createMany: {
            args: Prisma.SorteoCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.SorteoCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>[];
          };
          delete: {
            args: Prisma.SorteoDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>;
          };
          update: {
            args: Prisma.SorteoUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>;
          };
          deleteMany: {
            args: Prisma.SorteoDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.SorteoUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.SorteoUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>[];
          };
          upsert: {
            args: Prisma.SorteoUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SorteoPayload>;
          };
          aggregate: {
            args: Prisma.SorteoAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSorteo>;
          };
          groupBy: {
            args: Prisma.SorteoGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SorteoGroupByOutputType>[];
          };
          count: {
            args: Prisma.SorteoCountArgs<ExtArgs>;
            result: $Utils.Optional<SorteoCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    usuario?: UsuarioOmit;
    juego?: JuegoOmit;
    categoria?: CategoriaOmit;
    itemCalificable?: ItemCalificableOmit;
    calificacion?: CalificacionOmit;
    votacionBracket?: VotacionBracketOmit;
    bracketMatch?: BracketMatchOmit;
    sorteo?: SorteoOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type JuegoCountOutputType
   */

  export type JuegoCountOutputType = {
    categorias: number;
    votaciones: number;
    sorteos: number;
  };

  export type JuegoCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    categorias?: boolean | JuegoCountOutputTypeCountCategoriasArgs;
    votaciones?: boolean | JuegoCountOutputTypeCountVotacionesArgs;
    sorteos?: boolean | JuegoCountOutputTypeCountSorteosArgs;
  };

  // Custom InputTypes
  /**
   * JuegoCountOutputType without action
   */
  export type JuegoCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the JuegoCountOutputType
     */
    select?: JuegoCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * JuegoCountOutputType without action
   */
  export type JuegoCountOutputTypeCountCategoriasArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoriaWhereInput;
  };

  /**
   * JuegoCountOutputType without action
   */
  export type JuegoCountOutputTypeCountVotacionesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VotacionBracketWhereInput;
  };

  /**
   * JuegoCountOutputType without action
   */
  export type JuegoCountOutputTypeCountSorteosArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SorteoWhereInput;
  };

  /**
   * Count Type CategoriaCountOutputType
   */

  export type CategoriaCountOutputType = {
    items: number;
  };

  export type CategoriaCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | CategoriaCountOutputTypeCountItemsArgs;
  };

  // Custom InputTypes
  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CategoriaCountOutputType
     */
    select?: CategoriaCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeCountItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ItemCalificableWhereInput;
  };

  /**
   * Count Type ItemCalificableCountOutputType
   */

  export type ItemCalificableCountOutputType = {
    calificaciones: number;
    matchesSideA: number;
    matchesSideB: number;
    matchesWon: number;
  };

  export type ItemCalificableCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    calificaciones?:
      | boolean
      | ItemCalificableCountOutputTypeCountCalificacionesArgs;
    matchesSideA?:
      | boolean
      | ItemCalificableCountOutputTypeCountMatchesSideAArgs;
    matchesSideB?:
      | boolean
      | ItemCalificableCountOutputTypeCountMatchesSideBArgs;
    matchesWon?: boolean | ItemCalificableCountOutputTypeCountMatchesWonArgs;
  };

  // Custom InputTypes
  /**
   * ItemCalificableCountOutputType without action
   */
  export type ItemCalificableCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificableCountOutputType
     */
    select?: ItemCalificableCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ItemCalificableCountOutputType without action
   */
  export type ItemCalificableCountOutputTypeCountCalificacionesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CalificacionWhereInput;
  };

  /**
   * ItemCalificableCountOutputType without action
   */
  export type ItemCalificableCountOutputTypeCountMatchesSideAArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BracketMatchWhereInput;
  };

  /**
   * ItemCalificableCountOutputType without action
   */
  export type ItemCalificableCountOutputTypeCountMatchesSideBArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BracketMatchWhereInput;
  };

  /**
   * ItemCalificableCountOutputType without action
   */
  export type ItemCalificableCountOutputTypeCountMatchesWonArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BracketMatchWhereInput;
  };

  /**
   * Count Type VotacionBracketCountOutputType
   */

  export type VotacionBracketCountOutputType = {
    matches: number;
  };

  export type VotacionBracketCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    matches?: boolean | VotacionBracketCountOutputTypeCountMatchesArgs;
  };

  // Custom InputTypes
  /**
   * VotacionBracketCountOutputType without action
   */
  export type VotacionBracketCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracketCountOutputType
     */
    select?: VotacionBracketCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * VotacionBracketCountOutputType without action
   */
  export type VotacionBracketCountOutputTypeCountMatchesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BracketMatchWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null;
    _min: UsuarioMinAggregateOutputType | null;
    _max: UsuarioMaxAggregateOutputType | null;
  };

  export type UsuarioMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    nombre: string | null;
    rol: $Enums.Rol | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UsuarioMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    nombre: string | null;
    rol: $Enums.Rol | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UsuarioCountAggregateOutputType = {
    id: number;
    email: number;
    password: number;
    nombre: number;
    rol: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type UsuarioMinAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    nombre?: true;
    rol?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UsuarioMaxAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    nombre?: true;
    rol?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UsuarioCountAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    nombre?: true;
    rol?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type UsuarioAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Usuarios to fetch.
     */
    orderBy?:
      | UsuarioOrderByWithRelationInput
      | UsuarioOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Usuarios.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Usuarios
     **/
    _count?: true | UsuarioCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UsuarioMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UsuarioMaxAggregateInputType;
  };

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
    [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>;
  };

  export type UsuarioGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UsuarioWhereInput;
    orderBy?:
      | UsuarioOrderByWithAggregationInput
      | UsuarioOrderByWithAggregationInput[];
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum;
    having?: UsuarioScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsuarioCountAggregateInputType | true;
    _min?: UsuarioMinAggregateInputType;
    _max?: UsuarioMaxAggregateInputType;
  };

  export type UsuarioGroupByOutputType = {
    id: string;
    email: string;
    password: string;
    nombre: string;
    rol: $Enums.Rol;
    createdAt: Date;
    updatedAt: Date;
    _count: UsuarioCountAggregateOutputType | null;
    _min: UsuarioMinAggregateOutputType | null;
    _max: UsuarioMaxAggregateOutputType | null;
  };

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<UsuarioGroupByOutputType, T['by']> & {
          [P in keyof T & keyof UsuarioGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>;
        }
      >
    >;

  export type UsuarioSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      nombre?: boolean;
      rol?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['usuario']
  >;

  export type UsuarioSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      nombre?: boolean;
      rol?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['usuario']
  >;

  export type UsuarioSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      nombre?: boolean;
      rol?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['usuario']
  >;

  export type UsuarioSelectScalar = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    nombre?: boolean;
    rol?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type UsuarioOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'email' | 'password' | 'nombre' | 'rol' | 'createdAt' | 'updatedAt',
    ExtArgs['result']['usuario']
  >;

  export type $UsuarioPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Usuario';
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        password: string;
        nombre: string;
        rol: $Enums.Rol;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['usuario']
    >;
    composites: {};
  };

  type UsuarioGetPayload<
    S extends boolean | null | undefined | UsuarioDefaultArgs,
  > = $Result.GetResult<Prisma.$UsuarioPayload, S>;

  type UsuarioCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UsuarioCountAggregateInputType | true;
  };

  export interface UsuarioDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Usuario'];
      meta: { name: 'Usuario' };
    };
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(
      args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(
      args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     *
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UsuarioFindManyArgs>(
      args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     *
     */
    create<T extends UsuarioCreateArgs>(
      args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UsuarioCreateManyArgs>(
      args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     *
     */
    delete<T extends UsuarioDeleteArgs>(
      args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UsuarioUpdateArgs>(
      args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(
      args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UsuarioUpdateManyArgs>(
      args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(
      args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>,
    ): Prisma__UsuarioClient<
      $Result.GetResult<
        Prisma.$UsuarioPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
     **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UsuarioAggregateArgs>(
      args: Subset<T, UsuarioAggregateArgs>,
    ): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>;

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetUsuarioGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Usuario model
     */
    readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<'Usuario', 'String'>;
    readonly email: FieldRef<'Usuario', 'String'>;
    readonly password: FieldRef<'Usuario', 'String'>;
    readonly nombre: FieldRef<'Usuario', 'String'>;
    readonly rol: FieldRef<'Usuario', 'Rol'>;
    readonly createdAt: FieldRef<'Usuario', 'DateTime'>;
    readonly updatedAt: FieldRef<'Usuario', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput;
  };

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput;
  };

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Usuarios to fetch.
     */
    orderBy?:
      | UsuarioOrderByWithRelationInput
      | UsuarioOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Usuarios.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[];
  };

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Usuarios to fetch.
     */
    orderBy?:
      | UsuarioOrderByWithRelationInput
      | UsuarioOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Usuarios.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[];
  };

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Usuarios to fetch.
     */
    orderBy?:
      | UsuarioOrderByWithRelationInput
      | UsuarioOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Usuarios.
     */
    skip?: number;
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[];
  };

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>;
  };

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>;
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput;
  };

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>;
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput;
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number;
  };

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>;
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput;
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number;
  };

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput;
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>;
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>;
  };

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput;
  };

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput;
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number;
  };

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null;
  };

  /**
   * Model Juego
   */

  export type AggregateJuego = {
    _count: JuegoCountAggregateOutputType | null;
    _min: JuegoMinAggregateOutputType | null;
    _max: JuegoMaxAggregateOutputType | null;
  };

  export type JuegoMinAggregateOutputType = {
    id: string | null;
    nombre: string | null;
    slug: string | null;
    descripcion: string | null;
    image: string | null;
    activo: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type JuegoMaxAggregateOutputType = {
    id: string | null;
    nombre: string | null;
    slug: string | null;
    descripcion: string | null;
    image: string | null;
    activo: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type JuegoCountAggregateOutputType = {
    id: number;
    nombre: number;
    slug: number;
    descripcion: number;
    image: number;
    activo: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type JuegoMinAggregateInputType = {
    id?: true;
    nombre?: true;
    slug?: true;
    descripcion?: true;
    image?: true;
    activo?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type JuegoMaxAggregateInputType = {
    id?: true;
    nombre?: true;
    slug?: true;
    descripcion?: true;
    image?: true;
    activo?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type JuegoCountAggregateInputType = {
    id?: true;
    nombre?: true;
    slug?: true;
    descripcion?: true;
    image?: true;
    activo?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type JuegoAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Juego to aggregate.
     */
    where?: JuegoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Juegos to fetch.
     */
    orderBy?: JuegoOrderByWithRelationInput | JuegoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: JuegoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Juegos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Juegos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Juegos
     **/
    _count?: true | JuegoCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: JuegoMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: JuegoMaxAggregateInputType;
  };

  export type GetJuegoAggregateType<T extends JuegoAggregateArgs> = {
    [P in keyof T & keyof AggregateJuego]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJuego[P]>
      : GetScalarType<T[P], AggregateJuego[P]>;
  };

  export type JuegoGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: JuegoWhereInput;
    orderBy?:
      | JuegoOrderByWithAggregationInput
      | JuegoOrderByWithAggregationInput[];
    by: JuegoScalarFieldEnum[] | JuegoScalarFieldEnum;
    having?: JuegoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: JuegoCountAggregateInputType | true;
    _min?: JuegoMinAggregateInputType;
    _max?: JuegoMaxAggregateInputType;
  };

  export type JuegoGroupByOutputType = {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string | null;
    image: string | null;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: JuegoCountAggregateOutputType | null;
    _min: JuegoMinAggregateOutputType | null;
    _max: JuegoMaxAggregateOutputType | null;
  };

  type GetJuegoGroupByPayload<T extends JuegoGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<JuegoGroupByOutputType, T['by']> & {
          [P in keyof T & keyof JuegoGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JuegoGroupByOutputType[P]>
            : GetScalarType<T[P], JuegoGroupByOutputType[P]>;
        }
      >
    >;

  export type JuegoSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      slug?: boolean;
      descripcion?: boolean;
      image?: boolean;
      activo?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      categorias?: boolean | Juego$categoriasArgs<ExtArgs>;
      votaciones?: boolean | Juego$votacionesArgs<ExtArgs>;
      sorteos?: boolean | Juego$sorteosArgs<ExtArgs>;
      _count?: boolean | JuegoCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['juego']
  >;

  export type JuegoSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      slug?: boolean;
      descripcion?: boolean;
      image?: boolean;
      activo?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['juego']
  >;

  export type JuegoSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      slug?: boolean;
      descripcion?: boolean;
      image?: boolean;
      activo?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['juego']
  >;

  export type JuegoSelectScalar = {
    id?: boolean;
    nombre?: boolean;
    slug?: boolean;
    descripcion?: boolean;
    image?: boolean;
    activo?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type JuegoOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'nombre'
    | 'slug'
    | 'descripcion'
    | 'image'
    | 'activo'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['juego']
  >;
  export type JuegoInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    categorias?: boolean | Juego$categoriasArgs<ExtArgs>;
    votaciones?: boolean | Juego$votacionesArgs<ExtArgs>;
    sorteos?: boolean | Juego$sorteosArgs<ExtArgs>;
    _count?: boolean | JuegoCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type JuegoIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type JuegoIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $JuegoPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Juego';
    objects: {
      categorias: Prisma.$CategoriaPayload<ExtArgs>[];
      votaciones: Prisma.$VotacionBracketPayload<ExtArgs>[];
      sorteos: Prisma.$SorteoPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        nombre: string;
        slug: string;
        descripcion: string | null;
        image: string | null;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['juego']
    >;
    composites: {};
  };

  type JuegoGetPayload<
    S extends boolean | null | undefined | JuegoDefaultArgs,
  > = $Result.GetResult<Prisma.$JuegoPayload, S>;

  type JuegoCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<JuegoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: JuegoCountAggregateInputType | true;
  };

  export interface JuegoDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Juego'];
      meta: { name: 'Juego' };
    };
    /**
     * Find zero or one Juego that matches the filter.
     * @param {JuegoFindUniqueArgs} args - Arguments to find a Juego
     * @example
     * // Get one Juego
     * const juego = await prisma.juego.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JuegoFindUniqueArgs>(
      args: SelectSubset<T, JuegoFindUniqueArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Juego that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JuegoFindUniqueOrThrowArgs} args - Arguments to find a Juego
     * @example
     * // Get one Juego
     * const juego = await prisma.juego.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JuegoFindUniqueOrThrowArgs>(
      args: SelectSubset<T, JuegoFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Juego that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoFindFirstArgs} args - Arguments to find a Juego
     * @example
     * // Get one Juego
     * const juego = await prisma.juego.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JuegoFindFirstArgs>(
      args?: SelectSubset<T, JuegoFindFirstArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Juego that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoFindFirstOrThrowArgs} args - Arguments to find a Juego
     * @example
     * // Get one Juego
     * const juego = await prisma.juego.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JuegoFindFirstOrThrowArgs>(
      args?: SelectSubset<T, JuegoFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Juegos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Juegos
     * const juegos = await prisma.juego.findMany()
     *
     * // Get first 10 Juegos
     * const juegos = await prisma.juego.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const juegoWithIdOnly = await prisma.juego.findMany({ select: { id: true } })
     *
     */
    findMany<T extends JuegoFindManyArgs>(
      args?: SelectSubset<T, JuegoFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Juego.
     * @param {JuegoCreateArgs} args - Arguments to create a Juego.
     * @example
     * // Create one Juego
     * const Juego = await prisma.juego.create({
     *   data: {
     *     // ... data to create a Juego
     *   }
     * })
     *
     */
    create<T extends JuegoCreateArgs>(
      args: SelectSubset<T, JuegoCreateArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Juegos.
     * @param {JuegoCreateManyArgs} args - Arguments to create many Juegos.
     * @example
     * // Create many Juegos
     * const juego = await prisma.juego.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends JuegoCreateManyArgs>(
      args?: SelectSubset<T, JuegoCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Juegos and returns the data saved in the database.
     * @param {JuegoCreateManyAndReturnArgs} args - Arguments to create many Juegos.
     * @example
     * // Create many Juegos
     * const juego = await prisma.juego.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Juegos and only return the `id`
     * const juegoWithIdOnly = await prisma.juego.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends JuegoCreateManyAndReturnArgs>(
      args?: SelectSubset<T, JuegoCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Juego.
     * @param {JuegoDeleteArgs} args - Arguments to delete one Juego.
     * @example
     * // Delete one Juego
     * const Juego = await prisma.juego.delete({
     *   where: {
     *     // ... filter to delete one Juego
     *   }
     * })
     *
     */
    delete<T extends JuegoDeleteArgs>(
      args: SelectSubset<T, JuegoDeleteArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Juego.
     * @param {JuegoUpdateArgs} args - Arguments to update one Juego.
     * @example
     * // Update one Juego
     * const juego = await prisma.juego.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends JuegoUpdateArgs>(
      args: SelectSubset<T, JuegoUpdateArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Juegos.
     * @param {JuegoDeleteManyArgs} args - Arguments to filter Juegos to delete.
     * @example
     * // Delete a few Juegos
     * const { count } = await prisma.juego.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends JuegoDeleteManyArgs>(
      args?: SelectSubset<T, JuegoDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Juegos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Juegos
     * const juego = await prisma.juego.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends JuegoUpdateManyArgs>(
      args: SelectSubset<T, JuegoUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Juegos and returns the data updated in the database.
     * @param {JuegoUpdateManyAndReturnArgs} args - Arguments to update many Juegos.
     * @example
     * // Update many Juegos
     * const juego = await prisma.juego.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Juegos and only return the `id`
     * const juegoWithIdOnly = await prisma.juego.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends JuegoUpdateManyAndReturnArgs>(
      args: SelectSubset<T, JuegoUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Juego.
     * @param {JuegoUpsertArgs} args - Arguments to update or create a Juego.
     * @example
     * // Update or create a Juego
     * const juego = await prisma.juego.upsert({
     *   create: {
     *     // ... data to create a Juego
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Juego we want to update
     *   }
     * })
     */
    upsert<T extends JuegoUpsertArgs>(
      args: SelectSubset<T, JuegoUpsertArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Juegos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoCountArgs} args - Arguments to filter Juegos to count.
     * @example
     * // Count the number of Juegos
     * const count = await prisma.juego.count({
     *   where: {
     *     // ... the filter for the Juegos we want to count
     *   }
     * })
     **/
    count<T extends JuegoCountArgs>(
      args?: Subset<T, JuegoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JuegoCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Juego.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends JuegoAggregateArgs>(
      args: Subset<T, JuegoAggregateArgs>,
    ): Prisma.PrismaPromise<GetJuegoAggregateType<T>>;

    /**
     * Group by Juego.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuegoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends JuegoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JuegoGroupByArgs['orderBy'] }
        : { orderBy?: JuegoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, JuegoGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetJuegoGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Juego model
     */
    readonly fields: JuegoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Juego.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JuegoClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    categorias<T extends Juego$categoriasArgs<ExtArgs> = {}>(
      args?: Subset<T, Juego$categoriasArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$CategoriaPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    votaciones<T extends Juego$votacionesArgs<ExtArgs> = {}>(
      args?: Subset<T, Juego$votacionesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$VotacionBracketPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    sorteos<T extends Juego$sorteosArgs<ExtArgs> = {}>(
      args?: Subset<T, Juego$sorteosArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$SorteoPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Juego model
   */
  interface JuegoFieldRefs {
    readonly id: FieldRef<'Juego', 'String'>;
    readonly nombre: FieldRef<'Juego', 'String'>;
    readonly slug: FieldRef<'Juego', 'String'>;
    readonly descripcion: FieldRef<'Juego', 'String'>;
    readonly image: FieldRef<'Juego', 'String'>;
    readonly activo: FieldRef<'Juego', 'Boolean'>;
    readonly createdAt: FieldRef<'Juego', 'DateTime'>;
    readonly updatedAt: FieldRef<'Juego', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Juego findUnique
   */
  export type JuegoFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * Filter, which Juego to fetch.
     */
    where: JuegoWhereUniqueInput;
  };

  /**
   * Juego findUniqueOrThrow
   */
  export type JuegoFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * Filter, which Juego to fetch.
     */
    where: JuegoWhereUniqueInput;
  };

  /**
   * Juego findFirst
   */
  export type JuegoFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * Filter, which Juego to fetch.
     */
    where?: JuegoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Juegos to fetch.
     */
    orderBy?: JuegoOrderByWithRelationInput | JuegoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Juegos.
     */
    cursor?: JuegoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Juegos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Juegos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Juegos.
     */
    distinct?: JuegoScalarFieldEnum | JuegoScalarFieldEnum[];
  };

  /**
   * Juego findFirstOrThrow
   */
  export type JuegoFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * Filter, which Juego to fetch.
     */
    where?: JuegoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Juegos to fetch.
     */
    orderBy?: JuegoOrderByWithRelationInput | JuegoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Juegos.
     */
    cursor?: JuegoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Juegos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Juegos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Juegos.
     */
    distinct?: JuegoScalarFieldEnum | JuegoScalarFieldEnum[];
  };

  /**
   * Juego findMany
   */
  export type JuegoFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * Filter, which Juegos to fetch.
     */
    where?: JuegoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Juegos to fetch.
     */
    orderBy?: JuegoOrderByWithRelationInput | JuegoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Juegos.
     */
    cursor?: JuegoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Juegos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Juegos.
     */
    skip?: number;
    distinct?: JuegoScalarFieldEnum | JuegoScalarFieldEnum[];
  };

  /**
   * Juego create
   */
  export type JuegoCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * The data needed to create a Juego.
     */
    data: XOR<JuegoCreateInput, JuegoUncheckedCreateInput>;
  };

  /**
   * Juego createMany
   */
  export type JuegoCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Juegos.
     */
    data: JuegoCreateManyInput | JuegoCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Juego createManyAndReturn
   */
  export type JuegoCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * The data used to create many Juegos.
     */
    data: JuegoCreateManyInput | JuegoCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Juego update
   */
  export type JuegoUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * The data needed to update a Juego.
     */
    data: XOR<JuegoUpdateInput, JuegoUncheckedUpdateInput>;
    /**
     * Choose, which Juego to update.
     */
    where: JuegoWhereUniqueInput;
  };

  /**
   * Juego updateMany
   */
  export type JuegoUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Juegos.
     */
    data: XOR<JuegoUpdateManyMutationInput, JuegoUncheckedUpdateManyInput>;
    /**
     * Filter which Juegos to update
     */
    where?: JuegoWhereInput;
    /**
     * Limit how many Juegos to update.
     */
    limit?: number;
  };

  /**
   * Juego updateManyAndReturn
   */
  export type JuegoUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * The data used to update Juegos.
     */
    data: XOR<JuegoUpdateManyMutationInput, JuegoUncheckedUpdateManyInput>;
    /**
     * Filter which Juegos to update
     */
    where?: JuegoWhereInput;
    /**
     * Limit how many Juegos to update.
     */
    limit?: number;
  };

  /**
   * Juego upsert
   */
  export type JuegoUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * The filter to search for the Juego to update in case it exists.
     */
    where: JuegoWhereUniqueInput;
    /**
     * In case the Juego found by the `where` argument doesn't exist, create a new Juego with this data.
     */
    create: XOR<JuegoCreateInput, JuegoUncheckedCreateInput>;
    /**
     * In case the Juego was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JuegoUpdateInput, JuegoUncheckedUpdateInput>;
  };

  /**
   * Juego delete
   */
  export type JuegoDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    /**
     * Filter which Juego to delete.
     */
    where: JuegoWhereUniqueInput;
  };

  /**
   * Juego deleteMany
   */
  export type JuegoDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Juegos to delete
     */
    where?: JuegoWhereInput;
    /**
     * Limit how many Juegos to delete.
     */
    limit?: number;
  };

  /**
   * Juego.categorias
   */
  export type Juego$categoriasArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    where?: CategoriaWhereInput;
    orderBy?:
      | CategoriaOrderByWithRelationInput
      | CategoriaOrderByWithRelationInput[];
    cursor?: CategoriaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[];
  };

  /**
   * Juego.votaciones
   */
  export type Juego$votacionesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    where?: VotacionBracketWhereInput;
    orderBy?:
      | VotacionBracketOrderByWithRelationInput
      | VotacionBracketOrderByWithRelationInput[];
    cursor?: VotacionBracketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | VotacionBracketScalarFieldEnum
      | VotacionBracketScalarFieldEnum[];
  };

  /**
   * Juego.sorteos
   */
  export type Juego$sorteosArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    where?: SorteoWhereInput;
    orderBy?: SorteoOrderByWithRelationInput | SorteoOrderByWithRelationInput[];
    cursor?: SorteoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SorteoScalarFieldEnum | SorteoScalarFieldEnum[];
  };

  /**
   * Juego without action
   */
  export type JuegoDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
  };

  /**
   * Model Categoria
   */

  export type AggregateCategoria = {
    _count: CategoriaCountAggregateOutputType | null;
    _min: CategoriaMinAggregateOutputType | null;
    _max: CategoriaMaxAggregateOutputType | null;
  };

  export type CategoriaMinAggregateOutputType = {
    id: string | null;
    nombre: string | null;
    activa: boolean | null;
    tipo: string | null;
    juegoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CategoriaMaxAggregateOutputType = {
    id: string | null;
    nombre: string | null;
    activa: boolean | null;
    tipo: string | null;
    juegoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CategoriaCountAggregateOutputType = {
    id: number;
    nombre: number;
    activa: number;
    tipo: number;
    juegoId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type CategoriaMinAggregateInputType = {
    id?: true;
    nombre?: true;
    activa?: true;
    tipo?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CategoriaMaxAggregateInputType = {
    id?: true;
    nombre?: true;
    activa?: true;
    tipo?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CategoriaCountAggregateInputType = {
    id?: true;
    nombre?: true;
    activa?: true;
    tipo?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type CategoriaAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Categoria to aggregate.
     */
    where?: CategoriaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categorias to fetch.
     */
    orderBy?:
      | CategoriaOrderByWithRelationInput
      | CategoriaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CategoriaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categorias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Categorias
     **/
    _count?: true | CategoriaCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CategoriaMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CategoriaMaxAggregateInputType;
  };

  export type GetCategoriaAggregateType<T extends CategoriaAggregateArgs> = {
    [P in keyof T & keyof AggregateCategoria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoria[P]>
      : GetScalarType<T[P], AggregateCategoria[P]>;
  };

  export type CategoriaGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoriaWhereInput;
    orderBy?:
      | CategoriaOrderByWithAggregationInput
      | CategoriaOrderByWithAggregationInput[];
    by: CategoriaScalarFieldEnum[] | CategoriaScalarFieldEnum;
    having?: CategoriaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CategoriaCountAggregateInputType | true;
    _min?: CategoriaMinAggregateInputType;
    _max?: CategoriaMaxAggregateInputType;
  };

  export type CategoriaGroupByOutputType = {
    id: string;
    nombre: string;
    activa: boolean;
    tipo: string;
    juegoId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: CategoriaCountAggregateOutputType | null;
    _min: CategoriaMinAggregateOutputType | null;
    _max: CategoriaMaxAggregateOutputType | null;
  };

  type GetCategoriaGroupByPayload<T extends CategoriaGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CategoriaGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CategoriaGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoriaGroupByOutputType[P]>
            : GetScalarType<T[P], CategoriaGroupByOutputType[P]>;
        }
      >
    >;

  export type CategoriaSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      activa?: boolean;
      tipo?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      items?: boolean | Categoria$itemsArgs<ExtArgs>;
      juego?: boolean | Categoria$juegoArgs<ExtArgs>;
      _count?: boolean | CategoriaCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['categoria']
  >;

  export type CategoriaSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      activa?: boolean;
      tipo?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | Categoria$juegoArgs<ExtArgs>;
    },
    ExtArgs['result']['categoria']
  >;

  export type CategoriaSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      activa?: boolean;
      tipo?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | Categoria$juegoArgs<ExtArgs>;
    },
    ExtArgs['result']['categoria']
  >;

  export type CategoriaSelectScalar = {
    id?: boolean;
    nombre?: boolean;
    activa?: boolean;
    tipo?: boolean;
    juegoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type CategoriaOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'nombre' | 'activa' | 'tipo' | 'juegoId' | 'createdAt' | 'updatedAt',
    ExtArgs['result']['categoria']
  >;
  export type CategoriaInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | Categoria$itemsArgs<ExtArgs>;
    juego?: boolean | Categoria$juegoArgs<ExtArgs>;
    _count?: boolean | CategoriaCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type CategoriaIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | Categoria$juegoArgs<ExtArgs>;
  };
  export type CategoriaIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | Categoria$juegoArgs<ExtArgs>;
  };

  export type $CategoriaPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Categoria';
    objects: {
      items: Prisma.$ItemCalificablePayload<ExtArgs>[];
      juego: Prisma.$JuegoPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        nombre: string;
        activa: boolean;
        tipo: string;
        juegoId: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['categoria']
    >;
    composites: {};
  };

  type CategoriaGetPayload<
    S extends boolean | null | undefined | CategoriaDefaultArgs,
  > = $Result.GetResult<Prisma.$CategoriaPayload, S>;

  type CategoriaCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    CategoriaFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: CategoriaCountAggregateInputType | true;
  };

  export interface CategoriaDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Categoria'];
      meta: { name: 'Categoria' };
    };
    /**
     * Find zero or one Categoria that matches the filter.
     * @param {CategoriaFindUniqueArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoriaFindUniqueArgs>(
      args: SelectSubset<T, CategoriaFindUniqueArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Categoria that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoriaFindUniqueOrThrowArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoriaFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CategoriaFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Categoria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindFirstArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoriaFindFirstArgs>(
      args?: SelectSubset<T, CategoriaFindFirstArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Categoria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindFirstOrThrowArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoriaFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CategoriaFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Categorias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categorias
     * const categorias = await prisma.categoria.findMany()
     *
     * // Get first 10 Categorias
     * const categorias = await prisma.categoria.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const categoriaWithIdOnly = await prisma.categoria.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CategoriaFindManyArgs>(
      args?: SelectSubset<T, CategoriaFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Categoria.
     * @param {CategoriaCreateArgs} args - Arguments to create a Categoria.
     * @example
     * // Create one Categoria
     * const Categoria = await prisma.categoria.create({
     *   data: {
     *     // ... data to create a Categoria
     *   }
     * })
     *
     */
    create<T extends CategoriaCreateArgs>(
      args: SelectSubset<T, CategoriaCreateArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Categorias.
     * @param {CategoriaCreateManyArgs} args - Arguments to create many Categorias.
     * @example
     * // Create many Categorias
     * const categoria = await prisma.categoria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CategoriaCreateManyArgs>(
      args?: SelectSubset<T, CategoriaCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Categorias and returns the data saved in the database.
     * @param {CategoriaCreateManyAndReturnArgs} args - Arguments to create many Categorias.
     * @example
     * // Create many Categorias
     * const categoria = await prisma.categoria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Categorias and only return the `id`
     * const categoriaWithIdOnly = await prisma.categoria.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CategoriaCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CategoriaCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Categoria.
     * @param {CategoriaDeleteArgs} args - Arguments to delete one Categoria.
     * @example
     * // Delete one Categoria
     * const Categoria = await prisma.categoria.delete({
     *   where: {
     *     // ... filter to delete one Categoria
     *   }
     * })
     *
     */
    delete<T extends CategoriaDeleteArgs>(
      args: SelectSubset<T, CategoriaDeleteArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Categoria.
     * @param {CategoriaUpdateArgs} args - Arguments to update one Categoria.
     * @example
     * // Update one Categoria
     * const categoria = await prisma.categoria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CategoriaUpdateArgs>(
      args: SelectSubset<T, CategoriaUpdateArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Categorias.
     * @param {CategoriaDeleteManyArgs} args - Arguments to filter Categorias to delete.
     * @example
     * // Delete a few Categorias
     * const { count } = await prisma.categoria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CategoriaDeleteManyArgs>(
      args?: SelectSubset<T, CategoriaDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Categorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categorias
     * const categoria = await prisma.categoria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CategoriaUpdateManyArgs>(
      args: SelectSubset<T, CategoriaUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Categorias and returns the data updated in the database.
     * @param {CategoriaUpdateManyAndReturnArgs} args - Arguments to update many Categorias.
     * @example
     * // Update many Categorias
     * const categoria = await prisma.categoria.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Categorias and only return the `id`
     * const categoriaWithIdOnly = await prisma.categoria.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CategoriaUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CategoriaUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Categoria.
     * @param {CategoriaUpsertArgs} args - Arguments to update or create a Categoria.
     * @example
     * // Update or create a Categoria
     * const categoria = await prisma.categoria.upsert({
     *   create: {
     *     // ... data to create a Categoria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categoria we want to update
     *   }
     * })
     */
    upsert<T extends CategoriaUpsertArgs>(
      args: SelectSubset<T, CategoriaUpsertArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      $Result.GetResult<
        Prisma.$CategoriaPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Categorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaCountArgs} args - Arguments to filter Categorias to count.
     * @example
     * // Count the number of Categorias
     * const count = await prisma.categoria.count({
     *   where: {
     *     // ... the filter for the Categorias we want to count
     *   }
     * })
     **/
    count<T extends CategoriaCountArgs>(
      args?: Subset<T, CategoriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoriaCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Categoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CategoriaAggregateArgs>(
      args: Subset<T, CategoriaAggregateArgs>,
    ): Prisma.PrismaPromise<GetCategoriaAggregateType<T>>;

    /**
     * Group by Categoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CategoriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoriaGroupByArgs['orderBy'] }
        : { orderBy?: CategoriaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CategoriaGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetCategoriaGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Categoria model
     */
    readonly fields: CategoriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Categoria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoriaClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    items<T extends Categoria$itemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Categoria$itemsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ItemCalificablePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    juego<T extends Categoria$juegoArgs<ExtArgs> = {}>(
      args?: Subset<T, Categoria$juegoArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Categoria model
   */
  interface CategoriaFieldRefs {
    readonly id: FieldRef<'Categoria', 'String'>;
    readonly nombre: FieldRef<'Categoria', 'String'>;
    readonly activa: FieldRef<'Categoria', 'Boolean'>;
    readonly tipo: FieldRef<'Categoria', 'String'>;
    readonly juegoId: FieldRef<'Categoria', 'String'>;
    readonly createdAt: FieldRef<'Categoria', 'DateTime'>;
    readonly updatedAt: FieldRef<'Categoria', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Categoria findUnique
   */
  export type CategoriaFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * Filter, which Categoria to fetch.
     */
    where: CategoriaWhereUniqueInput;
  };

  /**
   * Categoria findUniqueOrThrow
   */
  export type CategoriaFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * Filter, which Categoria to fetch.
     */
    where: CategoriaWhereUniqueInput;
  };

  /**
   * Categoria findFirst
   */
  export type CategoriaFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * Filter, which Categoria to fetch.
     */
    where?: CategoriaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categorias to fetch.
     */
    orderBy?:
      | CategoriaOrderByWithRelationInput
      | CategoriaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categorias.
     */
    cursor?: CategoriaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categorias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[];
  };

  /**
   * Categoria findFirstOrThrow
   */
  export type CategoriaFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * Filter, which Categoria to fetch.
     */
    where?: CategoriaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categorias to fetch.
     */
    orderBy?:
      | CategoriaOrderByWithRelationInput
      | CategoriaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categorias.
     */
    cursor?: CategoriaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categorias.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[];
  };

  /**
   * Categoria findMany
   */
  export type CategoriaFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * Filter, which Categorias to fetch.
     */
    where?: CategoriaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categorias to fetch.
     */
    orderBy?:
      | CategoriaOrderByWithRelationInput
      | CategoriaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Categorias.
     */
    cursor?: CategoriaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categorias.
     */
    skip?: number;
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[];
  };

  /**
   * Categoria create
   */
  export type CategoriaCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * The data needed to create a Categoria.
     */
    data: XOR<CategoriaCreateInput, CategoriaUncheckedCreateInput>;
  };

  /**
   * Categoria createMany
   */
  export type CategoriaCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Categorias.
     */
    data: CategoriaCreateManyInput | CategoriaCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Categoria createManyAndReturn
   */
  export type CategoriaCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * The data used to create many Categorias.
     */
    data: CategoriaCreateManyInput | CategoriaCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Categoria update
   */
  export type CategoriaUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * The data needed to update a Categoria.
     */
    data: XOR<CategoriaUpdateInput, CategoriaUncheckedUpdateInput>;
    /**
     * Choose, which Categoria to update.
     */
    where: CategoriaWhereUniqueInput;
  };

  /**
   * Categoria updateMany
   */
  export type CategoriaUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Categorias.
     */
    data: XOR<
      CategoriaUpdateManyMutationInput,
      CategoriaUncheckedUpdateManyInput
    >;
    /**
     * Filter which Categorias to update
     */
    where?: CategoriaWhereInput;
    /**
     * Limit how many Categorias to update.
     */
    limit?: number;
  };

  /**
   * Categoria updateManyAndReturn
   */
  export type CategoriaUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * The data used to update Categorias.
     */
    data: XOR<
      CategoriaUpdateManyMutationInput,
      CategoriaUncheckedUpdateManyInput
    >;
    /**
     * Filter which Categorias to update
     */
    where?: CategoriaWhereInput;
    /**
     * Limit how many Categorias to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Categoria upsert
   */
  export type CategoriaUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * The filter to search for the Categoria to update in case it exists.
     */
    where: CategoriaWhereUniqueInput;
    /**
     * In case the Categoria found by the `where` argument doesn't exist, create a new Categoria with this data.
     */
    create: XOR<CategoriaCreateInput, CategoriaUncheckedCreateInput>;
    /**
     * In case the Categoria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoriaUpdateInput, CategoriaUncheckedUpdateInput>;
  };

  /**
   * Categoria delete
   */
  export type CategoriaDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
    /**
     * Filter which Categoria to delete.
     */
    where: CategoriaWhereUniqueInput;
  };

  /**
   * Categoria deleteMany
   */
  export type CategoriaDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Categorias to delete
     */
    where?: CategoriaWhereInput;
    /**
     * Limit how many Categorias to delete.
     */
    limit?: number;
  };

  /**
   * Categoria.items
   */
  export type Categoria$itemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    where?: ItemCalificableWhereInput;
    orderBy?:
      | ItemCalificableOrderByWithRelationInput
      | ItemCalificableOrderByWithRelationInput[];
    cursor?: ItemCalificableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | ItemCalificableScalarFieldEnum
      | ItemCalificableScalarFieldEnum[];
  };

  /**
   * Categoria.juego
   */
  export type Categoria$juegoArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    where?: JuegoWhereInput;
  };

  /**
   * Categoria without action
   */
  export type CategoriaDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Categoria
     */
    omit?: CategoriaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null;
  };

  /**
   * Model ItemCalificable
   */

  export type AggregateItemCalificable = {
    _count: ItemCalificableCountAggregateOutputType | null;
    _min: ItemCalificableMinAggregateOutputType | null;
    _max: ItemCalificableMaxAggregateOutputType | null;
  };

  export type ItemCalificableMinAggregateOutputType = {
    id: string | null;
    nombre: string | null;
    categoriaId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    image: string | null;
  };

  export type ItemCalificableMaxAggregateOutputType = {
    id: string | null;
    nombre: string | null;
    categoriaId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    image: string | null;
  };

  export type ItemCalificableCountAggregateOutputType = {
    id: number;
    nombre: number;
    categoriaId: number;
    createdAt: number;
    updatedAt: number;
    image: number;
    _all: number;
  };

  export type ItemCalificableMinAggregateInputType = {
    id?: true;
    nombre?: true;
    categoriaId?: true;
    createdAt?: true;
    updatedAt?: true;
    image?: true;
  };

  export type ItemCalificableMaxAggregateInputType = {
    id?: true;
    nombre?: true;
    categoriaId?: true;
    createdAt?: true;
    updatedAt?: true;
    image?: true;
  };

  export type ItemCalificableCountAggregateInputType = {
    id?: true;
    nombre?: true;
    categoriaId?: true;
    createdAt?: true;
    updatedAt?: true;
    image?: true;
    _all?: true;
  };

  export type ItemCalificableAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ItemCalificable to aggregate.
     */
    where?: ItemCalificableWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ItemCalificables to fetch.
     */
    orderBy?:
      | ItemCalificableOrderByWithRelationInput
      | ItemCalificableOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ItemCalificableWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ItemCalificables from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ItemCalificables.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ItemCalificables
     **/
    _count?: true | ItemCalificableCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ItemCalificableMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ItemCalificableMaxAggregateInputType;
  };

  export type GetItemCalificableAggregateType<
    T extends ItemCalificableAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateItemCalificable]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemCalificable[P]>
      : GetScalarType<T[P], AggregateItemCalificable[P]>;
  };

  export type ItemCalificableGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ItemCalificableWhereInput;
    orderBy?:
      | ItemCalificableOrderByWithAggregationInput
      | ItemCalificableOrderByWithAggregationInput[];
    by: ItemCalificableScalarFieldEnum[] | ItemCalificableScalarFieldEnum;
    having?: ItemCalificableScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ItemCalificableCountAggregateInputType | true;
    _min?: ItemCalificableMinAggregateInputType;
    _max?: ItemCalificableMaxAggregateInputType;
  };

  export type ItemCalificableGroupByOutputType = {
    id: string;
    nombre: string;
    categoriaId: string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    _count: ItemCalificableCountAggregateOutputType | null;
    _min: ItemCalificableMinAggregateOutputType | null;
    _max: ItemCalificableMaxAggregateOutputType | null;
  };

  type GetItemCalificableGroupByPayload<T extends ItemCalificableGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ItemCalificableGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof ItemCalificableGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemCalificableGroupByOutputType[P]>
            : GetScalarType<T[P], ItemCalificableGroupByOutputType[P]>;
        }
      >
    >;

  export type ItemCalificableSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      categoriaId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      image?: boolean;
      calificaciones?: boolean | ItemCalificable$calificacionesArgs<ExtArgs>;
      categoria?: boolean | CategoriaDefaultArgs<ExtArgs>;
      matchesSideA?: boolean | ItemCalificable$matchesSideAArgs<ExtArgs>;
      matchesSideB?: boolean | ItemCalificable$matchesSideBArgs<ExtArgs>;
      matchesWon?: boolean | ItemCalificable$matchesWonArgs<ExtArgs>;
      _count?: boolean | ItemCalificableCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['itemCalificable']
  >;

  export type ItemCalificableSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      categoriaId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      image?: boolean;
      categoria?: boolean | CategoriaDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['itemCalificable']
  >;

  export type ItemCalificableSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      nombre?: boolean;
      categoriaId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      image?: boolean;
      categoria?: boolean | CategoriaDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['itemCalificable']
  >;

  export type ItemCalificableSelectScalar = {
    id?: boolean;
    nombre?: boolean;
    categoriaId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    image?: boolean;
  };

  export type ItemCalificableOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'nombre' | 'categoriaId' | 'createdAt' | 'updatedAt' | 'image',
    ExtArgs['result']['itemCalificable']
  >;
  export type ItemCalificableInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    calificaciones?: boolean | ItemCalificable$calificacionesArgs<ExtArgs>;
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>;
    matchesSideA?: boolean | ItemCalificable$matchesSideAArgs<ExtArgs>;
    matchesSideB?: boolean | ItemCalificable$matchesSideBArgs<ExtArgs>;
    matchesWon?: boolean | ItemCalificable$matchesWonArgs<ExtArgs>;
    _count?: boolean | ItemCalificableCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type ItemCalificableIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>;
  };
  export type ItemCalificableIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>;
  };

  export type $ItemCalificablePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ItemCalificable';
    objects: {
      calificaciones: Prisma.$CalificacionPayload<ExtArgs>[];
      categoria: Prisma.$CategoriaPayload<ExtArgs>;
      matchesSideA: Prisma.$BracketMatchPayload<ExtArgs>[];
      matchesSideB: Prisma.$BracketMatchPayload<ExtArgs>[];
      matchesWon: Prisma.$BracketMatchPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        nombre: string;
        categoriaId: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
      },
      ExtArgs['result']['itemCalificable']
    >;
    composites: {};
  };

  type ItemCalificableGetPayload<
    S extends boolean | null | undefined | ItemCalificableDefaultArgs,
  > = $Result.GetResult<Prisma.$ItemCalificablePayload, S>;

  type ItemCalificableCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    ItemCalificableFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: ItemCalificableCountAggregateInputType | true;
  };

  export interface ItemCalificableDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ItemCalificable'];
      meta: { name: 'ItemCalificable' };
    };
    /**
     * Find zero or one ItemCalificable that matches the filter.
     * @param {ItemCalificableFindUniqueArgs} args - Arguments to find a ItemCalificable
     * @example
     * // Get one ItemCalificable
     * const itemCalificable = await prisma.itemCalificable.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemCalificableFindUniqueArgs>(
      args: SelectSubset<T, ItemCalificableFindUniqueArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one ItemCalificable that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemCalificableFindUniqueOrThrowArgs} args - Arguments to find a ItemCalificable
     * @example
     * // Get one ItemCalificable
     * const itemCalificable = await prisma.itemCalificable.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemCalificableFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ItemCalificableFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ItemCalificable that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableFindFirstArgs} args - Arguments to find a ItemCalificable
     * @example
     * // Get one ItemCalificable
     * const itemCalificable = await prisma.itemCalificable.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemCalificableFindFirstArgs>(
      args?: SelectSubset<T, ItemCalificableFindFirstArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ItemCalificable that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableFindFirstOrThrowArgs} args - Arguments to find a ItemCalificable
     * @example
     * // Get one ItemCalificable
     * const itemCalificable = await prisma.itemCalificable.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemCalificableFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ItemCalificableFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more ItemCalificables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemCalificables
     * const itemCalificables = await prisma.itemCalificable.findMany()
     *
     * // Get first 10 ItemCalificables
     * const itemCalificables = await prisma.itemCalificable.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const itemCalificableWithIdOnly = await prisma.itemCalificable.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ItemCalificableFindManyArgs>(
      args?: SelectSubset<T, ItemCalificableFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a ItemCalificable.
     * @param {ItemCalificableCreateArgs} args - Arguments to create a ItemCalificable.
     * @example
     * // Create one ItemCalificable
     * const ItemCalificable = await prisma.itemCalificable.create({
     *   data: {
     *     // ... data to create a ItemCalificable
     *   }
     * })
     *
     */
    create<T extends ItemCalificableCreateArgs>(
      args: SelectSubset<T, ItemCalificableCreateArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many ItemCalificables.
     * @param {ItemCalificableCreateManyArgs} args - Arguments to create many ItemCalificables.
     * @example
     * // Create many ItemCalificables
     * const itemCalificable = await prisma.itemCalificable.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ItemCalificableCreateManyArgs>(
      args?: SelectSubset<T, ItemCalificableCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ItemCalificables and returns the data saved in the database.
     * @param {ItemCalificableCreateManyAndReturnArgs} args - Arguments to create many ItemCalificables.
     * @example
     * // Create many ItemCalificables
     * const itemCalificable = await prisma.itemCalificable.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ItemCalificables and only return the `id`
     * const itemCalificableWithIdOnly = await prisma.itemCalificable.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ItemCalificableCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ItemCalificableCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a ItemCalificable.
     * @param {ItemCalificableDeleteArgs} args - Arguments to delete one ItemCalificable.
     * @example
     * // Delete one ItemCalificable
     * const ItemCalificable = await prisma.itemCalificable.delete({
     *   where: {
     *     // ... filter to delete one ItemCalificable
     *   }
     * })
     *
     */
    delete<T extends ItemCalificableDeleteArgs>(
      args: SelectSubset<T, ItemCalificableDeleteArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one ItemCalificable.
     * @param {ItemCalificableUpdateArgs} args - Arguments to update one ItemCalificable.
     * @example
     * // Update one ItemCalificable
     * const itemCalificable = await prisma.itemCalificable.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ItemCalificableUpdateArgs>(
      args: SelectSubset<T, ItemCalificableUpdateArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more ItemCalificables.
     * @param {ItemCalificableDeleteManyArgs} args - Arguments to filter ItemCalificables to delete.
     * @example
     * // Delete a few ItemCalificables
     * const { count } = await prisma.itemCalificable.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ItemCalificableDeleteManyArgs>(
      args?: SelectSubset<T, ItemCalificableDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ItemCalificables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemCalificables
     * const itemCalificable = await prisma.itemCalificable.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ItemCalificableUpdateManyArgs>(
      args: SelectSubset<T, ItemCalificableUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ItemCalificables and returns the data updated in the database.
     * @param {ItemCalificableUpdateManyAndReturnArgs} args - Arguments to update many ItemCalificables.
     * @example
     * // Update many ItemCalificables
     * const itemCalificable = await prisma.itemCalificable.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ItemCalificables and only return the `id`
     * const itemCalificableWithIdOnly = await prisma.itemCalificable.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ItemCalificableUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ItemCalificableUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one ItemCalificable.
     * @param {ItemCalificableUpsertArgs} args - Arguments to update or create a ItemCalificable.
     * @example
     * // Update or create a ItemCalificable
     * const itemCalificable = await prisma.itemCalificable.upsert({
     *   create: {
     *     // ... data to create a ItemCalificable
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemCalificable we want to update
     *   }
     * })
     */
    upsert<T extends ItemCalificableUpsertArgs>(
      args: SelectSubset<T, ItemCalificableUpsertArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of ItemCalificables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableCountArgs} args - Arguments to filter ItemCalificables to count.
     * @example
     * // Count the number of ItemCalificables
     * const count = await prisma.itemCalificable.count({
     *   where: {
     *     // ... the filter for the ItemCalificables we want to count
     *   }
     * })
     **/
    count<T extends ItemCalificableCountArgs>(
      args?: Subset<T, ItemCalificableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemCalificableCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ItemCalificable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ItemCalificableAggregateArgs>(
      args: Subset<T, ItemCalificableAggregateArgs>,
    ): Prisma.PrismaPromise<GetItemCalificableAggregateType<T>>;

    /**
     * Group by ItemCalificable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCalificableGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ItemCalificableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemCalificableGroupByArgs['orderBy'] }
        : { orderBy?: ItemCalificableGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ItemCalificableGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetItemCalificableGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ItemCalificable model
     */
    readonly fields: ItemCalificableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemCalificable.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemCalificableClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    calificaciones<T extends ItemCalificable$calificacionesArgs<ExtArgs> = {}>(
      args?: Subset<T, ItemCalificable$calificacionesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$CalificacionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    categoria<T extends CategoriaDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, CategoriaDefaultArgs<ExtArgs>>,
    ): Prisma__CategoriaClient<
      | $Result.GetResult<
          Prisma.$CategoriaPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    matchesSideA<T extends ItemCalificable$matchesSideAArgs<ExtArgs> = {}>(
      args?: Subset<T, ItemCalificable$matchesSideAArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$BracketMatchPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    matchesSideB<T extends ItemCalificable$matchesSideBArgs<ExtArgs> = {}>(
      args?: Subset<T, ItemCalificable$matchesSideBArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$BracketMatchPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    matchesWon<T extends ItemCalificable$matchesWonArgs<ExtArgs> = {}>(
      args?: Subset<T, ItemCalificable$matchesWonArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$BracketMatchPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ItemCalificable model
   */
  interface ItemCalificableFieldRefs {
    readonly id: FieldRef<'ItemCalificable', 'String'>;
    readonly nombre: FieldRef<'ItemCalificable', 'String'>;
    readonly categoriaId: FieldRef<'ItemCalificable', 'String'>;
    readonly createdAt: FieldRef<'ItemCalificable', 'DateTime'>;
    readonly updatedAt: FieldRef<'ItemCalificable', 'DateTime'>;
    readonly image: FieldRef<'ItemCalificable', 'String'>;
  }

  // Custom InputTypes
  /**
   * ItemCalificable findUnique
   */
  export type ItemCalificableFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * Filter, which ItemCalificable to fetch.
     */
    where: ItemCalificableWhereUniqueInput;
  };

  /**
   * ItemCalificable findUniqueOrThrow
   */
  export type ItemCalificableFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * Filter, which ItemCalificable to fetch.
     */
    where: ItemCalificableWhereUniqueInput;
  };

  /**
   * ItemCalificable findFirst
   */
  export type ItemCalificableFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * Filter, which ItemCalificable to fetch.
     */
    where?: ItemCalificableWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ItemCalificables to fetch.
     */
    orderBy?:
      | ItemCalificableOrderByWithRelationInput
      | ItemCalificableOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ItemCalificables.
     */
    cursor?: ItemCalificableWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ItemCalificables from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ItemCalificables.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ItemCalificables.
     */
    distinct?:
      | ItemCalificableScalarFieldEnum
      | ItemCalificableScalarFieldEnum[];
  };

  /**
   * ItemCalificable findFirstOrThrow
   */
  export type ItemCalificableFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * Filter, which ItemCalificable to fetch.
     */
    where?: ItemCalificableWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ItemCalificables to fetch.
     */
    orderBy?:
      | ItemCalificableOrderByWithRelationInput
      | ItemCalificableOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ItemCalificables.
     */
    cursor?: ItemCalificableWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ItemCalificables from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ItemCalificables.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ItemCalificables.
     */
    distinct?:
      | ItemCalificableScalarFieldEnum
      | ItemCalificableScalarFieldEnum[];
  };

  /**
   * ItemCalificable findMany
   */
  export type ItemCalificableFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * Filter, which ItemCalificables to fetch.
     */
    where?: ItemCalificableWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ItemCalificables to fetch.
     */
    orderBy?:
      | ItemCalificableOrderByWithRelationInput
      | ItemCalificableOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ItemCalificables.
     */
    cursor?: ItemCalificableWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ItemCalificables from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ItemCalificables.
     */
    skip?: number;
    distinct?:
      | ItemCalificableScalarFieldEnum
      | ItemCalificableScalarFieldEnum[];
  };

  /**
   * ItemCalificable create
   */
  export type ItemCalificableCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * The data needed to create a ItemCalificable.
     */
    data: XOR<ItemCalificableCreateInput, ItemCalificableUncheckedCreateInput>;
  };

  /**
   * ItemCalificable createMany
   */
  export type ItemCalificableCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ItemCalificables.
     */
    data: ItemCalificableCreateManyInput | ItemCalificableCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ItemCalificable createManyAndReturn
   */
  export type ItemCalificableCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * The data used to create many ItemCalificables.
     */
    data: ItemCalificableCreateManyInput | ItemCalificableCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ItemCalificable update
   */
  export type ItemCalificableUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * The data needed to update a ItemCalificable.
     */
    data: XOR<ItemCalificableUpdateInput, ItemCalificableUncheckedUpdateInput>;
    /**
     * Choose, which ItemCalificable to update.
     */
    where: ItemCalificableWhereUniqueInput;
  };

  /**
   * ItemCalificable updateMany
   */
  export type ItemCalificableUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ItemCalificables.
     */
    data: XOR<
      ItemCalificableUpdateManyMutationInput,
      ItemCalificableUncheckedUpdateManyInput
    >;
    /**
     * Filter which ItemCalificables to update
     */
    where?: ItemCalificableWhereInput;
    /**
     * Limit how many ItemCalificables to update.
     */
    limit?: number;
  };

  /**
   * ItemCalificable updateManyAndReturn
   */
  export type ItemCalificableUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * The data used to update ItemCalificables.
     */
    data: XOR<
      ItemCalificableUpdateManyMutationInput,
      ItemCalificableUncheckedUpdateManyInput
    >;
    /**
     * Filter which ItemCalificables to update
     */
    where?: ItemCalificableWhereInput;
    /**
     * Limit how many ItemCalificables to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ItemCalificable upsert
   */
  export type ItemCalificableUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * The filter to search for the ItemCalificable to update in case it exists.
     */
    where: ItemCalificableWhereUniqueInput;
    /**
     * In case the ItemCalificable found by the `where` argument doesn't exist, create a new ItemCalificable with this data.
     */
    create: XOR<
      ItemCalificableCreateInput,
      ItemCalificableUncheckedCreateInput
    >;
    /**
     * In case the ItemCalificable was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      ItemCalificableUpdateInput,
      ItemCalificableUncheckedUpdateInput
    >;
  };

  /**
   * ItemCalificable delete
   */
  export type ItemCalificableDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    /**
     * Filter which ItemCalificable to delete.
     */
    where: ItemCalificableWhereUniqueInput;
  };

  /**
   * ItemCalificable deleteMany
   */
  export type ItemCalificableDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ItemCalificables to delete
     */
    where?: ItemCalificableWhereInput;
    /**
     * Limit how many ItemCalificables to delete.
     */
    limit?: number;
  };

  /**
   * ItemCalificable.calificaciones
   */
  export type ItemCalificable$calificacionesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    where?: CalificacionWhereInput;
    orderBy?:
      | CalificacionOrderByWithRelationInput
      | CalificacionOrderByWithRelationInput[];
    cursor?: CalificacionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[];
  };

  /**
   * ItemCalificable.matchesSideA
   */
  export type ItemCalificable$matchesSideAArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    where?: BracketMatchWhereInput;
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    cursor?: BracketMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * ItemCalificable.matchesSideB
   */
  export type ItemCalificable$matchesSideBArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    where?: BracketMatchWhereInput;
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    cursor?: BracketMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * ItemCalificable.matchesWon
   */
  export type ItemCalificable$matchesWonArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    where?: BracketMatchWhereInput;
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    cursor?: BracketMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * ItemCalificable without action
   */
  export type ItemCalificableDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
  };

  /**
   * Model Calificacion
   */

  export type AggregateCalificacion = {
    _count: CalificacionCountAggregateOutputType | null;
    _avg: CalificacionAvgAggregateOutputType | null;
    _sum: CalificacionSumAggregateOutputType | null;
    _min: CalificacionMinAggregateOutputType | null;
    _max: CalificacionMaxAggregateOutputType | null;
  };

  export type CalificacionAvgAggregateOutputType = {
    puntuacion: number | null;
  };

  export type CalificacionSumAggregateOutputType = {
    puntuacion: number | null;
  };

  export type CalificacionMinAggregateOutputType = {
    id: string | null;
    puntuacion: number | null;
    ip: string | null;
    itemId: string | null;
    createdAt: Date | null;
    deviceId: string | null;
  };

  export type CalificacionMaxAggregateOutputType = {
    id: string | null;
    puntuacion: number | null;
    ip: string | null;
    itemId: string | null;
    createdAt: Date | null;
    deviceId: string | null;
  };

  export type CalificacionCountAggregateOutputType = {
    id: number;
    puntuacion: number;
    ip: number;
    itemId: number;
    createdAt: number;
    deviceId: number;
    _all: number;
  };

  export type CalificacionAvgAggregateInputType = {
    puntuacion?: true;
  };

  export type CalificacionSumAggregateInputType = {
    puntuacion?: true;
  };

  export type CalificacionMinAggregateInputType = {
    id?: true;
    puntuacion?: true;
    ip?: true;
    itemId?: true;
    createdAt?: true;
    deviceId?: true;
  };

  export type CalificacionMaxAggregateInputType = {
    id?: true;
    puntuacion?: true;
    ip?: true;
    itemId?: true;
    createdAt?: true;
    deviceId?: true;
  };

  export type CalificacionCountAggregateInputType = {
    id?: true;
    puntuacion?: true;
    ip?: true;
    itemId?: true;
    createdAt?: true;
    deviceId?: true;
    _all?: true;
  };

  export type CalificacionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Calificacion to aggregate.
     */
    where?: CalificacionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Calificacions to fetch.
     */
    orderBy?:
      | CalificacionOrderByWithRelationInput
      | CalificacionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CalificacionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Calificacions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Calificacions
     **/
    _count?: true | CalificacionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: CalificacionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: CalificacionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CalificacionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CalificacionMaxAggregateInputType;
  };

  export type GetCalificacionAggregateType<
    T extends CalificacionAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateCalificacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCalificacion[P]>
      : GetScalarType<T[P], AggregateCalificacion[P]>;
  };

  export type CalificacionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CalificacionWhereInput;
    orderBy?:
      | CalificacionOrderByWithAggregationInput
      | CalificacionOrderByWithAggregationInput[];
    by: CalificacionScalarFieldEnum[] | CalificacionScalarFieldEnum;
    having?: CalificacionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CalificacionCountAggregateInputType | true;
    _avg?: CalificacionAvgAggregateInputType;
    _sum?: CalificacionSumAggregateInputType;
    _min?: CalificacionMinAggregateInputType;
    _max?: CalificacionMaxAggregateInputType;
  };

  export type CalificacionGroupByOutputType = {
    id: string;
    puntuacion: number;
    ip: string | null;
    itemId: string;
    createdAt: Date;
    deviceId: string | null;
    _count: CalificacionCountAggregateOutputType | null;
    _avg: CalificacionAvgAggregateOutputType | null;
    _sum: CalificacionSumAggregateOutputType | null;
    _min: CalificacionMinAggregateOutputType | null;
    _max: CalificacionMaxAggregateOutputType | null;
  };

  type GetCalificacionGroupByPayload<T extends CalificacionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CalificacionGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof CalificacionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CalificacionGroupByOutputType[P]>
            : GetScalarType<T[P], CalificacionGroupByOutputType[P]>;
        }
      >
    >;

  export type CalificacionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      puntuacion?: boolean;
      ip?: boolean;
      itemId?: boolean;
      createdAt?: boolean;
      deviceId?: boolean;
      item?: boolean | ItemCalificableDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['calificacion']
  >;

  export type CalificacionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      puntuacion?: boolean;
      ip?: boolean;
      itemId?: boolean;
      createdAt?: boolean;
      deviceId?: boolean;
      item?: boolean | ItemCalificableDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['calificacion']
  >;

  export type CalificacionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      puntuacion?: boolean;
      ip?: boolean;
      itemId?: boolean;
      createdAt?: boolean;
      deviceId?: boolean;
      item?: boolean | ItemCalificableDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['calificacion']
  >;

  export type CalificacionSelectScalar = {
    id?: boolean;
    puntuacion?: boolean;
    ip?: boolean;
    itemId?: boolean;
    createdAt?: boolean;
    deviceId?: boolean;
  };

  export type CalificacionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'puntuacion' | 'ip' | 'itemId' | 'createdAt' | 'deviceId',
    ExtArgs['result']['calificacion']
  >;
  export type CalificacionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    item?: boolean | ItemCalificableDefaultArgs<ExtArgs>;
  };
  export type CalificacionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    item?: boolean | ItemCalificableDefaultArgs<ExtArgs>;
  };
  export type CalificacionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    item?: boolean | ItemCalificableDefaultArgs<ExtArgs>;
  };

  export type $CalificacionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Calificacion';
    objects: {
      item: Prisma.$ItemCalificablePayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        puntuacion: number;
        ip: string | null;
        itemId: string;
        createdAt: Date;
        deviceId: string | null;
      },
      ExtArgs['result']['calificacion']
    >;
    composites: {};
  };

  type CalificacionGetPayload<
    S extends boolean | null | undefined | CalificacionDefaultArgs,
  > = $Result.GetResult<Prisma.$CalificacionPayload, S>;

  type CalificacionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    CalificacionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: CalificacionCountAggregateInputType | true;
  };

  export interface CalificacionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Calificacion'];
      meta: { name: 'Calificacion' };
    };
    /**
     * Find zero or one Calificacion that matches the filter.
     * @param {CalificacionFindUniqueArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CalificacionFindUniqueArgs>(
      args: SelectSubset<T, CalificacionFindUniqueArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Calificacion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CalificacionFindUniqueOrThrowArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CalificacionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CalificacionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Calificacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionFindFirstArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CalificacionFindFirstArgs>(
      args?: SelectSubset<T, CalificacionFindFirstArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Calificacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionFindFirstOrThrowArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CalificacionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CalificacionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Calificacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Calificacions
     * const calificacions = await prisma.calificacion.findMany()
     *
     * // Get first 10 Calificacions
     * const calificacions = await prisma.calificacion.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const calificacionWithIdOnly = await prisma.calificacion.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CalificacionFindManyArgs>(
      args?: SelectSubset<T, CalificacionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Calificacion.
     * @param {CalificacionCreateArgs} args - Arguments to create a Calificacion.
     * @example
     * // Create one Calificacion
     * const Calificacion = await prisma.calificacion.create({
     *   data: {
     *     // ... data to create a Calificacion
     *   }
     * })
     *
     */
    create<T extends CalificacionCreateArgs>(
      args: SelectSubset<T, CalificacionCreateArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Calificacions.
     * @param {CalificacionCreateManyArgs} args - Arguments to create many Calificacions.
     * @example
     * // Create many Calificacions
     * const calificacion = await prisma.calificacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CalificacionCreateManyArgs>(
      args?: SelectSubset<T, CalificacionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Calificacions and returns the data saved in the database.
     * @param {CalificacionCreateManyAndReturnArgs} args - Arguments to create many Calificacions.
     * @example
     * // Create many Calificacions
     * const calificacion = await prisma.calificacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Calificacions and only return the `id`
     * const calificacionWithIdOnly = await prisma.calificacion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CalificacionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CalificacionCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Calificacion.
     * @param {CalificacionDeleteArgs} args - Arguments to delete one Calificacion.
     * @example
     * // Delete one Calificacion
     * const Calificacion = await prisma.calificacion.delete({
     *   where: {
     *     // ... filter to delete one Calificacion
     *   }
     * })
     *
     */
    delete<T extends CalificacionDeleteArgs>(
      args: SelectSubset<T, CalificacionDeleteArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Calificacion.
     * @param {CalificacionUpdateArgs} args - Arguments to update one Calificacion.
     * @example
     * // Update one Calificacion
     * const calificacion = await prisma.calificacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CalificacionUpdateArgs>(
      args: SelectSubset<T, CalificacionUpdateArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Calificacions.
     * @param {CalificacionDeleteManyArgs} args - Arguments to filter Calificacions to delete.
     * @example
     * // Delete a few Calificacions
     * const { count } = await prisma.calificacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CalificacionDeleteManyArgs>(
      args?: SelectSubset<T, CalificacionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Calificacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Calificacions
     * const calificacion = await prisma.calificacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CalificacionUpdateManyArgs>(
      args: SelectSubset<T, CalificacionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Calificacions and returns the data updated in the database.
     * @param {CalificacionUpdateManyAndReturnArgs} args - Arguments to update many Calificacions.
     * @example
     * // Update many Calificacions
     * const calificacion = await prisma.calificacion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Calificacions and only return the `id`
     * const calificacionWithIdOnly = await prisma.calificacion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CalificacionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CalificacionUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Calificacion.
     * @param {CalificacionUpsertArgs} args - Arguments to update or create a Calificacion.
     * @example
     * // Update or create a Calificacion
     * const calificacion = await prisma.calificacion.upsert({
     *   create: {
     *     // ... data to create a Calificacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Calificacion we want to update
     *   }
     * })
     */
    upsert<T extends CalificacionUpsertArgs>(
      args: SelectSubset<T, CalificacionUpsertArgs<ExtArgs>>,
    ): Prisma__CalificacionClient<
      $Result.GetResult<
        Prisma.$CalificacionPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Calificacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionCountArgs} args - Arguments to filter Calificacions to count.
     * @example
     * // Count the number of Calificacions
     * const count = await prisma.calificacion.count({
     *   where: {
     *     // ... the filter for the Calificacions we want to count
     *   }
     * })
     **/
    count<T extends CalificacionCountArgs>(
      args?: Subset<T, CalificacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CalificacionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Calificacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CalificacionAggregateArgs>(
      args: Subset<T, CalificacionAggregateArgs>,
    ): Prisma.PrismaPromise<GetCalificacionAggregateType<T>>;

    /**
     * Group by Calificacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CalificacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CalificacionGroupByArgs['orderBy'] }
        : { orderBy?: CalificacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CalificacionGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetCalificacionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Calificacion model
     */
    readonly fields: CalificacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Calificacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CalificacionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    item<T extends ItemCalificableDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ItemCalificableDefaultArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      | $Result.GetResult<
          Prisma.$ItemCalificablePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Calificacion model
   */
  interface CalificacionFieldRefs {
    readonly id: FieldRef<'Calificacion', 'String'>;
    readonly puntuacion: FieldRef<'Calificacion', 'Int'>;
    readonly ip: FieldRef<'Calificacion', 'String'>;
    readonly itemId: FieldRef<'Calificacion', 'String'>;
    readonly createdAt: FieldRef<'Calificacion', 'DateTime'>;
    readonly deviceId: FieldRef<'Calificacion', 'String'>;
  }

  // Custom InputTypes
  /**
   * Calificacion findUnique
   */
  export type CalificacionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * Filter, which Calificacion to fetch.
     */
    where: CalificacionWhereUniqueInput;
  };

  /**
   * Calificacion findUniqueOrThrow
   */
  export type CalificacionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * Filter, which Calificacion to fetch.
     */
    where: CalificacionWhereUniqueInput;
  };

  /**
   * Calificacion findFirst
   */
  export type CalificacionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * Filter, which Calificacion to fetch.
     */
    where?: CalificacionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Calificacions to fetch.
     */
    orderBy?:
      | CalificacionOrderByWithRelationInput
      | CalificacionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Calificacions.
     */
    cursor?: CalificacionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Calificacions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Calificacions.
     */
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[];
  };

  /**
   * Calificacion findFirstOrThrow
   */
  export type CalificacionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * Filter, which Calificacion to fetch.
     */
    where?: CalificacionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Calificacions to fetch.
     */
    orderBy?:
      | CalificacionOrderByWithRelationInput
      | CalificacionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Calificacions.
     */
    cursor?: CalificacionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Calificacions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Calificacions.
     */
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[];
  };

  /**
   * Calificacion findMany
   */
  export type CalificacionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * Filter, which Calificacions to fetch.
     */
    where?: CalificacionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Calificacions to fetch.
     */
    orderBy?:
      | CalificacionOrderByWithRelationInput
      | CalificacionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Calificacions.
     */
    cursor?: CalificacionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Calificacions.
     */
    skip?: number;
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[];
  };

  /**
   * Calificacion create
   */
  export type CalificacionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Calificacion.
     */
    data: XOR<CalificacionCreateInput, CalificacionUncheckedCreateInput>;
  };

  /**
   * Calificacion createMany
   */
  export type CalificacionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Calificacions.
     */
    data: CalificacionCreateManyInput | CalificacionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Calificacion createManyAndReturn
   */
  export type CalificacionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * The data used to create many Calificacions.
     */
    data: CalificacionCreateManyInput | CalificacionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Calificacion update
   */
  export type CalificacionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Calificacion.
     */
    data: XOR<CalificacionUpdateInput, CalificacionUncheckedUpdateInput>;
    /**
     * Choose, which Calificacion to update.
     */
    where: CalificacionWhereUniqueInput;
  };

  /**
   * Calificacion updateMany
   */
  export type CalificacionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Calificacions.
     */
    data: XOR<
      CalificacionUpdateManyMutationInput,
      CalificacionUncheckedUpdateManyInput
    >;
    /**
     * Filter which Calificacions to update
     */
    where?: CalificacionWhereInput;
    /**
     * Limit how many Calificacions to update.
     */
    limit?: number;
  };

  /**
   * Calificacion updateManyAndReturn
   */
  export type CalificacionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * The data used to update Calificacions.
     */
    data: XOR<
      CalificacionUpdateManyMutationInput,
      CalificacionUncheckedUpdateManyInput
    >;
    /**
     * Filter which Calificacions to update
     */
    where?: CalificacionWhereInput;
    /**
     * Limit how many Calificacions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Calificacion upsert
   */
  export type CalificacionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Calificacion to update in case it exists.
     */
    where: CalificacionWhereUniqueInput;
    /**
     * In case the Calificacion found by the `where` argument doesn't exist, create a new Calificacion with this data.
     */
    create: XOR<CalificacionCreateInput, CalificacionUncheckedCreateInput>;
    /**
     * In case the Calificacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CalificacionUpdateInput, CalificacionUncheckedUpdateInput>;
  };

  /**
   * Calificacion delete
   */
  export type CalificacionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
    /**
     * Filter which Calificacion to delete.
     */
    where: CalificacionWhereUniqueInput;
  };

  /**
   * Calificacion deleteMany
   */
  export type CalificacionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Calificacions to delete
     */
    where?: CalificacionWhereInput;
    /**
     * Limit how many Calificacions to delete.
     */
    limit?: number;
  };

  /**
   * Calificacion without action
   */
  export type CalificacionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null;
  };

  /**
   * Model VotacionBracket
   */

  export type AggregateVotacionBracket = {
    _count: VotacionBracketCountAggregateOutputType | null;
    _avg: VotacionBracketAvgAggregateOutputType | null;
    _sum: VotacionBracketSumAggregateOutputType | null;
    _min: VotacionBracketMinAggregateOutputType | null;
    _max: VotacionBracketMaxAggregateOutputType | null;
  };

  export type VotacionBracketAvgAggregateOutputType = {
    rondaActual: number | null;
  };

  export type VotacionBracketSumAggregateOutputType = {
    rondaActual: number | null;
  };

  export type VotacionBracketMinAggregateOutputType = {
    id: string | null;
    tematica: string | null;
    slug: string | null;
    estado: string | null;
    rondaActual: number | null;
    juegoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VotacionBracketMaxAggregateOutputType = {
    id: string | null;
    tematica: string | null;
    slug: string | null;
    estado: string | null;
    rondaActual: number | null;
    juegoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VotacionBracketCountAggregateOutputType = {
    id: number;
    tematica: number;
    slug: number;
    estado: number;
    rondaActual: number;
    juegoId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type VotacionBracketAvgAggregateInputType = {
    rondaActual?: true;
  };

  export type VotacionBracketSumAggregateInputType = {
    rondaActual?: true;
  };

  export type VotacionBracketMinAggregateInputType = {
    id?: true;
    tematica?: true;
    slug?: true;
    estado?: true;
    rondaActual?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VotacionBracketMaxAggregateInputType = {
    id?: true;
    tematica?: true;
    slug?: true;
    estado?: true;
    rondaActual?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VotacionBracketCountAggregateInputType = {
    id?: true;
    tematica?: true;
    slug?: true;
    estado?: true;
    rondaActual?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type VotacionBracketAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which VotacionBracket to aggregate.
     */
    where?: VotacionBracketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VotacionBrackets to fetch.
     */
    orderBy?:
      | VotacionBracketOrderByWithRelationInput
      | VotacionBracketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VotacionBracketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VotacionBrackets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VotacionBrackets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned VotacionBrackets
     **/
    _count?: true | VotacionBracketCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: VotacionBracketAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: VotacionBracketSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VotacionBracketMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VotacionBracketMaxAggregateInputType;
  };

  export type GetVotacionBracketAggregateType<
    T extends VotacionBracketAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateVotacionBracket]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVotacionBracket[P]>
      : GetScalarType<T[P], AggregateVotacionBracket[P]>;
  };

  export type VotacionBracketGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VotacionBracketWhereInput;
    orderBy?:
      | VotacionBracketOrderByWithAggregationInput
      | VotacionBracketOrderByWithAggregationInput[];
    by: VotacionBracketScalarFieldEnum[] | VotacionBracketScalarFieldEnum;
    having?: VotacionBracketScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VotacionBracketCountAggregateInputType | true;
    _avg?: VotacionBracketAvgAggregateInputType;
    _sum?: VotacionBracketSumAggregateInputType;
    _min?: VotacionBracketMinAggregateInputType;
    _max?: VotacionBracketMaxAggregateInputType;
  };

  export type VotacionBracketGroupByOutputType = {
    id: string;
    tematica: string;
    slug: string;
    estado: string;
    rondaActual: number;
    juegoId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: VotacionBracketCountAggregateOutputType | null;
    _avg: VotacionBracketAvgAggregateOutputType | null;
    _sum: VotacionBracketSumAggregateOutputType | null;
    _min: VotacionBracketMinAggregateOutputType | null;
    _max: VotacionBracketMaxAggregateOutputType | null;
  };

  type GetVotacionBracketGroupByPayload<T extends VotacionBracketGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<VotacionBracketGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof VotacionBracketGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VotacionBracketGroupByOutputType[P]>
            : GetScalarType<T[P], VotacionBracketGroupByOutputType[P]>;
        }
      >
    >;

  export type VotacionBracketSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      tematica?: boolean;
      slug?: boolean;
      estado?: boolean;
      rondaActual?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | JuegoDefaultArgs<ExtArgs>;
      matches?: boolean | VotacionBracket$matchesArgs<ExtArgs>;
      _count?: boolean | VotacionBracketCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['votacionBracket']
  >;

  export type VotacionBracketSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      tematica?: boolean;
      slug?: boolean;
      estado?: boolean;
      rondaActual?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | JuegoDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['votacionBracket']
  >;

  export type VotacionBracketSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      tematica?: boolean;
      slug?: boolean;
      estado?: boolean;
      rondaActual?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | JuegoDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['votacionBracket']
  >;

  export type VotacionBracketSelectScalar = {
    id?: boolean;
    tematica?: boolean;
    slug?: boolean;
    estado?: boolean;
    rondaActual?: boolean;
    juegoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type VotacionBracketOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'tematica'
    | 'slug'
    | 'estado'
    | 'rondaActual'
    | 'juegoId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['votacionBracket']
  >;
  export type VotacionBracketInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | JuegoDefaultArgs<ExtArgs>;
    matches?: boolean | VotacionBracket$matchesArgs<ExtArgs>;
    _count?: boolean | VotacionBracketCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type VotacionBracketIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | JuegoDefaultArgs<ExtArgs>;
  };
  export type VotacionBracketIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | JuegoDefaultArgs<ExtArgs>;
  };

  export type $VotacionBracketPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'VotacionBracket';
    objects: {
      juego: Prisma.$JuegoPayload<ExtArgs>;
      matches: Prisma.$BracketMatchPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        tematica: string;
        slug: string;
        estado: string;
        rondaActual: number;
        juegoId: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['votacionBracket']
    >;
    composites: {};
  };

  type VotacionBracketGetPayload<
    S extends boolean | null | undefined | VotacionBracketDefaultArgs,
  > = $Result.GetResult<Prisma.$VotacionBracketPayload, S>;

  type VotacionBracketCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    VotacionBracketFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: VotacionBracketCountAggregateInputType | true;
  };

  export interface VotacionBracketDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['VotacionBracket'];
      meta: { name: 'VotacionBracket' };
    };
    /**
     * Find zero or one VotacionBracket that matches the filter.
     * @param {VotacionBracketFindUniqueArgs} args - Arguments to find a VotacionBracket
     * @example
     * // Get one VotacionBracket
     * const votacionBracket = await prisma.votacionBracket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VotacionBracketFindUniqueArgs>(
      args: SelectSubset<T, VotacionBracketFindUniqueArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one VotacionBracket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VotacionBracketFindUniqueOrThrowArgs} args - Arguments to find a VotacionBracket
     * @example
     * // Get one VotacionBracket
     * const votacionBracket = await prisma.votacionBracket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VotacionBracketFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VotacionBracketFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first VotacionBracket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketFindFirstArgs} args - Arguments to find a VotacionBracket
     * @example
     * // Get one VotacionBracket
     * const votacionBracket = await prisma.votacionBracket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VotacionBracketFindFirstArgs>(
      args?: SelectSubset<T, VotacionBracketFindFirstArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first VotacionBracket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketFindFirstOrThrowArgs} args - Arguments to find a VotacionBracket
     * @example
     * // Get one VotacionBracket
     * const votacionBracket = await prisma.votacionBracket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VotacionBracketFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VotacionBracketFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more VotacionBrackets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VotacionBrackets
     * const votacionBrackets = await prisma.votacionBracket.findMany()
     *
     * // Get first 10 VotacionBrackets
     * const votacionBrackets = await prisma.votacionBracket.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const votacionBracketWithIdOnly = await prisma.votacionBracket.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VotacionBracketFindManyArgs>(
      args?: SelectSubset<T, VotacionBracketFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a VotacionBracket.
     * @param {VotacionBracketCreateArgs} args - Arguments to create a VotacionBracket.
     * @example
     * // Create one VotacionBracket
     * const VotacionBracket = await prisma.votacionBracket.create({
     *   data: {
     *     // ... data to create a VotacionBracket
     *   }
     * })
     *
     */
    create<T extends VotacionBracketCreateArgs>(
      args: SelectSubset<T, VotacionBracketCreateArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many VotacionBrackets.
     * @param {VotacionBracketCreateManyArgs} args - Arguments to create many VotacionBrackets.
     * @example
     * // Create many VotacionBrackets
     * const votacionBracket = await prisma.votacionBracket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VotacionBracketCreateManyArgs>(
      args?: SelectSubset<T, VotacionBracketCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many VotacionBrackets and returns the data saved in the database.
     * @param {VotacionBracketCreateManyAndReturnArgs} args - Arguments to create many VotacionBrackets.
     * @example
     * // Create many VotacionBrackets
     * const votacionBracket = await prisma.votacionBracket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many VotacionBrackets and only return the `id`
     * const votacionBracketWithIdOnly = await prisma.votacionBracket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VotacionBracketCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VotacionBracketCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a VotacionBracket.
     * @param {VotacionBracketDeleteArgs} args - Arguments to delete one VotacionBracket.
     * @example
     * // Delete one VotacionBracket
     * const VotacionBracket = await prisma.votacionBracket.delete({
     *   where: {
     *     // ... filter to delete one VotacionBracket
     *   }
     * })
     *
     */
    delete<T extends VotacionBracketDeleteArgs>(
      args: SelectSubset<T, VotacionBracketDeleteArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one VotacionBracket.
     * @param {VotacionBracketUpdateArgs} args - Arguments to update one VotacionBracket.
     * @example
     * // Update one VotacionBracket
     * const votacionBracket = await prisma.votacionBracket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VotacionBracketUpdateArgs>(
      args: SelectSubset<T, VotacionBracketUpdateArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more VotacionBrackets.
     * @param {VotacionBracketDeleteManyArgs} args - Arguments to filter VotacionBrackets to delete.
     * @example
     * // Delete a few VotacionBrackets
     * const { count } = await prisma.votacionBracket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VotacionBracketDeleteManyArgs>(
      args?: SelectSubset<T, VotacionBracketDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more VotacionBrackets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VotacionBrackets
     * const votacionBracket = await prisma.votacionBracket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VotacionBracketUpdateManyArgs>(
      args: SelectSubset<T, VotacionBracketUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more VotacionBrackets and returns the data updated in the database.
     * @param {VotacionBracketUpdateManyAndReturnArgs} args - Arguments to update many VotacionBrackets.
     * @example
     * // Update many VotacionBrackets
     * const votacionBracket = await prisma.votacionBracket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more VotacionBrackets and only return the `id`
     * const votacionBracketWithIdOnly = await prisma.votacionBracket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends VotacionBracketUpdateManyAndReturnArgs>(
      args: SelectSubset<T, VotacionBracketUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one VotacionBracket.
     * @param {VotacionBracketUpsertArgs} args - Arguments to update or create a VotacionBracket.
     * @example
     * // Update or create a VotacionBracket
     * const votacionBracket = await prisma.votacionBracket.upsert({
     *   create: {
     *     // ... data to create a VotacionBracket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VotacionBracket we want to update
     *   }
     * })
     */
    upsert<T extends VotacionBracketUpsertArgs>(
      args: SelectSubset<T, VotacionBracketUpsertArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      $Result.GetResult<
        Prisma.$VotacionBracketPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of VotacionBrackets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketCountArgs} args - Arguments to filter VotacionBrackets to count.
     * @example
     * // Count the number of VotacionBrackets
     * const count = await prisma.votacionBracket.count({
     *   where: {
     *     // ... the filter for the VotacionBrackets we want to count
     *   }
     * })
     **/
    count<T extends VotacionBracketCountArgs>(
      args?: Subset<T, VotacionBracketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VotacionBracketCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a VotacionBracket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends VotacionBracketAggregateArgs>(
      args: Subset<T, VotacionBracketAggregateArgs>,
    ): Prisma.PrismaPromise<GetVotacionBracketAggregateType<T>>;

    /**
     * Group by VotacionBracket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VotacionBracketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends VotacionBracketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VotacionBracketGroupByArgs['orderBy'] }
        : { orderBy?: VotacionBracketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VotacionBracketGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetVotacionBracketGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the VotacionBracket model
     */
    readonly fields: VotacionBracketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VotacionBracket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VotacionBracketClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    juego<T extends JuegoDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, JuegoDefaultArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      | $Result.GetResult<
          Prisma.$JuegoPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    matches<T extends VotacionBracket$matchesArgs<ExtArgs> = {}>(
      args?: Subset<T, VotacionBracket$matchesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$BracketMatchPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the VotacionBracket model
   */
  interface VotacionBracketFieldRefs {
    readonly id: FieldRef<'VotacionBracket', 'String'>;
    readonly tematica: FieldRef<'VotacionBracket', 'String'>;
    readonly slug: FieldRef<'VotacionBracket', 'String'>;
    readonly estado: FieldRef<'VotacionBracket', 'String'>;
    readonly rondaActual: FieldRef<'VotacionBracket', 'Int'>;
    readonly juegoId: FieldRef<'VotacionBracket', 'String'>;
    readonly createdAt: FieldRef<'VotacionBracket', 'DateTime'>;
    readonly updatedAt: FieldRef<'VotacionBracket', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * VotacionBracket findUnique
   */
  export type VotacionBracketFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * Filter, which VotacionBracket to fetch.
     */
    where: VotacionBracketWhereUniqueInput;
  };

  /**
   * VotacionBracket findUniqueOrThrow
   */
  export type VotacionBracketFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * Filter, which VotacionBracket to fetch.
     */
    where: VotacionBracketWhereUniqueInput;
  };

  /**
   * VotacionBracket findFirst
   */
  export type VotacionBracketFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * Filter, which VotacionBracket to fetch.
     */
    where?: VotacionBracketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VotacionBrackets to fetch.
     */
    orderBy?:
      | VotacionBracketOrderByWithRelationInput
      | VotacionBracketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VotacionBrackets.
     */
    cursor?: VotacionBracketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VotacionBrackets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VotacionBrackets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VotacionBrackets.
     */
    distinct?:
      | VotacionBracketScalarFieldEnum
      | VotacionBracketScalarFieldEnum[];
  };

  /**
   * VotacionBracket findFirstOrThrow
   */
  export type VotacionBracketFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * Filter, which VotacionBracket to fetch.
     */
    where?: VotacionBracketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VotacionBrackets to fetch.
     */
    orderBy?:
      | VotacionBracketOrderByWithRelationInput
      | VotacionBracketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VotacionBrackets.
     */
    cursor?: VotacionBracketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VotacionBrackets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VotacionBrackets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VotacionBrackets.
     */
    distinct?:
      | VotacionBracketScalarFieldEnum
      | VotacionBracketScalarFieldEnum[];
  };

  /**
   * VotacionBracket findMany
   */
  export type VotacionBracketFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * Filter, which VotacionBrackets to fetch.
     */
    where?: VotacionBracketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VotacionBrackets to fetch.
     */
    orderBy?:
      | VotacionBracketOrderByWithRelationInput
      | VotacionBracketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing VotacionBrackets.
     */
    cursor?: VotacionBracketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VotacionBrackets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VotacionBrackets.
     */
    skip?: number;
    distinct?:
      | VotacionBracketScalarFieldEnum
      | VotacionBracketScalarFieldEnum[];
  };

  /**
   * VotacionBracket create
   */
  export type VotacionBracketCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * The data needed to create a VotacionBracket.
     */
    data: XOR<VotacionBracketCreateInput, VotacionBracketUncheckedCreateInput>;
  };

  /**
   * VotacionBracket createMany
   */
  export type VotacionBracketCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many VotacionBrackets.
     */
    data: VotacionBracketCreateManyInput | VotacionBracketCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * VotacionBracket createManyAndReturn
   */
  export type VotacionBracketCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * The data used to create many VotacionBrackets.
     */
    data: VotacionBracketCreateManyInput | VotacionBracketCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * VotacionBracket update
   */
  export type VotacionBracketUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * The data needed to update a VotacionBracket.
     */
    data: XOR<VotacionBracketUpdateInput, VotacionBracketUncheckedUpdateInput>;
    /**
     * Choose, which VotacionBracket to update.
     */
    where: VotacionBracketWhereUniqueInput;
  };

  /**
   * VotacionBracket updateMany
   */
  export type VotacionBracketUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update VotacionBrackets.
     */
    data: XOR<
      VotacionBracketUpdateManyMutationInput,
      VotacionBracketUncheckedUpdateManyInput
    >;
    /**
     * Filter which VotacionBrackets to update
     */
    where?: VotacionBracketWhereInput;
    /**
     * Limit how many VotacionBrackets to update.
     */
    limit?: number;
  };

  /**
   * VotacionBracket updateManyAndReturn
   */
  export type VotacionBracketUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * The data used to update VotacionBrackets.
     */
    data: XOR<
      VotacionBracketUpdateManyMutationInput,
      VotacionBracketUncheckedUpdateManyInput
    >;
    /**
     * Filter which VotacionBrackets to update
     */
    where?: VotacionBracketWhereInput;
    /**
     * Limit how many VotacionBrackets to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * VotacionBracket upsert
   */
  export type VotacionBracketUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * The filter to search for the VotacionBracket to update in case it exists.
     */
    where: VotacionBracketWhereUniqueInput;
    /**
     * In case the VotacionBracket found by the `where` argument doesn't exist, create a new VotacionBracket with this data.
     */
    create: XOR<
      VotacionBracketCreateInput,
      VotacionBracketUncheckedCreateInput
    >;
    /**
     * In case the VotacionBracket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      VotacionBracketUpdateInput,
      VotacionBracketUncheckedUpdateInput
    >;
  };

  /**
   * VotacionBracket delete
   */
  export type VotacionBracketDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
    /**
     * Filter which VotacionBracket to delete.
     */
    where: VotacionBracketWhereUniqueInput;
  };

  /**
   * VotacionBracket deleteMany
   */
  export type VotacionBracketDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which VotacionBrackets to delete
     */
    where?: VotacionBracketWhereInput;
    /**
     * Limit how many VotacionBrackets to delete.
     */
    limit?: number;
  };

  /**
   * VotacionBracket.matches
   */
  export type VotacionBracket$matchesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    where?: BracketMatchWhereInput;
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    cursor?: BracketMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * VotacionBracket without action
   */
  export type VotacionBracketDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VotacionBracket
     */
    select?: VotacionBracketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VotacionBracket
     */
    omit?: VotacionBracketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VotacionBracketInclude<ExtArgs> | null;
  };

  /**
   * Model BracketMatch
   */

  export type AggregateBracketMatch = {
    _count: BracketMatchCountAggregateOutputType | null;
    _avg: BracketMatchAvgAggregateOutputType | null;
    _sum: BracketMatchSumAggregateOutputType | null;
    _min: BracketMatchMinAggregateOutputType | null;
    _max: BracketMatchMaxAggregateOutputType | null;
  };

  export type BracketMatchAvgAggregateOutputType = {
    ronda: number | null;
    votosA: number | null;
    votosB: number | null;
  };

  export type BracketMatchSumAggregateOutputType = {
    ronda: number | null;
    votosA: number | null;
    votosB: number | null;
  };

  export type BracketMatchMinAggregateOutputType = {
    id: string | null;
    bracketId: string | null;
    ronda: number | null;
    itemAId: string | null;
    itemBId: string | null;
    votosA: number | null;
    votosB: number | null;
    ganadorId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type BracketMatchMaxAggregateOutputType = {
    id: string | null;
    bracketId: string | null;
    ronda: number | null;
    itemAId: string | null;
    itemBId: string | null;
    votosA: number | null;
    votosB: number | null;
    ganadorId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type BracketMatchCountAggregateOutputType = {
    id: number;
    bracketId: number;
    ronda: number;
    itemAId: number;
    itemBId: number;
    votosA: number;
    votosB: number;
    ganadorId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type BracketMatchAvgAggregateInputType = {
    ronda?: true;
    votosA?: true;
    votosB?: true;
  };

  export type BracketMatchSumAggregateInputType = {
    ronda?: true;
    votosA?: true;
    votosB?: true;
  };

  export type BracketMatchMinAggregateInputType = {
    id?: true;
    bracketId?: true;
    ronda?: true;
    itemAId?: true;
    itemBId?: true;
    votosA?: true;
    votosB?: true;
    ganadorId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type BracketMatchMaxAggregateInputType = {
    id?: true;
    bracketId?: true;
    ronda?: true;
    itemAId?: true;
    itemBId?: true;
    votosA?: true;
    votosB?: true;
    ganadorId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type BracketMatchCountAggregateInputType = {
    id?: true;
    bracketId?: true;
    ronda?: true;
    itemAId?: true;
    itemBId?: true;
    votosA?: true;
    votosB?: true;
    ganadorId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type BracketMatchAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which BracketMatch to aggregate.
     */
    where?: BracketMatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketMatches to fetch.
     */
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BracketMatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketMatches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketMatches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BracketMatches
     **/
    _count?: true | BracketMatchCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: BracketMatchAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: BracketMatchSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: BracketMatchMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: BracketMatchMaxAggregateInputType;
  };

  export type GetBracketMatchAggregateType<
    T extends BracketMatchAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateBracketMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBracketMatch[P]>
      : GetScalarType<T[P], AggregateBracketMatch[P]>;
  };

  export type BracketMatchGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BracketMatchWhereInput;
    orderBy?:
      | BracketMatchOrderByWithAggregationInput
      | BracketMatchOrderByWithAggregationInput[];
    by: BracketMatchScalarFieldEnum[] | BracketMatchScalarFieldEnum;
    having?: BracketMatchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BracketMatchCountAggregateInputType | true;
    _avg?: BracketMatchAvgAggregateInputType;
    _sum?: BracketMatchSumAggregateInputType;
    _min?: BracketMatchMinAggregateInputType;
    _max?: BracketMatchMaxAggregateInputType;
  };

  export type BracketMatchGroupByOutputType = {
    id: string;
    bracketId: string;
    ronda: number;
    itemAId: string | null;
    itemBId: string | null;
    votosA: number;
    votosB: number;
    ganadorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BracketMatchCountAggregateOutputType | null;
    _avg: BracketMatchAvgAggregateOutputType | null;
    _sum: BracketMatchSumAggregateOutputType | null;
    _min: BracketMatchMinAggregateOutputType | null;
    _max: BracketMatchMaxAggregateOutputType | null;
  };

  type GetBracketMatchGroupByPayload<T extends BracketMatchGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<BracketMatchGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof BracketMatchGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BracketMatchGroupByOutputType[P]>
            : GetScalarType<T[P], BracketMatchGroupByOutputType[P]>;
        }
      >
    >;

  export type BracketMatchSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      bracketId?: boolean;
      ronda?: boolean;
      itemAId?: boolean;
      itemBId?: boolean;
      votosA?: boolean;
      votosB?: boolean;
      ganadorId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      bracket?: boolean | VotacionBracketDefaultArgs<ExtArgs>;
      itemA?: boolean | BracketMatch$itemAArgs<ExtArgs>;
      itemB?: boolean | BracketMatch$itemBArgs<ExtArgs>;
      ganador?: boolean | BracketMatch$ganadorArgs<ExtArgs>;
    },
    ExtArgs['result']['bracketMatch']
  >;

  export type BracketMatchSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      bracketId?: boolean;
      ronda?: boolean;
      itemAId?: boolean;
      itemBId?: boolean;
      votosA?: boolean;
      votosB?: boolean;
      ganadorId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      bracket?: boolean | VotacionBracketDefaultArgs<ExtArgs>;
      itemA?: boolean | BracketMatch$itemAArgs<ExtArgs>;
      itemB?: boolean | BracketMatch$itemBArgs<ExtArgs>;
      ganador?: boolean | BracketMatch$ganadorArgs<ExtArgs>;
    },
    ExtArgs['result']['bracketMatch']
  >;

  export type BracketMatchSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      bracketId?: boolean;
      ronda?: boolean;
      itemAId?: boolean;
      itemBId?: boolean;
      votosA?: boolean;
      votosB?: boolean;
      ganadorId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      bracket?: boolean | VotacionBracketDefaultArgs<ExtArgs>;
      itemA?: boolean | BracketMatch$itemAArgs<ExtArgs>;
      itemB?: boolean | BracketMatch$itemBArgs<ExtArgs>;
      ganador?: boolean | BracketMatch$ganadorArgs<ExtArgs>;
    },
    ExtArgs['result']['bracketMatch']
  >;

  export type BracketMatchSelectScalar = {
    id?: boolean;
    bracketId?: boolean;
    ronda?: boolean;
    itemAId?: boolean;
    itemBId?: boolean;
    votosA?: boolean;
    votosB?: boolean;
    ganadorId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type BracketMatchOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'bracketId'
    | 'ronda'
    | 'itemAId'
    | 'itemBId'
    | 'votosA'
    | 'votosB'
    | 'ganadorId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['bracketMatch']
  >;
  export type BracketMatchInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    bracket?: boolean | VotacionBracketDefaultArgs<ExtArgs>;
    itemA?: boolean | BracketMatch$itemAArgs<ExtArgs>;
    itemB?: boolean | BracketMatch$itemBArgs<ExtArgs>;
    ganador?: boolean | BracketMatch$ganadorArgs<ExtArgs>;
  };
  export type BracketMatchIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    bracket?: boolean | VotacionBracketDefaultArgs<ExtArgs>;
    itemA?: boolean | BracketMatch$itemAArgs<ExtArgs>;
    itemB?: boolean | BracketMatch$itemBArgs<ExtArgs>;
    ganador?: boolean | BracketMatch$ganadorArgs<ExtArgs>;
  };
  export type BracketMatchIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    bracket?: boolean | VotacionBracketDefaultArgs<ExtArgs>;
    itemA?: boolean | BracketMatch$itemAArgs<ExtArgs>;
    itemB?: boolean | BracketMatch$itemBArgs<ExtArgs>;
    ganador?: boolean | BracketMatch$ganadorArgs<ExtArgs>;
  };

  export type $BracketMatchPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'BracketMatch';
    objects: {
      bracket: Prisma.$VotacionBracketPayload<ExtArgs>;
      itemA: Prisma.$ItemCalificablePayload<ExtArgs> | null;
      itemB: Prisma.$ItemCalificablePayload<ExtArgs> | null;
      ganador: Prisma.$ItemCalificablePayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        bracketId: string;
        ronda: number;
        itemAId: string | null;
        itemBId: string | null;
        votosA: number;
        votosB: number;
        ganadorId: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['bracketMatch']
    >;
    composites: {};
  };

  type BracketMatchGetPayload<
    S extends boolean | null | undefined | BracketMatchDefaultArgs,
  > = $Result.GetResult<Prisma.$BracketMatchPayload, S>;

  type BracketMatchCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    BracketMatchFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: BracketMatchCountAggregateInputType | true;
  };

  export interface BracketMatchDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['BracketMatch'];
      meta: { name: 'BracketMatch' };
    };
    /**
     * Find zero or one BracketMatch that matches the filter.
     * @param {BracketMatchFindUniqueArgs} args - Arguments to find a BracketMatch
     * @example
     * // Get one BracketMatch
     * const bracketMatch = await prisma.bracketMatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BracketMatchFindUniqueArgs>(
      args: SelectSubset<T, BracketMatchFindUniqueArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one BracketMatch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BracketMatchFindUniqueOrThrowArgs} args - Arguments to find a BracketMatch
     * @example
     * // Get one BracketMatch
     * const bracketMatch = await prisma.bracketMatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BracketMatchFindUniqueOrThrowArgs>(
      args: SelectSubset<T, BracketMatchFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first BracketMatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchFindFirstArgs} args - Arguments to find a BracketMatch
     * @example
     * // Get one BracketMatch
     * const bracketMatch = await prisma.bracketMatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BracketMatchFindFirstArgs>(
      args?: SelectSubset<T, BracketMatchFindFirstArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first BracketMatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchFindFirstOrThrowArgs} args - Arguments to find a BracketMatch
     * @example
     * // Get one BracketMatch
     * const bracketMatch = await prisma.bracketMatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BracketMatchFindFirstOrThrowArgs>(
      args?: SelectSubset<T, BracketMatchFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more BracketMatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BracketMatches
     * const bracketMatches = await prisma.bracketMatch.findMany()
     *
     * // Get first 10 BracketMatches
     * const bracketMatches = await prisma.bracketMatch.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const bracketMatchWithIdOnly = await prisma.bracketMatch.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BracketMatchFindManyArgs>(
      args?: SelectSubset<T, BracketMatchFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a BracketMatch.
     * @param {BracketMatchCreateArgs} args - Arguments to create a BracketMatch.
     * @example
     * // Create one BracketMatch
     * const BracketMatch = await prisma.bracketMatch.create({
     *   data: {
     *     // ... data to create a BracketMatch
     *   }
     * })
     *
     */
    create<T extends BracketMatchCreateArgs>(
      args: SelectSubset<T, BracketMatchCreateArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many BracketMatches.
     * @param {BracketMatchCreateManyArgs} args - Arguments to create many BracketMatches.
     * @example
     * // Create many BracketMatches
     * const bracketMatch = await prisma.bracketMatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BracketMatchCreateManyArgs>(
      args?: SelectSubset<T, BracketMatchCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many BracketMatches and returns the data saved in the database.
     * @param {BracketMatchCreateManyAndReturnArgs} args - Arguments to create many BracketMatches.
     * @example
     * // Create many BracketMatches
     * const bracketMatch = await prisma.bracketMatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many BracketMatches and only return the `id`
     * const bracketMatchWithIdOnly = await prisma.bracketMatch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BracketMatchCreateManyAndReturnArgs>(
      args?: SelectSubset<T, BracketMatchCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a BracketMatch.
     * @param {BracketMatchDeleteArgs} args - Arguments to delete one BracketMatch.
     * @example
     * // Delete one BracketMatch
     * const BracketMatch = await prisma.bracketMatch.delete({
     *   where: {
     *     // ... filter to delete one BracketMatch
     *   }
     * })
     *
     */
    delete<T extends BracketMatchDeleteArgs>(
      args: SelectSubset<T, BracketMatchDeleteArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one BracketMatch.
     * @param {BracketMatchUpdateArgs} args - Arguments to update one BracketMatch.
     * @example
     * // Update one BracketMatch
     * const bracketMatch = await prisma.bracketMatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BracketMatchUpdateArgs>(
      args: SelectSubset<T, BracketMatchUpdateArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more BracketMatches.
     * @param {BracketMatchDeleteManyArgs} args - Arguments to filter BracketMatches to delete.
     * @example
     * // Delete a few BracketMatches
     * const { count } = await prisma.bracketMatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BracketMatchDeleteManyArgs>(
      args?: SelectSubset<T, BracketMatchDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more BracketMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BracketMatches
     * const bracketMatch = await prisma.bracketMatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BracketMatchUpdateManyArgs>(
      args: SelectSubset<T, BracketMatchUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more BracketMatches and returns the data updated in the database.
     * @param {BracketMatchUpdateManyAndReturnArgs} args - Arguments to update many BracketMatches.
     * @example
     * // Update many BracketMatches
     * const bracketMatch = await prisma.bracketMatch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more BracketMatches and only return the `id`
     * const bracketMatchWithIdOnly = await prisma.bracketMatch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BracketMatchUpdateManyAndReturnArgs>(
      args: SelectSubset<T, BracketMatchUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one BracketMatch.
     * @param {BracketMatchUpsertArgs} args - Arguments to update or create a BracketMatch.
     * @example
     * // Update or create a BracketMatch
     * const bracketMatch = await prisma.bracketMatch.upsert({
     *   create: {
     *     // ... data to create a BracketMatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BracketMatch we want to update
     *   }
     * })
     */
    upsert<T extends BracketMatchUpsertArgs>(
      args: SelectSubset<T, BracketMatchUpsertArgs<ExtArgs>>,
    ): Prisma__BracketMatchClient<
      $Result.GetResult<
        Prisma.$BracketMatchPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of BracketMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchCountArgs} args - Arguments to filter BracketMatches to count.
     * @example
     * // Count the number of BracketMatches
     * const count = await prisma.bracketMatch.count({
     *   where: {
     *     // ... the filter for the BracketMatches we want to count
     *   }
     * })
     **/
    count<T extends BracketMatchCountArgs>(
      args?: Subset<T, BracketMatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BracketMatchCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a BracketMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends BracketMatchAggregateArgs>(
      args: Subset<T, BracketMatchAggregateArgs>,
    ): Prisma.PrismaPromise<GetBracketMatchAggregateType<T>>;

    /**
     * Group by BracketMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BracketMatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends BracketMatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BracketMatchGroupByArgs['orderBy'] }
        : { orderBy?: BracketMatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, BracketMatchGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetBracketMatchGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the BracketMatch model
     */
    readonly fields: BracketMatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BracketMatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BracketMatchClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    bracket<T extends VotacionBracketDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, VotacionBracketDefaultArgs<ExtArgs>>,
    ): Prisma__VotacionBracketClient<
      | $Result.GetResult<
          Prisma.$VotacionBracketPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    itemA<T extends BracketMatch$itemAArgs<ExtArgs> = {}>(
      args?: Subset<T, BracketMatch$itemAArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    itemB<T extends BracketMatch$itemBArgs<ExtArgs> = {}>(
      args?: Subset<T, BracketMatch$itemBArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    ganador<T extends BracketMatch$ganadorArgs<ExtArgs> = {}>(
      args?: Subset<T, BracketMatch$ganadorArgs<ExtArgs>>,
    ): Prisma__ItemCalificableClient<
      $Result.GetResult<
        Prisma.$ItemCalificablePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the BracketMatch model
   */
  interface BracketMatchFieldRefs {
    readonly id: FieldRef<'BracketMatch', 'String'>;
    readonly bracketId: FieldRef<'BracketMatch', 'String'>;
    readonly ronda: FieldRef<'BracketMatch', 'Int'>;
    readonly itemAId: FieldRef<'BracketMatch', 'String'>;
    readonly itemBId: FieldRef<'BracketMatch', 'String'>;
    readonly votosA: FieldRef<'BracketMatch', 'Int'>;
    readonly votosB: FieldRef<'BracketMatch', 'Int'>;
    readonly ganadorId: FieldRef<'BracketMatch', 'String'>;
    readonly createdAt: FieldRef<'BracketMatch', 'DateTime'>;
    readonly updatedAt: FieldRef<'BracketMatch', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * BracketMatch findUnique
   */
  export type BracketMatchFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * Filter, which BracketMatch to fetch.
     */
    where: BracketMatchWhereUniqueInput;
  };

  /**
   * BracketMatch findUniqueOrThrow
   */
  export type BracketMatchFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * Filter, which BracketMatch to fetch.
     */
    where: BracketMatchWhereUniqueInput;
  };

  /**
   * BracketMatch findFirst
   */
  export type BracketMatchFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * Filter, which BracketMatch to fetch.
     */
    where?: BracketMatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketMatches to fetch.
     */
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BracketMatches.
     */
    cursor?: BracketMatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketMatches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketMatches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BracketMatches.
     */
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * BracketMatch findFirstOrThrow
   */
  export type BracketMatchFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * Filter, which BracketMatch to fetch.
     */
    where?: BracketMatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketMatches to fetch.
     */
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BracketMatches.
     */
    cursor?: BracketMatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketMatches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketMatches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BracketMatches.
     */
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * BracketMatch findMany
   */
  export type BracketMatchFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * Filter, which BracketMatches to fetch.
     */
    where?: BracketMatchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BracketMatches to fetch.
     */
    orderBy?:
      | BracketMatchOrderByWithRelationInput
      | BracketMatchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BracketMatches.
     */
    cursor?: BracketMatchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BracketMatches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BracketMatches.
     */
    skip?: number;
    distinct?: BracketMatchScalarFieldEnum | BracketMatchScalarFieldEnum[];
  };

  /**
   * BracketMatch create
   */
  export type BracketMatchCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * The data needed to create a BracketMatch.
     */
    data: XOR<BracketMatchCreateInput, BracketMatchUncheckedCreateInput>;
  };

  /**
   * BracketMatch createMany
   */
  export type BracketMatchCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many BracketMatches.
     */
    data: BracketMatchCreateManyInput | BracketMatchCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * BracketMatch createManyAndReturn
   */
  export type BracketMatchCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * The data used to create many BracketMatches.
     */
    data: BracketMatchCreateManyInput | BracketMatchCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * BracketMatch update
   */
  export type BracketMatchUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * The data needed to update a BracketMatch.
     */
    data: XOR<BracketMatchUpdateInput, BracketMatchUncheckedUpdateInput>;
    /**
     * Choose, which BracketMatch to update.
     */
    where: BracketMatchWhereUniqueInput;
  };

  /**
   * BracketMatch updateMany
   */
  export type BracketMatchUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update BracketMatches.
     */
    data: XOR<
      BracketMatchUpdateManyMutationInput,
      BracketMatchUncheckedUpdateManyInput
    >;
    /**
     * Filter which BracketMatches to update
     */
    where?: BracketMatchWhereInput;
    /**
     * Limit how many BracketMatches to update.
     */
    limit?: number;
  };

  /**
   * BracketMatch updateManyAndReturn
   */
  export type BracketMatchUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * The data used to update BracketMatches.
     */
    data: XOR<
      BracketMatchUpdateManyMutationInput,
      BracketMatchUncheckedUpdateManyInput
    >;
    /**
     * Filter which BracketMatches to update
     */
    where?: BracketMatchWhereInput;
    /**
     * Limit how many BracketMatches to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * BracketMatch upsert
   */
  export type BracketMatchUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * The filter to search for the BracketMatch to update in case it exists.
     */
    where: BracketMatchWhereUniqueInput;
    /**
     * In case the BracketMatch found by the `where` argument doesn't exist, create a new BracketMatch with this data.
     */
    create: XOR<BracketMatchCreateInput, BracketMatchUncheckedCreateInput>;
    /**
     * In case the BracketMatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BracketMatchUpdateInput, BracketMatchUncheckedUpdateInput>;
  };

  /**
   * BracketMatch delete
   */
  export type BracketMatchDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
    /**
     * Filter which BracketMatch to delete.
     */
    where: BracketMatchWhereUniqueInput;
  };

  /**
   * BracketMatch deleteMany
   */
  export type BracketMatchDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which BracketMatches to delete
     */
    where?: BracketMatchWhereInput;
    /**
     * Limit how many BracketMatches to delete.
     */
    limit?: number;
  };

  /**
   * BracketMatch.itemA
   */
  export type BracketMatch$itemAArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    where?: ItemCalificableWhereInput;
  };

  /**
   * BracketMatch.itemB
   */
  export type BracketMatch$itemBArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    where?: ItemCalificableWhereInput;
  };

  /**
   * BracketMatch.ganador
   */
  export type BracketMatch$ganadorArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ItemCalificable
     */
    select?: ItemCalificableSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ItemCalificable
     */
    omit?: ItemCalificableOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemCalificableInclude<ExtArgs> | null;
    where?: ItemCalificableWhereInput;
  };

  /**
   * BracketMatch without action
   */
  export type BracketMatchDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the BracketMatch
     */
    select?: BracketMatchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BracketMatch
     */
    omit?: BracketMatchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BracketMatchInclude<ExtArgs> | null;
  };

  /**
   * Model Sorteo
   */

  export type AggregateSorteo = {
    _count: SorteoCountAggregateOutputType | null;
    _min: SorteoMinAggregateOutputType | null;
    _max: SorteoMaxAggregateOutputType | null;
  };

  export type SorteoMinAggregateOutputType = {
    id: string | null;
    titulo: string | null;
    descripcion: string | null;
    premio: string | null;
    fechaFin: Date | null;
    estado: string | null;
    juegoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type SorteoMaxAggregateOutputType = {
    id: string | null;
    titulo: string | null;
    descripcion: string | null;
    premio: string | null;
    fechaFin: Date | null;
    estado: string | null;
    juegoId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type SorteoCountAggregateOutputType = {
    id: number;
    titulo: number;
    descripcion: number;
    premio: number;
    fechaFin: number;
    estado: number;
    juegoId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type SorteoMinAggregateInputType = {
    id?: true;
    titulo?: true;
    descripcion?: true;
    premio?: true;
    fechaFin?: true;
    estado?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type SorteoMaxAggregateInputType = {
    id?: true;
    titulo?: true;
    descripcion?: true;
    premio?: true;
    fechaFin?: true;
    estado?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type SorteoCountAggregateInputType = {
    id?: true;
    titulo?: true;
    descripcion?: true;
    premio?: true;
    fechaFin?: true;
    estado?: true;
    juegoId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type SorteoAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Sorteo to aggregate.
     */
    where?: SorteoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sorteos to fetch.
     */
    orderBy?: SorteoOrderByWithRelationInput | SorteoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SorteoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sorteos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sorteos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Sorteos
     **/
    _count?: true | SorteoCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SorteoMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SorteoMaxAggregateInputType;
  };

  export type GetSorteoAggregateType<T extends SorteoAggregateArgs> = {
    [P in keyof T & keyof AggregateSorteo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSorteo[P]>
      : GetScalarType<T[P], AggregateSorteo[P]>;
  };

  export type SorteoGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SorteoWhereInput;
    orderBy?:
      | SorteoOrderByWithAggregationInput
      | SorteoOrderByWithAggregationInput[];
    by: SorteoScalarFieldEnum[] | SorteoScalarFieldEnum;
    having?: SorteoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SorteoCountAggregateInputType | true;
    _min?: SorteoMinAggregateInputType;
    _max?: SorteoMaxAggregateInputType;
  };

  export type SorteoGroupByOutputType = {
    id: string;
    titulo: string;
    descripcion: string | null;
    premio: string;
    fechaFin: Date;
    estado: string;
    juegoId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SorteoCountAggregateOutputType | null;
    _min: SorteoMinAggregateOutputType | null;
    _max: SorteoMaxAggregateOutputType | null;
  };

  type GetSorteoGroupByPayload<T extends SorteoGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<SorteoGroupByOutputType, T['by']> & {
          [P in keyof T & keyof SorteoGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SorteoGroupByOutputType[P]>
            : GetScalarType<T[P], SorteoGroupByOutputType[P]>;
        }
      >
    >;

  export type SorteoSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      titulo?: boolean;
      descripcion?: boolean;
      premio?: boolean;
      fechaFin?: boolean;
      estado?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | Sorteo$juegoArgs<ExtArgs>;
    },
    ExtArgs['result']['sorteo']
  >;

  export type SorteoSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      titulo?: boolean;
      descripcion?: boolean;
      premio?: boolean;
      fechaFin?: boolean;
      estado?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | Sorteo$juegoArgs<ExtArgs>;
    },
    ExtArgs['result']['sorteo']
  >;

  export type SorteoSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      titulo?: boolean;
      descripcion?: boolean;
      premio?: boolean;
      fechaFin?: boolean;
      estado?: boolean;
      juegoId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      juego?: boolean | Sorteo$juegoArgs<ExtArgs>;
    },
    ExtArgs['result']['sorteo']
  >;

  export type SorteoSelectScalar = {
    id?: boolean;
    titulo?: boolean;
    descripcion?: boolean;
    premio?: boolean;
    fechaFin?: boolean;
    estado?: boolean;
    juegoId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type SorteoOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'titulo'
    | 'descripcion'
    | 'premio'
    | 'fechaFin'
    | 'estado'
    | 'juegoId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['sorteo']
  >;
  export type SorteoInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | Sorteo$juegoArgs<ExtArgs>;
  };
  export type SorteoIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | Sorteo$juegoArgs<ExtArgs>;
  };
  export type SorteoIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    juego?: boolean | Sorteo$juegoArgs<ExtArgs>;
  };

  export type $SorteoPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Sorteo';
    objects: {
      juego: Prisma.$JuegoPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        titulo: string;
        descripcion: string | null;
        premio: string;
        fechaFin: Date;
        estado: string;
        juegoId: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['sorteo']
    >;
    composites: {};
  };

  type SorteoGetPayload<
    S extends boolean | null | undefined | SorteoDefaultArgs,
  > = $Result.GetResult<Prisma.$SorteoPayload, S>;

  type SorteoCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<SorteoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SorteoCountAggregateInputType | true;
  };

  export interface SorteoDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Sorteo'];
      meta: { name: 'Sorteo' };
    };
    /**
     * Find zero or one Sorteo that matches the filter.
     * @param {SorteoFindUniqueArgs} args - Arguments to find a Sorteo
     * @example
     * // Get one Sorteo
     * const sorteo = await prisma.sorteo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SorteoFindUniqueArgs>(
      args: SelectSubset<T, SorteoFindUniqueArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Sorteo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SorteoFindUniqueOrThrowArgs} args - Arguments to find a Sorteo
     * @example
     * // Get one Sorteo
     * const sorteo = await prisma.sorteo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SorteoFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SorteoFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Sorteo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoFindFirstArgs} args - Arguments to find a Sorteo
     * @example
     * // Get one Sorteo
     * const sorteo = await prisma.sorteo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SorteoFindFirstArgs>(
      args?: SelectSubset<T, SorteoFindFirstArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Sorteo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoFindFirstOrThrowArgs} args - Arguments to find a Sorteo
     * @example
     * // Get one Sorteo
     * const sorteo = await prisma.sorteo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SorteoFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SorteoFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Sorteos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sorteos
     * const sorteos = await prisma.sorteo.findMany()
     *
     * // Get first 10 Sorteos
     * const sorteos = await prisma.sorteo.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sorteoWithIdOnly = await prisma.sorteo.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SorteoFindManyArgs>(
      args?: SelectSubset<T, SorteoFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Sorteo.
     * @param {SorteoCreateArgs} args - Arguments to create a Sorteo.
     * @example
     * // Create one Sorteo
     * const Sorteo = await prisma.sorteo.create({
     *   data: {
     *     // ... data to create a Sorteo
     *   }
     * })
     *
     */
    create<T extends SorteoCreateArgs>(
      args: SelectSubset<T, SorteoCreateArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Sorteos.
     * @param {SorteoCreateManyArgs} args - Arguments to create many Sorteos.
     * @example
     * // Create many Sorteos
     * const sorteo = await prisma.sorteo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SorteoCreateManyArgs>(
      args?: SelectSubset<T, SorteoCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Sorteos and returns the data saved in the database.
     * @param {SorteoCreateManyAndReturnArgs} args - Arguments to create many Sorteos.
     * @example
     * // Create many Sorteos
     * const sorteo = await prisma.sorteo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Sorteos and only return the `id`
     * const sorteoWithIdOnly = await prisma.sorteo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SorteoCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SorteoCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Sorteo.
     * @param {SorteoDeleteArgs} args - Arguments to delete one Sorteo.
     * @example
     * // Delete one Sorteo
     * const Sorteo = await prisma.sorteo.delete({
     *   where: {
     *     // ... filter to delete one Sorteo
     *   }
     * })
     *
     */
    delete<T extends SorteoDeleteArgs>(
      args: SelectSubset<T, SorteoDeleteArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Sorteo.
     * @param {SorteoUpdateArgs} args - Arguments to update one Sorteo.
     * @example
     * // Update one Sorteo
     * const sorteo = await prisma.sorteo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SorteoUpdateArgs>(
      args: SelectSubset<T, SorteoUpdateArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Sorteos.
     * @param {SorteoDeleteManyArgs} args - Arguments to filter Sorteos to delete.
     * @example
     * // Delete a few Sorteos
     * const { count } = await prisma.sorteo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SorteoDeleteManyArgs>(
      args?: SelectSubset<T, SorteoDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sorteos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sorteos
     * const sorteo = await prisma.sorteo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SorteoUpdateManyArgs>(
      args: SelectSubset<T, SorteoUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sorteos and returns the data updated in the database.
     * @param {SorteoUpdateManyAndReturnArgs} args - Arguments to update many Sorteos.
     * @example
     * // Update many Sorteos
     * const sorteo = await prisma.sorteo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Sorteos and only return the `id`
     * const sorteoWithIdOnly = await prisma.sorteo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SorteoUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SorteoUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Sorteo.
     * @param {SorteoUpsertArgs} args - Arguments to update or create a Sorteo.
     * @example
     * // Update or create a Sorteo
     * const sorteo = await prisma.sorteo.upsert({
     *   create: {
     *     // ... data to create a Sorteo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sorteo we want to update
     *   }
     * })
     */
    upsert<T extends SorteoUpsertArgs>(
      args: SelectSubset<T, SorteoUpsertArgs<ExtArgs>>,
    ): Prisma__SorteoClient<
      $Result.GetResult<
        Prisma.$SorteoPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Sorteos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoCountArgs} args - Arguments to filter Sorteos to count.
     * @example
     * // Count the number of Sorteos
     * const count = await prisma.sorteo.count({
     *   where: {
     *     // ... the filter for the Sorteos we want to count
     *   }
     * })
     **/
    count<T extends SorteoCountArgs>(
      args?: Subset<T, SorteoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SorteoCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Sorteo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SorteoAggregateArgs>(
      args: Subset<T, SorteoAggregateArgs>,
    ): Prisma.PrismaPromise<GetSorteoAggregateType<T>>;

    /**
     * Group by Sorteo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SorteoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SorteoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SorteoGroupByArgs['orderBy'] }
        : { orderBy?: SorteoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SorteoGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetSorteoGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Sorteo model
     */
    readonly fields: SorteoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sorteo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SorteoClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    juego<T extends Sorteo$juegoArgs<ExtArgs> = {}>(
      args?: Subset<T, Sorteo$juegoArgs<ExtArgs>>,
    ): Prisma__JuegoClient<
      $Result.GetResult<
        Prisma.$JuegoPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Sorteo model
   */
  interface SorteoFieldRefs {
    readonly id: FieldRef<'Sorteo', 'String'>;
    readonly titulo: FieldRef<'Sorteo', 'String'>;
    readonly descripcion: FieldRef<'Sorteo', 'String'>;
    readonly premio: FieldRef<'Sorteo', 'String'>;
    readonly fechaFin: FieldRef<'Sorteo', 'DateTime'>;
    readonly estado: FieldRef<'Sorteo', 'String'>;
    readonly juegoId: FieldRef<'Sorteo', 'String'>;
    readonly createdAt: FieldRef<'Sorteo', 'DateTime'>;
    readonly updatedAt: FieldRef<'Sorteo', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Sorteo findUnique
   */
  export type SorteoFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * Filter, which Sorteo to fetch.
     */
    where: SorteoWhereUniqueInput;
  };

  /**
   * Sorteo findUniqueOrThrow
   */
  export type SorteoFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * Filter, which Sorteo to fetch.
     */
    where: SorteoWhereUniqueInput;
  };

  /**
   * Sorteo findFirst
   */
  export type SorteoFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * Filter, which Sorteo to fetch.
     */
    where?: SorteoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sorteos to fetch.
     */
    orderBy?: SorteoOrderByWithRelationInput | SorteoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sorteos.
     */
    cursor?: SorteoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sorteos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sorteos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sorteos.
     */
    distinct?: SorteoScalarFieldEnum | SorteoScalarFieldEnum[];
  };

  /**
   * Sorteo findFirstOrThrow
   */
  export type SorteoFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * Filter, which Sorteo to fetch.
     */
    where?: SorteoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sorteos to fetch.
     */
    orderBy?: SorteoOrderByWithRelationInput | SorteoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sorteos.
     */
    cursor?: SorteoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sorteos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sorteos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sorteos.
     */
    distinct?: SorteoScalarFieldEnum | SorteoScalarFieldEnum[];
  };

  /**
   * Sorteo findMany
   */
  export type SorteoFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * Filter, which Sorteos to fetch.
     */
    where?: SorteoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sorteos to fetch.
     */
    orderBy?: SorteoOrderByWithRelationInput | SorteoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Sorteos.
     */
    cursor?: SorteoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sorteos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sorteos.
     */
    skip?: number;
    distinct?: SorteoScalarFieldEnum | SorteoScalarFieldEnum[];
  };

  /**
   * Sorteo create
   */
  export type SorteoCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * The data needed to create a Sorteo.
     */
    data: XOR<SorteoCreateInput, SorteoUncheckedCreateInput>;
  };

  /**
   * Sorteo createMany
   */
  export type SorteoCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Sorteos.
     */
    data: SorteoCreateManyInput | SorteoCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Sorteo createManyAndReturn
   */
  export type SorteoCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * The data used to create many Sorteos.
     */
    data: SorteoCreateManyInput | SorteoCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Sorteo update
   */
  export type SorteoUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * The data needed to update a Sorteo.
     */
    data: XOR<SorteoUpdateInput, SorteoUncheckedUpdateInput>;
    /**
     * Choose, which Sorteo to update.
     */
    where: SorteoWhereUniqueInput;
  };

  /**
   * Sorteo updateMany
   */
  export type SorteoUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Sorteos.
     */
    data: XOR<SorteoUpdateManyMutationInput, SorteoUncheckedUpdateManyInput>;
    /**
     * Filter which Sorteos to update
     */
    where?: SorteoWhereInput;
    /**
     * Limit how many Sorteos to update.
     */
    limit?: number;
  };

  /**
   * Sorteo updateManyAndReturn
   */
  export type SorteoUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * The data used to update Sorteos.
     */
    data: XOR<SorteoUpdateManyMutationInput, SorteoUncheckedUpdateManyInput>;
    /**
     * Filter which Sorteos to update
     */
    where?: SorteoWhereInput;
    /**
     * Limit how many Sorteos to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Sorteo upsert
   */
  export type SorteoUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * The filter to search for the Sorteo to update in case it exists.
     */
    where: SorteoWhereUniqueInput;
    /**
     * In case the Sorteo found by the `where` argument doesn't exist, create a new Sorteo with this data.
     */
    create: XOR<SorteoCreateInput, SorteoUncheckedCreateInput>;
    /**
     * In case the Sorteo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SorteoUpdateInput, SorteoUncheckedUpdateInput>;
  };

  /**
   * Sorteo delete
   */
  export type SorteoDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
    /**
     * Filter which Sorteo to delete.
     */
    where: SorteoWhereUniqueInput;
  };

  /**
   * Sorteo deleteMany
   */
  export type SorteoDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Sorteos to delete
     */
    where?: SorteoWhereInput;
    /**
     * Limit how many Sorteos to delete.
     */
    limit?: number;
  };

  /**
   * Sorteo.juego
   */
  export type Sorteo$juegoArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Juego
     */
    select?: JuegoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Juego
     */
    omit?: JuegoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuegoInclude<ExtArgs> | null;
    where?: JuegoWhereInput;
  };

  /**
   * Sorteo without action
   */
  export type SorteoDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Sorteo
     */
    select?: SorteoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Sorteo
     */
    omit?: SorteoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SorteoInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UsuarioScalarFieldEnum: {
    id: 'id';
    email: 'email';
    password: 'password';
    nombre: 'nombre';
    rol: 'rol';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type UsuarioScalarFieldEnum =
    (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum];

  export const JuegoScalarFieldEnum: {
    id: 'id';
    nombre: 'nombre';
    slug: 'slug';
    descripcion: 'descripcion';
    image: 'image';
    activo: 'activo';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type JuegoScalarFieldEnum =
    (typeof JuegoScalarFieldEnum)[keyof typeof JuegoScalarFieldEnum];

  export const CategoriaScalarFieldEnum: {
    id: 'id';
    nombre: 'nombre';
    activa: 'activa';
    tipo: 'tipo';
    juegoId: 'juegoId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type CategoriaScalarFieldEnum =
    (typeof CategoriaScalarFieldEnum)[keyof typeof CategoriaScalarFieldEnum];

  export const ItemCalificableScalarFieldEnum: {
    id: 'id';
    nombre: 'nombre';
    categoriaId: 'categoriaId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    image: 'image';
  };

  export type ItemCalificableScalarFieldEnum =
    (typeof ItemCalificableScalarFieldEnum)[keyof typeof ItemCalificableScalarFieldEnum];

  export const CalificacionScalarFieldEnum: {
    id: 'id';
    puntuacion: 'puntuacion';
    ip: 'ip';
    itemId: 'itemId';
    createdAt: 'createdAt';
    deviceId: 'deviceId';
  };

  export type CalificacionScalarFieldEnum =
    (typeof CalificacionScalarFieldEnum)[keyof typeof CalificacionScalarFieldEnum];

  export const VotacionBracketScalarFieldEnum: {
    id: 'id';
    tematica: 'tematica';
    slug: 'slug';
    estado: 'estado';
    rondaActual: 'rondaActual';
    juegoId: 'juegoId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type VotacionBracketScalarFieldEnum =
    (typeof VotacionBracketScalarFieldEnum)[keyof typeof VotacionBracketScalarFieldEnum];

  export const BracketMatchScalarFieldEnum: {
    id: 'id';
    bracketId: 'bracketId';
    ronda: 'ronda';
    itemAId: 'itemAId';
    itemBId: 'itemBId';
    votosA: 'votosA';
    votosB: 'votosB';
    ganadorId: 'ganadorId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type BracketMatchScalarFieldEnum =
    (typeof BracketMatchScalarFieldEnum)[keyof typeof BracketMatchScalarFieldEnum];

  export const SorteoScalarFieldEnum: {
    id: 'id';
    titulo: 'titulo';
    descripcion: 'descripcion';
    premio: 'premio';
    fechaFin: 'fechaFin';
    estado: 'estado';
    juegoId: 'juegoId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type SorteoScalarFieldEnum =
    (typeof SorteoScalarFieldEnum)[keyof typeof SorteoScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'Rol'
   */
  export type EnumRolFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Rol'
  >;

  /**
   * Reference to a field of type 'Rol[]'
   */
  export type ListEnumRolFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Rol[]'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;

  /**
   * Deep Input Types
   */

  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[];
    OR?: UsuarioWhereInput[];
    NOT?: UsuarioWhereInput | UsuarioWhereInput[];
    id?: StringFilter<'Usuario'> | string;
    email?: StringFilter<'Usuario'> | string;
    password?: StringFilter<'Usuario'> | string;
    nombre?: StringFilter<'Usuario'> | string;
    rol?: EnumRolFilter<'Usuario'> | $Enums.Rol;
    createdAt?: DateTimeFilter<'Usuario'> | Date | string;
    updatedAt?: DateTimeFilter<'Usuario'> | Date | string;
  };

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    nombre?: SortOrder;
    rol?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UsuarioWhereInput | UsuarioWhereInput[];
      OR?: UsuarioWhereInput[];
      NOT?: UsuarioWhereInput | UsuarioWhereInput[];
      password?: StringFilter<'Usuario'> | string;
      nombre?: StringFilter<'Usuario'> | string;
      rol?: EnumRolFilter<'Usuario'> | $Enums.Rol;
      createdAt?: DateTimeFilter<'Usuario'> | Date | string;
      updatedAt?: DateTimeFilter<'Usuario'> | Date | string;
    },
    'id' | 'email'
  >;

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    nombre?: SortOrder;
    rol?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UsuarioCountOrderByAggregateInput;
    _max?: UsuarioMaxOrderByAggregateInput;
    _min?: UsuarioMinOrderByAggregateInput;
  };

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?:
      | UsuarioScalarWhereWithAggregatesInput
      | UsuarioScalarWhereWithAggregatesInput[];
    OR?: UsuarioScalarWhereWithAggregatesInput[];
    NOT?:
      | UsuarioScalarWhereWithAggregatesInput
      | UsuarioScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Usuario'> | string;
    email?: StringWithAggregatesFilter<'Usuario'> | string;
    password?: StringWithAggregatesFilter<'Usuario'> | string;
    nombre?: StringWithAggregatesFilter<'Usuario'> | string;
    rol?: EnumRolWithAggregatesFilter<'Usuario'> | $Enums.Rol;
    createdAt?: DateTimeWithAggregatesFilter<'Usuario'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Usuario'> | Date | string;
  };

  export type JuegoWhereInput = {
    AND?: JuegoWhereInput | JuegoWhereInput[];
    OR?: JuegoWhereInput[];
    NOT?: JuegoWhereInput | JuegoWhereInput[];
    id?: StringFilter<'Juego'> | string;
    nombre?: StringFilter<'Juego'> | string;
    slug?: StringFilter<'Juego'> | string;
    descripcion?: StringNullableFilter<'Juego'> | string | null;
    image?: StringNullableFilter<'Juego'> | string | null;
    activo?: BoolFilter<'Juego'> | boolean;
    createdAt?: DateTimeFilter<'Juego'> | Date | string;
    updatedAt?: DateTimeFilter<'Juego'> | Date | string;
    categorias?: CategoriaListRelationFilter;
    votaciones?: VotacionBracketListRelationFilter;
    sorteos?: SorteoListRelationFilter;
  };

  export type JuegoOrderByWithRelationInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    slug?: SortOrder;
    descripcion?: SortOrderInput | SortOrder;
    image?: SortOrderInput | SortOrder;
    activo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    categorias?: CategoriaOrderByRelationAggregateInput;
    votaciones?: VotacionBracketOrderByRelationAggregateInput;
    sorteos?: SorteoOrderByRelationAggregateInput;
  };

  export type JuegoWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      slug?: string;
      AND?: JuegoWhereInput | JuegoWhereInput[];
      OR?: JuegoWhereInput[];
      NOT?: JuegoWhereInput | JuegoWhereInput[];
      nombre?: StringFilter<'Juego'> | string;
      descripcion?: StringNullableFilter<'Juego'> | string | null;
      image?: StringNullableFilter<'Juego'> | string | null;
      activo?: BoolFilter<'Juego'> | boolean;
      createdAt?: DateTimeFilter<'Juego'> | Date | string;
      updatedAt?: DateTimeFilter<'Juego'> | Date | string;
      categorias?: CategoriaListRelationFilter;
      votaciones?: VotacionBracketListRelationFilter;
      sorteos?: SorteoListRelationFilter;
    },
    'id' | 'slug'
  >;

  export type JuegoOrderByWithAggregationInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    slug?: SortOrder;
    descripcion?: SortOrderInput | SortOrder;
    image?: SortOrderInput | SortOrder;
    activo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: JuegoCountOrderByAggregateInput;
    _max?: JuegoMaxOrderByAggregateInput;
    _min?: JuegoMinOrderByAggregateInput;
  };

  export type JuegoScalarWhereWithAggregatesInput = {
    AND?:
      | JuegoScalarWhereWithAggregatesInput
      | JuegoScalarWhereWithAggregatesInput[];
    OR?: JuegoScalarWhereWithAggregatesInput[];
    NOT?:
      | JuegoScalarWhereWithAggregatesInput
      | JuegoScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Juego'> | string;
    nombre?: StringWithAggregatesFilter<'Juego'> | string;
    slug?: StringWithAggregatesFilter<'Juego'> | string;
    descripcion?: StringNullableWithAggregatesFilter<'Juego'> | string | null;
    image?: StringNullableWithAggregatesFilter<'Juego'> | string | null;
    activo?: BoolWithAggregatesFilter<'Juego'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Juego'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Juego'> | Date | string;
  };

  export type CategoriaWhereInput = {
    AND?: CategoriaWhereInput | CategoriaWhereInput[];
    OR?: CategoriaWhereInput[];
    NOT?: CategoriaWhereInput | CategoriaWhereInput[];
    id?: StringFilter<'Categoria'> | string;
    nombre?: StringFilter<'Categoria'> | string;
    activa?: BoolFilter<'Categoria'> | boolean;
    tipo?: StringFilter<'Categoria'> | string;
    juegoId?: StringNullableFilter<'Categoria'> | string | null;
    createdAt?: DateTimeFilter<'Categoria'> | Date | string;
    updatedAt?: DateTimeFilter<'Categoria'> | Date | string;
    items?: ItemCalificableListRelationFilter;
    juego?: XOR<JuegoNullableScalarRelationFilter, JuegoWhereInput> | null;
  };

  export type CategoriaOrderByWithRelationInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    activa?: SortOrder;
    tipo?: SortOrder;
    juegoId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    items?: ItemCalificableOrderByRelationAggregateInput;
    juego?: JuegoOrderByWithRelationInput;
  };

  export type CategoriaWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: CategoriaWhereInput | CategoriaWhereInput[];
      OR?: CategoriaWhereInput[];
      NOT?: CategoriaWhereInput | CategoriaWhereInput[];
      nombre?: StringFilter<'Categoria'> | string;
      activa?: BoolFilter<'Categoria'> | boolean;
      tipo?: StringFilter<'Categoria'> | string;
      juegoId?: StringNullableFilter<'Categoria'> | string | null;
      createdAt?: DateTimeFilter<'Categoria'> | Date | string;
      updatedAt?: DateTimeFilter<'Categoria'> | Date | string;
      items?: ItemCalificableListRelationFilter;
      juego?: XOR<JuegoNullableScalarRelationFilter, JuegoWhereInput> | null;
    },
    'id'
  >;

  export type CategoriaOrderByWithAggregationInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    activa?: SortOrder;
    tipo?: SortOrder;
    juegoId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: CategoriaCountOrderByAggregateInput;
    _max?: CategoriaMaxOrderByAggregateInput;
    _min?: CategoriaMinOrderByAggregateInput;
  };

  export type CategoriaScalarWhereWithAggregatesInput = {
    AND?:
      | CategoriaScalarWhereWithAggregatesInput
      | CategoriaScalarWhereWithAggregatesInput[];
    OR?: CategoriaScalarWhereWithAggregatesInput[];
    NOT?:
      | CategoriaScalarWhereWithAggregatesInput
      | CategoriaScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Categoria'> | string;
    nombre?: StringWithAggregatesFilter<'Categoria'> | string;
    activa?: BoolWithAggregatesFilter<'Categoria'> | boolean;
    tipo?: StringWithAggregatesFilter<'Categoria'> | string;
    juegoId?: StringNullableWithAggregatesFilter<'Categoria'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Categoria'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Categoria'> | Date | string;
  };

  export type ItemCalificableWhereInput = {
    AND?: ItemCalificableWhereInput | ItemCalificableWhereInput[];
    OR?: ItemCalificableWhereInput[];
    NOT?: ItemCalificableWhereInput | ItemCalificableWhereInput[];
    id?: StringFilter<'ItemCalificable'> | string;
    nombre?: StringFilter<'ItemCalificable'> | string;
    categoriaId?: StringFilter<'ItemCalificable'> | string;
    createdAt?: DateTimeFilter<'ItemCalificable'> | Date | string;
    updatedAt?: DateTimeFilter<'ItemCalificable'> | Date | string;
    image?: StringNullableFilter<'ItemCalificable'> | string | null;
    calificaciones?: CalificacionListRelationFilter;
    categoria?: XOR<CategoriaScalarRelationFilter, CategoriaWhereInput>;
    matchesSideA?: BracketMatchListRelationFilter;
    matchesSideB?: BracketMatchListRelationFilter;
    matchesWon?: BracketMatchListRelationFilter;
  };

  export type ItemCalificableOrderByWithRelationInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    categoriaId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    image?: SortOrderInput | SortOrder;
    calificaciones?: CalificacionOrderByRelationAggregateInput;
    categoria?: CategoriaOrderByWithRelationInput;
    matchesSideA?: BracketMatchOrderByRelationAggregateInput;
    matchesSideB?: BracketMatchOrderByRelationAggregateInput;
    matchesWon?: BracketMatchOrderByRelationAggregateInput;
  };

  export type ItemCalificableWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ItemCalificableWhereInput | ItemCalificableWhereInput[];
      OR?: ItemCalificableWhereInput[];
      NOT?: ItemCalificableWhereInput | ItemCalificableWhereInput[];
      nombre?: StringFilter<'ItemCalificable'> | string;
      categoriaId?: StringFilter<'ItemCalificable'> | string;
      createdAt?: DateTimeFilter<'ItemCalificable'> | Date | string;
      updatedAt?: DateTimeFilter<'ItemCalificable'> | Date | string;
      image?: StringNullableFilter<'ItemCalificable'> | string | null;
      calificaciones?: CalificacionListRelationFilter;
      categoria?: XOR<CategoriaScalarRelationFilter, CategoriaWhereInput>;
      matchesSideA?: BracketMatchListRelationFilter;
      matchesSideB?: BracketMatchListRelationFilter;
      matchesWon?: BracketMatchListRelationFilter;
    },
    'id'
  >;

  export type ItemCalificableOrderByWithAggregationInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    categoriaId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    image?: SortOrderInput | SortOrder;
    _count?: ItemCalificableCountOrderByAggregateInput;
    _max?: ItemCalificableMaxOrderByAggregateInput;
    _min?: ItemCalificableMinOrderByAggregateInput;
  };

  export type ItemCalificableScalarWhereWithAggregatesInput = {
    AND?:
      | ItemCalificableScalarWhereWithAggregatesInput
      | ItemCalificableScalarWhereWithAggregatesInput[];
    OR?: ItemCalificableScalarWhereWithAggregatesInput[];
    NOT?:
      | ItemCalificableScalarWhereWithAggregatesInput
      | ItemCalificableScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ItemCalificable'> | string;
    nombre?: StringWithAggregatesFilter<'ItemCalificable'> | string;
    categoriaId?: StringWithAggregatesFilter<'ItemCalificable'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'ItemCalificable'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'ItemCalificable'> | Date | string;
    image?:
      | StringNullableWithAggregatesFilter<'ItemCalificable'>
      | string
      | null;
  };

  export type CalificacionWhereInput = {
    AND?: CalificacionWhereInput | CalificacionWhereInput[];
    OR?: CalificacionWhereInput[];
    NOT?: CalificacionWhereInput | CalificacionWhereInput[];
    id?: StringFilter<'Calificacion'> | string;
    puntuacion?: IntFilter<'Calificacion'> | number;
    ip?: StringNullableFilter<'Calificacion'> | string | null;
    itemId?: StringFilter<'Calificacion'> | string;
    createdAt?: DateTimeFilter<'Calificacion'> | Date | string;
    deviceId?: StringNullableFilter<'Calificacion'> | string | null;
    item?: XOR<ItemCalificableScalarRelationFilter, ItemCalificableWhereInput>;
  };

  export type CalificacionOrderByWithRelationInput = {
    id?: SortOrder;
    puntuacion?: SortOrder;
    ip?: SortOrderInput | SortOrder;
    itemId?: SortOrder;
    createdAt?: SortOrder;
    deviceId?: SortOrderInput | SortOrder;
    item?: ItemCalificableOrderByWithRelationInput;
  };

  export type CalificacionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: CalificacionWhereInput | CalificacionWhereInput[];
      OR?: CalificacionWhereInput[];
      NOT?: CalificacionWhereInput | CalificacionWhereInput[];
      puntuacion?: IntFilter<'Calificacion'> | number;
      ip?: StringNullableFilter<'Calificacion'> | string | null;
      itemId?: StringFilter<'Calificacion'> | string;
      createdAt?: DateTimeFilter<'Calificacion'> | Date | string;
      deviceId?: StringNullableFilter<'Calificacion'> | string | null;
      item?: XOR<
        ItemCalificableScalarRelationFilter,
        ItemCalificableWhereInput
      >;
    },
    'id'
  >;

  export type CalificacionOrderByWithAggregationInput = {
    id?: SortOrder;
    puntuacion?: SortOrder;
    ip?: SortOrderInput | SortOrder;
    itemId?: SortOrder;
    createdAt?: SortOrder;
    deviceId?: SortOrderInput | SortOrder;
    _count?: CalificacionCountOrderByAggregateInput;
    _avg?: CalificacionAvgOrderByAggregateInput;
    _max?: CalificacionMaxOrderByAggregateInput;
    _min?: CalificacionMinOrderByAggregateInput;
    _sum?: CalificacionSumOrderByAggregateInput;
  };

  export type CalificacionScalarWhereWithAggregatesInput = {
    AND?:
      | CalificacionScalarWhereWithAggregatesInput
      | CalificacionScalarWhereWithAggregatesInput[];
    OR?: CalificacionScalarWhereWithAggregatesInput[];
    NOT?:
      | CalificacionScalarWhereWithAggregatesInput
      | CalificacionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Calificacion'> | string;
    puntuacion?: IntWithAggregatesFilter<'Calificacion'> | number;
    ip?: StringNullableWithAggregatesFilter<'Calificacion'> | string | null;
    itemId?: StringWithAggregatesFilter<'Calificacion'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Calificacion'> | Date | string;
    deviceId?:
      | StringNullableWithAggregatesFilter<'Calificacion'>
      | string
      | null;
  };

  export type VotacionBracketWhereInput = {
    AND?: VotacionBracketWhereInput | VotacionBracketWhereInput[];
    OR?: VotacionBracketWhereInput[];
    NOT?: VotacionBracketWhereInput | VotacionBracketWhereInput[];
    id?: StringFilter<'VotacionBracket'> | string;
    tematica?: StringFilter<'VotacionBracket'> | string;
    slug?: StringFilter<'VotacionBracket'> | string;
    estado?: StringFilter<'VotacionBracket'> | string;
    rondaActual?: IntFilter<'VotacionBracket'> | number;
    juegoId?: StringFilter<'VotacionBracket'> | string;
    createdAt?: DateTimeFilter<'VotacionBracket'> | Date | string;
    updatedAt?: DateTimeFilter<'VotacionBracket'> | Date | string;
    juego?: XOR<JuegoScalarRelationFilter, JuegoWhereInput>;
    matches?: BracketMatchListRelationFilter;
  };

  export type VotacionBracketOrderByWithRelationInput = {
    id?: SortOrder;
    tematica?: SortOrder;
    slug?: SortOrder;
    estado?: SortOrder;
    rondaActual?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    juego?: JuegoOrderByWithRelationInput;
    matches?: BracketMatchOrderByRelationAggregateInput;
  };

  export type VotacionBracketWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      slug?: string;
      AND?: VotacionBracketWhereInput | VotacionBracketWhereInput[];
      OR?: VotacionBracketWhereInput[];
      NOT?: VotacionBracketWhereInput | VotacionBracketWhereInput[];
      tematica?: StringFilter<'VotacionBracket'> | string;
      estado?: StringFilter<'VotacionBracket'> | string;
      rondaActual?: IntFilter<'VotacionBracket'> | number;
      juegoId?: StringFilter<'VotacionBracket'> | string;
      createdAt?: DateTimeFilter<'VotacionBracket'> | Date | string;
      updatedAt?: DateTimeFilter<'VotacionBracket'> | Date | string;
      juego?: XOR<JuegoScalarRelationFilter, JuegoWhereInput>;
      matches?: BracketMatchListRelationFilter;
    },
    'id' | 'slug'
  >;

  export type VotacionBracketOrderByWithAggregationInput = {
    id?: SortOrder;
    tematica?: SortOrder;
    slug?: SortOrder;
    estado?: SortOrder;
    rondaActual?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: VotacionBracketCountOrderByAggregateInput;
    _avg?: VotacionBracketAvgOrderByAggregateInput;
    _max?: VotacionBracketMaxOrderByAggregateInput;
    _min?: VotacionBracketMinOrderByAggregateInput;
    _sum?: VotacionBracketSumOrderByAggregateInput;
  };

  export type VotacionBracketScalarWhereWithAggregatesInput = {
    AND?:
      | VotacionBracketScalarWhereWithAggregatesInput
      | VotacionBracketScalarWhereWithAggregatesInput[];
    OR?: VotacionBracketScalarWhereWithAggregatesInput[];
    NOT?:
      | VotacionBracketScalarWhereWithAggregatesInput
      | VotacionBracketScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'VotacionBracket'> | string;
    tematica?: StringWithAggregatesFilter<'VotacionBracket'> | string;
    slug?: StringWithAggregatesFilter<'VotacionBracket'> | string;
    estado?: StringWithAggregatesFilter<'VotacionBracket'> | string;
    rondaActual?: IntWithAggregatesFilter<'VotacionBracket'> | number;
    juegoId?: StringWithAggregatesFilter<'VotacionBracket'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'VotacionBracket'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'VotacionBracket'> | Date | string;
  };

  export type BracketMatchWhereInput = {
    AND?: BracketMatchWhereInput | BracketMatchWhereInput[];
    OR?: BracketMatchWhereInput[];
    NOT?: BracketMatchWhereInput | BracketMatchWhereInput[];
    id?: StringFilter<'BracketMatch'> | string;
    bracketId?: StringFilter<'BracketMatch'> | string;
    ronda?: IntFilter<'BracketMatch'> | number;
    itemAId?: StringNullableFilter<'BracketMatch'> | string | null;
    itemBId?: StringNullableFilter<'BracketMatch'> | string | null;
    votosA?: IntFilter<'BracketMatch'> | number;
    votosB?: IntFilter<'BracketMatch'> | number;
    ganadorId?: StringNullableFilter<'BracketMatch'> | string | null;
    createdAt?: DateTimeFilter<'BracketMatch'> | Date | string;
    updatedAt?: DateTimeFilter<'BracketMatch'> | Date | string;
    bracket?: XOR<
      VotacionBracketScalarRelationFilter,
      VotacionBracketWhereInput
    >;
    itemA?: XOR<
      ItemCalificableNullableScalarRelationFilter,
      ItemCalificableWhereInput
    > | null;
    itemB?: XOR<
      ItemCalificableNullableScalarRelationFilter,
      ItemCalificableWhereInput
    > | null;
    ganador?: XOR<
      ItemCalificableNullableScalarRelationFilter,
      ItemCalificableWhereInput
    > | null;
  };

  export type BracketMatchOrderByWithRelationInput = {
    id?: SortOrder;
    bracketId?: SortOrder;
    ronda?: SortOrder;
    itemAId?: SortOrderInput | SortOrder;
    itemBId?: SortOrderInput | SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
    ganadorId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    bracket?: VotacionBracketOrderByWithRelationInput;
    itemA?: ItemCalificableOrderByWithRelationInput;
    itemB?: ItemCalificableOrderByWithRelationInput;
    ganador?: ItemCalificableOrderByWithRelationInput;
  };

  export type BracketMatchWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: BracketMatchWhereInput | BracketMatchWhereInput[];
      OR?: BracketMatchWhereInput[];
      NOT?: BracketMatchWhereInput | BracketMatchWhereInput[];
      bracketId?: StringFilter<'BracketMatch'> | string;
      ronda?: IntFilter<'BracketMatch'> | number;
      itemAId?: StringNullableFilter<'BracketMatch'> | string | null;
      itemBId?: StringNullableFilter<'BracketMatch'> | string | null;
      votosA?: IntFilter<'BracketMatch'> | number;
      votosB?: IntFilter<'BracketMatch'> | number;
      ganadorId?: StringNullableFilter<'BracketMatch'> | string | null;
      createdAt?: DateTimeFilter<'BracketMatch'> | Date | string;
      updatedAt?: DateTimeFilter<'BracketMatch'> | Date | string;
      bracket?: XOR<
        VotacionBracketScalarRelationFilter,
        VotacionBracketWhereInput
      >;
      itemA?: XOR<
        ItemCalificableNullableScalarRelationFilter,
        ItemCalificableWhereInput
      > | null;
      itemB?: XOR<
        ItemCalificableNullableScalarRelationFilter,
        ItemCalificableWhereInput
      > | null;
      ganador?: XOR<
        ItemCalificableNullableScalarRelationFilter,
        ItemCalificableWhereInput
      > | null;
    },
    'id'
  >;

  export type BracketMatchOrderByWithAggregationInput = {
    id?: SortOrder;
    bracketId?: SortOrder;
    ronda?: SortOrder;
    itemAId?: SortOrderInput | SortOrder;
    itemBId?: SortOrderInput | SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
    ganadorId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: BracketMatchCountOrderByAggregateInput;
    _avg?: BracketMatchAvgOrderByAggregateInput;
    _max?: BracketMatchMaxOrderByAggregateInput;
    _min?: BracketMatchMinOrderByAggregateInput;
    _sum?: BracketMatchSumOrderByAggregateInput;
  };

  export type BracketMatchScalarWhereWithAggregatesInput = {
    AND?:
      | BracketMatchScalarWhereWithAggregatesInput
      | BracketMatchScalarWhereWithAggregatesInput[];
    OR?: BracketMatchScalarWhereWithAggregatesInput[];
    NOT?:
      | BracketMatchScalarWhereWithAggregatesInput
      | BracketMatchScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'BracketMatch'> | string;
    bracketId?: StringWithAggregatesFilter<'BracketMatch'> | string;
    ronda?: IntWithAggregatesFilter<'BracketMatch'> | number;
    itemAId?:
      | StringNullableWithAggregatesFilter<'BracketMatch'>
      | string
      | null;
    itemBId?:
      | StringNullableWithAggregatesFilter<'BracketMatch'>
      | string
      | null;
    votosA?: IntWithAggregatesFilter<'BracketMatch'> | number;
    votosB?: IntWithAggregatesFilter<'BracketMatch'> | number;
    ganadorId?:
      | StringNullableWithAggregatesFilter<'BracketMatch'>
      | string
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'BracketMatch'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'BracketMatch'> | Date | string;
  };

  export type SorteoWhereInput = {
    AND?: SorteoWhereInput | SorteoWhereInput[];
    OR?: SorteoWhereInput[];
    NOT?: SorteoWhereInput | SorteoWhereInput[];
    id?: StringFilter<'Sorteo'> | string;
    titulo?: StringFilter<'Sorteo'> | string;
    descripcion?: StringNullableFilter<'Sorteo'> | string | null;
    premio?: StringFilter<'Sorteo'> | string;
    fechaFin?: DateTimeFilter<'Sorteo'> | Date | string;
    estado?: StringFilter<'Sorteo'> | string;
    juegoId?: StringNullableFilter<'Sorteo'> | string | null;
    createdAt?: DateTimeFilter<'Sorteo'> | Date | string;
    updatedAt?: DateTimeFilter<'Sorteo'> | Date | string;
    juego?: XOR<JuegoNullableScalarRelationFilter, JuegoWhereInput> | null;
  };

  export type SorteoOrderByWithRelationInput = {
    id?: SortOrder;
    titulo?: SortOrder;
    descripcion?: SortOrderInput | SortOrder;
    premio?: SortOrder;
    fechaFin?: SortOrder;
    estado?: SortOrder;
    juegoId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    juego?: JuegoOrderByWithRelationInput;
  };

  export type SorteoWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: SorteoWhereInput | SorteoWhereInput[];
      OR?: SorteoWhereInput[];
      NOT?: SorteoWhereInput | SorteoWhereInput[];
      titulo?: StringFilter<'Sorteo'> | string;
      descripcion?: StringNullableFilter<'Sorteo'> | string | null;
      premio?: StringFilter<'Sorteo'> | string;
      fechaFin?: DateTimeFilter<'Sorteo'> | Date | string;
      estado?: StringFilter<'Sorteo'> | string;
      juegoId?: StringNullableFilter<'Sorteo'> | string | null;
      createdAt?: DateTimeFilter<'Sorteo'> | Date | string;
      updatedAt?: DateTimeFilter<'Sorteo'> | Date | string;
      juego?: XOR<JuegoNullableScalarRelationFilter, JuegoWhereInput> | null;
    },
    'id'
  >;

  export type SorteoOrderByWithAggregationInput = {
    id?: SortOrder;
    titulo?: SortOrder;
    descripcion?: SortOrderInput | SortOrder;
    premio?: SortOrder;
    fechaFin?: SortOrder;
    estado?: SortOrder;
    juegoId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: SorteoCountOrderByAggregateInput;
    _max?: SorteoMaxOrderByAggregateInput;
    _min?: SorteoMinOrderByAggregateInput;
  };

  export type SorteoScalarWhereWithAggregatesInput = {
    AND?:
      | SorteoScalarWhereWithAggregatesInput
      | SorteoScalarWhereWithAggregatesInput[];
    OR?: SorteoScalarWhereWithAggregatesInput[];
    NOT?:
      | SorteoScalarWhereWithAggregatesInput
      | SorteoScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Sorteo'> | string;
    titulo?: StringWithAggregatesFilter<'Sorteo'> | string;
    descripcion?: StringNullableWithAggregatesFilter<'Sorteo'> | string | null;
    premio?: StringWithAggregatesFilter<'Sorteo'> | string;
    fechaFin?: DateTimeWithAggregatesFilter<'Sorteo'> | Date | string;
    estado?: StringWithAggregatesFilter<'Sorteo'> | string;
    juegoId?: StringNullableWithAggregatesFilter<'Sorteo'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Sorteo'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Sorteo'> | Date | string;
  };

  export type UsuarioCreateInput = {
    id?: string;
    email: string;
    password: string;
    nombre: string;
    rol?: $Enums.Rol;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UsuarioUncheckedCreateInput = {
    id?: string;
    email: string;
    password: string;
    nombre: string;
    rol?: $Enums.Rol;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UsuarioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UsuarioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UsuarioCreateManyInput = {
    id?: string;
    email: string;
    password: string;
    nombre: string;
    rol?: $Enums.Rol;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UsuarioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UsuarioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    rol?: EnumRolFieldUpdateOperationsInput | $Enums.Rol;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type JuegoCreateInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categorias?: CategoriaCreateNestedManyWithoutJuegoInput;
    votaciones?: VotacionBracketCreateNestedManyWithoutJuegoInput;
    sorteos?: SorteoCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoUncheckedCreateInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categorias?: CategoriaUncheckedCreateNestedManyWithoutJuegoInput;
    votaciones?: VotacionBracketUncheckedCreateNestedManyWithoutJuegoInput;
    sorteos?: SorteoUncheckedCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categorias?: CategoriaUpdateManyWithoutJuegoNestedInput;
    votaciones?: VotacionBracketUpdateManyWithoutJuegoNestedInput;
    sorteos?: SorteoUpdateManyWithoutJuegoNestedInput;
  };

  export type JuegoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categorias?: CategoriaUncheckedUpdateManyWithoutJuegoNestedInput;
    votaciones?: VotacionBracketUncheckedUpdateManyWithoutJuegoNestedInput;
    sorteos?: SorteoUncheckedUpdateManyWithoutJuegoNestedInput;
  };

  export type JuegoCreateManyInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type JuegoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type JuegoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoriaCreateInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: ItemCalificableCreateNestedManyWithoutCategoriaInput;
    juego?: JuegoCreateNestedOneWithoutCategoriasInput;
  };

  export type CategoriaUncheckedCreateInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    juegoId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: ItemCalificableUncheckedCreateNestedManyWithoutCategoriaInput;
  };

  export type CategoriaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: ItemCalificableUpdateManyWithoutCategoriaNestedInput;
    juego?: JuegoUpdateOneWithoutCategoriasNestedInput;
  };

  export type CategoriaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    juegoId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: ItemCalificableUncheckedUpdateManyWithoutCategoriaNestedInput;
  };

  export type CategoriaCreateManyInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    juegoId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CategoriaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoriaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    juegoId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ItemCalificableCreateInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionCreateNestedManyWithoutItemInput;
    categoria: CategoriaCreateNestedOneWithoutItemsInput;
    matchesSideA?: BracketMatchCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableUncheckedCreateInput = {
    id?: string;
    nombre: string;
    categoriaId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutItemInput;
    matchesSideA?: BracketMatchUncheckedCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchUncheckedCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchUncheckedCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUpdateManyWithoutItemNestedInput;
    categoria?: CategoriaUpdateOneRequiredWithoutItemsNestedInput;
    matchesSideA?: BracketMatchUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    categoriaId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUncheckedUpdateManyWithoutItemNestedInput;
    matchesSideA?: BracketMatchUncheckedUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUncheckedUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUncheckedUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableCreateManyInput = {
    id?: string;
    nombre: string;
    categoriaId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
  };

  export type ItemCalificableUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ItemCalificableUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    categoriaId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CalificacionCreateInput = {
    id?: string;
    puntuacion: number;
    ip?: string | null;
    createdAt?: Date | string;
    deviceId?: string | null;
    item: ItemCalificableCreateNestedOneWithoutCalificacionesInput;
  };

  export type CalificacionUncheckedCreateInput = {
    id?: string;
    puntuacion: number;
    ip?: string | null;
    itemId: string;
    createdAt?: Date | string;
    deviceId?: string | null;
  };

  export type CalificacionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
    item?: ItemCalificableUpdateOneRequiredWithoutCalificacionesNestedInput;
  };

  export type CalificacionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    itemId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CalificacionCreateManyInput = {
    id?: string;
    puntuacion: number;
    ip?: string | null;
    itemId: string;
    createdAt?: Date | string;
    deviceId?: string | null;
  };

  export type CalificacionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CalificacionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    itemId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type VotacionBracketCreateInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    juego: JuegoCreateNestedOneWithoutVotacionesInput;
    matches?: BracketMatchCreateNestedManyWithoutBracketInput;
  };

  export type VotacionBracketUncheckedCreateInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    juegoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    matches?: BracketMatchUncheckedCreateNestedManyWithoutBracketInput;
  };

  export type VotacionBracketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    juego?: JuegoUpdateOneRequiredWithoutVotacionesNestedInput;
    matches?: BracketMatchUpdateManyWithoutBracketNestedInput;
  };

  export type VotacionBracketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    juegoId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    matches?: BracketMatchUncheckedUpdateManyWithoutBracketNestedInput;
  };

  export type VotacionBracketCreateManyInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    juegoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VotacionBracketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VotacionBracketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    juegoId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchCreateInput = {
    id?: string;
    ronda: number;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bracket: VotacionBracketCreateNestedOneWithoutMatchesInput;
    itemA?: ItemCalificableCreateNestedOneWithoutMatchesSideAInput;
    itemB?: ItemCalificableCreateNestedOneWithoutMatchesSideBInput;
    ganador?: ItemCalificableCreateNestedOneWithoutMatchesWonInput;
  };

  export type BracketMatchUncheckedCreateInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemAId?: string | null;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bracket?: VotacionBracketUpdateOneRequiredWithoutMatchesNestedInput;
    itemA?: ItemCalificableUpdateOneWithoutMatchesSideANestedInput;
    itemB?: ItemCalificableUpdateOneWithoutMatchesSideBNestedInput;
    ganador?: ItemCalificableUpdateOneWithoutMatchesWonNestedInput;
  };

  export type BracketMatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchCreateManyInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemAId?: string | null;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SorteoCreateInput = {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    premio: string;
    fechaFin: Date | string;
    estado?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    juego?: JuegoCreateNestedOneWithoutSorteosInput;
  };

  export type SorteoUncheckedCreateInput = {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    premio: string;
    fechaFin: Date | string;
    estado?: string;
    juegoId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SorteoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    juego?: JuegoUpdateOneWithoutSorteosNestedInput;
  };

  export type SorteoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    juegoId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SorteoCreateManyInput = {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    premio: string;
    fechaFin: Date | string;
    estado?: string;
    juegoId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SorteoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SorteoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    juegoId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type EnumRolFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>;
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    not?: NestedEnumRolFilter<$PrismaModel> | $Enums.Rol;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    nombre?: SortOrder;
    rol?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    nombre?: SortOrder;
    rol?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    nombre?: SortOrder;
    rol?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type EnumRolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>;
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    not?: NestedEnumRolWithAggregatesFilter<$PrismaModel> | $Enums.Rol;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumRolFilter<$PrismaModel>;
    _max?: NestedEnumRolFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type CategoriaListRelationFilter = {
    every?: CategoriaWhereInput;
    some?: CategoriaWhereInput;
    none?: CategoriaWhereInput;
  };

  export type VotacionBracketListRelationFilter = {
    every?: VotacionBracketWhereInput;
    some?: VotacionBracketWhereInput;
    none?: VotacionBracketWhereInput;
  };

  export type SorteoListRelationFilter = {
    every?: SorteoWhereInput;
    some?: SorteoWhereInput;
    none?: SorteoWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type CategoriaOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type VotacionBracketOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type SorteoOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type JuegoCountOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    slug?: SortOrder;
    descripcion?: SortOrder;
    image?: SortOrder;
    activo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type JuegoMaxOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    slug?: SortOrder;
    descripcion?: SortOrder;
    image?: SortOrder;
    activo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type JuegoMinOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    slug?: SortOrder;
    descripcion?: SortOrder;
    image?: SortOrder;
    activo?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type ItemCalificableListRelationFilter = {
    every?: ItemCalificableWhereInput;
    some?: ItemCalificableWhereInput;
    none?: ItemCalificableWhereInput;
  };

  export type JuegoNullableScalarRelationFilter = {
    is?: JuegoWhereInput | null;
    isNot?: JuegoWhereInput | null;
  };

  export type ItemCalificableOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CategoriaCountOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    activa?: SortOrder;
    tipo?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CategoriaMaxOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    activa?: SortOrder;
    tipo?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CategoriaMinOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    activa?: SortOrder;
    tipo?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CalificacionListRelationFilter = {
    every?: CalificacionWhereInput;
    some?: CalificacionWhereInput;
    none?: CalificacionWhereInput;
  };

  export type CategoriaScalarRelationFilter = {
    is?: CategoriaWhereInput;
    isNot?: CategoriaWhereInput;
  };

  export type BracketMatchListRelationFilter = {
    every?: BracketMatchWhereInput;
    some?: BracketMatchWhereInput;
    none?: BracketMatchWhereInput;
  };

  export type CalificacionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type BracketMatchOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ItemCalificableCountOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    categoriaId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    image?: SortOrder;
  };

  export type ItemCalificableMaxOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    categoriaId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    image?: SortOrder;
  };

  export type ItemCalificableMinOrderByAggregateInput = {
    id?: SortOrder;
    nombre?: SortOrder;
    categoriaId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    image?: SortOrder;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type ItemCalificableScalarRelationFilter = {
    is?: ItemCalificableWhereInput;
    isNot?: ItemCalificableWhereInput;
  };

  export type CalificacionCountOrderByAggregateInput = {
    id?: SortOrder;
    puntuacion?: SortOrder;
    ip?: SortOrder;
    itemId?: SortOrder;
    createdAt?: SortOrder;
    deviceId?: SortOrder;
  };

  export type CalificacionAvgOrderByAggregateInput = {
    puntuacion?: SortOrder;
  };

  export type CalificacionMaxOrderByAggregateInput = {
    id?: SortOrder;
    puntuacion?: SortOrder;
    ip?: SortOrder;
    itemId?: SortOrder;
    createdAt?: SortOrder;
    deviceId?: SortOrder;
  };

  export type CalificacionMinOrderByAggregateInput = {
    id?: SortOrder;
    puntuacion?: SortOrder;
    ip?: SortOrder;
    itemId?: SortOrder;
    createdAt?: SortOrder;
    deviceId?: SortOrder;
  };

  export type CalificacionSumOrderByAggregateInput = {
    puntuacion?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type JuegoScalarRelationFilter = {
    is?: JuegoWhereInput;
    isNot?: JuegoWhereInput;
  };

  export type VotacionBracketCountOrderByAggregateInput = {
    id?: SortOrder;
    tematica?: SortOrder;
    slug?: SortOrder;
    estado?: SortOrder;
    rondaActual?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VotacionBracketAvgOrderByAggregateInput = {
    rondaActual?: SortOrder;
  };

  export type VotacionBracketMaxOrderByAggregateInput = {
    id?: SortOrder;
    tematica?: SortOrder;
    slug?: SortOrder;
    estado?: SortOrder;
    rondaActual?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VotacionBracketMinOrderByAggregateInput = {
    id?: SortOrder;
    tematica?: SortOrder;
    slug?: SortOrder;
    estado?: SortOrder;
    rondaActual?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VotacionBracketSumOrderByAggregateInput = {
    rondaActual?: SortOrder;
  };

  export type VotacionBracketScalarRelationFilter = {
    is?: VotacionBracketWhereInput;
    isNot?: VotacionBracketWhereInput;
  };

  export type ItemCalificableNullableScalarRelationFilter = {
    is?: ItemCalificableWhereInput | null;
    isNot?: ItemCalificableWhereInput | null;
  };

  export type BracketMatchCountOrderByAggregateInput = {
    id?: SortOrder;
    bracketId?: SortOrder;
    ronda?: SortOrder;
    itemAId?: SortOrder;
    itemBId?: SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
    ganadorId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BracketMatchAvgOrderByAggregateInput = {
    ronda?: SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
  };

  export type BracketMatchMaxOrderByAggregateInput = {
    id?: SortOrder;
    bracketId?: SortOrder;
    ronda?: SortOrder;
    itemAId?: SortOrder;
    itemBId?: SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
    ganadorId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BracketMatchMinOrderByAggregateInput = {
    id?: SortOrder;
    bracketId?: SortOrder;
    ronda?: SortOrder;
    itemAId?: SortOrder;
    itemBId?: SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
    ganadorId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BracketMatchSumOrderByAggregateInput = {
    ronda?: SortOrder;
    votosA?: SortOrder;
    votosB?: SortOrder;
  };

  export type SorteoCountOrderByAggregateInput = {
    id?: SortOrder;
    titulo?: SortOrder;
    descripcion?: SortOrder;
    premio?: SortOrder;
    fechaFin?: SortOrder;
    estado?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type SorteoMaxOrderByAggregateInput = {
    id?: SortOrder;
    titulo?: SortOrder;
    descripcion?: SortOrder;
    premio?: SortOrder;
    fechaFin?: SortOrder;
    estado?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type SorteoMinOrderByAggregateInput = {
    id?: SortOrder;
    titulo?: SortOrder;
    descripcion?: SortOrder;
    premio?: SortOrder;
    fechaFin?: SortOrder;
    estado?: SortOrder;
    juegoId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type EnumRolFieldUpdateOperationsInput = {
    set?: $Enums.Rol;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type CategoriaCreateNestedManyWithoutJuegoInput = {
    create?:
      | XOR<
          CategoriaCreateWithoutJuegoInput,
          CategoriaUncheckedCreateWithoutJuegoInput
        >
      | CategoriaCreateWithoutJuegoInput[]
      | CategoriaUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | CategoriaCreateOrConnectWithoutJuegoInput
      | CategoriaCreateOrConnectWithoutJuegoInput[];
    createMany?: CategoriaCreateManyJuegoInputEnvelope;
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
  };

  export type VotacionBracketCreateNestedManyWithoutJuegoInput = {
    create?:
      | XOR<
          VotacionBracketCreateWithoutJuegoInput,
          VotacionBracketUncheckedCreateWithoutJuegoInput
        >
      | VotacionBracketCreateWithoutJuegoInput[]
      | VotacionBracketUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | VotacionBracketCreateOrConnectWithoutJuegoInput
      | VotacionBracketCreateOrConnectWithoutJuegoInput[];
    createMany?: VotacionBracketCreateManyJuegoInputEnvelope;
    connect?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
  };

  export type SorteoCreateNestedManyWithoutJuegoInput = {
    create?:
      | XOR<
          SorteoCreateWithoutJuegoInput,
          SorteoUncheckedCreateWithoutJuegoInput
        >
      | SorteoCreateWithoutJuegoInput[]
      | SorteoUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | SorteoCreateOrConnectWithoutJuegoInput
      | SorteoCreateOrConnectWithoutJuegoInput[];
    createMany?: SorteoCreateManyJuegoInputEnvelope;
    connect?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
  };

  export type CategoriaUncheckedCreateNestedManyWithoutJuegoInput = {
    create?:
      | XOR<
          CategoriaCreateWithoutJuegoInput,
          CategoriaUncheckedCreateWithoutJuegoInput
        >
      | CategoriaCreateWithoutJuegoInput[]
      | CategoriaUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | CategoriaCreateOrConnectWithoutJuegoInput
      | CategoriaCreateOrConnectWithoutJuegoInput[];
    createMany?: CategoriaCreateManyJuegoInputEnvelope;
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
  };

  export type VotacionBracketUncheckedCreateNestedManyWithoutJuegoInput = {
    create?:
      | XOR<
          VotacionBracketCreateWithoutJuegoInput,
          VotacionBracketUncheckedCreateWithoutJuegoInput
        >
      | VotacionBracketCreateWithoutJuegoInput[]
      | VotacionBracketUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | VotacionBracketCreateOrConnectWithoutJuegoInput
      | VotacionBracketCreateOrConnectWithoutJuegoInput[];
    createMany?: VotacionBracketCreateManyJuegoInputEnvelope;
    connect?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
  };

  export type SorteoUncheckedCreateNestedManyWithoutJuegoInput = {
    create?:
      | XOR<
          SorteoCreateWithoutJuegoInput,
          SorteoUncheckedCreateWithoutJuegoInput
        >
      | SorteoCreateWithoutJuegoInput[]
      | SorteoUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | SorteoCreateOrConnectWithoutJuegoInput
      | SorteoCreateOrConnectWithoutJuegoInput[];
    createMany?: SorteoCreateManyJuegoInputEnvelope;
    connect?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type CategoriaUpdateManyWithoutJuegoNestedInput = {
    create?:
      | XOR<
          CategoriaCreateWithoutJuegoInput,
          CategoriaUncheckedCreateWithoutJuegoInput
        >
      | CategoriaCreateWithoutJuegoInput[]
      | CategoriaUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | CategoriaCreateOrConnectWithoutJuegoInput
      | CategoriaCreateOrConnectWithoutJuegoInput[];
    upsert?:
      | CategoriaUpsertWithWhereUniqueWithoutJuegoInput
      | CategoriaUpsertWithWhereUniqueWithoutJuegoInput[];
    createMany?: CategoriaCreateManyJuegoInputEnvelope;
    set?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    disconnect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    delete?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    update?:
      | CategoriaUpdateWithWhereUniqueWithoutJuegoInput
      | CategoriaUpdateWithWhereUniqueWithoutJuegoInput[];
    updateMany?:
      | CategoriaUpdateManyWithWhereWithoutJuegoInput
      | CategoriaUpdateManyWithWhereWithoutJuegoInput[];
    deleteMany?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[];
  };

  export type VotacionBracketUpdateManyWithoutJuegoNestedInput = {
    create?:
      | XOR<
          VotacionBracketCreateWithoutJuegoInput,
          VotacionBracketUncheckedCreateWithoutJuegoInput
        >
      | VotacionBracketCreateWithoutJuegoInput[]
      | VotacionBracketUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | VotacionBracketCreateOrConnectWithoutJuegoInput
      | VotacionBracketCreateOrConnectWithoutJuegoInput[];
    upsert?:
      | VotacionBracketUpsertWithWhereUniqueWithoutJuegoInput
      | VotacionBracketUpsertWithWhereUniqueWithoutJuegoInput[];
    createMany?: VotacionBracketCreateManyJuegoInputEnvelope;
    set?: VotacionBracketWhereUniqueInput | VotacionBracketWhereUniqueInput[];
    disconnect?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
    delete?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
    connect?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
    update?:
      | VotacionBracketUpdateWithWhereUniqueWithoutJuegoInput
      | VotacionBracketUpdateWithWhereUniqueWithoutJuegoInput[];
    updateMany?:
      | VotacionBracketUpdateManyWithWhereWithoutJuegoInput
      | VotacionBracketUpdateManyWithWhereWithoutJuegoInput[];
    deleteMany?:
      | VotacionBracketScalarWhereInput
      | VotacionBracketScalarWhereInput[];
  };

  export type SorteoUpdateManyWithoutJuegoNestedInput = {
    create?:
      | XOR<
          SorteoCreateWithoutJuegoInput,
          SorteoUncheckedCreateWithoutJuegoInput
        >
      | SorteoCreateWithoutJuegoInput[]
      | SorteoUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | SorteoCreateOrConnectWithoutJuegoInput
      | SorteoCreateOrConnectWithoutJuegoInput[];
    upsert?:
      | SorteoUpsertWithWhereUniqueWithoutJuegoInput
      | SorteoUpsertWithWhereUniqueWithoutJuegoInput[];
    createMany?: SorteoCreateManyJuegoInputEnvelope;
    set?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    disconnect?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    delete?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    connect?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    update?:
      | SorteoUpdateWithWhereUniqueWithoutJuegoInput
      | SorteoUpdateWithWhereUniqueWithoutJuegoInput[];
    updateMany?:
      | SorteoUpdateManyWithWhereWithoutJuegoInput
      | SorteoUpdateManyWithWhereWithoutJuegoInput[];
    deleteMany?: SorteoScalarWhereInput | SorteoScalarWhereInput[];
  };

  export type CategoriaUncheckedUpdateManyWithoutJuegoNestedInput = {
    create?:
      | XOR<
          CategoriaCreateWithoutJuegoInput,
          CategoriaUncheckedCreateWithoutJuegoInput
        >
      | CategoriaCreateWithoutJuegoInput[]
      | CategoriaUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | CategoriaCreateOrConnectWithoutJuegoInput
      | CategoriaCreateOrConnectWithoutJuegoInput[];
    upsert?:
      | CategoriaUpsertWithWhereUniqueWithoutJuegoInput
      | CategoriaUpsertWithWhereUniqueWithoutJuegoInput[];
    createMany?: CategoriaCreateManyJuegoInputEnvelope;
    set?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    disconnect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    delete?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[];
    update?:
      | CategoriaUpdateWithWhereUniqueWithoutJuegoInput
      | CategoriaUpdateWithWhereUniqueWithoutJuegoInput[];
    updateMany?:
      | CategoriaUpdateManyWithWhereWithoutJuegoInput
      | CategoriaUpdateManyWithWhereWithoutJuegoInput[];
    deleteMany?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[];
  };

  export type VotacionBracketUncheckedUpdateManyWithoutJuegoNestedInput = {
    create?:
      | XOR<
          VotacionBracketCreateWithoutJuegoInput,
          VotacionBracketUncheckedCreateWithoutJuegoInput
        >
      | VotacionBracketCreateWithoutJuegoInput[]
      | VotacionBracketUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | VotacionBracketCreateOrConnectWithoutJuegoInput
      | VotacionBracketCreateOrConnectWithoutJuegoInput[];
    upsert?:
      | VotacionBracketUpsertWithWhereUniqueWithoutJuegoInput
      | VotacionBracketUpsertWithWhereUniqueWithoutJuegoInput[];
    createMany?: VotacionBracketCreateManyJuegoInputEnvelope;
    set?: VotacionBracketWhereUniqueInput | VotacionBracketWhereUniqueInput[];
    disconnect?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
    delete?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
    connect?:
      | VotacionBracketWhereUniqueInput
      | VotacionBracketWhereUniqueInput[];
    update?:
      | VotacionBracketUpdateWithWhereUniqueWithoutJuegoInput
      | VotacionBracketUpdateWithWhereUniqueWithoutJuegoInput[];
    updateMany?:
      | VotacionBracketUpdateManyWithWhereWithoutJuegoInput
      | VotacionBracketUpdateManyWithWhereWithoutJuegoInput[];
    deleteMany?:
      | VotacionBracketScalarWhereInput
      | VotacionBracketScalarWhereInput[];
  };

  export type SorteoUncheckedUpdateManyWithoutJuegoNestedInput = {
    create?:
      | XOR<
          SorteoCreateWithoutJuegoInput,
          SorteoUncheckedCreateWithoutJuegoInput
        >
      | SorteoCreateWithoutJuegoInput[]
      | SorteoUncheckedCreateWithoutJuegoInput[];
    connectOrCreate?:
      | SorteoCreateOrConnectWithoutJuegoInput
      | SorteoCreateOrConnectWithoutJuegoInput[];
    upsert?:
      | SorteoUpsertWithWhereUniqueWithoutJuegoInput
      | SorteoUpsertWithWhereUniqueWithoutJuegoInput[];
    createMany?: SorteoCreateManyJuegoInputEnvelope;
    set?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    disconnect?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    delete?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    connect?: SorteoWhereUniqueInput | SorteoWhereUniqueInput[];
    update?:
      | SorteoUpdateWithWhereUniqueWithoutJuegoInput
      | SorteoUpdateWithWhereUniqueWithoutJuegoInput[];
    updateMany?:
      | SorteoUpdateManyWithWhereWithoutJuegoInput
      | SorteoUpdateManyWithWhereWithoutJuegoInput[];
    deleteMany?: SorteoScalarWhereInput | SorteoScalarWhereInput[];
  };

  export type ItemCalificableCreateNestedManyWithoutCategoriaInput = {
    create?:
      | XOR<
          ItemCalificableCreateWithoutCategoriaInput,
          ItemCalificableUncheckedCreateWithoutCategoriaInput
        >
      | ItemCalificableCreateWithoutCategoriaInput[]
      | ItemCalificableUncheckedCreateWithoutCategoriaInput[];
    connectOrCreate?:
      | ItemCalificableCreateOrConnectWithoutCategoriaInput
      | ItemCalificableCreateOrConnectWithoutCategoriaInput[];
    createMany?: ItemCalificableCreateManyCategoriaInputEnvelope;
    connect?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
  };

  export type JuegoCreateNestedOneWithoutCategoriasInput = {
    create?: XOR<
      JuegoCreateWithoutCategoriasInput,
      JuegoUncheckedCreateWithoutCategoriasInput
    >;
    connectOrCreate?: JuegoCreateOrConnectWithoutCategoriasInput;
    connect?: JuegoWhereUniqueInput;
  };

  export type ItemCalificableUncheckedCreateNestedManyWithoutCategoriaInput = {
    create?:
      | XOR<
          ItemCalificableCreateWithoutCategoriaInput,
          ItemCalificableUncheckedCreateWithoutCategoriaInput
        >
      | ItemCalificableCreateWithoutCategoriaInput[]
      | ItemCalificableUncheckedCreateWithoutCategoriaInput[];
    connectOrCreate?:
      | ItemCalificableCreateOrConnectWithoutCategoriaInput
      | ItemCalificableCreateOrConnectWithoutCategoriaInput[];
    createMany?: ItemCalificableCreateManyCategoriaInputEnvelope;
    connect?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
  };

  export type ItemCalificableUpdateManyWithoutCategoriaNestedInput = {
    create?:
      | XOR<
          ItemCalificableCreateWithoutCategoriaInput,
          ItemCalificableUncheckedCreateWithoutCategoriaInput
        >
      | ItemCalificableCreateWithoutCategoriaInput[]
      | ItemCalificableUncheckedCreateWithoutCategoriaInput[];
    connectOrCreate?:
      | ItemCalificableCreateOrConnectWithoutCategoriaInput
      | ItemCalificableCreateOrConnectWithoutCategoriaInput[];
    upsert?:
      | ItemCalificableUpsertWithWhereUniqueWithoutCategoriaInput
      | ItemCalificableUpsertWithWhereUniqueWithoutCategoriaInput[];
    createMany?: ItemCalificableCreateManyCategoriaInputEnvelope;
    set?: ItemCalificableWhereUniqueInput | ItemCalificableWhereUniqueInput[];
    disconnect?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
    delete?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
    connect?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
    update?:
      | ItemCalificableUpdateWithWhereUniqueWithoutCategoriaInput
      | ItemCalificableUpdateWithWhereUniqueWithoutCategoriaInput[];
    updateMany?:
      | ItemCalificableUpdateManyWithWhereWithoutCategoriaInput
      | ItemCalificableUpdateManyWithWhereWithoutCategoriaInput[];
    deleteMany?:
      | ItemCalificableScalarWhereInput
      | ItemCalificableScalarWhereInput[];
  };

  export type JuegoUpdateOneWithoutCategoriasNestedInput = {
    create?: XOR<
      JuegoCreateWithoutCategoriasInput,
      JuegoUncheckedCreateWithoutCategoriasInput
    >;
    connectOrCreate?: JuegoCreateOrConnectWithoutCategoriasInput;
    upsert?: JuegoUpsertWithoutCategoriasInput;
    disconnect?: JuegoWhereInput | boolean;
    delete?: JuegoWhereInput | boolean;
    connect?: JuegoWhereUniqueInput;
    update?: XOR<
      XOR<
        JuegoUpdateToOneWithWhereWithoutCategoriasInput,
        JuegoUpdateWithoutCategoriasInput
      >,
      JuegoUncheckedUpdateWithoutCategoriasInput
    >;
  };

  export type ItemCalificableUncheckedUpdateManyWithoutCategoriaNestedInput = {
    create?:
      | XOR<
          ItemCalificableCreateWithoutCategoriaInput,
          ItemCalificableUncheckedCreateWithoutCategoriaInput
        >
      | ItemCalificableCreateWithoutCategoriaInput[]
      | ItemCalificableUncheckedCreateWithoutCategoriaInput[];
    connectOrCreate?:
      | ItemCalificableCreateOrConnectWithoutCategoriaInput
      | ItemCalificableCreateOrConnectWithoutCategoriaInput[];
    upsert?:
      | ItemCalificableUpsertWithWhereUniqueWithoutCategoriaInput
      | ItemCalificableUpsertWithWhereUniqueWithoutCategoriaInput[];
    createMany?: ItemCalificableCreateManyCategoriaInputEnvelope;
    set?: ItemCalificableWhereUniqueInput | ItemCalificableWhereUniqueInput[];
    disconnect?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
    delete?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
    connect?:
      | ItemCalificableWhereUniqueInput
      | ItemCalificableWhereUniqueInput[];
    update?:
      | ItemCalificableUpdateWithWhereUniqueWithoutCategoriaInput
      | ItemCalificableUpdateWithWhereUniqueWithoutCategoriaInput[];
    updateMany?:
      | ItemCalificableUpdateManyWithWhereWithoutCategoriaInput
      | ItemCalificableUpdateManyWithWhereWithoutCategoriaInput[];
    deleteMany?:
      | ItemCalificableScalarWhereInput
      | ItemCalificableScalarWhereInput[];
  };

  export type CalificacionCreateNestedManyWithoutItemInput = {
    create?:
      | XOR<
          CalificacionCreateWithoutItemInput,
          CalificacionUncheckedCreateWithoutItemInput
        >
      | CalificacionCreateWithoutItemInput[]
      | CalificacionUncheckedCreateWithoutItemInput[];
    connectOrCreate?:
      | CalificacionCreateOrConnectWithoutItemInput
      | CalificacionCreateOrConnectWithoutItemInput[];
    createMany?: CalificacionCreateManyItemInputEnvelope;
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
  };

  export type CategoriaCreateNestedOneWithoutItemsInput = {
    create?: XOR<
      CategoriaCreateWithoutItemsInput,
      CategoriaUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: CategoriaCreateOrConnectWithoutItemsInput;
    connect?: CategoriaWhereUniqueInput;
  };

  export type BracketMatchCreateNestedManyWithoutItemAInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemAInput,
          BracketMatchUncheckedCreateWithoutItemAInput
        >
      | BracketMatchCreateWithoutItemAInput[]
      | BracketMatchUncheckedCreateWithoutItemAInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemAInput
      | BracketMatchCreateOrConnectWithoutItemAInput[];
    createMany?: BracketMatchCreateManyItemAInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type BracketMatchCreateNestedManyWithoutItemBInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemBInput,
          BracketMatchUncheckedCreateWithoutItemBInput
        >
      | BracketMatchCreateWithoutItemBInput[]
      | BracketMatchUncheckedCreateWithoutItemBInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemBInput
      | BracketMatchCreateOrConnectWithoutItemBInput[];
    createMany?: BracketMatchCreateManyItemBInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type BracketMatchCreateNestedManyWithoutGanadorInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutGanadorInput,
          BracketMatchUncheckedCreateWithoutGanadorInput
        >
      | BracketMatchCreateWithoutGanadorInput[]
      | BracketMatchUncheckedCreateWithoutGanadorInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutGanadorInput
      | BracketMatchCreateOrConnectWithoutGanadorInput[];
    createMany?: BracketMatchCreateManyGanadorInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type CalificacionUncheckedCreateNestedManyWithoutItemInput = {
    create?:
      | XOR<
          CalificacionCreateWithoutItemInput,
          CalificacionUncheckedCreateWithoutItemInput
        >
      | CalificacionCreateWithoutItemInput[]
      | CalificacionUncheckedCreateWithoutItemInput[];
    connectOrCreate?:
      | CalificacionCreateOrConnectWithoutItemInput
      | CalificacionCreateOrConnectWithoutItemInput[];
    createMany?: CalificacionCreateManyItemInputEnvelope;
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
  };

  export type BracketMatchUncheckedCreateNestedManyWithoutItemAInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemAInput,
          BracketMatchUncheckedCreateWithoutItemAInput
        >
      | BracketMatchCreateWithoutItemAInput[]
      | BracketMatchUncheckedCreateWithoutItemAInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemAInput
      | BracketMatchCreateOrConnectWithoutItemAInput[];
    createMany?: BracketMatchCreateManyItemAInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type BracketMatchUncheckedCreateNestedManyWithoutItemBInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemBInput,
          BracketMatchUncheckedCreateWithoutItemBInput
        >
      | BracketMatchCreateWithoutItemBInput[]
      | BracketMatchUncheckedCreateWithoutItemBInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemBInput
      | BracketMatchCreateOrConnectWithoutItemBInput[];
    createMany?: BracketMatchCreateManyItemBInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type BracketMatchUncheckedCreateNestedManyWithoutGanadorInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutGanadorInput,
          BracketMatchUncheckedCreateWithoutGanadorInput
        >
      | BracketMatchCreateWithoutGanadorInput[]
      | BracketMatchUncheckedCreateWithoutGanadorInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutGanadorInput
      | BracketMatchCreateOrConnectWithoutGanadorInput[];
    createMany?: BracketMatchCreateManyGanadorInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type CalificacionUpdateManyWithoutItemNestedInput = {
    create?:
      | XOR<
          CalificacionCreateWithoutItemInput,
          CalificacionUncheckedCreateWithoutItemInput
        >
      | CalificacionCreateWithoutItemInput[]
      | CalificacionUncheckedCreateWithoutItemInput[];
    connectOrCreate?:
      | CalificacionCreateOrConnectWithoutItemInput
      | CalificacionCreateOrConnectWithoutItemInput[];
    upsert?:
      | CalificacionUpsertWithWhereUniqueWithoutItemInput
      | CalificacionUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: CalificacionCreateManyItemInputEnvelope;
    set?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    disconnect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    delete?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    update?:
      | CalificacionUpdateWithWhereUniqueWithoutItemInput
      | CalificacionUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?:
      | CalificacionUpdateManyWithWhereWithoutItemInput
      | CalificacionUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[];
  };

  export type CategoriaUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<
      CategoriaCreateWithoutItemsInput,
      CategoriaUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: CategoriaCreateOrConnectWithoutItemsInput;
    upsert?: CategoriaUpsertWithoutItemsInput;
    connect?: CategoriaWhereUniqueInput;
    update?: XOR<
      XOR<
        CategoriaUpdateToOneWithWhereWithoutItemsInput,
        CategoriaUpdateWithoutItemsInput
      >,
      CategoriaUncheckedUpdateWithoutItemsInput
    >;
  };

  export type BracketMatchUpdateManyWithoutItemANestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemAInput,
          BracketMatchUncheckedCreateWithoutItemAInput
        >
      | BracketMatchCreateWithoutItemAInput[]
      | BracketMatchUncheckedCreateWithoutItemAInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemAInput
      | BracketMatchCreateOrConnectWithoutItemAInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutItemAInput
      | BracketMatchUpsertWithWhereUniqueWithoutItemAInput[];
    createMany?: BracketMatchCreateManyItemAInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutItemAInput
      | BracketMatchUpdateWithWhereUniqueWithoutItemAInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutItemAInput
      | BracketMatchUpdateManyWithWhereWithoutItemAInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type BracketMatchUpdateManyWithoutItemBNestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemBInput,
          BracketMatchUncheckedCreateWithoutItemBInput
        >
      | BracketMatchCreateWithoutItemBInput[]
      | BracketMatchUncheckedCreateWithoutItemBInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemBInput
      | BracketMatchCreateOrConnectWithoutItemBInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutItemBInput
      | BracketMatchUpsertWithWhereUniqueWithoutItemBInput[];
    createMany?: BracketMatchCreateManyItemBInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutItemBInput
      | BracketMatchUpdateWithWhereUniqueWithoutItemBInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutItemBInput
      | BracketMatchUpdateManyWithWhereWithoutItemBInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type BracketMatchUpdateManyWithoutGanadorNestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutGanadorInput,
          BracketMatchUncheckedCreateWithoutGanadorInput
        >
      | BracketMatchCreateWithoutGanadorInput[]
      | BracketMatchUncheckedCreateWithoutGanadorInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutGanadorInput
      | BracketMatchCreateOrConnectWithoutGanadorInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutGanadorInput
      | BracketMatchUpsertWithWhereUniqueWithoutGanadorInput[];
    createMany?: BracketMatchCreateManyGanadorInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutGanadorInput
      | BracketMatchUpdateWithWhereUniqueWithoutGanadorInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutGanadorInput
      | BracketMatchUpdateManyWithWhereWithoutGanadorInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type CalificacionUncheckedUpdateManyWithoutItemNestedInput = {
    create?:
      | XOR<
          CalificacionCreateWithoutItemInput,
          CalificacionUncheckedCreateWithoutItemInput
        >
      | CalificacionCreateWithoutItemInput[]
      | CalificacionUncheckedCreateWithoutItemInput[];
    connectOrCreate?:
      | CalificacionCreateOrConnectWithoutItemInput
      | CalificacionCreateOrConnectWithoutItemInput[];
    upsert?:
      | CalificacionUpsertWithWhereUniqueWithoutItemInput
      | CalificacionUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: CalificacionCreateManyItemInputEnvelope;
    set?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    disconnect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    delete?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[];
    update?:
      | CalificacionUpdateWithWhereUniqueWithoutItemInput
      | CalificacionUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?:
      | CalificacionUpdateManyWithWhereWithoutItemInput
      | CalificacionUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[];
  };

  export type BracketMatchUncheckedUpdateManyWithoutItemANestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemAInput,
          BracketMatchUncheckedCreateWithoutItemAInput
        >
      | BracketMatchCreateWithoutItemAInput[]
      | BracketMatchUncheckedCreateWithoutItemAInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemAInput
      | BracketMatchCreateOrConnectWithoutItemAInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutItemAInput
      | BracketMatchUpsertWithWhereUniqueWithoutItemAInput[];
    createMany?: BracketMatchCreateManyItemAInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutItemAInput
      | BracketMatchUpdateWithWhereUniqueWithoutItemAInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutItemAInput
      | BracketMatchUpdateManyWithWhereWithoutItemAInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type BracketMatchUncheckedUpdateManyWithoutItemBNestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutItemBInput,
          BracketMatchUncheckedCreateWithoutItemBInput
        >
      | BracketMatchCreateWithoutItemBInput[]
      | BracketMatchUncheckedCreateWithoutItemBInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutItemBInput
      | BracketMatchCreateOrConnectWithoutItemBInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutItemBInput
      | BracketMatchUpsertWithWhereUniqueWithoutItemBInput[];
    createMany?: BracketMatchCreateManyItemBInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutItemBInput
      | BracketMatchUpdateWithWhereUniqueWithoutItemBInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutItemBInput
      | BracketMatchUpdateManyWithWhereWithoutItemBInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type BracketMatchUncheckedUpdateManyWithoutGanadorNestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutGanadorInput,
          BracketMatchUncheckedCreateWithoutGanadorInput
        >
      | BracketMatchCreateWithoutGanadorInput[]
      | BracketMatchUncheckedCreateWithoutGanadorInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutGanadorInput
      | BracketMatchCreateOrConnectWithoutGanadorInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutGanadorInput
      | BracketMatchUpsertWithWhereUniqueWithoutGanadorInput[];
    createMany?: BracketMatchCreateManyGanadorInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutGanadorInput
      | BracketMatchUpdateWithWhereUniqueWithoutGanadorInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutGanadorInput
      | BracketMatchUpdateManyWithWhereWithoutGanadorInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type ItemCalificableCreateNestedOneWithoutCalificacionesInput = {
    create?: XOR<
      ItemCalificableCreateWithoutCalificacionesInput,
      ItemCalificableUncheckedCreateWithoutCalificacionesInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutCalificacionesInput;
    connect?: ItemCalificableWhereUniqueInput;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type ItemCalificableUpdateOneRequiredWithoutCalificacionesNestedInput =
    {
      create?: XOR<
        ItemCalificableCreateWithoutCalificacionesInput,
        ItemCalificableUncheckedCreateWithoutCalificacionesInput
      >;
      connectOrCreate?: ItemCalificableCreateOrConnectWithoutCalificacionesInput;
      upsert?: ItemCalificableUpsertWithoutCalificacionesInput;
      connect?: ItemCalificableWhereUniqueInput;
      update?: XOR<
        XOR<
          ItemCalificableUpdateToOneWithWhereWithoutCalificacionesInput,
          ItemCalificableUpdateWithoutCalificacionesInput
        >,
        ItemCalificableUncheckedUpdateWithoutCalificacionesInput
      >;
    };

  export type JuegoCreateNestedOneWithoutVotacionesInput = {
    create?: XOR<
      JuegoCreateWithoutVotacionesInput,
      JuegoUncheckedCreateWithoutVotacionesInput
    >;
    connectOrCreate?: JuegoCreateOrConnectWithoutVotacionesInput;
    connect?: JuegoWhereUniqueInput;
  };

  export type BracketMatchCreateNestedManyWithoutBracketInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutBracketInput,
          BracketMatchUncheckedCreateWithoutBracketInput
        >
      | BracketMatchCreateWithoutBracketInput[]
      | BracketMatchUncheckedCreateWithoutBracketInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutBracketInput
      | BracketMatchCreateOrConnectWithoutBracketInput[];
    createMany?: BracketMatchCreateManyBracketInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type BracketMatchUncheckedCreateNestedManyWithoutBracketInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutBracketInput,
          BracketMatchUncheckedCreateWithoutBracketInput
        >
      | BracketMatchCreateWithoutBracketInput[]
      | BracketMatchUncheckedCreateWithoutBracketInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutBracketInput
      | BracketMatchCreateOrConnectWithoutBracketInput[];
    createMany?: BracketMatchCreateManyBracketInputEnvelope;
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
  };

  export type JuegoUpdateOneRequiredWithoutVotacionesNestedInput = {
    create?: XOR<
      JuegoCreateWithoutVotacionesInput,
      JuegoUncheckedCreateWithoutVotacionesInput
    >;
    connectOrCreate?: JuegoCreateOrConnectWithoutVotacionesInput;
    upsert?: JuegoUpsertWithoutVotacionesInput;
    connect?: JuegoWhereUniqueInput;
    update?: XOR<
      XOR<
        JuegoUpdateToOneWithWhereWithoutVotacionesInput,
        JuegoUpdateWithoutVotacionesInput
      >,
      JuegoUncheckedUpdateWithoutVotacionesInput
    >;
  };

  export type BracketMatchUpdateManyWithoutBracketNestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutBracketInput,
          BracketMatchUncheckedCreateWithoutBracketInput
        >
      | BracketMatchCreateWithoutBracketInput[]
      | BracketMatchUncheckedCreateWithoutBracketInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutBracketInput
      | BracketMatchCreateOrConnectWithoutBracketInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutBracketInput
      | BracketMatchUpsertWithWhereUniqueWithoutBracketInput[];
    createMany?: BracketMatchCreateManyBracketInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutBracketInput
      | BracketMatchUpdateWithWhereUniqueWithoutBracketInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutBracketInput
      | BracketMatchUpdateManyWithWhereWithoutBracketInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type BracketMatchUncheckedUpdateManyWithoutBracketNestedInput = {
    create?:
      | XOR<
          BracketMatchCreateWithoutBracketInput,
          BracketMatchUncheckedCreateWithoutBracketInput
        >
      | BracketMatchCreateWithoutBracketInput[]
      | BracketMatchUncheckedCreateWithoutBracketInput[];
    connectOrCreate?:
      | BracketMatchCreateOrConnectWithoutBracketInput
      | BracketMatchCreateOrConnectWithoutBracketInput[];
    upsert?:
      | BracketMatchUpsertWithWhereUniqueWithoutBracketInput
      | BracketMatchUpsertWithWhereUniqueWithoutBracketInput[];
    createMany?: BracketMatchCreateManyBracketInputEnvelope;
    set?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    disconnect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    delete?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    connect?: BracketMatchWhereUniqueInput | BracketMatchWhereUniqueInput[];
    update?:
      | BracketMatchUpdateWithWhereUniqueWithoutBracketInput
      | BracketMatchUpdateWithWhereUniqueWithoutBracketInput[];
    updateMany?:
      | BracketMatchUpdateManyWithWhereWithoutBracketInput
      | BracketMatchUpdateManyWithWhereWithoutBracketInput[];
    deleteMany?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
  };

  export type VotacionBracketCreateNestedOneWithoutMatchesInput = {
    create?: XOR<
      VotacionBracketCreateWithoutMatchesInput,
      VotacionBracketUncheckedCreateWithoutMatchesInput
    >;
    connectOrCreate?: VotacionBracketCreateOrConnectWithoutMatchesInput;
    connect?: VotacionBracketWhereUniqueInput;
  };

  export type ItemCalificableCreateNestedOneWithoutMatchesSideAInput = {
    create?: XOR<
      ItemCalificableCreateWithoutMatchesSideAInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideAInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutMatchesSideAInput;
    connect?: ItemCalificableWhereUniqueInput;
  };

  export type ItemCalificableCreateNestedOneWithoutMatchesSideBInput = {
    create?: XOR<
      ItemCalificableCreateWithoutMatchesSideBInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideBInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutMatchesSideBInput;
    connect?: ItemCalificableWhereUniqueInput;
  };

  export type ItemCalificableCreateNestedOneWithoutMatchesWonInput = {
    create?: XOR<
      ItemCalificableCreateWithoutMatchesWonInput,
      ItemCalificableUncheckedCreateWithoutMatchesWonInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutMatchesWonInput;
    connect?: ItemCalificableWhereUniqueInput;
  };

  export type VotacionBracketUpdateOneRequiredWithoutMatchesNestedInput = {
    create?: XOR<
      VotacionBracketCreateWithoutMatchesInput,
      VotacionBracketUncheckedCreateWithoutMatchesInput
    >;
    connectOrCreate?: VotacionBracketCreateOrConnectWithoutMatchesInput;
    upsert?: VotacionBracketUpsertWithoutMatchesInput;
    connect?: VotacionBracketWhereUniqueInput;
    update?: XOR<
      XOR<
        VotacionBracketUpdateToOneWithWhereWithoutMatchesInput,
        VotacionBracketUpdateWithoutMatchesInput
      >,
      VotacionBracketUncheckedUpdateWithoutMatchesInput
    >;
  };

  export type ItemCalificableUpdateOneWithoutMatchesSideANestedInput = {
    create?: XOR<
      ItemCalificableCreateWithoutMatchesSideAInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideAInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutMatchesSideAInput;
    upsert?: ItemCalificableUpsertWithoutMatchesSideAInput;
    disconnect?: ItemCalificableWhereInput | boolean;
    delete?: ItemCalificableWhereInput | boolean;
    connect?: ItemCalificableWhereUniqueInput;
    update?: XOR<
      XOR<
        ItemCalificableUpdateToOneWithWhereWithoutMatchesSideAInput,
        ItemCalificableUpdateWithoutMatchesSideAInput
      >,
      ItemCalificableUncheckedUpdateWithoutMatchesSideAInput
    >;
  };

  export type ItemCalificableUpdateOneWithoutMatchesSideBNestedInput = {
    create?: XOR<
      ItemCalificableCreateWithoutMatchesSideBInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideBInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutMatchesSideBInput;
    upsert?: ItemCalificableUpsertWithoutMatchesSideBInput;
    disconnect?: ItemCalificableWhereInput | boolean;
    delete?: ItemCalificableWhereInput | boolean;
    connect?: ItemCalificableWhereUniqueInput;
    update?: XOR<
      XOR<
        ItemCalificableUpdateToOneWithWhereWithoutMatchesSideBInput,
        ItemCalificableUpdateWithoutMatchesSideBInput
      >,
      ItemCalificableUncheckedUpdateWithoutMatchesSideBInput
    >;
  };

  export type ItemCalificableUpdateOneWithoutMatchesWonNestedInput = {
    create?: XOR<
      ItemCalificableCreateWithoutMatchesWonInput,
      ItemCalificableUncheckedCreateWithoutMatchesWonInput
    >;
    connectOrCreate?: ItemCalificableCreateOrConnectWithoutMatchesWonInput;
    upsert?: ItemCalificableUpsertWithoutMatchesWonInput;
    disconnect?: ItemCalificableWhereInput | boolean;
    delete?: ItemCalificableWhereInput | boolean;
    connect?: ItemCalificableWhereUniqueInput;
    update?: XOR<
      XOR<
        ItemCalificableUpdateToOneWithWhereWithoutMatchesWonInput,
        ItemCalificableUpdateWithoutMatchesWonInput
      >,
      ItemCalificableUncheckedUpdateWithoutMatchesWonInput
    >;
  };

  export type JuegoCreateNestedOneWithoutSorteosInput = {
    create?: XOR<
      JuegoCreateWithoutSorteosInput,
      JuegoUncheckedCreateWithoutSorteosInput
    >;
    connectOrCreate?: JuegoCreateOrConnectWithoutSorteosInput;
    connect?: JuegoWhereUniqueInput;
  };

  export type JuegoUpdateOneWithoutSorteosNestedInput = {
    create?: XOR<
      JuegoCreateWithoutSorteosInput,
      JuegoUncheckedCreateWithoutSorteosInput
    >;
    connectOrCreate?: JuegoCreateOrConnectWithoutSorteosInput;
    upsert?: JuegoUpsertWithoutSorteosInput;
    disconnect?: JuegoWhereInput | boolean;
    delete?: JuegoWhereInput | boolean;
    connect?: JuegoWhereUniqueInput;
    update?: XOR<
      XOR<
        JuegoUpdateToOneWithWhereWithoutSorteosInput,
        JuegoUpdateWithoutSorteosInput
      >,
      JuegoUncheckedUpdateWithoutSorteosInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedEnumRolFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>;
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    not?: NestedEnumRolFilter<$PrismaModel> | $Enums.Rol;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedEnumRolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rol | EnumRolFieldRefInput<$PrismaModel>;
    in?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Rol[] | ListEnumRolFieldRefInput<$PrismaModel>;
    not?: NestedEnumRolWithAggregatesFilter<$PrismaModel> | $Enums.Rol;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumRolFilter<$PrismaModel>;
    _max?: NestedEnumRolFilter<$PrismaModel>;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type CategoriaCreateWithoutJuegoInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: ItemCalificableCreateNestedManyWithoutCategoriaInput;
  };

  export type CategoriaUncheckedCreateWithoutJuegoInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: ItemCalificableUncheckedCreateNestedManyWithoutCategoriaInput;
  };

  export type CategoriaCreateOrConnectWithoutJuegoInput = {
    where: CategoriaWhereUniqueInput;
    create: XOR<
      CategoriaCreateWithoutJuegoInput,
      CategoriaUncheckedCreateWithoutJuegoInput
    >;
  };

  export type CategoriaCreateManyJuegoInputEnvelope = {
    data: CategoriaCreateManyJuegoInput | CategoriaCreateManyJuegoInput[];
    skipDuplicates?: boolean;
  };

  export type VotacionBracketCreateWithoutJuegoInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    matches?: BracketMatchCreateNestedManyWithoutBracketInput;
  };

  export type VotacionBracketUncheckedCreateWithoutJuegoInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    matches?: BracketMatchUncheckedCreateNestedManyWithoutBracketInput;
  };

  export type VotacionBracketCreateOrConnectWithoutJuegoInput = {
    where: VotacionBracketWhereUniqueInput;
    create: XOR<
      VotacionBracketCreateWithoutJuegoInput,
      VotacionBracketUncheckedCreateWithoutJuegoInput
    >;
  };

  export type VotacionBracketCreateManyJuegoInputEnvelope = {
    data:
      | VotacionBracketCreateManyJuegoInput
      | VotacionBracketCreateManyJuegoInput[];
    skipDuplicates?: boolean;
  };

  export type SorteoCreateWithoutJuegoInput = {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    premio: string;
    fechaFin: Date | string;
    estado?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SorteoUncheckedCreateWithoutJuegoInput = {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    premio: string;
    fechaFin: Date | string;
    estado?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SorteoCreateOrConnectWithoutJuegoInput = {
    where: SorteoWhereUniqueInput;
    create: XOR<
      SorteoCreateWithoutJuegoInput,
      SorteoUncheckedCreateWithoutJuegoInput
    >;
  };

  export type SorteoCreateManyJuegoInputEnvelope = {
    data: SorteoCreateManyJuegoInput | SorteoCreateManyJuegoInput[];
    skipDuplicates?: boolean;
  };

  export type CategoriaUpsertWithWhereUniqueWithoutJuegoInput = {
    where: CategoriaWhereUniqueInput;
    update: XOR<
      CategoriaUpdateWithoutJuegoInput,
      CategoriaUncheckedUpdateWithoutJuegoInput
    >;
    create: XOR<
      CategoriaCreateWithoutJuegoInput,
      CategoriaUncheckedCreateWithoutJuegoInput
    >;
  };

  export type CategoriaUpdateWithWhereUniqueWithoutJuegoInput = {
    where: CategoriaWhereUniqueInput;
    data: XOR<
      CategoriaUpdateWithoutJuegoInput,
      CategoriaUncheckedUpdateWithoutJuegoInput
    >;
  };

  export type CategoriaUpdateManyWithWhereWithoutJuegoInput = {
    where: CategoriaScalarWhereInput;
    data: XOR<
      CategoriaUpdateManyMutationInput,
      CategoriaUncheckedUpdateManyWithoutJuegoInput
    >;
  };

  export type CategoriaScalarWhereInput = {
    AND?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[];
    OR?: CategoriaScalarWhereInput[];
    NOT?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[];
    id?: StringFilter<'Categoria'> | string;
    nombre?: StringFilter<'Categoria'> | string;
    activa?: BoolFilter<'Categoria'> | boolean;
    tipo?: StringFilter<'Categoria'> | string;
    juegoId?: StringNullableFilter<'Categoria'> | string | null;
    createdAt?: DateTimeFilter<'Categoria'> | Date | string;
    updatedAt?: DateTimeFilter<'Categoria'> | Date | string;
  };

  export type VotacionBracketUpsertWithWhereUniqueWithoutJuegoInput = {
    where: VotacionBracketWhereUniqueInput;
    update: XOR<
      VotacionBracketUpdateWithoutJuegoInput,
      VotacionBracketUncheckedUpdateWithoutJuegoInput
    >;
    create: XOR<
      VotacionBracketCreateWithoutJuegoInput,
      VotacionBracketUncheckedCreateWithoutJuegoInput
    >;
  };

  export type VotacionBracketUpdateWithWhereUniqueWithoutJuegoInput = {
    where: VotacionBracketWhereUniqueInput;
    data: XOR<
      VotacionBracketUpdateWithoutJuegoInput,
      VotacionBracketUncheckedUpdateWithoutJuegoInput
    >;
  };

  export type VotacionBracketUpdateManyWithWhereWithoutJuegoInput = {
    where: VotacionBracketScalarWhereInput;
    data: XOR<
      VotacionBracketUpdateManyMutationInput,
      VotacionBracketUncheckedUpdateManyWithoutJuegoInput
    >;
  };

  export type VotacionBracketScalarWhereInput = {
    AND?: VotacionBracketScalarWhereInput | VotacionBracketScalarWhereInput[];
    OR?: VotacionBracketScalarWhereInput[];
    NOT?: VotacionBracketScalarWhereInput | VotacionBracketScalarWhereInput[];
    id?: StringFilter<'VotacionBracket'> | string;
    tematica?: StringFilter<'VotacionBracket'> | string;
    slug?: StringFilter<'VotacionBracket'> | string;
    estado?: StringFilter<'VotacionBracket'> | string;
    rondaActual?: IntFilter<'VotacionBracket'> | number;
    juegoId?: StringFilter<'VotacionBracket'> | string;
    createdAt?: DateTimeFilter<'VotacionBracket'> | Date | string;
    updatedAt?: DateTimeFilter<'VotacionBracket'> | Date | string;
  };

  export type SorteoUpsertWithWhereUniqueWithoutJuegoInput = {
    where: SorteoWhereUniqueInput;
    update: XOR<
      SorteoUpdateWithoutJuegoInput,
      SorteoUncheckedUpdateWithoutJuegoInput
    >;
    create: XOR<
      SorteoCreateWithoutJuegoInput,
      SorteoUncheckedCreateWithoutJuegoInput
    >;
  };

  export type SorteoUpdateWithWhereUniqueWithoutJuegoInput = {
    where: SorteoWhereUniqueInput;
    data: XOR<
      SorteoUpdateWithoutJuegoInput,
      SorteoUncheckedUpdateWithoutJuegoInput
    >;
  };

  export type SorteoUpdateManyWithWhereWithoutJuegoInput = {
    where: SorteoScalarWhereInput;
    data: XOR<
      SorteoUpdateManyMutationInput,
      SorteoUncheckedUpdateManyWithoutJuegoInput
    >;
  };

  export type SorteoScalarWhereInput = {
    AND?: SorteoScalarWhereInput | SorteoScalarWhereInput[];
    OR?: SorteoScalarWhereInput[];
    NOT?: SorteoScalarWhereInput | SorteoScalarWhereInput[];
    id?: StringFilter<'Sorteo'> | string;
    titulo?: StringFilter<'Sorteo'> | string;
    descripcion?: StringNullableFilter<'Sorteo'> | string | null;
    premio?: StringFilter<'Sorteo'> | string;
    fechaFin?: DateTimeFilter<'Sorteo'> | Date | string;
    estado?: StringFilter<'Sorteo'> | string;
    juegoId?: StringNullableFilter<'Sorteo'> | string | null;
    createdAt?: DateTimeFilter<'Sorteo'> | Date | string;
    updatedAt?: DateTimeFilter<'Sorteo'> | Date | string;
  };

  export type ItemCalificableCreateWithoutCategoriaInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionCreateNestedManyWithoutItemInput;
    matchesSideA?: BracketMatchCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableUncheckedCreateWithoutCategoriaInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutItemInput;
    matchesSideA?: BracketMatchUncheckedCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchUncheckedCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchUncheckedCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableCreateOrConnectWithoutCategoriaInput = {
    where: ItemCalificableWhereUniqueInput;
    create: XOR<
      ItemCalificableCreateWithoutCategoriaInput,
      ItemCalificableUncheckedCreateWithoutCategoriaInput
    >;
  };

  export type ItemCalificableCreateManyCategoriaInputEnvelope = {
    data:
      | ItemCalificableCreateManyCategoriaInput
      | ItemCalificableCreateManyCategoriaInput[];
    skipDuplicates?: boolean;
  };

  export type JuegoCreateWithoutCategoriasInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    votaciones?: VotacionBracketCreateNestedManyWithoutJuegoInput;
    sorteos?: SorteoCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoUncheckedCreateWithoutCategoriasInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    votaciones?: VotacionBracketUncheckedCreateNestedManyWithoutJuegoInput;
    sorteos?: SorteoUncheckedCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoCreateOrConnectWithoutCategoriasInput = {
    where: JuegoWhereUniqueInput;
    create: XOR<
      JuegoCreateWithoutCategoriasInput,
      JuegoUncheckedCreateWithoutCategoriasInput
    >;
  };

  export type ItemCalificableUpsertWithWhereUniqueWithoutCategoriaInput = {
    where: ItemCalificableWhereUniqueInput;
    update: XOR<
      ItemCalificableUpdateWithoutCategoriaInput,
      ItemCalificableUncheckedUpdateWithoutCategoriaInput
    >;
    create: XOR<
      ItemCalificableCreateWithoutCategoriaInput,
      ItemCalificableUncheckedCreateWithoutCategoriaInput
    >;
  };

  export type ItemCalificableUpdateWithWhereUniqueWithoutCategoriaInput = {
    where: ItemCalificableWhereUniqueInput;
    data: XOR<
      ItemCalificableUpdateWithoutCategoriaInput,
      ItemCalificableUncheckedUpdateWithoutCategoriaInput
    >;
  };

  export type ItemCalificableUpdateManyWithWhereWithoutCategoriaInput = {
    where: ItemCalificableScalarWhereInput;
    data: XOR<
      ItemCalificableUpdateManyMutationInput,
      ItemCalificableUncheckedUpdateManyWithoutCategoriaInput
    >;
  };

  export type ItemCalificableScalarWhereInput = {
    AND?: ItemCalificableScalarWhereInput | ItemCalificableScalarWhereInput[];
    OR?: ItemCalificableScalarWhereInput[];
    NOT?: ItemCalificableScalarWhereInput | ItemCalificableScalarWhereInput[];
    id?: StringFilter<'ItemCalificable'> | string;
    nombre?: StringFilter<'ItemCalificable'> | string;
    categoriaId?: StringFilter<'ItemCalificable'> | string;
    createdAt?: DateTimeFilter<'ItemCalificable'> | Date | string;
    updatedAt?: DateTimeFilter<'ItemCalificable'> | Date | string;
    image?: StringNullableFilter<'ItemCalificable'> | string | null;
  };

  export type JuegoUpsertWithoutCategoriasInput = {
    update: XOR<
      JuegoUpdateWithoutCategoriasInput,
      JuegoUncheckedUpdateWithoutCategoriasInput
    >;
    create: XOR<
      JuegoCreateWithoutCategoriasInput,
      JuegoUncheckedCreateWithoutCategoriasInput
    >;
    where?: JuegoWhereInput;
  };

  export type JuegoUpdateToOneWithWhereWithoutCategoriasInput = {
    where?: JuegoWhereInput;
    data: XOR<
      JuegoUpdateWithoutCategoriasInput,
      JuegoUncheckedUpdateWithoutCategoriasInput
    >;
  };

  export type JuegoUpdateWithoutCategoriasInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    votaciones?: VotacionBracketUpdateManyWithoutJuegoNestedInput;
    sorteos?: SorteoUpdateManyWithoutJuegoNestedInput;
  };

  export type JuegoUncheckedUpdateWithoutCategoriasInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    votaciones?: VotacionBracketUncheckedUpdateManyWithoutJuegoNestedInput;
    sorteos?: SorteoUncheckedUpdateManyWithoutJuegoNestedInput;
  };

  export type CalificacionCreateWithoutItemInput = {
    id?: string;
    puntuacion: number;
    ip?: string | null;
    createdAt?: Date | string;
    deviceId?: string | null;
  };

  export type CalificacionUncheckedCreateWithoutItemInput = {
    id?: string;
    puntuacion: number;
    ip?: string | null;
    createdAt?: Date | string;
    deviceId?: string | null;
  };

  export type CalificacionCreateOrConnectWithoutItemInput = {
    where: CalificacionWhereUniqueInput;
    create: XOR<
      CalificacionCreateWithoutItemInput,
      CalificacionUncheckedCreateWithoutItemInput
    >;
  };

  export type CalificacionCreateManyItemInputEnvelope = {
    data: CalificacionCreateManyItemInput | CalificacionCreateManyItemInput[];
    skipDuplicates?: boolean;
  };

  export type CategoriaCreateWithoutItemsInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    juego?: JuegoCreateNestedOneWithoutCategoriasInput;
  };

  export type CategoriaUncheckedCreateWithoutItemsInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    juegoId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CategoriaCreateOrConnectWithoutItemsInput = {
    where: CategoriaWhereUniqueInput;
    create: XOR<
      CategoriaCreateWithoutItemsInput,
      CategoriaUncheckedCreateWithoutItemsInput
    >;
  };

  export type BracketMatchCreateWithoutItemAInput = {
    id?: string;
    ronda: number;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bracket: VotacionBracketCreateNestedOneWithoutMatchesInput;
    itemB?: ItemCalificableCreateNestedOneWithoutMatchesSideBInput;
    ganador?: ItemCalificableCreateNestedOneWithoutMatchesWonInput;
  };

  export type BracketMatchUncheckedCreateWithoutItemAInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchCreateOrConnectWithoutItemAInput = {
    where: BracketMatchWhereUniqueInput;
    create: XOR<
      BracketMatchCreateWithoutItemAInput,
      BracketMatchUncheckedCreateWithoutItemAInput
    >;
  };

  export type BracketMatchCreateManyItemAInputEnvelope = {
    data: BracketMatchCreateManyItemAInput | BracketMatchCreateManyItemAInput[];
    skipDuplicates?: boolean;
  };

  export type BracketMatchCreateWithoutItemBInput = {
    id?: string;
    ronda: number;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bracket: VotacionBracketCreateNestedOneWithoutMatchesInput;
    itemA?: ItemCalificableCreateNestedOneWithoutMatchesSideAInput;
    ganador?: ItemCalificableCreateNestedOneWithoutMatchesWonInput;
  };

  export type BracketMatchUncheckedCreateWithoutItemBInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemAId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchCreateOrConnectWithoutItemBInput = {
    where: BracketMatchWhereUniqueInput;
    create: XOR<
      BracketMatchCreateWithoutItemBInput,
      BracketMatchUncheckedCreateWithoutItemBInput
    >;
  };

  export type BracketMatchCreateManyItemBInputEnvelope = {
    data: BracketMatchCreateManyItemBInput | BracketMatchCreateManyItemBInput[];
    skipDuplicates?: boolean;
  };

  export type BracketMatchCreateWithoutGanadorInput = {
    id?: string;
    ronda: number;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bracket: VotacionBracketCreateNestedOneWithoutMatchesInput;
    itemA?: ItemCalificableCreateNestedOneWithoutMatchesSideAInput;
    itemB?: ItemCalificableCreateNestedOneWithoutMatchesSideBInput;
  };

  export type BracketMatchUncheckedCreateWithoutGanadorInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemAId?: string | null;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchCreateOrConnectWithoutGanadorInput = {
    where: BracketMatchWhereUniqueInput;
    create: XOR<
      BracketMatchCreateWithoutGanadorInput,
      BracketMatchUncheckedCreateWithoutGanadorInput
    >;
  };

  export type BracketMatchCreateManyGanadorInputEnvelope = {
    data:
      | BracketMatchCreateManyGanadorInput
      | BracketMatchCreateManyGanadorInput[];
    skipDuplicates?: boolean;
  };

  export type CalificacionUpsertWithWhereUniqueWithoutItemInput = {
    where: CalificacionWhereUniqueInput;
    update: XOR<
      CalificacionUpdateWithoutItemInput,
      CalificacionUncheckedUpdateWithoutItemInput
    >;
    create: XOR<
      CalificacionCreateWithoutItemInput,
      CalificacionUncheckedCreateWithoutItemInput
    >;
  };

  export type CalificacionUpdateWithWhereUniqueWithoutItemInput = {
    where: CalificacionWhereUniqueInput;
    data: XOR<
      CalificacionUpdateWithoutItemInput,
      CalificacionUncheckedUpdateWithoutItemInput
    >;
  };

  export type CalificacionUpdateManyWithWhereWithoutItemInput = {
    where: CalificacionScalarWhereInput;
    data: XOR<
      CalificacionUpdateManyMutationInput,
      CalificacionUncheckedUpdateManyWithoutItemInput
    >;
  };

  export type CalificacionScalarWhereInput = {
    AND?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[];
    OR?: CalificacionScalarWhereInput[];
    NOT?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[];
    id?: StringFilter<'Calificacion'> | string;
    puntuacion?: IntFilter<'Calificacion'> | number;
    ip?: StringNullableFilter<'Calificacion'> | string | null;
    itemId?: StringFilter<'Calificacion'> | string;
    createdAt?: DateTimeFilter<'Calificacion'> | Date | string;
    deviceId?: StringNullableFilter<'Calificacion'> | string | null;
  };

  export type CategoriaUpsertWithoutItemsInput = {
    update: XOR<
      CategoriaUpdateWithoutItemsInput,
      CategoriaUncheckedUpdateWithoutItemsInput
    >;
    create: XOR<
      CategoriaCreateWithoutItemsInput,
      CategoriaUncheckedCreateWithoutItemsInput
    >;
    where?: CategoriaWhereInput;
  };

  export type CategoriaUpdateToOneWithWhereWithoutItemsInput = {
    where?: CategoriaWhereInput;
    data: XOR<
      CategoriaUpdateWithoutItemsInput,
      CategoriaUncheckedUpdateWithoutItemsInput
    >;
  };

  export type CategoriaUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    juego?: JuegoUpdateOneWithoutCategoriasNestedInput;
  };

  export type CategoriaUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    juegoId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUpsertWithWhereUniqueWithoutItemAInput = {
    where: BracketMatchWhereUniqueInput;
    update: XOR<
      BracketMatchUpdateWithoutItemAInput,
      BracketMatchUncheckedUpdateWithoutItemAInput
    >;
    create: XOR<
      BracketMatchCreateWithoutItemAInput,
      BracketMatchUncheckedCreateWithoutItemAInput
    >;
  };

  export type BracketMatchUpdateWithWhereUniqueWithoutItemAInput = {
    where: BracketMatchWhereUniqueInput;
    data: XOR<
      BracketMatchUpdateWithoutItemAInput,
      BracketMatchUncheckedUpdateWithoutItemAInput
    >;
  };

  export type BracketMatchUpdateManyWithWhereWithoutItemAInput = {
    where: BracketMatchScalarWhereInput;
    data: XOR<
      BracketMatchUpdateManyMutationInput,
      BracketMatchUncheckedUpdateManyWithoutItemAInput
    >;
  };

  export type BracketMatchScalarWhereInput = {
    AND?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
    OR?: BracketMatchScalarWhereInput[];
    NOT?: BracketMatchScalarWhereInput | BracketMatchScalarWhereInput[];
    id?: StringFilter<'BracketMatch'> | string;
    bracketId?: StringFilter<'BracketMatch'> | string;
    ronda?: IntFilter<'BracketMatch'> | number;
    itemAId?: StringNullableFilter<'BracketMatch'> | string | null;
    itemBId?: StringNullableFilter<'BracketMatch'> | string | null;
    votosA?: IntFilter<'BracketMatch'> | number;
    votosB?: IntFilter<'BracketMatch'> | number;
    ganadorId?: StringNullableFilter<'BracketMatch'> | string | null;
    createdAt?: DateTimeFilter<'BracketMatch'> | Date | string;
    updatedAt?: DateTimeFilter<'BracketMatch'> | Date | string;
  };

  export type BracketMatchUpsertWithWhereUniqueWithoutItemBInput = {
    where: BracketMatchWhereUniqueInput;
    update: XOR<
      BracketMatchUpdateWithoutItemBInput,
      BracketMatchUncheckedUpdateWithoutItemBInput
    >;
    create: XOR<
      BracketMatchCreateWithoutItemBInput,
      BracketMatchUncheckedCreateWithoutItemBInput
    >;
  };

  export type BracketMatchUpdateWithWhereUniqueWithoutItemBInput = {
    where: BracketMatchWhereUniqueInput;
    data: XOR<
      BracketMatchUpdateWithoutItemBInput,
      BracketMatchUncheckedUpdateWithoutItemBInput
    >;
  };

  export type BracketMatchUpdateManyWithWhereWithoutItemBInput = {
    where: BracketMatchScalarWhereInput;
    data: XOR<
      BracketMatchUpdateManyMutationInput,
      BracketMatchUncheckedUpdateManyWithoutItemBInput
    >;
  };

  export type BracketMatchUpsertWithWhereUniqueWithoutGanadorInput = {
    where: BracketMatchWhereUniqueInput;
    update: XOR<
      BracketMatchUpdateWithoutGanadorInput,
      BracketMatchUncheckedUpdateWithoutGanadorInput
    >;
    create: XOR<
      BracketMatchCreateWithoutGanadorInput,
      BracketMatchUncheckedCreateWithoutGanadorInput
    >;
  };

  export type BracketMatchUpdateWithWhereUniqueWithoutGanadorInput = {
    where: BracketMatchWhereUniqueInput;
    data: XOR<
      BracketMatchUpdateWithoutGanadorInput,
      BracketMatchUncheckedUpdateWithoutGanadorInput
    >;
  };

  export type BracketMatchUpdateManyWithWhereWithoutGanadorInput = {
    where: BracketMatchScalarWhereInput;
    data: XOR<
      BracketMatchUpdateManyMutationInput,
      BracketMatchUncheckedUpdateManyWithoutGanadorInput
    >;
  };

  export type ItemCalificableCreateWithoutCalificacionesInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    categoria: CategoriaCreateNestedOneWithoutItemsInput;
    matchesSideA?: BracketMatchCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableUncheckedCreateWithoutCalificacionesInput = {
    id?: string;
    nombre: string;
    categoriaId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    matchesSideA?: BracketMatchUncheckedCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchUncheckedCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchUncheckedCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableCreateOrConnectWithoutCalificacionesInput = {
    where: ItemCalificableWhereUniqueInput;
    create: XOR<
      ItemCalificableCreateWithoutCalificacionesInput,
      ItemCalificableUncheckedCreateWithoutCalificacionesInput
    >;
  };

  export type ItemCalificableUpsertWithoutCalificacionesInput = {
    update: XOR<
      ItemCalificableUpdateWithoutCalificacionesInput,
      ItemCalificableUncheckedUpdateWithoutCalificacionesInput
    >;
    create: XOR<
      ItemCalificableCreateWithoutCalificacionesInput,
      ItemCalificableUncheckedCreateWithoutCalificacionesInput
    >;
    where?: ItemCalificableWhereInput;
  };

  export type ItemCalificableUpdateToOneWithWhereWithoutCalificacionesInput = {
    where?: ItemCalificableWhereInput;
    data: XOR<
      ItemCalificableUpdateWithoutCalificacionesInput,
      ItemCalificableUncheckedUpdateWithoutCalificacionesInput
    >;
  };

  export type ItemCalificableUpdateWithoutCalificacionesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    categoria?: CategoriaUpdateOneRequiredWithoutItemsNestedInput;
    matchesSideA?: BracketMatchUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUncheckedUpdateWithoutCalificacionesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    categoriaId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    matchesSideA?: BracketMatchUncheckedUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUncheckedUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUncheckedUpdateManyWithoutGanadorNestedInput;
  };

  export type JuegoCreateWithoutVotacionesInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categorias?: CategoriaCreateNestedManyWithoutJuegoInput;
    sorteos?: SorteoCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoUncheckedCreateWithoutVotacionesInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categorias?: CategoriaUncheckedCreateNestedManyWithoutJuegoInput;
    sorteos?: SorteoUncheckedCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoCreateOrConnectWithoutVotacionesInput = {
    where: JuegoWhereUniqueInput;
    create: XOR<
      JuegoCreateWithoutVotacionesInput,
      JuegoUncheckedCreateWithoutVotacionesInput
    >;
  };

  export type BracketMatchCreateWithoutBracketInput = {
    id?: string;
    ronda: number;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    itemA?: ItemCalificableCreateNestedOneWithoutMatchesSideAInput;
    itemB?: ItemCalificableCreateNestedOneWithoutMatchesSideBInput;
    ganador?: ItemCalificableCreateNestedOneWithoutMatchesWonInput;
  };

  export type BracketMatchUncheckedCreateWithoutBracketInput = {
    id?: string;
    ronda: number;
    itemAId?: string | null;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchCreateOrConnectWithoutBracketInput = {
    where: BracketMatchWhereUniqueInput;
    create: XOR<
      BracketMatchCreateWithoutBracketInput,
      BracketMatchUncheckedCreateWithoutBracketInput
    >;
  };

  export type BracketMatchCreateManyBracketInputEnvelope = {
    data:
      | BracketMatchCreateManyBracketInput
      | BracketMatchCreateManyBracketInput[];
    skipDuplicates?: boolean;
  };

  export type JuegoUpsertWithoutVotacionesInput = {
    update: XOR<
      JuegoUpdateWithoutVotacionesInput,
      JuegoUncheckedUpdateWithoutVotacionesInput
    >;
    create: XOR<
      JuegoCreateWithoutVotacionesInput,
      JuegoUncheckedCreateWithoutVotacionesInput
    >;
    where?: JuegoWhereInput;
  };

  export type JuegoUpdateToOneWithWhereWithoutVotacionesInput = {
    where?: JuegoWhereInput;
    data: XOR<
      JuegoUpdateWithoutVotacionesInput,
      JuegoUncheckedUpdateWithoutVotacionesInput
    >;
  };

  export type JuegoUpdateWithoutVotacionesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categorias?: CategoriaUpdateManyWithoutJuegoNestedInput;
    sorteos?: SorteoUpdateManyWithoutJuegoNestedInput;
  };

  export type JuegoUncheckedUpdateWithoutVotacionesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categorias?: CategoriaUncheckedUpdateManyWithoutJuegoNestedInput;
    sorteos?: SorteoUncheckedUpdateManyWithoutJuegoNestedInput;
  };

  export type BracketMatchUpsertWithWhereUniqueWithoutBracketInput = {
    where: BracketMatchWhereUniqueInput;
    update: XOR<
      BracketMatchUpdateWithoutBracketInput,
      BracketMatchUncheckedUpdateWithoutBracketInput
    >;
    create: XOR<
      BracketMatchCreateWithoutBracketInput,
      BracketMatchUncheckedCreateWithoutBracketInput
    >;
  };

  export type BracketMatchUpdateWithWhereUniqueWithoutBracketInput = {
    where: BracketMatchWhereUniqueInput;
    data: XOR<
      BracketMatchUpdateWithoutBracketInput,
      BracketMatchUncheckedUpdateWithoutBracketInput
    >;
  };

  export type BracketMatchUpdateManyWithWhereWithoutBracketInput = {
    where: BracketMatchScalarWhereInput;
    data: XOR<
      BracketMatchUpdateManyMutationInput,
      BracketMatchUncheckedUpdateManyWithoutBracketInput
    >;
  };

  export type VotacionBracketCreateWithoutMatchesInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    juego: JuegoCreateNestedOneWithoutVotacionesInput;
  };

  export type VotacionBracketUncheckedCreateWithoutMatchesInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    juegoId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VotacionBracketCreateOrConnectWithoutMatchesInput = {
    where: VotacionBracketWhereUniqueInput;
    create: XOR<
      VotacionBracketCreateWithoutMatchesInput,
      VotacionBracketUncheckedCreateWithoutMatchesInput
    >;
  };

  export type ItemCalificableCreateWithoutMatchesSideAInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionCreateNestedManyWithoutItemInput;
    categoria: CategoriaCreateNestedOneWithoutItemsInput;
    matchesSideB?: BracketMatchCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableUncheckedCreateWithoutMatchesSideAInput = {
    id?: string;
    nombre: string;
    categoriaId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutItemInput;
    matchesSideB?: BracketMatchUncheckedCreateNestedManyWithoutItemBInput;
    matchesWon?: BracketMatchUncheckedCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableCreateOrConnectWithoutMatchesSideAInput = {
    where: ItemCalificableWhereUniqueInput;
    create: XOR<
      ItemCalificableCreateWithoutMatchesSideAInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideAInput
    >;
  };

  export type ItemCalificableCreateWithoutMatchesSideBInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionCreateNestedManyWithoutItemInput;
    categoria: CategoriaCreateNestedOneWithoutItemsInput;
    matchesSideA?: BracketMatchCreateNestedManyWithoutItemAInput;
    matchesWon?: BracketMatchCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableUncheckedCreateWithoutMatchesSideBInput = {
    id?: string;
    nombre: string;
    categoriaId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutItemInput;
    matchesSideA?: BracketMatchUncheckedCreateNestedManyWithoutItemAInput;
    matchesWon?: BracketMatchUncheckedCreateNestedManyWithoutGanadorInput;
  };

  export type ItemCalificableCreateOrConnectWithoutMatchesSideBInput = {
    where: ItemCalificableWhereUniqueInput;
    create: XOR<
      ItemCalificableCreateWithoutMatchesSideBInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideBInput
    >;
  };

  export type ItemCalificableCreateWithoutMatchesWonInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionCreateNestedManyWithoutItemInput;
    categoria: CategoriaCreateNestedOneWithoutItemsInput;
    matchesSideA?: BracketMatchCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchCreateNestedManyWithoutItemBInput;
  };

  export type ItemCalificableUncheckedCreateWithoutMatchesWonInput = {
    id?: string;
    nombre: string;
    categoriaId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutItemInput;
    matchesSideA?: BracketMatchUncheckedCreateNestedManyWithoutItemAInput;
    matchesSideB?: BracketMatchUncheckedCreateNestedManyWithoutItemBInput;
  };

  export type ItemCalificableCreateOrConnectWithoutMatchesWonInput = {
    where: ItemCalificableWhereUniqueInput;
    create: XOR<
      ItemCalificableCreateWithoutMatchesWonInput,
      ItemCalificableUncheckedCreateWithoutMatchesWonInput
    >;
  };

  export type VotacionBracketUpsertWithoutMatchesInput = {
    update: XOR<
      VotacionBracketUpdateWithoutMatchesInput,
      VotacionBracketUncheckedUpdateWithoutMatchesInput
    >;
    create: XOR<
      VotacionBracketCreateWithoutMatchesInput,
      VotacionBracketUncheckedCreateWithoutMatchesInput
    >;
    where?: VotacionBracketWhereInput;
  };

  export type VotacionBracketUpdateToOneWithWhereWithoutMatchesInput = {
    where?: VotacionBracketWhereInput;
    data: XOR<
      VotacionBracketUpdateWithoutMatchesInput,
      VotacionBracketUncheckedUpdateWithoutMatchesInput
    >;
  };

  export type VotacionBracketUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    juego?: JuegoUpdateOneRequiredWithoutVotacionesNestedInput;
  };

  export type VotacionBracketUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    juegoId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ItemCalificableUpsertWithoutMatchesSideAInput = {
    update: XOR<
      ItemCalificableUpdateWithoutMatchesSideAInput,
      ItemCalificableUncheckedUpdateWithoutMatchesSideAInput
    >;
    create: XOR<
      ItemCalificableCreateWithoutMatchesSideAInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideAInput
    >;
    where?: ItemCalificableWhereInput;
  };

  export type ItemCalificableUpdateToOneWithWhereWithoutMatchesSideAInput = {
    where?: ItemCalificableWhereInput;
    data: XOR<
      ItemCalificableUpdateWithoutMatchesSideAInput,
      ItemCalificableUncheckedUpdateWithoutMatchesSideAInput
    >;
  };

  export type ItemCalificableUpdateWithoutMatchesSideAInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUpdateManyWithoutItemNestedInput;
    categoria?: CategoriaUpdateOneRequiredWithoutItemsNestedInput;
    matchesSideB?: BracketMatchUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUncheckedUpdateWithoutMatchesSideAInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    categoriaId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUncheckedUpdateManyWithoutItemNestedInput;
    matchesSideB?: BracketMatchUncheckedUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUncheckedUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUpsertWithoutMatchesSideBInput = {
    update: XOR<
      ItemCalificableUpdateWithoutMatchesSideBInput,
      ItemCalificableUncheckedUpdateWithoutMatchesSideBInput
    >;
    create: XOR<
      ItemCalificableCreateWithoutMatchesSideBInput,
      ItemCalificableUncheckedCreateWithoutMatchesSideBInput
    >;
    where?: ItemCalificableWhereInput;
  };

  export type ItemCalificableUpdateToOneWithWhereWithoutMatchesSideBInput = {
    where?: ItemCalificableWhereInput;
    data: XOR<
      ItemCalificableUpdateWithoutMatchesSideBInput,
      ItemCalificableUncheckedUpdateWithoutMatchesSideBInput
    >;
  };

  export type ItemCalificableUpdateWithoutMatchesSideBInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUpdateManyWithoutItemNestedInput;
    categoria?: CategoriaUpdateOneRequiredWithoutItemsNestedInput;
    matchesSideA?: BracketMatchUpdateManyWithoutItemANestedInput;
    matchesWon?: BracketMatchUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUncheckedUpdateWithoutMatchesSideBInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    categoriaId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUncheckedUpdateManyWithoutItemNestedInput;
    matchesSideA?: BracketMatchUncheckedUpdateManyWithoutItemANestedInput;
    matchesWon?: BracketMatchUncheckedUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUpsertWithoutMatchesWonInput = {
    update: XOR<
      ItemCalificableUpdateWithoutMatchesWonInput,
      ItemCalificableUncheckedUpdateWithoutMatchesWonInput
    >;
    create: XOR<
      ItemCalificableCreateWithoutMatchesWonInput,
      ItemCalificableUncheckedCreateWithoutMatchesWonInput
    >;
    where?: ItemCalificableWhereInput;
  };

  export type ItemCalificableUpdateToOneWithWhereWithoutMatchesWonInput = {
    where?: ItemCalificableWhereInput;
    data: XOR<
      ItemCalificableUpdateWithoutMatchesWonInput,
      ItemCalificableUncheckedUpdateWithoutMatchesWonInput
    >;
  };

  export type ItemCalificableUpdateWithoutMatchesWonInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUpdateManyWithoutItemNestedInput;
    categoria?: CategoriaUpdateOneRequiredWithoutItemsNestedInput;
    matchesSideA?: BracketMatchUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUpdateManyWithoutItemBNestedInput;
  };

  export type ItemCalificableUncheckedUpdateWithoutMatchesWonInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    categoriaId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUncheckedUpdateManyWithoutItemNestedInput;
    matchesSideA?: BracketMatchUncheckedUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUncheckedUpdateManyWithoutItemBNestedInput;
  };

  export type JuegoCreateWithoutSorteosInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categorias?: CategoriaCreateNestedManyWithoutJuegoInput;
    votaciones?: VotacionBracketCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoUncheckedCreateWithoutSorteosInput = {
    id?: string;
    nombre: string;
    slug: string;
    descripcion?: string | null;
    image?: string | null;
    activo?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categorias?: CategoriaUncheckedCreateNestedManyWithoutJuegoInput;
    votaciones?: VotacionBracketUncheckedCreateNestedManyWithoutJuegoInput;
  };

  export type JuegoCreateOrConnectWithoutSorteosInput = {
    where: JuegoWhereUniqueInput;
    create: XOR<
      JuegoCreateWithoutSorteosInput,
      JuegoUncheckedCreateWithoutSorteosInput
    >;
  };

  export type JuegoUpsertWithoutSorteosInput = {
    update: XOR<
      JuegoUpdateWithoutSorteosInput,
      JuegoUncheckedUpdateWithoutSorteosInput
    >;
    create: XOR<
      JuegoCreateWithoutSorteosInput,
      JuegoUncheckedCreateWithoutSorteosInput
    >;
    where?: JuegoWhereInput;
  };

  export type JuegoUpdateToOneWithWhereWithoutSorteosInput = {
    where?: JuegoWhereInput;
    data: XOR<
      JuegoUpdateWithoutSorteosInput,
      JuegoUncheckedUpdateWithoutSorteosInput
    >;
  };

  export type JuegoUpdateWithoutSorteosInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categorias?: CategoriaUpdateManyWithoutJuegoNestedInput;
    votaciones?: VotacionBracketUpdateManyWithoutJuegoNestedInput;
  };

  export type JuegoUncheckedUpdateWithoutSorteosInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    activo?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    categorias?: CategoriaUncheckedUpdateManyWithoutJuegoNestedInput;
    votaciones?: VotacionBracketUncheckedUpdateManyWithoutJuegoNestedInput;
  };

  export type CategoriaCreateManyJuegoInput = {
    id?: string;
    nombre: string;
    activa?: boolean;
    tipo: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VotacionBracketCreateManyJuegoInput = {
    id?: string;
    tematica: string;
    slug: string;
    estado?: string;
    rondaActual?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SorteoCreateManyJuegoInput = {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    premio: string;
    fechaFin: Date | string;
    estado?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CategoriaUpdateWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: ItemCalificableUpdateManyWithoutCategoriaNestedInput;
  };

  export type CategoriaUncheckedUpdateWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: ItemCalificableUncheckedUpdateManyWithoutCategoriaNestedInput;
  };

  export type CategoriaUncheckedUpdateManyWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    activa?: BoolFieldUpdateOperationsInput | boolean;
    tipo?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VotacionBracketUpdateWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    matches?: BracketMatchUpdateManyWithoutBracketNestedInput;
  };

  export type VotacionBracketUncheckedUpdateWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    matches?: BracketMatchUncheckedUpdateManyWithoutBracketNestedInput;
  };

  export type VotacionBracketUncheckedUpdateManyWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    tematica?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    estado?: StringFieldUpdateOperationsInput | string;
    rondaActual?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SorteoUpdateWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SorteoUncheckedUpdateWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SorteoUncheckedUpdateManyWithoutJuegoInput = {
    id?: StringFieldUpdateOperationsInput | string;
    titulo?: StringFieldUpdateOperationsInput | string;
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null;
    premio?: StringFieldUpdateOperationsInput | string;
    fechaFin?: DateTimeFieldUpdateOperationsInput | Date | string;
    estado?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ItemCalificableCreateManyCategoriaInput = {
    id?: string;
    nombre: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    image?: string | null;
  };

  export type ItemCalificableUpdateWithoutCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUpdateManyWithoutItemNestedInput;
    matchesSideA?: BracketMatchUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUncheckedUpdateWithoutCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    calificaciones?: CalificacionUncheckedUpdateManyWithoutItemNestedInput;
    matchesSideA?: BracketMatchUncheckedUpdateManyWithoutItemANestedInput;
    matchesSideB?: BracketMatchUncheckedUpdateManyWithoutItemBNestedInput;
    matchesWon?: BracketMatchUncheckedUpdateManyWithoutGanadorNestedInput;
  };

  export type ItemCalificableUncheckedUpdateManyWithoutCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string;
    nombre?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CalificacionCreateManyItemInput = {
    id?: string;
    puntuacion: number;
    ip?: string | null;
    createdAt?: Date | string;
    deviceId?: string | null;
  };

  export type BracketMatchCreateManyItemAInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchCreateManyItemBInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemAId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchCreateManyGanadorInput = {
    id?: string;
    bracketId: string;
    ronda: number;
    itemAId?: string | null;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CalificacionUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CalificacionUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CalificacionUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puntuacion?: IntFieldUpdateOperationsInput | number;
    ip?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type BracketMatchUpdateWithoutItemAInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bracket?: VotacionBracketUpdateOneRequiredWithoutMatchesNestedInput;
    itemB?: ItemCalificableUpdateOneWithoutMatchesSideBNestedInput;
    ganador?: ItemCalificableUpdateOneWithoutMatchesWonNestedInput;
  };

  export type BracketMatchUncheckedUpdateWithoutItemAInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUncheckedUpdateManyWithoutItemAInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUpdateWithoutItemBInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bracket?: VotacionBracketUpdateOneRequiredWithoutMatchesNestedInput;
    itemA?: ItemCalificableUpdateOneWithoutMatchesSideANestedInput;
    ganador?: ItemCalificableUpdateOneWithoutMatchesWonNestedInput;
  };

  export type BracketMatchUncheckedUpdateWithoutItemBInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUncheckedUpdateManyWithoutItemBInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUpdateWithoutGanadorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bracket?: VotacionBracketUpdateOneRequiredWithoutMatchesNestedInput;
    itemA?: ItemCalificableUpdateOneWithoutMatchesSideANestedInput;
    itemB?: ItemCalificableUpdateOneWithoutMatchesSideBNestedInput;
  };

  export type BracketMatchUncheckedUpdateWithoutGanadorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUncheckedUpdateManyWithoutGanadorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    bracketId?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchCreateManyBracketInput = {
    id?: string;
    ronda: number;
    itemAId?: string | null;
    itemBId?: string | null;
    votosA?: number;
    votosB?: number;
    ganadorId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BracketMatchUpdateWithoutBracketInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    itemA?: ItemCalificableUpdateOneWithoutMatchesSideANestedInput;
    itemB?: ItemCalificableUpdateOneWithoutMatchesSideBNestedInput;
    ganador?: ItemCalificableUpdateOneWithoutMatchesWonNestedInput;
  };

  export type BracketMatchUncheckedUpdateWithoutBracketInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BracketMatchUncheckedUpdateManyWithoutBracketInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ronda?: IntFieldUpdateOperationsInput | number;
    itemAId?: NullableStringFieldUpdateOperationsInput | string | null;
    itemBId?: NullableStringFieldUpdateOperationsInput | string | null;
    votosA?: IntFieldUpdateOperationsInput | number;
    votosB?: IntFieldUpdateOperationsInput | number;
    ganadorId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
