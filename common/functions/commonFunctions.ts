export function logNavigationError(e: Error) {
    console.error("Navigation failed:" + e.message);
    console.info(e.stack);
}