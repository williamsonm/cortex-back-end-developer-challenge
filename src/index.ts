import express from 'express';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
