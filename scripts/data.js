export let PRODUCTS_DATA        = [];
export let CATEGORIES           = [];
export let WHATSAPP_NUMBER      = "";
export let ACTIVE_CATEGORY      = "";
export let FEATURED_PRODUCT_ID  = null;

export async function loadData() {
    const response = await fetch('/products.json');
    const data     = await response.json();

    PRODUCTS_DATA       = data.PRODUCTS_DATA;
    CATEGORIES          = data.CATEGORIES;
    WHATSAPP_NUMBER     = data.WHATSAPP_NUMBER;
    ACTIVE_CATEGORY     = data.ACTIVE_CATEGORY;
    FEATURED_PRODUCT_ID = data.FEATURED_PRODUCT_ID ?? null;
}
