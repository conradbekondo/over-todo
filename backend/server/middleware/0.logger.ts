export default defineEventHandler((event) => {
  const start = Date.now();
  const logger = useLogger(event);
  const ip = getRequestIP(event);
  event.node.res.addListener("finish", () => {
    const end = Date.now();
    const diff = end - start;
    const msg = `${event.method} ${event.context.matchedRoute?.path} -> ${event.node.res.statusCode} (${diff}ms)`;
    if (event.node.res.statusCode < 400) {
      logger.info(msg);
    } else if (event.node.res.statusCode < 500) {
      logger.warn(msg);
    } else {
      logger.error(msg);
    }
  });
});
