// Server-only. Thin GraphQL wrapper around the Shopify Admin API, authorized
// via the client_credentials token from adminAuth.ts. Never import this from
// a client component.

import { getAdminAccessToken } from './adminAuth';

const API_VERSION = '2025-01';

function getStoreDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not set. See .env.local.example.');
  }
  return domain;
}

async function adminGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const accessToken = await getAdminAccessToken();
  const res = await fetch(`https://${getStoreDomain()}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Shopify Admin API request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new Error(`Shopify Admin API returned errors: ${JSON.stringify(json.errors)}`);
  }
  if (!json.data) {
    throw new Error('Shopify Admin API returned no data.');
  }
  return json.data;
}

export type DraftOrderLineItemInput =
  | { variantId: string; quantity: number }
  | {
      // Attached to a real product variant so it counts toward inventory and
      // per-product sales reporting. `priceOverride` (not `originalUnitPrice`,
      // which Shopify silently ignores once variantId is set) is what makes
      // the charged price the one we computed server-side rather than the
      // variant's catalog price.
      variantId: string;
      quantity: number;
      priceOverride: { amount: string; currencyCode: string };
      customAttributes?: { key: string; value: string }[];
    };

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation DraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function draftOrderCreate(input: {
  lineItems: DraftOrderLineItemInput[];
  note?: string;
}): Promise<{ id: string; invoiceUrl: string }> {
  const data = await adminGraphQL<{
    draftOrderCreate: {
      draftOrder: { id: string; invoiceUrl: string } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  }>(DRAFT_ORDER_CREATE_MUTATION, { input });

  const { draftOrder, userErrors } = data.draftOrderCreate;
  if (userErrors.length > 0) {
    throw new Error(`Shopify draftOrderCreate failed: ${userErrors.map((e) => e.message).join('; ')}`);
  }
  if (!draftOrder) {
    throw new Error('Shopify draftOrderCreate returned no draft order.');
  }
  return draftOrder;
}
