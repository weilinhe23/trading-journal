
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model NewsCatalog
 * 
 */
export type NewsCatalog = $Result.DefaultSelection<Prisma.$NewsCatalogPayload>
/**
 * Model Strategy
 * 
 */
export type Strategy = $Result.DefaultSelection<Prisma.$StrategyPayload>
/**
 * Model TradeType
 * 
 */
export type TradeType = $Result.DefaultSelection<Prisma.$TradeTypePayload>
/**
 * Model DailySession
 * 
 */
export type DailySession = $Result.DefaultSelection<Prisma.$DailySessionPayload>
/**
 * Model NewsEvent
 * 
 */
export type NewsEvent = $Result.DefaultSelection<Prisma.$NewsEventPayload>
/**
 * Model TradeSetup
 * 
 */
export type TradeSetup = $Result.DefaultSelection<Prisma.$TradeSetupPayload>
/**
 * Model Execution
 * 
 */
export type Execution = $Result.DefaultSelection<Prisma.$ExecutionPayload>
/**
 * Model Screenshot
 * 
 */
export type Screenshot = $Result.DefaultSelection<Prisma.$ScreenshotPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Direction: {
  LONG: 'LONG',
  SHORT: 'SHORT',
  TBD: 'TBD'
};

export type Direction = (typeof Direction)[keyof typeof Direction]


export const PriceTier: {
  BELOW_2: 'BELOW_2',
  BETWEEN_2_20: 'BETWEEN_2_20',
  ABOVE_20: 'ABOVE_20'
};

export type PriceTier = (typeof PriceTier)[keyof typeof PriceTier]


export const MarketCapTier: {
  BELOW_300M: 'BELOW_300M',
  BETWEEN_300M_2B: 'BETWEEN_300M_2B',
  BETWEEN_2B_10B: 'BETWEEN_2B_10B',
  ABOVE_10B: 'ABOVE_10B'
};

export type MarketCapTier = (typeof MarketCapTier)[keyof typeof MarketCapTier]


export const SetupStatus: {
  WATCHING: 'WATCHING',
  EXECUTED: 'EXECUTED',
  MISSED: 'MISSED',
  INVALIDATED: 'INVALIDATED',
  CANCELLED: 'CANCELLED'
};

export type SetupStatus = (typeof SetupStatus)[keyof typeof SetupStatus]


export const MissedReason: {
  HESITATION: 'HESITATION',
  NO_CLEAR_SIGNAL: 'NO_CLEAR_SIGNAL',
  DISTRACTED: 'DISTRACTED',
  ALREADY_IN_TRADE: 'ALREADY_IN_TRADE',
  RISK_LIMIT_HIT: 'RISK_LIMIT_HIT',
  SPREAD_TOO_WIDE: 'SPREAD_TOO_WIDE',
  NEWS_RISK: 'NEWS_RISK',
  CHANGED_ANALYSIS: 'CHANGED_ANALYSIS',
  FEAR_OF_LOSS: 'FEAR_OF_LOSS',
  OTHER: 'OTHER'
};

export type MissedReason = (typeof MissedReason)[keyof typeof MissedReason]


export const Grade: {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export type Grade = (typeof Grade)[keyof typeof Grade]


export const NewsType: {
  EARNINGS: 'EARNINGS',
  FED: 'FED',
  MACRO: 'MACRO',
  SECTOR: 'SECTOR',
  COMPANY: 'COMPANY',
  TECHNICAL: 'TECHNICAL'
};

export type NewsType = (typeof NewsType)[keyof typeof NewsType]


export const NewsImpact: {
  BULLISH: 'BULLISH',
  BEARISH: 'BEARISH',
  NEUTRAL: 'NEUTRAL',
  UNCERTAIN: 'UNCERTAIN'
};

export type NewsImpact = (typeof NewsImpact)[keyof typeof NewsImpact]


export const NewsStrength: {
  STRONG: 'STRONG',
  MEDIUM: 'MEDIUM',
  WEAK: 'WEAK'
};

export type NewsStrength = (typeof NewsStrength)[keyof typeof NewsStrength]


export const ChartTag: {
  PRE_MARKET_PLAN: 'PRE_MARKET_PLAN',
  ENTRY_SIGNAL: 'ENTRY_SIGNAL',
  EXIT_SIGNAL: 'EXIT_SIGNAL',
  MISSED_SIGNAL: 'MISSED_SIGNAL',
  POST_REVIEW: 'POST_REVIEW',
  MARKET_OVERVIEW: 'MARKET_OVERVIEW'
};

export type ChartTag = (typeof ChartTag)[keyof typeof ChartTag]

}

export type Direction = $Enums.Direction

export const Direction: typeof $Enums.Direction

export type PriceTier = $Enums.PriceTier

export const PriceTier: typeof $Enums.PriceTier

export type MarketCapTier = $Enums.MarketCapTier

export const MarketCapTier: typeof $Enums.MarketCapTier

export type SetupStatus = $Enums.SetupStatus

export const SetupStatus: typeof $Enums.SetupStatus

export type MissedReason = $Enums.MissedReason

export const MissedReason: typeof $Enums.MissedReason

export type Grade = $Enums.Grade

export const Grade: typeof $Enums.Grade

export type NewsType = $Enums.NewsType

export const NewsType: typeof $Enums.NewsType

export type NewsImpact = $Enums.NewsImpact

export const NewsImpact: typeof $Enums.NewsImpact

export type NewsStrength = $Enums.NewsStrength

export const NewsStrength: typeof $Enums.NewsStrength

export type ChartTag = $Enums.ChartTag

export const ChartTag: typeof $Enums.ChartTag

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more NewsCatalogs
 * const newsCatalogs = await prisma.newsCatalog.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more NewsCatalogs
   * const newsCatalogs = await prisma.newsCatalog.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

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
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

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
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

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
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.newsCatalog`: Exposes CRUD operations for the **NewsCatalog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsCatalogs
    * const newsCatalogs = await prisma.newsCatalog.findMany()
    * ```
    */
  get newsCatalog(): Prisma.NewsCatalogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.strategy`: Exposes CRUD operations for the **Strategy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Strategies
    * const strategies = await prisma.strategy.findMany()
    * ```
    */
  get strategy(): Prisma.StrategyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradeType`: Exposes CRUD operations for the **TradeType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradeTypes
    * const tradeTypes = await prisma.tradeType.findMany()
    * ```
    */
  get tradeType(): Prisma.TradeTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailySession`: Exposes CRUD operations for the **DailySession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailySessions
    * const dailySessions = await prisma.dailySession.findMany()
    * ```
    */
  get dailySession(): Prisma.DailySessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsEvent`: Exposes CRUD operations for the **NewsEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsEvents
    * const newsEvents = await prisma.newsEvent.findMany()
    * ```
    */
  get newsEvent(): Prisma.NewsEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradeSetup`: Exposes CRUD operations for the **TradeSetup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradeSetups
    * const tradeSetups = await prisma.tradeSetup.findMany()
    * ```
    */
  get tradeSetup(): Prisma.TradeSetupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.execution`: Exposes CRUD operations for the **Execution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Executions
    * const executions = await prisma.execution.findMany()
    * ```
    */
  get execution(): Prisma.ExecutionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.screenshot`: Exposes CRUD operations for the **Screenshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Screenshots
    * const screenshots = await prisma.screenshot.findMany()
    * ```
    */
  get screenshot(): Prisma.ScreenshotDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

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
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
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
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    NewsCatalog: 'NewsCatalog',
    Strategy: 'Strategy',
    TradeType: 'TradeType',
    DailySession: 'DailySession',
    NewsEvent: 'NewsEvent',
    TradeSetup: 'TradeSetup',
    Execution: 'Execution',
    Screenshot: 'Screenshot'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "newsCatalog" | "strategy" | "tradeType" | "dailySession" | "newsEvent" | "tradeSetup" | "execution" | "screenshot"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      NewsCatalog: {
        payload: Prisma.$NewsCatalogPayload<ExtArgs>
        fields: Prisma.NewsCatalogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsCatalogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsCatalogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>
          }
          findFirst: {
            args: Prisma.NewsCatalogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsCatalogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>
          }
          findMany: {
            args: Prisma.NewsCatalogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>[]
          }
          create: {
            args: Prisma.NewsCatalogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>
          }
          createMany: {
            args: Prisma.NewsCatalogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsCatalogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>[]
          }
          delete: {
            args: Prisma.NewsCatalogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>
          }
          update: {
            args: Prisma.NewsCatalogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>
          }
          deleteMany: {
            args: Prisma.NewsCatalogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsCatalogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsCatalogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>[]
          }
          upsert: {
            args: Prisma.NewsCatalogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsCatalogPayload>
          }
          aggregate: {
            args: Prisma.NewsCatalogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsCatalog>
          }
          groupBy: {
            args: Prisma.NewsCatalogGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsCatalogGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsCatalogCountArgs<ExtArgs>
            result: $Utils.Optional<NewsCatalogCountAggregateOutputType> | number
          }
        }
      }
      Strategy: {
        payload: Prisma.$StrategyPayload<ExtArgs>
        fields: Prisma.StrategyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StrategyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StrategyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>
          }
          findFirst: {
            args: Prisma.StrategyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StrategyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>
          }
          findMany: {
            args: Prisma.StrategyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>[]
          }
          create: {
            args: Prisma.StrategyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>
          }
          createMany: {
            args: Prisma.StrategyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StrategyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>[]
          }
          delete: {
            args: Prisma.StrategyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>
          }
          update: {
            args: Prisma.StrategyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>
          }
          deleteMany: {
            args: Prisma.StrategyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StrategyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StrategyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>[]
          }
          upsert: {
            args: Prisma.StrategyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategyPayload>
          }
          aggregate: {
            args: Prisma.StrategyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStrategy>
          }
          groupBy: {
            args: Prisma.StrategyGroupByArgs<ExtArgs>
            result: $Utils.Optional<StrategyGroupByOutputType>[]
          }
          count: {
            args: Prisma.StrategyCountArgs<ExtArgs>
            result: $Utils.Optional<StrategyCountAggregateOutputType> | number
          }
        }
      }
      TradeType: {
        payload: Prisma.$TradeTypePayload<ExtArgs>
        fields: Prisma.TradeTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>
          }
          findFirst: {
            args: Prisma.TradeTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>
          }
          findMany: {
            args: Prisma.TradeTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>[]
          }
          create: {
            args: Prisma.TradeTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>
          }
          createMany: {
            args: Prisma.TradeTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>[]
          }
          delete: {
            args: Prisma.TradeTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>
          }
          update: {
            args: Prisma.TradeTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>
          }
          deleteMany: {
            args: Prisma.TradeTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>[]
          }
          upsert: {
            args: Prisma.TradeTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeTypePayload>
          }
          aggregate: {
            args: Prisma.TradeTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradeType>
          }
          groupBy: {
            args: Prisma.TradeTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeTypeCountArgs<ExtArgs>
            result: $Utils.Optional<TradeTypeCountAggregateOutputType> | number
          }
        }
      }
      DailySession: {
        payload: Prisma.$DailySessionPayload<ExtArgs>
        fields: Prisma.DailySessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailySessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailySessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>
          }
          findFirst: {
            args: Prisma.DailySessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailySessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>
          }
          findMany: {
            args: Prisma.DailySessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>[]
          }
          create: {
            args: Prisma.DailySessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>
          }
          createMany: {
            args: Prisma.DailySessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailySessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>[]
          }
          delete: {
            args: Prisma.DailySessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>
          }
          update: {
            args: Prisma.DailySessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>
          }
          deleteMany: {
            args: Prisma.DailySessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailySessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailySessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>[]
          }
          upsert: {
            args: Prisma.DailySessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailySessionPayload>
          }
          aggregate: {
            args: Prisma.DailySessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailySession>
          }
          groupBy: {
            args: Prisma.DailySessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailySessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailySessionCountArgs<ExtArgs>
            result: $Utils.Optional<DailySessionCountAggregateOutputType> | number
          }
        }
      }
      NewsEvent: {
        payload: Prisma.$NewsEventPayload<ExtArgs>
        fields: Prisma.NewsEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          findFirst: {
            args: Prisma.NewsEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          findMany: {
            args: Prisma.NewsEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>[]
          }
          create: {
            args: Prisma.NewsEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          createMany: {
            args: Prisma.NewsEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>[]
          }
          delete: {
            args: Prisma.NewsEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          update: {
            args: Prisma.NewsEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          deleteMany: {
            args: Prisma.NewsEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>[]
          }
          upsert: {
            args: Prisma.NewsEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsEventPayload>
          }
          aggregate: {
            args: Prisma.NewsEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsEvent>
          }
          groupBy: {
            args: Prisma.NewsEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsEventCountArgs<ExtArgs>
            result: $Utils.Optional<NewsEventCountAggregateOutputType> | number
          }
        }
      }
      TradeSetup: {
        payload: Prisma.$TradeSetupPayload<ExtArgs>
        fields: Prisma.TradeSetupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeSetupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeSetupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>
          }
          findFirst: {
            args: Prisma.TradeSetupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeSetupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>
          }
          findMany: {
            args: Prisma.TradeSetupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>[]
          }
          create: {
            args: Prisma.TradeSetupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>
          }
          createMany: {
            args: Prisma.TradeSetupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeSetupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>[]
          }
          delete: {
            args: Prisma.TradeSetupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>
          }
          update: {
            args: Prisma.TradeSetupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>
          }
          deleteMany: {
            args: Prisma.TradeSetupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeSetupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeSetupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>[]
          }
          upsert: {
            args: Prisma.TradeSetupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeSetupPayload>
          }
          aggregate: {
            args: Prisma.TradeSetupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradeSetup>
          }
          groupBy: {
            args: Prisma.TradeSetupGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeSetupGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeSetupCountArgs<ExtArgs>
            result: $Utils.Optional<TradeSetupCountAggregateOutputType> | number
          }
        }
      }
      Execution: {
        payload: Prisma.$ExecutionPayload<ExtArgs>
        fields: Prisma.ExecutionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExecutionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExecutionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          findFirst: {
            args: Prisma.ExecutionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExecutionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          findMany: {
            args: Prisma.ExecutionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>[]
          }
          create: {
            args: Prisma.ExecutionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          createMany: {
            args: Prisma.ExecutionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExecutionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>[]
          }
          delete: {
            args: Prisma.ExecutionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          update: {
            args: Prisma.ExecutionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          deleteMany: {
            args: Prisma.ExecutionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExecutionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExecutionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>[]
          }
          upsert: {
            args: Prisma.ExecutionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExecutionPayload>
          }
          aggregate: {
            args: Prisma.ExecutionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExecution>
          }
          groupBy: {
            args: Prisma.ExecutionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExecutionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExecutionCountArgs<ExtArgs>
            result: $Utils.Optional<ExecutionCountAggregateOutputType> | number
          }
        }
      }
      Screenshot: {
        payload: Prisma.$ScreenshotPayload<ExtArgs>
        fields: Prisma.ScreenshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScreenshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScreenshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>
          }
          findFirst: {
            args: Prisma.ScreenshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScreenshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>
          }
          findMany: {
            args: Prisma.ScreenshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>[]
          }
          create: {
            args: Prisma.ScreenshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>
          }
          createMany: {
            args: Prisma.ScreenshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScreenshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>[]
          }
          delete: {
            args: Prisma.ScreenshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>
          }
          update: {
            args: Prisma.ScreenshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>
          }
          deleteMany: {
            args: Prisma.ScreenshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScreenshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScreenshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>[]
          }
          upsert: {
            args: Prisma.ScreenshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScreenshotPayload>
          }
          aggregate: {
            args: Prisma.ScreenshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScreenshot>
          }
          groupBy: {
            args: Prisma.ScreenshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScreenshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScreenshotCountArgs<ExtArgs>
            result: $Utils.Optional<ScreenshotCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
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
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
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
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    newsCatalog?: NewsCatalogOmit
    strategy?: StrategyOmit
    tradeType?: TradeTypeOmit
    dailySession?: DailySessionOmit
    newsEvent?: NewsEventOmit
    tradeSetup?: TradeSetupOmit
    execution?: ExecutionOmit
    screenshot?: ScreenshotOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
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
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type NewsCatalogCountOutputType
   */

  export type NewsCatalogCountOutputType = {
    setups: number
  }

  export type NewsCatalogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setups?: boolean | NewsCatalogCountOutputTypeCountSetupsArgs
  }

  // Custom InputTypes
  /**
   * NewsCatalogCountOutputType without action
   */
  export type NewsCatalogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalogCountOutputType
     */
    select?: NewsCatalogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewsCatalogCountOutputType without action
   */
  export type NewsCatalogCountOutputTypeCountSetupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeSetupWhereInput
  }


  /**
   * Count Type StrategyCountOutputType
   */

  export type StrategyCountOutputType = {
    setups: number
    tradeTypes: number
  }

  export type StrategyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setups?: boolean | StrategyCountOutputTypeCountSetupsArgs
    tradeTypes?: boolean | StrategyCountOutputTypeCountTradeTypesArgs
  }

  // Custom InputTypes
  /**
   * StrategyCountOutputType without action
   */
  export type StrategyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategyCountOutputType
     */
    select?: StrategyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StrategyCountOutputType without action
   */
  export type StrategyCountOutputTypeCountSetupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeSetupWhereInput
  }

  /**
   * StrategyCountOutputType without action
   */
  export type StrategyCountOutputTypeCountTradeTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeTypeWhereInput
  }


  /**
   * Count Type DailySessionCountOutputType
   */

  export type DailySessionCountOutputType = {
    newsEvents: number
    setups: number
    screenshots: number
  }

  export type DailySessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsEvents?: boolean | DailySessionCountOutputTypeCountNewsEventsArgs
    setups?: boolean | DailySessionCountOutputTypeCountSetupsArgs
    screenshots?: boolean | DailySessionCountOutputTypeCountScreenshotsArgs
  }

  // Custom InputTypes
  /**
   * DailySessionCountOutputType without action
   */
  export type DailySessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySessionCountOutputType
     */
    select?: DailySessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DailySessionCountOutputType without action
   */
  export type DailySessionCountOutputTypeCountNewsEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsEventWhereInput
  }

  /**
   * DailySessionCountOutputType without action
   */
  export type DailySessionCountOutputTypeCountSetupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeSetupWhereInput
  }

  /**
   * DailySessionCountOutputType without action
   */
  export type DailySessionCountOutputTypeCountScreenshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScreenshotWhereInput
  }


  /**
   * Count Type NewsEventCountOutputType
   */

  export type NewsEventCountOutputType = {
    setups: number
  }

  export type NewsEventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setups?: boolean | NewsEventCountOutputTypeCountSetupsArgs
  }

  // Custom InputTypes
  /**
   * NewsEventCountOutputType without action
   */
  export type NewsEventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEventCountOutputType
     */
    select?: NewsEventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewsEventCountOutputType without action
   */
  export type NewsEventCountOutputTypeCountSetupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeSetupWhereInput
  }


  /**
   * Count Type TradeSetupCountOutputType
   */

  export type TradeSetupCountOutputType = {
    newsEvents: number
    executions: number
    screenshots: number
  }

  export type TradeSetupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsEvents?: boolean | TradeSetupCountOutputTypeCountNewsEventsArgs
    executions?: boolean | TradeSetupCountOutputTypeCountExecutionsArgs
    screenshots?: boolean | TradeSetupCountOutputTypeCountScreenshotsArgs
  }

  // Custom InputTypes
  /**
   * TradeSetupCountOutputType without action
   */
  export type TradeSetupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetupCountOutputType
     */
    select?: TradeSetupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradeSetupCountOutputType without action
   */
  export type TradeSetupCountOutputTypeCountNewsEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsEventWhereInput
  }

  /**
   * TradeSetupCountOutputType without action
   */
  export type TradeSetupCountOutputTypeCountExecutionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionWhereInput
  }

  /**
   * TradeSetupCountOutputType without action
   */
  export type TradeSetupCountOutputTypeCountScreenshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScreenshotWhereInput
  }


  /**
   * Count Type ExecutionCountOutputType
   */

  export type ExecutionCountOutputType = {
    screenshots: number
  }

  export type ExecutionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    screenshots?: boolean | ExecutionCountOutputTypeCountScreenshotsArgs
  }

  // Custom InputTypes
  /**
   * ExecutionCountOutputType without action
   */
  export type ExecutionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExecutionCountOutputType
     */
    select?: ExecutionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExecutionCountOutputType without action
   */
  export type ExecutionCountOutputTypeCountScreenshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScreenshotWhereInput
  }


  /**
   * Models
   */

  /**
   * Model NewsCatalog
   */

  export type AggregateNewsCatalog = {
    _count: NewsCatalogCountAggregateOutputType | null
    _min: NewsCatalogMinAggregateOutputType | null
    _max: NewsCatalogMaxAggregateOutputType | null
  }

  export type NewsCatalogMinAggregateOutputType = {
    id: string | null
    name: string | null
    category: string | null
    subCategory: string | null
    strength: $Enums.NewsStrength | null
    description: string | null
    entryConditions: string | null
    riskFactors: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NewsCatalogMaxAggregateOutputType = {
    id: string | null
    name: string | null
    category: string | null
    subCategory: string | null
    strength: $Enums.NewsStrength | null
    description: string | null
    entryConditions: string | null
    riskFactors: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NewsCatalogCountAggregateOutputType = {
    id: number
    name: number
    category: number
    subCategory: number
    strength: number
    description: number
    entryConditions: number
    riskFactors: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NewsCatalogMinAggregateInputType = {
    id?: true
    name?: true
    category?: true
    subCategory?: true
    strength?: true
    description?: true
    entryConditions?: true
    riskFactors?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NewsCatalogMaxAggregateInputType = {
    id?: true
    name?: true
    category?: true
    subCategory?: true
    strength?: true
    description?: true
    entryConditions?: true
    riskFactors?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NewsCatalogCountAggregateInputType = {
    id?: true
    name?: true
    category?: true
    subCategory?: true
    strength?: true
    description?: true
    entryConditions?: true
    riskFactors?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NewsCatalogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsCatalog to aggregate.
     */
    where?: NewsCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsCatalogs to fetch.
     */
    orderBy?: NewsCatalogOrderByWithRelationInput | NewsCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsCatalogs
    **/
    _count?: true | NewsCatalogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsCatalogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsCatalogMaxAggregateInputType
  }

  export type GetNewsCatalogAggregateType<T extends NewsCatalogAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsCatalog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsCatalog[P]>
      : GetScalarType<T[P], AggregateNewsCatalog[P]>
  }




  export type NewsCatalogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsCatalogWhereInput
    orderBy?: NewsCatalogOrderByWithAggregationInput | NewsCatalogOrderByWithAggregationInput[]
    by: NewsCatalogScalarFieldEnum[] | NewsCatalogScalarFieldEnum
    having?: NewsCatalogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsCatalogCountAggregateInputType | true
    _min?: NewsCatalogMinAggregateInputType
    _max?: NewsCatalogMaxAggregateInputType
  }

  export type NewsCatalogGroupByOutputType = {
    id: string
    name: string
    category: string
    subCategory: string | null
    strength: $Enums.NewsStrength
    description: string | null
    entryConditions: string | null
    riskFactors: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: NewsCatalogCountAggregateOutputType | null
    _min: NewsCatalogMinAggregateOutputType | null
    _max: NewsCatalogMaxAggregateOutputType | null
  }

  type GetNewsCatalogGroupByPayload<T extends NewsCatalogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsCatalogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsCatalogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsCatalogGroupByOutputType[P]>
            : GetScalarType<T[P], NewsCatalogGroupByOutputType[P]>
        }
      >
    >


  export type NewsCatalogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    subCategory?: boolean
    strength?: boolean
    description?: boolean
    entryConditions?: boolean
    riskFactors?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    setups?: boolean | NewsCatalog$setupsArgs<ExtArgs>
    _count?: boolean | NewsCatalogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsCatalog"]>

  export type NewsCatalogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    subCategory?: boolean
    strength?: boolean
    description?: boolean
    entryConditions?: boolean
    riskFactors?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["newsCatalog"]>

  export type NewsCatalogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    subCategory?: boolean
    strength?: boolean
    description?: boolean
    entryConditions?: boolean
    riskFactors?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["newsCatalog"]>

  export type NewsCatalogSelectScalar = {
    id?: boolean
    name?: boolean
    category?: boolean
    subCategory?: boolean
    strength?: boolean
    description?: boolean
    entryConditions?: boolean
    riskFactors?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NewsCatalogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "category" | "subCategory" | "strength" | "description" | "entryConditions" | "riskFactors" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["newsCatalog"]>
  export type NewsCatalogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setups?: boolean | NewsCatalog$setupsArgs<ExtArgs>
    _count?: boolean | NewsCatalogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NewsCatalogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NewsCatalogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NewsCatalogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsCatalog"
    objects: {
      setups: Prisma.$TradeSetupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      category: string
      subCategory: string | null
      strength: $Enums.NewsStrength
      description: string | null
      entryConditions: string | null
      riskFactors: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["newsCatalog"]>
    composites: {}
  }

  type NewsCatalogGetPayload<S extends boolean | null | undefined | NewsCatalogDefaultArgs> = $Result.GetResult<Prisma.$NewsCatalogPayload, S>

  type NewsCatalogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsCatalogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsCatalogCountAggregateInputType | true
    }

  export interface NewsCatalogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsCatalog'], meta: { name: 'NewsCatalog' } }
    /**
     * Find zero or one NewsCatalog that matches the filter.
     * @param {NewsCatalogFindUniqueArgs} args - Arguments to find a NewsCatalog
     * @example
     * // Get one NewsCatalog
     * const newsCatalog = await prisma.newsCatalog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsCatalogFindUniqueArgs>(args: SelectSubset<T, NewsCatalogFindUniqueArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsCatalog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsCatalogFindUniqueOrThrowArgs} args - Arguments to find a NewsCatalog
     * @example
     * // Get one NewsCatalog
     * const newsCatalog = await prisma.newsCatalog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsCatalogFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsCatalogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsCatalog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogFindFirstArgs} args - Arguments to find a NewsCatalog
     * @example
     * // Get one NewsCatalog
     * const newsCatalog = await prisma.newsCatalog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsCatalogFindFirstArgs>(args?: SelectSubset<T, NewsCatalogFindFirstArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsCatalog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogFindFirstOrThrowArgs} args - Arguments to find a NewsCatalog
     * @example
     * // Get one NewsCatalog
     * const newsCatalog = await prisma.newsCatalog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsCatalogFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsCatalogFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsCatalogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsCatalogs
     * const newsCatalogs = await prisma.newsCatalog.findMany()
     * 
     * // Get first 10 NewsCatalogs
     * const newsCatalogs = await prisma.newsCatalog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsCatalogWithIdOnly = await prisma.newsCatalog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsCatalogFindManyArgs>(args?: SelectSubset<T, NewsCatalogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsCatalog.
     * @param {NewsCatalogCreateArgs} args - Arguments to create a NewsCatalog.
     * @example
     * // Create one NewsCatalog
     * const NewsCatalog = await prisma.newsCatalog.create({
     *   data: {
     *     // ... data to create a NewsCatalog
     *   }
     * })
     * 
     */
    create<T extends NewsCatalogCreateArgs>(args: SelectSubset<T, NewsCatalogCreateArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsCatalogs.
     * @param {NewsCatalogCreateManyArgs} args - Arguments to create many NewsCatalogs.
     * @example
     * // Create many NewsCatalogs
     * const newsCatalog = await prisma.newsCatalog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsCatalogCreateManyArgs>(args?: SelectSubset<T, NewsCatalogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsCatalogs and returns the data saved in the database.
     * @param {NewsCatalogCreateManyAndReturnArgs} args - Arguments to create many NewsCatalogs.
     * @example
     * // Create many NewsCatalogs
     * const newsCatalog = await prisma.newsCatalog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsCatalogs and only return the `id`
     * const newsCatalogWithIdOnly = await prisma.newsCatalog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsCatalogCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsCatalogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsCatalog.
     * @param {NewsCatalogDeleteArgs} args - Arguments to delete one NewsCatalog.
     * @example
     * // Delete one NewsCatalog
     * const NewsCatalog = await prisma.newsCatalog.delete({
     *   where: {
     *     // ... filter to delete one NewsCatalog
     *   }
     * })
     * 
     */
    delete<T extends NewsCatalogDeleteArgs>(args: SelectSubset<T, NewsCatalogDeleteArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsCatalog.
     * @param {NewsCatalogUpdateArgs} args - Arguments to update one NewsCatalog.
     * @example
     * // Update one NewsCatalog
     * const newsCatalog = await prisma.newsCatalog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsCatalogUpdateArgs>(args: SelectSubset<T, NewsCatalogUpdateArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsCatalogs.
     * @param {NewsCatalogDeleteManyArgs} args - Arguments to filter NewsCatalogs to delete.
     * @example
     * // Delete a few NewsCatalogs
     * const { count } = await prisma.newsCatalog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsCatalogDeleteManyArgs>(args?: SelectSubset<T, NewsCatalogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsCatalogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsCatalogs
     * const newsCatalog = await prisma.newsCatalog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsCatalogUpdateManyArgs>(args: SelectSubset<T, NewsCatalogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsCatalogs and returns the data updated in the database.
     * @param {NewsCatalogUpdateManyAndReturnArgs} args - Arguments to update many NewsCatalogs.
     * @example
     * // Update many NewsCatalogs
     * const newsCatalog = await prisma.newsCatalog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsCatalogs and only return the `id`
     * const newsCatalogWithIdOnly = await prisma.newsCatalog.updateManyAndReturn({
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
    updateManyAndReturn<T extends NewsCatalogUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsCatalogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsCatalog.
     * @param {NewsCatalogUpsertArgs} args - Arguments to update or create a NewsCatalog.
     * @example
     * // Update or create a NewsCatalog
     * const newsCatalog = await prisma.newsCatalog.upsert({
     *   create: {
     *     // ... data to create a NewsCatalog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsCatalog we want to update
     *   }
     * })
     */
    upsert<T extends NewsCatalogUpsertArgs>(args: SelectSubset<T, NewsCatalogUpsertArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsCatalogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogCountArgs} args - Arguments to filter NewsCatalogs to count.
     * @example
     * // Count the number of NewsCatalogs
     * const count = await prisma.newsCatalog.count({
     *   where: {
     *     // ... the filter for the NewsCatalogs we want to count
     *   }
     * })
    **/
    count<T extends NewsCatalogCountArgs>(
      args?: Subset<T, NewsCatalogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsCatalogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsCatalog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NewsCatalogAggregateArgs>(args: Subset<T, NewsCatalogAggregateArgs>): Prisma.PrismaPromise<GetNewsCatalogAggregateType<T>>

    /**
     * Group by NewsCatalog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsCatalogGroupByArgs} args - Group by arguments.
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
      T extends NewsCatalogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsCatalogGroupByArgs['orderBy'] }
        : { orderBy?: NewsCatalogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsCatalogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsCatalogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsCatalog model
   */
  readonly fields: NewsCatalogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsCatalog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsCatalogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    setups<T extends NewsCatalog$setupsArgs<ExtArgs> = {}>(args?: Subset<T, NewsCatalog$setupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsCatalog model
   */
  interface NewsCatalogFieldRefs {
    readonly id: FieldRef<"NewsCatalog", 'String'>
    readonly name: FieldRef<"NewsCatalog", 'String'>
    readonly category: FieldRef<"NewsCatalog", 'String'>
    readonly subCategory: FieldRef<"NewsCatalog", 'String'>
    readonly strength: FieldRef<"NewsCatalog", 'NewsStrength'>
    readonly description: FieldRef<"NewsCatalog", 'String'>
    readonly entryConditions: FieldRef<"NewsCatalog", 'String'>
    readonly riskFactors: FieldRef<"NewsCatalog", 'String'>
    readonly isActive: FieldRef<"NewsCatalog", 'Boolean'>
    readonly createdAt: FieldRef<"NewsCatalog", 'DateTime'>
    readonly updatedAt: FieldRef<"NewsCatalog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsCatalog findUnique
   */
  export type NewsCatalogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * Filter, which NewsCatalog to fetch.
     */
    where: NewsCatalogWhereUniqueInput
  }

  /**
   * NewsCatalog findUniqueOrThrow
   */
  export type NewsCatalogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * Filter, which NewsCatalog to fetch.
     */
    where: NewsCatalogWhereUniqueInput
  }

  /**
   * NewsCatalog findFirst
   */
  export type NewsCatalogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * Filter, which NewsCatalog to fetch.
     */
    where?: NewsCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsCatalogs to fetch.
     */
    orderBy?: NewsCatalogOrderByWithRelationInput | NewsCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsCatalogs.
     */
    cursor?: NewsCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsCatalogs.
     */
    distinct?: NewsCatalogScalarFieldEnum | NewsCatalogScalarFieldEnum[]
  }

  /**
   * NewsCatalog findFirstOrThrow
   */
  export type NewsCatalogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * Filter, which NewsCatalog to fetch.
     */
    where?: NewsCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsCatalogs to fetch.
     */
    orderBy?: NewsCatalogOrderByWithRelationInput | NewsCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsCatalogs.
     */
    cursor?: NewsCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsCatalogs.
     */
    distinct?: NewsCatalogScalarFieldEnum | NewsCatalogScalarFieldEnum[]
  }

  /**
   * NewsCatalog findMany
   */
  export type NewsCatalogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * Filter, which NewsCatalogs to fetch.
     */
    where?: NewsCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsCatalogs to fetch.
     */
    orderBy?: NewsCatalogOrderByWithRelationInput | NewsCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsCatalogs.
     */
    cursor?: NewsCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsCatalogs.
     */
    skip?: number
    distinct?: NewsCatalogScalarFieldEnum | NewsCatalogScalarFieldEnum[]
  }

  /**
   * NewsCatalog create
   */
  export type NewsCatalogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsCatalog.
     */
    data: XOR<NewsCatalogCreateInput, NewsCatalogUncheckedCreateInput>
  }

  /**
   * NewsCatalog createMany
   */
  export type NewsCatalogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsCatalogs.
     */
    data: NewsCatalogCreateManyInput | NewsCatalogCreateManyInput[]
  }

  /**
   * NewsCatalog createManyAndReturn
   */
  export type NewsCatalogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * The data used to create many NewsCatalogs.
     */
    data: NewsCatalogCreateManyInput | NewsCatalogCreateManyInput[]
  }

  /**
   * NewsCatalog update
   */
  export type NewsCatalogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsCatalog.
     */
    data: XOR<NewsCatalogUpdateInput, NewsCatalogUncheckedUpdateInput>
    /**
     * Choose, which NewsCatalog to update.
     */
    where: NewsCatalogWhereUniqueInput
  }

  /**
   * NewsCatalog updateMany
   */
  export type NewsCatalogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsCatalogs.
     */
    data: XOR<NewsCatalogUpdateManyMutationInput, NewsCatalogUncheckedUpdateManyInput>
    /**
     * Filter which NewsCatalogs to update
     */
    where?: NewsCatalogWhereInput
    /**
     * Limit how many NewsCatalogs to update.
     */
    limit?: number
  }

  /**
   * NewsCatalog updateManyAndReturn
   */
  export type NewsCatalogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * The data used to update NewsCatalogs.
     */
    data: XOR<NewsCatalogUpdateManyMutationInput, NewsCatalogUncheckedUpdateManyInput>
    /**
     * Filter which NewsCatalogs to update
     */
    where?: NewsCatalogWhereInput
    /**
     * Limit how many NewsCatalogs to update.
     */
    limit?: number
  }

  /**
   * NewsCatalog upsert
   */
  export type NewsCatalogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsCatalog to update in case it exists.
     */
    where: NewsCatalogWhereUniqueInput
    /**
     * In case the NewsCatalog found by the `where` argument doesn't exist, create a new NewsCatalog with this data.
     */
    create: XOR<NewsCatalogCreateInput, NewsCatalogUncheckedCreateInput>
    /**
     * In case the NewsCatalog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsCatalogUpdateInput, NewsCatalogUncheckedUpdateInput>
  }

  /**
   * NewsCatalog delete
   */
  export type NewsCatalogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    /**
     * Filter which NewsCatalog to delete.
     */
    where: NewsCatalogWhereUniqueInput
  }

  /**
   * NewsCatalog deleteMany
   */
  export type NewsCatalogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsCatalogs to delete
     */
    where?: NewsCatalogWhereInput
    /**
     * Limit how many NewsCatalogs to delete.
     */
    limit?: number
  }

  /**
   * NewsCatalog.setups
   */
  export type NewsCatalog$setupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    where?: TradeSetupWhereInput
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    cursor?: TradeSetupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * NewsCatalog without action
   */
  export type NewsCatalogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
  }


  /**
   * Model Strategy
   */

  export type AggregateStrategy = {
    _count: StrategyCountAggregateOutputType | null
    _min: StrategyMinAggregateOutputType | null
    _max: StrategyMaxAggregateOutputType | null
  }

  export type StrategyMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isActive: boolean | null
    mindmapData: string | null
    ruleHistory: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StrategyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isActive: boolean | null
    mindmapData: string | null
    ruleHistory: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StrategyCountAggregateOutputType = {
    id: number
    name: number
    description: number
    isActive: number
    mindmapData: number
    ruleHistory: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StrategyMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isActive?: true
    mindmapData?: true
    ruleHistory?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StrategyMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isActive?: true
    mindmapData?: true
    ruleHistory?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StrategyCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isActive?: true
    mindmapData?: true
    ruleHistory?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StrategyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Strategy to aggregate.
     */
    where?: StrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Strategies to fetch.
     */
    orderBy?: StrategyOrderByWithRelationInput | StrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Strategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Strategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Strategies
    **/
    _count?: true | StrategyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StrategyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StrategyMaxAggregateInputType
  }

  export type GetStrategyAggregateType<T extends StrategyAggregateArgs> = {
        [P in keyof T & keyof AggregateStrategy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStrategy[P]>
      : GetScalarType<T[P], AggregateStrategy[P]>
  }




  export type StrategyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StrategyWhereInput
    orderBy?: StrategyOrderByWithAggregationInput | StrategyOrderByWithAggregationInput[]
    by: StrategyScalarFieldEnum[] | StrategyScalarFieldEnum
    having?: StrategyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StrategyCountAggregateInputType | true
    _min?: StrategyMinAggregateInputType
    _max?: StrategyMaxAggregateInputType
  }

  export type StrategyGroupByOutputType = {
    id: string
    name: string
    description: string | null
    isActive: boolean
    mindmapData: string
    ruleHistory: string
    createdAt: Date
    updatedAt: Date
    _count: StrategyCountAggregateOutputType | null
    _min: StrategyMinAggregateOutputType | null
    _max: StrategyMaxAggregateOutputType | null
  }

  type GetStrategyGroupByPayload<T extends StrategyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StrategyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StrategyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StrategyGroupByOutputType[P]>
            : GetScalarType<T[P], StrategyGroupByOutputType[P]>
        }
      >
    >


  export type StrategySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    mindmapData?: boolean
    ruleHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    setups?: boolean | Strategy$setupsArgs<ExtArgs>
    tradeTypes?: boolean | Strategy$tradeTypesArgs<ExtArgs>
    _count?: boolean | StrategyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategy"]>

  export type StrategySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    mindmapData?: boolean
    ruleHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["strategy"]>

  export type StrategySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    mindmapData?: boolean
    ruleHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["strategy"]>

  export type StrategySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    mindmapData?: boolean
    ruleHistory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StrategyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "isActive" | "mindmapData" | "ruleHistory" | "createdAt" | "updatedAt", ExtArgs["result"]["strategy"]>
  export type StrategyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setups?: boolean | Strategy$setupsArgs<ExtArgs>
    tradeTypes?: boolean | Strategy$tradeTypesArgs<ExtArgs>
    _count?: boolean | StrategyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StrategyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StrategyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StrategyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Strategy"
    objects: {
      setups: Prisma.$TradeSetupPayload<ExtArgs>[]
      tradeTypes: Prisma.$TradeTypePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      isActive: boolean
      mindmapData: string
      ruleHistory: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["strategy"]>
    composites: {}
  }

  type StrategyGetPayload<S extends boolean | null | undefined | StrategyDefaultArgs> = $Result.GetResult<Prisma.$StrategyPayload, S>

  type StrategyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StrategyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StrategyCountAggregateInputType | true
    }

  export interface StrategyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Strategy'], meta: { name: 'Strategy' } }
    /**
     * Find zero or one Strategy that matches the filter.
     * @param {StrategyFindUniqueArgs} args - Arguments to find a Strategy
     * @example
     * // Get one Strategy
     * const strategy = await prisma.strategy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StrategyFindUniqueArgs>(args: SelectSubset<T, StrategyFindUniqueArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Strategy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StrategyFindUniqueOrThrowArgs} args - Arguments to find a Strategy
     * @example
     * // Get one Strategy
     * const strategy = await prisma.strategy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StrategyFindUniqueOrThrowArgs>(args: SelectSubset<T, StrategyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Strategy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyFindFirstArgs} args - Arguments to find a Strategy
     * @example
     * // Get one Strategy
     * const strategy = await prisma.strategy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StrategyFindFirstArgs>(args?: SelectSubset<T, StrategyFindFirstArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Strategy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyFindFirstOrThrowArgs} args - Arguments to find a Strategy
     * @example
     * // Get one Strategy
     * const strategy = await prisma.strategy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StrategyFindFirstOrThrowArgs>(args?: SelectSubset<T, StrategyFindFirstOrThrowArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Strategies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Strategies
     * const strategies = await prisma.strategy.findMany()
     * 
     * // Get first 10 Strategies
     * const strategies = await prisma.strategy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const strategyWithIdOnly = await prisma.strategy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StrategyFindManyArgs>(args?: SelectSubset<T, StrategyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Strategy.
     * @param {StrategyCreateArgs} args - Arguments to create a Strategy.
     * @example
     * // Create one Strategy
     * const Strategy = await prisma.strategy.create({
     *   data: {
     *     // ... data to create a Strategy
     *   }
     * })
     * 
     */
    create<T extends StrategyCreateArgs>(args: SelectSubset<T, StrategyCreateArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Strategies.
     * @param {StrategyCreateManyArgs} args - Arguments to create many Strategies.
     * @example
     * // Create many Strategies
     * const strategy = await prisma.strategy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StrategyCreateManyArgs>(args?: SelectSubset<T, StrategyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Strategies and returns the data saved in the database.
     * @param {StrategyCreateManyAndReturnArgs} args - Arguments to create many Strategies.
     * @example
     * // Create many Strategies
     * const strategy = await prisma.strategy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Strategies and only return the `id`
     * const strategyWithIdOnly = await prisma.strategy.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StrategyCreateManyAndReturnArgs>(args?: SelectSubset<T, StrategyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Strategy.
     * @param {StrategyDeleteArgs} args - Arguments to delete one Strategy.
     * @example
     * // Delete one Strategy
     * const Strategy = await prisma.strategy.delete({
     *   where: {
     *     // ... filter to delete one Strategy
     *   }
     * })
     * 
     */
    delete<T extends StrategyDeleteArgs>(args: SelectSubset<T, StrategyDeleteArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Strategy.
     * @param {StrategyUpdateArgs} args - Arguments to update one Strategy.
     * @example
     * // Update one Strategy
     * const strategy = await prisma.strategy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StrategyUpdateArgs>(args: SelectSubset<T, StrategyUpdateArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Strategies.
     * @param {StrategyDeleteManyArgs} args - Arguments to filter Strategies to delete.
     * @example
     * // Delete a few Strategies
     * const { count } = await prisma.strategy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StrategyDeleteManyArgs>(args?: SelectSubset<T, StrategyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Strategies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Strategies
     * const strategy = await prisma.strategy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StrategyUpdateManyArgs>(args: SelectSubset<T, StrategyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Strategies and returns the data updated in the database.
     * @param {StrategyUpdateManyAndReturnArgs} args - Arguments to update many Strategies.
     * @example
     * // Update many Strategies
     * const strategy = await prisma.strategy.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Strategies and only return the `id`
     * const strategyWithIdOnly = await prisma.strategy.updateManyAndReturn({
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
    updateManyAndReturn<T extends StrategyUpdateManyAndReturnArgs>(args: SelectSubset<T, StrategyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Strategy.
     * @param {StrategyUpsertArgs} args - Arguments to update or create a Strategy.
     * @example
     * // Update or create a Strategy
     * const strategy = await prisma.strategy.upsert({
     *   create: {
     *     // ... data to create a Strategy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Strategy we want to update
     *   }
     * })
     */
    upsert<T extends StrategyUpsertArgs>(args: SelectSubset<T, StrategyUpsertArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Strategies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyCountArgs} args - Arguments to filter Strategies to count.
     * @example
     * // Count the number of Strategies
     * const count = await prisma.strategy.count({
     *   where: {
     *     // ... the filter for the Strategies we want to count
     *   }
     * })
    **/
    count<T extends StrategyCountArgs>(
      args?: Subset<T, StrategyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StrategyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Strategy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StrategyAggregateArgs>(args: Subset<T, StrategyAggregateArgs>): Prisma.PrismaPromise<GetStrategyAggregateType<T>>

    /**
     * Group by Strategy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategyGroupByArgs} args - Group by arguments.
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
      T extends StrategyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StrategyGroupByArgs['orderBy'] }
        : { orderBy?: StrategyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StrategyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStrategyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Strategy model
   */
  readonly fields: StrategyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Strategy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StrategyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    setups<T extends Strategy$setupsArgs<ExtArgs> = {}>(args?: Subset<T, Strategy$setupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tradeTypes<T extends Strategy$tradeTypesArgs<ExtArgs> = {}>(args?: Subset<T, Strategy$tradeTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Strategy model
   */
  interface StrategyFieldRefs {
    readonly id: FieldRef<"Strategy", 'String'>
    readonly name: FieldRef<"Strategy", 'String'>
    readonly description: FieldRef<"Strategy", 'String'>
    readonly isActive: FieldRef<"Strategy", 'Boolean'>
    readonly mindmapData: FieldRef<"Strategy", 'String'>
    readonly ruleHistory: FieldRef<"Strategy", 'String'>
    readonly createdAt: FieldRef<"Strategy", 'DateTime'>
    readonly updatedAt: FieldRef<"Strategy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Strategy findUnique
   */
  export type StrategyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * Filter, which Strategy to fetch.
     */
    where: StrategyWhereUniqueInput
  }

  /**
   * Strategy findUniqueOrThrow
   */
  export type StrategyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * Filter, which Strategy to fetch.
     */
    where: StrategyWhereUniqueInput
  }

  /**
   * Strategy findFirst
   */
  export type StrategyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * Filter, which Strategy to fetch.
     */
    where?: StrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Strategies to fetch.
     */
    orderBy?: StrategyOrderByWithRelationInput | StrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Strategies.
     */
    cursor?: StrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Strategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Strategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Strategies.
     */
    distinct?: StrategyScalarFieldEnum | StrategyScalarFieldEnum[]
  }

  /**
   * Strategy findFirstOrThrow
   */
  export type StrategyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * Filter, which Strategy to fetch.
     */
    where?: StrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Strategies to fetch.
     */
    orderBy?: StrategyOrderByWithRelationInput | StrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Strategies.
     */
    cursor?: StrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Strategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Strategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Strategies.
     */
    distinct?: StrategyScalarFieldEnum | StrategyScalarFieldEnum[]
  }

  /**
   * Strategy findMany
   */
  export type StrategyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * Filter, which Strategies to fetch.
     */
    where?: StrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Strategies to fetch.
     */
    orderBy?: StrategyOrderByWithRelationInput | StrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Strategies.
     */
    cursor?: StrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Strategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Strategies.
     */
    skip?: number
    distinct?: StrategyScalarFieldEnum | StrategyScalarFieldEnum[]
  }

  /**
   * Strategy create
   */
  export type StrategyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * The data needed to create a Strategy.
     */
    data: XOR<StrategyCreateInput, StrategyUncheckedCreateInput>
  }

  /**
   * Strategy createMany
   */
  export type StrategyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Strategies.
     */
    data: StrategyCreateManyInput | StrategyCreateManyInput[]
  }

  /**
   * Strategy createManyAndReturn
   */
  export type StrategyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * The data used to create many Strategies.
     */
    data: StrategyCreateManyInput | StrategyCreateManyInput[]
  }

  /**
   * Strategy update
   */
  export type StrategyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * The data needed to update a Strategy.
     */
    data: XOR<StrategyUpdateInput, StrategyUncheckedUpdateInput>
    /**
     * Choose, which Strategy to update.
     */
    where: StrategyWhereUniqueInput
  }

  /**
   * Strategy updateMany
   */
  export type StrategyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Strategies.
     */
    data: XOR<StrategyUpdateManyMutationInput, StrategyUncheckedUpdateManyInput>
    /**
     * Filter which Strategies to update
     */
    where?: StrategyWhereInput
    /**
     * Limit how many Strategies to update.
     */
    limit?: number
  }

  /**
   * Strategy updateManyAndReturn
   */
  export type StrategyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * The data used to update Strategies.
     */
    data: XOR<StrategyUpdateManyMutationInput, StrategyUncheckedUpdateManyInput>
    /**
     * Filter which Strategies to update
     */
    where?: StrategyWhereInput
    /**
     * Limit how many Strategies to update.
     */
    limit?: number
  }

  /**
   * Strategy upsert
   */
  export type StrategyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * The filter to search for the Strategy to update in case it exists.
     */
    where: StrategyWhereUniqueInput
    /**
     * In case the Strategy found by the `where` argument doesn't exist, create a new Strategy with this data.
     */
    create: XOR<StrategyCreateInput, StrategyUncheckedCreateInput>
    /**
     * In case the Strategy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StrategyUpdateInput, StrategyUncheckedUpdateInput>
  }

  /**
   * Strategy delete
   */
  export type StrategyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    /**
     * Filter which Strategy to delete.
     */
    where: StrategyWhereUniqueInput
  }

  /**
   * Strategy deleteMany
   */
  export type StrategyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Strategies to delete
     */
    where?: StrategyWhereInput
    /**
     * Limit how many Strategies to delete.
     */
    limit?: number
  }

  /**
   * Strategy.setups
   */
  export type Strategy$setupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    where?: TradeSetupWhereInput
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    cursor?: TradeSetupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * Strategy.tradeTypes
   */
  export type Strategy$tradeTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    where?: TradeTypeWhereInput
    orderBy?: TradeTypeOrderByWithRelationInput | TradeTypeOrderByWithRelationInput[]
    cursor?: TradeTypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeTypeScalarFieldEnum | TradeTypeScalarFieldEnum[]
  }

  /**
   * Strategy without action
   */
  export type StrategyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
  }


  /**
   * Model TradeType
   */

  export type AggregateTradeType = {
    _count: TradeTypeCountAggregateOutputType | null
    _min: TradeTypeMinAggregateOutputType | null
    _max: TradeTypeMaxAggregateOutputType | null
  }

  export type TradeTypeMinAggregateOutputType = {
    id: string | null
    name: string | null
    strategyId: string | null
    createdAt: Date | null
  }

  export type TradeTypeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    strategyId: string | null
    createdAt: Date | null
  }

  export type TradeTypeCountAggregateOutputType = {
    id: number
    name: number
    strategyId: number
    createdAt: number
    _all: number
  }


  export type TradeTypeMinAggregateInputType = {
    id?: true
    name?: true
    strategyId?: true
    createdAt?: true
  }

  export type TradeTypeMaxAggregateInputType = {
    id?: true
    name?: true
    strategyId?: true
    createdAt?: true
  }

  export type TradeTypeCountAggregateInputType = {
    id?: true
    name?: true
    strategyId?: true
    createdAt?: true
    _all?: true
  }

  export type TradeTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeType to aggregate.
     */
    where?: TradeTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeTypes to fetch.
     */
    orderBy?: TradeTypeOrderByWithRelationInput | TradeTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradeTypes
    **/
    _count?: true | TradeTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeTypeMaxAggregateInputType
  }

  export type GetTradeTypeAggregateType<T extends TradeTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateTradeType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradeType[P]>
      : GetScalarType<T[P], AggregateTradeType[P]>
  }




  export type TradeTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeTypeWhereInput
    orderBy?: TradeTypeOrderByWithAggregationInput | TradeTypeOrderByWithAggregationInput[]
    by: TradeTypeScalarFieldEnum[] | TradeTypeScalarFieldEnum
    having?: TradeTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeTypeCountAggregateInputType | true
    _min?: TradeTypeMinAggregateInputType
    _max?: TradeTypeMaxAggregateInputType
  }

  export type TradeTypeGroupByOutputType = {
    id: string
    name: string
    strategyId: string
    createdAt: Date
    _count: TradeTypeCountAggregateOutputType | null
    _min: TradeTypeMinAggregateOutputType | null
    _max: TradeTypeMaxAggregateOutputType | null
  }

  type GetTradeTypeGroupByPayload<T extends TradeTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeTypeGroupByOutputType[P]>
            : GetScalarType<T[P], TradeTypeGroupByOutputType[P]>
        }
      >
    >


  export type TradeTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    strategyId?: boolean
    createdAt?: boolean
    strategy?: boolean | StrategyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeType"]>

  export type TradeTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    strategyId?: boolean
    createdAt?: boolean
    strategy?: boolean | StrategyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeType"]>

  export type TradeTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    strategyId?: boolean
    createdAt?: boolean
    strategy?: boolean | StrategyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeType"]>

  export type TradeTypeSelectScalar = {
    id?: boolean
    name?: boolean
    strategyId?: boolean
    createdAt?: boolean
  }

  export type TradeTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "strategyId" | "createdAt", ExtArgs["result"]["tradeType"]>
  export type TradeTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    strategy?: boolean | StrategyDefaultArgs<ExtArgs>
  }
  export type TradeTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    strategy?: boolean | StrategyDefaultArgs<ExtArgs>
  }
  export type TradeTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    strategy?: boolean | StrategyDefaultArgs<ExtArgs>
  }

  export type $TradeTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradeType"
    objects: {
      strategy: Prisma.$StrategyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      strategyId: string
      createdAt: Date
    }, ExtArgs["result"]["tradeType"]>
    composites: {}
  }

  type TradeTypeGetPayload<S extends boolean | null | undefined | TradeTypeDefaultArgs> = $Result.GetResult<Prisma.$TradeTypePayload, S>

  type TradeTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeTypeCountAggregateInputType | true
    }

  export interface TradeTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradeType'], meta: { name: 'TradeType' } }
    /**
     * Find zero or one TradeType that matches the filter.
     * @param {TradeTypeFindUniqueArgs} args - Arguments to find a TradeType
     * @example
     * // Get one TradeType
     * const tradeType = await prisma.tradeType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeTypeFindUniqueArgs>(args: SelectSubset<T, TradeTypeFindUniqueArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradeType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeTypeFindUniqueOrThrowArgs} args - Arguments to find a TradeType
     * @example
     * // Get one TradeType
     * const tradeType = await prisma.tradeType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeFindFirstArgs} args - Arguments to find a TradeType
     * @example
     * // Get one TradeType
     * const tradeType = await prisma.tradeType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeTypeFindFirstArgs>(args?: SelectSubset<T, TradeTypeFindFirstArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeFindFirstOrThrowArgs} args - Arguments to find a TradeType
     * @example
     * // Get one TradeType
     * const tradeType = await prisma.tradeType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradeTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradeTypes
     * const tradeTypes = await prisma.tradeType.findMany()
     * 
     * // Get first 10 TradeTypes
     * const tradeTypes = await prisma.tradeType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeTypeWithIdOnly = await prisma.tradeType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeTypeFindManyArgs>(args?: SelectSubset<T, TradeTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradeType.
     * @param {TradeTypeCreateArgs} args - Arguments to create a TradeType.
     * @example
     * // Create one TradeType
     * const TradeType = await prisma.tradeType.create({
     *   data: {
     *     // ... data to create a TradeType
     *   }
     * })
     * 
     */
    create<T extends TradeTypeCreateArgs>(args: SelectSubset<T, TradeTypeCreateArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradeTypes.
     * @param {TradeTypeCreateManyArgs} args - Arguments to create many TradeTypes.
     * @example
     * // Create many TradeTypes
     * const tradeType = await prisma.tradeType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeTypeCreateManyArgs>(args?: SelectSubset<T, TradeTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradeTypes and returns the data saved in the database.
     * @param {TradeTypeCreateManyAndReturnArgs} args - Arguments to create many TradeTypes.
     * @example
     * // Create many TradeTypes
     * const tradeType = await prisma.tradeType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradeTypes and only return the `id`
     * const tradeTypeWithIdOnly = await prisma.tradeType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradeType.
     * @param {TradeTypeDeleteArgs} args - Arguments to delete one TradeType.
     * @example
     * // Delete one TradeType
     * const TradeType = await prisma.tradeType.delete({
     *   where: {
     *     // ... filter to delete one TradeType
     *   }
     * })
     * 
     */
    delete<T extends TradeTypeDeleteArgs>(args: SelectSubset<T, TradeTypeDeleteArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradeType.
     * @param {TradeTypeUpdateArgs} args - Arguments to update one TradeType.
     * @example
     * // Update one TradeType
     * const tradeType = await prisma.tradeType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeTypeUpdateArgs>(args: SelectSubset<T, TradeTypeUpdateArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradeTypes.
     * @param {TradeTypeDeleteManyArgs} args - Arguments to filter TradeTypes to delete.
     * @example
     * // Delete a few TradeTypes
     * const { count } = await prisma.tradeType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeTypeDeleteManyArgs>(args?: SelectSubset<T, TradeTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradeTypes
     * const tradeType = await prisma.tradeType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeTypeUpdateManyArgs>(args: SelectSubset<T, TradeTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeTypes and returns the data updated in the database.
     * @param {TradeTypeUpdateManyAndReturnArgs} args - Arguments to update many TradeTypes.
     * @example
     * // Update many TradeTypes
     * const tradeType = await prisma.tradeType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradeTypes and only return the `id`
     * const tradeTypeWithIdOnly = await prisma.tradeType.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradeTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradeType.
     * @param {TradeTypeUpsertArgs} args - Arguments to update or create a TradeType.
     * @example
     * // Update or create a TradeType
     * const tradeType = await prisma.tradeType.upsert({
     *   create: {
     *     // ... data to create a TradeType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradeType we want to update
     *   }
     * })
     */
    upsert<T extends TradeTypeUpsertArgs>(args: SelectSubset<T, TradeTypeUpsertArgs<ExtArgs>>): Prisma__TradeTypeClient<$Result.GetResult<Prisma.$TradeTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradeTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeCountArgs} args - Arguments to filter TradeTypes to count.
     * @example
     * // Count the number of TradeTypes
     * const count = await prisma.tradeType.count({
     *   where: {
     *     // ... the filter for the TradeTypes we want to count
     *   }
     * })
    **/
    count<T extends TradeTypeCountArgs>(
      args?: Subset<T, TradeTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradeType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradeTypeAggregateArgs>(args: Subset<T, TradeTypeAggregateArgs>): Prisma.PrismaPromise<GetTradeTypeAggregateType<T>>

    /**
     * Group by TradeType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeTypeGroupByArgs} args - Group by arguments.
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
      T extends TradeTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeTypeGroupByArgs['orderBy'] }
        : { orderBy?: TradeTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradeType model
   */
  readonly fields: TradeTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradeType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    strategy<T extends StrategyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StrategyDefaultArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradeType model
   */
  interface TradeTypeFieldRefs {
    readonly id: FieldRef<"TradeType", 'String'>
    readonly name: FieldRef<"TradeType", 'String'>
    readonly strategyId: FieldRef<"TradeType", 'String'>
    readonly createdAt: FieldRef<"TradeType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradeType findUnique
   */
  export type TradeTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * Filter, which TradeType to fetch.
     */
    where: TradeTypeWhereUniqueInput
  }

  /**
   * TradeType findUniqueOrThrow
   */
  export type TradeTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * Filter, which TradeType to fetch.
     */
    where: TradeTypeWhereUniqueInput
  }

  /**
   * TradeType findFirst
   */
  export type TradeTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * Filter, which TradeType to fetch.
     */
    where?: TradeTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeTypes to fetch.
     */
    orderBy?: TradeTypeOrderByWithRelationInput | TradeTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeTypes.
     */
    cursor?: TradeTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeTypes.
     */
    distinct?: TradeTypeScalarFieldEnum | TradeTypeScalarFieldEnum[]
  }

  /**
   * TradeType findFirstOrThrow
   */
  export type TradeTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * Filter, which TradeType to fetch.
     */
    where?: TradeTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeTypes to fetch.
     */
    orderBy?: TradeTypeOrderByWithRelationInput | TradeTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeTypes.
     */
    cursor?: TradeTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeTypes.
     */
    distinct?: TradeTypeScalarFieldEnum | TradeTypeScalarFieldEnum[]
  }

  /**
   * TradeType findMany
   */
  export type TradeTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * Filter, which TradeTypes to fetch.
     */
    where?: TradeTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeTypes to fetch.
     */
    orderBy?: TradeTypeOrderByWithRelationInput | TradeTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradeTypes.
     */
    cursor?: TradeTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeTypes.
     */
    skip?: number
    distinct?: TradeTypeScalarFieldEnum | TradeTypeScalarFieldEnum[]
  }

  /**
   * TradeType create
   */
  export type TradeTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a TradeType.
     */
    data: XOR<TradeTypeCreateInput, TradeTypeUncheckedCreateInput>
  }

  /**
   * TradeType createMany
   */
  export type TradeTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradeTypes.
     */
    data: TradeTypeCreateManyInput | TradeTypeCreateManyInput[]
  }

  /**
   * TradeType createManyAndReturn
   */
  export type TradeTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * The data used to create many TradeTypes.
     */
    data: TradeTypeCreateManyInput | TradeTypeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeType update
   */
  export type TradeTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a TradeType.
     */
    data: XOR<TradeTypeUpdateInput, TradeTypeUncheckedUpdateInput>
    /**
     * Choose, which TradeType to update.
     */
    where: TradeTypeWhereUniqueInput
  }

  /**
   * TradeType updateMany
   */
  export type TradeTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradeTypes.
     */
    data: XOR<TradeTypeUpdateManyMutationInput, TradeTypeUncheckedUpdateManyInput>
    /**
     * Filter which TradeTypes to update
     */
    where?: TradeTypeWhereInput
    /**
     * Limit how many TradeTypes to update.
     */
    limit?: number
  }

  /**
   * TradeType updateManyAndReturn
   */
  export type TradeTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * The data used to update TradeTypes.
     */
    data: XOR<TradeTypeUpdateManyMutationInput, TradeTypeUncheckedUpdateManyInput>
    /**
     * Filter which TradeTypes to update
     */
    where?: TradeTypeWhereInput
    /**
     * Limit how many TradeTypes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeType upsert
   */
  export type TradeTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the TradeType to update in case it exists.
     */
    where: TradeTypeWhereUniqueInput
    /**
     * In case the TradeType found by the `where` argument doesn't exist, create a new TradeType with this data.
     */
    create: XOR<TradeTypeCreateInput, TradeTypeUncheckedCreateInput>
    /**
     * In case the TradeType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeTypeUpdateInput, TradeTypeUncheckedUpdateInput>
  }

  /**
   * TradeType delete
   */
  export type TradeTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
    /**
     * Filter which TradeType to delete.
     */
    where: TradeTypeWhereUniqueInput
  }

  /**
   * TradeType deleteMany
   */
  export type TradeTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeTypes to delete
     */
    where?: TradeTypeWhereInput
    /**
     * Limit how many TradeTypes to delete.
     */
    limit?: number
  }

  /**
   * TradeType without action
   */
  export type TradeTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeType
     */
    select?: TradeTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeType
     */
    omit?: TradeTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeTypeInclude<ExtArgs> | null
  }


  /**
   * Model DailySession
   */

  export type AggregateDailySession = {
    _count: DailySessionCountAggregateOutputType | null
    _avg: DailySessionAvgAggregateOutputType | null
    _sum: DailySessionSumAggregateOutputType | null
    _min: DailySessionMinAggregateOutputType | null
    _max: DailySessionMaxAggregateOutputType | null
  }

  export type DailySessionAvgAggregateOutputType = {
    planFollowed: number | null
    emotionRating: number | null
    focusRating: number | null
  }

  export type DailySessionSumAggregateOutputType = {
    planFollowed: number | null
    emotionRating: number | null
    focusRating: number | null
  }

  export type DailySessionMinAggregateOutputType = {
    date: Date | null
    marketContext: string | null
    preMarketPlan: string | null
    selectedStrategy: string | null
    postReview: string | null
    lessonsLearned: string | null
    whatWentWell: string | null
    planFollowed: number | null
    emotionRating: number | null
    focusRating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailySessionMaxAggregateOutputType = {
    date: Date | null
    marketContext: string | null
    preMarketPlan: string | null
    selectedStrategy: string | null
    postReview: string | null
    lessonsLearned: string | null
    whatWentWell: string | null
    planFollowed: number | null
    emotionRating: number | null
    focusRating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailySessionCountAggregateOutputType = {
    date: number
    marketContext: number
    preMarketPlan: number
    selectedStrategy: number
    postReview: number
    lessonsLearned: number
    whatWentWell: number
    planFollowed: number
    emotionRating: number
    focusRating: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DailySessionAvgAggregateInputType = {
    planFollowed?: true
    emotionRating?: true
    focusRating?: true
  }

  export type DailySessionSumAggregateInputType = {
    planFollowed?: true
    emotionRating?: true
    focusRating?: true
  }

  export type DailySessionMinAggregateInputType = {
    date?: true
    marketContext?: true
    preMarketPlan?: true
    selectedStrategy?: true
    postReview?: true
    lessonsLearned?: true
    whatWentWell?: true
    planFollowed?: true
    emotionRating?: true
    focusRating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailySessionMaxAggregateInputType = {
    date?: true
    marketContext?: true
    preMarketPlan?: true
    selectedStrategy?: true
    postReview?: true
    lessonsLearned?: true
    whatWentWell?: true
    planFollowed?: true
    emotionRating?: true
    focusRating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailySessionCountAggregateInputType = {
    date?: true
    marketContext?: true
    preMarketPlan?: true
    selectedStrategy?: true
    postReview?: true
    lessonsLearned?: true
    whatWentWell?: true
    planFollowed?: true
    emotionRating?: true
    focusRating?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DailySessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailySession to aggregate.
     */
    where?: DailySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySessions to fetch.
     */
    orderBy?: DailySessionOrderByWithRelationInput | DailySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailySessions
    **/
    _count?: true | DailySessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailySessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailySessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailySessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailySessionMaxAggregateInputType
  }

  export type GetDailySessionAggregateType<T extends DailySessionAggregateArgs> = {
        [P in keyof T & keyof AggregateDailySession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailySession[P]>
      : GetScalarType<T[P], AggregateDailySession[P]>
  }




  export type DailySessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailySessionWhereInput
    orderBy?: DailySessionOrderByWithAggregationInput | DailySessionOrderByWithAggregationInput[]
    by: DailySessionScalarFieldEnum[] | DailySessionScalarFieldEnum
    having?: DailySessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailySessionCountAggregateInputType | true
    _avg?: DailySessionAvgAggregateInputType
    _sum?: DailySessionSumAggregateInputType
    _min?: DailySessionMinAggregateInputType
    _max?: DailySessionMaxAggregateInputType
  }

  export type DailySessionGroupByOutputType = {
    date: Date
    marketContext: string | null
    preMarketPlan: string | null
    selectedStrategy: string
    postReview: string | null
    lessonsLearned: string | null
    whatWentWell: string | null
    planFollowed: number | null
    emotionRating: number | null
    focusRating: number | null
    createdAt: Date
    updatedAt: Date
    _count: DailySessionCountAggregateOutputType | null
    _avg: DailySessionAvgAggregateOutputType | null
    _sum: DailySessionSumAggregateOutputType | null
    _min: DailySessionMinAggregateOutputType | null
    _max: DailySessionMaxAggregateOutputType | null
  }

  type GetDailySessionGroupByPayload<T extends DailySessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailySessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailySessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailySessionGroupByOutputType[P]>
            : GetScalarType<T[P], DailySessionGroupByOutputType[P]>
        }
      >
    >


  export type DailySessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    marketContext?: boolean
    preMarketPlan?: boolean
    selectedStrategy?: boolean
    postReview?: boolean
    lessonsLearned?: boolean
    whatWentWell?: boolean
    planFollowed?: boolean
    emotionRating?: boolean
    focusRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    newsEvents?: boolean | DailySession$newsEventsArgs<ExtArgs>
    setups?: boolean | DailySession$setupsArgs<ExtArgs>
    screenshots?: boolean | DailySession$screenshotsArgs<ExtArgs>
    _count?: boolean | DailySessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailySession"]>

  export type DailySessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    marketContext?: boolean
    preMarketPlan?: boolean
    selectedStrategy?: boolean
    postReview?: boolean
    lessonsLearned?: boolean
    whatWentWell?: boolean
    planFollowed?: boolean
    emotionRating?: boolean
    focusRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailySession"]>

  export type DailySessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    date?: boolean
    marketContext?: boolean
    preMarketPlan?: boolean
    selectedStrategy?: boolean
    postReview?: boolean
    lessonsLearned?: boolean
    whatWentWell?: boolean
    planFollowed?: boolean
    emotionRating?: boolean
    focusRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailySession"]>

  export type DailySessionSelectScalar = {
    date?: boolean
    marketContext?: boolean
    preMarketPlan?: boolean
    selectedStrategy?: boolean
    postReview?: boolean
    lessonsLearned?: boolean
    whatWentWell?: boolean
    planFollowed?: boolean
    emotionRating?: boolean
    focusRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DailySessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"date" | "marketContext" | "preMarketPlan" | "selectedStrategy" | "postReview" | "lessonsLearned" | "whatWentWell" | "planFollowed" | "emotionRating" | "focusRating" | "createdAt" | "updatedAt", ExtArgs["result"]["dailySession"]>
  export type DailySessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsEvents?: boolean | DailySession$newsEventsArgs<ExtArgs>
    setups?: boolean | DailySession$setupsArgs<ExtArgs>
    screenshots?: boolean | DailySession$screenshotsArgs<ExtArgs>
    _count?: boolean | DailySessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DailySessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DailySessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DailySessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailySession"
    objects: {
      newsEvents: Prisma.$NewsEventPayload<ExtArgs>[]
      setups: Prisma.$TradeSetupPayload<ExtArgs>[]
      screenshots: Prisma.$ScreenshotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      date: Date
      marketContext: string | null
      preMarketPlan: string | null
      selectedStrategy: string
      postReview: string | null
      lessonsLearned: string | null
      whatWentWell: string | null
      planFollowed: number | null
      emotionRating: number | null
      focusRating: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dailySession"]>
    composites: {}
  }

  type DailySessionGetPayload<S extends boolean | null | undefined | DailySessionDefaultArgs> = $Result.GetResult<Prisma.$DailySessionPayload, S>

  type DailySessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailySessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailySessionCountAggregateInputType | true
    }

  export interface DailySessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailySession'], meta: { name: 'DailySession' } }
    /**
     * Find zero or one DailySession that matches the filter.
     * @param {DailySessionFindUniqueArgs} args - Arguments to find a DailySession
     * @example
     * // Get one DailySession
     * const dailySession = await prisma.dailySession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailySessionFindUniqueArgs>(args: SelectSubset<T, DailySessionFindUniqueArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailySession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailySessionFindUniqueOrThrowArgs} args - Arguments to find a DailySession
     * @example
     * // Get one DailySession
     * const dailySession = await prisma.dailySession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailySessionFindUniqueOrThrowArgs>(args: SelectSubset<T, DailySessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailySession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionFindFirstArgs} args - Arguments to find a DailySession
     * @example
     * // Get one DailySession
     * const dailySession = await prisma.dailySession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailySessionFindFirstArgs>(args?: SelectSubset<T, DailySessionFindFirstArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailySession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionFindFirstOrThrowArgs} args - Arguments to find a DailySession
     * @example
     * // Get one DailySession
     * const dailySession = await prisma.dailySession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailySessionFindFirstOrThrowArgs>(args?: SelectSubset<T, DailySessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailySessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailySessions
     * const dailySessions = await prisma.dailySession.findMany()
     * 
     * // Get first 10 DailySessions
     * const dailySessions = await prisma.dailySession.findMany({ take: 10 })
     * 
     * // Only select the `date`
     * const dailySessionWithDateOnly = await prisma.dailySession.findMany({ select: { date: true } })
     * 
     */
    findMany<T extends DailySessionFindManyArgs>(args?: SelectSubset<T, DailySessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailySession.
     * @param {DailySessionCreateArgs} args - Arguments to create a DailySession.
     * @example
     * // Create one DailySession
     * const DailySession = await prisma.dailySession.create({
     *   data: {
     *     // ... data to create a DailySession
     *   }
     * })
     * 
     */
    create<T extends DailySessionCreateArgs>(args: SelectSubset<T, DailySessionCreateArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailySessions.
     * @param {DailySessionCreateManyArgs} args - Arguments to create many DailySessions.
     * @example
     * // Create many DailySessions
     * const dailySession = await prisma.dailySession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailySessionCreateManyArgs>(args?: SelectSubset<T, DailySessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailySessions and returns the data saved in the database.
     * @param {DailySessionCreateManyAndReturnArgs} args - Arguments to create many DailySessions.
     * @example
     * // Create many DailySessions
     * const dailySession = await prisma.dailySession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailySessions and only return the `date`
     * const dailySessionWithDateOnly = await prisma.dailySession.createManyAndReturn({
     *   select: { date: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailySessionCreateManyAndReturnArgs>(args?: SelectSubset<T, DailySessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailySession.
     * @param {DailySessionDeleteArgs} args - Arguments to delete one DailySession.
     * @example
     * // Delete one DailySession
     * const DailySession = await prisma.dailySession.delete({
     *   where: {
     *     // ... filter to delete one DailySession
     *   }
     * })
     * 
     */
    delete<T extends DailySessionDeleteArgs>(args: SelectSubset<T, DailySessionDeleteArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailySession.
     * @param {DailySessionUpdateArgs} args - Arguments to update one DailySession.
     * @example
     * // Update one DailySession
     * const dailySession = await prisma.dailySession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailySessionUpdateArgs>(args: SelectSubset<T, DailySessionUpdateArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailySessions.
     * @param {DailySessionDeleteManyArgs} args - Arguments to filter DailySessions to delete.
     * @example
     * // Delete a few DailySessions
     * const { count } = await prisma.dailySession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailySessionDeleteManyArgs>(args?: SelectSubset<T, DailySessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailySessions
     * const dailySession = await prisma.dailySession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailySessionUpdateManyArgs>(args: SelectSubset<T, DailySessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailySessions and returns the data updated in the database.
     * @param {DailySessionUpdateManyAndReturnArgs} args - Arguments to update many DailySessions.
     * @example
     * // Update many DailySessions
     * const dailySession = await prisma.dailySession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailySessions and only return the `date`
     * const dailySessionWithDateOnly = await prisma.dailySession.updateManyAndReturn({
     *   select: { date: true },
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
    updateManyAndReturn<T extends DailySessionUpdateManyAndReturnArgs>(args: SelectSubset<T, DailySessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailySession.
     * @param {DailySessionUpsertArgs} args - Arguments to update or create a DailySession.
     * @example
     * // Update or create a DailySession
     * const dailySession = await prisma.dailySession.upsert({
     *   create: {
     *     // ... data to create a DailySession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailySession we want to update
     *   }
     * })
     */
    upsert<T extends DailySessionUpsertArgs>(args: SelectSubset<T, DailySessionUpsertArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionCountArgs} args - Arguments to filter DailySessions to count.
     * @example
     * // Count the number of DailySessions
     * const count = await prisma.dailySession.count({
     *   where: {
     *     // ... the filter for the DailySessions we want to count
     *   }
     * })
    **/
    count<T extends DailySessionCountArgs>(
      args?: Subset<T, DailySessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailySessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DailySessionAggregateArgs>(args: Subset<T, DailySessionAggregateArgs>): Prisma.PrismaPromise<GetDailySessionAggregateType<T>>

    /**
     * Group by DailySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailySessionGroupByArgs} args - Group by arguments.
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
      T extends DailySessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailySessionGroupByArgs['orderBy'] }
        : { orderBy?: DailySessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailySessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailySessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailySession model
   */
  readonly fields: DailySessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailySession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailySessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    newsEvents<T extends DailySession$newsEventsArgs<ExtArgs> = {}>(args?: Subset<T, DailySession$newsEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    setups<T extends DailySession$setupsArgs<ExtArgs> = {}>(args?: Subset<T, DailySession$setupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    screenshots<T extends DailySession$screenshotsArgs<ExtArgs> = {}>(args?: Subset<T, DailySession$screenshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailySession model
   */
  interface DailySessionFieldRefs {
    readonly date: FieldRef<"DailySession", 'DateTime'>
    readonly marketContext: FieldRef<"DailySession", 'String'>
    readonly preMarketPlan: FieldRef<"DailySession", 'String'>
    readonly selectedStrategy: FieldRef<"DailySession", 'String'>
    readonly postReview: FieldRef<"DailySession", 'String'>
    readonly lessonsLearned: FieldRef<"DailySession", 'String'>
    readonly whatWentWell: FieldRef<"DailySession", 'String'>
    readonly planFollowed: FieldRef<"DailySession", 'Int'>
    readonly emotionRating: FieldRef<"DailySession", 'Int'>
    readonly focusRating: FieldRef<"DailySession", 'Int'>
    readonly createdAt: FieldRef<"DailySession", 'DateTime'>
    readonly updatedAt: FieldRef<"DailySession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailySession findUnique
   */
  export type DailySessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * Filter, which DailySession to fetch.
     */
    where: DailySessionWhereUniqueInput
  }

  /**
   * DailySession findUniqueOrThrow
   */
  export type DailySessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * Filter, which DailySession to fetch.
     */
    where: DailySessionWhereUniqueInput
  }

  /**
   * DailySession findFirst
   */
  export type DailySessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * Filter, which DailySession to fetch.
     */
    where?: DailySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySessions to fetch.
     */
    orderBy?: DailySessionOrderByWithRelationInput | DailySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailySessions.
     */
    cursor?: DailySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailySessions.
     */
    distinct?: DailySessionScalarFieldEnum | DailySessionScalarFieldEnum[]
  }

  /**
   * DailySession findFirstOrThrow
   */
  export type DailySessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * Filter, which DailySession to fetch.
     */
    where?: DailySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySessions to fetch.
     */
    orderBy?: DailySessionOrderByWithRelationInput | DailySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailySessions.
     */
    cursor?: DailySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailySessions.
     */
    distinct?: DailySessionScalarFieldEnum | DailySessionScalarFieldEnum[]
  }

  /**
   * DailySession findMany
   */
  export type DailySessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * Filter, which DailySessions to fetch.
     */
    where?: DailySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailySessions to fetch.
     */
    orderBy?: DailySessionOrderByWithRelationInput | DailySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailySessions.
     */
    cursor?: DailySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailySessions.
     */
    skip?: number
    distinct?: DailySessionScalarFieldEnum | DailySessionScalarFieldEnum[]
  }

  /**
   * DailySession create
   */
  export type DailySessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * The data needed to create a DailySession.
     */
    data: XOR<DailySessionCreateInput, DailySessionUncheckedCreateInput>
  }

  /**
   * DailySession createMany
   */
  export type DailySessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailySessions.
     */
    data: DailySessionCreateManyInput | DailySessionCreateManyInput[]
  }

  /**
   * DailySession createManyAndReturn
   */
  export type DailySessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * The data used to create many DailySessions.
     */
    data: DailySessionCreateManyInput | DailySessionCreateManyInput[]
  }

  /**
   * DailySession update
   */
  export type DailySessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * The data needed to update a DailySession.
     */
    data: XOR<DailySessionUpdateInput, DailySessionUncheckedUpdateInput>
    /**
     * Choose, which DailySession to update.
     */
    where: DailySessionWhereUniqueInput
  }

  /**
   * DailySession updateMany
   */
  export type DailySessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailySessions.
     */
    data: XOR<DailySessionUpdateManyMutationInput, DailySessionUncheckedUpdateManyInput>
    /**
     * Filter which DailySessions to update
     */
    where?: DailySessionWhereInput
    /**
     * Limit how many DailySessions to update.
     */
    limit?: number
  }

  /**
   * DailySession updateManyAndReturn
   */
  export type DailySessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * The data used to update DailySessions.
     */
    data: XOR<DailySessionUpdateManyMutationInput, DailySessionUncheckedUpdateManyInput>
    /**
     * Filter which DailySessions to update
     */
    where?: DailySessionWhereInput
    /**
     * Limit how many DailySessions to update.
     */
    limit?: number
  }

  /**
   * DailySession upsert
   */
  export type DailySessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * The filter to search for the DailySession to update in case it exists.
     */
    where: DailySessionWhereUniqueInput
    /**
     * In case the DailySession found by the `where` argument doesn't exist, create a new DailySession with this data.
     */
    create: XOR<DailySessionCreateInput, DailySessionUncheckedCreateInput>
    /**
     * In case the DailySession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailySessionUpdateInput, DailySessionUncheckedUpdateInput>
  }

  /**
   * DailySession delete
   */
  export type DailySessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    /**
     * Filter which DailySession to delete.
     */
    where: DailySessionWhereUniqueInput
  }

  /**
   * DailySession deleteMany
   */
  export type DailySessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailySessions to delete
     */
    where?: DailySessionWhereInput
    /**
     * Limit how many DailySessions to delete.
     */
    limit?: number
  }

  /**
   * DailySession.newsEvents
   */
  export type DailySession$newsEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    where?: NewsEventWhereInput
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    cursor?: NewsEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * DailySession.setups
   */
  export type DailySession$setupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    where?: TradeSetupWhereInput
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    cursor?: TradeSetupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * DailySession.screenshots
   */
  export type DailySession$screenshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    where?: ScreenshotWhereInput
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    cursor?: ScreenshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[]
  }

  /**
   * DailySession without action
   */
  export type DailySessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
  }


  /**
   * Model NewsEvent
   */

  export type AggregateNewsEvent = {
    _count: NewsEventCountAggregateOutputType | null
    _min: NewsEventMinAggregateOutputType | null
    _max: NewsEventMaxAggregateOutputType | null
  }

  export type NewsEventMinAggregateOutputType = {
    id: string | null
    sessionDate: Date | null
    symbol: string | null
    headline: string | null
    source: string | null
    eventType: $Enums.NewsType | null
    impact: $Enums.NewsImpact | null
    notes: string | null
    createdAt: Date | null
  }

  export type NewsEventMaxAggregateOutputType = {
    id: string | null
    sessionDate: Date | null
    symbol: string | null
    headline: string | null
    source: string | null
    eventType: $Enums.NewsType | null
    impact: $Enums.NewsImpact | null
    notes: string | null
    createdAt: Date | null
  }

  export type NewsEventCountAggregateOutputType = {
    id: number
    sessionDate: number
    symbol: number
    headline: number
    source: number
    eventType: number
    impact: number
    notes: number
    createdAt: number
    _all: number
  }


  export type NewsEventMinAggregateInputType = {
    id?: true
    sessionDate?: true
    symbol?: true
    headline?: true
    source?: true
    eventType?: true
    impact?: true
    notes?: true
    createdAt?: true
  }

  export type NewsEventMaxAggregateInputType = {
    id?: true
    sessionDate?: true
    symbol?: true
    headline?: true
    source?: true
    eventType?: true
    impact?: true
    notes?: true
    createdAt?: true
  }

  export type NewsEventCountAggregateInputType = {
    id?: true
    sessionDate?: true
    symbol?: true
    headline?: true
    source?: true
    eventType?: true
    impact?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type NewsEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsEvent to aggregate.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsEvents
    **/
    _count?: true | NewsEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsEventMaxAggregateInputType
  }

  export type GetNewsEventAggregateType<T extends NewsEventAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsEvent[P]>
      : GetScalarType<T[P], AggregateNewsEvent[P]>
  }




  export type NewsEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsEventWhereInput
    orderBy?: NewsEventOrderByWithAggregationInput | NewsEventOrderByWithAggregationInput[]
    by: NewsEventScalarFieldEnum[] | NewsEventScalarFieldEnum
    having?: NewsEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsEventCountAggregateInputType | true
    _min?: NewsEventMinAggregateInputType
    _max?: NewsEventMaxAggregateInputType
  }

  export type NewsEventGroupByOutputType = {
    id: string
    sessionDate: Date
    symbol: string | null
    headline: string
    source: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes: string | null
    createdAt: Date
    _count: NewsEventCountAggregateOutputType | null
    _min: NewsEventMinAggregateOutputType | null
    _max: NewsEventMaxAggregateOutputType | null
  }

  type GetNewsEventGroupByPayload<T extends NewsEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsEventGroupByOutputType[P]>
            : GetScalarType<T[P], NewsEventGroupByOutputType[P]>
        }
      >
    >


  export type NewsEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    headline?: boolean
    source?: boolean
    eventType?: boolean
    impact?: boolean
    notes?: boolean
    createdAt?: boolean
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    setups?: boolean | NewsEvent$setupsArgs<ExtArgs>
    _count?: boolean | NewsEventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsEvent"]>

  export type NewsEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    headline?: boolean
    source?: boolean
    eventType?: boolean
    impact?: boolean
    notes?: boolean
    createdAt?: boolean
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsEvent"]>

  export type NewsEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    headline?: boolean
    source?: boolean
    eventType?: boolean
    impact?: boolean
    notes?: boolean
    createdAt?: boolean
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsEvent"]>

  export type NewsEventSelectScalar = {
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    headline?: boolean
    source?: boolean
    eventType?: boolean
    impact?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type NewsEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionDate" | "symbol" | "headline" | "source" | "eventType" | "impact" | "notes" | "createdAt", ExtArgs["result"]["newsEvent"]>
  export type NewsEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    setups?: boolean | NewsEvent$setupsArgs<ExtArgs>
    _count?: boolean | NewsEventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NewsEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
  }
  export type NewsEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
  }

  export type $NewsEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsEvent"
    objects: {
      session: Prisma.$DailySessionPayload<ExtArgs>
      setups: Prisma.$TradeSetupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionDate: Date
      symbol: string | null
      headline: string
      source: string | null
      eventType: $Enums.NewsType
      impact: $Enums.NewsImpact
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["newsEvent"]>
    composites: {}
  }

  type NewsEventGetPayload<S extends boolean | null | undefined | NewsEventDefaultArgs> = $Result.GetResult<Prisma.$NewsEventPayload, S>

  type NewsEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsEventCountAggregateInputType | true
    }

  export interface NewsEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsEvent'], meta: { name: 'NewsEvent' } }
    /**
     * Find zero or one NewsEvent that matches the filter.
     * @param {NewsEventFindUniqueArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsEventFindUniqueArgs>(args: SelectSubset<T, NewsEventFindUniqueArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsEventFindUniqueOrThrowArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsEventFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventFindFirstArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsEventFindFirstArgs>(args?: SelectSubset<T, NewsEventFindFirstArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventFindFirstOrThrowArgs} args - Arguments to find a NewsEvent
     * @example
     * // Get one NewsEvent
     * const newsEvent = await prisma.newsEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsEventFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsEvents
     * const newsEvents = await prisma.newsEvent.findMany()
     * 
     * // Get first 10 NewsEvents
     * const newsEvents = await prisma.newsEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsEventWithIdOnly = await prisma.newsEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsEventFindManyArgs>(args?: SelectSubset<T, NewsEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsEvent.
     * @param {NewsEventCreateArgs} args - Arguments to create a NewsEvent.
     * @example
     * // Create one NewsEvent
     * const NewsEvent = await prisma.newsEvent.create({
     *   data: {
     *     // ... data to create a NewsEvent
     *   }
     * })
     * 
     */
    create<T extends NewsEventCreateArgs>(args: SelectSubset<T, NewsEventCreateArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsEvents.
     * @param {NewsEventCreateManyArgs} args - Arguments to create many NewsEvents.
     * @example
     * // Create many NewsEvents
     * const newsEvent = await prisma.newsEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsEventCreateManyArgs>(args?: SelectSubset<T, NewsEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsEvents and returns the data saved in the database.
     * @param {NewsEventCreateManyAndReturnArgs} args - Arguments to create many NewsEvents.
     * @example
     * // Create many NewsEvents
     * const newsEvent = await prisma.newsEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsEvents and only return the `id`
     * const newsEventWithIdOnly = await prisma.newsEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsEventCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsEvent.
     * @param {NewsEventDeleteArgs} args - Arguments to delete one NewsEvent.
     * @example
     * // Delete one NewsEvent
     * const NewsEvent = await prisma.newsEvent.delete({
     *   where: {
     *     // ... filter to delete one NewsEvent
     *   }
     * })
     * 
     */
    delete<T extends NewsEventDeleteArgs>(args: SelectSubset<T, NewsEventDeleteArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsEvent.
     * @param {NewsEventUpdateArgs} args - Arguments to update one NewsEvent.
     * @example
     * // Update one NewsEvent
     * const newsEvent = await prisma.newsEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsEventUpdateArgs>(args: SelectSubset<T, NewsEventUpdateArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsEvents.
     * @param {NewsEventDeleteManyArgs} args - Arguments to filter NewsEvents to delete.
     * @example
     * // Delete a few NewsEvents
     * const { count } = await prisma.newsEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsEventDeleteManyArgs>(args?: SelectSubset<T, NewsEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsEvents
     * const newsEvent = await prisma.newsEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsEventUpdateManyArgs>(args: SelectSubset<T, NewsEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsEvents and returns the data updated in the database.
     * @param {NewsEventUpdateManyAndReturnArgs} args - Arguments to update many NewsEvents.
     * @example
     * // Update many NewsEvents
     * const newsEvent = await prisma.newsEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsEvents and only return the `id`
     * const newsEventWithIdOnly = await prisma.newsEvent.updateManyAndReturn({
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
    updateManyAndReturn<T extends NewsEventUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsEvent.
     * @param {NewsEventUpsertArgs} args - Arguments to update or create a NewsEvent.
     * @example
     * // Update or create a NewsEvent
     * const newsEvent = await prisma.newsEvent.upsert({
     *   create: {
     *     // ... data to create a NewsEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsEvent we want to update
     *   }
     * })
     */
    upsert<T extends NewsEventUpsertArgs>(args: SelectSubset<T, NewsEventUpsertArgs<ExtArgs>>): Prisma__NewsEventClient<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventCountArgs} args - Arguments to filter NewsEvents to count.
     * @example
     * // Count the number of NewsEvents
     * const count = await prisma.newsEvent.count({
     *   where: {
     *     // ... the filter for the NewsEvents we want to count
     *   }
     * })
    **/
    count<T extends NewsEventCountArgs>(
      args?: Subset<T, NewsEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NewsEventAggregateArgs>(args: Subset<T, NewsEventAggregateArgs>): Prisma.PrismaPromise<GetNewsEventAggregateType<T>>

    /**
     * Group by NewsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsEventGroupByArgs} args - Group by arguments.
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
      T extends NewsEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsEventGroupByArgs['orderBy'] }
        : { orderBy?: NewsEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsEvent model
   */
  readonly fields: NewsEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends DailySessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailySessionDefaultArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    setups<T extends NewsEvent$setupsArgs<ExtArgs> = {}>(args?: Subset<T, NewsEvent$setupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsEvent model
   */
  interface NewsEventFieldRefs {
    readonly id: FieldRef<"NewsEvent", 'String'>
    readonly sessionDate: FieldRef<"NewsEvent", 'DateTime'>
    readonly symbol: FieldRef<"NewsEvent", 'String'>
    readonly headline: FieldRef<"NewsEvent", 'String'>
    readonly source: FieldRef<"NewsEvent", 'String'>
    readonly eventType: FieldRef<"NewsEvent", 'NewsType'>
    readonly impact: FieldRef<"NewsEvent", 'NewsImpact'>
    readonly notes: FieldRef<"NewsEvent", 'String'>
    readonly createdAt: FieldRef<"NewsEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsEvent findUnique
   */
  export type NewsEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent findUniqueOrThrow
   */
  export type NewsEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent findFirst
   */
  export type NewsEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsEvents.
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsEvents.
     */
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * NewsEvent findFirstOrThrow
   */
  export type NewsEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * Filter, which NewsEvent to fetch.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsEvents.
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsEvents.
     */
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * NewsEvent findMany
   */
  export type NewsEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * Filter, which NewsEvents to fetch.
     */
    where?: NewsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsEvents to fetch.
     */
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsEvents.
     */
    cursor?: NewsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsEvents.
     */
    skip?: number
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * NewsEvent create
   */
  export type NewsEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsEvent.
     */
    data: XOR<NewsEventCreateInput, NewsEventUncheckedCreateInput>
  }

  /**
   * NewsEvent createMany
   */
  export type NewsEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsEvents.
     */
    data: NewsEventCreateManyInput | NewsEventCreateManyInput[]
  }

  /**
   * NewsEvent createManyAndReturn
   */
  export type NewsEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * The data used to create many NewsEvents.
     */
    data: NewsEventCreateManyInput | NewsEventCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsEvent update
   */
  export type NewsEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsEvent.
     */
    data: XOR<NewsEventUpdateInput, NewsEventUncheckedUpdateInput>
    /**
     * Choose, which NewsEvent to update.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent updateMany
   */
  export type NewsEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsEvents.
     */
    data: XOR<NewsEventUpdateManyMutationInput, NewsEventUncheckedUpdateManyInput>
    /**
     * Filter which NewsEvents to update
     */
    where?: NewsEventWhereInput
    /**
     * Limit how many NewsEvents to update.
     */
    limit?: number
  }

  /**
   * NewsEvent updateManyAndReturn
   */
  export type NewsEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * The data used to update NewsEvents.
     */
    data: XOR<NewsEventUpdateManyMutationInput, NewsEventUncheckedUpdateManyInput>
    /**
     * Filter which NewsEvents to update
     */
    where?: NewsEventWhereInput
    /**
     * Limit how many NewsEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsEvent upsert
   */
  export type NewsEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsEvent to update in case it exists.
     */
    where: NewsEventWhereUniqueInput
    /**
     * In case the NewsEvent found by the `where` argument doesn't exist, create a new NewsEvent with this data.
     */
    create: XOR<NewsEventCreateInput, NewsEventUncheckedCreateInput>
    /**
     * In case the NewsEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsEventUpdateInput, NewsEventUncheckedUpdateInput>
  }

  /**
   * NewsEvent delete
   */
  export type NewsEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    /**
     * Filter which NewsEvent to delete.
     */
    where: NewsEventWhereUniqueInput
  }

  /**
   * NewsEvent deleteMany
   */
  export type NewsEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsEvents to delete
     */
    where?: NewsEventWhereInput
    /**
     * Limit how many NewsEvents to delete.
     */
    limit?: number
  }

  /**
   * NewsEvent.setups
   */
  export type NewsEvent$setupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    where?: TradeSetupWhereInput
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    cursor?: TradeSetupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * NewsEvent without action
   */
  export type NewsEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
  }


  /**
   * Model TradeSetup
   */

  export type AggregateTradeSetup = {
    _count: TradeSetupCountAggregateOutputType | null
    _avg: TradeSetupAvgAggregateOutputType | null
    _sum: TradeSetupSumAggregateOutputType | null
    _min: TradeSetupMinAggregateOutputType | null
    _max: TradeSetupMaxAggregateOutputType | null
  }

  export type TradeSetupAvgAggregateOutputType = {
    entryPriceExact: number | null
    stopPriceExact: number | null
    target1PriceExact: number | null
    target2PriceExact: number | null
    plannedRiskReward: number | null
    plannedSize: number | null
    missedHypoPnL: number | null
  }

  export type TradeSetupSumAggregateOutputType = {
    entryPriceExact: number | null
    stopPriceExact: number | null
    target1PriceExact: number | null
    target2PriceExact: number | null
    plannedRiskReward: number | null
    plannedSize: number | null
    missedHypoPnL: number | null
  }

  export type TradeSetupMinAggregateOutputType = {
    id: string | null
    sessionDate: Date | null
    symbol: string | null
    direction: $Enums.Direction | null
    priceTier: $Enums.PriceTier | null
    marketCapTier: $Enums.MarketCapTier | null
    strategy: string | null
    strategyId: string | null
    setupLogic: string | null
    newsType: $Enums.NewsType | null
    newsImpact: $Enums.NewsImpact | null
    newsHeadline: string | null
    newsCatalogId: string | null
    entryCondition: string | null
    entryPriceNote: string | null
    entryPriceExact: number | null
    stopCondition: string | null
    stopPriceNote: string | null
    stopPriceExact: number | null
    target1Condition: string | null
    target1PriceNote: string | null
    target1PriceExact: number | null
    target2Condition: string | null
    target2PriceNote: string | null
    target2PriceExact: number | null
    plannedRiskReward: number | null
    plannedSize: number | null
    status: $Enums.SetupStatus | null
    missedReason: $Enums.MissedReason | null
    missedNotes: string | null
    missedHypoPnL: number | null
    stockSelectionAccurate: boolean | null
    stockSelectionNote: string | null
    analysisAccurate: boolean | null
    analysisAccurateNote: string | null
    marketJudgmentAccurate: boolean | null
    marketJudgmentNote: string | null
    strategySelectionAccurate: boolean | null
    strategySelectionNote: string | null
    entryOpportunityAccurate: boolean | null
    entryOpportunityNote: string | null
    exitOpportunityAccurate: boolean | null
    exitOpportunityNote: string | null
    actualEntryOpportunity: string | null
    actualExitOpportunity: string | null
    dailySummary: string | null
    selectedTradeTypes: string | null
    setupGrade: $Enums.Grade | null
    setupNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradeSetupMaxAggregateOutputType = {
    id: string | null
    sessionDate: Date | null
    symbol: string | null
    direction: $Enums.Direction | null
    priceTier: $Enums.PriceTier | null
    marketCapTier: $Enums.MarketCapTier | null
    strategy: string | null
    strategyId: string | null
    setupLogic: string | null
    newsType: $Enums.NewsType | null
    newsImpact: $Enums.NewsImpact | null
    newsHeadline: string | null
    newsCatalogId: string | null
    entryCondition: string | null
    entryPriceNote: string | null
    entryPriceExact: number | null
    stopCondition: string | null
    stopPriceNote: string | null
    stopPriceExact: number | null
    target1Condition: string | null
    target1PriceNote: string | null
    target1PriceExact: number | null
    target2Condition: string | null
    target2PriceNote: string | null
    target2PriceExact: number | null
    plannedRiskReward: number | null
    plannedSize: number | null
    status: $Enums.SetupStatus | null
    missedReason: $Enums.MissedReason | null
    missedNotes: string | null
    missedHypoPnL: number | null
    stockSelectionAccurate: boolean | null
    stockSelectionNote: string | null
    analysisAccurate: boolean | null
    analysisAccurateNote: string | null
    marketJudgmentAccurate: boolean | null
    marketJudgmentNote: string | null
    strategySelectionAccurate: boolean | null
    strategySelectionNote: string | null
    entryOpportunityAccurate: boolean | null
    entryOpportunityNote: string | null
    exitOpportunityAccurate: boolean | null
    exitOpportunityNote: string | null
    actualEntryOpportunity: string | null
    actualExitOpportunity: string | null
    dailySummary: string | null
    selectedTradeTypes: string | null
    setupGrade: $Enums.Grade | null
    setupNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradeSetupCountAggregateOutputType = {
    id: number
    sessionDate: number
    symbol: number
    direction: number
    priceTier: number
    marketCapTier: number
    strategy: number
    strategyId: number
    setupLogic: number
    newsType: number
    newsImpact: number
    newsHeadline: number
    newsCatalogId: number
    entryCondition: number
    entryPriceNote: number
    entryPriceExact: number
    stopCondition: number
    stopPriceNote: number
    stopPriceExact: number
    target1Condition: number
    target1PriceNote: number
    target1PriceExact: number
    target2Condition: number
    target2PriceNote: number
    target2PriceExact: number
    plannedRiskReward: number
    plannedSize: number
    status: number
    missedReason: number
    missedNotes: number
    missedHypoPnL: number
    stockSelectionAccurate: number
    stockSelectionNote: number
    analysisAccurate: number
    analysisAccurateNote: number
    marketJudgmentAccurate: number
    marketJudgmentNote: number
    strategySelectionAccurate: number
    strategySelectionNote: number
    entryOpportunityAccurate: number
    entryOpportunityNote: number
    exitOpportunityAccurate: number
    exitOpportunityNote: number
    actualEntryOpportunity: number
    actualExitOpportunity: number
    dailySummary: number
    selectedTradeTypes: number
    setupGrade: number
    setupNotes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradeSetupAvgAggregateInputType = {
    entryPriceExact?: true
    stopPriceExact?: true
    target1PriceExact?: true
    target2PriceExact?: true
    plannedRiskReward?: true
    plannedSize?: true
    missedHypoPnL?: true
  }

  export type TradeSetupSumAggregateInputType = {
    entryPriceExact?: true
    stopPriceExact?: true
    target1PriceExact?: true
    target2PriceExact?: true
    plannedRiskReward?: true
    plannedSize?: true
    missedHypoPnL?: true
  }

  export type TradeSetupMinAggregateInputType = {
    id?: true
    sessionDate?: true
    symbol?: true
    direction?: true
    priceTier?: true
    marketCapTier?: true
    strategy?: true
    strategyId?: true
    setupLogic?: true
    newsType?: true
    newsImpact?: true
    newsHeadline?: true
    newsCatalogId?: true
    entryCondition?: true
    entryPriceNote?: true
    entryPriceExact?: true
    stopCondition?: true
    stopPriceNote?: true
    stopPriceExact?: true
    target1Condition?: true
    target1PriceNote?: true
    target1PriceExact?: true
    target2Condition?: true
    target2PriceNote?: true
    target2PriceExact?: true
    plannedRiskReward?: true
    plannedSize?: true
    status?: true
    missedReason?: true
    missedNotes?: true
    missedHypoPnL?: true
    stockSelectionAccurate?: true
    stockSelectionNote?: true
    analysisAccurate?: true
    analysisAccurateNote?: true
    marketJudgmentAccurate?: true
    marketJudgmentNote?: true
    strategySelectionAccurate?: true
    strategySelectionNote?: true
    entryOpportunityAccurate?: true
    entryOpportunityNote?: true
    exitOpportunityAccurate?: true
    exitOpportunityNote?: true
    actualEntryOpportunity?: true
    actualExitOpportunity?: true
    dailySummary?: true
    selectedTradeTypes?: true
    setupGrade?: true
    setupNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradeSetupMaxAggregateInputType = {
    id?: true
    sessionDate?: true
    symbol?: true
    direction?: true
    priceTier?: true
    marketCapTier?: true
    strategy?: true
    strategyId?: true
    setupLogic?: true
    newsType?: true
    newsImpact?: true
    newsHeadline?: true
    newsCatalogId?: true
    entryCondition?: true
    entryPriceNote?: true
    entryPriceExact?: true
    stopCondition?: true
    stopPriceNote?: true
    stopPriceExact?: true
    target1Condition?: true
    target1PriceNote?: true
    target1PriceExact?: true
    target2Condition?: true
    target2PriceNote?: true
    target2PriceExact?: true
    plannedRiskReward?: true
    plannedSize?: true
    status?: true
    missedReason?: true
    missedNotes?: true
    missedHypoPnL?: true
    stockSelectionAccurate?: true
    stockSelectionNote?: true
    analysisAccurate?: true
    analysisAccurateNote?: true
    marketJudgmentAccurate?: true
    marketJudgmentNote?: true
    strategySelectionAccurate?: true
    strategySelectionNote?: true
    entryOpportunityAccurate?: true
    entryOpportunityNote?: true
    exitOpportunityAccurate?: true
    exitOpportunityNote?: true
    actualEntryOpportunity?: true
    actualExitOpportunity?: true
    dailySummary?: true
    selectedTradeTypes?: true
    setupGrade?: true
    setupNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradeSetupCountAggregateInputType = {
    id?: true
    sessionDate?: true
    symbol?: true
    direction?: true
    priceTier?: true
    marketCapTier?: true
    strategy?: true
    strategyId?: true
    setupLogic?: true
    newsType?: true
    newsImpact?: true
    newsHeadline?: true
    newsCatalogId?: true
    entryCondition?: true
    entryPriceNote?: true
    entryPriceExact?: true
    stopCondition?: true
    stopPriceNote?: true
    stopPriceExact?: true
    target1Condition?: true
    target1PriceNote?: true
    target1PriceExact?: true
    target2Condition?: true
    target2PriceNote?: true
    target2PriceExact?: true
    plannedRiskReward?: true
    plannedSize?: true
    status?: true
    missedReason?: true
    missedNotes?: true
    missedHypoPnL?: true
    stockSelectionAccurate?: true
    stockSelectionNote?: true
    analysisAccurate?: true
    analysisAccurateNote?: true
    marketJudgmentAccurate?: true
    marketJudgmentNote?: true
    strategySelectionAccurate?: true
    strategySelectionNote?: true
    entryOpportunityAccurate?: true
    entryOpportunityNote?: true
    exitOpportunityAccurate?: true
    exitOpportunityNote?: true
    actualEntryOpportunity?: true
    actualExitOpportunity?: true
    dailySummary?: true
    selectedTradeTypes?: true
    setupGrade?: true
    setupNotes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradeSetupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeSetup to aggregate.
     */
    where?: TradeSetupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeSetups to fetch.
     */
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeSetupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeSetups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeSetups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradeSetups
    **/
    _count?: true | TradeSetupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradeSetupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradeSetupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeSetupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeSetupMaxAggregateInputType
  }

  export type GetTradeSetupAggregateType<T extends TradeSetupAggregateArgs> = {
        [P in keyof T & keyof AggregateTradeSetup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradeSetup[P]>
      : GetScalarType<T[P], AggregateTradeSetup[P]>
  }




  export type TradeSetupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeSetupWhereInput
    orderBy?: TradeSetupOrderByWithAggregationInput | TradeSetupOrderByWithAggregationInput[]
    by: TradeSetupScalarFieldEnum[] | TradeSetupScalarFieldEnum
    having?: TradeSetupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeSetupCountAggregateInputType | true
    _avg?: TradeSetupAvgAggregateInputType
    _sum?: TradeSetupSumAggregateInputType
    _min?: TradeSetupMinAggregateInputType
    _max?: TradeSetupMaxAggregateInputType
  }

  export type TradeSetupGroupByOutputType = {
    id: string
    sessionDate: Date
    symbol: string
    direction: $Enums.Direction
    priceTier: $Enums.PriceTier | null
    marketCapTier: $Enums.MarketCapTier | null
    strategy: string | null
    strategyId: string | null
    setupLogic: string | null
    newsType: $Enums.NewsType | null
    newsImpact: $Enums.NewsImpact | null
    newsHeadline: string | null
    newsCatalogId: string | null
    entryCondition: string | null
    entryPriceNote: string | null
    entryPriceExact: number | null
    stopCondition: string | null
    stopPriceNote: string | null
    stopPriceExact: number | null
    target1Condition: string | null
    target1PriceNote: string | null
    target1PriceExact: number | null
    target2Condition: string | null
    target2PriceNote: string | null
    target2PriceExact: number | null
    plannedRiskReward: number | null
    plannedSize: number | null
    status: $Enums.SetupStatus
    missedReason: $Enums.MissedReason | null
    missedNotes: string | null
    missedHypoPnL: number | null
    stockSelectionAccurate: boolean | null
    stockSelectionNote: string | null
    analysisAccurate: boolean | null
    analysisAccurateNote: string | null
    marketJudgmentAccurate: boolean | null
    marketJudgmentNote: string | null
    strategySelectionAccurate: boolean | null
    strategySelectionNote: string | null
    entryOpportunityAccurate: boolean | null
    entryOpportunityNote: string | null
    exitOpportunityAccurate: boolean | null
    exitOpportunityNote: string | null
    actualEntryOpportunity: string | null
    actualExitOpportunity: string | null
    dailySummary: string | null
    selectedTradeTypes: string
    setupGrade: $Enums.Grade | null
    setupNotes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TradeSetupCountAggregateOutputType | null
    _avg: TradeSetupAvgAggregateOutputType | null
    _sum: TradeSetupSumAggregateOutputType | null
    _min: TradeSetupMinAggregateOutputType | null
    _max: TradeSetupMaxAggregateOutputType | null
  }

  type GetTradeSetupGroupByPayload<T extends TradeSetupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeSetupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeSetupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeSetupGroupByOutputType[P]>
            : GetScalarType<T[P], TradeSetupGroupByOutputType[P]>
        }
      >
    >


  export type TradeSetupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    direction?: boolean
    priceTier?: boolean
    marketCapTier?: boolean
    strategy?: boolean
    strategyId?: boolean
    setupLogic?: boolean
    newsType?: boolean
    newsImpact?: boolean
    newsHeadline?: boolean
    newsCatalogId?: boolean
    entryCondition?: boolean
    entryPriceNote?: boolean
    entryPriceExact?: boolean
    stopCondition?: boolean
    stopPriceNote?: boolean
    stopPriceExact?: boolean
    target1Condition?: boolean
    target1PriceNote?: boolean
    target1PriceExact?: boolean
    target2Condition?: boolean
    target2PriceNote?: boolean
    target2PriceExact?: boolean
    plannedRiskReward?: boolean
    plannedSize?: boolean
    status?: boolean
    missedReason?: boolean
    missedNotes?: boolean
    missedHypoPnL?: boolean
    stockSelectionAccurate?: boolean
    stockSelectionNote?: boolean
    analysisAccurate?: boolean
    analysisAccurateNote?: boolean
    marketJudgmentAccurate?: boolean
    marketJudgmentNote?: boolean
    strategySelectionAccurate?: boolean
    strategySelectionNote?: boolean
    entryOpportunityAccurate?: boolean
    entryOpportunityNote?: boolean
    exitOpportunityAccurate?: boolean
    exitOpportunityNote?: boolean
    actualEntryOpportunity?: boolean
    actualExitOpportunity?: boolean
    dailySummary?: boolean
    selectedTradeTypes?: boolean
    setupGrade?: boolean
    setupNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    strategyRef?: boolean | TradeSetup$strategyRefArgs<ExtArgs>
    newsEvents?: boolean | TradeSetup$newsEventsArgs<ExtArgs>
    newsCatalogRef?: boolean | TradeSetup$newsCatalogRefArgs<ExtArgs>
    executions?: boolean | TradeSetup$executionsArgs<ExtArgs>
    screenshots?: boolean | TradeSetup$screenshotsArgs<ExtArgs>
    _count?: boolean | TradeSetupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeSetup"]>

  export type TradeSetupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    direction?: boolean
    priceTier?: boolean
    marketCapTier?: boolean
    strategy?: boolean
    strategyId?: boolean
    setupLogic?: boolean
    newsType?: boolean
    newsImpact?: boolean
    newsHeadline?: boolean
    newsCatalogId?: boolean
    entryCondition?: boolean
    entryPriceNote?: boolean
    entryPriceExact?: boolean
    stopCondition?: boolean
    stopPriceNote?: boolean
    stopPriceExact?: boolean
    target1Condition?: boolean
    target1PriceNote?: boolean
    target1PriceExact?: boolean
    target2Condition?: boolean
    target2PriceNote?: boolean
    target2PriceExact?: boolean
    plannedRiskReward?: boolean
    plannedSize?: boolean
    status?: boolean
    missedReason?: boolean
    missedNotes?: boolean
    missedHypoPnL?: boolean
    stockSelectionAccurate?: boolean
    stockSelectionNote?: boolean
    analysisAccurate?: boolean
    analysisAccurateNote?: boolean
    marketJudgmentAccurate?: boolean
    marketJudgmentNote?: boolean
    strategySelectionAccurate?: boolean
    strategySelectionNote?: boolean
    entryOpportunityAccurate?: boolean
    entryOpportunityNote?: boolean
    exitOpportunityAccurate?: boolean
    exitOpportunityNote?: boolean
    actualEntryOpportunity?: boolean
    actualExitOpportunity?: boolean
    dailySummary?: boolean
    selectedTradeTypes?: boolean
    setupGrade?: boolean
    setupNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    strategyRef?: boolean | TradeSetup$strategyRefArgs<ExtArgs>
    newsCatalogRef?: boolean | TradeSetup$newsCatalogRefArgs<ExtArgs>
  }, ExtArgs["result"]["tradeSetup"]>

  export type TradeSetupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    direction?: boolean
    priceTier?: boolean
    marketCapTier?: boolean
    strategy?: boolean
    strategyId?: boolean
    setupLogic?: boolean
    newsType?: boolean
    newsImpact?: boolean
    newsHeadline?: boolean
    newsCatalogId?: boolean
    entryCondition?: boolean
    entryPriceNote?: boolean
    entryPriceExact?: boolean
    stopCondition?: boolean
    stopPriceNote?: boolean
    stopPriceExact?: boolean
    target1Condition?: boolean
    target1PriceNote?: boolean
    target1PriceExact?: boolean
    target2Condition?: boolean
    target2PriceNote?: boolean
    target2PriceExact?: boolean
    plannedRiskReward?: boolean
    plannedSize?: boolean
    status?: boolean
    missedReason?: boolean
    missedNotes?: boolean
    missedHypoPnL?: boolean
    stockSelectionAccurate?: boolean
    stockSelectionNote?: boolean
    analysisAccurate?: boolean
    analysisAccurateNote?: boolean
    marketJudgmentAccurate?: boolean
    marketJudgmentNote?: boolean
    strategySelectionAccurate?: boolean
    strategySelectionNote?: boolean
    entryOpportunityAccurate?: boolean
    entryOpportunityNote?: boolean
    exitOpportunityAccurate?: boolean
    exitOpportunityNote?: boolean
    actualEntryOpportunity?: boolean
    actualExitOpportunity?: boolean
    dailySummary?: boolean
    selectedTradeTypes?: boolean
    setupGrade?: boolean
    setupNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    strategyRef?: boolean | TradeSetup$strategyRefArgs<ExtArgs>
    newsCatalogRef?: boolean | TradeSetup$newsCatalogRefArgs<ExtArgs>
  }, ExtArgs["result"]["tradeSetup"]>

  export type TradeSetupSelectScalar = {
    id?: boolean
    sessionDate?: boolean
    symbol?: boolean
    direction?: boolean
    priceTier?: boolean
    marketCapTier?: boolean
    strategy?: boolean
    strategyId?: boolean
    setupLogic?: boolean
    newsType?: boolean
    newsImpact?: boolean
    newsHeadline?: boolean
    newsCatalogId?: boolean
    entryCondition?: boolean
    entryPriceNote?: boolean
    entryPriceExact?: boolean
    stopCondition?: boolean
    stopPriceNote?: boolean
    stopPriceExact?: boolean
    target1Condition?: boolean
    target1PriceNote?: boolean
    target1PriceExact?: boolean
    target2Condition?: boolean
    target2PriceNote?: boolean
    target2PriceExact?: boolean
    plannedRiskReward?: boolean
    plannedSize?: boolean
    status?: boolean
    missedReason?: boolean
    missedNotes?: boolean
    missedHypoPnL?: boolean
    stockSelectionAccurate?: boolean
    stockSelectionNote?: boolean
    analysisAccurate?: boolean
    analysisAccurateNote?: boolean
    marketJudgmentAccurate?: boolean
    marketJudgmentNote?: boolean
    strategySelectionAccurate?: boolean
    strategySelectionNote?: boolean
    entryOpportunityAccurate?: boolean
    entryOpportunityNote?: boolean
    exitOpportunityAccurate?: boolean
    exitOpportunityNote?: boolean
    actualEntryOpportunity?: boolean
    actualExitOpportunity?: boolean
    dailySummary?: boolean
    selectedTradeTypes?: boolean
    setupGrade?: boolean
    setupNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradeSetupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionDate" | "symbol" | "direction" | "priceTier" | "marketCapTier" | "strategy" | "strategyId" | "setupLogic" | "newsType" | "newsImpact" | "newsHeadline" | "newsCatalogId" | "entryCondition" | "entryPriceNote" | "entryPriceExact" | "stopCondition" | "stopPriceNote" | "stopPriceExact" | "target1Condition" | "target1PriceNote" | "target1PriceExact" | "target2Condition" | "target2PriceNote" | "target2PriceExact" | "plannedRiskReward" | "plannedSize" | "status" | "missedReason" | "missedNotes" | "missedHypoPnL" | "stockSelectionAccurate" | "stockSelectionNote" | "analysisAccurate" | "analysisAccurateNote" | "marketJudgmentAccurate" | "marketJudgmentNote" | "strategySelectionAccurate" | "strategySelectionNote" | "entryOpportunityAccurate" | "entryOpportunityNote" | "exitOpportunityAccurate" | "exitOpportunityNote" | "actualEntryOpportunity" | "actualExitOpportunity" | "dailySummary" | "selectedTradeTypes" | "setupGrade" | "setupNotes" | "createdAt" | "updatedAt", ExtArgs["result"]["tradeSetup"]>
  export type TradeSetupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    strategyRef?: boolean | TradeSetup$strategyRefArgs<ExtArgs>
    newsEvents?: boolean | TradeSetup$newsEventsArgs<ExtArgs>
    newsCatalogRef?: boolean | TradeSetup$newsCatalogRefArgs<ExtArgs>
    executions?: boolean | TradeSetup$executionsArgs<ExtArgs>
    screenshots?: boolean | TradeSetup$screenshotsArgs<ExtArgs>
    _count?: boolean | TradeSetupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradeSetupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    strategyRef?: boolean | TradeSetup$strategyRefArgs<ExtArgs>
    newsCatalogRef?: boolean | TradeSetup$newsCatalogRefArgs<ExtArgs>
  }
  export type TradeSetupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | DailySessionDefaultArgs<ExtArgs>
    strategyRef?: boolean | TradeSetup$strategyRefArgs<ExtArgs>
    newsCatalogRef?: boolean | TradeSetup$newsCatalogRefArgs<ExtArgs>
  }

  export type $TradeSetupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradeSetup"
    objects: {
      session: Prisma.$DailySessionPayload<ExtArgs>
      strategyRef: Prisma.$StrategyPayload<ExtArgs> | null
      newsEvents: Prisma.$NewsEventPayload<ExtArgs>[]
      newsCatalogRef: Prisma.$NewsCatalogPayload<ExtArgs> | null
      executions: Prisma.$ExecutionPayload<ExtArgs>[]
      screenshots: Prisma.$ScreenshotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionDate: Date
      symbol: string
      direction: $Enums.Direction
      priceTier: $Enums.PriceTier | null
      marketCapTier: $Enums.MarketCapTier | null
      strategy: string | null
      strategyId: string | null
      setupLogic: string | null
      newsType: $Enums.NewsType | null
      newsImpact: $Enums.NewsImpact | null
      newsHeadline: string | null
      newsCatalogId: string | null
      entryCondition: string | null
      entryPriceNote: string | null
      entryPriceExact: number | null
      stopCondition: string | null
      stopPriceNote: string | null
      stopPriceExact: number | null
      target1Condition: string | null
      target1PriceNote: string | null
      target1PriceExact: number | null
      target2Condition: string | null
      target2PriceNote: string | null
      target2PriceExact: number | null
      plannedRiskReward: number | null
      plannedSize: number | null
      status: $Enums.SetupStatus
      missedReason: $Enums.MissedReason | null
      missedNotes: string | null
      missedHypoPnL: number | null
      stockSelectionAccurate: boolean | null
      stockSelectionNote: string | null
      analysisAccurate: boolean | null
      analysisAccurateNote: string | null
      marketJudgmentAccurate: boolean | null
      marketJudgmentNote: string | null
      strategySelectionAccurate: boolean | null
      strategySelectionNote: string | null
      entryOpportunityAccurate: boolean | null
      entryOpportunityNote: string | null
      exitOpportunityAccurate: boolean | null
      exitOpportunityNote: string | null
      actualEntryOpportunity: string | null
      actualExitOpportunity: string | null
      dailySummary: string | null
      selectedTradeTypes: string
      setupGrade: $Enums.Grade | null
      setupNotes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradeSetup"]>
    composites: {}
  }

  type TradeSetupGetPayload<S extends boolean | null | undefined | TradeSetupDefaultArgs> = $Result.GetResult<Prisma.$TradeSetupPayload, S>

  type TradeSetupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeSetupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeSetupCountAggregateInputType | true
    }

  export interface TradeSetupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradeSetup'], meta: { name: 'TradeSetup' } }
    /**
     * Find zero or one TradeSetup that matches the filter.
     * @param {TradeSetupFindUniqueArgs} args - Arguments to find a TradeSetup
     * @example
     * // Get one TradeSetup
     * const tradeSetup = await prisma.tradeSetup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeSetupFindUniqueArgs>(args: SelectSubset<T, TradeSetupFindUniqueArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradeSetup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeSetupFindUniqueOrThrowArgs} args - Arguments to find a TradeSetup
     * @example
     * // Get one TradeSetup
     * const tradeSetup = await prisma.tradeSetup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeSetupFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeSetupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeSetup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupFindFirstArgs} args - Arguments to find a TradeSetup
     * @example
     * // Get one TradeSetup
     * const tradeSetup = await prisma.tradeSetup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeSetupFindFirstArgs>(args?: SelectSubset<T, TradeSetupFindFirstArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeSetup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupFindFirstOrThrowArgs} args - Arguments to find a TradeSetup
     * @example
     * // Get one TradeSetup
     * const tradeSetup = await prisma.tradeSetup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeSetupFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeSetupFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradeSetups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradeSetups
     * const tradeSetups = await prisma.tradeSetup.findMany()
     * 
     * // Get first 10 TradeSetups
     * const tradeSetups = await prisma.tradeSetup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeSetupWithIdOnly = await prisma.tradeSetup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeSetupFindManyArgs>(args?: SelectSubset<T, TradeSetupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradeSetup.
     * @param {TradeSetupCreateArgs} args - Arguments to create a TradeSetup.
     * @example
     * // Create one TradeSetup
     * const TradeSetup = await prisma.tradeSetup.create({
     *   data: {
     *     // ... data to create a TradeSetup
     *   }
     * })
     * 
     */
    create<T extends TradeSetupCreateArgs>(args: SelectSubset<T, TradeSetupCreateArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradeSetups.
     * @param {TradeSetupCreateManyArgs} args - Arguments to create many TradeSetups.
     * @example
     * // Create many TradeSetups
     * const tradeSetup = await prisma.tradeSetup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeSetupCreateManyArgs>(args?: SelectSubset<T, TradeSetupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradeSetups and returns the data saved in the database.
     * @param {TradeSetupCreateManyAndReturnArgs} args - Arguments to create many TradeSetups.
     * @example
     * // Create many TradeSetups
     * const tradeSetup = await prisma.tradeSetup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradeSetups and only return the `id`
     * const tradeSetupWithIdOnly = await prisma.tradeSetup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeSetupCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeSetupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradeSetup.
     * @param {TradeSetupDeleteArgs} args - Arguments to delete one TradeSetup.
     * @example
     * // Delete one TradeSetup
     * const TradeSetup = await prisma.tradeSetup.delete({
     *   where: {
     *     // ... filter to delete one TradeSetup
     *   }
     * })
     * 
     */
    delete<T extends TradeSetupDeleteArgs>(args: SelectSubset<T, TradeSetupDeleteArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradeSetup.
     * @param {TradeSetupUpdateArgs} args - Arguments to update one TradeSetup.
     * @example
     * // Update one TradeSetup
     * const tradeSetup = await prisma.tradeSetup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeSetupUpdateArgs>(args: SelectSubset<T, TradeSetupUpdateArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradeSetups.
     * @param {TradeSetupDeleteManyArgs} args - Arguments to filter TradeSetups to delete.
     * @example
     * // Delete a few TradeSetups
     * const { count } = await prisma.tradeSetup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeSetupDeleteManyArgs>(args?: SelectSubset<T, TradeSetupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeSetups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradeSetups
     * const tradeSetup = await prisma.tradeSetup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeSetupUpdateManyArgs>(args: SelectSubset<T, TradeSetupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeSetups and returns the data updated in the database.
     * @param {TradeSetupUpdateManyAndReturnArgs} args - Arguments to update many TradeSetups.
     * @example
     * // Update many TradeSetups
     * const tradeSetup = await prisma.tradeSetup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradeSetups and only return the `id`
     * const tradeSetupWithIdOnly = await prisma.tradeSetup.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradeSetupUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeSetupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradeSetup.
     * @param {TradeSetupUpsertArgs} args - Arguments to update or create a TradeSetup.
     * @example
     * // Update or create a TradeSetup
     * const tradeSetup = await prisma.tradeSetup.upsert({
     *   create: {
     *     // ... data to create a TradeSetup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradeSetup we want to update
     *   }
     * })
     */
    upsert<T extends TradeSetupUpsertArgs>(args: SelectSubset<T, TradeSetupUpsertArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradeSetups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupCountArgs} args - Arguments to filter TradeSetups to count.
     * @example
     * // Count the number of TradeSetups
     * const count = await prisma.tradeSetup.count({
     *   where: {
     *     // ... the filter for the TradeSetups we want to count
     *   }
     * })
    **/
    count<T extends TradeSetupCountArgs>(
      args?: Subset<T, TradeSetupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeSetupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradeSetup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradeSetupAggregateArgs>(args: Subset<T, TradeSetupAggregateArgs>): Prisma.PrismaPromise<GetTradeSetupAggregateType<T>>

    /**
     * Group by TradeSetup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeSetupGroupByArgs} args - Group by arguments.
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
      T extends TradeSetupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeSetupGroupByArgs['orderBy'] }
        : { orderBy?: TradeSetupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeSetupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeSetupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradeSetup model
   */
  readonly fields: TradeSetupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradeSetup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeSetupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends DailySessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailySessionDefaultArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    strategyRef<T extends TradeSetup$strategyRefArgs<ExtArgs> = {}>(args?: Subset<T, TradeSetup$strategyRefArgs<ExtArgs>>): Prisma__StrategyClient<$Result.GetResult<Prisma.$StrategyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    newsEvents<T extends TradeSetup$newsEventsArgs<ExtArgs> = {}>(args?: Subset<T, TradeSetup$newsEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    newsCatalogRef<T extends TradeSetup$newsCatalogRefArgs<ExtArgs> = {}>(args?: Subset<T, TradeSetup$newsCatalogRefArgs<ExtArgs>>): Prisma__NewsCatalogClient<$Result.GetResult<Prisma.$NewsCatalogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    executions<T extends TradeSetup$executionsArgs<ExtArgs> = {}>(args?: Subset<T, TradeSetup$executionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    screenshots<T extends TradeSetup$screenshotsArgs<ExtArgs> = {}>(args?: Subset<T, TradeSetup$screenshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradeSetup model
   */
  interface TradeSetupFieldRefs {
    readonly id: FieldRef<"TradeSetup", 'String'>
    readonly sessionDate: FieldRef<"TradeSetup", 'DateTime'>
    readonly symbol: FieldRef<"TradeSetup", 'String'>
    readonly direction: FieldRef<"TradeSetup", 'Direction'>
    readonly priceTier: FieldRef<"TradeSetup", 'PriceTier'>
    readonly marketCapTier: FieldRef<"TradeSetup", 'MarketCapTier'>
    readonly strategy: FieldRef<"TradeSetup", 'String'>
    readonly strategyId: FieldRef<"TradeSetup", 'String'>
    readonly setupLogic: FieldRef<"TradeSetup", 'String'>
    readonly newsType: FieldRef<"TradeSetup", 'NewsType'>
    readonly newsImpact: FieldRef<"TradeSetup", 'NewsImpact'>
    readonly newsHeadline: FieldRef<"TradeSetup", 'String'>
    readonly newsCatalogId: FieldRef<"TradeSetup", 'String'>
    readonly entryCondition: FieldRef<"TradeSetup", 'String'>
    readonly entryPriceNote: FieldRef<"TradeSetup", 'String'>
    readonly entryPriceExact: FieldRef<"TradeSetup", 'Float'>
    readonly stopCondition: FieldRef<"TradeSetup", 'String'>
    readonly stopPriceNote: FieldRef<"TradeSetup", 'String'>
    readonly stopPriceExact: FieldRef<"TradeSetup", 'Float'>
    readonly target1Condition: FieldRef<"TradeSetup", 'String'>
    readonly target1PriceNote: FieldRef<"TradeSetup", 'String'>
    readonly target1PriceExact: FieldRef<"TradeSetup", 'Float'>
    readonly target2Condition: FieldRef<"TradeSetup", 'String'>
    readonly target2PriceNote: FieldRef<"TradeSetup", 'String'>
    readonly target2PriceExact: FieldRef<"TradeSetup", 'Float'>
    readonly plannedRiskReward: FieldRef<"TradeSetup", 'Float'>
    readonly plannedSize: FieldRef<"TradeSetup", 'Int'>
    readonly status: FieldRef<"TradeSetup", 'SetupStatus'>
    readonly missedReason: FieldRef<"TradeSetup", 'MissedReason'>
    readonly missedNotes: FieldRef<"TradeSetup", 'String'>
    readonly missedHypoPnL: FieldRef<"TradeSetup", 'Float'>
    readonly stockSelectionAccurate: FieldRef<"TradeSetup", 'Boolean'>
    readonly stockSelectionNote: FieldRef<"TradeSetup", 'String'>
    readonly analysisAccurate: FieldRef<"TradeSetup", 'Boolean'>
    readonly analysisAccurateNote: FieldRef<"TradeSetup", 'String'>
    readonly marketJudgmentAccurate: FieldRef<"TradeSetup", 'Boolean'>
    readonly marketJudgmentNote: FieldRef<"TradeSetup", 'String'>
    readonly strategySelectionAccurate: FieldRef<"TradeSetup", 'Boolean'>
    readonly strategySelectionNote: FieldRef<"TradeSetup", 'String'>
    readonly entryOpportunityAccurate: FieldRef<"TradeSetup", 'Boolean'>
    readonly entryOpportunityNote: FieldRef<"TradeSetup", 'String'>
    readonly exitOpportunityAccurate: FieldRef<"TradeSetup", 'Boolean'>
    readonly exitOpportunityNote: FieldRef<"TradeSetup", 'String'>
    readonly actualEntryOpportunity: FieldRef<"TradeSetup", 'String'>
    readonly actualExitOpportunity: FieldRef<"TradeSetup", 'String'>
    readonly dailySummary: FieldRef<"TradeSetup", 'String'>
    readonly selectedTradeTypes: FieldRef<"TradeSetup", 'String'>
    readonly setupGrade: FieldRef<"TradeSetup", 'Grade'>
    readonly setupNotes: FieldRef<"TradeSetup", 'String'>
    readonly createdAt: FieldRef<"TradeSetup", 'DateTime'>
    readonly updatedAt: FieldRef<"TradeSetup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradeSetup findUnique
   */
  export type TradeSetupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * Filter, which TradeSetup to fetch.
     */
    where: TradeSetupWhereUniqueInput
  }

  /**
   * TradeSetup findUniqueOrThrow
   */
  export type TradeSetupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * Filter, which TradeSetup to fetch.
     */
    where: TradeSetupWhereUniqueInput
  }

  /**
   * TradeSetup findFirst
   */
  export type TradeSetupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * Filter, which TradeSetup to fetch.
     */
    where?: TradeSetupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeSetups to fetch.
     */
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeSetups.
     */
    cursor?: TradeSetupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeSetups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeSetups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeSetups.
     */
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * TradeSetup findFirstOrThrow
   */
  export type TradeSetupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * Filter, which TradeSetup to fetch.
     */
    where?: TradeSetupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeSetups to fetch.
     */
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeSetups.
     */
    cursor?: TradeSetupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeSetups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeSetups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeSetups.
     */
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * TradeSetup findMany
   */
  export type TradeSetupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * Filter, which TradeSetups to fetch.
     */
    where?: TradeSetupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeSetups to fetch.
     */
    orderBy?: TradeSetupOrderByWithRelationInput | TradeSetupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradeSetups.
     */
    cursor?: TradeSetupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeSetups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeSetups.
     */
    skip?: number
    distinct?: TradeSetupScalarFieldEnum | TradeSetupScalarFieldEnum[]
  }

  /**
   * TradeSetup create
   */
  export type TradeSetupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * The data needed to create a TradeSetup.
     */
    data: XOR<TradeSetupCreateInput, TradeSetupUncheckedCreateInput>
  }

  /**
   * TradeSetup createMany
   */
  export type TradeSetupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradeSetups.
     */
    data: TradeSetupCreateManyInput | TradeSetupCreateManyInput[]
  }

  /**
   * TradeSetup createManyAndReturn
   */
  export type TradeSetupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * The data used to create many TradeSetups.
     */
    data: TradeSetupCreateManyInput | TradeSetupCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeSetup update
   */
  export type TradeSetupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * The data needed to update a TradeSetup.
     */
    data: XOR<TradeSetupUpdateInput, TradeSetupUncheckedUpdateInput>
    /**
     * Choose, which TradeSetup to update.
     */
    where: TradeSetupWhereUniqueInput
  }

  /**
   * TradeSetup updateMany
   */
  export type TradeSetupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradeSetups.
     */
    data: XOR<TradeSetupUpdateManyMutationInput, TradeSetupUncheckedUpdateManyInput>
    /**
     * Filter which TradeSetups to update
     */
    where?: TradeSetupWhereInput
    /**
     * Limit how many TradeSetups to update.
     */
    limit?: number
  }

  /**
   * TradeSetup updateManyAndReturn
   */
  export type TradeSetupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * The data used to update TradeSetups.
     */
    data: XOR<TradeSetupUpdateManyMutationInput, TradeSetupUncheckedUpdateManyInput>
    /**
     * Filter which TradeSetups to update
     */
    where?: TradeSetupWhereInput
    /**
     * Limit how many TradeSetups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeSetup upsert
   */
  export type TradeSetupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * The filter to search for the TradeSetup to update in case it exists.
     */
    where: TradeSetupWhereUniqueInput
    /**
     * In case the TradeSetup found by the `where` argument doesn't exist, create a new TradeSetup with this data.
     */
    create: XOR<TradeSetupCreateInput, TradeSetupUncheckedCreateInput>
    /**
     * In case the TradeSetup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeSetupUpdateInput, TradeSetupUncheckedUpdateInput>
  }

  /**
   * TradeSetup delete
   */
  export type TradeSetupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    /**
     * Filter which TradeSetup to delete.
     */
    where: TradeSetupWhereUniqueInput
  }

  /**
   * TradeSetup deleteMany
   */
  export type TradeSetupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeSetups to delete
     */
    where?: TradeSetupWhereInput
    /**
     * Limit how many TradeSetups to delete.
     */
    limit?: number
  }

  /**
   * TradeSetup.strategyRef
   */
  export type TradeSetup$strategyRefArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Strategy
     */
    select?: StrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Strategy
     */
    omit?: StrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategyInclude<ExtArgs> | null
    where?: StrategyWhereInput
  }

  /**
   * TradeSetup.newsEvents
   */
  export type TradeSetup$newsEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsEvent
     */
    select?: NewsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsEvent
     */
    omit?: NewsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsEventInclude<ExtArgs> | null
    where?: NewsEventWhereInput
    orderBy?: NewsEventOrderByWithRelationInput | NewsEventOrderByWithRelationInput[]
    cursor?: NewsEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsEventScalarFieldEnum | NewsEventScalarFieldEnum[]
  }

  /**
   * TradeSetup.newsCatalogRef
   */
  export type TradeSetup$newsCatalogRefArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsCatalog
     */
    select?: NewsCatalogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsCatalog
     */
    omit?: NewsCatalogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsCatalogInclude<ExtArgs> | null
    where?: NewsCatalogWhereInput
  }

  /**
   * TradeSetup.executions
   */
  export type TradeSetup$executionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    where?: ExecutionWhereInput
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    cursor?: ExecutionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * TradeSetup.screenshots
   */
  export type TradeSetup$screenshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    where?: ScreenshotWhereInput
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    cursor?: ScreenshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[]
  }

  /**
   * TradeSetup without action
   */
  export type TradeSetupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
  }


  /**
   * Model Execution
   */

  export type AggregateExecution = {
    _count: ExecutionCountAggregateOutputType | null
    _avg: ExecutionAvgAggregateOutputType | null
    _sum: ExecutionSumAggregateOutputType | null
    _min: ExecutionMinAggregateOutputType | null
    _max: ExecutionMaxAggregateOutputType | null
  }

  export type ExecutionAvgAggregateOutputType = {
    entryPrice: number | null
    exitPrice: number | null
    quantity: number | null
    commission: number | null
    pnl: number | null
  }

  export type ExecutionSumAggregateOutputType = {
    entryPrice: number | null
    exitPrice: number | null
    quantity: number | null
    commission: number | null
    pnl: number | null
  }

  export type ExecutionMinAggregateOutputType = {
    id: string | null
    setupId: string | null
    entryPrice: number | null
    exitPrice: number | null
    quantity: number | null
    entryTime: Date | null
    exitTime: Date | null
    commission: number | null
    pnl: number | null
    actualDirection: $Enums.Direction | null
    entryConditionMet: boolean | null
    entryConditionNotes: string | null
    exitConditionMet: boolean | null
    exitConditionNotes: string | null
    executionGrade: $Enums.Grade | null
    executionNotes: string | null
    createdAt: Date | null
  }

  export type ExecutionMaxAggregateOutputType = {
    id: string | null
    setupId: string | null
    entryPrice: number | null
    exitPrice: number | null
    quantity: number | null
    entryTime: Date | null
    exitTime: Date | null
    commission: number | null
    pnl: number | null
    actualDirection: $Enums.Direction | null
    entryConditionMet: boolean | null
    entryConditionNotes: string | null
    exitConditionMet: boolean | null
    exitConditionNotes: string | null
    executionGrade: $Enums.Grade | null
    executionNotes: string | null
    createdAt: Date | null
  }

  export type ExecutionCountAggregateOutputType = {
    id: number
    setupId: number
    entryPrice: number
    exitPrice: number
    quantity: number
    entryTime: number
    exitTime: number
    commission: number
    pnl: number
    actualDirection: number
    entryConditionMet: number
    entryConditionNotes: number
    exitConditionMet: number
    exitConditionNotes: number
    executionGrade: number
    executionNotes: number
    createdAt: number
    _all: number
  }


  export type ExecutionAvgAggregateInputType = {
    entryPrice?: true
    exitPrice?: true
    quantity?: true
    commission?: true
    pnl?: true
  }

  export type ExecutionSumAggregateInputType = {
    entryPrice?: true
    exitPrice?: true
    quantity?: true
    commission?: true
    pnl?: true
  }

  export type ExecutionMinAggregateInputType = {
    id?: true
    setupId?: true
    entryPrice?: true
    exitPrice?: true
    quantity?: true
    entryTime?: true
    exitTime?: true
    commission?: true
    pnl?: true
    actualDirection?: true
    entryConditionMet?: true
    entryConditionNotes?: true
    exitConditionMet?: true
    exitConditionNotes?: true
    executionGrade?: true
    executionNotes?: true
    createdAt?: true
  }

  export type ExecutionMaxAggregateInputType = {
    id?: true
    setupId?: true
    entryPrice?: true
    exitPrice?: true
    quantity?: true
    entryTime?: true
    exitTime?: true
    commission?: true
    pnl?: true
    actualDirection?: true
    entryConditionMet?: true
    entryConditionNotes?: true
    exitConditionMet?: true
    exitConditionNotes?: true
    executionGrade?: true
    executionNotes?: true
    createdAt?: true
  }

  export type ExecutionCountAggregateInputType = {
    id?: true
    setupId?: true
    entryPrice?: true
    exitPrice?: true
    quantity?: true
    entryTime?: true
    exitTime?: true
    commission?: true
    pnl?: true
    actualDirection?: true
    entryConditionMet?: true
    entryConditionNotes?: true
    exitConditionMet?: true
    exitConditionNotes?: true
    executionGrade?: true
    executionNotes?: true
    createdAt?: true
    _all?: true
  }

  export type ExecutionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Execution to aggregate.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Executions
    **/
    _count?: true | ExecutionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExecutionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExecutionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExecutionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExecutionMaxAggregateInputType
  }

  export type GetExecutionAggregateType<T extends ExecutionAggregateArgs> = {
        [P in keyof T & keyof AggregateExecution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExecution[P]>
      : GetScalarType<T[P], AggregateExecution[P]>
  }




  export type ExecutionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExecutionWhereInput
    orderBy?: ExecutionOrderByWithAggregationInput | ExecutionOrderByWithAggregationInput[]
    by: ExecutionScalarFieldEnum[] | ExecutionScalarFieldEnum
    having?: ExecutionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExecutionCountAggregateInputType | true
    _avg?: ExecutionAvgAggregateInputType
    _sum?: ExecutionSumAggregateInputType
    _min?: ExecutionMinAggregateInputType
    _max?: ExecutionMaxAggregateInputType
  }

  export type ExecutionGroupByOutputType = {
    id: string
    setupId: string
    entryPrice: number
    exitPrice: number | null
    quantity: number
    entryTime: Date
    exitTime: Date | null
    commission: number
    pnl: number | null
    actualDirection: $Enums.Direction | null
    entryConditionMet: boolean | null
    entryConditionNotes: string | null
    exitConditionMet: boolean | null
    exitConditionNotes: string | null
    executionGrade: $Enums.Grade | null
    executionNotes: string | null
    createdAt: Date
    _count: ExecutionCountAggregateOutputType | null
    _avg: ExecutionAvgAggregateOutputType | null
    _sum: ExecutionSumAggregateOutputType | null
    _min: ExecutionMinAggregateOutputType | null
    _max: ExecutionMaxAggregateOutputType | null
  }

  type GetExecutionGroupByPayload<T extends ExecutionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExecutionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExecutionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExecutionGroupByOutputType[P]>
            : GetScalarType<T[P], ExecutionGroupByOutputType[P]>
        }
      >
    >


  export type ExecutionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    setupId?: boolean
    entryPrice?: boolean
    exitPrice?: boolean
    quantity?: boolean
    entryTime?: boolean
    exitTime?: boolean
    commission?: boolean
    pnl?: boolean
    actualDirection?: boolean
    entryConditionMet?: boolean
    entryConditionNotes?: boolean
    exitConditionMet?: boolean
    exitConditionNotes?: boolean
    executionGrade?: boolean
    executionNotes?: boolean
    createdAt?: boolean
    setup?: boolean | TradeSetupDefaultArgs<ExtArgs>
    screenshots?: boolean | Execution$screenshotsArgs<ExtArgs>
    _count?: boolean | ExecutionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["execution"]>

  export type ExecutionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    setupId?: boolean
    entryPrice?: boolean
    exitPrice?: boolean
    quantity?: boolean
    entryTime?: boolean
    exitTime?: boolean
    commission?: boolean
    pnl?: boolean
    actualDirection?: boolean
    entryConditionMet?: boolean
    entryConditionNotes?: boolean
    exitConditionMet?: boolean
    exitConditionNotes?: boolean
    executionGrade?: boolean
    executionNotes?: boolean
    createdAt?: boolean
    setup?: boolean | TradeSetupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["execution"]>

  export type ExecutionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    setupId?: boolean
    entryPrice?: boolean
    exitPrice?: boolean
    quantity?: boolean
    entryTime?: boolean
    exitTime?: boolean
    commission?: boolean
    pnl?: boolean
    actualDirection?: boolean
    entryConditionMet?: boolean
    entryConditionNotes?: boolean
    exitConditionMet?: boolean
    exitConditionNotes?: boolean
    executionGrade?: boolean
    executionNotes?: boolean
    createdAt?: boolean
    setup?: boolean | TradeSetupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["execution"]>

  export type ExecutionSelectScalar = {
    id?: boolean
    setupId?: boolean
    entryPrice?: boolean
    exitPrice?: boolean
    quantity?: boolean
    entryTime?: boolean
    exitTime?: boolean
    commission?: boolean
    pnl?: boolean
    actualDirection?: boolean
    entryConditionMet?: boolean
    entryConditionNotes?: boolean
    exitConditionMet?: boolean
    exitConditionNotes?: boolean
    executionGrade?: boolean
    executionNotes?: boolean
    createdAt?: boolean
  }

  export type ExecutionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "setupId" | "entryPrice" | "exitPrice" | "quantity" | "entryTime" | "exitTime" | "commission" | "pnl" | "actualDirection" | "entryConditionMet" | "entryConditionNotes" | "exitConditionMet" | "exitConditionNotes" | "executionGrade" | "executionNotes" | "createdAt", ExtArgs["result"]["execution"]>
  export type ExecutionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setup?: boolean | TradeSetupDefaultArgs<ExtArgs>
    screenshots?: boolean | Execution$screenshotsArgs<ExtArgs>
    _count?: boolean | ExecutionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExecutionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setup?: boolean | TradeSetupDefaultArgs<ExtArgs>
  }
  export type ExecutionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setup?: boolean | TradeSetupDefaultArgs<ExtArgs>
  }

  export type $ExecutionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Execution"
    objects: {
      setup: Prisma.$TradeSetupPayload<ExtArgs>
      screenshots: Prisma.$ScreenshotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      setupId: string
      entryPrice: number
      exitPrice: number | null
      quantity: number
      entryTime: Date
      exitTime: Date | null
      commission: number
      pnl: number | null
      actualDirection: $Enums.Direction | null
      entryConditionMet: boolean | null
      entryConditionNotes: string | null
      exitConditionMet: boolean | null
      exitConditionNotes: string | null
      executionGrade: $Enums.Grade | null
      executionNotes: string | null
      createdAt: Date
    }, ExtArgs["result"]["execution"]>
    composites: {}
  }

  type ExecutionGetPayload<S extends boolean | null | undefined | ExecutionDefaultArgs> = $Result.GetResult<Prisma.$ExecutionPayload, S>

  type ExecutionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExecutionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExecutionCountAggregateInputType | true
    }

  export interface ExecutionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Execution'], meta: { name: 'Execution' } }
    /**
     * Find zero or one Execution that matches the filter.
     * @param {ExecutionFindUniqueArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExecutionFindUniqueArgs>(args: SelectSubset<T, ExecutionFindUniqueArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Execution that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExecutionFindUniqueOrThrowArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExecutionFindUniqueOrThrowArgs>(args: SelectSubset<T, ExecutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Execution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionFindFirstArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExecutionFindFirstArgs>(args?: SelectSubset<T, ExecutionFindFirstArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Execution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionFindFirstOrThrowArgs} args - Arguments to find a Execution
     * @example
     * // Get one Execution
     * const execution = await prisma.execution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExecutionFindFirstOrThrowArgs>(args?: SelectSubset<T, ExecutionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Executions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Executions
     * const executions = await prisma.execution.findMany()
     * 
     * // Get first 10 Executions
     * const executions = await prisma.execution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const executionWithIdOnly = await prisma.execution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExecutionFindManyArgs>(args?: SelectSubset<T, ExecutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Execution.
     * @param {ExecutionCreateArgs} args - Arguments to create a Execution.
     * @example
     * // Create one Execution
     * const Execution = await prisma.execution.create({
     *   data: {
     *     // ... data to create a Execution
     *   }
     * })
     * 
     */
    create<T extends ExecutionCreateArgs>(args: SelectSubset<T, ExecutionCreateArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Executions.
     * @param {ExecutionCreateManyArgs} args - Arguments to create many Executions.
     * @example
     * // Create many Executions
     * const execution = await prisma.execution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExecutionCreateManyArgs>(args?: SelectSubset<T, ExecutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Executions and returns the data saved in the database.
     * @param {ExecutionCreateManyAndReturnArgs} args - Arguments to create many Executions.
     * @example
     * // Create many Executions
     * const execution = await prisma.execution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Executions and only return the `id`
     * const executionWithIdOnly = await prisma.execution.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExecutionCreateManyAndReturnArgs>(args?: SelectSubset<T, ExecutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Execution.
     * @param {ExecutionDeleteArgs} args - Arguments to delete one Execution.
     * @example
     * // Delete one Execution
     * const Execution = await prisma.execution.delete({
     *   where: {
     *     // ... filter to delete one Execution
     *   }
     * })
     * 
     */
    delete<T extends ExecutionDeleteArgs>(args: SelectSubset<T, ExecutionDeleteArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Execution.
     * @param {ExecutionUpdateArgs} args - Arguments to update one Execution.
     * @example
     * // Update one Execution
     * const execution = await prisma.execution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExecutionUpdateArgs>(args: SelectSubset<T, ExecutionUpdateArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Executions.
     * @param {ExecutionDeleteManyArgs} args - Arguments to filter Executions to delete.
     * @example
     * // Delete a few Executions
     * const { count } = await prisma.execution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExecutionDeleteManyArgs>(args?: SelectSubset<T, ExecutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Executions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Executions
     * const execution = await prisma.execution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExecutionUpdateManyArgs>(args: SelectSubset<T, ExecutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Executions and returns the data updated in the database.
     * @param {ExecutionUpdateManyAndReturnArgs} args - Arguments to update many Executions.
     * @example
     * // Update many Executions
     * const execution = await prisma.execution.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Executions and only return the `id`
     * const executionWithIdOnly = await prisma.execution.updateManyAndReturn({
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
    updateManyAndReturn<T extends ExecutionUpdateManyAndReturnArgs>(args: SelectSubset<T, ExecutionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Execution.
     * @param {ExecutionUpsertArgs} args - Arguments to update or create a Execution.
     * @example
     * // Update or create a Execution
     * const execution = await prisma.execution.upsert({
     *   create: {
     *     // ... data to create a Execution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Execution we want to update
     *   }
     * })
     */
    upsert<T extends ExecutionUpsertArgs>(args: SelectSubset<T, ExecutionUpsertArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Executions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionCountArgs} args - Arguments to filter Executions to count.
     * @example
     * // Count the number of Executions
     * const count = await prisma.execution.count({
     *   where: {
     *     // ... the filter for the Executions we want to count
     *   }
     * })
    **/
    count<T extends ExecutionCountArgs>(
      args?: Subset<T, ExecutionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExecutionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Execution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExecutionAggregateArgs>(args: Subset<T, ExecutionAggregateArgs>): Prisma.PrismaPromise<GetExecutionAggregateType<T>>

    /**
     * Group by Execution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExecutionGroupByArgs} args - Group by arguments.
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
      T extends ExecutionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExecutionGroupByArgs['orderBy'] }
        : { orderBy?: ExecutionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExecutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExecutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Execution model
   */
  readonly fields: ExecutionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Execution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExecutionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    setup<T extends TradeSetupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TradeSetupDefaultArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    screenshots<T extends Execution$screenshotsArgs<ExtArgs> = {}>(args?: Subset<T, Execution$screenshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Execution model
   */
  interface ExecutionFieldRefs {
    readonly id: FieldRef<"Execution", 'String'>
    readonly setupId: FieldRef<"Execution", 'String'>
    readonly entryPrice: FieldRef<"Execution", 'Float'>
    readonly exitPrice: FieldRef<"Execution", 'Float'>
    readonly quantity: FieldRef<"Execution", 'Int'>
    readonly entryTime: FieldRef<"Execution", 'DateTime'>
    readonly exitTime: FieldRef<"Execution", 'DateTime'>
    readonly commission: FieldRef<"Execution", 'Float'>
    readonly pnl: FieldRef<"Execution", 'Float'>
    readonly actualDirection: FieldRef<"Execution", 'Direction'>
    readonly entryConditionMet: FieldRef<"Execution", 'Boolean'>
    readonly entryConditionNotes: FieldRef<"Execution", 'String'>
    readonly exitConditionMet: FieldRef<"Execution", 'Boolean'>
    readonly exitConditionNotes: FieldRef<"Execution", 'String'>
    readonly executionGrade: FieldRef<"Execution", 'Grade'>
    readonly executionNotes: FieldRef<"Execution", 'String'>
    readonly createdAt: FieldRef<"Execution", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Execution findUnique
   */
  export type ExecutionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution findUniqueOrThrow
   */
  export type ExecutionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution findFirst
   */
  export type ExecutionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Executions.
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Executions.
     */
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Execution findFirstOrThrow
   */
  export type ExecutionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Execution to fetch.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Executions.
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Executions.
     */
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Execution findMany
   */
  export type ExecutionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter, which Executions to fetch.
     */
    where?: ExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Executions to fetch.
     */
    orderBy?: ExecutionOrderByWithRelationInput | ExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Executions.
     */
    cursor?: ExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Executions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Executions.
     */
    skip?: number
    distinct?: ExecutionScalarFieldEnum | ExecutionScalarFieldEnum[]
  }

  /**
   * Execution create
   */
  export type ExecutionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * The data needed to create a Execution.
     */
    data: XOR<ExecutionCreateInput, ExecutionUncheckedCreateInput>
  }

  /**
   * Execution createMany
   */
  export type ExecutionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Executions.
     */
    data: ExecutionCreateManyInput | ExecutionCreateManyInput[]
  }

  /**
   * Execution createManyAndReturn
   */
  export type ExecutionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * The data used to create many Executions.
     */
    data: ExecutionCreateManyInput | ExecutionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Execution update
   */
  export type ExecutionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * The data needed to update a Execution.
     */
    data: XOR<ExecutionUpdateInput, ExecutionUncheckedUpdateInput>
    /**
     * Choose, which Execution to update.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution updateMany
   */
  export type ExecutionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Executions.
     */
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyInput>
    /**
     * Filter which Executions to update
     */
    where?: ExecutionWhereInput
    /**
     * Limit how many Executions to update.
     */
    limit?: number
  }

  /**
   * Execution updateManyAndReturn
   */
  export type ExecutionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * The data used to update Executions.
     */
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyInput>
    /**
     * Filter which Executions to update
     */
    where?: ExecutionWhereInput
    /**
     * Limit how many Executions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Execution upsert
   */
  export type ExecutionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * The filter to search for the Execution to update in case it exists.
     */
    where: ExecutionWhereUniqueInput
    /**
     * In case the Execution found by the `where` argument doesn't exist, create a new Execution with this data.
     */
    create: XOR<ExecutionCreateInput, ExecutionUncheckedCreateInput>
    /**
     * In case the Execution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExecutionUpdateInput, ExecutionUncheckedUpdateInput>
  }

  /**
   * Execution delete
   */
  export type ExecutionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    /**
     * Filter which Execution to delete.
     */
    where: ExecutionWhereUniqueInput
  }

  /**
   * Execution deleteMany
   */
  export type ExecutionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Executions to delete
     */
    where?: ExecutionWhereInput
    /**
     * Limit how many Executions to delete.
     */
    limit?: number
  }

  /**
   * Execution.screenshots
   */
  export type Execution$screenshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    where?: ScreenshotWhereInput
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    cursor?: ScreenshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[]
  }

  /**
   * Execution without action
   */
  export type ExecutionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
  }


  /**
   * Model Screenshot
   */

  export type AggregateScreenshot = {
    _count: ScreenshotCountAggregateOutputType | null
    _avg: ScreenshotAvgAggregateOutputType | null
    _sum: ScreenshotSumAggregateOutputType | null
    _min: ScreenshotMinAggregateOutputType | null
    _max: ScreenshotMaxAggregateOutputType | null
  }

  export type ScreenshotAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type ScreenshotSumAggregateOutputType = {
    fileSize: number | null
  }

  export type ScreenshotMinAggregateOutputType = {
    id: string | null
    filename: string | null
    originalName: string | null
    filePath: string | null
    fileSize: number | null
    mimeType: string | null
    caption: string | null
    timeframe: string | null
    chartTag: $Enums.ChartTag | null
    setupId: string | null
    executionId: string | null
    sessionDate: Date | null
    takenAt: Date | null
    createdAt: Date | null
  }

  export type ScreenshotMaxAggregateOutputType = {
    id: string | null
    filename: string | null
    originalName: string | null
    filePath: string | null
    fileSize: number | null
    mimeType: string | null
    caption: string | null
    timeframe: string | null
    chartTag: $Enums.ChartTag | null
    setupId: string | null
    executionId: string | null
    sessionDate: Date | null
    takenAt: Date | null
    createdAt: Date | null
  }

  export type ScreenshotCountAggregateOutputType = {
    id: number
    filename: number
    originalName: number
    filePath: number
    fileSize: number
    mimeType: number
    caption: number
    timeframe: number
    chartTag: number
    setupId: number
    executionId: number
    sessionDate: number
    takenAt: number
    createdAt: number
    _all: number
  }


  export type ScreenshotAvgAggregateInputType = {
    fileSize?: true
  }

  export type ScreenshotSumAggregateInputType = {
    fileSize?: true
  }

  export type ScreenshotMinAggregateInputType = {
    id?: true
    filename?: true
    originalName?: true
    filePath?: true
    fileSize?: true
    mimeType?: true
    caption?: true
    timeframe?: true
    chartTag?: true
    setupId?: true
    executionId?: true
    sessionDate?: true
    takenAt?: true
    createdAt?: true
  }

  export type ScreenshotMaxAggregateInputType = {
    id?: true
    filename?: true
    originalName?: true
    filePath?: true
    fileSize?: true
    mimeType?: true
    caption?: true
    timeframe?: true
    chartTag?: true
    setupId?: true
    executionId?: true
    sessionDate?: true
    takenAt?: true
    createdAt?: true
  }

  export type ScreenshotCountAggregateInputType = {
    id?: true
    filename?: true
    originalName?: true
    filePath?: true
    fileSize?: true
    mimeType?: true
    caption?: true
    timeframe?: true
    chartTag?: true
    setupId?: true
    executionId?: true
    sessionDate?: true
    takenAt?: true
    createdAt?: true
    _all?: true
  }

  export type ScreenshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Screenshot to aggregate.
     */
    where?: ScreenshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScreenshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screenshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Screenshots
    **/
    _count?: true | ScreenshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScreenshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScreenshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScreenshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScreenshotMaxAggregateInputType
  }

  export type GetScreenshotAggregateType<T extends ScreenshotAggregateArgs> = {
        [P in keyof T & keyof AggregateScreenshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScreenshot[P]>
      : GetScalarType<T[P], AggregateScreenshot[P]>
  }




  export type ScreenshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScreenshotWhereInput
    orderBy?: ScreenshotOrderByWithAggregationInput | ScreenshotOrderByWithAggregationInput[]
    by: ScreenshotScalarFieldEnum[] | ScreenshotScalarFieldEnum
    having?: ScreenshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScreenshotCountAggregateInputType | true
    _avg?: ScreenshotAvgAggregateInputType
    _sum?: ScreenshotSumAggregateInputType
    _min?: ScreenshotMinAggregateInputType
    _max?: ScreenshotMaxAggregateInputType
  }

  export type ScreenshotGroupByOutputType = {
    id: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption: string | null
    timeframe: string | null
    chartTag: $Enums.ChartTag | null
    setupId: string | null
    executionId: string | null
    sessionDate: Date | null
    takenAt: Date | null
    createdAt: Date
    _count: ScreenshotCountAggregateOutputType | null
    _avg: ScreenshotAvgAggregateOutputType | null
    _sum: ScreenshotSumAggregateOutputType | null
    _min: ScreenshotMinAggregateOutputType | null
    _max: ScreenshotMaxAggregateOutputType | null
  }

  type GetScreenshotGroupByPayload<T extends ScreenshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScreenshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScreenshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScreenshotGroupByOutputType[P]>
            : GetScalarType<T[P], ScreenshotGroupByOutputType[P]>
        }
      >
    >


  export type ScreenshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    originalName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    caption?: boolean
    timeframe?: boolean
    chartTag?: boolean
    setupId?: boolean
    executionId?: boolean
    sessionDate?: boolean
    takenAt?: boolean
    createdAt?: boolean
    setup?: boolean | Screenshot$setupArgs<ExtArgs>
    execution?: boolean | Screenshot$executionArgs<ExtArgs>
    session?: boolean | Screenshot$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["screenshot"]>

  export type ScreenshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    originalName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    caption?: boolean
    timeframe?: boolean
    chartTag?: boolean
    setupId?: boolean
    executionId?: boolean
    sessionDate?: boolean
    takenAt?: boolean
    createdAt?: boolean
    setup?: boolean | Screenshot$setupArgs<ExtArgs>
    execution?: boolean | Screenshot$executionArgs<ExtArgs>
    session?: boolean | Screenshot$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["screenshot"]>

  export type ScreenshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    originalName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    caption?: boolean
    timeframe?: boolean
    chartTag?: boolean
    setupId?: boolean
    executionId?: boolean
    sessionDate?: boolean
    takenAt?: boolean
    createdAt?: boolean
    setup?: boolean | Screenshot$setupArgs<ExtArgs>
    execution?: boolean | Screenshot$executionArgs<ExtArgs>
    session?: boolean | Screenshot$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["screenshot"]>

  export type ScreenshotSelectScalar = {
    id?: boolean
    filename?: boolean
    originalName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    caption?: boolean
    timeframe?: boolean
    chartTag?: boolean
    setupId?: boolean
    executionId?: boolean
    sessionDate?: boolean
    takenAt?: boolean
    createdAt?: boolean
  }

  export type ScreenshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "filename" | "originalName" | "filePath" | "fileSize" | "mimeType" | "caption" | "timeframe" | "chartTag" | "setupId" | "executionId" | "sessionDate" | "takenAt" | "createdAt", ExtArgs["result"]["screenshot"]>
  export type ScreenshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setup?: boolean | Screenshot$setupArgs<ExtArgs>
    execution?: boolean | Screenshot$executionArgs<ExtArgs>
    session?: boolean | Screenshot$sessionArgs<ExtArgs>
  }
  export type ScreenshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setup?: boolean | Screenshot$setupArgs<ExtArgs>
    execution?: boolean | Screenshot$executionArgs<ExtArgs>
    session?: boolean | Screenshot$sessionArgs<ExtArgs>
  }
  export type ScreenshotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    setup?: boolean | Screenshot$setupArgs<ExtArgs>
    execution?: boolean | Screenshot$executionArgs<ExtArgs>
    session?: boolean | Screenshot$sessionArgs<ExtArgs>
  }

  export type $ScreenshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Screenshot"
    objects: {
      setup: Prisma.$TradeSetupPayload<ExtArgs> | null
      execution: Prisma.$ExecutionPayload<ExtArgs> | null
      session: Prisma.$DailySessionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      filename: string
      originalName: string
      filePath: string
      fileSize: number
      mimeType: string
      caption: string | null
      timeframe: string | null
      chartTag: $Enums.ChartTag | null
      setupId: string | null
      executionId: string | null
      sessionDate: Date | null
      takenAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["screenshot"]>
    composites: {}
  }

  type ScreenshotGetPayload<S extends boolean | null | undefined | ScreenshotDefaultArgs> = $Result.GetResult<Prisma.$ScreenshotPayload, S>

  type ScreenshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScreenshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScreenshotCountAggregateInputType | true
    }

  export interface ScreenshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Screenshot'], meta: { name: 'Screenshot' } }
    /**
     * Find zero or one Screenshot that matches the filter.
     * @param {ScreenshotFindUniqueArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScreenshotFindUniqueArgs>(args: SelectSubset<T, ScreenshotFindUniqueArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Screenshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScreenshotFindUniqueOrThrowArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScreenshotFindUniqueOrThrowArgs>(args: SelectSubset<T, ScreenshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Screenshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotFindFirstArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScreenshotFindFirstArgs>(args?: SelectSubset<T, ScreenshotFindFirstArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Screenshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotFindFirstOrThrowArgs} args - Arguments to find a Screenshot
     * @example
     * // Get one Screenshot
     * const screenshot = await prisma.screenshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScreenshotFindFirstOrThrowArgs>(args?: SelectSubset<T, ScreenshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Screenshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Screenshots
     * const screenshots = await prisma.screenshot.findMany()
     * 
     * // Get first 10 Screenshots
     * const screenshots = await prisma.screenshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const screenshotWithIdOnly = await prisma.screenshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScreenshotFindManyArgs>(args?: SelectSubset<T, ScreenshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Screenshot.
     * @param {ScreenshotCreateArgs} args - Arguments to create a Screenshot.
     * @example
     * // Create one Screenshot
     * const Screenshot = await prisma.screenshot.create({
     *   data: {
     *     // ... data to create a Screenshot
     *   }
     * })
     * 
     */
    create<T extends ScreenshotCreateArgs>(args: SelectSubset<T, ScreenshotCreateArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Screenshots.
     * @param {ScreenshotCreateManyArgs} args - Arguments to create many Screenshots.
     * @example
     * // Create many Screenshots
     * const screenshot = await prisma.screenshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScreenshotCreateManyArgs>(args?: SelectSubset<T, ScreenshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Screenshots and returns the data saved in the database.
     * @param {ScreenshotCreateManyAndReturnArgs} args - Arguments to create many Screenshots.
     * @example
     * // Create many Screenshots
     * const screenshot = await prisma.screenshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Screenshots and only return the `id`
     * const screenshotWithIdOnly = await prisma.screenshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScreenshotCreateManyAndReturnArgs>(args?: SelectSubset<T, ScreenshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Screenshot.
     * @param {ScreenshotDeleteArgs} args - Arguments to delete one Screenshot.
     * @example
     * // Delete one Screenshot
     * const Screenshot = await prisma.screenshot.delete({
     *   where: {
     *     // ... filter to delete one Screenshot
     *   }
     * })
     * 
     */
    delete<T extends ScreenshotDeleteArgs>(args: SelectSubset<T, ScreenshotDeleteArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Screenshot.
     * @param {ScreenshotUpdateArgs} args - Arguments to update one Screenshot.
     * @example
     * // Update one Screenshot
     * const screenshot = await prisma.screenshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScreenshotUpdateArgs>(args: SelectSubset<T, ScreenshotUpdateArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Screenshots.
     * @param {ScreenshotDeleteManyArgs} args - Arguments to filter Screenshots to delete.
     * @example
     * // Delete a few Screenshots
     * const { count } = await prisma.screenshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScreenshotDeleteManyArgs>(args?: SelectSubset<T, ScreenshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Screenshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Screenshots
     * const screenshot = await prisma.screenshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScreenshotUpdateManyArgs>(args: SelectSubset<T, ScreenshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Screenshots and returns the data updated in the database.
     * @param {ScreenshotUpdateManyAndReturnArgs} args - Arguments to update many Screenshots.
     * @example
     * // Update many Screenshots
     * const screenshot = await prisma.screenshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Screenshots and only return the `id`
     * const screenshotWithIdOnly = await prisma.screenshot.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScreenshotUpdateManyAndReturnArgs>(args: SelectSubset<T, ScreenshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Screenshot.
     * @param {ScreenshotUpsertArgs} args - Arguments to update or create a Screenshot.
     * @example
     * // Update or create a Screenshot
     * const screenshot = await prisma.screenshot.upsert({
     *   create: {
     *     // ... data to create a Screenshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Screenshot we want to update
     *   }
     * })
     */
    upsert<T extends ScreenshotUpsertArgs>(args: SelectSubset<T, ScreenshotUpsertArgs<ExtArgs>>): Prisma__ScreenshotClient<$Result.GetResult<Prisma.$ScreenshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Screenshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotCountArgs} args - Arguments to filter Screenshots to count.
     * @example
     * // Count the number of Screenshots
     * const count = await prisma.screenshot.count({
     *   where: {
     *     // ... the filter for the Screenshots we want to count
     *   }
     * })
    **/
    count<T extends ScreenshotCountArgs>(
      args?: Subset<T, ScreenshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScreenshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Screenshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScreenshotAggregateArgs>(args: Subset<T, ScreenshotAggregateArgs>): Prisma.PrismaPromise<GetScreenshotAggregateType<T>>

    /**
     * Group by Screenshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScreenshotGroupByArgs} args - Group by arguments.
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
      T extends ScreenshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScreenshotGroupByArgs['orderBy'] }
        : { orderBy?: ScreenshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScreenshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScreenshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Screenshot model
   */
  readonly fields: ScreenshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Screenshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScreenshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    setup<T extends Screenshot$setupArgs<ExtArgs> = {}>(args?: Subset<T, Screenshot$setupArgs<ExtArgs>>): Prisma__TradeSetupClient<$Result.GetResult<Prisma.$TradeSetupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    execution<T extends Screenshot$executionArgs<ExtArgs> = {}>(args?: Subset<T, Screenshot$executionArgs<ExtArgs>>): Prisma__ExecutionClient<$Result.GetResult<Prisma.$ExecutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    session<T extends Screenshot$sessionArgs<ExtArgs> = {}>(args?: Subset<T, Screenshot$sessionArgs<ExtArgs>>): Prisma__DailySessionClient<$Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Screenshot model
   */
  interface ScreenshotFieldRefs {
    readonly id: FieldRef<"Screenshot", 'String'>
    readonly filename: FieldRef<"Screenshot", 'String'>
    readonly originalName: FieldRef<"Screenshot", 'String'>
    readonly filePath: FieldRef<"Screenshot", 'String'>
    readonly fileSize: FieldRef<"Screenshot", 'Int'>
    readonly mimeType: FieldRef<"Screenshot", 'String'>
    readonly caption: FieldRef<"Screenshot", 'String'>
    readonly timeframe: FieldRef<"Screenshot", 'String'>
    readonly chartTag: FieldRef<"Screenshot", 'ChartTag'>
    readonly setupId: FieldRef<"Screenshot", 'String'>
    readonly executionId: FieldRef<"Screenshot", 'String'>
    readonly sessionDate: FieldRef<"Screenshot", 'DateTime'>
    readonly takenAt: FieldRef<"Screenshot", 'DateTime'>
    readonly createdAt: FieldRef<"Screenshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Screenshot findUnique
   */
  export type ScreenshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * Filter, which Screenshot to fetch.
     */
    where: ScreenshotWhereUniqueInput
  }

  /**
   * Screenshot findUniqueOrThrow
   */
  export type ScreenshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * Filter, which Screenshot to fetch.
     */
    where: ScreenshotWhereUniqueInput
  }

  /**
   * Screenshot findFirst
   */
  export type ScreenshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * Filter, which Screenshot to fetch.
     */
    where?: ScreenshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Screenshots.
     */
    cursor?: ScreenshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screenshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Screenshots.
     */
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[]
  }

  /**
   * Screenshot findFirstOrThrow
   */
  export type ScreenshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * Filter, which Screenshot to fetch.
     */
    where?: ScreenshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Screenshots.
     */
    cursor?: ScreenshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screenshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Screenshots.
     */
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[]
  }

  /**
   * Screenshot findMany
   */
  export type ScreenshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * Filter, which Screenshots to fetch.
     */
    where?: ScreenshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Screenshots to fetch.
     */
    orderBy?: ScreenshotOrderByWithRelationInput | ScreenshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Screenshots.
     */
    cursor?: ScreenshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Screenshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Screenshots.
     */
    skip?: number
    distinct?: ScreenshotScalarFieldEnum | ScreenshotScalarFieldEnum[]
  }

  /**
   * Screenshot create
   */
  export type ScreenshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * The data needed to create a Screenshot.
     */
    data: XOR<ScreenshotCreateInput, ScreenshotUncheckedCreateInput>
  }

  /**
   * Screenshot createMany
   */
  export type ScreenshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Screenshots.
     */
    data: ScreenshotCreateManyInput | ScreenshotCreateManyInput[]
  }

  /**
   * Screenshot createManyAndReturn
   */
  export type ScreenshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * The data used to create many Screenshots.
     */
    data: ScreenshotCreateManyInput | ScreenshotCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Screenshot update
   */
  export type ScreenshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * The data needed to update a Screenshot.
     */
    data: XOR<ScreenshotUpdateInput, ScreenshotUncheckedUpdateInput>
    /**
     * Choose, which Screenshot to update.
     */
    where: ScreenshotWhereUniqueInput
  }

  /**
   * Screenshot updateMany
   */
  export type ScreenshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Screenshots.
     */
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyInput>
    /**
     * Filter which Screenshots to update
     */
    where?: ScreenshotWhereInput
    /**
     * Limit how many Screenshots to update.
     */
    limit?: number
  }

  /**
   * Screenshot updateManyAndReturn
   */
  export type ScreenshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * The data used to update Screenshots.
     */
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyInput>
    /**
     * Filter which Screenshots to update
     */
    where?: ScreenshotWhereInput
    /**
     * Limit how many Screenshots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Screenshot upsert
   */
  export type ScreenshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * The filter to search for the Screenshot to update in case it exists.
     */
    where: ScreenshotWhereUniqueInput
    /**
     * In case the Screenshot found by the `where` argument doesn't exist, create a new Screenshot with this data.
     */
    create: XOR<ScreenshotCreateInput, ScreenshotUncheckedCreateInput>
    /**
     * In case the Screenshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScreenshotUpdateInput, ScreenshotUncheckedUpdateInput>
  }

  /**
   * Screenshot delete
   */
  export type ScreenshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
    /**
     * Filter which Screenshot to delete.
     */
    where: ScreenshotWhereUniqueInput
  }

  /**
   * Screenshot deleteMany
   */
  export type ScreenshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Screenshots to delete
     */
    where?: ScreenshotWhereInput
    /**
     * Limit how many Screenshots to delete.
     */
    limit?: number
  }

  /**
   * Screenshot.setup
   */
  export type Screenshot$setupArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeSetup
     */
    select?: TradeSetupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeSetup
     */
    omit?: TradeSetupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeSetupInclude<ExtArgs> | null
    where?: TradeSetupWhereInput
  }

  /**
   * Screenshot.execution
   */
  export type Screenshot$executionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Execution
     */
    select?: ExecutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Execution
     */
    omit?: ExecutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExecutionInclude<ExtArgs> | null
    where?: ExecutionWhereInput
  }

  /**
   * Screenshot.session
   */
  export type Screenshot$sessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailySession
     */
    select?: DailySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailySession
     */
    omit?: DailySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailySessionInclude<ExtArgs> | null
    where?: DailySessionWhereInput
  }

  /**
   * Screenshot without action
   */
  export type ScreenshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Screenshot
     */
    select?: ScreenshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Screenshot
     */
    omit?: ScreenshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScreenshotInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const NewsCatalogScalarFieldEnum: {
    id: 'id',
    name: 'name',
    category: 'category',
    subCategory: 'subCategory',
    strength: 'strength',
    description: 'description',
    entryConditions: 'entryConditions',
    riskFactors: 'riskFactors',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NewsCatalogScalarFieldEnum = (typeof NewsCatalogScalarFieldEnum)[keyof typeof NewsCatalogScalarFieldEnum]


  export const StrategyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    isActive: 'isActive',
    mindmapData: 'mindmapData',
    ruleHistory: 'ruleHistory',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StrategyScalarFieldEnum = (typeof StrategyScalarFieldEnum)[keyof typeof StrategyScalarFieldEnum]


  export const TradeTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    strategyId: 'strategyId',
    createdAt: 'createdAt'
  };

  export type TradeTypeScalarFieldEnum = (typeof TradeTypeScalarFieldEnum)[keyof typeof TradeTypeScalarFieldEnum]


  export const DailySessionScalarFieldEnum: {
    date: 'date',
    marketContext: 'marketContext',
    preMarketPlan: 'preMarketPlan',
    selectedStrategy: 'selectedStrategy',
    postReview: 'postReview',
    lessonsLearned: 'lessonsLearned',
    whatWentWell: 'whatWentWell',
    planFollowed: 'planFollowed',
    emotionRating: 'emotionRating',
    focusRating: 'focusRating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DailySessionScalarFieldEnum = (typeof DailySessionScalarFieldEnum)[keyof typeof DailySessionScalarFieldEnum]


  export const NewsEventScalarFieldEnum: {
    id: 'id',
    sessionDate: 'sessionDate',
    symbol: 'symbol',
    headline: 'headline',
    source: 'source',
    eventType: 'eventType',
    impact: 'impact',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type NewsEventScalarFieldEnum = (typeof NewsEventScalarFieldEnum)[keyof typeof NewsEventScalarFieldEnum]


  export const TradeSetupScalarFieldEnum: {
    id: 'id',
    sessionDate: 'sessionDate',
    symbol: 'symbol',
    direction: 'direction',
    priceTier: 'priceTier',
    marketCapTier: 'marketCapTier',
    strategy: 'strategy',
    strategyId: 'strategyId',
    setupLogic: 'setupLogic',
    newsType: 'newsType',
    newsImpact: 'newsImpact',
    newsHeadline: 'newsHeadline',
    newsCatalogId: 'newsCatalogId',
    entryCondition: 'entryCondition',
    entryPriceNote: 'entryPriceNote',
    entryPriceExact: 'entryPriceExact',
    stopCondition: 'stopCondition',
    stopPriceNote: 'stopPriceNote',
    stopPriceExact: 'stopPriceExact',
    target1Condition: 'target1Condition',
    target1PriceNote: 'target1PriceNote',
    target1PriceExact: 'target1PriceExact',
    target2Condition: 'target2Condition',
    target2PriceNote: 'target2PriceNote',
    target2PriceExact: 'target2PriceExact',
    plannedRiskReward: 'plannedRiskReward',
    plannedSize: 'plannedSize',
    status: 'status',
    missedReason: 'missedReason',
    missedNotes: 'missedNotes',
    missedHypoPnL: 'missedHypoPnL',
    stockSelectionAccurate: 'stockSelectionAccurate',
    stockSelectionNote: 'stockSelectionNote',
    analysisAccurate: 'analysisAccurate',
    analysisAccurateNote: 'analysisAccurateNote',
    marketJudgmentAccurate: 'marketJudgmentAccurate',
    marketJudgmentNote: 'marketJudgmentNote',
    strategySelectionAccurate: 'strategySelectionAccurate',
    strategySelectionNote: 'strategySelectionNote',
    entryOpportunityAccurate: 'entryOpportunityAccurate',
    entryOpportunityNote: 'entryOpportunityNote',
    exitOpportunityAccurate: 'exitOpportunityAccurate',
    exitOpportunityNote: 'exitOpportunityNote',
    actualEntryOpportunity: 'actualEntryOpportunity',
    actualExitOpportunity: 'actualExitOpportunity',
    dailySummary: 'dailySummary',
    selectedTradeTypes: 'selectedTradeTypes',
    setupGrade: 'setupGrade',
    setupNotes: 'setupNotes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradeSetupScalarFieldEnum = (typeof TradeSetupScalarFieldEnum)[keyof typeof TradeSetupScalarFieldEnum]


  export const ExecutionScalarFieldEnum: {
    id: 'id',
    setupId: 'setupId',
    entryPrice: 'entryPrice',
    exitPrice: 'exitPrice',
    quantity: 'quantity',
    entryTime: 'entryTime',
    exitTime: 'exitTime',
    commission: 'commission',
    pnl: 'pnl',
    actualDirection: 'actualDirection',
    entryConditionMet: 'entryConditionMet',
    entryConditionNotes: 'entryConditionNotes',
    exitConditionMet: 'exitConditionMet',
    exitConditionNotes: 'exitConditionNotes',
    executionGrade: 'executionGrade',
    executionNotes: 'executionNotes',
    createdAt: 'createdAt'
  };

  export type ExecutionScalarFieldEnum = (typeof ExecutionScalarFieldEnum)[keyof typeof ExecutionScalarFieldEnum]


  export const ScreenshotScalarFieldEnum: {
    id: 'id',
    filename: 'filename',
    originalName: 'originalName',
    filePath: 'filePath',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    caption: 'caption',
    timeframe: 'timeframe',
    chartTag: 'chartTag',
    setupId: 'setupId',
    executionId: 'executionId',
    sessionDate: 'sessionDate',
    takenAt: 'takenAt',
    createdAt: 'createdAt'
  };

  export type ScreenshotScalarFieldEnum = (typeof ScreenshotScalarFieldEnum)[keyof typeof ScreenshotScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'NewsStrength'
   */
  export type EnumNewsStrengthFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsStrength'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'NewsType'
   */
  export type EnumNewsTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsType'>
    


  /**
   * Reference to a field of type 'NewsImpact'
   */
  export type EnumNewsImpactFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsImpact'>
    


  /**
   * Reference to a field of type 'Direction'
   */
  export type EnumDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Direction'>
    


  /**
   * Reference to a field of type 'PriceTier'
   */
  export type EnumPriceTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriceTier'>
    


  /**
   * Reference to a field of type 'MarketCapTier'
   */
  export type EnumMarketCapTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketCapTier'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'SetupStatus'
   */
  export type EnumSetupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SetupStatus'>
    


  /**
   * Reference to a field of type 'MissedReason'
   */
  export type EnumMissedReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MissedReason'>
    


  /**
   * Reference to a field of type 'Grade'
   */
  export type EnumGradeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Grade'>
    


  /**
   * Reference to a field of type 'ChartTag'
   */
  export type EnumChartTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChartTag'>
    
  /**
   * Deep Input Types
   */


  export type NewsCatalogWhereInput = {
    AND?: NewsCatalogWhereInput | NewsCatalogWhereInput[]
    OR?: NewsCatalogWhereInput[]
    NOT?: NewsCatalogWhereInput | NewsCatalogWhereInput[]
    id?: StringFilter<"NewsCatalog"> | string
    name?: StringFilter<"NewsCatalog"> | string
    category?: StringFilter<"NewsCatalog"> | string
    subCategory?: StringNullableFilter<"NewsCatalog"> | string | null
    strength?: EnumNewsStrengthFilter<"NewsCatalog"> | $Enums.NewsStrength
    description?: StringNullableFilter<"NewsCatalog"> | string | null
    entryConditions?: StringNullableFilter<"NewsCatalog"> | string | null
    riskFactors?: StringNullableFilter<"NewsCatalog"> | string | null
    isActive?: BoolFilter<"NewsCatalog"> | boolean
    createdAt?: DateTimeFilter<"NewsCatalog"> | Date | string
    updatedAt?: DateTimeFilter<"NewsCatalog"> | Date | string
    setups?: TradeSetupListRelationFilter
  }

  export type NewsCatalogOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subCategory?: SortOrderInput | SortOrder
    strength?: SortOrder
    description?: SortOrderInput | SortOrder
    entryConditions?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    setups?: TradeSetupOrderByRelationAggregateInput
  }

  export type NewsCatalogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NewsCatalogWhereInput | NewsCatalogWhereInput[]
    OR?: NewsCatalogWhereInput[]
    NOT?: NewsCatalogWhereInput | NewsCatalogWhereInput[]
    name?: StringFilter<"NewsCatalog"> | string
    category?: StringFilter<"NewsCatalog"> | string
    subCategory?: StringNullableFilter<"NewsCatalog"> | string | null
    strength?: EnumNewsStrengthFilter<"NewsCatalog"> | $Enums.NewsStrength
    description?: StringNullableFilter<"NewsCatalog"> | string | null
    entryConditions?: StringNullableFilter<"NewsCatalog"> | string | null
    riskFactors?: StringNullableFilter<"NewsCatalog"> | string | null
    isActive?: BoolFilter<"NewsCatalog"> | boolean
    createdAt?: DateTimeFilter<"NewsCatalog"> | Date | string
    updatedAt?: DateTimeFilter<"NewsCatalog"> | Date | string
    setups?: TradeSetupListRelationFilter
  }, "id">

  export type NewsCatalogOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subCategory?: SortOrderInput | SortOrder
    strength?: SortOrder
    description?: SortOrderInput | SortOrder
    entryConditions?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NewsCatalogCountOrderByAggregateInput
    _max?: NewsCatalogMaxOrderByAggregateInput
    _min?: NewsCatalogMinOrderByAggregateInput
  }

  export type NewsCatalogScalarWhereWithAggregatesInput = {
    AND?: NewsCatalogScalarWhereWithAggregatesInput | NewsCatalogScalarWhereWithAggregatesInput[]
    OR?: NewsCatalogScalarWhereWithAggregatesInput[]
    NOT?: NewsCatalogScalarWhereWithAggregatesInput | NewsCatalogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NewsCatalog"> | string
    name?: StringWithAggregatesFilter<"NewsCatalog"> | string
    category?: StringWithAggregatesFilter<"NewsCatalog"> | string
    subCategory?: StringNullableWithAggregatesFilter<"NewsCatalog"> | string | null
    strength?: EnumNewsStrengthWithAggregatesFilter<"NewsCatalog"> | $Enums.NewsStrength
    description?: StringNullableWithAggregatesFilter<"NewsCatalog"> | string | null
    entryConditions?: StringNullableWithAggregatesFilter<"NewsCatalog"> | string | null
    riskFactors?: StringNullableWithAggregatesFilter<"NewsCatalog"> | string | null
    isActive?: BoolWithAggregatesFilter<"NewsCatalog"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"NewsCatalog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NewsCatalog"> | Date | string
  }

  export type StrategyWhereInput = {
    AND?: StrategyWhereInput | StrategyWhereInput[]
    OR?: StrategyWhereInput[]
    NOT?: StrategyWhereInput | StrategyWhereInput[]
    id?: StringFilter<"Strategy"> | string
    name?: StringFilter<"Strategy"> | string
    description?: StringNullableFilter<"Strategy"> | string | null
    isActive?: BoolFilter<"Strategy"> | boolean
    mindmapData?: StringFilter<"Strategy"> | string
    ruleHistory?: StringFilter<"Strategy"> | string
    createdAt?: DateTimeFilter<"Strategy"> | Date | string
    updatedAt?: DateTimeFilter<"Strategy"> | Date | string
    setups?: TradeSetupListRelationFilter
    tradeTypes?: TradeTypeListRelationFilter
  }

  export type StrategyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    mindmapData?: SortOrder
    ruleHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    setups?: TradeSetupOrderByRelationAggregateInput
    tradeTypes?: TradeTypeOrderByRelationAggregateInput
  }

  export type StrategyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: StrategyWhereInput | StrategyWhereInput[]
    OR?: StrategyWhereInput[]
    NOT?: StrategyWhereInput | StrategyWhereInput[]
    description?: StringNullableFilter<"Strategy"> | string | null
    isActive?: BoolFilter<"Strategy"> | boolean
    mindmapData?: StringFilter<"Strategy"> | string
    ruleHistory?: StringFilter<"Strategy"> | string
    createdAt?: DateTimeFilter<"Strategy"> | Date | string
    updatedAt?: DateTimeFilter<"Strategy"> | Date | string
    setups?: TradeSetupListRelationFilter
    tradeTypes?: TradeTypeListRelationFilter
  }, "id" | "name">

  export type StrategyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    mindmapData?: SortOrder
    ruleHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StrategyCountOrderByAggregateInput
    _max?: StrategyMaxOrderByAggregateInput
    _min?: StrategyMinOrderByAggregateInput
  }

  export type StrategyScalarWhereWithAggregatesInput = {
    AND?: StrategyScalarWhereWithAggregatesInput | StrategyScalarWhereWithAggregatesInput[]
    OR?: StrategyScalarWhereWithAggregatesInput[]
    NOT?: StrategyScalarWhereWithAggregatesInput | StrategyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Strategy"> | string
    name?: StringWithAggregatesFilter<"Strategy"> | string
    description?: StringNullableWithAggregatesFilter<"Strategy"> | string | null
    isActive?: BoolWithAggregatesFilter<"Strategy"> | boolean
    mindmapData?: StringWithAggregatesFilter<"Strategy"> | string
    ruleHistory?: StringWithAggregatesFilter<"Strategy"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Strategy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Strategy"> | Date | string
  }

  export type TradeTypeWhereInput = {
    AND?: TradeTypeWhereInput | TradeTypeWhereInput[]
    OR?: TradeTypeWhereInput[]
    NOT?: TradeTypeWhereInput | TradeTypeWhereInput[]
    id?: StringFilter<"TradeType"> | string
    name?: StringFilter<"TradeType"> | string
    strategyId?: StringFilter<"TradeType"> | string
    createdAt?: DateTimeFilter<"TradeType"> | Date | string
    strategy?: XOR<StrategyScalarRelationFilter, StrategyWhereInput>
  }

  export type TradeTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    strategyId?: SortOrder
    createdAt?: SortOrder
    strategy?: StrategyOrderByWithRelationInput
  }

  export type TradeTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradeTypeWhereInput | TradeTypeWhereInput[]
    OR?: TradeTypeWhereInput[]
    NOT?: TradeTypeWhereInput | TradeTypeWhereInput[]
    name?: StringFilter<"TradeType"> | string
    strategyId?: StringFilter<"TradeType"> | string
    createdAt?: DateTimeFilter<"TradeType"> | Date | string
    strategy?: XOR<StrategyScalarRelationFilter, StrategyWhereInput>
  }, "id">

  export type TradeTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    strategyId?: SortOrder
    createdAt?: SortOrder
    _count?: TradeTypeCountOrderByAggregateInput
    _max?: TradeTypeMaxOrderByAggregateInput
    _min?: TradeTypeMinOrderByAggregateInput
  }

  export type TradeTypeScalarWhereWithAggregatesInput = {
    AND?: TradeTypeScalarWhereWithAggregatesInput | TradeTypeScalarWhereWithAggregatesInput[]
    OR?: TradeTypeScalarWhereWithAggregatesInput[]
    NOT?: TradeTypeScalarWhereWithAggregatesInput | TradeTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradeType"> | string
    name?: StringWithAggregatesFilter<"TradeType"> | string
    strategyId?: StringWithAggregatesFilter<"TradeType"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TradeType"> | Date | string
  }

  export type DailySessionWhereInput = {
    AND?: DailySessionWhereInput | DailySessionWhereInput[]
    OR?: DailySessionWhereInput[]
    NOT?: DailySessionWhereInput | DailySessionWhereInput[]
    date?: DateTimeFilter<"DailySession"> | Date | string
    marketContext?: StringNullableFilter<"DailySession"> | string | null
    preMarketPlan?: StringNullableFilter<"DailySession"> | string | null
    selectedStrategy?: StringFilter<"DailySession"> | string
    postReview?: StringNullableFilter<"DailySession"> | string | null
    lessonsLearned?: StringNullableFilter<"DailySession"> | string | null
    whatWentWell?: StringNullableFilter<"DailySession"> | string | null
    planFollowed?: IntNullableFilter<"DailySession"> | number | null
    emotionRating?: IntNullableFilter<"DailySession"> | number | null
    focusRating?: IntNullableFilter<"DailySession"> | number | null
    createdAt?: DateTimeFilter<"DailySession"> | Date | string
    updatedAt?: DateTimeFilter<"DailySession"> | Date | string
    newsEvents?: NewsEventListRelationFilter
    setups?: TradeSetupListRelationFilter
    screenshots?: ScreenshotListRelationFilter
  }

  export type DailySessionOrderByWithRelationInput = {
    date?: SortOrder
    marketContext?: SortOrderInput | SortOrder
    preMarketPlan?: SortOrderInput | SortOrder
    selectedStrategy?: SortOrder
    postReview?: SortOrderInput | SortOrder
    lessonsLearned?: SortOrderInput | SortOrder
    whatWentWell?: SortOrderInput | SortOrder
    planFollowed?: SortOrderInput | SortOrder
    emotionRating?: SortOrderInput | SortOrder
    focusRating?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    newsEvents?: NewsEventOrderByRelationAggregateInput
    setups?: TradeSetupOrderByRelationAggregateInput
    screenshots?: ScreenshotOrderByRelationAggregateInput
  }

  export type DailySessionWhereUniqueInput = Prisma.AtLeast<{
    date?: Date | string
    AND?: DailySessionWhereInput | DailySessionWhereInput[]
    OR?: DailySessionWhereInput[]
    NOT?: DailySessionWhereInput | DailySessionWhereInput[]
    marketContext?: StringNullableFilter<"DailySession"> | string | null
    preMarketPlan?: StringNullableFilter<"DailySession"> | string | null
    selectedStrategy?: StringFilter<"DailySession"> | string
    postReview?: StringNullableFilter<"DailySession"> | string | null
    lessonsLearned?: StringNullableFilter<"DailySession"> | string | null
    whatWentWell?: StringNullableFilter<"DailySession"> | string | null
    planFollowed?: IntNullableFilter<"DailySession"> | number | null
    emotionRating?: IntNullableFilter<"DailySession"> | number | null
    focusRating?: IntNullableFilter<"DailySession"> | number | null
    createdAt?: DateTimeFilter<"DailySession"> | Date | string
    updatedAt?: DateTimeFilter<"DailySession"> | Date | string
    newsEvents?: NewsEventListRelationFilter
    setups?: TradeSetupListRelationFilter
    screenshots?: ScreenshotListRelationFilter
  }, "date">

  export type DailySessionOrderByWithAggregationInput = {
    date?: SortOrder
    marketContext?: SortOrderInput | SortOrder
    preMarketPlan?: SortOrderInput | SortOrder
    selectedStrategy?: SortOrder
    postReview?: SortOrderInput | SortOrder
    lessonsLearned?: SortOrderInput | SortOrder
    whatWentWell?: SortOrderInput | SortOrder
    planFollowed?: SortOrderInput | SortOrder
    emotionRating?: SortOrderInput | SortOrder
    focusRating?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DailySessionCountOrderByAggregateInput
    _avg?: DailySessionAvgOrderByAggregateInput
    _max?: DailySessionMaxOrderByAggregateInput
    _min?: DailySessionMinOrderByAggregateInput
    _sum?: DailySessionSumOrderByAggregateInput
  }

  export type DailySessionScalarWhereWithAggregatesInput = {
    AND?: DailySessionScalarWhereWithAggregatesInput | DailySessionScalarWhereWithAggregatesInput[]
    OR?: DailySessionScalarWhereWithAggregatesInput[]
    NOT?: DailySessionScalarWhereWithAggregatesInput | DailySessionScalarWhereWithAggregatesInput[]
    date?: DateTimeWithAggregatesFilter<"DailySession"> | Date | string
    marketContext?: StringNullableWithAggregatesFilter<"DailySession"> | string | null
    preMarketPlan?: StringNullableWithAggregatesFilter<"DailySession"> | string | null
    selectedStrategy?: StringWithAggregatesFilter<"DailySession"> | string
    postReview?: StringNullableWithAggregatesFilter<"DailySession"> | string | null
    lessonsLearned?: StringNullableWithAggregatesFilter<"DailySession"> | string | null
    whatWentWell?: StringNullableWithAggregatesFilter<"DailySession"> | string | null
    planFollowed?: IntNullableWithAggregatesFilter<"DailySession"> | number | null
    emotionRating?: IntNullableWithAggregatesFilter<"DailySession"> | number | null
    focusRating?: IntNullableWithAggregatesFilter<"DailySession"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"DailySession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DailySession"> | Date | string
  }

  export type NewsEventWhereInput = {
    AND?: NewsEventWhereInput | NewsEventWhereInput[]
    OR?: NewsEventWhereInput[]
    NOT?: NewsEventWhereInput | NewsEventWhereInput[]
    id?: StringFilter<"NewsEvent"> | string
    sessionDate?: DateTimeFilter<"NewsEvent"> | Date | string
    symbol?: StringNullableFilter<"NewsEvent"> | string | null
    headline?: StringFilter<"NewsEvent"> | string
    source?: StringNullableFilter<"NewsEvent"> | string | null
    eventType?: EnumNewsTypeFilter<"NewsEvent"> | $Enums.NewsType
    impact?: EnumNewsImpactFilter<"NewsEvent"> | $Enums.NewsImpact
    notes?: StringNullableFilter<"NewsEvent"> | string | null
    createdAt?: DateTimeFilter<"NewsEvent"> | Date | string
    session?: XOR<DailySessionScalarRelationFilter, DailySessionWhereInput>
    setups?: TradeSetupListRelationFilter
  }

  export type NewsEventOrderByWithRelationInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrderInput | SortOrder
    headline?: SortOrder
    source?: SortOrderInput | SortOrder
    eventType?: SortOrder
    impact?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    session?: DailySessionOrderByWithRelationInput
    setups?: TradeSetupOrderByRelationAggregateInput
  }

  export type NewsEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NewsEventWhereInput | NewsEventWhereInput[]
    OR?: NewsEventWhereInput[]
    NOT?: NewsEventWhereInput | NewsEventWhereInput[]
    sessionDate?: DateTimeFilter<"NewsEvent"> | Date | string
    symbol?: StringNullableFilter<"NewsEvent"> | string | null
    headline?: StringFilter<"NewsEvent"> | string
    source?: StringNullableFilter<"NewsEvent"> | string | null
    eventType?: EnumNewsTypeFilter<"NewsEvent"> | $Enums.NewsType
    impact?: EnumNewsImpactFilter<"NewsEvent"> | $Enums.NewsImpact
    notes?: StringNullableFilter<"NewsEvent"> | string | null
    createdAt?: DateTimeFilter<"NewsEvent"> | Date | string
    session?: XOR<DailySessionScalarRelationFilter, DailySessionWhereInput>
    setups?: TradeSetupListRelationFilter
  }, "id">

  export type NewsEventOrderByWithAggregationInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrderInput | SortOrder
    headline?: SortOrder
    source?: SortOrderInput | SortOrder
    eventType?: SortOrder
    impact?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NewsEventCountOrderByAggregateInput
    _max?: NewsEventMaxOrderByAggregateInput
    _min?: NewsEventMinOrderByAggregateInput
  }

  export type NewsEventScalarWhereWithAggregatesInput = {
    AND?: NewsEventScalarWhereWithAggregatesInput | NewsEventScalarWhereWithAggregatesInput[]
    OR?: NewsEventScalarWhereWithAggregatesInput[]
    NOT?: NewsEventScalarWhereWithAggregatesInput | NewsEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NewsEvent"> | string
    sessionDate?: DateTimeWithAggregatesFilter<"NewsEvent"> | Date | string
    symbol?: StringNullableWithAggregatesFilter<"NewsEvent"> | string | null
    headline?: StringWithAggregatesFilter<"NewsEvent"> | string
    source?: StringNullableWithAggregatesFilter<"NewsEvent"> | string | null
    eventType?: EnumNewsTypeWithAggregatesFilter<"NewsEvent"> | $Enums.NewsType
    impact?: EnumNewsImpactWithAggregatesFilter<"NewsEvent"> | $Enums.NewsImpact
    notes?: StringNullableWithAggregatesFilter<"NewsEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"NewsEvent"> | Date | string
  }

  export type TradeSetupWhereInput = {
    AND?: TradeSetupWhereInput | TradeSetupWhereInput[]
    OR?: TradeSetupWhereInput[]
    NOT?: TradeSetupWhereInput | TradeSetupWhereInput[]
    id?: StringFilter<"TradeSetup"> | string
    sessionDate?: DateTimeFilter<"TradeSetup"> | Date | string
    symbol?: StringFilter<"TradeSetup"> | string
    direction?: EnumDirectionFilter<"TradeSetup"> | $Enums.Direction
    priceTier?: EnumPriceTierNullableFilter<"TradeSetup"> | $Enums.PriceTier | null
    marketCapTier?: EnumMarketCapTierNullableFilter<"TradeSetup"> | $Enums.MarketCapTier | null
    strategy?: StringNullableFilter<"TradeSetup"> | string | null
    strategyId?: StringNullableFilter<"TradeSetup"> | string | null
    setupLogic?: StringNullableFilter<"TradeSetup"> | string | null
    newsType?: EnumNewsTypeNullableFilter<"TradeSetup"> | $Enums.NewsType | null
    newsImpact?: EnumNewsImpactNullableFilter<"TradeSetup"> | $Enums.NewsImpact | null
    newsHeadline?: StringNullableFilter<"TradeSetup"> | string | null
    newsCatalogId?: StringNullableFilter<"TradeSetup"> | string | null
    entryCondition?: StringNullableFilter<"TradeSetup"> | string | null
    entryPriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    entryPriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    stopCondition?: StringNullableFilter<"TradeSetup"> | string | null
    stopPriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    stopPriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    target1Condition?: StringNullableFilter<"TradeSetup"> | string | null
    target1PriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    target1PriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    target2Condition?: StringNullableFilter<"TradeSetup"> | string | null
    target2PriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    target2PriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    plannedRiskReward?: FloatNullableFilter<"TradeSetup"> | number | null
    plannedSize?: IntNullableFilter<"TradeSetup"> | number | null
    status?: EnumSetupStatusFilter<"TradeSetup"> | $Enums.SetupStatus
    missedReason?: EnumMissedReasonNullableFilter<"TradeSetup"> | $Enums.MissedReason | null
    missedNotes?: StringNullableFilter<"TradeSetup"> | string | null
    missedHypoPnL?: FloatNullableFilter<"TradeSetup"> | number | null
    stockSelectionAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    stockSelectionNote?: StringNullableFilter<"TradeSetup"> | string | null
    analysisAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    analysisAccurateNote?: StringNullableFilter<"TradeSetup"> | string | null
    marketJudgmentAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    marketJudgmentNote?: StringNullableFilter<"TradeSetup"> | string | null
    strategySelectionAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    strategySelectionNote?: StringNullableFilter<"TradeSetup"> | string | null
    entryOpportunityAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    entryOpportunityNote?: StringNullableFilter<"TradeSetup"> | string | null
    exitOpportunityAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    exitOpportunityNote?: StringNullableFilter<"TradeSetup"> | string | null
    actualEntryOpportunity?: StringNullableFilter<"TradeSetup"> | string | null
    actualExitOpportunity?: StringNullableFilter<"TradeSetup"> | string | null
    dailySummary?: StringNullableFilter<"TradeSetup"> | string | null
    selectedTradeTypes?: StringFilter<"TradeSetup"> | string
    setupGrade?: EnumGradeNullableFilter<"TradeSetup"> | $Enums.Grade | null
    setupNotes?: StringNullableFilter<"TradeSetup"> | string | null
    createdAt?: DateTimeFilter<"TradeSetup"> | Date | string
    updatedAt?: DateTimeFilter<"TradeSetup"> | Date | string
    session?: XOR<DailySessionScalarRelationFilter, DailySessionWhereInput>
    strategyRef?: XOR<StrategyNullableScalarRelationFilter, StrategyWhereInput> | null
    newsEvents?: NewsEventListRelationFilter
    newsCatalogRef?: XOR<NewsCatalogNullableScalarRelationFilter, NewsCatalogWhereInput> | null
    executions?: ExecutionListRelationFilter
    screenshots?: ScreenshotListRelationFilter
  }

  export type TradeSetupOrderByWithRelationInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    direction?: SortOrder
    priceTier?: SortOrderInput | SortOrder
    marketCapTier?: SortOrderInput | SortOrder
    strategy?: SortOrderInput | SortOrder
    strategyId?: SortOrderInput | SortOrder
    setupLogic?: SortOrderInput | SortOrder
    newsType?: SortOrderInput | SortOrder
    newsImpact?: SortOrderInput | SortOrder
    newsHeadline?: SortOrderInput | SortOrder
    newsCatalogId?: SortOrderInput | SortOrder
    entryCondition?: SortOrderInput | SortOrder
    entryPriceNote?: SortOrderInput | SortOrder
    entryPriceExact?: SortOrderInput | SortOrder
    stopCondition?: SortOrderInput | SortOrder
    stopPriceNote?: SortOrderInput | SortOrder
    stopPriceExact?: SortOrderInput | SortOrder
    target1Condition?: SortOrderInput | SortOrder
    target1PriceNote?: SortOrderInput | SortOrder
    target1PriceExact?: SortOrderInput | SortOrder
    target2Condition?: SortOrderInput | SortOrder
    target2PriceNote?: SortOrderInput | SortOrder
    target2PriceExact?: SortOrderInput | SortOrder
    plannedRiskReward?: SortOrderInput | SortOrder
    plannedSize?: SortOrderInput | SortOrder
    status?: SortOrder
    missedReason?: SortOrderInput | SortOrder
    missedNotes?: SortOrderInput | SortOrder
    missedHypoPnL?: SortOrderInput | SortOrder
    stockSelectionAccurate?: SortOrderInput | SortOrder
    stockSelectionNote?: SortOrderInput | SortOrder
    analysisAccurate?: SortOrderInput | SortOrder
    analysisAccurateNote?: SortOrderInput | SortOrder
    marketJudgmentAccurate?: SortOrderInput | SortOrder
    marketJudgmentNote?: SortOrderInput | SortOrder
    strategySelectionAccurate?: SortOrderInput | SortOrder
    strategySelectionNote?: SortOrderInput | SortOrder
    entryOpportunityAccurate?: SortOrderInput | SortOrder
    entryOpportunityNote?: SortOrderInput | SortOrder
    exitOpportunityAccurate?: SortOrderInput | SortOrder
    exitOpportunityNote?: SortOrderInput | SortOrder
    actualEntryOpportunity?: SortOrderInput | SortOrder
    actualExitOpportunity?: SortOrderInput | SortOrder
    dailySummary?: SortOrderInput | SortOrder
    selectedTradeTypes?: SortOrder
    setupGrade?: SortOrderInput | SortOrder
    setupNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: DailySessionOrderByWithRelationInput
    strategyRef?: StrategyOrderByWithRelationInput
    newsEvents?: NewsEventOrderByRelationAggregateInput
    newsCatalogRef?: NewsCatalogOrderByWithRelationInput
    executions?: ExecutionOrderByRelationAggregateInput
    screenshots?: ScreenshotOrderByRelationAggregateInput
  }

  export type TradeSetupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradeSetupWhereInput | TradeSetupWhereInput[]
    OR?: TradeSetupWhereInput[]
    NOT?: TradeSetupWhereInput | TradeSetupWhereInput[]
    sessionDate?: DateTimeFilter<"TradeSetup"> | Date | string
    symbol?: StringFilter<"TradeSetup"> | string
    direction?: EnumDirectionFilter<"TradeSetup"> | $Enums.Direction
    priceTier?: EnumPriceTierNullableFilter<"TradeSetup"> | $Enums.PriceTier | null
    marketCapTier?: EnumMarketCapTierNullableFilter<"TradeSetup"> | $Enums.MarketCapTier | null
    strategy?: StringNullableFilter<"TradeSetup"> | string | null
    strategyId?: StringNullableFilter<"TradeSetup"> | string | null
    setupLogic?: StringNullableFilter<"TradeSetup"> | string | null
    newsType?: EnumNewsTypeNullableFilter<"TradeSetup"> | $Enums.NewsType | null
    newsImpact?: EnumNewsImpactNullableFilter<"TradeSetup"> | $Enums.NewsImpact | null
    newsHeadline?: StringNullableFilter<"TradeSetup"> | string | null
    newsCatalogId?: StringNullableFilter<"TradeSetup"> | string | null
    entryCondition?: StringNullableFilter<"TradeSetup"> | string | null
    entryPriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    entryPriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    stopCondition?: StringNullableFilter<"TradeSetup"> | string | null
    stopPriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    stopPriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    target1Condition?: StringNullableFilter<"TradeSetup"> | string | null
    target1PriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    target1PriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    target2Condition?: StringNullableFilter<"TradeSetup"> | string | null
    target2PriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    target2PriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    plannedRiskReward?: FloatNullableFilter<"TradeSetup"> | number | null
    plannedSize?: IntNullableFilter<"TradeSetup"> | number | null
    status?: EnumSetupStatusFilter<"TradeSetup"> | $Enums.SetupStatus
    missedReason?: EnumMissedReasonNullableFilter<"TradeSetup"> | $Enums.MissedReason | null
    missedNotes?: StringNullableFilter<"TradeSetup"> | string | null
    missedHypoPnL?: FloatNullableFilter<"TradeSetup"> | number | null
    stockSelectionAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    stockSelectionNote?: StringNullableFilter<"TradeSetup"> | string | null
    analysisAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    analysisAccurateNote?: StringNullableFilter<"TradeSetup"> | string | null
    marketJudgmentAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    marketJudgmentNote?: StringNullableFilter<"TradeSetup"> | string | null
    strategySelectionAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    strategySelectionNote?: StringNullableFilter<"TradeSetup"> | string | null
    entryOpportunityAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    entryOpportunityNote?: StringNullableFilter<"TradeSetup"> | string | null
    exitOpportunityAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    exitOpportunityNote?: StringNullableFilter<"TradeSetup"> | string | null
    actualEntryOpportunity?: StringNullableFilter<"TradeSetup"> | string | null
    actualExitOpportunity?: StringNullableFilter<"TradeSetup"> | string | null
    dailySummary?: StringNullableFilter<"TradeSetup"> | string | null
    selectedTradeTypes?: StringFilter<"TradeSetup"> | string
    setupGrade?: EnumGradeNullableFilter<"TradeSetup"> | $Enums.Grade | null
    setupNotes?: StringNullableFilter<"TradeSetup"> | string | null
    createdAt?: DateTimeFilter<"TradeSetup"> | Date | string
    updatedAt?: DateTimeFilter<"TradeSetup"> | Date | string
    session?: XOR<DailySessionScalarRelationFilter, DailySessionWhereInput>
    strategyRef?: XOR<StrategyNullableScalarRelationFilter, StrategyWhereInput> | null
    newsEvents?: NewsEventListRelationFilter
    newsCatalogRef?: XOR<NewsCatalogNullableScalarRelationFilter, NewsCatalogWhereInput> | null
    executions?: ExecutionListRelationFilter
    screenshots?: ScreenshotListRelationFilter
  }, "id">

  export type TradeSetupOrderByWithAggregationInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    direction?: SortOrder
    priceTier?: SortOrderInput | SortOrder
    marketCapTier?: SortOrderInput | SortOrder
    strategy?: SortOrderInput | SortOrder
    strategyId?: SortOrderInput | SortOrder
    setupLogic?: SortOrderInput | SortOrder
    newsType?: SortOrderInput | SortOrder
    newsImpact?: SortOrderInput | SortOrder
    newsHeadline?: SortOrderInput | SortOrder
    newsCatalogId?: SortOrderInput | SortOrder
    entryCondition?: SortOrderInput | SortOrder
    entryPriceNote?: SortOrderInput | SortOrder
    entryPriceExact?: SortOrderInput | SortOrder
    stopCondition?: SortOrderInput | SortOrder
    stopPriceNote?: SortOrderInput | SortOrder
    stopPriceExact?: SortOrderInput | SortOrder
    target1Condition?: SortOrderInput | SortOrder
    target1PriceNote?: SortOrderInput | SortOrder
    target1PriceExact?: SortOrderInput | SortOrder
    target2Condition?: SortOrderInput | SortOrder
    target2PriceNote?: SortOrderInput | SortOrder
    target2PriceExact?: SortOrderInput | SortOrder
    plannedRiskReward?: SortOrderInput | SortOrder
    plannedSize?: SortOrderInput | SortOrder
    status?: SortOrder
    missedReason?: SortOrderInput | SortOrder
    missedNotes?: SortOrderInput | SortOrder
    missedHypoPnL?: SortOrderInput | SortOrder
    stockSelectionAccurate?: SortOrderInput | SortOrder
    stockSelectionNote?: SortOrderInput | SortOrder
    analysisAccurate?: SortOrderInput | SortOrder
    analysisAccurateNote?: SortOrderInput | SortOrder
    marketJudgmentAccurate?: SortOrderInput | SortOrder
    marketJudgmentNote?: SortOrderInput | SortOrder
    strategySelectionAccurate?: SortOrderInput | SortOrder
    strategySelectionNote?: SortOrderInput | SortOrder
    entryOpportunityAccurate?: SortOrderInput | SortOrder
    entryOpportunityNote?: SortOrderInput | SortOrder
    exitOpportunityAccurate?: SortOrderInput | SortOrder
    exitOpportunityNote?: SortOrderInput | SortOrder
    actualEntryOpportunity?: SortOrderInput | SortOrder
    actualExitOpportunity?: SortOrderInput | SortOrder
    dailySummary?: SortOrderInput | SortOrder
    selectedTradeTypes?: SortOrder
    setupGrade?: SortOrderInput | SortOrder
    setupNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradeSetupCountOrderByAggregateInput
    _avg?: TradeSetupAvgOrderByAggregateInput
    _max?: TradeSetupMaxOrderByAggregateInput
    _min?: TradeSetupMinOrderByAggregateInput
    _sum?: TradeSetupSumOrderByAggregateInput
  }

  export type TradeSetupScalarWhereWithAggregatesInput = {
    AND?: TradeSetupScalarWhereWithAggregatesInput | TradeSetupScalarWhereWithAggregatesInput[]
    OR?: TradeSetupScalarWhereWithAggregatesInput[]
    NOT?: TradeSetupScalarWhereWithAggregatesInput | TradeSetupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradeSetup"> | string
    sessionDate?: DateTimeWithAggregatesFilter<"TradeSetup"> | Date | string
    symbol?: StringWithAggregatesFilter<"TradeSetup"> | string
    direction?: EnumDirectionWithAggregatesFilter<"TradeSetup"> | $Enums.Direction
    priceTier?: EnumPriceTierNullableWithAggregatesFilter<"TradeSetup"> | $Enums.PriceTier | null
    marketCapTier?: EnumMarketCapTierNullableWithAggregatesFilter<"TradeSetup"> | $Enums.MarketCapTier | null
    strategy?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    strategyId?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    setupLogic?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    newsType?: EnumNewsTypeNullableWithAggregatesFilter<"TradeSetup"> | $Enums.NewsType | null
    newsImpact?: EnumNewsImpactNullableWithAggregatesFilter<"TradeSetup"> | $Enums.NewsImpact | null
    newsHeadline?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    newsCatalogId?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    entryCondition?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    entryPriceNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    entryPriceExact?: FloatNullableWithAggregatesFilter<"TradeSetup"> | number | null
    stopCondition?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    stopPriceNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    stopPriceExact?: FloatNullableWithAggregatesFilter<"TradeSetup"> | number | null
    target1Condition?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    target1PriceNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    target1PriceExact?: FloatNullableWithAggregatesFilter<"TradeSetup"> | number | null
    target2Condition?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    target2PriceNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    target2PriceExact?: FloatNullableWithAggregatesFilter<"TradeSetup"> | number | null
    plannedRiskReward?: FloatNullableWithAggregatesFilter<"TradeSetup"> | number | null
    plannedSize?: IntNullableWithAggregatesFilter<"TradeSetup"> | number | null
    status?: EnumSetupStatusWithAggregatesFilter<"TradeSetup"> | $Enums.SetupStatus
    missedReason?: EnumMissedReasonNullableWithAggregatesFilter<"TradeSetup"> | $Enums.MissedReason | null
    missedNotes?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    missedHypoPnL?: FloatNullableWithAggregatesFilter<"TradeSetup"> | number | null
    stockSelectionAccurate?: BoolNullableWithAggregatesFilter<"TradeSetup"> | boolean | null
    stockSelectionNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    analysisAccurate?: BoolNullableWithAggregatesFilter<"TradeSetup"> | boolean | null
    analysisAccurateNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    marketJudgmentAccurate?: BoolNullableWithAggregatesFilter<"TradeSetup"> | boolean | null
    marketJudgmentNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    strategySelectionAccurate?: BoolNullableWithAggregatesFilter<"TradeSetup"> | boolean | null
    strategySelectionNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    entryOpportunityAccurate?: BoolNullableWithAggregatesFilter<"TradeSetup"> | boolean | null
    entryOpportunityNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    exitOpportunityAccurate?: BoolNullableWithAggregatesFilter<"TradeSetup"> | boolean | null
    exitOpportunityNote?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    actualEntryOpportunity?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    actualExitOpportunity?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    dailySummary?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    selectedTradeTypes?: StringWithAggregatesFilter<"TradeSetup"> | string
    setupGrade?: EnumGradeNullableWithAggregatesFilter<"TradeSetup"> | $Enums.Grade | null
    setupNotes?: StringNullableWithAggregatesFilter<"TradeSetup"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TradeSetup"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradeSetup"> | Date | string
  }

  export type ExecutionWhereInput = {
    AND?: ExecutionWhereInput | ExecutionWhereInput[]
    OR?: ExecutionWhereInput[]
    NOT?: ExecutionWhereInput | ExecutionWhereInput[]
    id?: StringFilter<"Execution"> | string
    setupId?: StringFilter<"Execution"> | string
    entryPrice?: FloatFilter<"Execution"> | number
    exitPrice?: FloatNullableFilter<"Execution"> | number | null
    quantity?: IntFilter<"Execution"> | number
    entryTime?: DateTimeFilter<"Execution"> | Date | string
    exitTime?: DateTimeNullableFilter<"Execution"> | Date | string | null
    commission?: FloatFilter<"Execution"> | number
    pnl?: FloatNullableFilter<"Execution"> | number | null
    actualDirection?: EnumDirectionNullableFilter<"Execution"> | $Enums.Direction | null
    entryConditionMet?: BoolNullableFilter<"Execution"> | boolean | null
    entryConditionNotes?: StringNullableFilter<"Execution"> | string | null
    exitConditionMet?: BoolNullableFilter<"Execution"> | boolean | null
    exitConditionNotes?: StringNullableFilter<"Execution"> | string | null
    executionGrade?: EnumGradeNullableFilter<"Execution"> | $Enums.Grade | null
    executionNotes?: StringNullableFilter<"Execution"> | string | null
    createdAt?: DateTimeFilter<"Execution"> | Date | string
    setup?: XOR<TradeSetupScalarRelationFilter, TradeSetupWhereInput>
    screenshots?: ScreenshotListRelationFilter
  }

  export type ExecutionOrderByWithRelationInput = {
    id?: SortOrder
    setupId?: SortOrder
    entryPrice?: SortOrder
    exitPrice?: SortOrderInput | SortOrder
    quantity?: SortOrder
    entryTime?: SortOrder
    exitTime?: SortOrderInput | SortOrder
    commission?: SortOrder
    pnl?: SortOrderInput | SortOrder
    actualDirection?: SortOrderInput | SortOrder
    entryConditionMet?: SortOrderInput | SortOrder
    entryConditionNotes?: SortOrderInput | SortOrder
    exitConditionMet?: SortOrderInput | SortOrder
    exitConditionNotes?: SortOrderInput | SortOrder
    executionGrade?: SortOrderInput | SortOrder
    executionNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    setup?: TradeSetupOrderByWithRelationInput
    screenshots?: ScreenshotOrderByRelationAggregateInput
  }

  export type ExecutionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExecutionWhereInput | ExecutionWhereInput[]
    OR?: ExecutionWhereInput[]
    NOT?: ExecutionWhereInput | ExecutionWhereInput[]
    setupId?: StringFilter<"Execution"> | string
    entryPrice?: FloatFilter<"Execution"> | number
    exitPrice?: FloatNullableFilter<"Execution"> | number | null
    quantity?: IntFilter<"Execution"> | number
    entryTime?: DateTimeFilter<"Execution"> | Date | string
    exitTime?: DateTimeNullableFilter<"Execution"> | Date | string | null
    commission?: FloatFilter<"Execution"> | number
    pnl?: FloatNullableFilter<"Execution"> | number | null
    actualDirection?: EnumDirectionNullableFilter<"Execution"> | $Enums.Direction | null
    entryConditionMet?: BoolNullableFilter<"Execution"> | boolean | null
    entryConditionNotes?: StringNullableFilter<"Execution"> | string | null
    exitConditionMet?: BoolNullableFilter<"Execution"> | boolean | null
    exitConditionNotes?: StringNullableFilter<"Execution"> | string | null
    executionGrade?: EnumGradeNullableFilter<"Execution"> | $Enums.Grade | null
    executionNotes?: StringNullableFilter<"Execution"> | string | null
    createdAt?: DateTimeFilter<"Execution"> | Date | string
    setup?: XOR<TradeSetupScalarRelationFilter, TradeSetupWhereInput>
    screenshots?: ScreenshotListRelationFilter
  }, "id">

  export type ExecutionOrderByWithAggregationInput = {
    id?: SortOrder
    setupId?: SortOrder
    entryPrice?: SortOrder
    exitPrice?: SortOrderInput | SortOrder
    quantity?: SortOrder
    entryTime?: SortOrder
    exitTime?: SortOrderInput | SortOrder
    commission?: SortOrder
    pnl?: SortOrderInput | SortOrder
    actualDirection?: SortOrderInput | SortOrder
    entryConditionMet?: SortOrderInput | SortOrder
    entryConditionNotes?: SortOrderInput | SortOrder
    exitConditionMet?: SortOrderInput | SortOrder
    exitConditionNotes?: SortOrderInput | SortOrder
    executionGrade?: SortOrderInput | SortOrder
    executionNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ExecutionCountOrderByAggregateInput
    _avg?: ExecutionAvgOrderByAggregateInput
    _max?: ExecutionMaxOrderByAggregateInput
    _min?: ExecutionMinOrderByAggregateInput
    _sum?: ExecutionSumOrderByAggregateInput
  }

  export type ExecutionScalarWhereWithAggregatesInput = {
    AND?: ExecutionScalarWhereWithAggregatesInput | ExecutionScalarWhereWithAggregatesInput[]
    OR?: ExecutionScalarWhereWithAggregatesInput[]
    NOT?: ExecutionScalarWhereWithAggregatesInput | ExecutionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Execution"> | string
    setupId?: StringWithAggregatesFilter<"Execution"> | string
    entryPrice?: FloatWithAggregatesFilter<"Execution"> | number
    exitPrice?: FloatNullableWithAggregatesFilter<"Execution"> | number | null
    quantity?: IntWithAggregatesFilter<"Execution"> | number
    entryTime?: DateTimeWithAggregatesFilter<"Execution"> | Date | string
    exitTime?: DateTimeNullableWithAggregatesFilter<"Execution"> | Date | string | null
    commission?: FloatWithAggregatesFilter<"Execution"> | number
    pnl?: FloatNullableWithAggregatesFilter<"Execution"> | number | null
    actualDirection?: EnumDirectionNullableWithAggregatesFilter<"Execution"> | $Enums.Direction | null
    entryConditionMet?: BoolNullableWithAggregatesFilter<"Execution"> | boolean | null
    entryConditionNotes?: StringNullableWithAggregatesFilter<"Execution"> | string | null
    exitConditionMet?: BoolNullableWithAggregatesFilter<"Execution"> | boolean | null
    exitConditionNotes?: StringNullableWithAggregatesFilter<"Execution"> | string | null
    executionGrade?: EnumGradeNullableWithAggregatesFilter<"Execution"> | $Enums.Grade | null
    executionNotes?: StringNullableWithAggregatesFilter<"Execution"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Execution"> | Date | string
  }

  export type ScreenshotWhereInput = {
    AND?: ScreenshotWhereInput | ScreenshotWhereInput[]
    OR?: ScreenshotWhereInput[]
    NOT?: ScreenshotWhereInput | ScreenshotWhereInput[]
    id?: StringFilter<"Screenshot"> | string
    filename?: StringFilter<"Screenshot"> | string
    originalName?: StringFilter<"Screenshot"> | string
    filePath?: StringFilter<"Screenshot"> | string
    fileSize?: IntFilter<"Screenshot"> | number
    mimeType?: StringFilter<"Screenshot"> | string
    caption?: StringNullableFilter<"Screenshot"> | string | null
    timeframe?: StringNullableFilter<"Screenshot"> | string | null
    chartTag?: EnumChartTagNullableFilter<"Screenshot"> | $Enums.ChartTag | null
    setupId?: StringNullableFilter<"Screenshot"> | string | null
    executionId?: StringNullableFilter<"Screenshot"> | string | null
    sessionDate?: DateTimeNullableFilter<"Screenshot"> | Date | string | null
    takenAt?: DateTimeNullableFilter<"Screenshot"> | Date | string | null
    createdAt?: DateTimeFilter<"Screenshot"> | Date | string
    setup?: XOR<TradeSetupNullableScalarRelationFilter, TradeSetupWhereInput> | null
    execution?: XOR<ExecutionNullableScalarRelationFilter, ExecutionWhereInput> | null
    session?: XOR<DailySessionNullableScalarRelationFilter, DailySessionWhereInput> | null
  }

  export type ScreenshotOrderByWithRelationInput = {
    id?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    caption?: SortOrderInput | SortOrder
    timeframe?: SortOrderInput | SortOrder
    chartTag?: SortOrderInput | SortOrder
    setupId?: SortOrderInput | SortOrder
    executionId?: SortOrderInput | SortOrder
    sessionDate?: SortOrderInput | SortOrder
    takenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    setup?: TradeSetupOrderByWithRelationInput
    execution?: ExecutionOrderByWithRelationInput
    session?: DailySessionOrderByWithRelationInput
  }

  export type ScreenshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScreenshotWhereInput | ScreenshotWhereInput[]
    OR?: ScreenshotWhereInput[]
    NOT?: ScreenshotWhereInput | ScreenshotWhereInput[]
    filename?: StringFilter<"Screenshot"> | string
    originalName?: StringFilter<"Screenshot"> | string
    filePath?: StringFilter<"Screenshot"> | string
    fileSize?: IntFilter<"Screenshot"> | number
    mimeType?: StringFilter<"Screenshot"> | string
    caption?: StringNullableFilter<"Screenshot"> | string | null
    timeframe?: StringNullableFilter<"Screenshot"> | string | null
    chartTag?: EnumChartTagNullableFilter<"Screenshot"> | $Enums.ChartTag | null
    setupId?: StringNullableFilter<"Screenshot"> | string | null
    executionId?: StringNullableFilter<"Screenshot"> | string | null
    sessionDate?: DateTimeNullableFilter<"Screenshot"> | Date | string | null
    takenAt?: DateTimeNullableFilter<"Screenshot"> | Date | string | null
    createdAt?: DateTimeFilter<"Screenshot"> | Date | string
    setup?: XOR<TradeSetupNullableScalarRelationFilter, TradeSetupWhereInput> | null
    execution?: XOR<ExecutionNullableScalarRelationFilter, ExecutionWhereInput> | null
    session?: XOR<DailySessionNullableScalarRelationFilter, DailySessionWhereInput> | null
  }, "id">

  export type ScreenshotOrderByWithAggregationInput = {
    id?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    caption?: SortOrderInput | SortOrder
    timeframe?: SortOrderInput | SortOrder
    chartTag?: SortOrderInput | SortOrder
    setupId?: SortOrderInput | SortOrder
    executionId?: SortOrderInput | SortOrder
    sessionDate?: SortOrderInput | SortOrder
    takenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ScreenshotCountOrderByAggregateInput
    _avg?: ScreenshotAvgOrderByAggregateInput
    _max?: ScreenshotMaxOrderByAggregateInput
    _min?: ScreenshotMinOrderByAggregateInput
    _sum?: ScreenshotSumOrderByAggregateInput
  }

  export type ScreenshotScalarWhereWithAggregatesInput = {
    AND?: ScreenshotScalarWhereWithAggregatesInput | ScreenshotScalarWhereWithAggregatesInput[]
    OR?: ScreenshotScalarWhereWithAggregatesInput[]
    NOT?: ScreenshotScalarWhereWithAggregatesInput | ScreenshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Screenshot"> | string
    filename?: StringWithAggregatesFilter<"Screenshot"> | string
    originalName?: StringWithAggregatesFilter<"Screenshot"> | string
    filePath?: StringWithAggregatesFilter<"Screenshot"> | string
    fileSize?: IntWithAggregatesFilter<"Screenshot"> | number
    mimeType?: StringWithAggregatesFilter<"Screenshot"> | string
    caption?: StringNullableWithAggregatesFilter<"Screenshot"> | string | null
    timeframe?: StringNullableWithAggregatesFilter<"Screenshot"> | string | null
    chartTag?: EnumChartTagNullableWithAggregatesFilter<"Screenshot"> | $Enums.ChartTag | null
    setupId?: StringNullableWithAggregatesFilter<"Screenshot"> | string | null
    executionId?: StringNullableWithAggregatesFilter<"Screenshot"> | string | null
    sessionDate?: DateTimeNullableWithAggregatesFilter<"Screenshot"> | Date | string | null
    takenAt?: DateTimeNullableWithAggregatesFilter<"Screenshot"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Screenshot"> | Date | string
  }

  export type NewsCatalogCreateInput = {
    id?: string
    name: string
    category: string
    subCategory?: string | null
    strength: $Enums.NewsStrength
    description?: string | null
    entryConditions?: string | null
    riskFactors?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupCreateNestedManyWithoutNewsCatalogRefInput
  }

  export type NewsCatalogUncheckedCreateInput = {
    id?: string
    name: string
    category: string
    subCategory?: string | null
    strength: $Enums.NewsStrength
    description?: string | null
    entryConditions?: string | null
    riskFactors?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupUncheckedCreateNestedManyWithoutNewsCatalogRefInput
  }

  export type NewsCatalogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subCategory?: NullableStringFieldUpdateOperationsInput | string | null
    strength?: EnumNewsStrengthFieldUpdateOperationsInput | $Enums.NewsStrength
    description?: NullableStringFieldUpdateOperationsInput | string | null
    entryConditions?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUpdateManyWithoutNewsCatalogRefNestedInput
  }

  export type NewsCatalogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subCategory?: NullableStringFieldUpdateOperationsInput | string | null
    strength?: EnumNewsStrengthFieldUpdateOperationsInput | $Enums.NewsStrength
    description?: NullableStringFieldUpdateOperationsInput | string | null
    entryConditions?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUncheckedUpdateManyWithoutNewsCatalogRefNestedInput
  }

  export type NewsCatalogCreateManyInput = {
    id?: string
    name: string
    category: string
    subCategory?: string | null
    strength: $Enums.NewsStrength
    description?: string | null
    entryConditions?: string | null
    riskFactors?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NewsCatalogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subCategory?: NullableStringFieldUpdateOperationsInput | string | null
    strength?: EnumNewsStrengthFieldUpdateOperationsInput | $Enums.NewsStrength
    description?: NullableStringFieldUpdateOperationsInput | string | null
    entryConditions?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsCatalogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subCategory?: NullableStringFieldUpdateOperationsInput | string | null
    strength?: EnumNewsStrengthFieldUpdateOperationsInput | $Enums.NewsStrength
    description?: NullableStringFieldUpdateOperationsInput | string | null
    entryConditions?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyCreateInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupCreateNestedManyWithoutStrategyRefInput
    tradeTypes?: TradeTypeCreateNestedManyWithoutStrategyInput
  }

  export type StrategyUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupUncheckedCreateNestedManyWithoutStrategyRefInput
    tradeTypes?: TradeTypeUncheckedCreateNestedManyWithoutStrategyInput
  }

  export type StrategyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUpdateManyWithoutStrategyRefNestedInput
    tradeTypes?: TradeTypeUpdateManyWithoutStrategyNestedInput
  }

  export type StrategyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUncheckedUpdateManyWithoutStrategyRefNestedInput
    tradeTypes?: TradeTypeUncheckedUpdateManyWithoutStrategyNestedInput
  }

  export type StrategyCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StrategyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeTypeCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    strategy: StrategyCreateNestedOneWithoutTradeTypesInput
  }

  export type TradeTypeUncheckedCreateInput = {
    id?: string
    name: string
    strategyId: string
    createdAt?: Date | string
  }

  export type TradeTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    strategy?: StrategyUpdateOneRequiredWithoutTradeTypesNestedInput
  }

  export type TradeTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeTypeCreateManyInput = {
    id?: string
    name: string
    strategyId: string
    createdAt?: Date | string
  }

  export type TradeTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailySessionCreateInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventCreateNestedManyWithoutSessionInput
    setups?: TradeSetupCreateNestedManyWithoutSessionInput
    screenshots?: ScreenshotCreateNestedManyWithoutSessionInput
  }

  export type DailySessionUncheckedCreateInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSessionInput
    setups?: TradeSetupUncheckedCreateNestedManyWithoutSessionInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSessionInput
  }

  export type DailySessionUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUpdateManyWithoutSessionNestedInput
    setups?: TradeSetupUpdateManyWithoutSessionNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSessionNestedInput
  }

  export type DailySessionUncheckedUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSessionNestedInput
    setups?: TradeSetupUncheckedUpdateManyWithoutSessionNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type DailySessionCreateManyInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailySessionUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailySessionUncheckedUpdateManyInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventCreateInput = {
    id?: string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
    session: DailySessionCreateNestedOneWithoutNewsEventsInput
    setups?: TradeSetupCreateNestedManyWithoutNewsEventsInput
  }

  export type NewsEventUncheckedCreateInput = {
    id?: string
    sessionDate: Date | string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
    setups?: TradeSetupUncheckedCreateNestedManyWithoutNewsEventsInput
  }

  export type NewsEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutNewsEventsNestedInput
    setups?: TradeSetupUpdateManyWithoutNewsEventsNestedInput
  }

  export type NewsEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUncheckedUpdateManyWithoutNewsEventsNestedInput
  }

  export type NewsEventCreateManyInput = {
    id?: string
    sessionDate: Date | string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
  }

  export type NewsEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeSetupCreateInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: DailySessionCreateNestedOneWithoutSetupsInput
    strategyRef?: StrategyCreateNestedOneWithoutSetupsInput
    newsEvents?: NewsEventCreateNestedManyWithoutSetupsInput
    newsCatalogRef?: NewsCatalogCreateNestedOneWithoutSetupsInput
    executions?: ExecutionCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSetupsInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutSetupsNestedInput
    strategyRef?: StrategyUpdateOneWithoutSetupsNestedInput
    newsEvents?: NewsEventUpdateManyWithoutSetupsNestedInput
    newsCatalogRef?: NewsCatalogUpdateOneWithoutSetupsNestedInput
    executions?: ExecutionUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSetupsNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupCreateManyInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeSetupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeSetupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionCreateInput = {
    id?: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
    setup: TradeSetupCreateNestedOneWithoutExecutionsInput
    screenshots?: ScreenshotCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUncheckedCreateInput = {
    id?: string
    setupId: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setup?: TradeSetupUpdateOneRequiredWithoutExecutionsNestedInput
    screenshots?: ScreenshotUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    setupId?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    screenshots?: ScreenshotUncheckedUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionCreateManyInput = {
    id?: string
    setupId: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
  }

  export type ExecutionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    setupId?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotCreateInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    takenAt?: Date | string | null
    createdAt?: Date | string
    setup?: TradeSetupCreateNestedOneWithoutScreenshotsInput
    execution?: ExecutionCreateNestedOneWithoutScreenshotsInput
    session?: DailySessionCreateNestedOneWithoutScreenshotsInput
  }

  export type ScreenshotUncheckedCreateInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    setupId?: string | null
    executionId?: string | null
    sessionDate?: Date | string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ScreenshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setup?: TradeSetupUpdateOneWithoutScreenshotsNestedInput
    execution?: ExecutionUpdateOneWithoutScreenshotsNestedInput
    session?: DailySessionUpdateOneWithoutScreenshotsNestedInput
  }

  export type ScreenshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    setupId?: NullableStringFieldUpdateOperationsInput | string | null
    executionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotCreateManyInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    setupId?: string | null
    executionId?: string | null
    sessionDate?: Date | string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ScreenshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    setupId?: NullableStringFieldUpdateOperationsInput | string | null
    executionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumNewsStrengthFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsStrength | EnumNewsStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.NewsStrength[]
    notIn?: $Enums.NewsStrength[]
    not?: NestedEnumNewsStrengthFilter<$PrismaModel> | $Enums.NewsStrength
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TradeSetupListRelationFilter = {
    every?: TradeSetupWhereInput
    some?: TradeSetupWhereInput
    none?: TradeSetupWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TradeSetupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NewsCatalogCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subCategory?: SortOrder
    strength?: SortOrder
    description?: SortOrder
    entryConditions?: SortOrder
    riskFactors?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewsCatalogMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subCategory?: SortOrder
    strength?: SortOrder
    description?: SortOrder
    entryConditions?: SortOrder
    riskFactors?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewsCatalogMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    subCategory?: SortOrder
    strength?: SortOrder
    description?: SortOrder
    entryConditions?: SortOrder
    riskFactors?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumNewsStrengthWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsStrength | EnumNewsStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.NewsStrength[]
    notIn?: $Enums.NewsStrength[]
    not?: NestedEnumNewsStrengthWithAggregatesFilter<$PrismaModel> | $Enums.NewsStrength
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsStrengthFilter<$PrismaModel>
    _max?: NestedEnumNewsStrengthFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type TradeTypeListRelationFilter = {
    every?: TradeTypeWhereInput
    some?: TradeTypeWhereInput
    none?: TradeTypeWhereInput
  }

  export type TradeTypeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StrategyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    mindmapData?: SortOrder
    ruleHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StrategyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    mindmapData?: SortOrder
    ruleHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StrategyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    mindmapData?: SortOrder
    ruleHistory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StrategyScalarRelationFilter = {
    is?: StrategyWhereInput
    isNot?: StrategyWhereInput
  }

  export type TradeTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    strategyId?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    strategyId?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    strategyId?: SortOrder
    createdAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NewsEventListRelationFilter = {
    every?: NewsEventWhereInput
    some?: NewsEventWhereInput
    none?: NewsEventWhereInput
  }

  export type ScreenshotListRelationFilter = {
    every?: ScreenshotWhereInput
    some?: ScreenshotWhereInput
    none?: ScreenshotWhereInput
  }

  export type NewsEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScreenshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DailySessionCountOrderByAggregateInput = {
    date?: SortOrder
    marketContext?: SortOrder
    preMarketPlan?: SortOrder
    selectedStrategy?: SortOrder
    postReview?: SortOrder
    lessonsLearned?: SortOrder
    whatWentWell?: SortOrder
    planFollowed?: SortOrder
    emotionRating?: SortOrder
    focusRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySessionAvgOrderByAggregateInput = {
    planFollowed?: SortOrder
    emotionRating?: SortOrder
    focusRating?: SortOrder
  }

  export type DailySessionMaxOrderByAggregateInput = {
    date?: SortOrder
    marketContext?: SortOrder
    preMarketPlan?: SortOrder
    selectedStrategy?: SortOrder
    postReview?: SortOrder
    lessonsLearned?: SortOrder
    whatWentWell?: SortOrder
    planFollowed?: SortOrder
    emotionRating?: SortOrder
    focusRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySessionMinOrderByAggregateInput = {
    date?: SortOrder
    marketContext?: SortOrder
    preMarketPlan?: SortOrder
    selectedStrategy?: SortOrder
    postReview?: SortOrder
    lessonsLearned?: SortOrder
    whatWentWell?: SortOrder
    planFollowed?: SortOrder
    emotionRating?: SortOrder
    focusRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailySessionSumOrderByAggregateInput = {
    planFollowed?: SortOrder
    emotionRating?: SortOrder
    focusRating?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumNewsTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsType[]
    notIn?: $Enums.NewsType[]
    not?: NestedEnumNewsTypeFilter<$PrismaModel> | $Enums.NewsType
  }

  export type EnumNewsImpactFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[]
    notIn?: $Enums.NewsImpact[]
    not?: NestedEnumNewsImpactFilter<$PrismaModel> | $Enums.NewsImpact
  }

  export type DailySessionScalarRelationFilter = {
    is?: DailySessionWhereInput
    isNot?: DailySessionWhereInput
  }

  export type NewsEventCountOrderByAggregateInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    headline?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    impact?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsEventMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    headline?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    impact?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsEventMinOrderByAggregateInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    headline?: SortOrder
    source?: SortOrder
    eventType?: SortOrder
    impact?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNewsTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsType[]
    notIn?: $Enums.NewsType[]
    not?: NestedEnumNewsTypeWithAggregatesFilter<$PrismaModel> | $Enums.NewsType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsTypeFilter<$PrismaModel>
    _max?: NestedEnumNewsTypeFilter<$PrismaModel>
  }

  export type EnumNewsImpactWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[]
    notIn?: $Enums.NewsImpact[]
    not?: NestedEnumNewsImpactWithAggregatesFilter<$PrismaModel> | $Enums.NewsImpact
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsImpactFilter<$PrismaModel>
    _max?: NestedEnumNewsImpactFilter<$PrismaModel>
  }

  export type EnumDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[]
    notIn?: $Enums.Direction[]
    not?: NestedEnumDirectionFilter<$PrismaModel> | $Enums.Direction
  }

  export type EnumPriceTierNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceTier | EnumPriceTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriceTier[] | null
    notIn?: $Enums.PriceTier[] | null
    not?: NestedEnumPriceTierNullableFilter<$PrismaModel> | $Enums.PriceTier | null
  }

  export type EnumMarketCapTierNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketCapTier | EnumMarketCapTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketCapTier[] | null
    notIn?: $Enums.MarketCapTier[] | null
    not?: NestedEnumMarketCapTierNullableFilter<$PrismaModel> | $Enums.MarketCapTier | null
  }

  export type EnumNewsTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsType[] | null
    notIn?: $Enums.NewsType[] | null
    not?: NestedEnumNewsTypeNullableFilter<$PrismaModel> | $Enums.NewsType | null
  }

  export type EnumNewsImpactNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsImpact[] | null
    notIn?: $Enums.NewsImpact[] | null
    not?: NestedEnumNewsImpactNullableFilter<$PrismaModel> | $Enums.NewsImpact | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumSetupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupStatus | EnumSetupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SetupStatus[]
    notIn?: $Enums.SetupStatus[]
    not?: NestedEnumSetupStatusFilter<$PrismaModel> | $Enums.SetupStatus
  }

  export type EnumMissedReasonNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MissedReason | EnumMissedReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissedReason[] | null
    notIn?: $Enums.MissedReason[] | null
    not?: NestedEnumMissedReasonNullableFilter<$PrismaModel> | $Enums.MissedReason | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type EnumGradeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.Grade[] | null
    notIn?: $Enums.Grade[] | null
    not?: NestedEnumGradeNullableFilter<$PrismaModel> | $Enums.Grade | null
  }

  export type StrategyNullableScalarRelationFilter = {
    is?: StrategyWhereInput | null
    isNot?: StrategyWhereInput | null
  }

  export type NewsCatalogNullableScalarRelationFilter = {
    is?: NewsCatalogWhereInput | null
    isNot?: NewsCatalogWhereInput | null
  }

  export type ExecutionListRelationFilter = {
    every?: ExecutionWhereInput
    some?: ExecutionWhereInput
    none?: ExecutionWhereInput
  }

  export type ExecutionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradeSetupCountOrderByAggregateInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    direction?: SortOrder
    priceTier?: SortOrder
    marketCapTier?: SortOrder
    strategy?: SortOrder
    strategyId?: SortOrder
    setupLogic?: SortOrder
    newsType?: SortOrder
    newsImpact?: SortOrder
    newsHeadline?: SortOrder
    newsCatalogId?: SortOrder
    entryCondition?: SortOrder
    entryPriceNote?: SortOrder
    entryPriceExact?: SortOrder
    stopCondition?: SortOrder
    stopPriceNote?: SortOrder
    stopPriceExact?: SortOrder
    target1Condition?: SortOrder
    target1PriceNote?: SortOrder
    target1PriceExact?: SortOrder
    target2Condition?: SortOrder
    target2PriceNote?: SortOrder
    target2PriceExact?: SortOrder
    plannedRiskReward?: SortOrder
    plannedSize?: SortOrder
    status?: SortOrder
    missedReason?: SortOrder
    missedNotes?: SortOrder
    missedHypoPnL?: SortOrder
    stockSelectionAccurate?: SortOrder
    stockSelectionNote?: SortOrder
    analysisAccurate?: SortOrder
    analysisAccurateNote?: SortOrder
    marketJudgmentAccurate?: SortOrder
    marketJudgmentNote?: SortOrder
    strategySelectionAccurate?: SortOrder
    strategySelectionNote?: SortOrder
    entryOpportunityAccurate?: SortOrder
    entryOpportunityNote?: SortOrder
    exitOpportunityAccurate?: SortOrder
    exitOpportunityNote?: SortOrder
    actualEntryOpportunity?: SortOrder
    actualExitOpportunity?: SortOrder
    dailySummary?: SortOrder
    selectedTradeTypes?: SortOrder
    setupGrade?: SortOrder
    setupNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeSetupAvgOrderByAggregateInput = {
    entryPriceExact?: SortOrder
    stopPriceExact?: SortOrder
    target1PriceExact?: SortOrder
    target2PriceExact?: SortOrder
    plannedRiskReward?: SortOrder
    plannedSize?: SortOrder
    missedHypoPnL?: SortOrder
  }

  export type TradeSetupMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    direction?: SortOrder
    priceTier?: SortOrder
    marketCapTier?: SortOrder
    strategy?: SortOrder
    strategyId?: SortOrder
    setupLogic?: SortOrder
    newsType?: SortOrder
    newsImpact?: SortOrder
    newsHeadline?: SortOrder
    newsCatalogId?: SortOrder
    entryCondition?: SortOrder
    entryPriceNote?: SortOrder
    entryPriceExact?: SortOrder
    stopCondition?: SortOrder
    stopPriceNote?: SortOrder
    stopPriceExact?: SortOrder
    target1Condition?: SortOrder
    target1PriceNote?: SortOrder
    target1PriceExact?: SortOrder
    target2Condition?: SortOrder
    target2PriceNote?: SortOrder
    target2PriceExact?: SortOrder
    plannedRiskReward?: SortOrder
    plannedSize?: SortOrder
    status?: SortOrder
    missedReason?: SortOrder
    missedNotes?: SortOrder
    missedHypoPnL?: SortOrder
    stockSelectionAccurate?: SortOrder
    stockSelectionNote?: SortOrder
    analysisAccurate?: SortOrder
    analysisAccurateNote?: SortOrder
    marketJudgmentAccurate?: SortOrder
    marketJudgmentNote?: SortOrder
    strategySelectionAccurate?: SortOrder
    strategySelectionNote?: SortOrder
    entryOpportunityAccurate?: SortOrder
    entryOpportunityNote?: SortOrder
    exitOpportunityAccurate?: SortOrder
    exitOpportunityNote?: SortOrder
    actualEntryOpportunity?: SortOrder
    actualExitOpportunity?: SortOrder
    dailySummary?: SortOrder
    selectedTradeTypes?: SortOrder
    setupGrade?: SortOrder
    setupNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeSetupMinOrderByAggregateInput = {
    id?: SortOrder
    sessionDate?: SortOrder
    symbol?: SortOrder
    direction?: SortOrder
    priceTier?: SortOrder
    marketCapTier?: SortOrder
    strategy?: SortOrder
    strategyId?: SortOrder
    setupLogic?: SortOrder
    newsType?: SortOrder
    newsImpact?: SortOrder
    newsHeadline?: SortOrder
    newsCatalogId?: SortOrder
    entryCondition?: SortOrder
    entryPriceNote?: SortOrder
    entryPriceExact?: SortOrder
    stopCondition?: SortOrder
    stopPriceNote?: SortOrder
    stopPriceExact?: SortOrder
    target1Condition?: SortOrder
    target1PriceNote?: SortOrder
    target1PriceExact?: SortOrder
    target2Condition?: SortOrder
    target2PriceNote?: SortOrder
    target2PriceExact?: SortOrder
    plannedRiskReward?: SortOrder
    plannedSize?: SortOrder
    status?: SortOrder
    missedReason?: SortOrder
    missedNotes?: SortOrder
    missedHypoPnL?: SortOrder
    stockSelectionAccurate?: SortOrder
    stockSelectionNote?: SortOrder
    analysisAccurate?: SortOrder
    analysisAccurateNote?: SortOrder
    marketJudgmentAccurate?: SortOrder
    marketJudgmentNote?: SortOrder
    strategySelectionAccurate?: SortOrder
    strategySelectionNote?: SortOrder
    entryOpportunityAccurate?: SortOrder
    entryOpportunityNote?: SortOrder
    exitOpportunityAccurate?: SortOrder
    exitOpportunityNote?: SortOrder
    actualEntryOpportunity?: SortOrder
    actualExitOpportunity?: SortOrder
    dailySummary?: SortOrder
    selectedTradeTypes?: SortOrder
    setupGrade?: SortOrder
    setupNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeSetupSumOrderByAggregateInput = {
    entryPriceExact?: SortOrder
    stopPriceExact?: SortOrder
    target1PriceExact?: SortOrder
    target2PriceExact?: SortOrder
    plannedRiskReward?: SortOrder
    plannedSize?: SortOrder
    missedHypoPnL?: SortOrder
  }

  export type EnumDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[]
    notIn?: $Enums.Direction[]
    not?: NestedEnumDirectionWithAggregatesFilter<$PrismaModel> | $Enums.Direction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectionFilter<$PrismaModel>
    _max?: NestedEnumDirectionFilter<$PrismaModel>
  }

  export type EnumPriceTierNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceTier | EnumPriceTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriceTier[] | null
    notIn?: $Enums.PriceTier[] | null
    not?: NestedEnumPriceTierNullableWithAggregatesFilter<$PrismaModel> | $Enums.PriceTier | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPriceTierNullableFilter<$PrismaModel>
    _max?: NestedEnumPriceTierNullableFilter<$PrismaModel>
  }

  export type EnumMarketCapTierNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketCapTier | EnumMarketCapTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketCapTier[] | null
    notIn?: $Enums.MarketCapTier[] | null
    not?: NestedEnumMarketCapTierNullableWithAggregatesFilter<$PrismaModel> | $Enums.MarketCapTier | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMarketCapTierNullableFilter<$PrismaModel>
    _max?: NestedEnumMarketCapTierNullableFilter<$PrismaModel>
  }

  export type EnumNewsTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsType[] | null
    notIn?: $Enums.NewsType[] | null
    not?: NestedEnumNewsTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.NewsType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumNewsTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumNewsTypeNullableFilter<$PrismaModel>
  }

  export type EnumNewsImpactNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsImpact[] | null
    notIn?: $Enums.NewsImpact[] | null
    not?: NestedEnumNewsImpactNullableWithAggregatesFilter<$PrismaModel> | $Enums.NewsImpact | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumNewsImpactNullableFilter<$PrismaModel>
    _max?: NestedEnumNewsImpactNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumSetupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupStatus | EnumSetupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SetupStatus[]
    notIn?: $Enums.SetupStatus[]
    not?: NestedEnumSetupStatusWithAggregatesFilter<$PrismaModel> | $Enums.SetupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSetupStatusFilter<$PrismaModel>
    _max?: NestedEnumSetupStatusFilter<$PrismaModel>
  }

  export type EnumMissedReasonNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissedReason | EnumMissedReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissedReason[] | null
    notIn?: $Enums.MissedReason[] | null
    not?: NestedEnumMissedReasonNullableWithAggregatesFilter<$PrismaModel> | $Enums.MissedReason | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMissedReasonNullableFilter<$PrismaModel>
    _max?: NestedEnumMissedReasonNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumGradeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.Grade[] | null
    notIn?: $Enums.Grade[] | null
    not?: NestedEnumGradeNullableWithAggregatesFilter<$PrismaModel> | $Enums.Grade | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGradeNullableFilter<$PrismaModel>
    _max?: NestedEnumGradeNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumDirectionNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel> | null
    in?: $Enums.Direction[] | null
    notIn?: $Enums.Direction[] | null
    not?: NestedEnumDirectionNullableFilter<$PrismaModel> | $Enums.Direction | null
  }

  export type TradeSetupScalarRelationFilter = {
    is?: TradeSetupWhereInput
    isNot?: TradeSetupWhereInput
  }

  export type ExecutionCountOrderByAggregateInput = {
    id?: SortOrder
    setupId?: SortOrder
    entryPrice?: SortOrder
    exitPrice?: SortOrder
    quantity?: SortOrder
    entryTime?: SortOrder
    exitTime?: SortOrder
    commission?: SortOrder
    pnl?: SortOrder
    actualDirection?: SortOrder
    entryConditionMet?: SortOrder
    entryConditionNotes?: SortOrder
    exitConditionMet?: SortOrder
    exitConditionNotes?: SortOrder
    executionGrade?: SortOrder
    executionNotes?: SortOrder
    createdAt?: SortOrder
  }

  export type ExecutionAvgOrderByAggregateInput = {
    entryPrice?: SortOrder
    exitPrice?: SortOrder
    quantity?: SortOrder
    commission?: SortOrder
    pnl?: SortOrder
  }

  export type ExecutionMaxOrderByAggregateInput = {
    id?: SortOrder
    setupId?: SortOrder
    entryPrice?: SortOrder
    exitPrice?: SortOrder
    quantity?: SortOrder
    entryTime?: SortOrder
    exitTime?: SortOrder
    commission?: SortOrder
    pnl?: SortOrder
    actualDirection?: SortOrder
    entryConditionMet?: SortOrder
    entryConditionNotes?: SortOrder
    exitConditionMet?: SortOrder
    exitConditionNotes?: SortOrder
    executionGrade?: SortOrder
    executionNotes?: SortOrder
    createdAt?: SortOrder
  }

  export type ExecutionMinOrderByAggregateInput = {
    id?: SortOrder
    setupId?: SortOrder
    entryPrice?: SortOrder
    exitPrice?: SortOrder
    quantity?: SortOrder
    entryTime?: SortOrder
    exitTime?: SortOrder
    commission?: SortOrder
    pnl?: SortOrder
    actualDirection?: SortOrder
    entryConditionMet?: SortOrder
    entryConditionNotes?: SortOrder
    exitConditionMet?: SortOrder
    exitConditionNotes?: SortOrder
    executionGrade?: SortOrder
    executionNotes?: SortOrder
    createdAt?: SortOrder
  }

  export type ExecutionSumOrderByAggregateInput = {
    entryPrice?: SortOrder
    exitPrice?: SortOrder
    quantity?: SortOrder
    commission?: SortOrder
    pnl?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumDirectionNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel> | null
    in?: $Enums.Direction[] | null
    notIn?: $Enums.Direction[] | null
    not?: NestedEnumDirectionNullableWithAggregatesFilter<$PrismaModel> | $Enums.Direction | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDirectionNullableFilter<$PrismaModel>
    _max?: NestedEnumDirectionNullableFilter<$PrismaModel>
  }

  export type EnumChartTagNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ChartTag | EnumChartTagFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChartTag[] | null
    notIn?: $Enums.ChartTag[] | null
    not?: NestedEnumChartTagNullableFilter<$PrismaModel> | $Enums.ChartTag | null
  }

  export type TradeSetupNullableScalarRelationFilter = {
    is?: TradeSetupWhereInput | null
    isNot?: TradeSetupWhereInput | null
  }

  export type ExecutionNullableScalarRelationFilter = {
    is?: ExecutionWhereInput | null
    isNot?: ExecutionWhereInput | null
  }

  export type DailySessionNullableScalarRelationFilter = {
    is?: DailySessionWhereInput | null
    isNot?: DailySessionWhereInput | null
  }

  export type ScreenshotCountOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    caption?: SortOrder
    timeframe?: SortOrder
    chartTag?: SortOrder
    setupId?: SortOrder
    executionId?: SortOrder
    sessionDate?: SortOrder
    takenAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ScreenshotAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type ScreenshotMaxOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    caption?: SortOrder
    timeframe?: SortOrder
    chartTag?: SortOrder
    setupId?: SortOrder
    executionId?: SortOrder
    sessionDate?: SortOrder
    takenAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ScreenshotMinOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    caption?: SortOrder
    timeframe?: SortOrder
    chartTag?: SortOrder
    setupId?: SortOrder
    executionId?: SortOrder
    sessionDate?: SortOrder
    takenAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ScreenshotSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type EnumChartTagNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChartTag | EnumChartTagFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChartTag[] | null
    notIn?: $Enums.ChartTag[] | null
    not?: NestedEnumChartTagNullableWithAggregatesFilter<$PrismaModel> | $Enums.ChartTag | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumChartTagNullableFilter<$PrismaModel>
    _max?: NestedEnumChartTagNullableFilter<$PrismaModel>
  }

  export type TradeSetupCreateNestedManyWithoutNewsCatalogRefInput = {
    create?: XOR<TradeSetupCreateWithoutNewsCatalogRefInput, TradeSetupUncheckedCreateWithoutNewsCatalogRefInput> | TradeSetupCreateWithoutNewsCatalogRefInput[] | TradeSetupUncheckedCreateWithoutNewsCatalogRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsCatalogRefInput | TradeSetupCreateOrConnectWithoutNewsCatalogRefInput[]
    createMany?: TradeSetupCreateManyNewsCatalogRefInputEnvelope
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type TradeSetupUncheckedCreateNestedManyWithoutNewsCatalogRefInput = {
    create?: XOR<TradeSetupCreateWithoutNewsCatalogRefInput, TradeSetupUncheckedCreateWithoutNewsCatalogRefInput> | TradeSetupCreateWithoutNewsCatalogRefInput[] | TradeSetupUncheckedCreateWithoutNewsCatalogRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsCatalogRefInput | TradeSetupCreateOrConnectWithoutNewsCatalogRefInput[]
    createMany?: TradeSetupCreateManyNewsCatalogRefInputEnvelope
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumNewsStrengthFieldUpdateOperationsInput = {
    set?: $Enums.NewsStrength
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TradeSetupUpdateManyWithoutNewsCatalogRefNestedInput = {
    create?: XOR<TradeSetupCreateWithoutNewsCatalogRefInput, TradeSetupUncheckedCreateWithoutNewsCatalogRefInput> | TradeSetupCreateWithoutNewsCatalogRefInput[] | TradeSetupUncheckedCreateWithoutNewsCatalogRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsCatalogRefInput | TradeSetupCreateOrConnectWithoutNewsCatalogRefInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutNewsCatalogRefInput | TradeSetupUpsertWithWhereUniqueWithoutNewsCatalogRefInput[]
    createMany?: TradeSetupCreateManyNewsCatalogRefInputEnvelope
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutNewsCatalogRefInput | TradeSetupUpdateWithWhereUniqueWithoutNewsCatalogRefInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutNewsCatalogRefInput | TradeSetupUpdateManyWithWhereWithoutNewsCatalogRefInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type TradeSetupUncheckedUpdateManyWithoutNewsCatalogRefNestedInput = {
    create?: XOR<TradeSetupCreateWithoutNewsCatalogRefInput, TradeSetupUncheckedCreateWithoutNewsCatalogRefInput> | TradeSetupCreateWithoutNewsCatalogRefInput[] | TradeSetupUncheckedCreateWithoutNewsCatalogRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsCatalogRefInput | TradeSetupCreateOrConnectWithoutNewsCatalogRefInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutNewsCatalogRefInput | TradeSetupUpsertWithWhereUniqueWithoutNewsCatalogRefInput[]
    createMany?: TradeSetupCreateManyNewsCatalogRefInputEnvelope
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutNewsCatalogRefInput | TradeSetupUpdateWithWhereUniqueWithoutNewsCatalogRefInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutNewsCatalogRefInput | TradeSetupUpdateManyWithWhereWithoutNewsCatalogRefInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type TradeSetupCreateNestedManyWithoutStrategyRefInput = {
    create?: XOR<TradeSetupCreateWithoutStrategyRefInput, TradeSetupUncheckedCreateWithoutStrategyRefInput> | TradeSetupCreateWithoutStrategyRefInput[] | TradeSetupUncheckedCreateWithoutStrategyRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutStrategyRefInput | TradeSetupCreateOrConnectWithoutStrategyRefInput[]
    createMany?: TradeSetupCreateManyStrategyRefInputEnvelope
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type TradeTypeCreateNestedManyWithoutStrategyInput = {
    create?: XOR<TradeTypeCreateWithoutStrategyInput, TradeTypeUncheckedCreateWithoutStrategyInput> | TradeTypeCreateWithoutStrategyInput[] | TradeTypeUncheckedCreateWithoutStrategyInput[]
    connectOrCreate?: TradeTypeCreateOrConnectWithoutStrategyInput | TradeTypeCreateOrConnectWithoutStrategyInput[]
    createMany?: TradeTypeCreateManyStrategyInputEnvelope
    connect?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
  }

  export type TradeSetupUncheckedCreateNestedManyWithoutStrategyRefInput = {
    create?: XOR<TradeSetupCreateWithoutStrategyRefInput, TradeSetupUncheckedCreateWithoutStrategyRefInput> | TradeSetupCreateWithoutStrategyRefInput[] | TradeSetupUncheckedCreateWithoutStrategyRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutStrategyRefInput | TradeSetupCreateOrConnectWithoutStrategyRefInput[]
    createMany?: TradeSetupCreateManyStrategyRefInputEnvelope
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type TradeTypeUncheckedCreateNestedManyWithoutStrategyInput = {
    create?: XOR<TradeTypeCreateWithoutStrategyInput, TradeTypeUncheckedCreateWithoutStrategyInput> | TradeTypeCreateWithoutStrategyInput[] | TradeTypeUncheckedCreateWithoutStrategyInput[]
    connectOrCreate?: TradeTypeCreateOrConnectWithoutStrategyInput | TradeTypeCreateOrConnectWithoutStrategyInput[]
    createMany?: TradeTypeCreateManyStrategyInputEnvelope
    connect?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
  }

  export type TradeSetupUpdateManyWithoutStrategyRefNestedInput = {
    create?: XOR<TradeSetupCreateWithoutStrategyRefInput, TradeSetupUncheckedCreateWithoutStrategyRefInput> | TradeSetupCreateWithoutStrategyRefInput[] | TradeSetupUncheckedCreateWithoutStrategyRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutStrategyRefInput | TradeSetupCreateOrConnectWithoutStrategyRefInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutStrategyRefInput | TradeSetupUpsertWithWhereUniqueWithoutStrategyRefInput[]
    createMany?: TradeSetupCreateManyStrategyRefInputEnvelope
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutStrategyRefInput | TradeSetupUpdateWithWhereUniqueWithoutStrategyRefInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutStrategyRefInput | TradeSetupUpdateManyWithWhereWithoutStrategyRefInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type TradeTypeUpdateManyWithoutStrategyNestedInput = {
    create?: XOR<TradeTypeCreateWithoutStrategyInput, TradeTypeUncheckedCreateWithoutStrategyInput> | TradeTypeCreateWithoutStrategyInput[] | TradeTypeUncheckedCreateWithoutStrategyInput[]
    connectOrCreate?: TradeTypeCreateOrConnectWithoutStrategyInput | TradeTypeCreateOrConnectWithoutStrategyInput[]
    upsert?: TradeTypeUpsertWithWhereUniqueWithoutStrategyInput | TradeTypeUpsertWithWhereUniqueWithoutStrategyInput[]
    createMany?: TradeTypeCreateManyStrategyInputEnvelope
    set?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    disconnect?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    delete?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    connect?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    update?: TradeTypeUpdateWithWhereUniqueWithoutStrategyInput | TradeTypeUpdateWithWhereUniqueWithoutStrategyInput[]
    updateMany?: TradeTypeUpdateManyWithWhereWithoutStrategyInput | TradeTypeUpdateManyWithWhereWithoutStrategyInput[]
    deleteMany?: TradeTypeScalarWhereInput | TradeTypeScalarWhereInput[]
  }

  export type TradeSetupUncheckedUpdateManyWithoutStrategyRefNestedInput = {
    create?: XOR<TradeSetupCreateWithoutStrategyRefInput, TradeSetupUncheckedCreateWithoutStrategyRefInput> | TradeSetupCreateWithoutStrategyRefInput[] | TradeSetupUncheckedCreateWithoutStrategyRefInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutStrategyRefInput | TradeSetupCreateOrConnectWithoutStrategyRefInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutStrategyRefInput | TradeSetupUpsertWithWhereUniqueWithoutStrategyRefInput[]
    createMany?: TradeSetupCreateManyStrategyRefInputEnvelope
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutStrategyRefInput | TradeSetupUpdateWithWhereUniqueWithoutStrategyRefInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutStrategyRefInput | TradeSetupUpdateManyWithWhereWithoutStrategyRefInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type TradeTypeUncheckedUpdateManyWithoutStrategyNestedInput = {
    create?: XOR<TradeTypeCreateWithoutStrategyInput, TradeTypeUncheckedCreateWithoutStrategyInput> | TradeTypeCreateWithoutStrategyInput[] | TradeTypeUncheckedCreateWithoutStrategyInput[]
    connectOrCreate?: TradeTypeCreateOrConnectWithoutStrategyInput | TradeTypeCreateOrConnectWithoutStrategyInput[]
    upsert?: TradeTypeUpsertWithWhereUniqueWithoutStrategyInput | TradeTypeUpsertWithWhereUniqueWithoutStrategyInput[]
    createMany?: TradeTypeCreateManyStrategyInputEnvelope
    set?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    disconnect?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    delete?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    connect?: TradeTypeWhereUniqueInput | TradeTypeWhereUniqueInput[]
    update?: TradeTypeUpdateWithWhereUniqueWithoutStrategyInput | TradeTypeUpdateWithWhereUniqueWithoutStrategyInput[]
    updateMany?: TradeTypeUpdateManyWithWhereWithoutStrategyInput | TradeTypeUpdateManyWithWhereWithoutStrategyInput[]
    deleteMany?: TradeTypeScalarWhereInput | TradeTypeScalarWhereInput[]
  }

  export type StrategyCreateNestedOneWithoutTradeTypesInput = {
    create?: XOR<StrategyCreateWithoutTradeTypesInput, StrategyUncheckedCreateWithoutTradeTypesInput>
    connectOrCreate?: StrategyCreateOrConnectWithoutTradeTypesInput
    connect?: StrategyWhereUniqueInput
  }

  export type StrategyUpdateOneRequiredWithoutTradeTypesNestedInput = {
    create?: XOR<StrategyCreateWithoutTradeTypesInput, StrategyUncheckedCreateWithoutTradeTypesInput>
    connectOrCreate?: StrategyCreateOrConnectWithoutTradeTypesInput
    upsert?: StrategyUpsertWithoutTradeTypesInput
    connect?: StrategyWhereUniqueInput
    update?: XOR<XOR<StrategyUpdateToOneWithWhereWithoutTradeTypesInput, StrategyUpdateWithoutTradeTypesInput>, StrategyUncheckedUpdateWithoutTradeTypesInput>
  }

  export type NewsEventCreateNestedManyWithoutSessionInput = {
    create?: XOR<NewsEventCreateWithoutSessionInput, NewsEventUncheckedCreateWithoutSessionInput> | NewsEventCreateWithoutSessionInput[] | NewsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSessionInput | NewsEventCreateOrConnectWithoutSessionInput[]
    createMany?: NewsEventCreateManySessionInputEnvelope
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
  }

  export type TradeSetupCreateNestedManyWithoutSessionInput = {
    create?: XOR<TradeSetupCreateWithoutSessionInput, TradeSetupUncheckedCreateWithoutSessionInput> | TradeSetupCreateWithoutSessionInput[] | TradeSetupUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutSessionInput | TradeSetupCreateOrConnectWithoutSessionInput[]
    createMany?: TradeSetupCreateManySessionInputEnvelope
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type ScreenshotCreateNestedManyWithoutSessionInput = {
    create?: XOR<ScreenshotCreateWithoutSessionInput, ScreenshotUncheckedCreateWithoutSessionInput> | ScreenshotCreateWithoutSessionInput[] | ScreenshotUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSessionInput | ScreenshotCreateOrConnectWithoutSessionInput[]
    createMany?: ScreenshotCreateManySessionInputEnvelope
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
  }

  export type NewsEventUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<NewsEventCreateWithoutSessionInput, NewsEventUncheckedCreateWithoutSessionInput> | NewsEventCreateWithoutSessionInput[] | NewsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSessionInput | NewsEventCreateOrConnectWithoutSessionInput[]
    createMany?: NewsEventCreateManySessionInputEnvelope
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
  }

  export type TradeSetupUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<TradeSetupCreateWithoutSessionInput, TradeSetupUncheckedCreateWithoutSessionInput> | TradeSetupCreateWithoutSessionInput[] | TradeSetupUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutSessionInput | TradeSetupCreateOrConnectWithoutSessionInput[]
    createMany?: TradeSetupCreateManySessionInputEnvelope
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type ScreenshotUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ScreenshotCreateWithoutSessionInput, ScreenshotUncheckedCreateWithoutSessionInput> | ScreenshotCreateWithoutSessionInput[] | ScreenshotUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSessionInput | ScreenshotCreateOrConnectWithoutSessionInput[]
    createMany?: ScreenshotCreateManySessionInputEnvelope
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NewsEventUpdateManyWithoutSessionNestedInput = {
    create?: XOR<NewsEventCreateWithoutSessionInput, NewsEventUncheckedCreateWithoutSessionInput> | NewsEventCreateWithoutSessionInput[] | NewsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSessionInput | NewsEventCreateOrConnectWithoutSessionInput[]
    upsert?: NewsEventUpsertWithWhereUniqueWithoutSessionInput | NewsEventUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: NewsEventCreateManySessionInputEnvelope
    set?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    disconnect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    delete?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    update?: NewsEventUpdateWithWhereUniqueWithoutSessionInput | NewsEventUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: NewsEventUpdateManyWithWhereWithoutSessionInput | NewsEventUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: NewsEventScalarWhereInput | NewsEventScalarWhereInput[]
  }

  export type TradeSetupUpdateManyWithoutSessionNestedInput = {
    create?: XOR<TradeSetupCreateWithoutSessionInput, TradeSetupUncheckedCreateWithoutSessionInput> | TradeSetupCreateWithoutSessionInput[] | TradeSetupUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutSessionInput | TradeSetupCreateOrConnectWithoutSessionInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutSessionInput | TradeSetupUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: TradeSetupCreateManySessionInputEnvelope
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutSessionInput | TradeSetupUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutSessionInput | TradeSetupUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type ScreenshotUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ScreenshotCreateWithoutSessionInput, ScreenshotUncheckedCreateWithoutSessionInput> | ScreenshotCreateWithoutSessionInput[] | ScreenshotUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSessionInput | ScreenshotCreateOrConnectWithoutSessionInput[]
    upsert?: ScreenshotUpsertWithWhereUniqueWithoutSessionInput | ScreenshotUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ScreenshotCreateManySessionInputEnvelope
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    update?: ScreenshotUpdateWithWhereUniqueWithoutSessionInput | ScreenshotUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ScreenshotUpdateManyWithWhereWithoutSessionInput | ScreenshotUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
  }

  export type NewsEventUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<NewsEventCreateWithoutSessionInput, NewsEventUncheckedCreateWithoutSessionInput> | NewsEventCreateWithoutSessionInput[] | NewsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSessionInput | NewsEventCreateOrConnectWithoutSessionInput[]
    upsert?: NewsEventUpsertWithWhereUniqueWithoutSessionInput | NewsEventUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: NewsEventCreateManySessionInputEnvelope
    set?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    disconnect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    delete?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    update?: NewsEventUpdateWithWhereUniqueWithoutSessionInput | NewsEventUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: NewsEventUpdateManyWithWhereWithoutSessionInput | NewsEventUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: NewsEventScalarWhereInput | NewsEventScalarWhereInput[]
  }

  export type TradeSetupUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<TradeSetupCreateWithoutSessionInput, TradeSetupUncheckedCreateWithoutSessionInput> | TradeSetupCreateWithoutSessionInput[] | TradeSetupUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutSessionInput | TradeSetupCreateOrConnectWithoutSessionInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutSessionInput | TradeSetupUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: TradeSetupCreateManySessionInputEnvelope
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutSessionInput | TradeSetupUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutSessionInput | TradeSetupUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type ScreenshotUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ScreenshotCreateWithoutSessionInput, ScreenshotUncheckedCreateWithoutSessionInput> | ScreenshotCreateWithoutSessionInput[] | ScreenshotUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSessionInput | ScreenshotCreateOrConnectWithoutSessionInput[]
    upsert?: ScreenshotUpsertWithWhereUniqueWithoutSessionInput | ScreenshotUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ScreenshotCreateManySessionInputEnvelope
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    update?: ScreenshotUpdateWithWhereUniqueWithoutSessionInput | ScreenshotUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ScreenshotUpdateManyWithWhereWithoutSessionInput | ScreenshotUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
  }

  export type DailySessionCreateNestedOneWithoutNewsEventsInput = {
    create?: XOR<DailySessionCreateWithoutNewsEventsInput, DailySessionUncheckedCreateWithoutNewsEventsInput>
    connectOrCreate?: DailySessionCreateOrConnectWithoutNewsEventsInput
    connect?: DailySessionWhereUniqueInput
  }

  export type TradeSetupCreateNestedManyWithoutNewsEventsInput = {
    create?: XOR<TradeSetupCreateWithoutNewsEventsInput, TradeSetupUncheckedCreateWithoutNewsEventsInput> | TradeSetupCreateWithoutNewsEventsInput[] | TradeSetupUncheckedCreateWithoutNewsEventsInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsEventsInput | TradeSetupCreateOrConnectWithoutNewsEventsInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type TradeSetupUncheckedCreateNestedManyWithoutNewsEventsInput = {
    create?: XOR<TradeSetupCreateWithoutNewsEventsInput, TradeSetupUncheckedCreateWithoutNewsEventsInput> | TradeSetupCreateWithoutNewsEventsInput[] | TradeSetupUncheckedCreateWithoutNewsEventsInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsEventsInput | TradeSetupCreateOrConnectWithoutNewsEventsInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
  }

  export type EnumNewsTypeFieldUpdateOperationsInput = {
    set?: $Enums.NewsType
  }

  export type EnumNewsImpactFieldUpdateOperationsInput = {
    set?: $Enums.NewsImpact
  }

  export type DailySessionUpdateOneRequiredWithoutNewsEventsNestedInput = {
    create?: XOR<DailySessionCreateWithoutNewsEventsInput, DailySessionUncheckedCreateWithoutNewsEventsInput>
    connectOrCreate?: DailySessionCreateOrConnectWithoutNewsEventsInput
    upsert?: DailySessionUpsertWithoutNewsEventsInput
    connect?: DailySessionWhereUniqueInput
    update?: XOR<XOR<DailySessionUpdateToOneWithWhereWithoutNewsEventsInput, DailySessionUpdateWithoutNewsEventsInput>, DailySessionUncheckedUpdateWithoutNewsEventsInput>
  }

  export type TradeSetupUpdateManyWithoutNewsEventsNestedInput = {
    create?: XOR<TradeSetupCreateWithoutNewsEventsInput, TradeSetupUncheckedCreateWithoutNewsEventsInput> | TradeSetupCreateWithoutNewsEventsInput[] | TradeSetupUncheckedCreateWithoutNewsEventsInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsEventsInput | TradeSetupCreateOrConnectWithoutNewsEventsInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutNewsEventsInput | TradeSetupUpsertWithWhereUniqueWithoutNewsEventsInput[]
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutNewsEventsInput | TradeSetupUpdateWithWhereUniqueWithoutNewsEventsInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutNewsEventsInput | TradeSetupUpdateManyWithWhereWithoutNewsEventsInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type TradeSetupUncheckedUpdateManyWithoutNewsEventsNestedInput = {
    create?: XOR<TradeSetupCreateWithoutNewsEventsInput, TradeSetupUncheckedCreateWithoutNewsEventsInput> | TradeSetupCreateWithoutNewsEventsInput[] | TradeSetupUncheckedCreateWithoutNewsEventsInput[]
    connectOrCreate?: TradeSetupCreateOrConnectWithoutNewsEventsInput | TradeSetupCreateOrConnectWithoutNewsEventsInput[]
    upsert?: TradeSetupUpsertWithWhereUniqueWithoutNewsEventsInput | TradeSetupUpsertWithWhereUniqueWithoutNewsEventsInput[]
    set?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    disconnect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    delete?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    connect?: TradeSetupWhereUniqueInput | TradeSetupWhereUniqueInput[]
    update?: TradeSetupUpdateWithWhereUniqueWithoutNewsEventsInput | TradeSetupUpdateWithWhereUniqueWithoutNewsEventsInput[]
    updateMany?: TradeSetupUpdateManyWithWhereWithoutNewsEventsInput | TradeSetupUpdateManyWithWhereWithoutNewsEventsInput[]
    deleteMany?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
  }

  export type DailySessionCreateNestedOneWithoutSetupsInput = {
    create?: XOR<DailySessionCreateWithoutSetupsInput, DailySessionUncheckedCreateWithoutSetupsInput>
    connectOrCreate?: DailySessionCreateOrConnectWithoutSetupsInput
    connect?: DailySessionWhereUniqueInput
  }

  export type StrategyCreateNestedOneWithoutSetupsInput = {
    create?: XOR<StrategyCreateWithoutSetupsInput, StrategyUncheckedCreateWithoutSetupsInput>
    connectOrCreate?: StrategyCreateOrConnectWithoutSetupsInput
    connect?: StrategyWhereUniqueInput
  }

  export type NewsEventCreateNestedManyWithoutSetupsInput = {
    create?: XOR<NewsEventCreateWithoutSetupsInput, NewsEventUncheckedCreateWithoutSetupsInput> | NewsEventCreateWithoutSetupsInput[] | NewsEventUncheckedCreateWithoutSetupsInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSetupsInput | NewsEventCreateOrConnectWithoutSetupsInput[]
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
  }

  export type NewsCatalogCreateNestedOneWithoutSetupsInput = {
    create?: XOR<NewsCatalogCreateWithoutSetupsInput, NewsCatalogUncheckedCreateWithoutSetupsInput>
    connectOrCreate?: NewsCatalogCreateOrConnectWithoutSetupsInput
    connect?: NewsCatalogWhereUniqueInput
  }

  export type ExecutionCreateNestedManyWithoutSetupInput = {
    create?: XOR<ExecutionCreateWithoutSetupInput, ExecutionUncheckedCreateWithoutSetupInput> | ExecutionCreateWithoutSetupInput[] | ExecutionUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutSetupInput | ExecutionCreateOrConnectWithoutSetupInput[]
    createMany?: ExecutionCreateManySetupInputEnvelope
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
  }

  export type ScreenshotCreateNestedManyWithoutSetupInput = {
    create?: XOR<ScreenshotCreateWithoutSetupInput, ScreenshotUncheckedCreateWithoutSetupInput> | ScreenshotCreateWithoutSetupInput[] | ScreenshotUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSetupInput | ScreenshotCreateOrConnectWithoutSetupInput[]
    createMany?: ScreenshotCreateManySetupInputEnvelope
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
  }

  export type NewsEventUncheckedCreateNestedManyWithoutSetupsInput = {
    create?: XOR<NewsEventCreateWithoutSetupsInput, NewsEventUncheckedCreateWithoutSetupsInput> | NewsEventCreateWithoutSetupsInput[] | NewsEventUncheckedCreateWithoutSetupsInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSetupsInput | NewsEventCreateOrConnectWithoutSetupsInput[]
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
  }

  export type ExecutionUncheckedCreateNestedManyWithoutSetupInput = {
    create?: XOR<ExecutionCreateWithoutSetupInput, ExecutionUncheckedCreateWithoutSetupInput> | ExecutionCreateWithoutSetupInput[] | ExecutionUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutSetupInput | ExecutionCreateOrConnectWithoutSetupInput[]
    createMany?: ExecutionCreateManySetupInputEnvelope
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
  }

  export type ScreenshotUncheckedCreateNestedManyWithoutSetupInput = {
    create?: XOR<ScreenshotCreateWithoutSetupInput, ScreenshotUncheckedCreateWithoutSetupInput> | ScreenshotCreateWithoutSetupInput[] | ScreenshotUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSetupInput | ScreenshotCreateOrConnectWithoutSetupInput[]
    createMany?: ScreenshotCreateManySetupInputEnvelope
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
  }

  export type EnumDirectionFieldUpdateOperationsInput = {
    set?: $Enums.Direction
  }

  export type NullableEnumPriceTierFieldUpdateOperationsInput = {
    set?: $Enums.PriceTier | null
  }

  export type NullableEnumMarketCapTierFieldUpdateOperationsInput = {
    set?: $Enums.MarketCapTier | null
  }

  export type NullableEnumNewsTypeFieldUpdateOperationsInput = {
    set?: $Enums.NewsType | null
  }

  export type NullableEnumNewsImpactFieldUpdateOperationsInput = {
    set?: $Enums.NewsImpact | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumSetupStatusFieldUpdateOperationsInput = {
    set?: $Enums.SetupStatus
  }

  export type NullableEnumMissedReasonFieldUpdateOperationsInput = {
    set?: $Enums.MissedReason | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableEnumGradeFieldUpdateOperationsInput = {
    set?: $Enums.Grade | null
  }

  export type DailySessionUpdateOneRequiredWithoutSetupsNestedInput = {
    create?: XOR<DailySessionCreateWithoutSetupsInput, DailySessionUncheckedCreateWithoutSetupsInput>
    connectOrCreate?: DailySessionCreateOrConnectWithoutSetupsInput
    upsert?: DailySessionUpsertWithoutSetupsInput
    connect?: DailySessionWhereUniqueInput
    update?: XOR<XOR<DailySessionUpdateToOneWithWhereWithoutSetupsInput, DailySessionUpdateWithoutSetupsInput>, DailySessionUncheckedUpdateWithoutSetupsInput>
  }

  export type StrategyUpdateOneWithoutSetupsNestedInput = {
    create?: XOR<StrategyCreateWithoutSetupsInput, StrategyUncheckedCreateWithoutSetupsInput>
    connectOrCreate?: StrategyCreateOrConnectWithoutSetupsInput
    upsert?: StrategyUpsertWithoutSetupsInput
    disconnect?: StrategyWhereInput | boolean
    delete?: StrategyWhereInput | boolean
    connect?: StrategyWhereUniqueInput
    update?: XOR<XOR<StrategyUpdateToOneWithWhereWithoutSetupsInput, StrategyUpdateWithoutSetupsInput>, StrategyUncheckedUpdateWithoutSetupsInput>
  }

  export type NewsEventUpdateManyWithoutSetupsNestedInput = {
    create?: XOR<NewsEventCreateWithoutSetupsInput, NewsEventUncheckedCreateWithoutSetupsInput> | NewsEventCreateWithoutSetupsInput[] | NewsEventUncheckedCreateWithoutSetupsInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSetupsInput | NewsEventCreateOrConnectWithoutSetupsInput[]
    upsert?: NewsEventUpsertWithWhereUniqueWithoutSetupsInput | NewsEventUpsertWithWhereUniqueWithoutSetupsInput[]
    set?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    disconnect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    delete?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    update?: NewsEventUpdateWithWhereUniqueWithoutSetupsInput | NewsEventUpdateWithWhereUniqueWithoutSetupsInput[]
    updateMany?: NewsEventUpdateManyWithWhereWithoutSetupsInput | NewsEventUpdateManyWithWhereWithoutSetupsInput[]
    deleteMany?: NewsEventScalarWhereInput | NewsEventScalarWhereInput[]
  }

  export type NewsCatalogUpdateOneWithoutSetupsNestedInput = {
    create?: XOR<NewsCatalogCreateWithoutSetupsInput, NewsCatalogUncheckedCreateWithoutSetupsInput>
    connectOrCreate?: NewsCatalogCreateOrConnectWithoutSetupsInput
    upsert?: NewsCatalogUpsertWithoutSetupsInput
    disconnect?: NewsCatalogWhereInput | boolean
    delete?: NewsCatalogWhereInput | boolean
    connect?: NewsCatalogWhereUniqueInput
    update?: XOR<XOR<NewsCatalogUpdateToOneWithWhereWithoutSetupsInput, NewsCatalogUpdateWithoutSetupsInput>, NewsCatalogUncheckedUpdateWithoutSetupsInput>
  }

  export type ExecutionUpdateManyWithoutSetupNestedInput = {
    create?: XOR<ExecutionCreateWithoutSetupInput, ExecutionUncheckedCreateWithoutSetupInput> | ExecutionCreateWithoutSetupInput[] | ExecutionUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutSetupInput | ExecutionCreateOrConnectWithoutSetupInput[]
    upsert?: ExecutionUpsertWithWhereUniqueWithoutSetupInput | ExecutionUpsertWithWhereUniqueWithoutSetupInput[]
    createMany?: ExecutionCreateManySetupInputEnvelope
    set?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    disconnect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    delete?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    update?: ExecutionUpdateWithWhereUniqueWithoutSetupInput | ExecutionUpdateWithWhereUniqueWithoutSetupInput[]
    updateMany?: ExecutionUpdateManyWithWhereWithoutSetupInput | ExecutionUpdateManyWithWhereWithoutSetupInput[]
    deleteMany?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
  }

  export type ScreenshotUpdateManyWithoutSetupNestedInput = {
    create?: XOR<ScreenshotCreateWithoutSetupInput, ScreenshotUncheckedCreateWithoutSetupInput> | ScreenshotCreateWithoutSetupInput[] | ScreenshotUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSetupInput | ScreenshotCreateOrConnectWithoutSetupInput[]
    upsert?: ScreenshotUpsertWithWhereUniqueWithoutSetupInput | ScreenshotUpsertWithWhereUniqueWithoutSetupInput[]
    createMany?: ScreenshotCreateManySetupInputEnvelope
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    update?: ScreenshotUpdateWithWhereUniqueWithoutSetupInput | ScreenshotUpdateWithWhereUniqueWithoutSetupInput[]
    updateMany?: ScreenshotUpdateManyWithWhereWithoutSetupInput | ScreenshotUpdateManyWithWhereWithoutSetupInput[]
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
  }

  export type NewsEventUncheckedUpdateManyWithoutSetupsNestedInput = {
    create?: XOR<NewsEventCreateWithoutSetupsInput, NewsEventUncheckedCreateWithoutSetupsInput> | NewsEventCreateWithoutSetupsInput[] | NewsEventUncheckedCreateWithoutSetupsInput[]
    connectOrCreate?: NewsEventCreateOrConnectWithoutSetupsInput | NewsEventCreateOrConnectWithoutSetupsInput[]
    upsert?: NewsEventUpsertWithWhereUniqueWithoutSetupsInput | NewsEventUpsertWithWhereUniqueWithoutSetupsInput[]
    set?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    disconnect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    delete?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    connect?: NewsEventWhereUniqueInput | NewsEventWhereUniqueInput[]
    update?: NewsEventUpdateWithWhereUniqueWithoutSetupsInput | NewsEventUpdateWithWhereUniqueWithoutSetupsInput[]
    updateMany?: NewsEventUpdateManyWithWhereWithoutSetupsInput | NewsEventUpdateManyWithWhereWithoutSetupsInput[]
    deleteMany?: NewsEventScalarWhereInput | NewsEventScalarWhereInput[]
  }

  export type ExecutionUncheckedUpdateManyWithoutSetupNestedInput = {
    create?: XOR<ExecutionCreateWithoutSetupInput, ExecutionUncheckedCreateWithoutSetupInput> | ExecutionCreateWithoutSetupInput[] | ExecutionUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ExecutionCreateOrConnectWithoutSetupInput | ExecutionCreateOrConnectWithoutSetupInput[]
    upsert?: ExecutionUpsertWithWhereUniqueWithoutSetupInput | ExecutionUpsertWithWhereUniqueWithoutSetupInput[]
    createMany?: ExecutionCreateManySetupInputEnvelope
    set?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    disconnect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    delete?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    connect?: ExecutionWhereUniqueInput | ExecutionWhereUniqueInput[]
    update?: ExecutionUpdateWithWhereUniqueWithoutSetupInput | ExecutionUpdateWithWhereUniqueWithoutSetupInput[]
    updateMany?: ExecutionUpdateManyWithWhereWithoutSetupInput | ExecutionUpdateManyWithWhereWithoutSetupInput[]
    deleteMany?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
  }

  export type ScreenshotUncheckedUpdateManyWithoutSetupNestedInput = {
    create?: XOR<ScreenshotCreateWithoutSetupInput, ScreenshotUncheckedCreateWithoutSetupInput> | ScreenshotCreateWithoutSetupInput[] | ScreenshotUncheckedCreateWithoutSetupInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutSetupInput | ScreenshotCreateOrConnectWithoutSetupInput[]
    upsert?: ScreenshotUpsertWithWhereUniqueWithoutSetupInput | ScreenshotUpsertWithWhereUniqueWithoutSetupInput[]
    createMany?: ScreenshotCreateManySetupInputEnvelope
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    update?: ScreenshotUpdateWithWhereUniqueWithoutSetupInput | ScreenshotUpdateWithWhereUniqueWithoutSetupInput[]
    updateMany?: ScreenshotUpdateManyWithWhereWithoutSetupInput | ScreenshotUpdateManyWithWhereWithoutSetupInput[]
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
  }

  export type TradeSetupCreateNestedOneWithoutExecutionsInput = {
    create?: XOR<TradeSetupCreateWithoutExecutionsInput, TradeSetupUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: TradeSetupCreateOrConnectWithoutExecutionsInput
    connect?: TradeSetupWhereUniqueInput
  }

  export type ScreenshotCreateNestedManyWithoutExecutionInput = {
    create?: XOR<ScreenshotCreateWithoutExecutionInput, ScreenshotUncheckedCreateWithoutExecutionInput> | ScreenshotCreateWithoutExecutionInput[] | ScreenshotUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutExecutionInput | ScreenshotCreateOrConnectWithoutExecutionInput[]
    createMany?: ScreenshotCreateManyExecutionInputEnvelope
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
  }

  export type ScreenshotUncheckedCreateNestedManyWithoutExecutionInput = {
    create?: XOR<ScreenshotCreateWithoutExecutionInput, ScreenshotUncheckedCreateWithoutExecutionInput> | ScreenshotCreateWithoutExecutionInput[] | ScreenshotUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutExecutionInput | ScreenshotCreateOrConnectWithoutExecutionInput[]
    createMany?: ScreenshotCreateManyExecutionInputEnvelope
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableEnumDirectionFieldUpdateOperationsInput = {
    set?: $Enums.Direction | null
  }

  export type TradeSetupUpdateOneRequiredWithoutExecutionsNestedInput = {
    create?: XOR<TradeSetupCreateWithoutExecutionsInput, TradeSetupUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: TradeSetupCreateOrConnectWithoutExecutionsInput
    upsert?: TradeSetupUpsertWithoutExecutionsInput
    connect?: TradeSetupWhereUniqueInput
    update?: XOR<XOR<TradeSetupUpdateToOneWithWhereWithoutExecutionsInput, TradeSetupUpdateWithoutExecutionsInput>, TradeSetupUncheckedUpdateWithoutExecutionsInput>
  }

  export type ScreenshotUpdateManyWithoutExecutionNestedInput = {
    create?: XOR<ScreenshotCreateWithoutExecutionInput, ScreenshotUncheckedCreateWithoutExecutionInput> | ScreenshotCreateWithoutExecutionInput[] | ScreenshotUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutExecutionInput | ScreenshotCreateOrConnectWithoutExecutionInput[]
    upsert?: ScreenshotUpsertWithWhereUniqueWithoutExecutionInput | ScreenshotUpsertWithWhereUniqueWithoutExecutionInput[]
    createMany?: ScreenshotCreateManyExecutionInputEnvelope
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    update?: ScreenshotUpdateWithWhereUniqueWithoutExecutionInput | ScreenshotUpdateWithWhereUniqueWithoutExecutionInput[]
    updateMany?: ScreenshotUpdateManyWithWhereWithoutExecutionInput | ScreenshotUpdateManyWithWhereWithoutExecutionInput[]
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
  }

  export type ScreenshotUncheckedUpdateManyWithoutExecutionNestedInput = {
    create?: XOR<ScreenshotCreateWithoutExecutionInput, ScreenshotUncheckedCreateWithoutExecutionInput> | ScreenshotCreateWithoutExecutionInput[] | ScreenshotUncheckedCreateWithoutExecutionInput[]
    connectOrCreate?: ScreenshotCreateOrConnectWithoutExecutionInput | ScreenshotCreateOrConnectWithoutExecutionInput[]
    upsert?: ScreenshotUpsertWithWhereUniqueWithoutExecutionInput | ScreenshotUpsertWithWhereUniqueWithoutExecutionInput[]
    createMany?: ScreenshotCreateManyExecutionInputEnvelope
    set?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    disconnect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    delete?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    connect?: ScreenshotWhereUniqueInput | ScreenshotWhereUniqueInput[]
    update?: ScreenshotUpdateWithWhereUniqueWithoutExecutionInput | ScreenshotUpdateWithWhereUniqueWithoutExecutionInput[]
    updateMany?: ScreenshotUpdateManyWithWhereWithoutExecutionInput | ScreenshotUpdateManyWithWhereWithoutExecutionInput[]
    deleteMany?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
  }

  export type TradeSetupCreateNestedOneWithoutScreenshotsInput = {
    create?: XOR<TradeSetupCreateWithoutScreenshotsInput, TradeSetupUncheckedCreateWithoutScreenshotsInput>
    connectOrCreate?: TradeSetupCreateOrConnectWithoutScreenshotsInput
    connect?: TradeSetupWhereUniqueInput
  }

  export type ExecutionCreateNestedOneWithoutScreenshotsInput = {
    create?: XOR<ExecutionCreateWithoutScreenshotsInput, ExecutionUncheckedCreateWithoutScreenshotsInput>
    connectOrCreate?: ExecutionCreateOrConnectWithoutScreenshotsInput
    connect?: ExecutionWhereUniqueInput
  }

  export type DailySessionCreateNestedOneWithoutScreenshotsInput = {
    create?: XOR<DailySessionCreateWithoutScreenshotsInput, DailySessionUncheckedCreateWithoutScreenshotsInput>
    connectOrCreate?: DailySessionCreateOrConnectWithoutScreenshotsInput
    connect?: DailySessionWhereUniqueInput
  }

  export type NullableEnumChartTagFieldUpdateOperationsInput = {
    set?: $Enums.ChartTag | null
  }

  export type TradeSetupUpdateOneWithoutScreenshotsNestedInput = {
    create?: XOR<TradeSetupCreateWithoutScreenshotsInput, TradeSetupUncheckedCreateWithoutScreenshotsInput>
    connectOrCreate?: TradeSetupCreateOrConnectWithoutScreenshotsInput
    upsert?: TradeSetupUpsertWithoutScreenshotsInput
    disconnect?: TradeSetupWhereInput | boolean
    delete?: TradeSetupWhereInput | boolean
    connect?: TradeSetupWhereUniqueInput
    update?: XOR<XOR<TradeSetupUpdateToOneWithWhereWithoutScreenshotsInput, TradeSetupUpdateWithoutScreenshotsInput>, TradeSetupUncheckedUpdateWithoutScreenshotsInput>
  }

  export type ExecutionUpdateOneWithoutScreenshotsNestedInput = {
    create?: XOR<ExecutionCreateWithoutScreenshotsInput, ExecutionUncheckedCreateWithoutScreenshotsInput>
    connectOrCreate?: ExecutionCreateOrConnectWithoutScreenshotsInput
    upsert?: ExecutionUpsertWithoutScreenshotsInput
    disconnect?: ExecutionWhereInput | boolean
    delete?: ExecutionWhereInput | boolean
    connect?: ExecutionWhereUniqueInput
    update?: XOR<XOR<ExecutionUpdateToOneWithWhereWithoutScreenshotsInput, ExecutionUpdateWithoutScreenshotsInput>, ExecutionUncheckedUpdateWithoutScreenshotsInput>
  }

  export type DailySessionUpdateOneWithoutScreenshotsNestedInput = {
    create?: XOR<DailySessionCreateWithoutScreenshotsInput, DailySessionUncheckedCreateWithoutScreenshotsInput>
    connectOrCreate?: DailySessionCreateOrConnectWithoutScreenshotsInput
    upsert?: DailySessionUpsertWithoutScreenshotsInput
    disconnect?: DailySessionWhereInput | boolean
    delete?: DailySessionWhereInput | boolean
    connect?: DailySessionWhereUniqueInput
    update?: XOR<XOR<DailySessionUpdateToOneWithWhereWithoutScreenshotsInput, DailySessionUpdateWithoutScreenshotsInput>, DailySessionUncheckedUpdateWithoutScreenshotsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumNewsStrengthFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsStrength | EnumNewsStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.NewsStrength[]
    notIn?: $Enums.NewsStrength[]
    not?: NestedEnumNewsStrengthFilter<$PrismaModel> | $Enums.NewsStrength
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumNewsStrengthWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsStrength | EnumNewsStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.NewsStrength[]
    notIn?: $Enums.NewsStrength[]
    not?: NestedEnumNewsStrengthWithAggregatesFilter<$PrismaModel> | $Enums.NewsStrength
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsStrengthFilter<$PrismaModel>
    _max?: NestedEnumNewsStrengthFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumNewsTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsType[]
    notIn?: $Enums.NewsType[]
    not?: NestedEnumNewsTypeFilter<$PrismaModel> | $Enums.NewsType
  }

  export type NestedEnumNewsImpactFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[]
    notIn?: $Enums.NewsImpact[]
    not?: NestedEnumNewsImpactFilter<$PrismaModel> | $Enums.NewsImpact
  }

  export type NestedEnumNewsTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsType[]
    notIn?: $Enums.NewsType[]
    not?: NestedEnumNewsTypeWithAggregatesFilter<$PrismaModel> | $Enums.NewsType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsTypeFilter<$PrismaModel>
    _max?: NestedEnumNewsTypeFilter<$PrismaModel>
  }

  export type NestedEnumNewsImpactWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel>
    in?: $Enums.NewsImpact[]
    notIn?: $Enums.NewsImpact[]
    not?: NestedEnumNewsImpactWithAggregatesFilter<$PrismaModel> | $Enums.NewsImpact
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsImpactFilter<$PrismaModel>
    _max?: NestedEnumNewsImpactFilter<$PrismaModel>
  }

  export type NestedEnumDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[]
    notIn?: $Enums.Direction[]
    not?: NestedEnumDirectionFilter<$PrismaModel> | $Enums.Direction
  }

  export type NestedEnumPriceTierNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceTier | EnumPriceTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriceTier[] | null
    notIn?: $Enums.PriceTier[] | null
    not?: NestedEnumPriceTierNullableFilter<$PrismaModel> | $Enums.PriceTier | null
  }

  export type NestedEnumMarketCapTierNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketCapTier | EnumMarketCapTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketCapTier[] | null
    notIn?: $Enums.MarketCapTier[] | null
    not?: NestedEnumMarketCapTierNullableFilter<$PrismaModel> | $Enums.MarketCapTier | null
  }

  export type NestedEnumNewsTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsType[] | null
    notIn?: $Enums.NewsType[] | null
    not?: NestedEnumNewsTypeNullableFilter<$PrismaModel> | $Enums.NewsType | null
  }

  export type NestedEnumNewsImpactNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsImpact[] | null
    notIn?: $Enums.NewsImpact[] | null
    not?: NestedEnumNewsImpactNullableFilter<$PrismaModel> | $Enums.NewsImpact | null
  }

  export type NestedEnumSetupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupStatus | EnumSetupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SetupStatus[]
    notIn?: $Enums.SetupStatus[]
    not?: NestedEnumSetupStatusFilter<$PrismaModel> | $Enums.SetupStatus
  }

  export type NestedEnumMissedReasonNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MissedReason | EnumMissedReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissedReason[] | null
    notIn?: $Enums.MissedReason[] | null
    not?: NestedEnumMissedReasonNullableFilter<$PrismaModel> | $Enums.MissedReason | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumGradeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.Grade[] | null
    notIn?: $Enums.Grade[] | null
    not?: NestedEnumGradeNullableFilter<$PrismaModel> | $Enums.Grade | null
  }

  export type NestedEnumDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.Direction[]
    notIn?: $Enums.Direction[]
    not?: NestedEnumDirectionWithAggregatesFilter<$PrismaModel> | $Enums.Direction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectionFilter<$PrismaModel>
    _max?: NestedEnumDirectionFilter<$PrismaModel>
  }

  export type NestedEnumPriceTierNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriceTier | EnumPriceTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.PriceTier[] | null
    notIn?: $Enums.PriceTier[] | null
    not?: NestedEnumPriceTierNullableWithAggregatesFilter<$PrismaModel> | $Enums.PriceTier | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPriceTierNullableFilter<$PrismaModel>
    _max?: NestedEnumPriceTierNullableFilter<$PrismaModel>
  }

  export type NestedEnumMarketCapTierNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketCapTier | EnumMarketCapTierFieldRefInput<$PrismaModel> | null
    in?: $Enums.MarketCapTier[] | null
    notIn?: $Enums.MarketCapTier[] | null
    not?: NestedEnumMarketCapTierNullableWithAggregatesFilter<$PrismaModel> | $Enums.MarketCapTier | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMarketCapTierNullableFilter<$PrismaModel>
    _max?: NestedEnumMarketCapTierNullableFilter<$PrismaModel>
  }

  export type NestedEnumNewsTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsType | EnumNewsTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsType[] | null
    notIn?: $Enums.NewsType[] | null
    not?: NestedEnumNewsTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.NewsType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumNewsTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumNewsTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumNewsImpactNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsImpact | EnumNewsImpactFieldRefInput<$PrismaModel> | null
    in?: $Enums.NewsImpact[] | null
    notIn?: $Enums.NewsImpact[] | null
    not?: NestedEnumNewsImpactNullableWithAggregatesFilter<$PrismaModel> | $Enums.NewsImpact | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumNewsImpactNullableFilter<$PrismaModel>
    _max?: NestedEnumNewsImpactNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumSetupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SetupStatus | EnumSetupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SetupStatus[]
    notIn?: $Enums.SetupStatus[]
    not?: NestedEnumSetupStatusWithAggregatesFilter<$PrismaModel> | $Enums.SetupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSetupStatusFilter<$PrismaModel>
    _max?: NestedEnumSetupStatusFilter<$PrismaModel>
  }

  export type NestedEnumMissedReasonNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissedReason | EnumMissedReasonFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissedReason[] | null
    notIn?: $Enums.MissedReason[] | null
    not?: NestedEnumMissedReasonNullableWithAggregatesFilter<$PrismaModel> | $Enums.MissedReason | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMissedReasonNullableFilter<$PrismaModel>
    _max?: NestedEnumMissedReasonNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumGradeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.Grade[] | null
    notIn?: $Enums.Grade[] | null
    not?: NestedEnumGradeNullableWithAggregatesFilter<$PrismaModel> | $Enums.Grade | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGradeNullableFilter<$PrismaModel>
    _max?: NestedEnumGradeNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumDirectionNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel> | null
    in?: $Enums.Direction[] | null
    notIn?: $Enums.Direction[] | null
    not?: NestedEnumDirectionNullableFilter<$PrismaModel> | $Enums.Direction | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumDirectionNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Direction | EnumDirectionFieldRefInput<$PrismaModel> | null
    in?: $Enums.Direction[] | null
    notIn?: $Enums.Direction[] | null
    not?: NestedEnumDirectionNullableWithAggregatesFilter<$PrismaModel> | $Enums.Direction | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDirectionNullableFilter<$PrismaModel>
    _max?: NestedEnumDirectionNullableFilter<$PrismaModel>
  }

  export type NestedEnumChartTagNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ChartTag | EnumChartTagFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChartTag[] | null
    notIn?: $Enums.ChartTag[] | null
    not?: NestedEnumChartTagNullableFilter<$PrismaModel> | $Enums.ChartTag | null
  }

  export type NestedEnumChartTagNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChartTag | EnumChartTagFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChartTag[] | null
    notIn?: $Enums.ChartTag[] | null
    not?: NestedEnumChartTagNullableWithAggregatesFilter<$PrismaModel> | $Enums.ChartTag | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumChartTagNullableFilter<$PrismaModel>
    _max?: NestedEnumChartTagNullableFilter<$PrismaModel>
  }

  export type TradeSetupCreateWithoutNewsCatalogRefInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: DailySessionCreateNestedOneWithoutSetupsInput
    strategyRef?: StrategyCreateNestedOneWithoutSetupsInput
    newsEvents?: NewsEventCreateNestedManyWithoutSetupsInput
    executions?: ExecutionCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateWithoutNewsCatalogRefInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSetupsInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupCreateOrConnectWithoutNewsCatalogRefInput = {
    where: TradeSetupWhereUniqueInput
    create: XOR<TradeSetupCreateWithoutNewsCatalogRefInput, TradeSetupUncheckedCreateWithoutNewsCatalogRefInput>
  }

  export type TradeSetupCreateManyNewsCatalogRefInputEnvelope = {
    data: TradeSetupCreateManyNewsCatalogRefInput | TradeSetupCreateManyNewsCatalogRefInput[]
  }

  export type TradeSetupUpsertWithWhereUniqueWithoutNewsCatalogRefInput = {
    where: TradeSetupWhereUniqueInput
    update: XOR<TradeSetupUpdateWithoutNewsCatalogRefInput, TradeSetupUncheckedUpdateWithoutNewsCatalogRefInput>
    create: XOR<TradeSetupCreateWithoutNewsCatalogRefInput, TradeSetupUncheckedCreateWithoutNewsCatalogRefInput>
  }

  export type TradeSetupUpdateWithWhereUniqueWithoutNewsCatalogRefInput = {
    where: TradeSetupWhereUniqueInput
    data: XOR<TradeSetupUpdateWithoutNewsCatalogRefInput, TradeSetupUncheckedUpdateWithoutNewsCatalogRefInput>
  }

  export type TradeSetupUpdateManyWithWhereWithoutNewsCatalogRefInput = {
    where: TradeSetupScalarWhereInput
    data: XOR<TradeSetupUpdateManyMutationInput, TradeSetupUncheckedUpdateManyWithoutNewsCatalogRefInput>
  }

  export type TradeSetupScalarWhereInput = {
    AND?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
    OR?: TradeSetupScalarWhereInput[]
    NOT?: TradeSetupScalarWhereInput | TradeSetupScalarWhereInput[]
    id?: StringFilter<"TradeSetup"> | string
    sessionDate?: DateTimeFilter<"TradeSetup"> | Date | string
    symbol?: StringFilter<"TradeSetup"> | string
    direction?: EnumDirectionFilter<"TradeSetup"> | $Enums.Direction
    priceTier?: EnumPriceTierNullableFilter<"TradeSetup"> | $Enums.PriceTier | null
    marketCapTier?: EnumMarketCapTierNullableFilter<"TradeSetup"> | $Enums.MarketCapTier | null
    strategy?: StringNullableFilter<"TradeSetup"> | string | null
    strategyId?: StringNullableFilter<"TradeSetup"> | string | null
    setupLogic?: StringNullableFilter<"TradeSetup"> | string | null
    newsType?: EnumNewsTypeNullableFilter<"TradeSetup"> | $Enums.NewsType | null
    newsImpact?: EnumNewsImpactNullableFilter<"TradeSetup"> | $Enums.NewsImpact | null
    newsHeadline?: StringNullableFilter<"TradeSetup"> | string | null
    newsCatalogId?: StringNullableFilter<"TradeSetup"> | string | null
    entryCondition?: StringNullableFilter<"TradeSetup"> | string | null
    entryPriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    entryPriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    stopCondition?: StringNullableFilter<"TradeSetup"> | string | null
    stopPriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    stopPriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    target1Condition?: StringNullableFilter<"TradeSetup"> | string | null
    target1PriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    target1PriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    target2Condition?: StringNullableFilter<"TradeSetup"> | string | null
    target2PriceNote?: StringNullableFilter<"TradeSetup"> | string | null
    target2PriceExact?: FloatNullableFilter<"TradeSetup"> | number | null
    plannedRiskReward?: FloatNullableFilter<"TradeSetup"> | number | null
    plannedSize?: IntNullableFilter<"TradeSetup"> | number | null
    status?: EnumSetupStatusFilter<"TradeSetup"> | $Enums.SetupStatus
    missedReason?: EnumMissedReasonNullableFilter<"TradeSetup"> | $Enums.MissedReason | null
    missedNotes?: StringNullableFilter<"TradeSetup"> | string | null
    missedHypoPnL?: FloatNullableFilter<"TradeSetup"> | number | null
    stockSelectionAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    stockSelectionNote?: StringNullableFilter<"TradeSetup"> | string | null
    analysisAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    analysisAccurateNote?: StringNullableFilter<"TradeSetup"> | string | null
    marketJudgmentAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    marketJudgmentNote?: StringNullableFilter<"TradeSetup"> | string | null
    strategySelectionAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    strategySelectionNote?: StringNullableFilter<"TradeSetup"> | string | null
    entryOpportunityAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    entryOpportunityNote?: StringNullableFilter<"TradeSetup"> | string | null
    exitOpportunityAccurate?: BoolNullableFilter<"TradeSetup"> | boolean | null
    exitOpportunityNote?: StringNullableFilter<"TradeSetup"> | string | null
    actualEntryOpportunity?: StringNullableFilter<"TradeSetup"> | string | null
    actualExitOpportunity?: StringNullableFilter<"TradeSetup"> | string | null
    dailySummary?: StringNullableFilter<"TradeSetup"> | string | null
    selectedTradeTypes?: StringFilter<"TradeSetup"> | string
    setupGrade?: EnumGradeNullableFilter<"TradeSetup"> | $Enums.Grade | null
    setupNotes?: StringNullableFilter<"TradeSetup"> | string | null
    createdAt?: DateTimeFilter<"TradeSetup"> | Date | string
    updatedAt?: DateTimeFilter<"TradeSetup"> | Date | string
  }

  export type TradeSetupCreateWithoutStrategyRefInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: DailySessionCreateNestedOneWithoutSetupsInput
    newsEvents?: NewsEventCreateNestedManyWithoutSetupsInput
    newsCatalogRef?: NewsCatalogCreateNestedOneWithoutSetupsInput
    executions?: ExecutionCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateWithoutStrategyRefInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSetupsInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupCreateOrConnectWithoutStrategyRefInput = {
    where: TradeSetupWhereUniqueInput
    create: XOR<TradeSetupCreateWithoutStrategyRefInput, TradeSetupUncheckedCreateWithoutStrategyRefInput>
  }

  export type TradeSetupCreateManyStrategyRefInputEnvelope = {
    data: TradeSetupCreateManyStrategyRefInput | TradeSetupCreateManyStrategyRefInput[]
  }

  export type TradeTypeCreateWithoutStrategyInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type TradeTypeUncheckedCreateWithoutStrategyInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type TradeTypeCreateOrConnectWithoutStrategyInput = {
    where: TradeTypeWhereUniqueInput
    create: XOR<TradeTypeCreateWithoutStrategyInput, TradeTypeUncheckedCreateWithoutStrategyInput>
  }

  export type TradeTypeCreateManyStrategyInputEnvelope = {
    data: TradeTypeCreateManyStrategyInput | TradeTypeCreateManyStrategyInput[]
  }

  export type TradeSetupUpsertWithWhereUniqueWithoutStrategyRefInput = {
    where: TradeSetupWhereUniqueInput
    update: XOR<TradeSetupUpdateWithoutStrategyRefInput, TradeSetupUncheckedUpdateWithoutStrategyRefInput>
    create: XOR<TradeSetupCreateWithoutStrategyRefInput, TradeSetupUncheckedCreateWithoutStrategyRefInput>
  }

  export type TradeSetupUpdateWithWhereUniqueWithoutStrategyRefInput = {
    where: TradeSetupWhereUniqueInput
    data: XOR<TradeSetupUpdateWithoutStrategyRefInput, TradeSetupUncheckedUpdateWithoutStrategyRefInput>
  }

  export type TradeSetupUpdateManyWithWhereWithoutStrategyRefInput = {
    where: TradeSetupScalarWhereInput
    data: XOR<TradeSetupUpdateManyMutationInput, TradeSetupUncheckedUpdateManyWithoutStrategyRefInput>
  }

  export type TradeTypeUpsertWithWhereUniqueWithoutStrategyInput = {
    where: TradeTypeWhereUniqueInput
    update: XOR<TradeTypeUpdateWithoutStrategyInput, TradeTypeUncheckedUpdateWithoutStrategyInput>
    create: XOR<TradeTypeCreateWithoutStrategyInput, TradeTypeUncheckedCreateWithoutStrategyInput>
  }

  export type TradeTypeUpdateWithWhereUniqueWithoutStrategyInput = {
    where: TradeTypeWhereUniqueInput
    data: XOR<TradeTypeUpdateWithoutStrategyInput, TradeTypeUncheckedUpdateWithoutStrategyInput>
  }

  export type TradeTypeUpdateManyWithWhereWithoutStrategyInput = {
    where: TradeTypeScalarWhereInput
    data: XOR<TradeTypeUpdateManyMutationInput, TradeTypeUncheckedUpdateManyWithoutStrategyInput>
  }

  export type TradeTypeScalarWhereInput = {
    AND?: TradeTypeScalarWhereInput | TradeTypeScalarWhereInput[]
    OR?: TradeTypeScalarWhereInput[]
    NOT?: TradeTypeScalarWhereInput | TradeTypeScalarWhereInput[]
    id?: StringFilter<"TradeType"> | string
    name?: StringFilter<"TradeType"> | string
    strategyId?: StringFilter<"TradeType"> | string
    createdAt?: DateTimeFilter<"TradeType"> | Date | string
  }

  export type StrategyCreateWithoutTradeTypesInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupCreateNestedManyWithoutStrategyRefInput
  }

  export type StrategyUncheckedCreateWithoutTradeTypesInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupUncheckedCreateNestedManyWithoutStrategyRefInput
  }

  export type StrategyCreateOrConnectWithoutTradeTypesInput = {
    where: StrategyWhereUniqueInput
    create: XOR<StrategyCreateWithoutTradeTypesInput, StrategyUncheckedCreateWithoutTradeTypesInput>
  }

  export type StrategyUpsertWithoutTradeTypesInput = {
    update: XOR<StrategyUpdateWithoutTradeTypesInput, StrategyUncheckedUpdateWithoutTradeTypesInput>
    create: XOR<StrategyCreateWithoutTradeTypesInput, StrategyUncheckedCreateWithoutTradeTypesInput>
    where?: StrategyWhereInput
  }

  export type StrategyUpdateToOneWithWhereWithoutTradeTypesInput = {
    where?: StrategyWhereInput
    data: XOR<StrategyUpdateWithoutTradeTypesInput, StrategyUncheckedUpdateWithoutTradeTypesInput>
  }

  export type StrategyUpdateWithoutTradeTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUpdateManyWithoutStrategyRefNestedInput
  }

  export type StrategyUncheckedUpdateWithoutTradeTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUncheckedUpdateManyWithoutStrategyRefNestedInput
  }

  export type NewsEventCreateWithoutSessionInput = {
    id?: string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
    setups?: TradeSetupCreateNestedManyWithoutNewsEventsInput
  }

  export type NewsEventUncheckedCreateWithoutSessionInput = {
    id?: string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
    setups?: TradeSetupUncheckedCreateNestedManyWithoutNewsEventsInput
  }

  export type NewsEventCreateOrConnectWithoutSessionInput = {
    where: NewsEventWhereUniqueInput
    create: XOR<NewsEventCreateWithoutSessionInput, NewsEventUncheckedCreateWithoutSessionInput>
  }

  export type NewsEventCreateManySessionInputEnvelope = {
    data: NewsEventCreateManySessionInput | NewsEventCreateManySessionInput[]
  }

  export type TradeSetupCreateWithoutSessionInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    strategyRef?: StrategyCreateNestedOneWithoutSetupsInput
    newsEvents?: NewsEventCreateNestedManyWithoutSetupsInput
    newsCatalogRef?: NewsCatalogCreateNestedOneWithoutSetupsInput
    executions?: ExecutionCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateWithoutSessionInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSetupsInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupCreateOrConnectWithoutSessionInput = {
    where: TradeSetupWhereUniqueInput
    create: XOR<TradeSetupCreateWithoutSessionInput, TradeSetupUncheckedCreateWithoutSessionInput>
  }

  export type TradeSetupCreateManySessionInputEnvelope = {
    data: TradeSetupCreateManySessionInput | TradeSetupCreateManySessionInput[]
  }

  export type ScreenshotCreateWithoutSessionInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    takenAt?: Date | string | null
    createdAt?: Date | string
    setup?: TradeSetupCreateNestedOneWithoutScreenshotsInput
    execution?: ExecutionCreateNestedOneWithoutScreenshotsInput
  }

  export type ScreenshotUncheckedCreateWithoutSessionInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    setupId?: string | null
    executionId?: string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ScreenshotCreateOrConnectWithoutSessionInput = {
    where: ScreenshotWhereUniqueInput
    create: XOR<ScreenshotCreateWithoutSessionInput, ScreenshotUncheckedCreateWithoutSessionInput>
  }

  export type ScreenshotCreateManySessionInputEnvelope = {
    data: ScreenshotCreateManySessionInput | ScreenshotCreateManySessionInput[]
  }

  export type NewsEventUpsertWithWhereUniqueWithoutSessionInput = {
    where: NewsEventWhereUniqueInput
    update: XOR<NewsEventUpdateWithoutSessionInput, NewsEventUncheckedUpdateWithoutSessionInput>
    create: XOR<NewsEventCreateWithoutSessionInput, NewsEventUncheckedCreateWithoutSessionInput>
  }

  export type NewsEventUpdateWithWhereUniqueWithoutSessionInput = {
    where: NewsEventWhereUniqueInput
    data: XOR<NewsEventUpdateWithoutSessionInput, NewsEventUncheckedUpdateWithoutSessionInput>
  }

  export type NewsEventUpdateManyWithWhereWithoutSessionInput = {
    where: NewsEventScalarWhereInput
    data: XOR<NewsEventUpdateManyMutationInput, NewsEventUncheckedUpdateManyWithoutSessionInput>
  }

  export type NewsEventScalarWhereInput = {
    AND?: NewsEventScalarWhereInput | NewsEventScalarWhereInput[]
    OR?: NewsEventScalarWhereInput[]
    NOT?: NewsEventScalarWhereInput | NewsEventScalarWhereInput[]
    id?: StringFilter<"NewsEvent"> | string
    sessionDate?: DateTimeFilter<"NewsEvent"> | Date | string
    symbol?: StringNullableFilter<"NewsEvent"> | string | null
    headline?: StringFilter<"NewsEvent"> | string
    source?: StringNullableFilter<"NewsEvent"> | string | null
    eventType?: EnumNewsTypeFilter<"NewsEvent"> | $Enums.NewsType
    impact?: EnumNewsImpactFilter<"NewsEvent"> | $Enums.NewsImpact
    notes?: StringNullableFilter<"NewsEvent"> | string | null
    createdAt?: DateTimeFilter<"NewsEvent"> | Date | string
  }

  export type TradeSetupUpsertWithWhereUniqueWithoutSessionInput = {
    where: TradeSetupWhereUniqueInput
    update: XOR<TradeSetupUpdateWithoutSessionInput, TradeSetupUncheckedUpdateWithoutSessionInput>
    create: XOR<TradeSetupCreateWithoutSessionInput, TradeSetupUncheckedCreateWithoutSessionInput>
  }

  export type TradeSetupUpdateWithWhereUniqueWithoutSessionInput = {
    where: TradeSetupWhereUniqueInput
    data: XOR<TradeSetupUpdateWithoutSessionInput, TradeSetupUncheckedUpdateWithoutSessionInput>
  }

  export type TradeSetupUpdateManyWithWhereWithoutSessionInput = {
    where: TradeSetupScalarWhereInput
    data: XOR<TradeSetupUpdateManyMutationInput, TradeSetupUncheckedUpdateManyWithoutSessionInput>
  }

  export type ScreenshotUpsertWithWhereUniqueWithoutSessionInput = {
    where: ScreenshotWhereUniqueInput
    update: XOR<ScreenshotUpdateWithoutSessionInput, ScreenshotUncheckedUpdateWithoutSessionInput>
    create: XOR<ScreenshotCreateWithoutSessionInput, ScreenshotUncheckedCreateWithoutSessionInput>
  }

  export type ScreenshotUpdateWithWhereUniqueWithoutSessionInput = {
    where: ScreenshotWhereUniqueInput
    data: XOR<ScreenshotUpdateWithoutSessionInput, ScreenshotUncheckedUpdateWithoutSessionInput>
  }

  export type ScreenshotUpdateManyWithWhereWithoutSessionInput = {
    where: ScreenshotScalarWhereInput
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyWithoutSessionInput>
  }

  export type ScreenshotScalarWhereInput = {
    AND?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
    OR?: ScreenshotScalarWhereInput[]
    NOT?: ScreenshotScalarWhereInput | ScreenshotScalarWhereInput[]
    id?: StringFilter<"Screenshot"> | string
    filename?: StringFilter<"Screenshot"> | string
    originalName?: StringFilter<"Screenshot"> | string
    filePath?: StringFilter<"Screenshot"> | string
    fileSize?: IntFilter<"Screenshot"> | number
    mimeType?: StringFilter<"Screenshot"> | string
    caption?: StringNullableFilter<"Screenshot"> | string | null
    timeframe?: StringNullableFilter<"Screenshot"> | string | null
    chartTag?: EnumChartTagNullableFilter<"Screenshot"> | $Enums.ChartTag | null
    setupId?: StringNullableFilter<"Screenshot"> | string | null
    executionId?: StringNullableFilter<"Screenshot"> | string | null
    sessionDate?: DateTimeNullableFilter<"Screenshot"> | Date | string | null
    takenAt?: DateTimeNullableFilter<"Screenshot"> | Date | string | null
    createdAt?: DateTimeFilter<"Screenshot"> | Date | string
  }

  export type DailySessionCreateWithoutNewsEventsInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupCreateNestedManyWithoutSessionInput
    screenshots?: ScreenshotCreateNestedManyWithoutSessionInput
  }

  export type DailySessionUncheckedCreateWithoutNewsEventsInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    setups?: TradeSetupUncheckedCreateNestedManyWithoutSessionInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSessionInput
  }

  export type DailySessionCreateOrConnectWithoutNewsEventsInput = {
    where: DailySessionWhereUniqueInput
    create: XOR<DailySessionCreateWithoutNewsEventsInput, DailySessionUncheckedCreateWithoutNewsEventsInput>
  }

  export type TradeSetupCreateWithoutNewsEventsInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: DailySessionCreateNestedOneWithoutSetupsInput
    strategyRef?: StrategyCreateNestedOneWithoutSetupsInput
    newsCatalogRef?: NewsCatalogCreateNestedOneWithoutSetupsInput
    executions?: ExecutionCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateWithoutNewsEventsInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    executions?: ExecutionUncheckedCreateNestedManyWithoutSetupInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupCreateOrConnectWithoutNewsEventsInput = {
    where: TradeSetupWhereUniqueInput
    create: XOR<TradeSetupCreateWithoutNewsEventsInput, TradeSetupUncheckedCreateWithoutNewsEventsInput>
  }

  export type DailySessionUpsertWithoutNewsEventsInput = {
    update: XOR<DailySessionUpdateWithoutNewsEventsInput, DailySessionUncheckedUpdateWithoutNewsEventsInput>
    create: XOR<DailySessionCreateWithoutNewsEventsInput, DailySessionUncheckedCreateWithoutNewsEventsInput>
    where?: DailySessionWhereInput
  }

  export type DailySessionUpdateToOneWithWhereWithoutNewsEventsInput = {
    where?: DailySessionWhereInput
    data: XOR<DailySessionUpdateWithoutNewsEventsInput, DailySessionUncheckedUpdateWithoutNewsEventsInput>
  }

  export type DailySessionUpdateWithoutNewsEventsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUpdateManyWithoutSessionNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSessionNestedInput
  }

  export type DailySessionUncheckedUpdateWithoutNewsEventsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUncheckedUpdateManyWithoutSessionNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type TradeSetupUpsertWithWhereUniqueWithoutNewsEventsInput = {
    where: TradeSetupWhereUniqueInput
    update: XOR<TradeSetupUpdateWithoutNewsEventsInput, TradeSetupUncheckedUpdateWithoutNewsEventsInput>
    create: XOR<TradeSetupCreateWithoutNewsEventsInput, TradeSetupUncheckedCreateWithoutNewsEventsInput>
  }

  export type TradeSetupUpdateWithWhereUniqueWithoutNewsEventsInput = {
    where: TradeSetupWhereUniqueInput
    data: XOR<TradeSetupUpdateWithoutNewsEventsInput, TradeSetupUncheckedUpdateWithoutNewsEventsInput>
  }

  export type TradeSetupUpdateManyWithWhereWithoutNewsEventsInput = {
    where: TradeSetupScalarWhereInput
    data: XOR<TradeSetupUpdateManyMutationInput, TradeSetupUncheckedUpdateManyWithoutNewsEventsInput>
  }

  export type DailySessionCreateWithoutSetupsInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventCreateNestedManyWithoutSessionInput
    screenshots?: ScreenshotCreateNestedManyWithoutSessionInput
  }

  export type DailySessionUncheckedCreateWithoutSetupsInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSessionInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSessionInput
  }

  export type DailySessionCreateOrConnectWithoutSetupsInput = {
    where: DailySessionWhereUniqueInput
    create: XOR<DailySessionCreateWithoutSetupsInput, DailySessionUncheckedCreateWithoutSetupsInput>
  }

  export type StrategyCreateWithoutSetupsInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tradeTypes?: TradeTypeCreateNestedManyWithoutStrategyInput
  }

  export type StrategyUncheckedCreateWithoutSetupsInput = {
    id?: string
    name: string
    description?: string | null
    isActive?: boolean
    mindmapData?: string
    ruleHistory?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tradeTypes?: TradeTypeUncheckedCreateNestedManyWithoutStrategyInput
  }

  export type StrategyCreateOrConnectWithoutSetupsInput = {
    where: StrategyWhereUniqueInput
    create: XOR<StrategyCreateWithoutSetupsInput, StrategyUncheckedCreateWithoutSetupsInput>
  }

  export type NewsEventCreateWithoutSetupsInput = {
    id?: string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
    session: DailySessionCreateNestedOneWithoutNewsEventsInput
  }

  export type NewsEventUncheckedCreateWithoutSetupsInput = {
    id?: string
    sessionDate: Date | string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
  }

  export type NewsEventCreateOrConnectWithoutSetupsInput = {
    where: NewsEventWhereUniqueInput
    create: XOR<NewsEventCreateWithoutSetupsInput, NewsEventUncheckedCreateWithoutSetupsInput>
  }

  export type NewsCatalogCreateWithoutSetupsInput = {
    id?: string
    name: string
    category: string
    subCategory?: string | null
    strength: $Enums.NewsStrength
    description?: string | null
    entryConditions?: string | null
    riskFactors?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NewsCatalogUncheckedCreateWithoutSetupsInput = {
    id?: string
    name: string
    category: string
    subCategory?: string | null
    strength: $Enums.NewsStrength
    description?: string | null
    entryConditions?: string | null
    riskFactors?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NewsCatalogCreateOrConnectWithoutSetupsInput = {
    where: NewsCatalogWhereUniqueInput
    create: XOR<NewsCatalogCreateWithoutSetupsInput, NewsCatalogUncheckedCreateWithoutSetupsInput>
  }

  export type ExecutionCreateWithoutSetupInput = {
    id?: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
    screenshots?: ScreenshotCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionUncheckedCreateWithoutSetupInput = {
    id?: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutExecutionInput
  }

  export type ExecutionCreateOrConnectWithoutSetupInput = {
    where: ExecutionWhereUniqueInput
    create: XOR<ExecutionCreateWithoutSetupInput, ExecutionUncheckedCreateWithoutSetupInput>
  }

  export type ExecutionCreateManySetupInputEnvelope = {
    data: ExecutionCreateManySetupInput | ExecutionCreateManySetupInput[]
  }

  export type ScreenshotCreateWithoutSetupInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    takenAt?: Date | string | null
    createdAt?: Date | string
    execution?: ExecutionCreateNestedOneWithoutScreenshotsInput
    session?: DailySessionCreateNestedOneWithoutScreenshotsInput
  }

  export type ScreenshotUncheckedCreateWithoutSetupInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    executionId?: string | null
    sessionDate?: Date | string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ScreenshotCreateOrConnectWithoutSetupInput = {
    where: ScreenshotWhereUniqueInput
    create: XOR<ScreenshotCreateWithoutSetupInput, ScreenshotUncheckedCreateWithoutSetupInput>
  }

  export type ScreenshotCreateManySetupInputEnvelope = {
    data: ScreenshotCreateManySetupInput | ScreenshotCreateManySetupInput[]
  }

  export type DailySessionUpsertWithoutSetupsInput = {
    update: XOR<DailySessionUpdateWithoutSetupsInput, DailySessionUncheckedUpdateWithoutSetupsInput>
    create: XOR<DailySessionCreateWithoutSetupsInput, DailySessionUncheckedCreateWithoutSetupsInput>
    where?: DailySessionWhereInput
  }

  export type DailySessionUpdateToOneWithWhereWithoutSetupsInput = {
    where?: DailySessionWhereInput
    data: XOR<DailySessionUpdateWithoutSetupsInput, DailySessionUncheckedUpdateWithoutSetupsInput>
  }

  export type DailySessionUpdateWithoutSetupsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUpdateManyWithoutSessionNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSessionNestedInput
  }

  export type DailySessionUncheckedUpdateWithoutSetupsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSessionNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type StrategyUpsertWithoutSetupsInput = {
    update: XOR<StrategyUpdateWithoutSetupsInput, StrategyUncheckedUpdateWithoutSetupsInput>
    create: XOR<StrategyCreateWithoutSetupsInput, StrategyUncheckedCreateWithoutSetupsInput>
    where?: StrategyWhereInput
  }

  export type StrategyUpdateToOneWithWhereWithoutSetupsInput = {
    where?: StrategyWhereInput
    data: XOR<StrategyUpdateWithoutSetupsInput, StrategyUncheckedUpdateWithoutSetupsInput>
  }

  export type StrategyUpdateWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeTypes?: TradeTypeUpdateManyWithoutStrategyNestedInput
  }

  export type StrategyUncheckedUpdateWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mindmapData?: StringFieldUpdateOperationsInput | string
    ruleHistory?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeTypes?: TradeTypeUncheckedUpdateManyWithoutStrategyNestedInput
  }

  export type NewsEventUpsertWithWhereUniqueWithoutSetupsInput = {
    where: NewsEventWhereUniqueInput
    update: XOR<NewsEventUpdateWithoutSetupsInput, NewsEventUncheckedUpdateWithoutSetupsInput>
    create: XOR<NewsEventCreateWithoutSetupsInput, NewsEventUncheckedCreateWithoutSetupsInput>
  }

  export type NewsEventUpdateWithWhereUniqueWithoutSetupsInput = {
    where: NewsEventWhereUniqueInput
    data: XOR<NewsEventUpdateWithoutSetupsInput, NewsEventUncheckedUpdateWithoutSetupsInput>
  }

  export type NewsEventUpdateManyWithWhereWithoutSetupsInput = {
    where: NewsEventScalarWhereInput
    data: XOR<NewsEventUpdateManyMutationInput, NewsEventUncheckedUpdateManyWithoutSetupsInput>
  }

  export type NewsCatalogUpsertWithoutSetupsInput = {
    update: XOR<NewsCatalogUpdateWithoutSetupsInput, NewsCatalogUncheckedUpdateWithoutSetupsInput>
    create: XOR<NewsCatalogCreateWithoutSetupsInput, NewsCatalogUncheckedCreateWithoutSetupsInput>
    where?: NewsCatalogWhereInput
  }

  export type NewsCatalogUpdateToOneWithWhereWithoutSetupsInput = {
    where?: NewsCatalogWhereInput
    data: XOR<NewsCatalogUpdateWithoutSetupsInput, NewsCatalogUncheckedUpdateWithoutSetupsInput>
  }

  export type NewsCatalogUpdateWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subCategory?: NullableStringFieldUpdateOperationsInput | string | null
    strength?: EnumNewsStrengthFieldUpdateOperationsInput | $Enums.NewsStrength
    description?: NullableStringFieldUpdateOperationsInput | string | null
    entryConditions?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsCatalogUncheckedUpdateWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subCategory?: NullableStringFieldUpdateOperationsInput | string | null
    strength?: EnumNewsStrengthFieldUpdateOperationsInput | $Enums.NewsStrength
    description?: NullableStringFieldUpdateOperationsInput | string | null
    entryConditions?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionUpsertWithWhereUniqueWithoutSetupInput = {
    where: ExecutionWhereUniqueInput
    update: XOR<ExecutionUpdateWithoutSetupInput, ExecutionUncheckedUpdateWithoutSetupInput>
    create: XOR<ExecutionCreateWithoutSetupInput, ExecutionUncheckedCreateWithoutSetupInput>
  }

  export type ExecutionUpdateWithWhereUniqueWithoutSetupInput = {
    where: ExecutionWhereUniqueInput
    data: XOR<ExecutionUpdateWithoutSetupInput, ExecutionUncheckedUpdateWithoutSetupInput>
  }

  export type ExecutionUpdateManyWithWhereWithoutSetupInput = {
    where: ExecutionScalarWhereInput
    data: XOR<ExecutionUpdateManyMutationInput, ExecutionUncheckedUpdateManyWithoutSetupInput>
  }

  export type ExecutionScalarWhereInput = {
    AND?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
    OR?: ExecutionScalarWhereInput[]
    NOT?: ExecutionScalarWhereInput | ExecutionScalarWhereInput[]
    id?: StringFilter<"Execution"> | string
    setupId?: StringFilter<"Execution"> | string
    entryPrice?: FloatFilter<"Execution"> | number
    exitPrice?: FloatNullableFilter<"Execution"> | number | null
    quantity?: IntFilter<"Execution"> | number
    entryTime?: DateTimeFilter<"Execution"> | Date | string
    exitTime?: DateTimeNullableFilter<"Execution"> | Date | string | null
    commission?: FloatFilter<"Execution"> | number
    pnl?: FloatNullableFilter<"Execution"> | number | null
    actualDirection?: EnumDirectionNullableFilter<"Execution"> | $Enums.Direction | null
    entryConditionMet?: BoolNullableFilter<"Execution"> | boolean | null
    entryConditionNotes?: StringNullableFilter<"Execution"> | string | null
    exitConditionMet?: BoolNullableFilter<"Execution"> | boolean | null
    exitConditionNotes?: StringNullableFilter<"Execution"> | string | null
    executionGrade?: EnumGradeNullableFilter<"Execution"> | $Enums.Grade | null
    executionNotes?: StringNullableFilter<"Execution"> | string | null
    createdAt?: DateTimeFilter<"Execution"> | Date | string
  }

  export type ScreenshotUpsertWithWhereUniqueWithoutSetupInput = {
    where: ScreenshotWhereUniqueInput
    update: XOR<ScreenshotUpdateWithoutSetupInput, ScreenshotUncheckedUpdateWithoutSetupInput>
    create: XOR<ScreenshotCreateWithoutSetupInput, ScreenshotUncheckedCreateWithoutSetupInput>
  }

  export type ScreenshotUpdateWithWhereUniqueWithoutSetupInput = {
    where: ScreenshotWhereUniqueInput
    data: XOR<ScreenshotUpdateWithoutSetupInput, ScreenshotUncheckedUpdateWithoutSetupInput>
  }

  export type ScreenshotUpdateManyWithWhereWithoutSetupInput = {
    where: ScreenshotScalarWhereInput
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyWithoutSetupInput>
  }

  export type TradeSetupCreateWithoutExecutionsInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: DailySessionCreateNestedOneWithoutSetupsInput
    strategyRef?: StrategyCreateNestedOneWithoutSetupsInput
    newsEvents?: NewsEventCreateNestedManyWithoutSetupsInput
    newsCatalogRef?: NewsCatalogCreateNestedOneWithoutSetupsInput
    screenshots?: ScreenshotCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateWithoutExecutionsInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSetupsInput
    screenshots?: ScreenshotUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupCreateOrConnectWithoutExecutionsInput = {
    where: TradeSetupWhereUniqueInput
    create: XOR<TradeSetupCreateWithoutExecutionsInput, TradeSetupUncheckedCreateWithoutExecutionsInput>
  }

  export type ScreenshotCreateWithoutExecutionInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    takenAt?: Date | string | null
    createdAt?: Date | string
    setup?: TradeSetupCreateNestedOneWithoutScreenshotsInput
    session?: DailySessionCreateNestedOneWithoutScreenshotsInput
  }

  export type ScreenshotUncheckedCreateWithoutExecutionInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    setupId?: string | null
    sessionDate?: Date | string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ScreenshotCreateOrConnectWithoutExecutionInput = {
    where: ScreenshotWhereUniqueInput
    create: XOR<ScreenshotCreateWithoutExecutionInput, ScreenshotUncheckedCreateWithoutExecutionInput>
  }

  export type ScreenshotCreateManyExecutionInputEnvelope = {
    data: ScreenshotCreateManyExecutionInput | ScreenshotCreateManyExecutionInput[]
  }

  export type TradeSetupUpsertWithoutExecutionsInput = {
    update: XOR<TradeSetupUpdateWithoutExecutionsInput, TradeSetupUncheckedUpdateWithoutExecutionsInput>
    create: XOR<TradeSetupCreateWithoutExecutionsInput, TradeSetupUncheckedCreateWithoutExecutionsInput>
    where?: TradeSetupWhereInput
  }

  export type TradeSetupUpdateToOneWithWhereWithoutExecutionsInput = {
    where?: TradeSetupWhereInput
    data: XOR<TradeSetupUpdateWithoutExecutionsInput, TradeSetupUncheckedUpdateWithoutExecutionsInput>
  }

  export type TradeSetupUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutSetupsNestedInput
    strategyRef?: StrategyUpdateOneWithoutSetupsNestedInput
    newsEvents?: NewsEventUpdateManyWithoutSetupsNestedInput
    newsCatalogRef?: NewsCatalogUpdateOneWithoutSetupsNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSetupsNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type ScreenshotUpsertWithWhereUniqueWithoutExecutionInput = {
    where: ScreenshotWhereUniqueInput
    update: XOR<ScreenshotUpdateWithoutExecutionInput, ScreenshotUncheckedUpdateWithoutExecutionInput>
    create: XOR<ScreenshotCreateWithoutExecutionInput, ScreenshotUncheckedCreateWithoutExecutionInput>
  }

  export type ScreenshotUpdateWithWhereUniqueWithoutExecutionInput = {
    where: ScreenshotWhereUniqueInput
    data: XOR<ScreenshotUpdateWithoutExecutionInput, ScreenshotUncheckedUpdateWithoutExecutionInput>
  }

  export type ScreenshotUpdateManyWithWhereWithoutExecutionInput = {
    where: ScreenshotScalarWhereInput
    data: XOR<ScreenshotUpdateManyMutationInput, ScreenshotUncheckedUpdateManyWithoutExecutionInput>
  }

  export type TradeSetupCreateWithoutScreenshotsInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: DailySessionCreateNestedOneWithoutSetupsInput
    strategyRef?: StrategyCreateNestedOneWithoutSetupsInput
    newsEvents?: NewsEventCreateNestedManyWithoutSetupsInput
    newsCatalogRef?: NewsCatalogCreateNestedOneWithoutSetupsInput
    executions?: ExecutionCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupUncheckedCreateWithoutScreenshotsInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSetupsInput
    executions?: ExecutionUncheckedCreateNestedManyWithoutSetupInput
  }

  export type TradeSetupCreateOrConnectWithoutScreenshotsInput = {
    where: TradeSetupWhereUniqueInput
    create: XOR<TradeSetupCreateWithoutScreenshotsInput, TradeSetupUncheckedCreateWithoutScreenshotsInput>
  }

  export type ExecutionCreateWithoutScreenshotsInput = {
    id?: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
    setup: TradeSetupCreateNestedOneWithoutExecutionsInput
  }

  export type ExecutionUncheckedCreateWithoutScreenshotsInput = {
    id?: string
    setupId: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
  }

  export type ExecutionCreateOrConnectWithoutScreenshotsInput = {
    where: ExecutionWhereUniqueInput
    create: XOR<ExecutionCreateWithoutScreenshotsInput, ExecutionUncheckedCreateWithoutScreenshotsInput>
  }

  export type DailySessionCreateWithoutScreenshotsInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventCreateNestedManyWithoutSessionInput
    setups?: TradeSetupCreateNestedManyWithoutSessionInput
  }

  export type DailySessionUncheckedCreateWithoutScreenshotsInput = {
    date: Date | string
    marketContext?: string | null
    preMarketPlan?: string | null
    selectedStrategy?: string
    postReview?: string | null
    lessonsLearned?: string | null
    whatWentWell?: string | null
    planFollowed?: number | null
    emotionRating?: number | null
    focusRating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    newsEvents?: NewsEventUncheckedCreateNestedManyWithoutSessionInput
    setups?: TradeSetupUncheckedCreateNestedManyWithoutSessionInput
  }

  export type DailySessionCreateOrConnectWithoutScreenshotsInput = {
    where: DailySessionWhereUniqueInput
    create: XOR<DailySessionCreateWithoutScreenshotsInput, DailySessionUncheckedCreateWithoutScreenshotsInput>
  }

  export type TradeSetupUpsertWithoutScreenshotsInput = {
    update: XOR<TradeSetupUpdateWithoutScreenshotsInput, TradeSetupUncheckedUpdateWithoutScreenshotsInput>
    create: XOR<TradeSetupCreateWithoutScreenshotsInput, TradeSetupUncheckedCreateWithoutScreenshotsInput>
    where?: TradeSetupWhereInput
  }

  export type TradeSetupUpdateToOneWithWhereWithoutScreenshotsInput = {
    where?: TradeSetupWhereInput
    data: XOR<TradeSetupUpdateWithoutScreenshotsInput, TradeSetupUncheckedUpdateWithoutScreenshotsInput>
  }

  export type TradeSetupUpdateWithoutScreenshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutSetupsNestedInput
    strategyRef?: StrategyUpdateOneWithoutSetupsNestedInput
    newsEvents?: NewsEventUpdateManyWithoutSetupsNestedInput
    newsCatalogRef?: NewsCatalogUpdateOneWithoutSetupsNestedInput
    executions?: ExecutionUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateWithoutScreenshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSetupsNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type ExecutionUpsertWithoutScreenshotsInput = {
    update: XOR<ExecutionUpdateWithoutScreenshotsInput, ExecutionUncheckedUpdateWithoutScreenshotsInput>
    create: XOR<ExecutionCreateWithoutScreenshotsInput, ExecutionUncheckedCreateWithoutScreenshotsInput>
    where?: ExecutionWhereInput
  }

  export type ExecutionUpdateToOneWithWhereWithoutScreenshotsInput = {
    where?: ExecutionWhereInput
    data: XOR<ExecutionUpdateWithoutScreenshotsInput, ExecutionUncheckedUpdateWithoutScreenshotsInput>
  }

  export type ExecutionUpdateWithoutScreenshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setup?: TradeSetupUpdateOneRequiredWithoutExecutionsNestedInput
  }

  export type ExecutionUncheckedUpdateWithoutScreenshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    setupId?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailySessionUpsertWithoutScreenshotsInput = {
    update: XOR<DailySessionUpdateWithoutScreenshotsInput, DailySessionUncheckedUpdateWithoutScreenshotsInput>
    create: XOR<DailySessionCreateWithoutScreenshotsInput, DailySessionUncheckedCreateWithoutScreenshotsInput>
    where?: DailySessionWhereInput
  }

  export type DailySessionUpdateToOneWithWhereWithoutScreenshotsInput = {
    where?: DailySessionWhereInput
    data: XOR<DailySessionUpdateWithoutScreenshotsInput, DailySessionUncheckedUpdateWithoutScreenshotsInput>
  }

  export type DailySessionUpdateWithoutScreenshotsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUpdateManyWithoutSessionNestedInput
    setups?: TradeSetupUpdateManyWithoutSessionNestedInput
  }

  export type DailySessionUncheckedUpdateWithoutScreenshotsInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    marketContext?: NullableStringFieldUpdateOperationsInput | string | null
    preMarketPlan?: NullableStringFieldUpdateOperationsInput | string | null
    selectedStrategy?: StringFieldUpdateOperationsInput | string
    postReview?: NullableStringFieldUpdateOperationsInput | string | null
    lessonsLearned?: NullableStringFieldUpdateOperationsInput | string | null
    whatWentWell?: NullableStringFieldUpdateOperationsInput | string | null
    planFollowed?: NullableIntFieldUpdateOperationsInput | number | null
    emotionRating?: NullableIntFieldUpdateOperationsInput | number | null
    focusRating?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSessionNestedInput
    setups?: TradeSetupUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type TradeSetupCreateManyNewsCatalogRefInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeSetupUpdateWithoutNewsCatalogRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutSetupsNestedInput
    strategyRef?: StrategyUpdateOneWithoutSetupsNestedInput
    newsEvents?: NewsEventUpdateManyWithoutSetupsNestedInput
    executions?: ExecutionUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateWithoutNewsCatalogRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSetupsNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateManyWithoutNewsCatalogRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeSetupCreateManyStrategyRefInput = {
    id?: string
    sessionDate: Date | string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeTypeCreateManyStrategyInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type TradeSetupUpdateWithoutStrategyRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutSetupsNestedInput
    newsEvents?: NewsEventUpdateManyWithoutSetupsNestedInput
    newsCatalogRef?: NewsCatalogUpdateOneWithoutSetupsNestedInput
    executions?: ExecutionUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateWithoutStrategyRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSetupsNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateManyWithoutStrategyRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeTypeUpdateWithoutStrategyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeTypeUncheckedUpdateWithoutStrategyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeTypeUncheckedUpdateManyWithoutStrategyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventCreateManySessionInput = {
    id?: string
    symbol?: string | null
    headline: string
    source?: string | null
    eventType: $Enums.NewsType
    impact: $Enums.NewsImpact
    notes?: string | null
    createdAt?: Date | string
  }

  export type TradeSetupCreateManySessionInput = {
    id?: string
    symbol: string
    direction: $Enums.Direction
    priceTier?: $Enums.PriceTier | null
    marketCapTier?: $Enums.MarketCapTier | null
    strategy?: string | null
    strategyId?: string | null
    setupLogic?: string | null
    newsType?: $Enums.NewsType | null
    newsImpact?: $Enums.NewsImpact | null
    newsHeadline?: string | null
    newsCatalogId?: string | null
    entryCondition?: string | null
    entryPriceNote?: string | null
    entryPriceExact?: number | null
    stopCondition?: string | null
    stopPriceNote?: string | null
    stopPriceExact?: number | null
    target1Condition?: string | null
    target1PriceNote?: string | null
    target1PriceExact?: number | null
    target2Condition?: string | null
    target2PriceNote?: string | null
    target2PriceExact?: number | null
    plannedRiskReward?: number | null
    plannedSize?: number | null
    status?: $Enums.SetupStatus
    missedReason?: $Enums.MissedReason | null
    missedNotes?: string | null
    missedHypoPnL?: number | null
    stockSelectionAccurate?: boolean | null
    stockSelectionNote?: string | null
    analysisAccurate?: boolean | null
    analysisAccurateNote?: string | null
    marketJudgmentAccurate?: boolean | null
    marketJudgmentNote?: string | null
    strategySelectionAccurate?: boolean | null
    strategySelectionNote?: string | null
    entryOpportunityAccurate?: boolean | null
    entryOpportunityNote?: string | null
    exitOpportunityAccurate?: boolean | null
    exitOpportunityNote?: string | null
    actualEntryOpportunity?: string | null
    actualExitOpportunity?: string | null
    dailySummary?: string | null
    selectedTradeTypes?: string
    setupGrade?: $Enums.Grade | null
    setupNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScreenshotCreateManySessionInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    setupId?: string | null
    executionId?: string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsEventUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUpdateManyWithoutNewsEventsNestedInput
  }

  export type NewsEventUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setups?: TradeSetupUncheckedUpdateManyWithoutNewsEventsNestedInput
  }

  export type NewsEventUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeSetupUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    strategyRef?: StrategyUpdateOneWithoutSetupsNestedInput
    newsEvents?: NewsEventUpdateManyWithoutSetupsNestedInput
    newsCatalogRef?: NewsCatalogUpdateOneWithoutSetupsNestedInput
    executions?: ExecutionUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsEvents?: NewsEventUncheckedUpdateManyWithoutSetupsNestedInput
    executions?: ExecutionUncheckedUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setup?: TradeSetupUpdateOneWithoutScreenshotsNestedInput
    execution?: ExecutionUpdateOneWithoutScreenshotsNestedInput
  }

  export type ScreenshotUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    setupId?: NullableStringFieldUpdateOperationsInput | string | null
    executionId?: NullableStringFieldUpdateOperationsInput | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    setupId?: NullableStringFieldUpdateOperationsInput | string | null
    executionId?: NullableStringFieldUpdateOperationsInput | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeSetupUpdateWithoutNewsEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutSetupsNestedInput
    strategyRef?: StrategyUpdateOneWithoutSetupsNestedInput
    newsCatalogRef?: NewsCatalogUpdateOneWithoutSetupsNestedInput
    executions?: ExecutionUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateWithoutNewsEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    executions?: ExecutionUncheckedUpdateManyWithoutSetupNestedInput
    screenshots?: ScreenshotUncheckedUpdateManyWithoutSetupNestedInput
  }

  export type TradeSetupUncheckedUpdateManyWithoutNewsEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    direction?: EnumDirectionFieldUpdateOperationsInput | $Enums.Direction
    priceTier?: NullableEnumPriceTierFieldUpdateOperationsInput | $Enums.PriceTier | null
    marketCapTier?: NullableEnumMarketCapTierFieldUpdateOperationsInput | $Enums.MarketCapTier | null
    strategy?: NullableStringFieldUpdateOperationsInput | string | null
    strategyId?: NullableStringFieldUpdateOperationsInput | string | null
    setupLogic?: NullableStringFieldUpdateOperationsInput | string | null
    newsType?: NullableEnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType | null
    newsImpact?: NullableEnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact | null
    newsHeadline?: NullableStringFieldUpdateOperationsInput | string | null
    newsCatalogId?: NullableStringFieldUpdateOperationsInput | string | null
    entryCondition?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    stopCondition?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    stopPriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target1Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target1PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    target2Condition?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceNote?: NullableStringFieldUpdateOperationsInput | string | null
    target2PriceExact?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedRiskReward?: NullableFloatFieldUpdateOperationsInput | number | null
    plannedSize?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumSetupStatusFieldUpdateOperationsInput | $Enums.SetupStatus
    missedReason?: NullableEnumMissedReasonFieldUpdateOperationsInput | $Enums.MissedReason | null
    missedNotes?: NullableStringFieldUpdateOperationsInput | string | null
    missedHypoPnL?: NullableFloatFieldUpdateOperationsInput | number | null
    stockSelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    stockSelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    analysisAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    analysisAccurateNote?: NullableStringFieldUpdateOperationsInput | string | null
    marketJudgmentAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    marketJudgmentNote?: NullableStringFieldUpdateOperationsInput | string | null
    strategySelectionAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    strategySelectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    entryOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    exitOpportunityAccurate?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitOpportunityNote?: NullableStringFieldUpdateOperationsInput | string | null
    actualEntryOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    actualExitOpportunity?: NullableStringFieldUpdateOperationsInput | string | null
    dailySummary?: NullableStringFieldUpdateOperationsInput | string | null
    selectedTradeTypes?: StringFieldUpdateOperationsInput | string
    setupGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    setupNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionCreateManySetupInput = {
    id?: string
    entryPrice: number
    exitPrice?: number | null
    quantity: number
    entryTime: Date | string
    exitTime?: Date | string | null
    commission?: number
    pnl?: number | null
    actualDirection?: $Enums.Direction | null
    entryConditionMet?: boolean | null
    entryConditionNotes?: string | null
    exitConditionMet?: boolean | null
    exitConditionNotes?: string | null
    executionGrade?: $Enums.Grade | null
    executionNotes?: string | null
    createdAt?: Date | string
  }

  export type ScreenshotCreateManySetupInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    executionId?: string | null
    sessionDate?: Date | string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsEventUpdateWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: DailySessionUpdateOneRequiredWithoutNewsEventsNestedInput
  }

  export type NewsEventUncheckedUpdateWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsEventUncheckedUpdateManyWithoutSetupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumNewsTypeFieldUpdateOperationsInput | $Enums.NewsType
    impact?: EnumNewsImpactFieldUpdateOperationsInput | $Enums.NewsImpact
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExecutionUpdateWithoutSetupInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    screenshots?: ScreenshotUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateWithoutSetupInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    screenshots?: ScreenshotUncheckedUpdateManyWithoutExecutionNestedInput
  }

  export type ExecutionUncheckedUpdateManyWithoutSetupInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryPrice?: FloatFieldUpdateOperationsInput | number
    exitPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: IntFieldUpdateOperationsInput | number
    entryTime?: DateTimeFieldUpdateOperationsInput | Date | string
    exitTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commission?: FloatFieldUpdateOperationsInput | number
    pnl?: NullableFloatFieldUpdateOperationsInput | number | null
    actualDirection?: NullableEnumDirectionFieldUpdateOperationsInput | $Enums.Direction | null
    entryConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    entryConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    exitConditionMet?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exitConditionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    executionGrade?: NullableEnumGradeFieldUpdateOperationsInput | $Enums.Grade | null
    executionNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotUpdateWithoutSetupInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    execution?: ExecutionUpdateOneWithoutScreenshotsNestedInput
    session?: DailySessionUpdateOneWithoutScreenshotsNestedInput
  }

  export type ScreenshotUncheckedUpdateWithoutSetupInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    executionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotUncheckedUpdateManyWithoutSetupInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    executionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotCreateManyExecutionInput = {
    id?: string
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    caption?: string | null
    timeframe?: string | null
    chartTag?: $Enums.ChartTag | null
    setupId?: string | null
    sessionDate?: Date | string | null
    takenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ScreenshotUpdateWithoutExecutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    setup?: TradeSetupUpdateOneWithoutScreenshotsNestedInput
    session?: DailySessionUpdateOneWithoutScreenshotsNestedInput
  }

  export type ScreenshotUncheckedUpdateWithoutExecutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    setupId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScreenshotUncheckedUpdateManyWithoutExecutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    timeframe?: NullableStringFieldUpdateOperationsInput | string | null
    chartTag?: NullableEnumChartTagFieldUpdateOperationsInput | $Enums.ChartTag | null
    setupId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    takenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}