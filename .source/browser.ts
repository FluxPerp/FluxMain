// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "api-reference/rest-endpoints.mdx": () => import("../content/docs/api-reference/rest-endpoints.mdx?collection=docs"), "api-reference/sdk.mdx": () => import("../content/docs/api-reference/sdk.mdx?collection=docs"), "core-concepts/fee-structure.mdx": () => import("../content/docs/core-concepts/fee-structure.mdx?collection=docs"), "core-concepts/funding-rate.mdx": () => import("../content/docs/core-concepts/funding-rate.mdx?collection=docs"), "core-concepts/liquidation.mdx": () => import("../content/docs/core-concepts/liquidation.mdx?collection=docs"), "core-concepts/margin-leverage.mdx": () => import("../content/docs/core-concepts/margin-leverage.mdx?collection=docs"), "core-concepts/order-types.mdx": () => import("../content/docs/core-concepts/order-types.mdx?collection=docs"), "introduction/architecture.mdx": () => import("../content/docs/introduction/architecture.mdx?collection=docs"), "introduction/quick-start.mdx": () => import("../content/docs/introduction/quick-start.mdx?collection=docs"), "introduction/what-is-fluxperp.mdx": () => import("../content/docs/introduction/what-is-fluxperp.mdx?collection=docs"), "resources/changelog.mdx": () => import("../content/docs/resources/changelog.mdx?collection=docs"), "technical/sdk.mdx": () => import("../content/docs/technical/sdk.mdx?collection=docs"), "trading/funding-rate.mdx": () => import("../content/docs/trading/funding-rate.mdx?collection=docs"), "trading/margin-leverage.mdx": () => import("../content/docs/trading/margin-leverage.mdx?collection=docs"), "trading/perpetual-futures-101.mdx": () => import("../content/docs/trading/perpetual-futures-101.mdx?collection=docs"), }),
};
export default browserCollections;