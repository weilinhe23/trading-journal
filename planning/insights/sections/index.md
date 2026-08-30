<!-- SECTION_MANIFEST
section-01-database-foundation
section-02-core-types-and-text
section-03-server-services
section-04-api-routes
section-05-insights-interface
section-06-weekly-integration-and-backfill
section-07-verification-and-release
END_MANIFEST -->

# 核心经验库实施章节索引

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
| --- | --- | --- | --- |
| section-01-database-foundation | - | 03, 04, 06, 07 | 可与 02 并行，但应用 Schema 前必须独占数据库写入 |
| section-02-core-types-and-text | - | 03, 04, 05, 07 | 可与 01 并行 |
| section-03-server-services | 01, 02 | 04, 05, 06, 07 | 否 |
| section-04-api-routes | 01, 02, 03 | 05, 06, 07 | 可与 05 的静态骨架并行 |
| section-05-insights-interface | 02, 03, 04 | 06, 07 | 否 |
| section-06-weekly-integration-and-backfill | 01, 02, 03, 04, 05 | 07 | 否 |
| section-07-verification-and-release | 01–06 | - | 否 |

## Execution Order

1. `section-01-database-foundation` 与 `section-02-core-types-and-text` 可以并行开始。
2. 两者完成后执行 `section-03-server-services`。
3. 服务层完成后执行 `section-04-api-routes`；`section-05-insights-interface` 可先建立静态骨架，但完整联调等待 API。
4. API 和经验库页面稳定后执行 `section-06-weekly-integration-and-backfill`。
5. 最后执行 `section-07-verification-and-release`。

## Section Summaries

### section-01-database-foundation

检查工作区、建立 SQLite 安全备份和旧数据基线，新增 Insight/InsightSource Schema、关系与索引，运行 `pnpm db:push` 并验证回滚路径。

### section-02-core-types-and-text

新增经验库 DTO、拆分、规范化、hash、标签提取、候选排序、JSON 标签解析和客户端筛选纯函数，并配置 Vitest 单元测试。

### section-03-server-services

实现幂等周报同步、DTO 聚合、来源状态守卫、经验 CRUD、合并事务和历史回填服务，处理历史来源和非周一日期。

### section-04-api-routes

建立 Insight、InsightSource、单周重试和历史回填 Route Handler，统一 Zod 校验、400/404/409/500 响应，并把非阻塞同步接入周报 PUT。

### section-05-insights-interface

建立 `/insights` 服务端页面和客户端组件，实现查看、搜索、标签、排序、来源回溯、待整理、创建、编辑、置顶、归档、恢复和合并交互。

### section-06-weekly-integration-and-backfill

在顶栏、周报列表和周报详情中接入经验库入口、待整理数量、同步提示和重试；实现历史 dry-run、正式回填及幂等核对。

### section-07-verification-and-release

执行单元/服务测试、类型检查、lint、build 和完整手工验收；核对旧周报不变、数据库备份有效、回填幂等，并整理上线与回滚记录。
