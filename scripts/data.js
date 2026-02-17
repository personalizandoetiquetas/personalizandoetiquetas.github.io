export let PRODUCTS_DATA = [];
export let CATEGORIES = [];
export let WHATSAPP_NUMBER = "";
export let ACTIVE_CATEGORY = "";

export async function loadData() {
    const response = await fetch('products.json');
    const data = await response.json();

    PRODUCTS_DATA = data.PRODUCTS_DATA;
    CATEGORIES = data.CATEGORIES;
    WHATSAPP_NUMBER = data.WHATSAPP_NUMBER;
    ACTIVE_CATEGORY = data.ACTIVE_CATEGORY;
}