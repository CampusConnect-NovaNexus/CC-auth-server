import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { login, refreshToken, register, validateToken } from './services/authGrpcServices';
import { ProtoGrpcType } from './proto/a';
import { AuthServiceHandlers } from './proto/AuthService';

const PORT = process.env.GRPC_PORT || 50051;

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

const bindAddress = `0.0.0.0:${PORT}`;
console.log(`Binding gRPC server to ${bindAddress}`);

server.bindAsync(
  bindAddress,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind gRPC server:', err);
      return;
    }
    console.log(`Server successfully bound to port ${port}`);
    server.start();
  }
);

