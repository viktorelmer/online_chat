import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ChannelsRoute from './routes/channels.route';
import MessagesRoute from './routes/message.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new ChannelsRoute(), new MessagesRoute()]);

app.listen();
