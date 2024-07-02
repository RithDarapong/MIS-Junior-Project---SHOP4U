import { error } from "@sveltejs/kit";
/** @type {import('./$types').PageLoad} */ export function load({ params }) {
    if (params.id) {
        return { product_id: params.id };
    }
    error(404, "Not found");
}
