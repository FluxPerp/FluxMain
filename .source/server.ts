// @ts-nocheck
import * as __fd_glob_26 from "../content/docs/trading/perpetual-futures-101.mdx?collection=docs"
import * as __fd_glob_25 from "../content/docs/trading/margin-leverage.mdx?collection=docs"
import * as __fd_glob_24 from "../content/docs/trading/funding-rate.mdx?collection=docs"
import * as __fd_glob_23 from "../content/docs/technical/sdk.mdx?collection=docs"
import * as __fd_glob_22 from "../content/docs/resources/changelog.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/introduction/what-is-fluxperp.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/introduction/quick-start.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/introduction/architecture.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/core-concepts/order-types.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/core-concepts/margin-leverage.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/core-concepts/liquidation.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/core-concepts/funding-rate.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/core-concepts/fee-structure.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/api-reference/sdk.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/api-reference/rest-endpoints.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_10 } from "../content/docs/websocket/meta.json?collection=docs"
import { default as __fd_glob_9 } from "../content/docs/trading-guide/meta.json?collection=docs"
import { default as __fd_glob_8 } from "../content/docs/trading/meta.json?collection=docs"
import { default as __fd_glob_7 } from "../content/docs/sdk/meta.json?collection=docs"
import { default as __fd_glob_6 } from "../content/docs/technical/meta.json?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/resources/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/introduction/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/api-reference/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/flux-token/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/core-concepts/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "core-concepts/meta.json": __fd_glob_1, "flux-token/meta.json": __fd_glob_2, "api-reference/meta.json": __fd_glob_3, "introduction/meta.json": __fd_glob_4, "resources/meta.json": __fd_glob_5, "technical/meta.json": __fd_glob_6, "sdk/meta.json": __fd_glob_7, "trading/meta.json": __fd_glob_8, "trading-guide/meta.json": __fd_glob_9, "websocket/meta.json": __fd_glob_10, }, {"index.mdx": __fd_glob_11, "api-reference/rest-endpoints.mdx": __fd_glob_12, "api-reference/sdk.mdx": __fd_glob_13, "core-concepts/fee-structure.mdx": __fd_glob_14, "core-concepts/funding-rate.mdx": __fd_glob_15, "core-concepts/liquidation.mdx": __fd_glob_16, "core-concepts/margin-leverage.mdx": __fd_glob_17, "core-concepts/order-types.mdx": __fd_glob_18, "introduction/architecture.mdx": __fd_glob_19, "introduction/quick-start.mdx": __fd_glob_20, "introduction/what-is-fluxperp.mdx": __fd_glob_21, "resources/changelog.mdx": __fd_glob_22, "technical/sdk.mdx": __fd_glob_23, "trading/funding-rate.mdx": __fd_glob_24, "trading/margin-leverage.mdx": __fd_glob_25, "trading/perpetual-futures-101.mdx": __fd_glob_26, });