import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`🚀 Admin server running on http://localhost:${PORT}`);
});