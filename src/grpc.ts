import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { login, refreshToken, register, validateToken } from './services/authGrpcServices';
import { ProtoGrpcType } from './proto/a';
import { AuthServiceHandlers } from './proto/AuthService';

import express from 'express';

const PORT = process.env.PORT || 50051;
const HTTP_PORT = process.env.HTTP_PORT || 5500;

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../a.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const handlers: AuthServiceHandlers = {
  Register: (call, callback) => {
    try {
      register(call, callback);
    } catch (error) {
      console.error('Register handler error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error',
      });
    }
  },
  Login: (call, callback) => {
    try {
      login(call, callback);
    } catch (error) {
      console.error('Login handler error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error',
      });
    }
  },
  ValidateToken: (call, callback) => {
    try {
      validateToken(call, callback);
    } catch (error) {
      console.error('ValidateToken handler error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error',
      });
    }
  }, 
  RefreshToken: (call, callback) => {
    try {
      refreshToken(call, callback);
    } catch (error) {
      console.error('RefreshToken handler error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error',
      });
    }
  },
};

const server = new grpc.Server();

server.addService((personProto.AuthService).service, handlers);
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server started, listening on port 50051');
    server.start();
});

const app = express();
app.get('/', (req: express.Request, res: express.Response): void => {
  res.json({
    message: 'gRPC server is running'
  });
});
app.listen(HTTP_PORT, () => {
  console.log(`HTTP health check server running on port ${HTTP_PORT}`);
});
