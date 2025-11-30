import app from './app';

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`wallet-assets-service listening on port ${PORT}`);
});
