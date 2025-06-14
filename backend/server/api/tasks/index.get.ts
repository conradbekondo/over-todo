export default defineEventHandler(async () => {
  const db = useDatabase();

  return { dialect: db.dialect };
});
